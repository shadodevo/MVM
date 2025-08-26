
import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Ticket } from '../types';
import { PlusIcon, SearchIcon, MoreVerticalIcon, XIcon as CloseIcon } from './icons/Icons';

const AddTicketModal = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
    const { customers, employees } = useApp();
    if (!isOpen) return null;
    
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newTicket: Partial<Ticket> = {
            id: `tkt_${Date.now()}`,
            subject: formData.get('subject') as string,
            clientName: formData.get('clientName') as string,
            assignedTo: formData.get('assignedTo') as string,
            status: 'Open',
            priority: formData.get('priority') as Ticket['priority'],
            date: new Date().toISOString().split('T')[0],
        };
        onSave(newTicket as Ticket);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('create_ticket')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('subject')} *</label>
                        <input name="subject" type="text" placeholder={t('subject')} className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('client_name')} *</label>
                        <select name="clientName" className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required>
                            {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('assigned_to')}</label>
                        <select name="assignedTo" className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
                             {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('priority')} *</label>
                        <select name="priority" className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required>
                            <option value="Low">{t('low')}</option>
                            <option value="Medium">{t('medium')}</option>
                            <option value="High">{t('high')}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('description')}</label>
                        <textarea rows={4} className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                </div>
                <div className="flex justify-end items-center p-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};

const TicketsPage: React.FC = () => {
    const { t } = useTranslation();
    const { tickets, setTickets } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const statusColors = {
        'Open': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Closed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };
     const priorityColors = {
        'High': 'text-red-500',
        'Medium': 'text-yellow-500',
        'Low': 'text-green-500',
    };
    
    const handleSaveTicket = (newTicket: Ticket) => {
        setTickets(prev => [...prev, newTicket]);
        setIsModalOpen(false);
    }

    return (
        <div className="p-6 space-y-6">
            <AddTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTicket} />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('all_tickets')}</h2>
                <div className="flex items-center gap-2">
                     <div className="relative">
                        <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder={t('search_placeholder')} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 ps-10 pe-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <PlusIcon className="w-5 h-5"/>
                        <span className="text-sm font-medium">{t('create_ticket')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('subject')}</th>
                                <th scope="col" className="py-3 px-6">{t('client_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('assigned_to')}</th>
                                <th scope="col" className="py-3 px-6">{t('status')}</th>
                                <th scope="col" className="py-3 px-6">{t('priority')}</th>
                                <th scope="col" className="py-3 px-6">{t('date')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket: Ticket) => (
                                <tr key={ticket.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6 font-medium text-gray-800 dark:text-white">{ticket.subject}</td>
                                    <td className="py-4 px-6">{ticket.clientName}</td>
                                    <td className="py-4 px-6">{ticket.assignedTo}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[ticket.status]}`}>
                                            {t(ticket.status.toLowerCase().replace(' ', '_'))}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`font-bold ${priorityColors[ticket.priority]}`}>
                                            {t(ticket.priority.toLowerCase())}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">{ticket.date}</td>
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

export default TicketsPage;
