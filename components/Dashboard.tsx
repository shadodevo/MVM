

import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { BriefcaseIcon, CheckSquareIcon, UsersIcon, DollarSignIcon, PieChartIcon, GiftIcon } from './icons/Icons';
import { Project, Task, Appreciation, Holiday } from '../types';
import { calculateProjectStats } from '../lib/utils';

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string, color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center gap-4 border-l-4" style={{borderLeftColor: color}}>
        <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const AppreciationCard: React.FC<{ appreciation: Appreciation }> = ({ appreciation }) => {
    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex gap-3 items-start">
             <div className="flex-shrink-0">
                <img src={appreciation.from.avatar} alt={appreciation.from.name} className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex-grow">
                 <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-bold">{appreciation.from.name}</span> to <span className="font-bold">{appreciation.to.name}</span>
                </p>
                <p className="text-sm italic text-gray-600 dark:text-gray-400 mt-1">"{appreciation.message}"</p>
            </div>
        </div>
    );
};

const DonutChart: React.FC<{ data: { label: string, value: number, color: string }[], totalLabel: string }> = ({ data, totalLabel }) => {
    const { t } = useTranslation();
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) return <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">{t('no')} {totalLabel.toLowerCase()}</div>;

    let cumulative = 0;
    const segments = data.map(item => {
        const percentage = (item.value / total) * 100;
        const start = cumulative;
        cumulative += percentage;
        return { ...item, percentage, start, end: cumulative };
    });

    const circumference = 2 * Math.PI * 15.9154943092; // 2 * pi * r

    return (
         <div className="flex flex-col xl:flex-row items-center gap-6">
            <div className="relative w-40 h-40">
                 <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                     <circle cx="18" cy="18" r="15.9154943092" fill="transparent" stroke="#e5e7eb" strokeWidth="4" className="dark:stroke-gray-700"/>
                    {segments.map((segment, index) => (
                        <circle
                            key={index}
                            cx="18" cy="18" r="15.9154943092"
                            fill="transparent"
                            stroke={segment.color}
                            strokeWidth="4"
                            strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
                            strokeDashoffset={-segment.start}
                            transform="translate(0 36) scale(1 -1)"
                        />
                    ))}
                </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800 dark:text-white">{total}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{totalLabel}</span>
                </div>
            </div>
            <div className="w-full flex-1 space-y-2">
                {segments.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-white">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const { projects, tasks, appreciations, customers, deals, employees } = useApp();
    const pendingTasks = tasks.filter(t => t.status !== 'Done').length;
    const dealsWon = deals.filter(d => d.stage === 'Won').length;

    const myTasks = tasks.filter(t => t.status !== 'Done' && t.assignees?.some(assignee => ['Alia Hassan', 'Burak Yilmaz', 'Dana White'].includes(assignee.name))).slice(0, 5);
    const priorityColors = { 'High': 'bg-red-500', 'Medium': 'bg-yellow-500', 'Low': 'bg-green-500' };

    const projectsWithStats = projects.map(p => ({
        ...p,
        ...calculateProjectStats(p, tasks)
    }));
    
    const projectStatusData = [
        { label: t('in_progress'), value: projectsWithStats.filter(p => p.status === 'In Progress').length, color: '#3b82f6' },
        { label: t('completed'), value: projectsWithStats.filter(p => p.status === 'Completed').length, color: '#22c55e' },
        { label: t('pending'), value: projectsWithStats.filter(p => p.status === 'Pending').length, color: '#f97316' },
    ];
    
    const statusColors = {
        'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Pending': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };

    return (
        <div className="p-6 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard icon={<UsersIcon className="w-6 h-6 text-blue-600"/>} title={t('total_clients')} value={String(customers.length)} color="#3b82f6" />
                <StatCard icon={<BriefcaseIcon className="w-6 h-6 text-green-600"/>} title={t('total_projects')} value={String(projects.length)} color="#22c55e" />
                <StatCard icon={<CheckSquareIcon className="w-6 h-6 text-orange-600"/>} title={t('tasks_pending')} value={String(pendingTasks)} color="#f97316" />
                <StatCard icon={<DollarSignIcon className="w-6 h-6 text-yellow-600"/>} title={t('deals_won')} value={String(dealsWon)} color="#f59e0b" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Projects */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('active_projects')}</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-4">{t('project_name')}</th>
                                    <th scope="col" className="py-3 px-4">{t('deadline')}</th>
                                    <th scope="col" className="py-3 px-4">{t('progress')}</th>
                                    <th scope="col" className="py-3 px-4">{t('status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectsWithStats.filter(p => p.status === 'In Progress').map(p => (
                                    <tr key={p.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">{p.name}</td>
                                        <td className="py-3 px-4">{p.deadline}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${p.progress}%` }}></div>
                                                </div>
                                                <span className="text-xs font-semibold">{p.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[p.status]}`}>{t(p.status.toLowerCase().replace(' ', '_'))}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>

                {/* My Tasks */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('my_tasks')}</h3>
                     <div className="space-y-4">
                        {myTasks.length > 0 ? myTasks.map(task => (
                            <div key={task.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <p className="font-semibold text-gray-800 dark:text-white">{task.name}</p>
                                    <span className={`w-3 h-3 rounded-full mt-1 shrink-0 ${priorityColors[task.priority]}`} title={task.priority}></span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('due_date')}: {task.dueDate}</p>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('no')} {t('tasks').toLowerCase()}</p>
                        )}
                     </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Status Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><PieChartIcon className="w-6 h-6 text-blue-500"/>{t('project_status_distribution')}</h3>
                    <DonutChart data={projectStatusData} totalLabel={t('projects')} />
                </div>
                {/* Latest Appreciations */}
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <GiftIcon className="w-6 h-6 text-yellow-500" />
                        {t('latest_appreciations')}
                    </h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {appreciations.map(a => <AppreciationCard key={a.id} appreciation={a} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;