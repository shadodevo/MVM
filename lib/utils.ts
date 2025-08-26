import { Project, Task, Employee, AttendanceRecord, AttendanceShift, KPI, SalaryStructure } from '../types';

export const calculateProjectStats = (project: Project, allTasks: Task[]): { progress: number; status: Project['status'] } => {
    const projectTasks = allTasks.filter(task => task.projectId === project.id);
    
    if (projectTasks.length === 0) {
        return { progress: 0, status: 'Pending' };
    }

    const doneTasksCount = projectTasks.filter(task => task.status === 'Done').length;
    const progress = Math.round((doneTasksCount / projectTasks.length) * 100);

    let status: Project['status'];

    if (progress === 100) {
        status = 'Completed';
    } else if (projectTasks.every(task => task.status === 'To Do')) {
        status = 'Pending';
    } else {
        status = 'In Progress';
    }

    return { progress, status };
};

export const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || rows.length === 0) {
        return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
        keys.join(separator) +
        '\n' +
        rows.map(row => {
            return keys.map(k => {
                let cell = row[k] === null || row[k] === undefined ? '' : row[k];
                cell = cell instanceof Date
                    ? cell.toLocaleString()
                    : cell.toString().replace(/"/g, '""');
                if (cell.search(/("|,|\n)/g) >= 0) {
                    cell = `"${cell}"`;
                }
                return cell;
            }).join(separator);
        }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// --- Performance Calculation ---
const parseDurationStringToMinutes = (durationStr?: string): number => {
    if (!durationStr || !durationStr.match(/\d/)) return 0;
    let totalMinutes = 0;
    const hoursMatch = durationStr.match(/(\d+)\s*h/);
    const minutesMatch = durationStr.match(/(\d+)\s*m/);
    if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;
    if (minutesMatch) totalMinutes += parseInt(minutesMatch[1], 10);
    return totalMinutes;
};

export const calculateEmployeePerformance = (
    employee: Employee,
    allTasks: Task[],
    allAttendanceRecords: AttendanceRecord[],
    allAttendanceShifts: AttendanceShift[],
    allKpis: KPI[],
    manualKpiScores: Record<string, Record<string, number>>,
    allEmployees: Employee[],
) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const automaticScores: Record<string, number> = {};

    // Punctuality
    const defaultShift = allAttendanceShifts.find(s => s.isDefault);
    let punctualityScore = 5;
    if (defaultShift) {
        const shiftTimeParts = defaultShift.startTime.split(/:| /);
        let shiftStartHour = parseInt(shiftTimeParts[0]);
        const shiftStartMinute = parseInt(shiftTimeParts[1]);
        if (defaultShift.startTime.includes('PM') && shiftStartHour !== 12) shiftStartHour += 12;
        const shiftStartTimeInMinutes = shiftStartHour * 60 + shiftStartMinute;
        
        const relevantRecords = allAttendanceRecords.filter(r => r.employeeId === employee.id && r.checkInTime > thirtyDaysAgo.getTime());
        if (relevantRecords.length > 0) {
            const totalLateness = relevantRecords.reduce((acc, record) => {
                const checkInTime = new Date(record.checkInTime);
                const checkInMinutes = checkInTime.getHours() * 60 + checkInTime.getMinutes();
                const lateness = Math.max(0, checkInMinutes - shiftStartTimeInMinutes - defaultShift.lateMarkAfter);
                return acc + lateness;
            }, 0);
            const avgLateness = totalLateness / relevantRecords.length;
            punctualityScore = Math.max(0, 5 - (avgLateness / 10));
        }
    }
    automaticScores['kpi_punctuality'] = punctualityScore;

    // Task Efficiency & Productivity
    const employeeTasks = allTasks.filter(task => task.status === 'Done' && task.assigneeIds?.includes(employee.id) && task.completedOn && new Date(task.completedOn) > thirtyDaysAgo);
    const totalEstimated = employeeTasks.reduce((acc, task) => acc + parseDurationStringToMinutes(task.estimatedTime), 0);
    const totalLogged = employeeTasks.reduce((acc, task) => acc + parseDurationStringToMinutes(task.hoursLogged), 0);
    let efficiencyScore = 2.5;
    if (totalLogged > 0) {
        efficiencyScore = Math.min(5, (totalEstimated / totalLogged) * 5);
    } else if (totalEstimated > 0) {
        efficiencyScore = 0;
    }
    automaticScores['kpi_efficiency'] = efficiencyScore;

    const productivityStats = allEmployees.map(emp => allTasks.filter(task => task.status === 'Done' && task.assigneeIds?.includes(emp.id) && task.completedOn && new Date(task.completedOn) > thirtyDaysAgo).length);
    const maxProductivity = Math.max(...productivityStats, 1);
    const productivityScore = (employeeTasks.length / maxProductivity) * 5;
    automaticScores['kpi_productivity'] = productivityScore;

    // Calculate overall score
    let totalWeightedScore = 0;
    let totalWeight = 0;
    allKpis.forEach(kpi => {
        let score = 0;
        if (kpi.type === 'automatic') {
            score = automaticScores[kpi.id] ?? 0;
        } else {
            score = manualKpiScores[employee.id]?.[kpi.id] ?? 0;
        }
        totalWeightedScore += score * kpi.weight;
        totalWeight += kpi.weight;
    });
    const overallScore = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;

    return { overallScore, automaticScores };
};

// --- Attendance Calculation for Payroll ---
const parseShiftTime = (timeStr: string): number => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

export const calculateAttendanceStats = (
    employee: Employee,
    allAttendanceRecords: AttendanceRecord[],
    shifts: AttendanceShift[],
    year: number,
    month: number
) => {
    const shift = shifts.find(s => s.isDefault);
    if (!shift || !employee.salaryStructure) {
        return { daysWorked: 0, lateDays: 0, totalLatenessMinutes: 0, latenessDeduction: 0 };
    }

    const records = allAttendanceRecords.filter(r => {
        const d = new Date(r.checkInTime);
        return r.employeeId === employee.id && d.getFullYear() === year && d.getMonth() === month;
    });

    const shiftStartMinutes = parseShiftTime(shift.startTime);
    let lateDays = 0;
    let totalLatenessMinutes = 0;
    
    records.forEach(record => {
        const checkIn = new Date(record.checkInTime);
        const dayName = checkIn.toLocaleDateString('en-US', { weekday: 'long' }) as any;
        
        if (shift.officeDays.includes(dayName)) {
            const checkInMinutes = checkIn.getHours() * 60 + checkIn.getMinutes();
            const lateness = checkInMinutes - (shiftStartMinutes + shift.lateMarkAfter);
            if (lateness > 0) {
                lateDays++;
                totalLatenessMinutes += lateness;
            }
        }
    });

    let latenessDeduction = 0;
    if (totalLatenessMinutes > 0) {
        const { payType, monthlyRate, hourlyRate } = employee.salaryStructure;
        let perMinuteRate = 0;

        if (payType === 'Monthly' && monthlyRate) {
            // Mon-Fri: 9.5 hours/day, Sat: 4.5 hours
            const weeklyMinutes = (5 * 9.5 * 60) + (1 * 4.5 * 60); // 2850 + 270 = 3120 mins/week
            const monthlyMinutes = weeklyMinutes * 4.33; // Approx weeks in a month
            perMinuteRate = monthlyRate / monthlyMinutes;
        } else if (payType === 'Hourly' && hourlyRate) {
            perMinuteRate = hourlyRate / 60;
        }

        latenessDeduction = totalLatenessMinutes * perMinuteRate;
    }

    return {
        daysWorked: records.length,
        lateDays,
        totalLatenessMinutes: Math.round(totalLatenessMinutes),
        latenessDeduction,
    };
};
