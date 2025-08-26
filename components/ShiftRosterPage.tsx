import React, { useState, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';

// Helper function to get the start of the week (Monday)
const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    d.setHours(0, 0, 0, 0);
    return new Date(d.setDate(diff));
};

const ShiftRosterPage: React.FC = () => {
    const { t } = useTranslation();
    const { employees, attendanceShifts, language } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());

    const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate]);

    const weekDates = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            return date;
        });
    }, [weekStart]);

    const changeWeek = (offset: number) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + offset * 7);
            return newDate;
        });
    };
    
    // Create a color map for shifts
    const shiftColors = useMemo(() => {
        const colors = [
            'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
            'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
            'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        ];
        const map: { [key: string]: string } = {};
        attendanceShifts.forEach((shift, index) => {
            map[shift.id] = colors[index % colors.length];
        });
        map['off'] = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        return map;
    }, [attendanceShifts]);

    // Mock employee shift assignments for demonstration
    const employeeShiftAssignments = useMemo(() => {
        if (attendanceShifts.length === 0) return {};
        const assignments: { [employeeId: string]: string } = {};
        employees.forEach((emp, index) => {
            assignments[emp.id] = attendanceShifts[index % attendanceShifts.length].id;
        });
        return assignments;
    }, [employees, attendanceShifts]);

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };
    
    const monthName = weekStart.toLocaleDateString(language, { month: 'long', year: 'numeric' });

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('weekly_shift_roster')}</h2>
                <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <button onClick={() => changeWeek(-1)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"><ChevronLeftIcon className="w-5 h-5"/></button>
                    <span className="font-semibold text-center w-48 text-gray-800 dark:text-white">{monthName}</span>
                    <button onClick={() => changeWeek(1)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"><ChevronRightIcon className="w-5 h-5"/></button>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400 border-collapse">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6 text-left sticky left-0 bg-gray-50 dark:bg-gray-700 z-10 min-w-[250px]">{t('employees')}</th>
                                {weekDates.map(date => (
                                    <th key={date.toISOString()} scope="col" className={`py-3 px-2 min-w-[120px] ${isToday(date) ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}>
                                        <div>{date.toLocaleDateString(language, { weekday: 'short' })}</div>
                                        <div className="font-bold text-base text-gray-800 dark:text-white">{date.getDate()}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(employee => {
                                const assignedShiftId = employeeShiftAssignments[employee.id];
                                const shift = attendanceShifts.find(s => s.id === assignedShiftId);

                                return (
                                <tr key={employee.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="py-4 px-6 text-left sticky left-0 bg-white dark:bg-gray-800 z-10">
                                         <div className="flex items-center gap-3">
                                            <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <div className="font-medium text-gray-800 dark:text-white">{employee.name}</div>
                                                <div className="text-xs text-gray-500">{employee.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {weekDates.map(date => {
                                        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }) as any;
                                        
                                        if (!shift) {
                                            return <td key={date.toISOString()} className={`py-4 px-2 ${isToday(date) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>-</td>;
                                        }

                                        const isWorkDay = shift.officeDays.includes(dayName);
                                        const shiftText = isWorkDay ? `${shift.startTime} - ${shift.endTime}` : t('day_off');
                                        const colorClass = isWorkDay ? shiftColors[shift.id] : shiftColors['off'];

                                        return (
                                        <td key={date.toISOString()} className={`py-4 px-2 ${isToday(date) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                            <span className={`px-2 py-1.5 text-xs font-semibold rounded-md ${colorClass}`}>
                                                {shiftText}
                                            </span>
                                        </td>
                                        );
                                    })}
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShiftRosterPage;