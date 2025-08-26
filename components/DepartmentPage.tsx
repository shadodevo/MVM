import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Department } from '../types';
import { PlusIcon, BuildingIcon, XIcon, Trash2Icon } from './icons/Icons';

// Modal component inside the same file for simplicity
const AddDepartmentModal = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
    const { employees } = useApp();
    const [name, setName] = useState('');
    const [head, setHead] = useState(employees[0]?.name || '');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !head) return;
        onSave({ name, head });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('add_department')}</h3>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('head')} *</label>
                        <select
                            value={head}
                            onChange={(e) => setHead(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                        </select>
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

const DepartmentPage: React.FC = () => {
    const { t } = useTranslation();
    const { departments, setDepartments, employees } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveDepartment = (newDepartmentData: { name: string; head: string }) => {
        const newDepartment: Department = {
            id: `dept_${Date.now()}`,
            memberCount: 0, // New departments start with 0 members.
            ...newDepartmentData
        };
        setDepartments(prev => [...prev, newDepartment]);
    };

    const handleDeleteDepartment = (id: string) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            setDepartments(prev => prev.filter(d => d.id !== id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <AddDepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveDepartment}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('company_departments')}</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="w-5 h-5"/>
                    <span className="text-sm font-medium">{t('add_department')}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('department')}</th>
                                <th scope="col" className="py-3 px-6">{t('head')}</th>
                                <th scope="col" className="py-3 px-6">{t('employees')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((dept: Department) => (
                                <tr key={dept.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                                                <BuildingIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="font-medium text-gray-800 dark:text-white">{dept.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">{dept.head}</td>
                                    <td className="py-4 px-6">{employees.filter(e => e.department === dept.name).length}</td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => handleDeleteDepartment(dept.id)}
                                            className="text-red-600 dark:text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
                                            aria-label={`${t('delete')} ${dept.name}`}
                                        >
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

export default DepartmentPage;