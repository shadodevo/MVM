import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Appreciation } from '../types';
import { PlusIcon, XIcon, GiftIcon, SendIcon } from './icons/Icons';

const AddAppreciationModal = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
    const { employees, currentUser } = useApp();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0]?.id || '');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedEmployeeId || !message) return;
        
        const toEmployee = employees.find(e => e.id === selectedEmployeeId);
        if (!toEmployee || !currentUser) return;

        const newAppreciation: Appreciation = {
            id: `app_${Date.now()}`,
            from: { name: currentUser.name, avatar: currentUser.avatar },
            to: { name: toEmployee.name, avatar: toEmployee.avatar },
            message: message,
            date: new Date().toISOString().split('T')[0],
        };

        onSave(newAppreciation);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('send_appreciation')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('employees')} *</label>
                        <select
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('message')} *</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            placeholder={t('message')}
                            className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <SendIcon className="w-4 h-4" />
                        {t('send')}
                    </button>
                </div>
            </form>
        </div>
    );
};


const AppreciationPage: React.FC = () => {
    const { t } = useTranslation();
    const { appreciations, setAppreciations } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveAppreciation = (newAppreciation: Appreciation) => {
        setAppreciations(prev => [newAppreciation, ...prev]);
    };

    return (
        <div className="p-6 space-y-6">
            <AddAppreciationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAppreciation}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('employee_appreciations')}</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="w-5 h-5"/>
                    <span className="text-sm font-medium">{t('send_appreciation')}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appreciations.map((appreciation: Appreciation) => (
                    <div key={appreciation.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-l-4 border-yellow-400">
                        <div className="flex items-center gap-3 mb-3">
                            <GiftIcon className="w-8 h-8 text-yellow-500 p-1.5 bg-yellow-100 dark:bg-yellow-900/50 rounded-full" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{appreciation.date}</p>
                            </div>
                        </div>
                        <p className="italic text-gray-700 dark:text-gray-300 mb-4">"{appreciation.message}"</p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <img src={appreciation.from.avatar} alt={appreciation.from.name} className="w-8 h-8 rounded-full" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{appreciation.from.name}</span>
                            </div>
                            <span className="text-2xl font-thin text-gray-300 dark:text-gray-600">&rarr;</span>
                            <div className="flex items-center gap-2">
                                <img src={appreciation.to.avatar} alt={appreciation.to.name} className="w-8 h-8 rounded-full" />
                                <span className="text-sm font-medium text-gray-800 dark:text-white">{appreciation.to.name}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppreciationPage;
