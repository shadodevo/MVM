import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Task, TimeLog, Employee } from '../types';
import { XIcon as CloseIcon } from './icons/Icons';

interface LogTimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (logData: Omit<TimeLog, 'id'>) => void;
    task?: Task | null;
    startTimeEpoch?: number;
    endTimeEpoch?: number;
}

const LogTimeModal: React.FC<LogTimeModalProps> = ({ isOpen, onClose, onSave, task, startTimeEpoch, endTimeEpoch }) => {
    const { t } = useTranslation();
    const { projects, tasks } = useApp();

    const currentUser: Employee = { id: '2', employeeId: 'MVM-002', name: 'Ali erkan karakurt', avatar: 'https://i.pravatar.cc/150?u=burak', role: 'Senior Photograph Studio', department: 'Production', email: 'mvmajansalierkan27@gmail.com', status: 'Active', joiningDate: '2022-08-22' };
    
    const toISOLocal = (epoch: number) => {
        const date = new Date(epoch);
        const tzoffset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
        return localISOTime;
    };
    
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [memo, setMemo] = useState('');
    const [duration, setDuration] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMemo('');
            const now = Date.now();
            const oneHourAgo = now - 3600 * 1000;
            setStartTime(startTimeEpoch ? toISOLocal(startTimeEpoch) : toISOLocal(oneHourAgo));
            setEndTime(endTimeEpoch ? toISOLocal(endTimeEpoch) : toISOLocal(now));
            
            if (task) {
                setSelectedProjectId(task.projectId || '');
                setSelectedTaskId(task.id);
            } else {
                setSelectedProjectId('');
                setSelectedTaskId('');
            }
        }
    }, [isOpen, task, startTimeEpoch, endTimeEpoch]);

    useEffect(() => {
        if (isOpen) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            if (end > start) {
                const diffMs = end.getTime() - start.getTime();
                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                setDuration(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
            } else {
                setDuration('00:00');
            }
        }
    }, [startTime, endTime, isOpen]);
    
    if (!isOpen) return null;

    const finalTask = task || tasks.find(t => t.id === selectedTaskId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!finalTask) {
            alert("Please select a task.");
            return;
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (end <= start) {
            alert(t('log_time_end_time_error'));
            return;
        }

        const project = projects.find(p => p.id === finalTask.projectId);
        
        const newLogData: Omit<TimeLog, 'id'> = {
            employeeId: currentUser.id,
            taskId: finalTask.id,
            startTime: start.getTime(),
            endTime: end.getTime(),
            memo,
            employeeName: currentUser.name,
            projectName: project?.name || 'N/A',
            taskName: finalTask.name,
            date: start.toISOString().split('T')[0],
            duration: duration,
        };
        onSave(newLogData);
    };

    const commonInputClass = "mt-1 block w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('log_time')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {!task ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className={commonLabelClass}>{t('project')}*</label>
                                <select value={selectedProjectId} onChange={e => { setSelectedProjectId(e.target.value); setSelectedTaskId(''); }} className={commonInputClass}>
                                    <option value="">-- {t('select_project')} --</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={commonLabelClass}>{t('task')}*</label>
                                <select value={selectedTaskId} onChange={e => setSelectedTaskId(e.target.value)} className={commonInputClass} disabled={!selectedProjectId}>
                                    <option value="">-- {t('choose_task')} --</option>
                                    {tasks.filter(t => t.projectId === selectedProjectId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                    ) : <p className="font-semibold">{task.name}</p>}

                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className={commonLabelClass}>{t('employee')}</p>
                            <p className="font-semibold text-gray-800 dark:text-white">{currentUser.name}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={commonLabelClass}>{t('start_time')}*</label>
                            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className={commonInputClass} required readOnly={!!startTimeEpoch}/>
                        </div>
                        <div>
                            <label className={commonLabelClass}>{t('end_time')}*</label>
                            <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} className={commonInputClass} required readOnly={!!endTimeEpoch}/>
                        </div>
                        <div>
                            <label className={commonLabelClass}>{t('duration')}</label>
                            <input type="text" value={duration} readOnly className={commonInputClass + " bg-gray-200 dark:bg-gray-800 cursor-not-allowed"} />
                        </div>
                    </div>
                    <div>
                        <label className={commonLabelClass}>{t('memo')}</label>
                        <textarea value={memo} onChange={e => setMemo(e.target.value)} rows={3} className={commonInputClass}></textarea>
                    </div>
                </div>

                <div className="flex justify-end items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};

export default LogTimeModal;