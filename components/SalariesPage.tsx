import React, { useState, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Employee, Payslip, SalaryComponent, SalaryStructure, PerformanceSummary, AttendanceSummary } from '../types';
import { CreditCardIcon, XIcon as CloseIcon, PrinterIcon, DollarSignIcon, BarChartIcon, CheckSquareIcon } from './icons/Icons';
import SalaryStructureModal from './SalaryStructureModal';
import { calculateEmployeePerformance, calculateAttendanceStats } from '../lib/utils';


const PayslipDetailModal = ({ payslip, onClose }) => {
    const { t } = useTranslation();
    const { employees, appSettings, currencies, financeSettings } = useApp();
    const employee = employees.find(e => e.id === payslip.employeeId);
    
    const defaultCurrency = currencies.find(c => c.id === financeSettings.defaultCurrency) || { symbol: '₺', code: 'TRY' };
    const currencyFormatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: defaultCurrency.code });


    if (!payslip || !employee) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-center items-center p-4">
            <style>
                {`
                    @media print {
                        body * {
                           visibility: hidden;
                        }
                        #payslip-modal, #payslip-modal * {
                           visibility: visible;
                        }
                        #payslip-modal {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            border: none;
                            box-shadow: none;
                            border-radius: 0;
                            color: black !important;
                        }
                         #payslip-modal .dark-text-fix { color: black !important; }
                         #payslip-modal .dark-bg-fix { background-color: white !important; }
                        .print-hide {
                            display: none;
                        }
                    }
                `}
            </style>
            <div id="payslip-modal" className="bg-white dark:bg-gray-800 dark-bg-fix rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 print-hide">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('payslip_details')}</h3>
                    <div>
                         <button onClick={handlePrint} className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <PrinterIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <CloseIcon className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>
                <div className="p-8 flex-grow overflow-y-auto dark-text-fix">
                    <div className="flex justify-between items-start pb-4 border-b">
                        <div>
                            <img src={appSettings.companyLogo} alt="Company Logo" className="h-12 mb-2"/>
                            <h4 className="font-bold text-lg">{appSettings.companyName}</h4>
                            <p className="text-sm text-gray-500">{appSettings.businessAddress}</p>
                        </div>
                        <div className="text-right">
                             <h2 className="text-2xl font-bold uppercase text-gray-400">Payslip</h2>
                             <p className="text-sm">{t('pay_period')}: {payslip.payPeriod}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                            <h5 className="font-semibold">{t('employee_details')}</h5>
                            <p className="text-sm">{employee.name}</p>
                            <p className="text-sm">{employee.role} | {employee.department}</p>
                            <p className="text-sm">{t('joining_date')}: {employee.joiningDate}</p>
                        </div>
                    </div>
                     {/* Summaries */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><CheckSquareIcon className="w-5 h-5 text-blue-500" />{t('attendance_summary')}</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span>{t('days_worked')}:</span> <span className="font-semibold">{payslip.attendanceSummary.daysWorked}</span></div>
                                <div className="flex justify-between"><span>{t('late_days')}:</span> <span className="font-semibold">{payslip.attendanceSummary.lateDays}</span></div>
                                <div className="flex justify-between"><span>{t('total_lateness_minutes')}:</span> <span className="font-semibold">{payslip.attendanceSummary.totalLatenessMinutes}</span></div>
                            </div>
                        </div>
                         <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><BarChartIcon className="w-5 h-5 text-purple-500" />{t('performance_summary')}</h4>
                             <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span>{t('kpi_score')}:</span> <span className="font-semibold">{payslip.performanceSummary.kpiScore.toFixed(2)} / 5.00</span></div>
                                <div className="flex justify-between"><span>{t('performance_bonus')}:</span> <span className="font-semibold text-green-600">{currencyFormatter.format(payslip.performanceSummary.performanceBonus)}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-lg font-bold text-green-600 border-b-2 border-green-500 pb-1 mb-2">{t('earnings')}</h4>
                            <table className="w-full text-sm">
                                <tbody>
                                    {payslip.earnings.map((item, i) => (
                                        <tr key={i}>
                                            <td className="py-1.5">{item.name}</td>
                                            <td className="py-1.5 text-right font-semibold">{currencyFormatter.format(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                         <div>
                            <h4 className="text-lg font-bold text-red-600 border-b-2 border-red-500 pb-1 mb-2">{t('deductions')}</h4>
                             <table className="w-full text-sm">
                                <tbody>
                                    {payslip.deductions.map((item, i) => (
                                        <tr key={i}>
                                            <td className="py-1.5">{item.name}</td>
                                            <td className="py-1.5 text-right font-semibold">({currencyFormatter.format(item.amount)})</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t-2 border-gray-300 dark:border-gray-600 text-right">
                        <div className="inline-block text-sm text-right space-y-2">
                             <div className="flex justify-between gap-8">
                                <span className="font-semibold">{t('gross_salary')}:</span>
                                <span>{currencyFormatter.format(payslip.grossSalary)}</span>
                            </div>
                            <div className="flex justify-between gap-8">
                                <span className="font-semibold">{t('total_deductions')}:</span>
                                <span>({currencyFormatter.format(payslip.totalDeductions)})</span>
                            </div>
                            <div className="flex justify-between gap-8 font-bold text-lg pt-2 border-t mt-2">
                                <span>{t('net_salary')}:</span>
                                <span className="text-green-600">{currencyFormatter.format(payslip.netSalary)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SalariesPage: React.FC = () => {
    const { t } = useTranslation();
    const { employees, setEmployees, payslips, setPayslips, currencies, financeSettings, tasks, attendanceRecords, attendanceShifts, kpis, manualKpiScores } = useApp();
    const [activeTab, setActiveTab] = useState('salaries');

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [viewingPayslip, setViewingPayslip] = useState<Payslip | null>(null);
    
    const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const defaultCurrency = currencies.find(c => c.id === financeSettings.defaultCurrency) || { symbol: '₺', code: 'TRY' };
    const currencyFormatter = useMemo(() => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: defaultCurrency.code }), [defaultCurrency.code]);
    
    const handleManageSalary = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsSalaryModalOpen(true);
    };

    const handleSaveSalary = (employeeId: string, salaryStructure: SalaryStructure) => {
        setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, salaryStructure } : emp));
        setIsSalaryModalOpen(false);
        setSelectedEmployee(null);
    };

    const handleGeneratePayslips = () => {
        const allPerformanceData = employees.map(employee => {
            const { overallScore } = calculateEmployeePerformance(employee, tasks, attendanceRecords, attendanceShifts, kpis, manualKpiScores, employees);
            return { employeeId: employee.id, overallScore };
        });

        const totalScoreSum = allPerformanceData.reduce((acc, e) => acc + e.overallScore, 0);

        const generatedPayslips: Payslip[] = employees
            .filter(employee => employee.salaryStructure)
            .map(employee => {
                const { salaryStructure } = employee;
                const performance = allPerformanceData.find(p => p.employeeId === employee.id)!;
                const attendanceSummary = calculateAttendanceStats(employee, attendanceRecords, attendanceShifts, selectedYear, selectedMonth);
                
                const performanceBonus = totalScoreSum > 0 ? (performance.overallScore / totalScoreSum) * financeSettings.incentiveBonusPool : 0;
                
                const performanceSummary: PerformanceSummary = {
                    kpiScore: performance.overallScore,
                    performanceBonus: performanceBonus
                };

                let earnings: SalaryComponent[] = [];
                let deductions: SalaryComponent[] = [...(salaryStructure!.deductions || [])];

                if (salaryStructure!.payType === 'Monthly' && salaryStructure!.monthlyRate) {
                    earnings.push({ name: t('monthly_rate'), amount: salaryStructure!.monthlyRate });
                } else if (salaryStructure!.payType === 'Hourly' && salaryStructure!.hourlyRate) {
                    earnings.push({ name: `${t('hourly_rate')} (176 hrs)`, amount: salaryStructure!.hourlyRate * 176 });
                }
                
                if (salaryStructure!.allowances) {
                    earnings = [...earnings, ...salaryStructure!.allowances];
                }

                if (performanceBonus > 0) {
                    earnings.push({ name: t('performance_bonus'), amount: performanceBonus });
                }
                if (attendanceSummary.latenessDeduction > 0) {
                    deductions.push({ name: t('lateness_deduction'), amount: attendanceSummary.latenessDeduction });
                }

                const grossSalary = earnings.reduce((acc, item) => acc + item.amount, 0);
                const totalDeductions = deductions.reduce((acc, item) => acc + item.amount, 0);
                const netSalary = grossSalary - totalDeductions;

                return {
                    id: `payslip-${employee.id}-${selectedYear}-${selectedMonth}`,
                    employeeId: employee.id,
                    payPeriod: `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`,
                    grossSalary,
                    totalDeductions,
                    netSalary,
                    earnings,
                    deductions,
                    status: 'Pending',
                    performanceSummary,
                    attendanceSummary
                };
            });
        
        setPayslips(generatedPayslips);
    };
    
    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }));
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    
    const statusColors = {
        'Paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    return (
        <div className="p-6 space-y-6">
            {viewingPayslip && <PayslipDetailModal payslip={viewingPayslip} onClose={() => setViewingPayslip(null)} />}
            {isSalaryModalOpen && selectedEmployee && (
                <SalaryStructureModal 
                    isOpen={isSalaryModalOpen}
                    onClose={() => setIsSalaryModalOpen(false)}
                    onSave={handleSaveSalary}
                    employee={selectedEmployee}
                />
            )}
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('salaries_payroll')}</h2>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                 <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-4 px-6">
                        <button onClick={() => setActiveTab('salaries')} className={`py-4 px-1 text-sm font-medium ${activeTab === 'salaries' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t('employee_salaries')}</button>
                        <button onClick={() => setActiveTab('payroll')} className={`py-4 px-1 text-sm font-medium ${activeTab === 'payroll' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t('payroll_runs')}</button>
                    </nav>
                </div>

                {activeTab === 'salaries' && (
                    <div className="p-4 sm:p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="py-3 px-4">{t('employees')}</th>
                                        <th className="py-3 px-4">{t('pay_type')}</th>
                                        <th className="py-3 px-4">{t('net_salary')}</th>
                                        <th className="py-3 px-4 text-center">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {employees.map(employee => {
                                        const { salaryStructure } = employee;
                                        let netSalaryDisplay = <span className="text-gray-400 italic">{t('no_salary_set')}</span>;
                                        if (salaryStructure) {
                                            const gross = (salaryStructure.monthlyRate || (salaryStructure.hourlyRate || 0) * 176) + (salaryStructure.allowances || []).reduce((acc, curr) => acc + curr.amount, 0);
                                            const deductions = (salaryStructure.deductions || []).reduce((acc, curr) => acc + curr.amount, 0);
                                            netSalaryDisplay = <span className="font-semibold text-green-600">{currencyFormatter.format(gross - deductions)}</span>;
                                        }

                                        return (
                                            <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full" />
                                                        <div>
                                                            <div className="font-medium text-gray-800 dark:text-white">{employee.name}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{employee.role}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">{salaryStructure ? t(salaryStructure.payType.toLowerCase()) : '-'}</td>
                                                <td className="py-3 px-4">{netSalaryDisplay}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <button onClick={() => handleManageSalary(employee)} className="text-blue-600 hover:underline">{t('manage_salary')}</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'payroll' && (
                     <div className="p-4 sm:p-6 space-y-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {months.map((month, index) => <option key={month} value={index}>{month}</option>)}
                                </select>
                                <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                                </select>
                            </div>
                            <button onClick={handleGeneratePayslips} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">{t('generate_payroll_run')}</button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                               <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                   <tr>
                                       <th className="py-3 px-4">{t('employees')}</th>
                                       <th className="py-3 px-4">{t('performance_bonus')}</th>
                                       <th className="py-3 px-4">{t('lateness_deduction')}</th>
                                       <th className="py-3 px-4">{t('net_salary')}</th>
                                       <th className="py-3 px-4">{t('status')}</th>
                                       <th className="py-3 px-4 text-center">{t('actions')}</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                   {payslips.length > 0 ? payslips.map(payslip => {
                                       const employee = employees.find(e => e.id === payslip.employeeId);
                                       if (!employee) return null;

                                       return (
                                           <tr key={payslip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                               <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                       <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full" />
                                                       <div>
                                                           <div className="font-medium text-gray-800 dark:text-white">{employee.name}</div>
                                                           <div className="text-xs text-gray-500 dark:text-gray-400">{employee.role}</div>
                                                       </div>
                                                   </div>
                                               </td>
                                               <td className="py-3 px-4 font-semibold text-green-600">{currencyFormatter.format(payslip.performanceSummary.performanceBonus)}</td>
                                               <td className="py-3 px-4 font-semibold text-red-600">({currencyFormatter.format(payslip.attendanceSummary.latenessDeduction)})</td>
                                               <td className="py-3 px-4 font-bold text-green-700 dark:text-green-500">{currencyFormatter.format(payslip.netSalary)}</td>
                                               <td className="py-3 px-4">
                                                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[payslip.status]}`}>{t(payslip.status.toLowerCase())}</span>
                                               </td>
                                               <td className="py-3 px-4 text-center">
                                                   <button onClick={() => setViewingPayslip(payslip)} className="text-blue-600 hover:underline">{t('view_payslip')}</button>
                                               </td>
                                           </tr>
                                       )
                                   }) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">{t('no')} {t('payroll_runs').toLowerCase()}</td>
                                    </tr>
                                   )}
                               </tbody>
                           </table>
                       </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalariesPage;
