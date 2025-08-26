import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Task, TimeLog, TaskHistory } from '../types';
import { PlusIcon, SearchIcon, MoreVerticalIcon, XIcon as CloseIcon, ChevronDownIcon, CheckSquareIcon, PlayIcon, StopIcon, UploadCloudIcon, DownloadIcon } from './icons/Icons';
import TaskDetailView from './TaskDetailView';
import AddTaskModal from './AddTaskModal';
import LogTimeModal from './LogTimeModal';
import { exportToCsv } from '../lib/utils';

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


const TasksPage: React.FC = () => {
    const { t } = useTranslation();
    const { tasks, projects, vendors, selectedTaskId, setSelectedTaskId, setTasks, activeTimer, setActiveTimer, setTimeLogs } = useApp();
    const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [actionMenu, setActionMenu] = useState<string | null>(null);
    const [isLogTimeModalOpen, setIsLogTimeModalOpen] = useState(false);
    const [taskForLog, setTaskForLog] = useState<Task | null>(null);
    const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null);
    const importInputRef = useRef<HTMLInputElement>(null);


    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [myTasksOnly, setMyTasksOnly] = useState(false);
    
    const selectedTask = tasks.find(t => t.id === selectedTaskId);

    useEffect(() => {
        let currentTasks = [...tasks];

        if (searchQuery) {
            currentTasks = currentTasks.filter(task => 
                task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.taskCode.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter) {
            currentTasks = currentTasks.filter(task => task.status === statusFilter);
        }

        if (myTasksOnly) {
             currentTasks = currentTasks.filter(task => task.assigneeIds?.includes('2')); // Hardcoded current user
        }

        setFilteredTasks(currentTasks);
    }, [tasks, searchQuery, statusFilter, myTasksOnly]);
    
    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setMyTasksOnly(false);
    };

    const handleOpenModal = (task: Task | null = null) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
        setActionMenu(null);
    };

    const handleDeleteTask = (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task and its sub-tasks?')) {
            setTasks(prev => prev.filter(t => t.id !== taskId && t.parentId !== taskId));
        }
        setActionMenu(null);
    };

    const handleSaveTask = (taskData: Task) => {
        setTasks(prev => {
            const exists = prev.some(t => t.id === taskData.id);
            if (exists) {
                return prev.map(t => t.id === taskData.id ? taskData : t);
            }
            return [...prev, taskData];
        });
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
        setTasks(prevTasks => {
            const taskToUpdate = prevTasks.find(t => t.id === taskId);
            if (!taskToUpdate) return prevTasks;
    
            const oldStatus = taskToUpdate.status;
            if (oldStatus === newStatus) return prevTasks;
    
            const historyEntry: TaskHistory = {
                id: `h_${Date.now()}`,
                actor: { name: 'Ali erkan karakurt' }, // Hardcoded current user
                action: `changed status from '${oldStatus}' to '${newStatus}'.`,
                timestamp: 'Just now'
            };
    
            return prevTasks.map(t => 
                t.id === taskId 
                ? { ...t, status: newStatus, history: [...(t.history || []), historyEntry] } 
                : t
            );
        });
        setStatusMenuOpen(null);
    };
    
    const handleStartTimer = (taskId: string) => {
        setActiveTimer({ taskId, startTime: Date.now() });
    };

    const handleStopTimer = (task: Task) => {
        setTaskForLog(task);
        setIsLogTimeModalOpen(true);
    };
    
    const handleSaveTimeLog = (logData: Omit<TimeLog, 'id'>) => {
        const newLog: TimeLog = { ...logData, id: `log_${Date.now()}` };
        setTimeLogs(prev => [...prev, newLog]);

        const durationMinutes = (newLog.endTime - newLog.startTime) / (1000 * 60);
        
        setTasks(prevTasks => prevTasks.map(t => {
            if (t.id === taskForLog?.id) {
                const existingMinutes = parseDurationStringToMinutes(t.hoursLogged || '');
                const newTotalMinutes = existingMinutes + durationMinutes;
                const newHoursLogged = formatMinutesToDurationString(Math.round(newTotalMinutes));
                return { ...t, hoursLogged: newHoursLogged };
            }
            return t;
        }));
        setActiveTimer(null);
        setIsLogTimeModalOpen(false);
        setTaskForLog(null);
    };
    
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
        const dataToExport = filteredTasks.map(({ assignees, comments, history, files, ...rest }) => ({
            ...rest,
            assigneeIds: rest.assigneeIds?.join('; '),
            perspectives: rest.perspectives?.join('; '),
        }));
        exportToCsv('tasks.csv', dataToExport);
    };
    
    if (selectedTask) {
        return <TaskDetailView 
            task={selectedTask} 
            onBack={() => setSelectedTaskId(null)} 
            onEditTask={handleOpenModal}
            onAddSubtask={() => handleOpenModal()} // Will need to pass parentId to modal
        />;
    }

    const priorityColors = { 'High': 'text-red-500', 'Medium': 'text-yellow-500', 'Low': 'text-green-500' };
    const statusColors: { [key: string]: string } = { 'To Do': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', 'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', 'Done': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };

    return (
        <div className="p-6 h-full flex flex-col">
            <AddTaskModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }}
                onSave={handleSaveTask}
                taskToEdit={taskToEdit}
            />
             <LogTimeModal
                isOpen={isLogTimeModalOpen}
                onClose={() => setIsLogTimeModalOpen(false)}
                onSave={handleSaveTimeLog}
                task={taskForLog}
                startTimeEpoch={activeTimer?.startTime}
                endTimeEpoch={Date.now()}
            />
             <input
                type="file"
                ref={importInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileImport}
            />

            {/* Header and Filters */}
            <div className="mb-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('tasks')}</h2>
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
                        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            <PlusIcon className="w-5 h-5"/>
                            <span className="text-sm font-medium">{t('add_task')}</span>
                        </button>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-4">
                   {/* ... filter inputs ... */}
                </div>
            </div>

            {/* Tasks Table */}
            <div className="flex-grow overflow-auto bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="py-3 px-4">{t('code')}</th>
                            <th className="py-3 px-4">{t('task')}</th>
                            <th className="py-3 px-4">{t('client')}</th>
                            <th className="py-3 px-4">{t('collection_name')}</th>
                            <th className="py-3 px-4">{t('due_date')}</th>
                            <th className="py-3 px-4">{t('assigned_to')}</th>
                            <th className="py-3 px-4">{t('status')}</th>
                            <th className="py-3 px-4">{t('vendor')}</th>
                            <th className="py-3 px-4 text-center">{t('action')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredTasks.filter(t => !t.parentId).map(task => { // Only show top-level tasks
                            const project = projects.find(p => p.id === task.projectId);
                            const vendor = vendors.find(v => v.id === project?.vendorId);
                            return (
                                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="py-3 px-4 font-mono">{task.taskCode}</td>
                                    <td className="py-3 px-4">
                                        <button onClick={() => setSelectedTaskId(task.id)} className={`font-medium text-gray-800 dark:text-white hover:underline text-left ${priorityColors[task.priority]}`}>{task.name}</button>
                                        <div className="text-xs text-gray-400">{project?.name}</div>
                                    </td>
                                    <td className="py-3 px-4">{project?.client || '--'}</td>
                                    <td className="py-3 px-4">{project?.collectionNames?.join(', ') || '--'}</td>
                                    <td className="py-3 px-4">{task.dueDate}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center -space-x-2">
                                            {task.assignees?.map(a => (
                                                <img key={a.id} src={a.avatar} alt={a.name} title={a.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" />
                                            ))}
                                            {!task.assignees?.length && '--'}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="relative">
                                            <button 
                                                onClick={() => setStatusMenuOpen(statusMenuOpen === task.id ? null : task.id)}
                                                className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusColors[task.status]}`}
                                            >
                                                {t(task.status.toLowerCase().replace(' ', '_'))}
                                            </button>
                                            {statusMenuOpen === task.id && (
                                                <div className="absolute z-10 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700">
                                                    {(['To Do', 'In Progress', 'Done'] as const).map(statusOption => (
                                                        <button 
                                                            key={statusOption}
                                                            onClick={() => handleStatusChange(task.id, statusOption)}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        >
                                                            {t(statusOption.toLowerCase().replace(' ', '_'))}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">{vendor?.name || '--'}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {activeTimer?.taskId === task.id ? (
                                                <button onClick={() => handleStopTimer(task)} title={t('stop_timer')} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 animate-pulse">
                                                    <StopIcon className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleStartTimer(task.id)} disabled={!!activeTimer} title={t('start_timer')} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                                                    <PlayIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            <div className="relative">
                                                <button onClick={() => setActionMenu(actionMenu === task.id ? null : task.id)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                    <MoreVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                </button>
                                                {actionMenu === task.id && (
                                                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 py-1">
                                                        <button onClick={() => { setSelectedTaskId(task.id); setActionMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('view')}</button>
                                                        <button onClick={() => handleOpenModal(task)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('edit')}</button>
                                                        <button onClick={() => handleDeleteTask(task.id)} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">{t('delete')}</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TasksPage;