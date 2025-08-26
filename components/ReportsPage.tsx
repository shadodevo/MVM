import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { PieChartIcon, BarChartIcon } from './icons/Icons';

const ChartCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        {children}
    </div>
);

const PieChart: React.FC<{ data: { label: string, value: number, color: string }[] }> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) {
        return <div className="text-center text-gray-500 dark:text-gray-400 py-10">No data to display.</div>;
    }
    let cumulative = 0;
    const segments = data.map(item => {
        const percentage = (item.value / total) * 100;
        const start = cumulative;
        cumulative += percentage;
        const end = cumulative;
        return { ...item, percentage, start, end };
    });

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-48 h-48 rounded-full">
                 <svg viewBox="0 0 36 36" className="w-full h-full">
                    {segments.map((segment, index) => {
                        const startX = 18 + 15.9154943092 * Math.cos(2 * Math.PI * segment.start / 100);
                        const startY = 18 + 15.9154943092 * Math.sin(2 * Math.PI * segment.start / 100);
                        const endX = 18 + 15.9154943092 * Math.cos(2 * Math.PI * segment.end / 100);
                        const endY = 18 + 15.9154943092 * Math.sin(2 * Math.PI * segment.end / 100);
                        const largeArcFlag = segment.percentage > 50 ? 1 : 0;
                        
                        return (
                           <path key={index} fill="none" stroke={segment.color} strokeWidth="5"
                                d={`M ${startX} ${startY} A 15.9154943092 15.9154943092 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                           />
                        )
                    })}
                </svg>
            </div>
            <div className="flex-1 space-y-2">
                {segments.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-white">{item.value} ({item.percentage.toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReportsPage: React.FC = () => {
    const { t } = useTranslation();
    const { projects, tasks } = useApp();

    const projectStatusData = [
        { label: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, color: '#f59e0b' },
        { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: '#10b981' },
        { label: 'Pending', value: projects.filter(p => p.status === 'Pending').length, color: '#ef4444' },
    ];
    
    const taskPriorityData = [
        { label: 'High', value: tasks.filter(t => t.priority === 'High').length, color: '#ef4444' },
        { label: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, color: '#f59e0b' },
        { label: 'Low', value: tasks.filter(t => t.priority === 'Low').length, color: '#10b981' },
    ]

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics & Reports</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title={t('project_status_distribution')} icon={<PieChartIcon className="w-6 h-6 text-blue-600"/>}>
                    <PieChart data={projectStatusData} />
                </ChartCard>
                 <ChartCard title={t('task_priority_distribution')} icon={<BarChartIcon className="w-6 h-6 text-green-600"/>}>
                    <PieChart data={taskPriorityData} />
                </ChartCard>
            </div>
        </div>
    );
};

export default ReportsPage;
