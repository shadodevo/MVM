import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Employee, Project, Task, LeaveRequest, TimeLog, Ticket, Appreciation } from '../types';
import { ArrowLeftIcon, PencilIcon, PlusIcon, GiftIcon, SendIcon } from './icons/Icons';

const DetailStatCard: React.FC<{ label: string, value: string | number }> = ({ label, value }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
    );
};
const InfoField: React.FC<{ label: string, value?: string | number | null }> = ({ label, value }) => {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold text-gray-800 dark:text-white break-words">{value}</p>
        </div>
    );
};

const PlaceholderTabContent: React.FC<{ messageKey: string; buttonKey?: string; onButtonClick?: () => void; }> = ({ messageKey, buttonKey, onButtonClick }) => {
    const { t } = useTranslation();
    return (
        <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t(messageKey)}</p>
            {buttonKey && onButtonClick && (
                <button onClick={onButtonClick} className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                    <PlusIcon className="w-4 h-4" />
                    {t(buttonKey)}
                </button>
            )}
        </div>
    );
};


interface EmployeeDetailViewProps {
    employee: Employee;
    onBack: () => void;
    onEdit: (employee: Employee) => void;
}

const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({ employee, onBack, onEdit }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('profile');
    const { projects, tasks, tickets, appreciations, setAppreciations, leaveRequests, timeLogs, setActivePage, setSelectedProjectId, setSelectedTaskId } = useApp();

    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    // Stats calculations
    const projectsCount = projects.filter(p => p.team.some(m => m.avatar === employee.avatar)).length;
    const openTasksCount = tasks.filter(t => t.status !== 'Done' && t.assignees?.some(a => a.name === employee.name)).length;
    const ticketsCount = tickets.filter(t => t.assignedTo === employee.name).length;
    const employeeTimeLogs = timeLogs.filter(t => t.employeeName === employee.name);
    const totalMinutes = employeeTimeLogs.reduce((acc, log) => {
        const parts = log.duration.split(':');
        return acc + parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const hoursLogged = `${hours}h ${minutes}m`;
    const appreciationsReceived = appreciations.filter(a => a.to.name === employee.name).length;
    const leavesTaken = leaveRequests.filter(l => l.employeeName === employee.name && l.status === 'Approved').length;
    const lateAttendance = '0'; // Placeholder

    const getWorkAnniversary = () => {
        if (!employee.joiningDate) return 'N/A';
        const joinDate = new Date(employee.joiningDate);
        const today = new Date();
        let nextAnniversary = new Date(today.getFullYear(), joinDate.getMonth(), joinDate.getDate());

        if (nextAnniversary < today) {
            nextAnniversary.setFullYear(today.getFullYear() + 1);
        }

        const diffTime = Math.abs(nextAnniversary.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 1) return t('today_is_the_day');
        if (diffDays > 30) {
            return `${Math.floor(diffDays / 30)} ${t('months_from_now')}`;
        }
        return `${diffDays} ${t('days_from_now')}`;
    };

    const tabs = [
        { id: 'profile', label: t('profile') },
        { id: 'salary', label: t('salary') },
        { id: 'projects', label: t('projects') },
        { id: 'tasks', label: t('tasks') },
        { id: 'leaves', label: t('leaves') },
        { id: 'timesheet', label: t('timesheet') },
        { id: 'appreciation', label: t('appreciation') },
        { id: 'documents', label: t('documents') },
        { id: 'emergency_contacts', label: t('emergency_contacts')},
        { id: 'increment_promotions', label: t('increment_promotions')},
        { id: 'tickets', label: t('tickets') },
        { id: 'activity', label: t('activity') },
        { id: 'immigration', label: t('immigration') },
    ];

    const commonTableClass = "w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400";
    const commonTheadClass = "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400";
    const commonThClass = "py-3 px-6";
    const commonTrClass = "border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50";
    const commonTdClass = "py-4 px-6";
    
    return (
        <div className="p-6 space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                <ArrowLeftIcon className="w-4 h-4" />
                {t('back_to_employees')}
            </button>

            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-6">
                <img src={employee.avatar} alt={employee.name} className="w-24 h-24 rounded-full ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-blue-500"/>
                <div className="flex-grow text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{employee.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{employee.role} | {employee.department}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('employee_id')}: {employee.employeeId}</p>
                </div>
                <button onClick={() => onEdit(employee)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <PencilIcon className="w-4 h-4"/>
                    {t('edit_profile')}
                </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
                 <DetailStatCard label={t('open_tasks')} value={openTasksCount} />
                 <DetailStatCard label={t('projects')} value={projectsCount} />
                 <DetailStatCard label={t('hours_logged')} value={hoursLogged} />
                 <DetailStatCard label={t('tickets')} value={ticketsCount} />
                 <DetailStatCard label={t('appreciation')} value={appreciationsReceived} />
                 <DetailStatCard label={t('late_attendance')} value={lateAttendance} />
                 <DetailStatCard label={t('leaves_taken')} value={leavesTaken} />
                 <DetailStatCard label={t('leaves_quota')} value="20" />
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-4 px-6 overflow-x-auto">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >{tab.label}</button>
                        ))}
                    </nav>
                </div>
                <div className="p-6">
                    {activeTab === 'profile' && (
                        <div>
                            <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{t('profile_info')}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                <InfoField label={t('full_name')} value={employee.name} />
                                <InfoField label={t('email')} value={employee.email} />
                                <InfoField label={t('joining_date')} value={employee.joiningDate} />
                                <InfoField label={t('designation')} value={employee.role} />
                                <InfoField label={t('department')} value={employee.department} />
                                <InfoField label={t('gender')} value={employee.gender ? t(employee.gender.toLowerCase()) : ''} />
                                <InfoField label={t('mobile')} value={employee.mobile} />
                                <InfoField label={t('language')} value={employee.language ? t(employee.language) : ''} />
                                <InfoField label={t('address')} value={employee.address} />
                                <InfoField label={t('skills')} value={employee.skills} />
                                <InfoField label={t('slack_member_id')} value={employee.slackMemberId} />
                                <InfoField label={t('employment_type')} value={employee.employmentType ? t(employee.employmentType.toLowerCase().replace('-', '_')) : undefined} />
                                <InfoField label={t('marital_status')} value={employee.maritalStatus ? t(employee.maritalStatus.toLowerCase()) : undefined} />
                                <InfoField label={t('marriage_anniversary_date')} value={employee.marriageAnniversaryDate} />
                                <InfoField label={t('work_anniversary')} value={getWorkAnniversary()} />
                                <InfoField label={t('business_address')} value={employee.businessAddress} />
                                <InfoField label={t('date_of_birth')} value={employee.dateOfBirth} />

                            </div>
                            {employee.about && (
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                     <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{t('all_about')}</h4>
                                     <p className="text-sm text-gray-600 dark:text-gray-400">{employee.about}</p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'salary' && (() => {
                        const { salaryStructure } = employee;
                        if (!salaryStructure) {
                            return <PlaceholderTabContent messageKey="no_salary_set" />;
                        }
                        
                        const gross = (salaryStructure.monthlyRate || 0) + (salaryStructure.allowances || []).reduce((acc, curr) => acc + curr.amount, 0);
                        const deductions = (salaryStructure.deductions || []).reduce((acc, curr) => acc + curr.amount, 0);
                        const net = gross - deductions;
                        const dailyRate = salaryStructure.payType === 'Monthly' ? (salaryStructure.monthlyRate || 0) / 22 : (salaryStructure.hourlyRate || 0) * 8;
                        
                        return (
                             <div>
                                <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{t('salary_structure')}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1 space-y-4">
                                        <InfoField label={t('pay_type')} value={t(salaryStructure.payType.toLowerCase())} />
                                        {salaryStructure.payType === 'Monthly' ? (
                                            <InfoField label={t('monthly_rate')} value={currencyFormatter.format(salaryStructure.monthlyRate || 0)} />
                                        ) : (
                                            <InfoField label={t('hourly_rate')} value={currencyFormatter.format(salaryStructure.hourlyRate || 0)} />
                                        )}
                                        <InfoField label={t('overtime_rate_hourly')} value={currencyFormatter.format(salaryStructure.overtimeRate || 0)} />
                                    </div>
                                    <div className="lg:col-span-1 space-y-4">
                                        <div>
                                            <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('earnings')}</h5>
                                            <ul className="space-y-1 text-sm">
                                                {salaryStructure.allowances && salaryStructure.allowances.length > 0 ? (
                                                    salaryStructure.allowances.map((item, i) => <li key={i} className="flex justify-between"><span>{item.name}</span> <span className="font-semibold">{currencyFormatter.format(item.amount)}</span></li>)
                                                ) : <p className="text-gray-400 italic">No allowances.</p>}
                                            </ul>
                                        </div>
                                         <div>
                                            <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('deductions')}</h5>
                                            <ul className="space-y-1 text-sm">
                                                {salaryStructure.deductions && salaryStructure.deductions.length > 0 ? (
                                                    salaryStructure.deductions.map((item, i) => <li key={i} className="flex justify-between"><span>{item.name}</span> <span className="font-semibold text-red-600">-{currencyFormatter.format(item.amount)}</span></li>)
                                                ) : <p className="text-gray-400 italic">No deductions.</p>}
                                            </ul>
                                        </div>
                                    </div>
                                     <div className="lg:col-span-1 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
                                        <h5 className="font-bold text-center mb-2">{t('salary_summary')}</h5>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">{t('daily_rate')}</span><span className="font-semibold">{currencyFormatter.format(dailyRate)}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500">{t('weekly_rate')}</span><span className="font-semibold">{currencyFormatter.format(dailyRate * 5)}</span></div>
                                        <div className="flex justify-between text-sm pt-2 border-t mt-2"><span className="text-gray-500">{t('gross_salary')}</span><span className="font-semibold">{currencyFormatter.format(gross)}</span></div>
                                        <div className="flex justify-between text-sm text-red-600"><span className="">{t('total_deductions')}</span><span className="font-semibold">-{currencyFormatter.format(deductions)}</span></div>
                                        <div className="flex justify-between text-base font-bold pt-2 border-t mt-2"><span className="">{t('net_salary')}</span><span className="text-green-600">{currencyFormatter.format(net)}</span></div>
                                    </div>
                                </div>
                            </div>
                        )
                    })()}
                    {activeTab === 'projects' && (() => {
                        const employeeProjects = projects.filter(p => p.team.some(m => m.avatar === employee.avatar));
                        if (employeeProjects.length === 0) return <PlaceholderTabContent messageKey="no_projects_assigned" />;
                        const statusColors = { 'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', 'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', 'Pending': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' };
                        return (
                             <div className="overflow-x-auto">
                                <table className={commonTableClass}>
                                    <thead className={commonTheadClass}><tr>
                                        <th className={commonThClass}>{t('project_name')}</th><th className={commonThClass}>{t('deadline')}</th><th className={commonThClass}>{t('progress')}</th><th className={commonThClass}>{t('status')}</th>
                                    </tr></thead>
                                    <tbody>{employeeProjects.map(p => (
                                        <tr key={p.id} className={commonTrClass}>
                                            <td className={`${commonTdClass} font-medium text-gray-800 dark:text-white`}>
                                                <button onClick={() => { setSelectedProjectId(p.id); setActivePage('projects'); }} className="hover:underline text-left">
                                                    {p.name}
                                                </button>
                                            </td>
                                            <td className={commonTdClass}>{p.deadline}</td>
                                            <td className={commonTdClass}><div className="flex items-center gap-2"><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${p.progress}%` }}></div></div><span className="text-xs font-semibold">{p.progress}%</span></div></td>
                                            <td className={commonTdClass}><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[p.status]}`}>{t(p.status.toLowerCase().replace(' ', '_'))}</span></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        );
                    })()}
                    {activeTab === 'tasks' && (() => {
                        const employeeTasks = tasks.filter(t => t.assignees?.some(a => a.name === employee.name));
                        if (employeeTasks.length === 0) return <PlaceholderTabContent messageKey="no_tasks_assigned" />;
                        const priorityColors = { 'High': 'text-red-500', 'Medium': 'text-yellow-500', 'Low': 'text-green-500' };
                        const statusColors = { 'To Do': 'bg-gray-200 text-gray-800', 'In Progress': 'bg-blue-200 text-blue-800', 'Done': 'bg-green-200 text-green-800' };
                        return (
                            <div className="overflow-x-auto">
                                <table className={commonTableClass}>
                                    <thead className={commonTheadClass}><tr>
                                        <th className={commonThClass}>{t('tasks')}</th><th className={commonThClass}>{t('due_date')}</th><th className={commonThClass}>{t('priority')}</th><th className={commonThClass}>{t('status')}</th>
                                    </tr></thead>
                                    <tbody>{employeeTasks.map(task => (
                                        <tr key={task.id} className={commonTrClass}>
                                            <td className={`${commonTdClass} font-medium text-gray-800 dark:text-white`}>
                                                <button onClick={() => { setSelectedTaskId(task.id); setActivePage('tasks'); }} className="hover:underline text-left">
                                                    {task.name}
                                                </button>
                                            </td>
                                            <td className={commonTdClass}>{task.dueDate}</td>
                                            <td className={`${commonTdClass} font-bold ${priorityColors[task.priority]}`}>{t(task.priority.toLowerCase())}</td>
                                            <td className={commonTdClass}><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[task.status]}`}>{t(task.status.toLowerCase().replace(' ', '_'))}</span></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        );
                    })()}
                     {activeTab === 'leaves' && (() => {
                        const employeeLeaves = leaveRequests.filter(l => l.employeeName === employee.name);
                        if (employeeLeaves.length === 0) return <PlaceholderTabContent messageKey="no_leave_records_found" />;
                        const statusColors = { 'Approved': 'bg-green-100 text-green-800', 'Pending': 'bg-yellow-100 text-yellow-800', 'Rejected': 'bg-red-100 text-red-800' };
                        return (
                            <div className="overflow-x-auto">
                                <table className={commonTableClass}>
                                    <thead className={commonTheadClass}><tr>
                                        <th className={commonThClass}>{t('leave_type')}</th><th className={commonThClass}>{t('leave_period')}</th><th className={commonThClass}>{t('reason')}</th><th className={commonThClass}>{t('status')}</th>
                                    </tr></thead>
                                    <tbody>{employeeLeaves.map(l => (
                                        <tr key={l.id} className={commonTrClass}>
                                            <td className={`${commonTdClass} font-medium`}>{l.leaveType}</td>
                                            <td className={commonTdClass}>{l.startDate} - {l.endDate}</td>
                                            <td className={commonTdClass}>{l.reason}</td>
                                            <td className={commonTdClass}><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[l.status]}`}>{l.status}</span></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        );
                    })()}
                    {activeTab === 'timesheet' && (() => {
                        if (employeeTimeLogs.length === 0) return <PlaceholderTabContent messageKey="no_timesheet_records_found" />;
                        return (
                             <div className="overflow-x-auto">
                                <table className={commonTableClass}>
                                    <thead className={commonTheadClass}><tr>
                                        <th className={commonThClass}>{t('project_name')}</th><th className={commonThClass}>{t('tasks')}</th><th className={commonThClass}>{t('date')}</th><th className={commonThClass}>{t('duration')}</th>
                                    </tr></thead>
                                    <tbody>{employeeTimeLogs.map(log => (
                                        <tr key={log.id} className={commonTrClass}>
                                            <td className={commonTdClass}>{log.projectName}</td><td className={commonTdClass}>{log.taskName}</td><td className={commonTdClass}>{log.date}</td><td className={`${commonTdClass} font-mono font-semibold`}>{log.duration}</td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        );
                    })()}
                     {activeTab === 'tickets' && (() => {
                        const employeeTickets = tickets.filter(t => t.assignedTo === employee.name);
                        if (employeeTickets.length === 0) return <PlaceholderTabContent messageKey="no_tickets_assigned" />;
                        const statusColors = { 'Open': 'bg-red-100 text-red-800', 'In Progress': 'bg-yellow-100 text-yellow-800', 'Closed': 'bg-green-100 text-green-800' };
                        const priorityColors = { 'High': 'text-red-500', 'Medium': 'text-yellow-500', 'Low': 'text-green-500' };
                        return (
                           <div className="overflow-x-auto">
                                <table className={commonTableClass}>
                                    <thead className={commonTheadClass}><tr>
                                        <th className={commonThClass}>{t('subject')}</th><th className={commonThClass}>{t('client_name')}</th><th className={commonThClass}>{t('date')}</th><th className={commonThClass}>{t('priority')}</th><th className={commonThClass}>{t('status')}</th>
                                    </tr></thead>
                                    <tbody>{employeeTickets.map(ticket => (
                                        <tr key={ticket.id} className={commonTrClass}>
                                            <td className={`${commonTdClass} font-medium`}>{ticket.subject}</td>
                                            <td className={commonTdClass}>{ticket.clientName}</td>
                                            <td className={commonTdClass}>{ticket.date}</td>
                                            <td className={`${commonTdClass} font-bold ${priorityColors[ticket.priority]}`}>{t(ticket.priority.toLowerCase())}</td>
                                            <td className={commonTdClass}><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[ticket.status]}`}>{t(ticket.status.toLowerCase().replace(' ', '_'))}</span></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        );
                    })()}
                    {activeTab === 'appreciation' && (() => {
                        const employeeAppreciations = appreciations.filter(a => a.to.name === employee.name);
                        const [message, setMessage] = useState('');

                        const handleSendAppreciation = (e: React.FormEvent) => {
                            e.preventDefault();
                            if (!message.trim()) return;

                            const newAppreciation: Appreciation = {
                                id: `app_${Date.now()}`,
                                from: { name: 'Shady Omar', avatar: 'https://i.pravatar.cc/150?u=shady' }, // Hardcoded sender
                                to: { name: employee.name, avatar: employee.avatar },
                                message: message.trim(),
                                date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD
                            };

                            setAppreciations(prev => [newAppreciation, ...prev]);
                            setMessage('');
                        };
                        
                        return (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{t('appreciations_received')}</h4>
                                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                        {employeeAppreciations.length > 0 ? employeeAppreciations.map(item => (
                                            <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-yellow-400">
                                                 <div className="flex items-center gap-3 mb-2">
                                                    <img src={item.from.avatar} alt={item.from.name} className="w-8 h-8 rounded-full" />
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.from.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                                                    </div>
                                                 </div>
                                                 <p className="text-sm italic text-gray-700 dark:text-gray-300">"{item.message}"</p>
                                            </div>
                                        )) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No appreciations received yet.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                                     <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                                        <GiftIcon className="w-6 h-6 text-blue-600"/>
                                        {t('give_kudos_to_employee', { employeeName: employee.name.split(' ')[0] })}
                                    </h4>
                                    <form onSubmit={handleSendAppreciation} className="space-y-4">
                                         <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('message')}</label>
                                            <textarea
                                                rows={4}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder={t('message') + '...'}
                                                className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                            <SendIcon className="w-5 h-5"/>
                                            {t('send')}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )
                    })()}

                    {activeTab === 'documents' && <PlaceholderTabContent messageKey="no_documents_found" buttonKey="add_document" onButtonClick={() => {}} />}
                    {activeTab === 'emergency_contacts' && <PlaceholderTabContent messageKey="no_emergency_contacts_found" buttonKey="add_emergency_contact" onButtonClick={() => {}} />}
                    {activeTab === 'increment_promotions' && <PlaceholderTabContent messageKey="no_increment_records_found" />}
                    {activeTab === 'activity' && <PlaceholderTabContent messageKey="no_activity_to_show" />}
                    {activeTab === 'immigration' && <PlaceholderTabContent messageKey="no_immigration_details_found" buttonKey="add_details" onButtonClick={() => {}} />}
                </div>
            </div>

        </div>
    );
}

export default EmployeeDetailView;
