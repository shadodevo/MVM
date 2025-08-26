import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { NavItem, CustomTable } from '../types';
import { PlusIcon, XIcon, Trash2Icon, GridIcon } from '../components/icons/Icons';

// Modal for adding/editing a custom page
const CustomPageModal = ({ isOpen, onClose, onSave, item }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [pluralName, setPluralName] = useState('');

    useEffect(() => {
        if (item) {
            setName(item.name);
            setPluralName(item.pluralName)
        } else {
            setName('');
            setPluralName('');
        }
    }, [item, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !pluralName) return;
        onSave({ name, pluralName });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item ? t('edit_page') : t('add_page')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Table Name (Singular)*</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Equipment"
                            className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Table Name (Plural)*</label>
                        <input
                            type="text"
                            value={pluralName}
                            onChange={(e) => setPluralName(e.target.value)}
                            placeholder="e.g., Equipments"
                            className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                     <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};


const CustomPagesSettingsPage = () => {
    const { t } = useTranslation();
    const { navItems, setNavItems, customTables, setCustomTables, setCustomTableData } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CustomTable | null>(null);

    const handleOpenModal = (item: CustomTable | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const handleSave = (data: { name: string, pluralName: string }) => {
        if (editingItem) {
            // Edit existing
            setCustomTables(prev => prev.map(t => t.id === editingItem.id ? { ...t, name: data.name, pluralName: data.pluralName } : t));
            setNavItems(prev => prev.map(item => item.id === editingItem.id ? { ...item, labelKey: data.pluralName } : item));
        } else {
            // Add new
            const id = `custom_table_${data.name.toLowerCase().replace(/\s+/g, '_')}`;
            const newTable: CustomTable = { id, ...data, icon: GridIcon };
            const newNavItem: NavItem = {
                id,
                labelKey: data.pluralName,
                icon: GridIcon,
                visible: true,
                isCustom: true,
            };
            
            setCustomTables(prev => [...prev, newTable]);
            setNavItems(prev => [...prev, newNavItem]);
            setCustomTableData(prev => ({...prev, [id]: [] }));
        }
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm('Are you sure you want to delete this custom table? All associated data will be lost.')) {
            setNavItems(prev => prev.filter(item => item.id !== id));
            setCustomTables(prev => prev.filter(t => t.id !== id));
            setCustomTableData(prev => {
                const newData = {...prev};
                delete newData[id];
                return newData;
            });
        }
    };

    return (
        <div className="p-6">
            <CustomPageModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} item={editingItem} />
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('custom_pages')}</h3>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    <PlusIcon className="w-5 h-5"/>
                    {t('add_page')}
                </button>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('custom_pages_desc')}</p>
                 <div className="space-y-3">
                    {customTables.length > 0 ? customTables.map(item => (
                        <div key={item.id} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg flex items-center gap-4">
                            <GridIcon className="w-5 h-5 text-gray-500" />
                            <span className="flex-grow font-medium text-gray-800 dark:text-white">{item.pluralName}</span>
                            <div className="flex items-center gap-4">
                                <button onClick={() => handleOpenModal(item)} className="text-sm font-medium text-blue-600 hover:underline">{t('edit')}</button>
                                <button onClick={() => handleDelete(item.id)} className="p-1 text-red-500 hover:text-red-700"><Trash2Icon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center py-8 text-gray-500 dark:text-gray-400">{t('no_custom_pages')}</p>
                    )}
                 </div>
             </div>
        </div>
    );
};

export default CustomPagesSettingsPage;