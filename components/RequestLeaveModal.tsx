import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { LeaveRequest, LeaveType } from '../types';
import { XIcon as CloseIcon, PaperclipIcon, UploadCloudIcon } from './icons/Icons';

interface RequestLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (request: LeaveRequest) => void;
}

const RequestLeaveModal: React.FC<RequestLeaveModalProps> = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
    const { leaveTypes } = useApp();
    
    const [leaveTypeId, setLeaveTypeId] = useState<string>(leaveTypes[0]?.id || '');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [document, setDocument] = useState<File | null>(null);

    const selectedLeaveType = leaveTypes.find(lt => lt.id === leaveTypeId);

    useEffect(() => {
        if (isOpen) {
            // Reset form on open
            setLeaveTypeId(leaveTypes[0]?.id || '');
            setStartDate('');
            setEndDate('');
            setReason('');
            setDocument(null);
        }
    }, [isOpen, leaveTypes]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLeaveType || !startDate || !endDate || !reason) {
            alert("Please fill all required fields.");
            return;
        }

        const newRequest: LeaveRequest = {
            id: `lr_${Date.now()}`,
            employeeId: '2', // Hardcoded current user for demo "Ali erkan karakurt"
            employeeName: 'Ali erkan karakurt',
            employeeAvatar: 'https://i.pravatar.cc/150?u=burak',
            leaveType: selectedLeaveType.name as any, // The type is a bit mismatched, cast for now
            startDate,
            endDate,
            reason,
            status: 'Pending',
        };

        onSave(newRequest);
    };
    
    const commonInputClass = "mt-1 block w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('request_leave')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className={commonLabelClass}>{t('leave_type')}*</label>
                        <select value={leaveTypeId} onChange={e => setLeaveTypeId(e.target.value)} className={commonInputClass} required>
                            {leaveTypes.map(lt => (
                                <option key={lt.id} value={lt.id}>{lt.name} ({lt.daysAllowed} {t('days_per_year')})</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={commonLabelClass}>{t('start_date')}*</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={commonInputClass} required/>
                        </div>
                        <div>
                            <label className={commonLabelClass}>{t('end_date')}*</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className={commonInputClass} required/>
                        </div>
                    </div>
                    <div>
                        <label className={commonLabelClass}>{t('reason')}*</label>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} className={commonInputClass} required />
                    </div>
                    {selectedLeaveType?.requiresDocument && (
                        <div>
                            <label className={commonLabelClass}>{t('attach_document')}</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>{t('choose_a_file')}</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={e => setDocument(e.target.files ? e.target.files[0] : null)} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    {document && <p className="text-xs text-gray-500">{document.name}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};

export default RequestLeaveModal;