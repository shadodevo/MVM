import React, { useState, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { DollarSignIcon } from './icons/Icons';
import { KPI } from '../types';

// Helper function to parse duration strings like "8h 30m" into total minutes
const parseDurationStringToMinutes = (durationStr?: string): number => {
    if (!durationStr || !durationStr.includes('h') && !durationStr.includes('m')) return 0;
    let totalMinutes = 0;
    const hoursMatch = durationStr.match(/(\d+)\s*h/);
    const minutesMatch = durationStr.match(/(\d+)\s*m/);
    if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;
    if (minutesMatch) totalMinutes += parseInt(minutesMatch[1], 10);
    return totalMinutes;
};

const PerformancePage: React.FC = () => {
    const { t } = useTranslation();
    const { employees, tasks, attendanceRecords, attendanceShifts, kpis, manualKpiScores, setManualKpiScores, financeSettings, setActivePage } = useApp();
    const bonusPool = financeSettings.incentiveBonusPool;

    const handleManualScoreChange = (employeeId: string, kpiId: string, score: string) => {
        const newScore = Math.max(0, Math.min(5, parseFloat(score) || 0));
        setManualKpiScores(prev => ({
            ...prev,
            [employeeId]: {
                ...prev[employeeId],
                [kpiId]: newScore
            }
        }));
    };

    const employeePerformanceData = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const productivityStats = employees.map(employee => {
            return tasks.filter(task =>
                task.status === 'Done' &&
                task.assigneeIds?.includes(employee.id) &&
                task.completedOn && new Date(task.completedOn) > thirtyDaysAgo
            ).length;
        });
        const maxProductivity = Math.max(...productivityStats, 1);

        const performance = employees.map((employee, index) => {
            // Automatic KPI calculations
            const automaticScores: Record<string, number> = {};

            // Punctuality
            const defaultShift = attendanceShifts.find(s => s.isDefault);
            let punctualityScore = 5;
            if (defaultShift) {
                const shiftTimeParts = defaultShift.startTime.split(/:| /);
                let shiftStartHour = parseInt(shiftTimeParts[0]);
                const shiftStartMinute = parseInt(shiftTimeParts[1]);
                if (defaultShift.startTime.includes('PM') && shiftStartHour !== 12) shiftStartHour += 12;
                const shiftStartTimeInMinutes = shiftStartHour * 60 + shiftStartMinute;
                
                const relevantRecords = attendanceRecords.filter(r => r.employeeId === employee.id && r.checkInTime > thirtyDaysAgo.getTime());
                if (relevantRecords.length > 0) {
                    const totalLateness = relevantRecords.reduce((acc, record) => {
                        const checkInTime = new Date(record.checkInTime);
                        const checkInMinutes = checkInTime.getHours() * 60 + checkInTime.getMinutes();
                        const lateness = Math.max(0, checkInMinutes - shiftStartTimeInMinutes - defaultShift.lateMarkAfter);
                        return acc + lateness;
                    }, 0);
                    const avgLateness = totalLateness / relevantRecords.length;
                    punctualityScore = Math.max(0, 5 - (avgLateness / 10)); // Scaled to 0-5
                }
            }
            automaticScores['kpi_punctuality'] = punctualityScore;

            // Task Efficiency
            const employeeTasks = tasks.filter(task => task.status === 'Done' && task.assigneeIds?.includes(employee.id));
            const totalEstimated = employeeTasks.reduce((acc, task) => acc + parseDurationStringToMinutes(task.estimatedTime), 0);
            const totalLogged = employeeTasks.reduce((acc, task) => acc + parseDurationStringToMinutes(task.hoursLogged), 0);
            let efficiencyScore = 2.5;
            if (totalLogged > 0) {
                efficiencyScore = Math.min(5, (totalEstimated / totalLogged) * 5); // Scaled to 0-5
            } else if (totalEstimated > 0) {
                efficiencyScore = 0;
            }
            automaticScores['kpi_efficiency'] = efficiencyScore;

            // Productivity
            const productivity = productivityStats[index];
            const productivityScore = (productivity / maxProductivity) * 5; // Scaled to 0-5
            automaticScores['kpi_productivity'] = productivityScore;
            
            // Calculate overall score based on configured KPIs
            let totalWeightedScore = 0;
            let totalWeight = 0;
            kpis.forEach(kpi => {
                let score = 0;
                if (kpi.type === 'automatic') {
                    score = automaticScores[kpi.id] ?? 0;
                } else { // manual
                    score = manualKpiScores[employee.id]?.[kpi.id] ?? 0;
                }
                totalWeightedScore += score * kpi.weight;
                totalWeight += kpi.weight;
            });
            const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

            return { ...employee, automaticScores, overallScore };
        });

        const totalScoreSum = performance.reduce((acc, e) => acc + e.overallScore, 0);
        return performance.map(e => ({
            ...e,
            incentiveBonus: totalScoreSum > 0 ? (e.overallScore / totalScoreSum) * bonusPool : 0,
        }));

    }, [employees, tasks, attendanceRecords, attendanceShifts, kpis, manualKpiScores, bonusPool]);

    const getScoreColor = (score: number) => {
        if (score >= 4) return 'text-green-600 dark:text-green-400';
        if (score >= 2.5) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('employee_kpis')}</h2>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <DollarSignIcon className="w-8 h-8 text-green-500" />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('total_incentive_pool')}</label>
                        <span className="text-2xl font-bold text-gray-800 dark:text-white">₺{bonusPool.toLocaleString('tr-TR')}</span>
                    </div>
                </div>
                <button onClick={() => setActivePage('settings')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">{t('edit_in_settings')}</button>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="py-3 px-4 min-w-[200px]">{t('employees')}</th>
                            {kpis.map(kpi => (
                               <th key={kpi.id} className="py-3 px-4 text-center">{t(kpi.nameKey)} ({kpi.weight}%)</th>
                            ))}
                            <th className="py-3 px-4 text-center">{t('overall_score')}</th>
                            <th className="py-3 px-4 text-center">{t('incentive_bonus')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {employeePerformanceData.map(emp => (
                            <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="font-medium text-gray-800 dark:text-white">{emp.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{emp.role}</div>
                                        </div>
                                    </div>
                                </td>
                                {kpis.map(kpi => (
                                    <td key={kpi.id} className="py-3 px-4 text-center">
                                        {kpi.type === 'automatic' ? (
                                            <span className={`font-bold text-lg ${getScoreColor(emp.automaticScores[kpi.id] ?? 0)}`}>
                                                {(emp.automaticScores[kpi.id] ?? 0).toFixed(1)}
                                            </span>
                                        ) : (
                                            <input 
                                                type="number" 
                                                min="0" max="5" step="0.1"
                                                value={manualKpiScores[emp.id]?.[kpi.id] || ''}
                                                onChange={(e) => handleManualScoreChange(emp.id, kpi.id, e.target.value)}
                                                className="w-16 text-center bg-gray-100 dark:bg-gray-700 rounded-md p-1 font-bold text-lg"
                                            />
                                        )}
                                    </td>
                                ))}
                                <td className={`py-3 px-4 text-center font-bold text-lg ${getScoreColor(emp.overallScore)}`}>{emp.overallScore.toFixed(1)}</td>
                                <td className="py-3 px-4 text-center font-semibold text-green-600">₺{emp.incentiveBonus.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PerformancePage;