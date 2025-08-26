import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Employee, SalaryComponent, SalaryStructure } from '../types';
import { XIcon as CloseIcon, Trash2Icon } from './icons/Icons';

interface SalaryStructureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (employeeId: string, salaryStructure: SalaryStructure) => void;
    employee: Employee;
}

const SalaryStructureModal: React.FC<SalaryStructureModalProps> = ({ isOpen, onClose, onSave, employee }) => {
    const { t } = useTranslation();
    
    const [structure, setStructure] = useState<SalaryStructure>({
        payType: 'Monthly',
        monthlyRate: 0,
        hourlyRate: 0,
        overtimeRate: 0,
        allowances: [],
        deductions: [],
    });
    
    useEffect(() => {
        if (employee?.salaryStructure) {
            setStructure(employee.salaryStructure);
        } else {
             setStructure({
                payType: 'Monthly',
                monthlyRate: 0,
                hourlyRate: 0,
                overtimeRate: 0,
                allowances: [],
                deductions: [],
            });
        }
    }, [employee]);

    const salarySummary = useMemo(() => {
        const { payType, monthlyRate = 0, hourlyRate = 0, allowances = [], deductions = [] } = structure;
        const grossAllowances = allowances.reduce((sum, item) => sum + Number(item.amount), 0);
        const grossDeductions = deductions.reduce((sum, item) => sum + Number(item.amount), 0);

        let base = 0;
        let daily = 0;
        if (payType === 'Monthly') {
            base = monthlyRate;
            daily = monthlyRate / 22; // Assuming 22 working days
        } else {
            base = hourlyRate * 8 * 22; // Estimated monthly from hourly
            daily = hourlyRate * 8;
        }
        
        const grossPay = base + grossAllowances;
        const netPay = grossPay - grossDeductions;
        const weekly = daily * 5;

        return { daily, weekly, grossPay, netPay, totalDeductions: grossDeductions };
    }, [structure]);


    if (!isOpen) return null;

    const handleStructureChange = (field: keyof SalaryStructure, value: any) => {
        setStructure(prev => ({...prev, [field]: value}));
    }
    
    const handleComponentChange = (type: 'allowances' | 'deductions', index: number, field: 'name' | 'amount', value: string) => {
        const updatedComponents = [...structure[type]];
        updatedComponents[index] = { ...updatedComponents[index], [field]: field === 'amount' ? Number(value) : value };
        handleStructureChange(type, updatedComponents);
    };

    const addComponent = (type: 'allowances' | 'deductions') => {
        const newComponent = { name: '', amount: 0 };
        handleStructureChange(type, [...structure[type], newComponent]);
    };

    const removeComponent = (type: 'allowances' | 'deductions', index: number) => {
        const updatedComponents = structure[type].filter((_, i) => i !== index);
        handleStructureChange(type, updatedComponents);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(employee.id, structure);
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const commonInputClass = "mt-1 block w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                 <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('manage_salary')} for {employee.name}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 flex-grow overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Base Pay */}
                        <div className="p-4 border rounded-lg">
                             <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{t('base_pay')}</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={commonLabelClass}>{t('pay_type')}</label>
                                    <select value={structure.payType} onChange={e => handleStructureChange('payType', e.target.value)} className={commonInputClass}>
                                        <option value="Monthly">{t('monthly')}</option>
                                        <option value="Hourly">{t('hourly')}</option>
                                    </select>
                                </div>
                                {structure.payType === 'Monthly' ? (
                                    <div>
                                        <label className={commonLabelClass}>{t('monthly_rate')}</label>
                                        <input type="number" value={structure.monthlyRate || ''} onChange={e => handleStructureChange('monthlyRate', Number(e.target.value))} className={commonInputClass} />
                                    </div>
                                ) : (
                                    <div>
                                        <label className={commonLabelClass}>{t('hourly_rate')}</label>
                                        <input type="number" value={structure.hourlyRate || ''} onChange={e => handleStructureChange('hourlyRate', Number(e.target.value))} className={commonInputClass} />
                                    </div>
                                )}
                                <div className="md:col-span-2">
                                     <label className={commonLabelClass}>{t('overtime_rate_hourly')}</label>
                                     <input type="number" value={structure.overtimeRate || ''} onChange={e => handleStructureChange('overtimeRate', Number(e.target.value))} className={commonInputClass} />
                                </div>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Allowances */}
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{t('allowances')}</h4>
                                <div className="space-y-3">
                                    {structure.allowances.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input type="text" placeholder={t('item')} value={item.name} onChange={e => handleComponentChange('allowances', index, 'name', e.target.value)} className={commonInputClass + " mt-0"} />
                                            <input type="number" placeholder={t('amount')} value={item.amount} onChange={e => handleComponentChange('allowances', index, 'amount', e.target.value)} className={commonInputClass + " mt-0 w-28"} />
                                            <button type="button" onClick={() => removeComponent('allowances', index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><Trash2Icon className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addComponent('allowances')} className="text-sm font-medium text-blue-600 hover:underline">{t('add_allowance')}</button>
                                </div>
                            </div>
                            {/* Deductions */}
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{t('deductions')}</h4>
                                <div className="space-y-3">
                                    {structure.deductions.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input type="text" placeholder={t('item')} value={item.name} onChange={e => handleComponentChange('deductions', index, 'name', e.target.value)} className={commonInputClass + " mt-0"} />
                                            <input type="number" placeholder={t('amount')} value={item.amount} onChange={e => handleComponentChange('deductions', index, 'amount', e.target.value)} className={commonInputClass + " mt-0 w-28"} />
                                            <button type="button" onClick={() => removeComponent('deductions', index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><Trash2Icon className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addComponent('deductions')} className="text-sm font-medium text-blue-600 hover:underline">{t('add_deduction')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                     {/* Summary */}
                    <div className="lg:col-span-1 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3 h-fit">
                        <h4 className="font-bold text-lg text-center mb-2 text-gray-800 dark:text-white">{t('salary_summary')}</h4>
                        <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t('daily_rate')}</span><span className="font-semibold">{currencyFormatter.format(salarySummary.daily)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{t('weekly_rate')}</span><span className="font-semibold">{currencyFormatter.format(salarySummary.weekly)}</span></div>
                        <div className="flex justify-between text-sm pt-2 border-t mt-2"><span className="text-gray-500 dark:text-gray-400">{t('estimated_gross_pay')}</span><span className="font-semibold">{currencyFormatter.format(salarySummary.grossPay)}</span></div>
                        <div className="flex justify-between text-sm text-red-600"><span className="">{t('total_deductions')}</span><span className="font-semibold">-{currencyFormatter.format(salarySummary.totalDeductions)}</span></div>
                        <div className="flex justify-between text-base font-bold pt-2 border-t mt-2"><span className="">{t('estimated_net_pay')}</span><span className="text-green-600">{currencyFormatter.format(salarySummary.netPay)}</span></div>
                    </div>
                </div>
                 <div className="flex justify-end items-center p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    )
};

export default SalaryStructureModal;
