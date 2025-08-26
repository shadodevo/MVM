import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Project, Task } from '../types';
import { ArrowLeftIcon, BriefcaseIcon, CheckSquareIcon, ClockIcon, UsersIcon } from './icons/Icons';
import { calculateProjectStats } from '../lib/utils';

const InfoField: React.FC<{ label: string, value?: string | number | React.ReactNode, fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className={fullWidth ? 'md:col-span-2' : ''}>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <div className="font-semibold text-gray-800 dark:text-white break-words">{value}</div>
        </div>
    );
};

const ProjectDetailView: React.FC<{ project: Project, onBack: () => void }> = ({ project, onBack }) => {
    const { t } = useTranslation();
    const { tasks, setActivePage, setSelectedTaskId } = useApp();
    const [activeTab, setActiveTab] = useState('overview');

    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const { progress, status } = calculateProjectStats(project, tasks);

    const tabs = [
        { id: 'overview', label: t('project_overview') },
        { id: 'tasks', label: t('tasks') },
        { id: 'project_files', label: t('project_files') },
    ];
    
    const statusColors = { 'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', 'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', 'Pending': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' };

    return (
        <div className="p-6 space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                <ArrowLeftIcon className="w-4 h-4" />
                {t('back_to_projects')}
            </button>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{project.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('client')}: {project.client}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('deadline')}</p>
                            <p className="font-semibold text-gray-800 dark:text-white">{project.deadline}</p>
                        </div>
                        <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${statusColors[status]}`}>{t(status.toLowerCase().replace(' ', '_'))}</span>
                    </div>
                </div>

                 <div className="mt-4">
                    <label className="text-sm text-gray-500 dark:text-gray-400">{t('progress')}</label>
                    <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold">{progress}%</span>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <nav className="flex space-x-4">
                         {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-3 text-sm font-medium rounded-md ${activeTab === tab.id ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                            >{tab.label}</button>
                        ))}
                    </nav>
                </div>
                
                 <div className="mt-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2"><UsersIcon className="w-5 h-5"/>{t('team_members')}</h4>
                             <div className="flex items-center -space-x-3">
                                {project.team.map((member, i) => (
                                    <img key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" src={member.avatar} alt="member" title={`Member ${i+1}`} />
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'tasks' && (
                         <div>
                             <h4 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2 mb-4"><CheckSquareIcon className="w-5 h-5"/>{t('tasks')}</h4>
                             {projectTasks.length > 0 ? (
                                 <div className="space-y-3">
                                     {projectTasks.map(task => (
                                        <div key={task.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between items-center">
                                            <div>
                                                <button onClick={() => { setSelectedTaskId(task.id); setActivePage('tasks'); }} className="font-semibold text-gray-800 dark:text-white hover:underline">
                                                   ({task.taskCode}) {task.name}
                                                </button>
                                                <p className="text-xs text-gray-500">{t('due_date')}: {task.dueDate}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.status === 'Done' ? statusColors.Completed : statusColors['In Progress']}`}>{t(task.status.toLowerCase().replace(' ', '_'))}</span>
                                        </div>
                                     ))}
                                 </div>
                             ) : <p className="text-gray-500 dark:text-gray-400 text-sm">{t('no_tasks_in_project')}</p>}
                         </div>
                    )}
                     {activeTab === 'project_files' && (
                          <div>
                             <h4 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2 mb-4">{t('project_files')}</h4>
                             <p className="text-gray-500 dark:text-gray-400 text-sm">{t('no_files_uploaded')}</p>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailView;