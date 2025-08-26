

import React, { useState, useMemo, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Contact } from '../types';
import { PlusIcon, SearchIcon, MoreVerticalIcon, UploadCloudIcon, DownloadIcon } from './icons/Icons';
import { exportToCsv } from '../lib/utils';

const ContactsPage: React.FC = () => {
    const { t } = useTranslation();
    const { contacts } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const importInputRef = useRef<HTMLInputElement>(null);

    const filteredContacts = useMemo(() => {
        return contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.company.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [contacts, searchQuery]);
    
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
        const dataToExport = filteredContacts.map(({ avatar, customFieldData, ...rest }) => rest);
        exportToCsv('contacts.csv', dataToExport);
    };

    return (
        <div className="p-6 space-y-6">
            <input
                type="file"
                ref={importInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileImport}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('all_contacts')}</h2>
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5"/>
                        <span className="text-sm font-medium">{t('add_contact')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('name')}</th>
                                <th scope="col" className="py-3 px-6">{t('email')}</th>
                                <th scope="col" className="py-3 px-6">{t('phone')}</th>
                                <th scope="col" className="py-3 px-6">{t('company')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.map((contact: Contact) => (
                                <tr key={contact.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <img src={contact.avatar} className="w-10 h-10 rounded-full" alt={contact.name} />
                                            <span className="font-medium text-gray-800 dark:text-white">{contact.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">{contact.email}</td>
                                    <td className="py-4 px-6">{contact.phone}</td>
                                    <td className="py-4 px-6">{contact.company}</td>
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

export default ContactsPage;