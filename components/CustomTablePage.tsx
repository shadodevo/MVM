import React, { useState, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { CustomTable, CustomField } from '../types';
import { PlusIcon, SearchIcon, Trash2Icon, PencilIcon, XIcon } from './icons/Icons';
import DynamicFieldRenderer from './DynamicFieldRenderer';

const AddEditItemModal = ({ isOpen, onClose, onSave, fields, table, itemToEdit }) => {
    const { t } = useTranslation();
    const app = useApp();
    const [formData, setFormData] = useState<Record<string, any>>(itemToEdit || {});

    if (!isOpen) return null;

    const moduleDataMap = useMemo(() => ({
        ...app.customTableData,
        projects: app.projects,
        tasks: app.tasks,
        clients: app.customers,
        leads: app.deals.filter(d => d.stage === 'Lead'),
        products: app.products,
        contacts: app.contacts,
        deals: app.deals,
        warehouse: app.warehouseItems,
        vendors: app.vendors,
        employees: app.employees,
        leaves: app.leaveRequests,
        designation: app.designations,
        department: app.departments,
        contracts: app.contracts,
        proposal: app.proposals,
        estimates: app.estimates,
        invoices: app.invoices,
        payments: app.payments,
        credit_note: app.creditNotes,
        expenses: app.expenses,
        bank_account: app.bankAccounts,
        orders: app.orders,
        tickets: app.tickets,
        events: app.events,
        knowledge_base: app.knowledgeBaseArticles,
    }), [app]);


    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData(prev => ({...prev, [fieldId]: value}));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                 <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{itemToEdit ? `Edit ${table.name}` : `Add New ${table.name}`}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">
                   <DynamicFieldRenderer
                        fields={fields}
                        data={formData}
                        setData={handleFieldChange}
                        moduleDataMap={moduleDataMap as any}
                    />
                </div>
                <div className="flex justify-end items-center p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
         </div>
    );
};

interface CustomTablePageProps {
    tableId: string;
}

const CustomTablePage: React.FC<CustomTablePageProps> = ({ tableId }) => {
    const { t } = useTranslation();
    const { customTables, customFields, customTableData, setCustomTableData } = useApp();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<Record<string, any> | null>(null);

    const tableDef = useMemo(() => customTables.find(t => t.id === tableId), [customTables, tableId]);
    const fields = useMemo(() => customFields.filter(f => f.module === tableId), [customFields, tableId]);
    const data = useMemo(() => customTableData[tableId] || [], [customTableData, tableId]);

    const handleOpenModal = (item: Record<string, any> | null = null) => {
        setItemToEdit(item);
        setIsModalOpen(true);
    };

    const handleSaveItem = (itemData: Record<string, any>) => {
        let updatedData;
        if (itemToEdit) {
            updatedData = data.map(item => item.id === itemToEdit.id ? { ...item, ...itemData } : item);
        } else {
            const newItem = { id: `item_${Date.now()}`, ...itemData };
            updatedData = [...data, newItem];
        }
        setCustomTableData(prev => ({...prev, [tableId]: updatedData }));
        setIsModalOpen(false);
        setItemToEdit(null);
    };
    
    const handleDeleteItem = (itemId: string) => {
        if(window.confirm(`Are you sure you want to delete this item?`)) {
            const updatedData = data.filter(item => item.id !== itemId);
            setCustomTableData(prev => ({...prev, [tableId]: updatedData }));
        }
    };

    if (!tableDef) {
        return <div className="p-8 text-center">Table definition not found.</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <AddEditItemModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveItem}
                fields={fields}
                table={tableDef}
                itemToEdit={itemToEdit}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{tableDef.pluralName}</h2>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <PlusIcon className="w-5 h-5"/>
                    <span className="text-sm font-medium">Add New {tableDef.name}</span>
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                {fields.length > 0 ? (
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    {fields.map(field => <th key={field.id} scope="col" className="py-3 px-6">{field.label}</th>)}
                                    <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(item => (
                                    <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        {fields.map(field => (
                                            <td key={field.id} className="py-4 px-6">
                                                {typeof item[field.id] === 'boolean' ? (item[field.id] ? t('yes') : t('no')) : item[field.id]}
                                            </td>
                                        ))}
                                        <td className="py-4 px-6 text-center">
                                            <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full ml-2"><Trash2Icon className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500 dark:text-gray-400">No fields have been defined for this table yet.</p>
                        <p className="text-sm text-gray-400 mt-2">Go to Settings &gt; Custom Fields to add fields to the "{tableDef.pluralName}" table.</p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default CustomTablePage;