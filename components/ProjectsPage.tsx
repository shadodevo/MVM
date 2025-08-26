import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Project, WarehouseItem, Customer, Employee } from '../types';
import { PlusIcon, SearchIcon, MoreVerticalIcon, XIcon as CloseIcon, UploadCloudIcon, DownloadIcon, CheckIcon } from './icons/Icons';
import ProjectDetailView from './ProjectDetailView';
import { calculateProjectStats } from '../lib/utils';
import { exportToCsv } from '../lib/utils';


const RichTextEditor = ({ label, name, value, onChange }) => {
    const { t } = useTranslation();
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t(label)}</label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-md">
                <div className="p-2 border-b border-gray-300 dark:border-gray-600 flex gap-2 items-center">
                    <button type="button" className="font-bold w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700">B</button>
                    <button type="button" className="italic w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700">I</button>
                    <button type="button" className="underline w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700">U</button>
                </div>
                <textarea name={name} rows={4} value={value} onChange={onChange} className="w-full p-2 bg-transparent focus:outline-none"></textarea>
            </div>
        </div>
    );
};

const EditableStyleGroup = ({ titleKey, initialOptions, value = [], onChange }) => {
    const { t } = useTranslation();
    const [options, setOptions] = useState(initialOptions);
    const [newOption, setNewOption] = useState('');

    const handleAddOption = () => {
        if (newOption.trim() && !options.includes(newOption.trim())) {
            setOptions([...options, newOption.trim()]);
            setNewOption('');
        }
    };

    const handleDeleteOption = (optionToDelete) => {
        setOptions(options.filter(opt => opt !== optionToDelete));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: option, checked } = e.target;
        onChange(titleKey, option, checked);
    };

    return (
        <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h5 className="font-semibold mb-2 text-gray-800 dark:text-white">{t(titleKey)}</h5>
            <div className="space-y-2 max-h-32 overflow-y-auto">
                {options.map(opt => (
                    <div key={opt} className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input 
                                type="checkbox" 
                                value={opt} 
                                checked={value.includes(opt)}
                                onChange={handleCheckboxChange}
                                className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span>{t(opt)}</span>
                        </label>
                        <button type="button" onClick={() => handleDeleteOption(opt)} className="text-gray-400 hover:text-red-500">
                            <CloseIcon className="w-3 h-3"/>
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-2">
                <input 
                    type="text" 
                    value={newOption}
                    onChange={e => setNewOption(e.target.value)}
                    placeholder={t('add') + '...'}
                    className="flex-grow bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button type="button" onClick={handleAddOption} className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-sm rounded-md">{t('add')}</button>
            </div>
        </div>
    );
}

const AddProjectModal = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
    const { projects, employees, customers, setCustomers, currencies, vendors, departments, warehouseItems, setWarehouseItems, currentUser } = useApp();
    
    const initialFormData: Partial<Project> = useMemo(() => ({
        collectionNames: [''],
        quantities: { normal: 0, round: 0, runner: 0, video: 0 },
        styles: { normalSize: [], round: [], runner: [], styleLife: [], video: [] },
        department: [],
        members: [],
    }), []);

    const [formData, setFormData] = useState<Partial<Project>>(initialFormData);
    const [noDeadline, setNoDeadline] = useState(false);
    const [linkedWarehouseItemId, setLinkedWarehouseItemId] = useState<string | null>(null);
    const [detailedBreakdown, setDetailedBreakdown] = useState<{label: string, count: number}[]>([]);
    const [grandTotal, setGrandTotal] = useState(0);


    // Import from Warehouse State
    const [importQuery, setImportQuery] = useState('');
    const [isImportDropdownOpen, setIsImportDropdownOpen] = useState(false);
    const importRef = useRef<HTMLDivElement>(null);

    // Member selection state
    const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
    const [memberSearch, setMemberSearch] = useState('');
    const memberRef = useRef<HTMLDivElement>(null);

    const canSeeMediaBreakdown = useMemo(() => ['Admin', 'Project Manager'].includes(currentUser?.userRole || ''), [currentUser]);

    const nextProjectCode = `PRJ-${String(projects.length + 1).padStart(3, '0')}`;
    
    useEffect(() => {
        setFormData(initialFormData);
        setNoDeadline(false);
        setLinkedWarehouseItemId(null);
        setImportQuery('');
    }, [initialFormData]);

    const availableMembers = useMemo(() => {
        if (!formData.department || formData.department.length === 0) {
            return employees;
        }
        return employees.filter(emp => formData.department?.includes(emp.department));
    }, [employees, formData.department]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (importRef.current && !importRef.current.contains(event.target as Node)) {
                setIsImportDropdownOpen(false);
            }
            if (memberRef.current && !memberRef.current.contains(event.target as Node)) {
                setIsMemberDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [importRef, memberRef]);

    useEffect(() => {
        const breakdown: { label: string, count: number }[] = [];
        let grandTotalCount = 0;

        const { quantities, styles } = formData;
        const normalQty = quantities?.normal || 0;
        const roundQty = quantities?.round || 0;
        const runnerQty = quantities?.runner || 0;
        const videoQty = quantities?.video || 0;
        
        // Photos
        if (normalQty > 0) {
            (styles?.normalSize || []).forEach(style => {
                breakdown.push({ label: `${t('normal_size')} - ${t(style)}`, count: normalQty });
                grandTotalCount += normalQty;
            });
        }
        if (roundQty > 0) {
            (styles?.round || []).forEach(style => {
                breakdown.push({ label: `${t('round')} - ${t(style)}`, count: roundQty });
                grandTotalCount += roundQty;
            });
        }
        if (runnerQty > 0) {
            (styles?.runner || []).forEach(style => {
                breakdown.push({ label: `${t('runner')} - ${t(style)}`, count: runnerQty });
                grandTotalCount += runnerQty;
            });
        }
        (styles?.styleLife || []).forEach(style => {
            breakdown.push({ label: `${t('style_life')} - ${t(style)}`, count: 1 });
            grandTotalCount += 1;
        });

        // Videos
        if (videoQty > 0) {
            (styles?.video || []).forEach(style => {
                breakdown.push({ label: `${t('video')} - ${t(style)}`, count: videoQty });
                grandTotalCount += videoQty;
            });
        }

        // Sort to group by carpet type
        breakdown.sort((a, b) => a.label.localeCompare(b.label));

        setDetailedBreakdown(breakdown);
        setGrandTotal(grandTotalCount);

    }, [formData.quantities, formData.styles, t]);
    
    useEffect(() => {
        const availableMemberIds = availableMembers.map(m => m.id);
        const currentMembers = formData.members || [];
        const validMembers = currentMembers.filter(id => availableMemberIds.includes(id));
    
        if (validMembers.length !== currentMembers.length) {
            setFormData(prev => ({ ...prev, members: validMembers }));
        }
    }, [availableMembers, formData.members]);


    if (!isOpen) return null;

    const availableItems = warehouseItems.filter(item => 
        !item.projectId &&
        (item.clientName.toLowerCase().includes(importQuery.toLowerCase()) || 
         item.collectionNames.join(', ').toLowerCase().includes(importQuery.toLowerCase()))
    );
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
    };

     const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, department: selectedOptions }));
    };

    const handleMemberSelect = (employeeId: string) => {
        setFormData(prev => {
            const currentMembers = prev.members || [];
            const newMembers = currentMembers.includes(employeeId)
                ? currentMembers.filter(id => id !== employeeId)
                : [...currentMembers, employeeId];
            return { ...prev, members: newMembers };
        });
    };
    
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            quantities: { ...prev.quantities, [name]: parseInt(value) || 0 }
        }));
    };
    
    const handleStyleChange = (group: string, option: string, checked: boolean) => {
        let stateKey = group.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        if (stateKey === 'videoStyle') {
            stateKey = 'video';
        }
        setFormData(prev => {
            const currentStyles = prev.styles?.[stateKey] || [];
            const newStyles = checked
                ? [...currentStyles, option]
                : currentStyles.filter(item => item !== option);
            return {
                ...prev,
                styles: { ...prev.styles, [stateKey]: newStyles }
            };
        });
    };
    
    const handleCollectionNameChange = (index: number, value: string) => {
        const newCollections = [...(formData.collectionNames || [])];
        newCollections[index] = value;
        setFormData(prev => ({ ...prev, collectionNames: newCollections }));
    };

    const addCollectionName = () => {
        const newCollections = [...(formData.collectionNames || []), ''];
        setFormData(prev => ({ ...prev, collectionNames: newCollections }));
    };
    
    const removeCollectionName = (index: number) => {
        if ((formData.collectionNames?.length || 0) > 1) {
            const newCollections = (formData.collectionNames || []).filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, collectionNames: newCollections }));
        }
    };
    
    const handleSelectWarehouseItem = (item: WarehouseItem) => {
        const clientExists = customers.some(c => c.name === item.clientName);
        if (!clientExists) {
            const newCustomer: Customer = {
                id: `c_${Date.now()}`,
                name: item.clientName,
                email: 'imported@client.com', // Placeholder email
                status: 'Active',
                avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
                company: item.clientName,
            };
            setCustomers(prev => [...prev, newCustomer]);
        }

        setFormData({
            ...initialFormData,
            name: `${item.clientName} - ${item.collectionNames[0] || 'Project'}`,
            client: item.clientName,
            vendorId: item.vendorId,
            startDate: item.entryDate,
            deadline: item.exitDate,
            collectionNames: item.collectionNames,
            quantities: {
                ...initialFormData.quantities,
                normal: item.numberOfCarpets,
            }
        });
        setLinkedWarehouseItemId(item.id);
        setIsImportDropdownOpen(false);
        setImportQuery('');
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const totalCarpets = (formData.quantities?.normal || 0) + (formData.quantities?.round || 0) + (formData.quantities?.runner || 0);
        
        const selectedMembers = employees.filter(emp => formData.members?.includes(emp.id));
        const teamAvatars = selectedMembers.map(emp => ({ avatar: emp.avatar }));

        const newProject: Project = {
            id: `p_${Date.now()}`,
            projectCode: nextProjectCode,
            progress: 0,
            status: 'Pending',
            ...formData,
            name: formData.name || '',
            client: formData.client || '',
            deadline: noDeadline ? 'N/A' : formData.deadline || '',
            team: teamAvatars,
        };
        
        onSave(newProject, linkedWarehouseItemId, totalCarpets);
    };

    const normalSizeOptions = ["side", "flat", "corner", "close_up", "macro", "rolled", "corner_back", "room", "room_2", "corner_2", "detay", "detay_2", "rolled_2"];
    const roundOptions = ["side", "flat", "corner", "close_up", "macro", "kumpas", "bal", "rolled", "room", "corner_back", "room_2", "corner_2", "detay", "detay_2", "rolled_2"];
    const runnerOptions = ["side", "flat", "corner", "close_up", "macro", "rolled", "corner_back", "room", "room_2", "corner_2", "detay", "detay_2"];
    const styleLifeOptions = ["corner1"];
    const videoOptions = ["normal_video_clip", "city_life"];
    
    const searchedAndAvailableMembers = availableMembers.filter(e => e.name.toLowerCase().includes(memberSearch.toLowerCase()));
    const selectedMemberObjects = employees.filter(e => formData.members?.includes(e.id));


    const commonInputClass = "mt-1 block w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('add_project')}</h3>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <CloseIcon className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6 flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div ref={importRef} className="relative md:col-span-2">
                            <label className={commonLabelClass}>{t('import_from_warehouse')}</label>
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
                                    {availableItems.length > 0 ? (
                                        <ul>
                                            {availableItems.map(item => (
                                                <li key={item.id} onClick={() => handleSelectWarehouseItem(item)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-700 last:border-b-0">
                                                    <p className="font-semibold">{item.clientName} - {item.collectionNames.join(', ')}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('number_of_carpets')}: {item.numberOfCarpets}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-3 text-sm text-center text-gray-500">{t('no_items_in_warehouse')}</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={commonLabelClass}>{t('project_code')}</label>
                            <input type="text" value={nextProjectCode} className={commonInputClass + " bg-gray-200 dark:bg-gray-800 cursor-not-allowed"} disabled />
                        </div>
                         <div>
                            <label className={commonLabelClass}>{t('project_name')}*</label>
                            <input name="name" value={formData.name || ''} onChange={handleChange} type="text" placeholder={t('write_a_project_name')} className={commonInputClass + " flex-grow"} required/>
                        </div>

                        {(formData.collectionNames || []).map((name, index) => (
                            <div key={index}>
                                <label className={commonLabelClass}>{t('collection_name')} #{index + 1}</label>
                                <div className="flex items-center gap-2">
                                    <input type="text" value={name} onChange={(e) => handleCollectionNameChange(index, e.target.value)} className={commonInputClass} />
                                    {(formData.collectionNames?.length || 0) > 1 && <button type="button" onClick={() => removeCollectionName(index)} className="mt-1 p-2 bg-red-100 text-red-700 rounded-lg">&times;</button>}
                                </div>
                            </div>
                        ))}
                        <div className="md:col-span-2">
                            <button type="button" onClick={addCollectionName} className="text-sm text-blue-600 hover:underline">{t('add_another_collection')}</button>
                        </div>
                        
                        <div>
                            <label className={commonLabelClass}>{t('start_date')}*</label>
                            <input name="startDate" value={formData.startDate || ''} onChange={handleChange} type="date" className={commonInputClass} required/>
                        </div>
                        <div>
                            <label className={commonLabelClass}>{t('deadline')}</label>
                            <input name="deadline" value={formData.deadline || ''} onChange={handleChange} type="date" className={commonInputClass} disabled={noDeadline} />
                            <label className="flex items-center gap-2 mt-2 text-sm">
                                <input type="checkbox" checked={noDeadline} onChange={(e) => setNoDeadline(e.target.checked)} />
                                {t('there_is_no_project_deadline')}
                            </label>
                        </div>
                        <div>
                            <label className={commonLabelClass}>{t('client')}*</label>
                            <select name="client" value={formData.client || ''} onChange={handleChange} className={commonInputClass} required>
                                <option value="" disabled>Select a client</option>
                                {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={commonLabelClass}>{t('vendor')}</label>
                            <select name="vendorId" value={formData.vendorId || ''} onChange={handleChange} className={commonInputClass}>
                                <option value="">Nothing selected</option>
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className={commonLabelClass}>{t('department')}</label>
                            <select multiple name="department" value={formData.department || []} onChange={handleDepartmentChange} className={commonInputClass + " h-24"}>
                                {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={commonLabelClass}>{t('add_project_members')}</label>
                            <div className="relative" ref={memberRef}>
                                <button type="button" onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)} className="min-h-[44px] w-full text-left bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-2 flex flex-wrap gap-1.5">
                                    {selectedMemberObjects.length > 0 ? selectedMemberObjects.map(e => (
                                        <span key={e.id} className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                                            <img src={e.avatar} alt={e.name} className="w-4 h-4 rounded-full" />
                                            {e.name}
                                            <button onClick={(event) => { event.stopPropagation(); handleMemberSelect(e.id);}} className="text-blue-600 dark:text-blue-300">&times;</button>
                                        </span>
                                    )) : <span className="text-sm text-gray-500 px-2">{t('select')}...</span>}
                                </button>
                                 {isMemberDropdownOpen && (
                                     <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700">
                                         <div className="p-2 border-b dark:border-gray-700">
                                            <input type="text" placeholder={t('start_typing_to_search')} value={memberSearch} onChange={e => setMemberSearch(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2 text-sm" />
                                         </div>
                                         <ul className="max-h-48 overflow-y-auto p-2">
                                             {searchedAndAvailableMembers.map(e => (
                                                <li key={e.id} onClick={() => handleMemberSelect(e.id)} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                                     <div className="flex items-center gap-2">
                                                        <img src={e.avatar} alt={e.name} className="w-6 h-6 rounded-full" />
                                                        <span className="text-sm">{e.name}</span>
                                                     </div>
                                                     {formData.members?.includes(e.id) && <CheckIcon className="w-5 h-5 text-blue-600" />}
                                                </li>
                                             ))}
                                         </ul>
                                     </div>
                                )}
                            </div>
                        </div>

                         <div className="md:col-span-2">
                            <label className={commonLabelClass}>{t('quantities')}</label>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                 <div>
                                    <label className="text-xs text-gray-500">{t('normal_quantity')}</label>
                                    <input name="normal" value={formData.quantities?.normal || 0} onChange={handleQuantityChange} type="number" className={commonInputClass}/>
                                </div>
                                 <div>
                                    <label className="text-xs text-gray-500">{t('round_quantity')}</label>
                                    <input name="round" value={formData.quantities?.round || 0} onChange={handleQuantityChange} type="number" className={commonInputClass}/>
                                </div>
                                 <div>
                                    <label className="text-xs text-gray-500">{t('runner_quantity')}</label>
                                    <input name="runner" value={formData.quantities?.runner || 0} onChange={handleQuantityChange} type="number" className={commonInputClass}/>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">{t('video_quantity')}</label>
                                    <input name="video" value={formData.quantities?.video || 0} onChange={handleQuantityChange} type="number" className={commonInputClass}/>
                                </div>
                             </div>
                        </div>
                        {canSeeMediaBreakdown && (
                            <div className="md:col-span-2 mt-4 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg space-y-2">
                                <h4 className="font-bold text-lg text-blue-800 dark:text-blue-200 mb-2">{t('media_breakdown')}</h4>
                                {detailedBreakdown.length > 0 ? (
                                    <div className="max-h-48 overflow-y-auto pr-2 space-y-1">
                                        {detailedBreakdown.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center text-sm py-1 px-2 bg-white dark:bg-gray-800 rounded">
                                                <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                                                <span className="font-bold text-gray-900 dark:text-white">{item.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">{t('no_media_selected')}</p>
                                )}
                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-blue-200 dark:border-blue-800">
                                    <h4 className="font-bold text-lg text-blue-800 dark:text-blue-200">{t('grand_total')}</h4>
                                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{grandTotal}</span>
                                </div>
                            </div>
                        )}
                        <div className="md:col-span-2">
                            <RichTextEditor label="project_summary" name="summary" value={formData.summary || ''} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <EditableStyleGroup titleKey="normal_size" initialOptions={normalSizeOptions} value={formData.styles?.normalSize || []} onChange={handleStyleChange} />
                            <EditableStyleGroup titleKey="round" initialOptions={roundOptions} value={formData.styles?.round || []} onChange={handleStyleChange} />
                            <EditableStyleGroup titleKey="runner" initialOptions={runnerOptions} value={formData.styles?.runner || []} onChange={handleStyleChange} />
                            <EditableStyleGroup titleKey="style_life" initialOptions={styleLifeOptions} value={formData.styles?.styleLife || []} onChange={handleStyleChange} />
                            <EditableStyleGroup titleKey="video_style" initialOptions={videoOptions} value={formData.styles?.video || []} onChange={handleStyleChange} />
                        </div>
                    </div>

                </div>
                <div className="flex justify-end items-center p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};


const ProjectsPage: React.FC = () => {
    const { t } = useTranslation();
    const { projects, setProjects, vendors, customFields, modalRequest, setModalRequest, selectedProjectId, setSelectedProjectId, tasks, setWarehouseItems, customers, setCustomers, ...allData } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const importInputRef = useRef<HTMLInputElement>(null);
    const [modalKey, setModalKey] = useState(0);
    
    const selectedProject = projects.find(p => p.id === selectedProjectId);

    const handleOpenModal = () => {
        setModalKey(prev => prev + 1);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (modalRequest === 'add_project') {
            handleOpenModal();
            setModalRequest(null);
        }
    }, [modalRequest, setModalRequest]);
    
    const filteredProjects = useMemo(() => {
        return projects.filter(project =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [projects, searchQuery]);

    if (selectedProject) {
        return <ProjectDetailView project={selectedProject} onBack={() => setSelectedProjectId(null)} />;
    }

    const statusColors = {
        'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Pending': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    
    const handleSaveProject = (newProject: Project, linkedWarehouseItemId: string | null, totalCarpets: number) => {
        setProjects(prev => [...prev, newProject]);

        if (linkedWarehouseItemId) {
            setWarehouseItems(prev => prev.map(item => 
                item.id === linkedWarehouseItemId ? { ...item, projectId: newProject.id } : item
            ));
        } else {
            const newWarehouseItem: WarehouseItem = {
                id: `wh_${newProject.id}`,
                clientName: newProject.client,
                vendorId: newProject.vendorId || '',
                collectionNames: newProject.collectionNames || [],
                numberOfCarpets: totalCarpets,
                entryDate: newProject.startDate || '',
                exitDate: newProject.deadline,
                projectId: newProject.id,
            };
            setWarehouseItems(prev => [...prev, newWarehouseItem]);
        }
        setIsModalOpen(false);
    }
    
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
        const dataToExport = filteredProjects.map(({ team, customFieldData, ...rest }) => ({
            ...rest,
            team: team.map(t => t.avatar).join('; '), // Flatten team for CSV
        }));
        exportToCsv('projects.csv', dataToExport);
    };
    
    return (
        <div className="p-6 space-y-6">
             <AddProjectModal 
                key={modalKey}
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveProject}
             />
             <input
                type="file"
                ref={importInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileImport}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('all_projects')}</h2>
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
                    <button onClick={handleOpenModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5"/>
                        <span className="text-sm font-medium">{t('add_project')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('project_code')}</th>
                                <th scope="col" className="py-3 px-6">{t('project_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('collection_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('vendor')}</th>
                                <th scope="col" className="py-3 px-6">{t('client')}</th>
                                <th scope="col" className="py-3 px-6">{t('deadline')}</th>
                                <th scope="col" className="py-3 px-6">Team</th>
                                <th scope="col" className="py-3 px-6">{t('progress')}</th>
                                <th scope="col" className="py-3 px-6">{t('status')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project: Project) => {
                                const { progress, status } = calculateProjectStats(project, tasks);
                                const vendor = vendors.find(v => v.id === project.vendorId);
                                return (
                                <tr key={project.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6 font-mono">{project.projectCode}</td>
                                    <td className="py-4 px-6 font-medium text-gray-800 dark:text-white">
                                        <button onClick={() => setSelectedProjectId(project.id)} className="hover:underline text-left">
                                            {project.name}
                                        </button>
                                    </td>
                                    <td className="py-4 px-6">{project.collectionNames?.join(', ')}</td>
                                    <td className="py-4 px-6">{vendor?.name || '-'}</td>
                                    <td className="py-4 px-6">{project.client}</td>
                                    <td className="py-4 px-6">{project.deadline}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center -space-x-2">
                                            {project.team.map((member, i) => (
                                                <img key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src={member.avatar} alt="member" />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <span className="text-xs font-semibold">{progress}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
                                            {t(status.toLowerCase().replace(' ', '_'))}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <MoreVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;