import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Holiday } from '../types';
import { PlusIcon, XIcon, Trash2Icon } from './icons/Icons';

const AddHolidayModal = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [date, setDate] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !date) return;

        const holidayDate = new Date(date);
        // Adjust for timezone offset to get the correct day name in the user's local timezone
        holidayDate.setMinutes(holidayDate.getMinutes() + holidayDate.getTimezoneOffset());
        const day = holidayDate.toLocaleDateString('en-US', { weekday: 'long' });

        const newHoliday: Omit<Holiday, 'id'> = {
            name,
            date,
            day,
        };
        onSave(newHoliday);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('add_holiday')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name')} *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('name')}
                            className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('date')} *</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
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

const HolidaysPage: React.FC = () => {
    const { t } = useTranslation();
    const { holidays, setHolidays } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveHoliday = (newHolidayData: Omit<Holiday, 'id'>) => {
        const newHoliday: Holiday = {
            ...newHolidayData
        };
        // Avoid adding duplicate dates
        if (holidays.some(h => h.date === newHoliday.date)) {
            alert('A holiday for this date already exists.');
            return;
        }
        setHolidays(prev => [...prev, newHoliday].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    };

    const handleDeleteHoliday = (date: string) => {
        if (window.confirm('Are you sure you want to delete this holiday?')) {
            setHolidays(prev => prev.filter(h => h.date !== date));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <AddHolidayModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveHoliday}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('upcoming_holidays')}</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="w-5 h-5"/>
                    <span className="text-sm font-medium">{t('add_holiday')}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('date')}</th>
                                <th scope="col" className="py-3 px-6">{t('name')}</th>
                                <th scope="col" className="py-3 px-6">{t('day')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holidays.map((holiday: Holiday) => (
                                <tr key={holiday.date} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6 font-medium text-gray-800 dark:text-white">
                                        {holiday.date}
                                    </td>
                                    <td className="py-4 px-6">{holiday.name}</td>
                                    <td className="py-4 px-6">{holiday.day}</td>
                                    <td className="py-4 px-6 text-center">
                                        <button onClick={() => handleDeleteHoliday(holiday.date)} className="text-red-600 dark:text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                            <Trash2Icon className="w-5 h-5" />
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

export default HolidaysPage;