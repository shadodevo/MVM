
import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Deal, ModuleDataMap } from '../types';
import { PlusIcon, XIcon as CloseIcon } from './icons/Icons';
import DynamicFieldRenderer from './DynamicFieldRenderer';


const AddDealModal = ({ isOpen, onClose, onSave, moduleDataMap }) => {
    const { t } = useTranslation();
    const { customFields, customers } = useApp();
    const [customFieldData, setCustomFieldData] = useState({});

    if (!isOpen) return null;

    const leadsCustomFields = customFields.filter(f => f.module === 'leads');

    const handleCustomFieldChange = (fieldId: string, value: any) => {
        setCustomFieldData(prev => ({...prev, [fieldId]: value}));
    };
    
    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newDeal: Partial<Deal> = {
            id: `d_${Date.now()}`,
            title: formData.get('title') as string,
            value: parseFloat(formData.get('value') as string),
            customer: formData.get('customer') as string,
            stage: formData.get('stage') as Deal['stage'],
            customFieldData: customFieldData,
        };
        onSave(newDeal as Deal);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('add_deal')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('title')} *</label>
                            <input name="title" type="text" className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('value')} *</label>
                            <input name="value" type="number" placeholder={currencyFormatter.format(0)} className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('client')} *</label>
                            <select name="customer" className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required>
                                {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('stage')} *</label>
                            <select name="stage" className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required>
                                {['Lead', 'Contact Made', 'Proposal Sent', 'Won', 'Lost'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                     <DynamicFieldRenderer 
                        fields={leadsCustomFields}
                        data={customFieldData}
                        setData={handleCustomFieldChange}
                        moduleDataMap={moduleDataMap}
                    />
                </div>
                <div className="flex justify-end items-center p-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};


const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => {
    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-gray-800 dark:text-white">{deal.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{deal.customer}</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-2">{currencyFormatter.format(deal.value)}</p>
        </div>
    );
};

const KanbanColumn: React.FC<{ title: string, deals: Deal[], color: string }> = ({ title, deals, color }) => {
    const { t } = useTranslation();
    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

    return (
        <div className="flex-1 min-w-[300px] bg-gray-100 dark:bg-gray-900/50 rounded-xl p-4">
            <h3 className={`font-bold text-lg mb-4 pb-2 border-b-4 ${color}`}>{t(title)}</h3>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">{deals.length} Deals | {currencyFormatter.format(totalValue)}</div>
            <div className="space-y-4 h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
            </div>
        </div>
    );
};

const DealsPage: React.FC = () => {
    const { t } = useTranslation();
    const { deals, setDeals, ...allData } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stages = ['Lead', 'Contact Made', 'Proposal Sent', 'Won', 'Lost'];
    const stageColors = {
        'Lead': 'border-gray-400',
        'Contact Made': 'border-blue-500',
        'Proposal Sent': 'border-yellow-500',
        'Won': 'border-green-500',
        'Lost': 'border-red-500',
    };
    const dealsByStage = stages.reduce((acc, stage) => {
        acc[stage] = deals.filter(d => d.stage === stage);
        return acc;
    }, {} as Record<string, Deal[]>);
    
    const handleSaveDeal = (newDeal: Deal) => {
        setDeals(prev => [...prev, newDeal]);
        setIsModalOpen(false);
    }
    
    const moduleDataMap = Object.keys(allData).reduce((acc, key) => {
        if (key.endsWith('s')) {
            acc[key] = allData[key];
        }
        return acc;
    }, {} as ModuleDataMap);

    return (
        <div className="p-6 h-full flex flex-col">
            <AddDealModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveDeal}
                moduleDataMap={moduleDataMap}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Sales Pipeline</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <PlusIcon className="w-5 h-5"/>
                    <span className="text-sm font-medium">{t('add_deal')}</span>
                </button>
            </div>
            <div className="flex-grow flex gap-6 overflow-x-auto pb-4">
                {stages.map(stage => (
                     <KanbanColumn 
                        key={stage} 
                        title={stage.toLowerCase().replace(' ', '_')} 
                        deals={dealsByStage[stage]}
                        color={stageColors[stage]}
                     />
                ))}
            </div>
        </div>
    );
};

export default DealsPage;
