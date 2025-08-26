import React, { useState, useMemo, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Vendor } from '../types';
import { PlusIcon, SearchIcon, MoreVerticalIcon, XIcon as CloseIcon, TruckIcon, UploadCloudIcon, DownloadIcon } from './icons/Icons';
import { exportToCsv } from '../lib/utils';

const AddVendorModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('add_vendor')}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('vendor_name')} *</label>
                        <input type="text" placeholder={t('vendor_name')} className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('vendor_category')}</label>
                        <input type="text" placeholder={t('vendor_category')} className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('email')}</label>
                        <input type="email" placeholder={t('email')} className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                </div>
                <div className="flex justify-end items-center p-6 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </div>
        </div>
    );
};

const VendorsPage: React.FC = () => {
    const { t } = useTranslation();
    const { vendors } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const importInputRef = useRef<HTMLInputElement>(null);

    const filteredVendors = useMemo(() => {
        return vendors.filter(vendor =>
            vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [vendors, searchQuery]);
    
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
        const dataToExport = filteredVendors.map(({ customFieldData, ...rest }) => rest);
        exportToCsv('vendors.csv', dataToExport);
    };

    return (
        <div className="p-6 space-y-6">
            <AddVendorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <input
                type="file"
                ref={importInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileImport}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('all_vendors')}</h2>
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
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5"/>
                        <span className="text-sm font-medium">{t('add_vendor')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('vendor_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('category')}</th>
                                <th scope="col" className="py-3 px-6">{t('email')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVendors.map((vendor: Vendor) => (
                                <tr key={vendor.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6">
                                         <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                                                <TruckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="font-medium text-gray-800 dark:text-white">{vendor.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">{vendor.category}</td>
                                    <td className="py-4 px-6">{vendor.email}</td>
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

export default VendorsPage;