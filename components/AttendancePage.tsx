import React, { useState, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { CheckIcon, XIcon, ClockIcon, PlaneIcon, GiftIcon, SlashIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon, MapPinIcon } from './icons/Icons';

// Mock attendance data generator that now considers approved leaves
const generateAttendanceData = (employees, year, month, leaveRequests) => {
    const data = {};
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const statuses = ['P', 'P', 'P', 'P', 'P', 'P', 'A', 'L', 'HD'];

    employees.forEach(emp => {
        data[emp.id] = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            currentDate.setHours(0,0,0,0);

            // Check for approved leave
            const approvedLeave = leaveRequests.find(req => {
                if (req.employeeId !== emp.id || req.status !== 'Approved') return false;
                
                const startDate = new Date(req.startDate);
                const endDate = new Date(req.endDate);
                startDate.setHours(0,0,0,0);
                endDate.setHours(0,0,0,0);

                return currentDate >= startDate && currentDate <= endDate;
            });

            if (approvedLeave) {
                data[emp.id].push('LV');
                continue;
            }

            // Check for weekends
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 5 || dayOfWeek === 6) { // Fri, Sat are weekends in UAE
                data[emp.id].push('O');
            } else {
                data[emp.id].push(statuses[Math.floor(Math.random() * statuses.length)]);
            }
        }
    });
    return data;
};

const AttendancePage: React.FC = () => {
    const { t } = useTranslation();
    const { employees, departments, attendanceRecords, leaveRequests } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());

    const mockData = useMemo(() => {
        return generateAttendanceData(employees, currentDate.getFullYear(), currentDate.getMonth(), leaveRequests);
    }, [employees, currentDate, leaveRequests]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getDayName = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return date.toLocaleDateString(t('language') === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' });
    };
    
    const changeMonth = (offset) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const statusMap = {
        'P': { icon: <CheckIcon className="w-4 h-4 text-green-600" />, tooltip: t('present'), color: 'bg-green-100 dark:bg-green-900/50' },
        'A': { icon: <XIcon className="w-4 h-4 text-red-600" />, tooltip: t('absent'), color: 'bg-red-100 dark:bg-red-900/50' },
        'L': { icon: <ClockIcon className="w-4 h-4 text-yellow-600" />, tooltip: t('late'), color: 'bg-yellow-100 dark:bg-yellow-900/50' },
        'LV': { icon: <PlaneIcon className="w-4 h-4 text-blue-600" />, tooltip: t('on_leave'), color: 'bg-blue-100 dark:bg-blue-900/50' },
        'HD': { icon: <SlashIcon className="w-4 h-4 text-orange-600" />, tooltip: t('half_day'), color: 'bg-orange-100 dark:bg-orange-900/50' },
        'H': { icon: <GiftIcon className="w-4 h-4 text-purple-600" />, tooltip: t('holiday'), color: 'bg-purple-100 dark:bg-purple-900/50' },
        'O': { icon: <span className="text-gray-400">-</span>, tooltip: t('day_off'), color: 'bg-gray-200 dark:bg-gray-700/50' },
    };

    const legendItems = [
        { labelKey: 'present', icon: statusMap['P'].icon },
        { labelKey: 'absent', icon: statusMap['A'].icon },
        { labelKey: 'late', icon: statusMap['L'].icon },
        { labelKey: 'on_leave', icon: statusMap['LV'].icon },
        { labelKey: 'half_day', icon: statusMap['HD'].icon },
        { labelKey: 'holiday', icon: statusMap['H'].icon },
        { labelKey: 'day_off', icon: statusMap['O'].icon },
    ];


    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('attendance')}</h2>

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center gap-2">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeftIcon className="w-6 h-6"/></button>
                    <span className="font-bold text-lg">{currentDate.toLocaleString(t('language') === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRightIcon className="w-6 h-6"/></button>
                </div>
                 <div className="flex items-center gap-2 flex-wrap">
                    <select className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>{t('all_departments')}</option>
                        {departments.map(d => <option key={d.id}>{d.name}</option>)}
                    </select>
                     <div className="relative">
                        <SearchIcon className="absolute top-1/2 left-3 rtl:left-auto rtl:right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder={t('employees')} className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 ps-10 pe-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">{t('export')}</button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">{t('note')}:</span>
                    {legendItems.map(item => (
                        <div key={item.labelKey} className="flex items-center gap-2">
                            <div className="w-5 h-5 flex items-center justify-center">{item.icon}</div>
                            <span>{t(item.labelKey)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                            <th className="sticky left-0 rtl:right-0 bg-gray-50 dark:bg-gray-700 p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[250px]">{t('employees')}</th>
                            {daysArray.map(day => (
                                <th key={day} className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase min-w-[60px]">
                                    <div>{day}</div>
                                    <div>{getDayName(day)}</div>
                                </th>
                            ))}
                            <th className="p-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase min-w-[80px]">{t('total')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {employees.map(employee => {
                             const presentCount = mockData[employee.id]?.filter(s => s === 'P' || s === 'HD').length || 0;
                             return (
                                <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="sticky left-0 rtl:right-0 bg-white dark:bg-gray-800 p-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full" src={employee.avatar} alt={employee.name} />
                                            <div className="ms-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{employee.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {daysArray.map(day => {
                                        const status = mockData[employee.id]?.[day - 1] || 'O';
                                        return (
                                            <td key={day} className={`p-2 text-center whitespace-nowrap text-sm text-gray-500`}>
                                                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${statusMap[status].color}`} title={statusMap[status].tooltip}>
                                                    {statusMap[status].icon}
                                                </div>
                                            </td>
                                        )
                                    })}
                                    <td className="p-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900 dark:text-white">
                                        {presentCount} / {daysInMonth}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md mt-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('attendance_records')}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('employees')}</th>
                                <th scope="col" className="py-3 px-6">{t('date')}</th>
                                <th scope="col" className="py-3 px-6">{t('check_in')}</th>
                                <th scope="col" className="py-3 px-6">{t('check_out')}</th>
                                <th scope="col" className="py-3 px-6">{t('hours_worked')}</th>
                                <th scope="col" className="py-3 px-6">{t('location')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map((record) => {
                                const employee = employees.find(e => e.id === record.employeeId);
                                if (!employee) return null;

                                const checkIn = new Date(record.checkInTime);
                                const checkOut = record.checkOutTime ? new Date(record.checkOutTime) : null;
                                
                                const durationMs = checkOut ? checkOut.getTime() - checkIn.getTime() : 0;
                                const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                                const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

                                return (
                                    <tr key={record.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <img src={employee.avatar} className="w-10 h-10 rounded-full" alt={employee.name} />
                                                <span className="font-medium text-gray-800 dark:text-white">{employee.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">{checkIn.toLocaleDateString()}</td>
                                        <td className="py-4 px-6">{checkIn.toLocaleTimeString()}</td>
                                        <td className="py-4 px-6">{checkOut ? checkOut.toLocaleTimeString() : '-'}</td>
                                        <td className="py-4 px-6">{checkOut ? `${durationHours}h ${durationMinutes}m` : '-'}</td>
                                        <td className="py-4 px-6">
                                            <a 
                                                href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:underline"
                                            >
                                                <MapPinIcon className="w-4 h-4" />
                                                <span>{t(record.locationType)}</span>
                                            </a>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;