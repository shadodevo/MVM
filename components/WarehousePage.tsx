import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { WarehouseItem, Project } from '../types';
import { SearchIcon, MoreVerticalIcon, UploadCloudIcon, DownloadIcon, ArchiveIcon, PlusIcon, XIcon as CloseIcon, Trash2Icon } from './icons/Icons';
import { exportToCsv } from '../lib/utils';
import PrintSticker from './PrintSticker';

const AddWarehouseItemModal = ({ isOpen, onClose, onSave, itemToEdit }) => {
    const { t } = useTranslation();
    const { vendors, projects, warehouseItems, employees } = useApp();

    const defaultInitialState = useMemo(() => ({
        clientName: '',
        vendorId: vendors[0]?.id || '',
        collectionNames: [''],
        numberOfCarpets: 0,
        entryDate: '',
        exitDate: '',
        receivedById: employees[0]?.id || '',
    }), [vendors, employees]);

    const [formData, setFormData] = useState(defaultInitialState);
    const [linkedProjectId, setLinkedProjectId] = useState<string | null>(null);

    // Import from Project State
    const [importQuery, setImportQuery] = useState('');
    const [isImportDropdownOpen, setIsImportDropdownOpen] = useState(false);
    const importRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setFormData({
                    clientName: itemToEdit.clientName,
                    vendorId: itemToEdit.vendorId,
                    collectionNames: itemToEdit.collectionNames && itemToEdit.collectionNames.length > 0 ? itemToEdit.collectionNames : [''],
                    numberOfCarpets: itemToEdit.numberOfCarpets,
                    entryDate: itemToEdit.entryDate,
                    exitDate: itemToEdit.exitDate,
                    receivedById: itemToEdit.receivedById || employees[0]?.id || '',
                });
                setLinkedProjectId(itemToEdit.projectId || null);
            } else {
                setFormData(defaultInitialState);
                setLinkedProjectId(null);
            }
            setImportQuery('');
        }
    }, [isOpen, itemToEdit, defaultInitialState, employees]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (importRef.current && !importRef.current.contains(event.target as Node)) {
                setIsImportDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [importRef]);

    if (!isOpen) return null;
    
    const availableProjects = projects.filter(p => 
        !warehouseItems.some(wh => wh.projectId === p.id) &&
        (p.name.toLowerCase().includes(importQuery.toLowerCase()) || 
         p.projectCode.toLowerCase().includes(importQuery.toLowerCase()))
    );
    
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newItemData: Omit<WarehouseItem, 'id' | 'customFieldData' | 'projectId'> = {
            clientName: formData.clientName,
            vendorId: formData.vendorId,
            collectionNames: formData.collectionNames.filter(name => name.trim() !== ''),
            numberOfCarpets: formData.numberOfCarpets,
            entryDate: formData.entryDate,
            exitDate: formData.exitDate,
            receivedById: formData.receivedById,
        };
        onSave(newItemData, linkedProjectId);
    };

    const handleSelectProject = (project: Project) => {
        const totalCarpets = (project.quantities?.normal || 0) + (project.quantities?.round || 0) + (project.quantities?.runner || 0);
        setFormData({
            clientName: project.client,
            vendorId: project.vendorId || (vendors[0]?.id || ''),
            collectionNames: project.collectionNames?.length ? project.collectionNames : [''],
            numberOfCarpets: totalCarpets,
            entryDate: project.startDate || '',
            exitDate: project.deadline || '',
            receivedById: employees[0]?.id || '',
        });
        setLinkedProjectId(project.id);
        setIsImportDropdownOpen(false);
        setImportQuery('');
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).type === 'number' ? parseInt(value) || 0 : value }));
    }

    const handleCollectionNameChange = (index: number, value: string) => {
        const newCollectionNames = [...formData.collectionNames];
        newCollectionNames[index] = value;
        setFormData(prev => ({ ...prev, collectionNames: newCollectionNames }));
    };

    const addCollectionName = () => setFormData(prev => ({ ...prev, collectionNames: [...prev.collectionNames, '']}));
    const removeCollectionName = (index: number) => {
        if (formData.collectionNames.length > 1) {
            setFormData(prev => ({ ...prev, collectionNames: prev.collectionNames.filter((_, i) => i !== index) }));
        }
    };

    const commonInputClass = "mt-1 w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl">
                 <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{itemToEdit ? t('edit_warehouse_item') : t('add_warehouse_item')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div ref={importRef} className="relative">
                        <label className={commonLabelClass}>{t('import_from_project')}</label>
                        <input 
                            type="text" 
                            placeholder={t('start_typing_to_search')}
                            value={importQuery}
                            onChange={e => { setImportQuery(e.target.value); setIsImportDropdownOpen(true); }}
                            onFocus={() => setIsImportDropdownOpen(true)}
                            className={commonInputClass}
                        />
                         {isImportDropdownOpen && (
                            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 max-h-48 overflow-y-auto">
                                {availableProjects.length > 0 ? (
                                    <ul>
                                        {availableProjects.map(project => (
                                            <li key={project.id} onClick={() => handleSelectProject(project)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-700 last:border-b-0">
                                                <p className="font-semibold">{project.name} ({project.projectCode})</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('client')}: {project.client}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                     <div className="p-3 text-sm text-center text-gray-500">{t('no_projects_to_import')}</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={commonLabelClass}>{t('client_name')} *</label>
                            <input name="clientName" value={formData.clientName} onChange={handleInputChange} type="text" className={commonInputClass} required />
                        </div>
                        <div>
                            <label className={commonLabelClass}>{t('vendor_name')} *</label>
                             <select name="vendorId" value={formData.vendorId} onChange={handleInputChange} className={commonInputClass} required>
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {formData.collectionNames.map((name, index) => (
                        <div key={index}>
                            <label className={commonLabelClass}>{t('collection_name')} #{index + 1}</label>
                            <div className="flex items-center gap-2">
                                <input type="text" value={name} onChange={(e) => handleCollectionNameChange(index, e.target.value)} className={commonInputClass} />
                                {formData.collectionNames.length > 1 && <button type="button" onClick={() => removeCollectionName(index)} className="mt-1 p-2 bg-red-100 text-red-700 rounded-lg">&times;</button>}
                            </div>
                        </div>
                     ))}
                     <button type="button" onClick={addCollectionName} className="text-sm text-blue-600 hover:underline">{t('add_another_collection')}</button>
                    
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div>
                            <label className={commonLabelClass}>{t('number_of_carpets')} *</label>
                            <input name="numberOfCarpets" value={formData.numberOfCarpets} onChange={handleInputChange} type="number" className={commonInputClass} required />
                        </div>
                        <div>
                           <label className={commonLabelClass}>{t('received_by')} *</label>
                           <select name="receivedById" value={formData.receivedById} onChange={handleInputChange} className={commonInputClass} required>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={commonLabelClass}>{t('entry_date')} *</label>
                            <input name="entryDate" value={formData.entryDate} onChange={handleInputChange} type="date" className={commonInputClass} required />
                        </div>
                         <div>
                            <label className={commonLabelClass}>{t('exit_date')} *</label>
                            <input name="exitDate" value={formData.exitDate} onChange={handleInputChange} type="date" className={commonInputClass} required />
                        </div>
                     </div>
                </div>
                <div className="flex justify-end items-center p-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    )
};


const WarehousePage: React.FC = () => {
    const { t } = useTranslation();
    const { warehouseItems, setWarehouseItems, vendors, projects, employees } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const importInputRef = useRef<HTMLInputElement>(null);
    const [modalKey, setModalKey] = useState(0);
    const [actionMenu, setActionMenu] = useState<string | null>(null);
    const [itemToEdit, setItemToEdit] = useState<WarehouseItem | null>(null);
    const [itemToPrint, setItemToPrint] = useState<any | null>(null);

    const handleOpenModal = (item: WarehouseItem | null = null) => {
        setItemToEdit(item);
        setModalKey(prev => prev + 1);
        setIsModalOpen(true);
        setActionMenu(null);
    };

    const warehouseDisplayData = useMemo(() => {
        return warehouseItems.map(item => {
            const vendor = vendors.find(v => v.id === item.vendorId);
            const project = projects.find(p => p.id === item.projectId);
            const receivedBy = employees.find(e => e.id === item.receivedById);

            return {
                ...item,
                vendorName: vendor?.name || '-',
                projectCode: project?.projectCode || '-',
                projectName: project?.name || '-',
                status: item.projectId ? t('in_project') : t('in_warehouse'),
                receivedByName: receivedBy?.name || '-',
            };
        });
    }, [warehouseItems, vendors, projects, t, employees]);

    const filteredData = useMemo(() => {
        return warehouseDisplayData.filter(item =>
            item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.collectionNames.join(', ').toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.projectName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [warehouseDisplayData, searchQuery]);
    
    const handleSaveItem = (itemData: Omit<WarehouseItem, 'id' | 'customFieldData' | 'projectId'>, linkedProjectId: string | null) => {
        if (itemToEdit) {
            const updatedItem: WarehouseItem = {
                ...itemToEdit,
                ...itemData,
                projectId: linkedProjectId,
            };
            setWarehouseItems(prev => prev.map(item => item.id === itemToEdit.id ? updatedItem : item));
        } else {
            const newItem: WarehouseItem = {
                id: `wh_${Date.now()}`,
                projectId: linkedProjectId,
                ...itemData,
            };
            setWarehouseItems(prev => [...prev, newItem]);
        }
        setIsModalOpen(false);
        setItemToEdit(null);
    };
    
    const handleDeleteItem = (itemId: string) => {
        setActionMenu(null);
        if (window.confirm(t('are_you_sure_delete_item'))) {
            setWarehouseItems(prevItems => prevItems.filter(item => item.id !== itemId));
            alert(t('item_deleted_successfully'));
        }
    };

    const handleImportClick = () => {
        importInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            alert(`File "${file.name}" selected for import. (This is a simulation)`);
        }
    };

    const handleExport = () => {
        exportToCsv('warehouse_data.csv', filteredData);
    };

    return (
        <div className="p-6 space-y-6">
            <AddWarehouseItemModal 
                key={modalKey}
                isOpen={isModalOpen} 
                onClose={() => { setIsModalOpen(false); setItemToEdit(null); }} 
                onSave={handleSaveItem} 
                itemToEdit={itemToEdit}
            />
            <input
                type="file"
                ref={importInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileImport}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('warehouse')}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                     <div className="relative">
                        <SearchIcon className="absolute top-1/2 left-3 rtl:left-auto rtl:right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 ps-10 pe-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        <UploadCloudIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline text-sm font-medium">{t('import')}</span>
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        <DownloadIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline text-sm font-medium">{t('export')}</span>
                    </button>
                     <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5"/>
                        <span className="text-sm font-medium">{t('add_item')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('client_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('vendor_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('collection_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('number_of_carpets')}</th>
                                <th scope="col" className="py-3 px-6">{t('received_by')}</th>
                                <th scope="col" className="py-3 px-6">{t('entry_date')}</th>
                                <th scope="col" className="py-3 px-6">{t('exit_date')}</th>
                                <th scope="col" className="py-3 px-6">{t('project_code')}</th>
                                <th scope="col" className="py-3 px-6">{t('project_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('status')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => (
                                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                                                <ArchiveIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="font-medium text-gray-800 dark:text-white">{item.clientName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">{item.vendorName}</td>
                                    <td className="py-4 px-6">{item.collectionNames.join(', ')}</td>
                                    <td className="py-4 px-6">{item.numberOfCarpets}</td>
                                    <td className="py-4 px-6">{item.receivedByName}</td>
                                    <td className="py-4 px-6">{item.entryDate}</td>
                                    <td className="py-4 px-6">{item.exitDate}</td>
                                    <td className="py-4 px-6 font-mono">{item.projectCode}</td>
                                    <td className="py-4 px-6">{item.projectName}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.projectId ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center relative">
                                        <button onClick={() => setActionMenu(actionMenu === item.id ? null : item.id)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <MoreVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>
                                        {actionMenu === item.id && (
                                            <div className="absolute right-8 top-10 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 py-1">
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleOpenModal(item); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('edit')}</a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); setActionMenu(null); setItemToPrint(item); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('print')}</a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteItem(item.id); }} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">{t('delete')}</a>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             {itemToPrint && (
                <PrintSticker
                    item={itemToPrint}
                    onDonePrinting={() => setItemToPrint(null)}
                />
            )}
        </div>
    );
};

export default WarehousePage;