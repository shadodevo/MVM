import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Customer, CustomField, ModuleDataMap, Language, ModalRequest } from '../types';
import { PlusIcon, SearchIcon, MoreVerticalIcon, XIcon as CloseIcon, UploadCloudIcon, DownloadIcon } from './icons/Icons';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { exportToCsv } from '../lib/utils';

const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
);

const AddCustomerModal = ({ isOpen, onClose, onSave, moduleDataMap }) => {
    const { t } = useTranslation();
    const { customFields } = useApp();
    const [formData, setFormData] = useState<Partial<Customer>>({
        salutation: 'Mr',
        gender: 'Male',
        language: Language.EN,
        loginAllowed: true,
        emailNotifications: true,
        country: 'United Arab Emirates',
    });
    const [customFieldData, setCustomFieldData] = useState({});

    useEffect(() => {
        if (!isOpen) {
            // Reset form on close
            setFormData({
                salutation: 'Mr',
                gender: 'Male',
                language: Language.EN,
                loginAllowed: true,
                emailNotifications: true,
                country: 'United Arab Emirates',
            });
            setCustomFieldData({});
        }
    }, [isOpen]);
    

    if (!isOpen) return null;

    const customerCustomFields = customFields.filter(f => f.module === 'clients');

    const handleCustomFieldChange = (fieldId: string, value: any) => {
        setCustomFieldData(prev => ({...prev, [fieldId]: value}));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        if (e.target.files && e.target.files[0]) {
            // In a real app, you'd upload and get a URL. Here we just show the name.
            setFormData(prev => ({ ...prev, [name]: e.target.files![0].name }));
        }
    };
    
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newCustomer: Customer = {
            id: `c_${Date.now()}`,
            status: 'Active',
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
            name: formData.name || '',
            email: formData.email || '',
            company: formData.company || '',
            ...formData,
            customFieldData: customFieldData,
        };
        onSave(newCustomer);
    };

    const salutations = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'];
    const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'United Arab Emirates', 'Turkey', 'Saudi Arabia'];
    const clientCategories = ['Potential', 'VIP', 'Standard', 'Internal'];
    const commonInputClass = "mt-1 w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('add_customer')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-6 flex-grow overflow-y-auto">
                    {/* Account Details */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{t('account_details')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           <div>
                                <label className={commonLabelClass}>{t('salutation')}</label>
                                <select name="salutation" value={formData.salutation} onChange={handleChange} className={commonInputClass}>
                                    {salutations.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                           </div>
                           <div className="lg:col-span-2">
                                <label className={commonLabelClass}>{t('client_name')}*</label>
                                <input name="name" type="text" value={formData.name || ''} onChange={handleChange} placeholder="e.g. John Doe" className={commonInputClass} required/>
                           </div>
                            <div>
                                <label className={commonLabelClass}>{t('email')}*</label>
                                <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="e.g. johndoe@example.com" className={commonInputClass} required/>
                            </div>
                            <div>
                                <label className={commonLabelClass}>{t('customer_password')}*</label>
                                <input name="password" type="password" value={formData.password || ''} onChange={handleChange} placeholder="Must have at least 8 characters" className={commonInputClass} required/>
                             </div>
                             <div>
                                <label className={commonLabelClass}>{t('profile_picture')}</label>
                                <input type="file" onChange={(e) => handleFileChange(e, 'avatar')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                             </div>
                             <div>
                                <label className={commonLabelClass}>{t('mobile')}*</label>
                                <input name="mobile" type="tel" value={formData.mobile || ''} onChange={handleChange} placeholder="e.g. 1234567890" className={commonInputClass} required/>
                             </div>
                            <div>
                                <label className={commonLabelClass}>{t('country')}</label>
                                <select name="country" value={formData.country} onChange={handleChange} className={commonInputClass}>
                                     {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={commonLabelClass}>{t('gender')}</label>
                                <div className="mt-2 flex gap-4">
                                    <label className="flex items-center gap-2"><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange}/> {t('male')}</label>
                                    <label className="flex items-center gap-2"><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange}/> {t('female')}</label>
                                    <label className="flex items-center gap-2"><input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange}/> {t('other')}</label>
                                </div>
                            </div>
                            <div>
                                <label className={commonLabelClass}>{t('change_language')}</label>
                                <select name="language" value={formData.language} onChange={handleChange} className={commonInputClass}>
                                     <option value={Language.EN}>{t('english')}</option>
                                     <option value={Language.AR}>{t('arabic')}</option>
                                     <option value={Language.TR}>{t('turkish')}</option>
                                </select>
                            </div>
                            <div>
                                <label className={commonLabelClass}>{t('client_category')}</label>
                                <select name="category" value={formData.category} onChange={handleChange} className={commonInputClass}>
                                    {clientCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={commonLabelClass}>{t('client_sub_category')}</label>
                                <select name="subCategory" value={formData.subCategory} onChange={handleChange} className={commonInputClass}></select>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <label className={commonLabelClass}>{t('login_allowed')}</label>
                                <ToggleSwitch checked={formData.loginAllowed || false} onChange={e => handleToggleChange('loginAllowed', e.target.checked)}/>
                            </div>
                             <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <label className={commonLabelClass}>{t('receive_email_notifications')}</label>
                                <ToggleSwitch checked={formData.emailNotifications || false} onChange={e => handleToggleChange('emailNotifications', e.target.checked)}/>
                            </div>
                        </div>
                    </div>

                    {/* Company Details */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{t('company_details')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <label className={commonLabelClass}>{t('company_name')}</label>
                                <input name="company" type="text" value={formData.company || ''} onChange={handleChange} placeholder="e.g. Acme Corporation" className={commonInputClass}/>
                            </div>
                             <div>
                                <label className={commonLabelClass}>{t('customer_company_logo')}</label>
                                <input type="file" onChange={(e) => handleFileChange(e, 'companyLogo')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                             </div>
                            <div className="lg:col-span-3">
                                <label className={commonLabelClass}>{t('official_website')}</label>
                                <input name="website" type="url" value={formData.website || ''} onChange={handleChange} placeholder="e.g. https://www.example.com" className={commonInputClass}/>
                            </div>
                             <div>
                                <label className={commonLabelClass}>{t('tax_name')}</label>
                                <input name="taxName" type="text" value={formData.taxName || ''} onChange={handleChange} placeholder="e.g. GST/VAT" className={commonInputClass}/>
                             </div>
                             <div>
                                <label className={commonLabelClass}>{t('gst_vat_number')}</label>
                                <input name="gstNumber" type="text" value={formData.gstNumber || ''} onChange={handleChange} placeholder="e.g. 18AABCU960XXXXX" className={commonInputClass}/>
                             </div>
                              <div>
                                <label className={commonLabelClass}>{t('office_phone_number')}</label>
                                <input name="officePhone" type="tel" value={formData.officePhone || ''} onChange={handleChange} placeholder="e.g. 1-9876543" className={commonInputClass}/>
                             </div>
                            <div className="lg:col-span-3">
                                <label className={commonLabelClass}>{t('company_address')}</label>
                                <textarea name="companyAddress" value={formData.companyAddress || ''} onChange={handleChange} rows={2} className={commonInputClass}></textarea>
                            </div>
                             <div className="lg:col-span-3">
                                <label className={commonLabelClass}>{t('shipping_address')}</label>
                                <textarea name="shippingAddress" value={formData.shippingAddress || ''} onChange={handleChange} rows={2} className={commonInputClass}></textarea>
                            </div>
                             <div>
                                <label className={commonLabelClass}>{t('city')}</label>
                                <input name="city" type="text" value={formData.city || ''} onChange={handleChange} className={commonInputClass}/>
                             </div>
                             <div>
                                <label className={commonLabelClass}>{t('state')}</label>
                                <input name="state" type="text" value={formData.state || ''} onChange={handleChange} className={commonInputClass}/>
                             </div>
                             <div>
                                <label className={commonLabelClass}>{t('postal_code')}</label>
                                <input name="postalCode" type="text" value={formData.postalCode || ''} onChange={handleChange} className={commonInputClass}/>
                             </div>
                             <div className="lg:col-span-3">
                                <label className={commonLabelClass}>{t('added_by')}</label>
                                <input type="text" value="Shady Omar (you)" className={commonInputClass + " bg-gray-200 dark:bg-gray-800 cursor-not-allowed"} disabled/>
                             </div>
                             <div className="lg:col-span-3">
                                <label className={commonLabelClass}>{t('note')}</label>
                                <textarea name="note" value={formData.note || ''} onChange={handleChange} rows={3} className={commonInputClass}></textarea>
                             </div>
                        </div>
                    </div>

                     <DynamicFieldRenderer 
                        fields={customerCustomFields}
                        data={customFieldData}
                        setData={handleCustomFieldChange}
                        moduleDataMap={moduleDataMap}
                    />
                </div>
                <div className="flex justify-end items-center p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};


const CustomersPage: React.FC = () => {
    const { t } = useTranslation();
    const { customers, setCustomers, customFields, modalRequest, setModalRequest, ...allData } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const importInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (modalRequest === 'add_client') {
            setIsModalOpen(true);
            setModalRequest(null);
        }
    }, [modalRequest, setModalRequest]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [customers, searchQuery]);
    
    const statusColors = {
        'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Inactive': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    const handleSaveCustomer = (newCustomer: Customer) => {
        setCustomers(prev => [...prev, newCustomer]);
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
        const dataToExport = filteredCustomers.map(({ avatar, customFieldData, ...rest }) => rest);
        exportToCsv('customers.csv', dataToExport);
    };

    const moduleDataMap = Object.keys(allData).reduce((acc, key) => {
        if (key.endsWith('s')) {
            acc[key] = allData[key];
        }
        return acc;
    }, {} as ModuleDataMap);

    return (
        <div className="p-6 space-y-6">
             <AddCustomerModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveCustomer}
                moduleDataMap={moduleDataMap}
             />
             <input
                type="file"
                ref={importInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileImport}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('clients')}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                     <div className="relative">
                        <SearchIcon className="absolute top-1/2 left-3 rtl:left-auto rtl:right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
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
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5"/>
                        <span className="text-sm font-medium">{t('add_customer')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('name')}</th>
                                <th scope="col" className="py-3 px-6">{t('company')}</th>
                                <th scope="col" className="py-3 px-6">{t('email')}</th>
                                <th scope="col" className="py-3 px-6">{t('mobile')}</th>
                                <th scope="col" className="py-3 px-6">{t('status')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer: Customer) => (
                                <tr key={customer.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <img src={customer.avatar} className="w-10 h-10 rounded-full" alt={customer.name} />
                                            <span className="font-medium text-gray-800 dark:text-white">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">{customer.company}</td>
                                    <td className="py-4 px-6">{customer.email}</td>
                                    <td className="py-4 px-6">{customer.mobile}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[customer.status]}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <MoreVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomersPage;