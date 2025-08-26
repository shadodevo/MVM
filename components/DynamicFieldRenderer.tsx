import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { CustomField, CustomFieldModule, ModuleDataMap } from '../types';

interface DynamicFieldRendererProps {
    fields: CustomField[];
    data: Record<string, any>;
    setData: (fieldId: string, value: any) => void;
    moduleDataMap: ModuleDataMap;
}

const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({ fields, data, setData, moduleDataMap }) => {
    const { t } = useTranslation();

    const commonInputClass = "mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500";

    if (fields.length === 0) {
        return null;
    }

    const renderField = (field: CustomField) => {
        const label = `${field.label} ${field.required ? '*' : ''}`;

        switch (field.type) {
            case 'text':
            case 'number':
            case 'date':
                return (
                    <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                        <input 
                            type={field.type} 
                            value={data[field.id] || ''}
                            onChange={e => setData(field.id, e.target.value)}
                            className={commonInputClass}
                            required={field.required}
                        />
                    </div>
                );

            case 'textarea':
                return (
                    <div key={field.id} className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                        <textarea 
                            rows={3}
                            value={data[field.id] || ''}
                            onChange={e => setData(field.id, e.target.value)}
                            className={commonInputClass}
                            required={field.required}
                        />
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={field.id} className="flex items-center gap-2 pt-5">
                         <input 
                            type="checkbox"
                            id={field.id}
                            checked={!!data[field.id]}
                            onChange={e => setData(field.id, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={field.id} className="text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
                    </div>
                );

            case 'select':
            case 'multiselect':
                let options: { value: string; label: string }[] = [];
                if (field.relatedModule && moduleDataMap[field.relatedModule]) {
                    options = moduleDataMap[field.relatedModule].map(item => ({ value: item.id, label: item.name || item.title }));
                } else if (field.options) {
                    options = (field.options || []).map(opt => ({ value: opt, label: opt }));
                }

                if (field.type === 'select') {
                    return (
                        <div key={field.id}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                            <select
                                value={data[field.id] || ''}
                                onChange={e => setData(field.id, e.target.value)}
                                className={commonInputClass}
                                required={field.required}
                            >
                                <option value="">-- {t('select')} --</option>
                                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    );
                } else { // multiselect
                    return (
                         <div key={field.id} className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                            <select
                                multiple
                                value={data[field.id] || []}
                                onChange={e => {
                                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                    setData(field.id, selectedOptions);
                                }}
                                className={commonInputClass + " h-24"}
                                required={field.required}
                            >
                                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                         </div>
                    );
                }
            
            default:
                return null;
        }
    }


    return (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-bold mb-4">{t('custom_fields')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(field => renderField(field))}
            </div>
        </div>
    );
};

export default DynamicFieldRenderer;