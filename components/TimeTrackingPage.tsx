import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { TimeLog } from '../types';
import { ClockIcon, PlusIcon, MoreVerticalIcon, BriefcaseIcon, UserPlusIcon, CalendarIcon, StopIcon } from './icons/Icons';
import LogTimeModal from './LogTimeModal';


const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string, color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center gap-4 border-l-4" style={{borderLeftColor: color}}>
        <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const TimesheetPage: React.FC = () => {
    const { t } = useTranslation();
    const { timeLogs, activeTimer, employees, tasks, projects, setActiveTimer, setTimeLogs, setTasks } = useApp();
    const [isLogTimeModalOpen, setIsLogTimeModalOpen] = useState(false);
    const [runningTimer, setRunningTimer] = useState("00:00:00");
    const [taskForLog, setTaskForLog] = useState(null);

    // Filter states
    const [employeeFilter, setEmployeeFilter] = useState('');
    const [projectFilter, setProjectFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('this_week');
    
    useEffect(() => {
        let intervalId;
        if (activeTimer) {
          intervalId = setInterval(() => {
            const now = Date.now();
            const diff = now - activeTimer.startTime;
            const h = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
            const m = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
            const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
            setRunningTimer(`${h}:${m}:${s}`);
          }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [activeTimer]);
    
    const activeTaskForTimer = activeTimer ? tasks.find(t => t.id === activeTimer.taskId) : null;
    const activeEmployeeForTimer = activeTaskForTimer ? employees.find(e => e.id === activeTaskForTimer.assigneeIds?.[0]) : null;

    const parseDurationToMinutes = (duration) => {
        const [hours, minutes] = (duration || '0:0').split(':').map(Number);
        return (hours || 0) * 60 + (minutes || 0);
    };
    
    const formatMinutesToDurationString = (totalMinutes: number): string => {
        if (totalMinutes === 0) return '0h 0m';
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        return `${hours}h ${minutes}m`;
    };

    const calculateTotalHours = (logs: TimeLog[]) => {
        const totalMinutes = logs.reduce((acc, log) => acc + parseDurationToMinutes(log.duration), 0);
        return formatMinutesToDurationString(totalMinutes);
    };

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const dayOfWeek = now.getDay();
    const weekStartOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Assuming Monday is start of week
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + weekStartOffset).getTime();
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const logsToday = timeLogs.filter(log => log.startTime >= todayStart);
    const logsThisWeek = timeLogs.filter(log => log.startTime >= weekStart);
    const logsThisMonth = timeLogs.filter(log => log.startTime >= monthStart);

    const filteredLogs = timeLogs.filter(log => {
        let pass = true;
        if (employeeFilter && log.employeeId !== employeeFilter) pass = false;
        
        const project = projects.find(p => p.name === log.projectName);
        if (projectFilter && project?.id !== projectFilter) pass = false;

        if (dateFilter === 'today' && log.startTime < todayStart) pass = false;
        if (dateFilter === 'this_week' && log.startTime < weekStart) pass = false;
        if (dateFilter === 'this_month' && log.startTime < monthStart) pass = false;
        
        return pass;
    });
    
    const handleStopTimer = (task) => {
        setTaskForLog(task);
        setIsLogTimeModalOpen(true);
    };

    const handleSaveTimeLog = (logData) => {
        const newLog = { ...logData, id: `log_${Date.now()}` };
        setTimeLogs(prev => [...prev, newLog]);

        const durationMinutes = (newLog.endTime - newLog.startTime) / (1000 * 60);
        
        setTasks(prevTasks => prevTasks.map(t => {
            if (t.id === newLog.taskId) {
                const existingMinutes = parseDurationToMinutes(t.hoursLogged || '');
                const newTotalMinutes = existingMinutes + durationMinutes;
                return { ...t, hoursLogged: formatMinutesToDurationString(newTotalMinutes) };
            }
            return t;
        }));
        
        setActiveTimer(null);
        setIsLogTimeModalOpen(false);
        setTaskForLog(null);
    };

    return (
        <div className="p-6 space-y-6">
            <LogTimeModal
                isOpen={isLogTimeModalOpen}
                onClose={() => setIsLogTimeModalOpen(false)}
                onSave={handleSaveTimeLog}
                task={taskForLog}
                startTimeEpoch={activeTimer?.startTime}
                endTimeEpoch={Date.now()}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('timesheet')}</h2>
                <button onClick={() => { setTaskForLog(null); setIsLogTimeModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <PlusIcon className="w-5 h-5"/>
                    <span className="text-sm font-medium">{t('log_time')}</span>
                </button>
            </div>
            
            {/* Who is working */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('who_is_working_now')}</h3>
                {activeTimer && activeTaskForTimer && activeEmployeeForTimer ? (
                    <div className="flex items-center justify-between p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <img src={activeEmployeeForTimer.avatar} alt={activeEmployeeForTimer.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold text-yellow-800 dark:text-yellow-200">{activeEmployeeForTimer.name}</p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">{activeTaskForTimer.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                             <span className="font-mono font-bold text-lg text-gray-800 dark:text-white">{runningTimer}</span>
                             <button onClick={() => handleStopTimer(activeTaskForTimer)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600" title={t('stop_timer')}>
                                <StopIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('no_one_is_working')}</p>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-wrap items-center gap-4">
                 <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-gray-500">{t('filter_by_employee')}</label>
                    <select value={employeeFilter} onChange={e => setEmployeeFilter(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">{t('all_employees')}</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-gray-500">{t('filter_by_project')}</label>
                    <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">{t('all_projects')}</option>
                         {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                 <div className="flex-1 min-w-[200px]">
                     <label className="text-xs text-gray-500">{t('filter_by_date')}</label>
                     <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <button onClick={() => setDateFilter('today')} className={`flex-1 px-3 py-1 rounded-md text-sm ${dateFilter === 'today' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>{t('today')}</button>
                        <button onClick={() => setDateFilter('this_week')} className={`flex-1 px-3 py-1 rounded-md text-sm ${dateFilter === 'this_week' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>{t('this_week')}</button>
                        <button onClick={() => setDateFilter('this_month')} className={`flex-1 px-3 py-1 rounded-md text-sm ${dateFilter === 'this_month' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>{t('this_month')}</button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('employees')}</th>
                                <th scope="col" className="py-3 px-6">{t('project_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('tasks')}</th>
                                <th scope="col" className="py-3 px-6">{t('date')}</th>
                                <th scope="col" className="py-3 px-6">Duration</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log: TimeLog) => (
                                <tr key={log.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6 font-medium text-gray-800 dark:text-white">{log.employeeName}</td>
                                    <td className="py-4 px-6">{log.projectName}</td>
                                    <td className="py-4 px-6">{log.taskName} ({log.taskId})</td>
                                    <td className="py-4 px-6">{log.date}</td>
                                    <td className="py-4 px-6 font-semibold font-mono text-blue-600 dark:text-blue-400">{log.duration}</td>
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

export default TimesheetPage;