import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { LeaveRequest } from '../types';
import { PlusIcon, PlaneIcon, MoreVerticalIcon } from './icons/Icons';
import RequestLeaveModal from './RequestLeaveModal';

const LeavesPage: React.FC = () => {
    const { t } = useTranslation();
    const { leaveRequests, setLeaveRequests } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const statusColors = {
        'Approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    const handleSaveLeaveRequest = (newRequest: LeaveRequest) => {
        setLeaveRequests(prev => [newRequest, ...prev]);
        setIsModalOpen(false);
    };
    
    const handleLeaveStatusChange = (requestId: string, status: 'Approved' | 'Rejected') => {
        setLeaveRequests(prev => 
            prev.map(req => 
                req.id === requestId ? { ...req, status } : req
            )
        );
    };

    return (
        <div className="p-6 space-y-6">
            <RequestLeaveModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLeaveRequest}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('leave_management')}</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <PlaneIcon className="w-5 h-5"/>
                    <span className="text-sm font-medium">{t('request_leave')}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('employees')}</th>
                                <th scope="col" className="py-3 px-6">{t('leave_type')}</th>
                                <th scope="col" className="py-3 px-6">{t('date')}</th>
                                <th scope="col" className="py-3 px-6">{t('reason')}</th>
                                <th scope="col" className="py-3 px-6">{t('status')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveRequests.map((req: LeaveRequest) => (
                                <tr key={req.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <img src={req.employeeAvatar} className="w-10 h-10 rounded-full" alt={req.employeeName} />
                                            <span className="font-medium text-gray-800 dark:text-white">{req.employeeName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">{req.leaveType}</td>
                                    <td className="py-4 px-6">{req.startDate} to {req.endDate}</td>
                                    <td className="py-4 px-6 max-w-xs truncate">{req.reason}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[req.status]}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {req.status === 'Pending' ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleLeaveStatusChange(req.id, 'Approved')}
                                                    className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                                                >
                                                    {t('approve')}
                                                </button>
                                                <button
                                                    onClick={() => handleLeaveStatusChange(req.id, 'Rejected')}
                                                    className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
                                                >
                                                    {t('reject')}
                                                </button>
                                            </div>
                                        ) : (
                                            <span>-</span>
                                        )}
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

export default LeavesPage;