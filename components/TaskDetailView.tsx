import React, { useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Task, TaskFile, TaskComment, TimeLog, TaskHistory } from '../types';
import { ArrowLeftIcon, ClockIcon, UsersIcon, PaperclipIcon, PlusIcon, FileTextIcon, Trash2Icon, CheckSquareIcon, MessageSquareIcon, RssIcon, SendIcon } from './icons/Icons';
import LogTimeModal from './LogTimeModal';

const InfoField: React.FC<{ label: string, value?: string | React.ReactNode, fullWidth?: boolean }> = ({ label, value, fullWidth }) => {
    if (!value && value !== 0) return null;
    return (
        <div className={`bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg ${fullWidth ? 'md:col-span-2' : ''}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <div className="font-semibold text-gray-800 dark:text-white break-words text-sm">{value}</div>
        </div>
    );
};

interface TaskDetailViewProps {
    task: Task;
    onBack: () => void;
    onEditTask: (task: Task) => void;
    onAddSubtask: (parentId: string) => void;
}

// Helper functions for time calculation
const parseDurationStringToMinutes = (durationStr: string): number => {
    if (!durationStr || durationStr.toLowerCase().includes('s')) return 0;
    let totalMinutes = 0;
    const hoursMatch = durationStr.match(/(\d+)\s*h/);
    const minutesMatch = durationStr.match(/(\d+)\s*m/);
    if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
    if (minutesMatch) totalMinutes += parseInt(minutesMatch[1]);
    return totalMinutes;
};

const formatMinutesToDurationString = (totalMinutes: number): string => {
    if (totalMinutes === 0) return '0m';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim();
};


const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task, onBack, onEditTask, onAddSubtask }) => {
    const { t } = useTranslation();
    const { projects, vendors, tasks, setTasks, setSelectedTaskId, timeLogs, setTimeLogs, employees, setActivePage, setSelectedProjectId } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState('description');
    const [newComment, setNewComment] = useState('');
    const [localNotes, setLocalNotes] = useState(task.notes || '');
    const [isLogTimeModalOpen, setIsLogTimeModalOpen] = useState(false);
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

    const project = projects.find(p => p.id === task.projectId);
    const vendor = vendors.find(v => v.id === project?.vendorId);
    const subTasks = tasks.filter(t => t.parentId === task.id);
    const taskTimeLogs = timeLogs.filter(log => log.taskId === task.id);

    const priorityColors = { 'High': 'text-red-500', 'Medium': 'text-yellow-500', 'Low': 'text-green-500' };
    const statusColors: { [key: string]: string } = { 'To Do': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', 'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', 'Done': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };


    const handleStatusChange = (newStatus: Task['status']) => {
        const oldStatus = task.status;
        if (oldStatus === newStatus) {
            setIsStatusMenuOpen(false);
            return;
        }

        const historyEntry: TaskHistory = {
            id: `h_${Date.now()}`,
            actor: { name: 'Ali erkan karakurt' }, // Hardcoded current user
            action: `changed status from '${oldStatus}' to '${newStatus}'.`,
            timestamp: 'Just now'
        };

        const updatedTask = {
            ...task,
            status: newStatus,
            history: [...(task.history || []), historyEntry]
        };

        setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? updatedTask : t));
        setIsStatusMenuOpen(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newFile: TaskFile = {
                id: `file_${Date.now()}`,
                name: file.name,
                size: `${(file.size / 1024).toFixed(2)} KB`,
                url: '#',
            };
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, files: [...(t.files || []), newFile] } : t));
        }
    };
    
    const handleDeleteFile = (fileId: string) => {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, files: t.files?.filter(f => f.id !== fileId) } : t));
    };

    const handleAddComment = () => {
        if (newComment.trim() === '') return;
        const currentUser = employees[1]; // Mock current user
        const comment: TaskComment = {
            id: `c_${Date.now()}`,
            author: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
            text: newComment,
            timestamp: 'Just now'
        };
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, comments: [...(t.comments || []), comment] } : t));
        setNewComment('');
    };

    const handleSaveNotes = () => {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, notes: localNotes } : t));
        alert('Notes saved!');
    };

    const handleSaveTimeLog = (logData: Omit<TimeLog, 'id'>) => {
        const newLog: TimeLog = { ...logData, id: `log_${Date.now()}` };
        setTimeLogs(prev => [...prev, newLog]);

        const durationMinutes = (newLog.endTime - newLog.startTime) / (1000 * 60);
        
        setTasks(prevTasks => prevTasks.map(t => {
            if (t.id === task.id) {
                const existingMinutes = parseDurationStringToMinutes(t.hoursLogged || '');
                const newTotalMinutes = existingMinutes + durationMinutes;
                const newHoursLogged = formatMinutesToDurationString(Math.round(newTotalMinutes));
                return { ...t, hoursLogged: newHoursLogged };
            }
            return t;
        }));
        setIsLogTimeModalOpen(false);
    };

    const tabs = [
        { id: 'description', label: t('description') },
        { id: 'sub_tasks', label: t('sub_tasks') },
        { id: 'files', label: t('files') },
        { id: 'comments', label: t('comments') },
        { id: 'timesheet', label: t('timesheet') },
        { id: 'notes', label: t('notes') },
        { id: 'history', label: t('history') },
    ];

    return (
        <div className="p-6 space-y-6">
            <LogTimeModal
                isOpen={isLogTimeModalOpen}
                onClose={() => setIsLogTimeModalOpen(false)}
                onSave={handleSaveTimeLog}
                task={task}
            />
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                <ArrowLeftIcon className="w-4 h-4" />
                {t('back_to_tasks')}
            </button>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                 <div className="flex flex-col md:flex-row gap-4 justify-between items-start pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{task.name} <span className="text-lg font-normal text-gray-400">({task.taskCode})</span></h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('in')} 
                            <button 
                                onClick={() => {
                                    if (project) {
                                        setSelectedProjectId(project.id);
                                        setActivePage('projects');
                                    }
                                }} 
                                className="text-blue-600 hover:underline ml-1 rtl:mr-1"
                            >
                                {project?.name}
                            </button>
                        </p>
                    </div>
                     <div className="flex items-center gap-4">
                        <button onClick={() => onEditTask(task)} className="text-sm font-medium text-blue-600 hover:underline">{t('edit_task')}</button>
                        <div className="relative">
                            <button onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)} className={`px-3 py-1.5 text-sm font-semibold rounded-full ${statusColors[task.status]}`}>
                                {t(task.status.toLowerCase().replace(' ', '_'))}
                            </button>
                            {isStatusMenuOpen && (
                                <div className="absolute z-10 right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 py-1">
                                    {(['To Do', 'In Progress', 'Done'] as const).map(statusOption => (
                                        <button 
                                            key={statusOption}
                                            onClick={() => handleStatusChange(statusOption)}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {t(statusOption.toLowerCase().replace(' ', '_'))}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    {/* Left Column with Tabs */}
                    <div className="lg:col-span-2 space-y-6">
                         <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="flex space-x-4 -mb-px overflow-x-auto">
                                {tabs.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`py-3 px-1 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >{tab.label}</button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div>
                            {activeTab === 'description' && (task.description ? <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{task.description}</p> : <p className="text-center py-8 text-gray-400">No description provided.</p>)}
                            
                            {activeTab === 'sub_tasks' && (
                                 <div className="space-y-2">
                                    <button onClick={() => onAddSubtask(task.id)} className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-2">
                                        <PlusIcon className="w-4 h-4" /> {t('add_sub_task')}
                                    </button>
                                    {subTasks.map(sub => (
                                        <div key={sub.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <CheckSquareIcon className={`w-5 h-5 ${sub.status === 'Done' ? 'text-green-500' : 'text-gray-400'}`} />
                                                <button onClick={() => setSelectedTaskId(sub.id)} className="text-sm font-medium hover:underline">{sub.name}</button>
                                            </div>
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[sub.status]}`}>{t(sub.status.toLowerCase().replace(' ', '_'))}</span>
                                        </div>
                                    ))}
                                    {subTasks.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No sub-tasks yet.</p>}
                                </div>
                            )}

                            {activeTab === 'files' && (
                                <div className="space-y-2">
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-2">
                                        <PaperclipIcon className="w-4 h-4" /> {t('upload_file')}
                                    </button>
                                    {task.files?.map(file => (
                                        <div key={file.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center gap-3">
                                            <FileTextIcon className="w-6 h-6 text-gray-500 shrink-0" />
                                            <div className="flex-grow"><a href={file.url} className="text-sm font-medium hover:underline">{file.name}</a><p className="text-xs text-gray-500">{file.size}</p></div>
                                            <button onClick={() => handleDeleteFile(file.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2Icon className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    {!task.files?.length && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">{t('no_files_uploaded')}</p>}
                                </div>
                            )}
                            
                            {activeTab === 'comments' && (
                                <div className="space-y-4">
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                        {task.comments?.map(comment => (
                                            <div key={comment.id} className="flex items-start gap-3">
                                                <img src={comment.author.avatar} alt={comment.author.name} className="w-9 h-9 rounded-full"/>
                                                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex-grow">
                                                    <div className="flex justify-between items-baseline">
                                                        <p className="font-semibold text-sm">{comment.author.name}</p>
                                                        <p className="text-xs text-gray-500">{comment.timestamp}</p>
                                                    </div>
                                                    <p className="text-sm mt-1">{comment.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                     {!task.comments?.length && <p className="text-center py-8 text-gray-400">{t('no_comments_yet')}</p>}
                                    <div className="flex items-start gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <img src={employees[1].avatar} alt="current user" className="w-9 h-9 rounded-full"/>
                                        <div className="flex-grow">
                                            <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={2} placeholder={t('type_a_message')} className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                                            <button onClick={handleAddComment} className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">{t('send')}</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {activeTab === 'timesheet' && (
                                <div className="space-y-2">
                                     {taskTimeLogs.length > 0 ? taskTimeLogs.map(log => (
                                        <div key={log.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2"><ClockIcon className="w-4 h-4"/><span>{log.employeeName}</span></div>
                                            <span>{log.date}</span>
                                            <span className="font-semibold">{log.duration}</span>
                                        </div>
                                     )) : <p className="text-center py-8 text-gray-400">{t('no_time_logs_for_task')}</p>}
                                </div>
                            )}

                            {activeTab === 'notes' && (
                                <div>
                                    <textarea value={localNotes} onChange={e => setLocalNotes(e.target.value)} rows={8} className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                                    <button onClick={handleSaveNotes} className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">{t('save_notes')}</button>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="space-y-3">
                                     {task.history?.map(item => (
                                         <div key={item.id} className="flex items-center gap-3 text-sm">
                                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full"><RssIcon className="w-4 h-4 text-gray-500"/></div>
                                            <div><span className="font-semibold">{item.actor.name}</span> {item.action}</div>
                                            <div className="text-xs text-gray-500 ml-auto">{item.timestamp}</div>
                                         </div>
                                     ))}
                                     {!task.history?.length && <p className="text-center py-8 text-gray-400">{t('no_activity_history')}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                            <h4 className="font-bold text-lg text-gray-800 dark:text-white">Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <InfoField label={t('start_date')} value={task.startDate} />
                                <InfoField label={t('due_date')} value={task.dueDate} />
                                <InfoField label={t('priority')} value={<span className={priorityColors[task.priority]}>{t(task.priority.toLowerCase())}</span>} />
                                <InfoField label={t('task_category')} value={task.category} />
                                <InfoField label={t('vendor')} value={vendor?.name} />
                                 <InfoField 
                                    label={t('assigned_to')} 
                                    value={(task.assignees && task.assignees.length > 0) ? (
                                        <div className="flex items-center -space-x-2 rtl:space-x-reverse rtl:space-x-0">
                                            {task.assignees.map(assignee => (
                                                <img key={assignee.name} src={assignee.avatar} alt={assignee.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" title={assignee.name}/>
                                            ))}
                                        </div>
                                    ) : t('unassigned')} 
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                            <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{t('time_log')}</h4>
                            <div className="flex justify-between items-baseline">
                                <span className="text-xl font-bold">{task.hoursLogged || '0h 0m'}</span>
                                <span className="text-sm text-gray-500">of {task.estimatedTime || '0h'}</span>
                            </div>
                             <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '70%'}}></div>
                            </div>
                            <button onClick={() => setIsLogTimeModalOpen(true)} className="w-full mt-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50">{t('log_time')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailView;