import { Employee, Project, Task, Appreciation, Customer, Contact, Order, Deal, TimeLog, LeaveRequest, Holiday, Department, Designation, ChatMessage, ChatConversation, Vendor, Product, WarehouseItem, Ticket, NotificationSetting, Role, Notification, Permission, CustomField, Contract, Invoice, Estimate, Proposal, Payment, CreditNote, Expense, BankAccount, Event, KnowledgeBaseArticle, AppSettings, Currency, ThemeSettings, ModuleStatus, SecuritySettings, FinanceSettings, ProjectSettings, TaskSettings, AttendanceShift, LeaveType, NavItem, AttendanceRecord, KPI, Payslip, CustomTable } from '../types';
import { 
    HomeIcon, CalendarIcon, TrendingUpIcon, UsersIcon, ArchiveIcon, TruckIcon, BriefcaseIcon, 
    DollarSignIcon, CreditCardIcon, BoxIcon, ShoppingCartIcon, LifeBuoyIcon, SpeakerIcon, 
    MessageSquareIcon, ClipboardIcon, RssIcon, BarChartIcon, CheckSquareIcon, ClockIcon, GiftIcon, TagIcon, ContactIcon,
    PlaneIcon, BuildingIcon, FilePlusIcon, FileTextIcon, GridIcon
} from '../components/icons/Icons';


export const mockNavItems: NavItem[] = [
  { id: 'dashboard', labelKey: 'dashboard', icon: HomeIcon, visible: true },
  { id: 'my_calendar', labelKey: 'my_calendar', icon: CalendarIcon, visible: true },
  {
    id: 'leads', labelKey: 'leads', icon: TrendingUpIcon, visible: true, subItems: [
      { id: 'lead', labelKey: 'lead', icon: TagIcon, visible: true },
      { id: 'contacts', labelKey: 'contacts', icon: ContactIcon, visible: true },
      { id: 'deals', labelKey: 'deals', icon: DollarSignIcon, visible: true },
    ]
  },
  { id: 'clients', labelKey: 'clients', icon: UsersIcon, visible: true },
  { id: 'warehouse', labelKey: 'warehouse', icon: ArchiveIcon, visible: true },
  { id: 'vendors', labelKey: 'vendors', icon: TruckIcon, visible: true },
  {
    id: 'hr', labelKey: 'hr', icon: UsersIcon, visible: true, subItems: [
      { id: 'employees', labelKey: 'employees', icon: UsersIcon, visible: true },
      { id: 'appreciation', labelKey: 'appreciation', icon: GiftIcon, visible: true },
      { id: 'leaves', labelKey: 'leaves', icon: PlaneIcon, visible: true },
      { id: 'shift_roster', labelKey: 'shift_roster', icon: ClockIcon, visible: true },
      { id: 'attendance', labelKey: 'attendance', icon: CheckSquareIcon, visible: true },
      { id: 'holiday', labelKey: 'holiday', icon: CalendarIcon, visible: true },
      { id: 'designation', labelKey: 'designation', icon: BriefcaseIcon, visible: true },
      { id: 'department', labelKey: 'department', icon: BuildingIcon, visible: true },
      { id: 'performance_kpis', labelKey: 'performance_kpis', icon: BarChartIcon, visible: true },
    ]
  },
  {
    id: 'work', labelKey: 'work', icon: BriefcaseIcon, visible: true, subItems: [
      { id: 'contracts', labelKey: 'contracts', icon: FileTextIcon, visible: true },
      { id: 'projects', labelKey: 'projects', icon: BriefcaseIcon, visible: true },
      { id: 'tasks', labelKey: 'tasks', icon: CheckSquareIcon, visible: true },
    ]
  },
  {
    id: 'finance', labelKey: 'finance', icon: DollarSignIcon, visible: true, subItems: [
      { id: 'proposal', labelKey: 'proposal', icon: FileTextIcon, visible: true },
      { id: 'estimates', labelKey: 'estimates', icon: FilePlusIcon, visible: true },
      { id: 'invoices', labelKey: 'invoices', icon: FileTextIcon, visible: true },
      { id: 'payments', labelKey: 'payments', icon: CreditCardIcon, visible: true },
      { id: 'salaries_payroll', labelKey: 'salaries_payroll', icon: CreditCardIcon, visible: true },
      { id: 'credit_note', labelKey: 'credit_note', icon: FilePlusIcon, visible: true },
      { id: 'expenses', labelKey: 'expenses', icon: DollarSignIcon, visible: true },
    ]
  },
  { id: 'bank_account', labelKey: 'bank_account', icon: CreditCardIcon, visible: true },
  { id: 'products', labelKey: 'products', icon: BoxIcon, visible: true },
  { id: 'orders', labelKey: 'orders', icon: ShoppingCartIcon, visible: true },
  { id: 'tickets', labelKey: 'tickets', icon: LifeBuoyIcon, visible: true },
  { id: 'events', labelKey: 'events', icon: SpeakerIcon, visible: true },
  { id: 'messages', labelKey: 'messages', icon: MessageSquareIcon, visible: true },
  { id: 'notice_board', labelKey: 'notice_board', icon: ClipboardIcon, visible: true },
  { id: 'feeds', labelKey: 'feeds', icon: RssIcon, visible: true },
  {
    id: 'reports', labelKey: 'reports', icon: BarChartIcon, visible: true, subItems: [
        { id: 'task_report', labelKey: 'task_report', icon: BarChartIcon, visible: true },
        { id: 'time_log_report', labelKey: 'time_log_report', icon: BarChartIcon, visible: true },
        { id: 'finance_report', labelKey: 'finance_report', icon: BarChartIcon, visible: true },
        { id: 'income_vs_expense', labelKey: 'income_vs_expense', icon: BarChartIcon, visible: true },
        { id: 'leave_report', labelKey: 'leave_report', icon: BarChartIcon, visible: true },
        { id: 'attendance_report', labelKey: 'attendance_report', icon: BarChartIcon, visible: true },
        { id: 'expense_report', labelKey: 'expense_report', icon: BarChartIcon, visible: true },
        { id: 'deal_report', labelKey: 'deal_report', icon: BarChartIcon, visible: true },
        { id: 'sales_report', labelKey: 'sales_report', icon: BarChartIcon, visible: true },
    ]
  },
];


export const mockEmployees: Employee[] = [
  { id: '1', employeeId: 'MVM-001', name: 'Alia Hassan', avatar: 'https://i.pravatar.cc/150?u=alia', role: 'UI/UX Designer', department: 'Design', email: 'alia.h@mvm.studio', status: 'Active', joiningDate: '2023-01-10', gender: 'Female', loginAllowed: true, emailNotifications: true, mobile: "9876543210", maritalStatus: "Married", marriageAnniversaryDate: "2024-05-20", employmentType: "Full-time", userRole: 'Employee', salaryStructure: { payType: 'Monthly', monthlyRate: 35000, allowances: [{ name: 'Housing', amount: 5000 }], deductions: [], overtimeRate: 250 } },
  { id: '2', employeeId: 'MVM-002', name: 'Ali erkan karakurt', avatar: 'https://i.pravatar.cc/150?u=burak', role: 'Senior Photograph Studio', department: 'Production', email: 'mvmajansalierkan27@gmail.com', status: 'Active', joiningDate: '2022-08-22', gender: 'Male', loginAllowed: true, emailNotifications: false, mobile: "1234567890", maritalStatus: "Single", employmentType: "Full-time", userRole: 'Employee', salaryStructure: { payType: 'Monthly', monthlyRate: 45000, allowances: [{name: 'Transport', amount: 1500}], deductions: [{name: 'Social Security', amount: 1000}], overtimeRate: 300 } },
  { id: '3', employeeId: 'MVM-003', name: 'Chris Evans', avatar: 'https://i.pravatar.cc/150?u=chris', role: 'Videographer', department: 'Production', email: 'chris.e@mvm.studio', status: 'On Leave', joiningDate: '2021-05-15', gender: 'Male', loginAllowed: true, emailNotifications: true, mobile: "1122334455", maritalStatus: "Single", employmentType: "Contract", userRole: 'Employee', salaryStructure: { payType: 'Hourly', hourlyRate: 250, allowances: [], deductions: [], overtimeRate: 350 } },
  { id: '4', employeeId: 'MVM-004', name: 'Dana White', avatar: 'https://i.pravatar.cc/150?u=dana', role: 'Client Manager', department: 'Sales', email: 'dana.w@mvm.studio', status: 'Active', joiningDate: '2023-03-01', gender: 'Female', loginAllowed: false, emailNotifications: true, mobile: "5566778899", maritalStatus: "Married", marriageAnniversaryDate: "2022-11-10", employmentType: "Full-time", userRole: 'Employee', salaryStructure: { payType: 'Monthly', monthlyRate: 40000, allowances: [], deductions: [], overtimeRate: 280 } },
  { id: '5', employeeId: 'MVM-005', name: 'Emre Can', avatar: 'https://i.pravatar.cc/150?u=emre', role: 'Developer', department: 'IT', email: 'emre.c@mvm.studio', status: 'Active', joiningDate: '2022-08-22', gender: 'Male', loginAllowed: true, emailNotifications: true, mobile: "9988776655", maritalStatus: "Single", employmentType: "Part-time", userRole: 'Employee', salaryStructure: { payType: 'Hourly', hourlyRate: 300, allowances: [], deductions: [], overtimeRate: 400 } },
  { id: '6', employeeId: 'MVM-006', name: 'Fatima Ali', avatar: 'https://i.pravatar.cc/150?u=fatima', role: 'HR Manager', department: 'HR', email: 'fatima.a@mvm.studio', status: 'Active', joiningDate: '2020-02-18', gender: 'Female', loginAllowed: true, emailNotifications: true, mobile: "1231231234", maritalStatus: "Single", employmentType: "Full-time", userRole: 'Admin', salaryStructure: { payType: 'Monthly', monthlyRate: 60000, allowances: [], deductions: [], overtimeRate: 450 } },
  { id: '7', employeeId: 'MVM-007', name: 'Shady Omar', avatar: 'https://i.pravatar.cc/150?u=shady', role: 'Project Manager', department: 'Management', email: 'shady.o@mvm.studio', status: 'Active', joiningDate: '2020-01-01', gender: 'Male', loginAllowed: true, emailNotifications: true, userRole: 'Project Manager', salaryStructure: { payType: 'Monthly', monthlyRate: 75000, allowances: [], deductions: [], overtimeRate: 500 } },
];

const teamAvatars1 = [{ avatar: 'https://i.pravatar.cc/150?u=alia' }, { avatar: 'https://i.pravatar.cc/150?u=burak' }];
const teamAvatars2 = [{ avatar: 'https://i.pravatar.cc/150?u=chris' }, { avatar: 'https://i.pravatar.cc/150?u=dana' }];
const teamAvatars3 = [{ avatar: 'https://i.pravatar.cc/150?u=emre' }, { avatar: 'https://i.pravatar.cc/150?u=fatima' }, { avatar: 'https://i.pravatar.cc/150?u=alia' }];
const teamAvatars4 = [{ avatar: 'https://i.pravatar.cc/150?u=burak' }, { avatar: 'https://i.pravatar.cc/150?u=dana' }];

export const mockProjects: Project[] = [
  { id: '1', projectCode: 'PRJ-001', name: 'E-commerce Website', client: 'StyleLife Inc.', vendorId: '1', collectionNames: ['Main Campaign'], department: ['Design', 'IT'], startDate: '2024-07-01', deadline: '2024-07-25', progress: 75, status: 'In Progress', team: teamAvatars1, members: ['1', '5'], customFieldData: { 'cf_1': 'High Priority', 'cf_2': true }, quantities: { normal: 10, round: 5, video: 3 } },
  { id: '2', projectCode: 'PRJ-002', name: 'Mobile App Design', client: 'Round Corp.', vendorId: '2', collectionNames: ['Q3 Mobile Initiative'], department: ['Design'], startDate: '2024-07-10', deadline: '2024-08-15', progress: 40, status: 'In Progress', team: teamAvatars2, members: ['1'], quantities: { runner: 12, video: 1 } },
  { id: '3', projectCode: 'PRJ-003', name: 'Brand Photoshoot', client: 'Runner Group', vendorId: '1', collectionNames: ['Summer Catalog', 'Social Media'], department: ['Production'], startDate: '2024-06-01', deadline: '2024-06-30', progress: 100, status: 'Completed', team: teamAvatars3, members: ['2', '3'], quantities: { normal: 25 } },
  { id: '4', projectCode: 'PRJ-004', name: 'Marketing Campaign', client: 'VideoStyle', vendorId: '2', collectionNames: ['Launch Promo'], department: ['Sales', 'Production'], startDate: '2024-06-15', deadline: '2024-07-10', progress: 90, status: 'In Progress', team: teamAvatars4, members: ['2', '4'], quantities: { normal: 8, video: 5 } },
  { id: '5', projectCode: 'PRJ-005', name: 'Internal CRM Tool', client: 'MVM Studio', collectionNames: ['Internal'], department: ['IT'], startDate: '2024-08-01', deadline: '2024-09-01', progress: 10, status: 'Pending', team: teamAvatars1, members: ['5'], quantities: { normal: 2, video: 1 } },
];

export const mockTaskCategories: string[] = [
    'Design',
    'Development',
    'Testing',
    'Documentation',
    'Photography',
    'Video Editing',
    'Client Management',
];

export const mockTasks: Task[] = [
  { id: '1', taskCode: '1864-1', projectId: '1', name: 'Homepage UI/UX', startDate: '2024-07-01', dueDate: '2024-07-15', completedOn: '2024-07-14', priority: 'High', status: 'Done', assigneeIds: ['1'], assignees: [{ id: '1', name: 'Alia Hassan', avatar: 'https://i.pravatar.cc/150?u=alia' }], customFieldData: { 'cf_3': 8, 'cf_4': 'Yes' }, perspectives: ['Side', 'Macro'], category: 'Design', estimatedTime: '16h', hoursLogged: '18h 30m', assignedById: '6', isBillable: true,
    comments: [
        { id: 'c1', author: { id: '2', name: 'Ali erkan karakurt', avatar: 'https://i.pravatar.cc/150?u=burak' }, text: 'This looks great! Just one small change, can we make the primary button a bit brighter?', timestamp: '2 days ago' },
        { id: 'c2', author: { id: '1', name: 'Alia Hassan', avatar: 'https://i.pravatar.cc/150?u=alia' }, text: 'Good suggestion. I\'ve updated the color. Check it out now.', timestamp: '1 day ago' },
    ],
    notes: 'Remember to check accessibility standards before final delivery.',
    history: [
        { id: 'h1', actor: { name: 'Fatima Ali' }, action: 'created this task.', timestamp: '5 days ago' },
        { id: 'h2', actor: { name: 'Fatima Ali' }, action: 'assigned this to Alia Hassan.', timestamp: '5 days ago' },
        { id: 'h3', actor: { name: 'Alia Hassan' }, action: 'changed status from To Do to In Progress.', timestamp: '4 days ago' },
        { id: 'h4', actor: { name: 'Alia Hassan' }, action: 'changed status from In Progress to Done.', timestamp: '1 day ago' },
    ]
   },
  { id: '2', taskCode: '1864-2', projectId: '3', name: 'Product Photography', startDate: '2024-07-02', dueDate: '2024-07-18', priority: 'Medium', status: 'To Do', assigneeIds: ['2'], assignees: [{ id: '2', name: 'Ali erkan karakurt', avatar: 'https://i.pravatar.cc/150?u=burak' }], perspectives: ['Close Up', 'Detay'], category: 'Photography', estimatedTime: '24h', hoursLogged: '0s', assignedById: '6', isBillable: true, files: [{id: 'file_1', name: 'reference_image.jpg', url: '#', size: '1.2 MB'}] },
  { id: '3', taskCode: '1864-3', projectId: '4', name: 'Final Video Edits', startDate: '2024-07-03', dueDate: '2024-07-12', priority: 'High', status: 'In Progress', assigneeIds: ['3'], assignees: [{ id: '3', name: 'Chris Evans', avatar: 'https://i.pravatar.cc/150?u=chris' }], category: 'Video Editing', estimatedTime: '8h', hoursLogged: '5h', assignedById: '6', isBillable: false },
  { id: '4', taskCode: '1864-4', projectId: '2', name: 'Client Follow-up', startDate: '2024-07-04', dueDate: '2024-07-11', priority: 'Low', status: 'To Do', assigneeIds: ['4'], assignees: [{ id: '4', name: 'Dana White', avatar: 'https://i.pravatar.cc/150?u=dana' }], category: 'Client Management', estimatedTime: '2h', hoursLogged: '0s', assignedById: '6', isBillable: false },
  { id: '5', taskCode: '1864-5', projectId: '1', name: 'API Integration', startDate: '2024-07-05', dueDate: '2024-07-20', priority: 'High', status: 'In Progress', assigneeIds: ['5', '1'], assignees: [{ id: '5', name: 'Emre Can', avatar: 'https://i.pravatar.cc/150?u=emre' }, { id: '1', name: 'Alia Hassan', avatar: 'https://i.pravatar.cc/150?u=alia' }], category: 'Development', estimatedTime: '40h', hoursLogged: '12h', assignedById: '6', isBillable: true },
  { id: '6', taskCode: '1864-6', projectId: '1', parentId: '5', name: 'Fix login bug', startDate: '2024-07-01', dueDate: '2024-07-10', priority: 'Medium', status: 'To Do', category: 'Development', estimatedTime: '4h', hoursLogged: '0s', assignedById: '6', isBillable: false },
];

export const mockAppreciations: Appreciation[] = [
  { id: '1', from: { name: 'Shady Omar', avatar: 'https://i.pravatar.cc/150?u=shady' }, to: { name: 'Alia Hassan', avatar: 'https://i.pravatar.cc/150?u=alia' }, message: 'Amazing work on the new design system!', date: '2024-07-09' },
  { id: '2', from: { name: 'Dana White', avatar: 'https://i.pravatar.cc/150?u=dana' }, to: { name: 'Ali erkan karakurt', avatar: 'https://i.pravatar.cc/150?u=burak' }, message: 'The client loved the product shots. Great job!', date: '2024-07-08' },
];

export const mockCustomers: Customer[] = [
    { id: '1', name: 'StyleLife Inc.', email: 'contact@stylelife.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=stylelife', company: 'StyleLife Inc.', mobile: '+1-202-555-0104' },
    { id: '2', name: 'Round Corp.', email: 'hello@roundcorp.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=roundcorp', company: 'Round Corp.', mobile: '+1-202-555-0162' },
    { id: '3', name: 'Runner Group', email: 'info@runner.com', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=runner', company: 'Runner Group', mobile: '+1-202-555-0125' },
];

export const mockContacts: Contact[] = [
    { id: '1', name: 'John Doe', email: 'j.doe@stylelife.com', phone: '+1-202-555-0105', company: 'StyleLife Inc.', avatar: 'https://i.pravatar.cc/150?u=johndoe' },
    { id: '2', name: 'Jane Smith', email: 'j.smith@roundcorp.com', phone: '+1-202-555-0163', company: 'Round Corp.', avatar: 'https://i.pravatar.cc/150?u=janesmith' },
];

export const mockOrders: Order[] = [
    { id: '1001', customerName: 'StyleLife Inc.', date: '2024-07-01', amount: 2500, status: 'Delivered' },
    { id: '1002', customerName: 'Round Corp.', date: '2024-07-05', amount: 1800, status: 'Shipped' },
    { id: '1003', customerName: 'Runner Group', date: '2024-07-08', amount: 3200, status: 'Pending' },
    { id: '1004', customerName: 'StyleLife Inc.', date: '2024-07-09', amount: 500, status: 'Cancelled' },
];

export const mockDeals: Deal[] = [
    { id: '1', title: 'Q3 Marketing Campaign', customer: 'StyleLife Inc.', value: 15000, stage: 'Won' },
    { id: '2', title: 'New Website Design', customer: 'Round Corp.', value: 22000, stage: 'Proposal Sent' },
    { id: '3', title: 'Mobile App Development', customer: 'Runner Group', value: 35000, stage: 'Contact Made' },
    { id: '4', title: 'SEO Optimization', customer: 'New Lead LLC', value: 5000, stage: 'Lead' },
    { id: '5', title: 'Cloud Migration', customer: 'Old Client Co.', value: 12000, stage: 'Lost' },
];

export const mockTimeLogs: TimeLog[] = [
    { id: '1', employeeId: '1', taskId: '1', employeeName: 'Alia Hassan', projectName: 'E-commerce Website', taskName: 'Homepage UI/UX', date: '2024-07-09', duration: '02:30:00', startTime: 0, endTime: 0, memo: '' },
    { id: '2', employeeId: '5', taskId: '5', employeeName: 'Emre Can', projectName: 'E-commerce Website', taskName: 'API Integration', date: '2024-07-09', duration: '04:15:00', startTime: 0, endTime: 0, memo: '' },
];

export const mockLeaveRequests: LeaveRequest[] = [
    { id: '1', employeeId: '3', employeeName: 'Chris Evans', employeeAvatar: 'https://i.pravatar.cc/150?u=chris', leaveType: 'Annual', startDate: '2024-07-15', endDate: '2024-07-20', status: 'Approved', reason: 'Family vacation.' },
    { id: '2', employeeId: '6', employeeName: 'Fatima Ali', employeeAvatar: 'https://i.pravatar.cc/150?u=fatima', leaveType: 'Sick', startDate: '2024-07-10', endDate: '2024-07-10', status: 'Pending', reason: 'Doctor\'s appointment.' },
];

export const mockHolidays: Holiday[] = [
    { date: '2024-12-25', name: 'Christmas Day', day: 'Wednesday' },
    { date: '2025-01-01', name: 'New Year\'s Day', day: 'Wednesday' },
];

export const mockDepartments: Department[] = [
    { id: '1', name: 'Design', head: 'Alia Hassan', memberCount: 5 },
    { id: '2', name: 'Production', head: 'Ali erkan karakurt', memberCount: 8 },
    { id: '3', name: 'Sales', head: 'Dana White', memberCount: 3 },
    { id: '4', name: 'IT', head: 'Emre Can', memberCount: 4 },
    { id: '5', name: 'HR', head: 'Fatima Ali', memberCount: 2 },
    { id: '6', name: 'Marketing', head: 'Dana White', memberCount: 2 },
    { id: '7', name: 'Management', head: 'Shady Omar', memberCount: 1 },
];

export const mockDesignations: Designation[] = [
    { id: '1', title: 'UI/UX Designer', department: 'Design' },
    { id: '2', title: 'Graphic Designer', department: 'Design' },
    { id: '3', title: 'Photographer', department: 'Production' },
    { id: '4', title: 'Videographer', department: 'Production' },
    { id: '5', title: 'Client Manager', department: 'Sales' },
    { id: '6', title: 'Developer', department: 'IT' },
    { id: '7', title: 'HR Manager', department: 'HR' },
    { id: '8', title: 'Senior Photograph Studio', department: 'Production' },
    { id: '9', title: 'Project Manager', department: 'Management' },
];

export const mockChatConversations: ChatConversation[] = [
    {
        id: 'chat_1_2',
        isGroup: false,
        name: 'Alia Hassan',
        avatar: 'https://i.pravatar.cc/150?u=alia',
        lastMessageText: 'Let me know if you need anything else.',
        lastMessageTimestamp: '2024-07-20T10:30:15Z',
        unreadCount: 2,
        participantIds: ['1', '2']
    },
    {
        id: 'chat_2_3',
        isGroup: false,
        name: 'Chris Evans',
        avatar: 'https://i.pravatar.cc/150?u=chris',
        lastMessageText: 'You: Okay, sounds good!',
        lastMessageTimestamp: '2024-07-20T09:15:00Z',
        unreadCount: 0,
        participantIds: ['2', '3']
    },
    {
        id: 'group_1',
        isGroup: true,
        name: 'Production Team',
        avatar: 'https://i.imgur.com/gL8gSoJ.png',
        lastMessageText: 'Chris: Great idea!',
        lastMessageTimestamp: '2024-07-20T11:06:00Z',
        unreadCount: 1,
        participantIds: ['1', '2', '3', '4']
    }
];

export const mockChatMessages: ChatMessage[] = [
    // Conversation with Alia Hassan (current user is Ali, id '2')
    { id: 'msg1', chatId: 'chat_1_2', senderId: '1', text: 'Hey Ali, do you have the final renders for the StyleLife project?', timestamp: '2024-07-20T10:28:00Z', status: 'seen' },
    { id: 'msg2', chatId: 'chat_1_2', senderId: '2', text: 'Hi Alia, yes I do. Just finishing up the exports.', timestamp: '2024-07-20T10:29:00Z', status: 'seen' },
    { id: 'msg3', chatId: 'chat_1_2', senderId: '1', text: 'Great! Can you send them to me when you get a chance?', timestamp: '2024-07-20T10:29:30Z', status: 'seen' },
    { id: 'msg4', chatId: 'chat_1_2', senderId: '2', text: 'Sure, I will send it over in a bit.', timestamp: '2024-07-20T10:30:00Z', status: 'delivered' },
    { id: 'msg5', chatId: 'chat_1_2', senderId: '1', text: 'Let me know if you need anything else.', timestamp: '2024-07-20T10:30:15Z', status: 'sent' },
    { id: 'msg12', chatId: 'chat_1_2', senderId: '2', text: 'The video shoot is confirmed for tomorrow at 10 AM.', timestamp: '2024-07-20T11:10:00Z', status: 'sent', forwardedFrom: { name: 'Chris Evans' } },


    // Conversation with Chris Evans
    { id: 'msg6', chatId: 'chat_2_3', senderId: '3', text: 'The video shoot is confirmed for tomorrow at 10 AM.', timestamp: '2024-07-20T09:14:00Z', status: 'seen' },
    { id: 'msg7', chatId: 'chat_2_3', senderId: '2', text: 'Okay, sounds good!', timestamp: '2024-07-20T09:15:00Z', status: 'sent' },
    
    // Group Chat
    { id: 'msg8', chatId: 'group_1', senderId: '1', text: 'Morning team! Let\'s crush it today.', timestamp: '2024-07-20T09:00:00Z', status: 'seen' },
    { id: 'msg9', chatId: 'group_1', senderId: '2', text: 'Good morning!', timestamp: '2024-07-20T09:01:00Z', status: 'seen' },
    { id: 'msg10', chatId: 'group_1', senderId: '4', text: 'Don\'t forget the team meeting at 3 PM.', timestamp: '2024-07-20T11:05:00Z', status: 'delivered' },
    { id: 'msg11', chatId: 'group_1', senderId: '3', text: 'Great idea!', timestamp: '2024-07-20T11:06:00Z', status: 'seen', replyToMessageId: 'msg10' },

];

export const mockVendors: Vendor[] = [
    { id: '1', name: 'Creative Supplies Co.', category: 'Stationery', email: 'sales@creativesupplies.com' },
    { id: '2', name: 'Tech Rentals', category: 'Equipment', email: 'rent@techrentals.com' },
];

export const mockProducts: Product[] = [
    { id: '1', name: 'Premium Photo Paper', category: 'Printing', price: 55.00, stock: 120 },
    { id: '2', name: 'DSLR Camera Body', category: 'Photography Gear', price: 1250.00, stock: 15 },
];

export const mockWarehouseItems: WarehouseItem[] = [
  { id: 'wh1', clientName: 'StyleLife Inc.', vendorId: '1', collectionNames: ['Main Campaign'], numberOfCarpets: 15, entryDate: '2024-07-01', exitDate: '2024-07-25', projectId: '1', receivedById: '2' },
  { id: 'wh2', clientName: 'Round Corp.', vendorId: '2', collectionNames: ['Q3 Mobile Initiative'], numberOfCarpets: 12, entryDate: '2024-07-10', exitDate: '2024-08-15', projectId: '2', receivedById: '1' },
  { id: 'wh3', clientName: 'Runner Group', vendorId: '1', collectionNames: ['Summer Catalog', 'Social Media'], numberOfCarpets: 25, entryDate: '2024-06-01', exitDate: '2024-06-30', projectId: '3', receivedById: '3' },
  { id: 'wh4', clientName: 'VideoStyle', vendorId: '2', collectionNames: ['Launch Promo'], numberOfCarpets: 8, entryDate: '2024-06-15', exitDate: '2024-07-10', projectId: '4', receivedById: '2' },
  { id: 'wh5', clientName: 'MVM Studio', vendorId: '1', collectionNames: ['Internal'], numberOfCarpets: 2, entryDate: '2024-08-01', exitDate: '2024-09-01', projectId: null, receivedById: '4' },
  { id: 'wh6', clientName: 'New Client Co.', vendorId: '2', collectionNames: ['Fall Collection Preview'], numberOfCarpets: 50, entryDate: '2024-09-01', exitDate: '2024-09-30', projectId: null, receivedById: '5' },
];

export const mockTickets: Ticket[] = [
    { id: '1', subject: 'Login issue on client portal', clientName: 'StyleLife Inc.', assignedTo: 'Emre Can', status: 'Open', priority: 'High', date: '2024-07-09' },
    { id: '2', subject: 'Question about invoice #INV-003', clientName: 'Round Corp.', assignedTo: 'Dana White', status: 'In Progress', priority: 'Medium', date: '2024-07-08' },
];

export const mockNotificationSettings: NotificationSetting[] = [
    { id: '1', labelKey: 'new_expense_admin', email: true, inApp: true },
    { id: '2', labelKey: 'new_expense_member', email: true, inApp: true },
    { id: '3', labelKey: 'expense_status_changed', email: false, inApp: true },
    { id: '4', labelKey: 'new_support_ticket', email: true, inApp: true },
    { id: '5', labelKey: 'new_leave_application', email: true, inApp: false },
    { id: '6', labelKey: 'task_completed', email: false, inApp: true },
    { id: '7', labelKey: 'task_updated', email: true, inApp: true },
    { id: '8', labelKey: 'invoice_updated', email: true, inApp: false },
    { id: '9', labelKey: 'discussion_reply', email: false, inApp: true },
    { id: '10', labelKey: 'new_product_purchase', email: true, inApp: true },
    { id: '11', labelKey: 'lead_notification', email: true, inApp: false },
    { id: '12', labelKey: 'order_updated', email: true, inApp: true },
    { id: '13', labelKey: 'user_invitation', email: true, inApp: true },
    { id: '14', labelKey: 'follow_up_reminder', email: false, inApp: true },
    { id: '15', labelKey: 'user_registration', email: true, inApp: true },
    { id: '16', labelKey: 'employee_assign_project', email: false, inApp: true },
    { id: '17', labelKey: 'new_notice_published', email: true, inApp: true },
    { id: '18', labelKey: 'user_assign_task', email: false, inApp: true },
    { id: '19', labelKey: 'birthday_notification', email: true, inApp: true },
    { id: '20', labelKey: 'payment_notification', email: true, inApp: false },
    { id: '21', labelKey: 'employee_appreciation', email: true, inApp: true },
    { id: '22', labelKey: 'holiday_notification', email: false, inApp: true },
    { id: '23', labelKey: 'estimate_notification', email: true, inApp: true },
    { id: '24', labelKey: 'event_notification', email: false, inApp: true },
    { id: '25', labelKey: 'message_notification', email: true, inApp: true },
    { id: '26', labelKey: 'project_mention', email: true, inApp: true },
    { id: '27', labelKey: 'task_mention', email: true, inApp: true },
    { id: '28', labelKey: 'shift_assign', email: false, inApp: true },
    { id: '29', labelKey: 'daily_schedule', email: true, inApp: false },
];

const mockPermissionsForAdmin: Permission[] = [
    { moduleKey: 'clients', add: 'all', view: 'all', update: 'all', delete: 'all' },
    { moduleKey: 'projects', add: 'all', view: 'all', update: 'all', delete: 'all' },
    { moduleKey: 'tasks', add: 'all', view: 'all', update: 'all', delete: 'all' },
    { moduleKey: 'employees', add: 'all', view: 'all', update: 'all', delete: 'all' },
    { moduleKey: 'settings', add: 'all', view: 'all', update: 'all', delete: 'all', isSpecial: true },
];

const mockPermissionsForEmployee: Permission[] = [
    { moduleKey: 'clients', add: 'added', view: 'both', update: 'owned', delete: 'none' },
    { moduleKey: 'projects', add: 'added', view: 'all', update: 'owned', delete: 'none' },
    { moduleKey: 'tasks', add: 'all', view: 'all', update: 'all', delete: 'added' },
    { moduleKey: 'employees', add: 'none', view: 'all', update: 'none', delete: 'none' },
];

const mockPermissionsForClient: Permission[] = [
    { moduleKey: 'projects', add: 'none', view: 'owned', update: 'none', delete: 'none' },
    { moduleKey: 'tasks', add: 'added', view: 'owned', update: 'none', delete: 'none' },
];

export const mockRoles: Role[] = [
    { id: '1', nameKey: 'admin', permissions: mockPermissionsForAdmin },
    { id: '2', nameKey: 'employee', permissions: mockPermissionsForEmployee },
    { id: '3', nameKey: 'client_role', permissions: mockPermissionsForClient },
];

export const mockNotifications: Notification[] = [
    { id: '1', avatar: 'https://i.pravatar.cc/150?u=alia', text: '<b>Alia Hassan</b> completed the task <b>Homepage UI/UX</b>.', timestamp: '2 minutes ago', read: false },
    { id: '2', avatar: 'https://i.pravatar.cc/150?u=dana', text: 'You have a new message from <b>Dana White</b>.', timestamp: '1 hour ago', read: false },
    { id: '3', avatar: 'https://i.imgur.com/gL8gSoJ.png', text: 'Invoice <b>#INV-003</b> has been paid.', timestamp: '3 hours ago', read: true },
];

export const mockCustomFields: CustomField[] = [
    { id: 'cf_1', module: 'projects', label: 'Urgency', type: 'select', required: true, options: ['High Priority', 'Medium Priority', 'Low Priority'] },
    { id: 'cf_2', module: 'projects', label: 'Requires Client Sign-off', type: 'checkbox', required: false },
    { id: 'cf_3', module: 'tasks', label: 'Story Points', type: 'number', required: false },
    { id: 'cf_4', module: 'tasks', label: 'Billable', type: 'select', required: true, options: ['Yes', 'No'] },
    { id: 'cf_5', module: 'clients', label: 'Account Manager', type: 'select', required: true, relatedModule: 'employees' },
];

export const mockPayslips: Payslip[] = [];
export const mockContracts: Contract[] = [];
export const mockInvoices: Invoice[] = [];
export const mockEstimates: Estimate[] = [];
export const mockProposals: Proposal[] = [];
export const mockPayments: Payment[] = [];
export const mockCreditNotes: CreditNote[] = [];
export const mockExpenses: Expense[] = [];
export const mockBankAccounts: BankAccount[] = [];
export const mockEvents: Event[] = [
    { id: '1', name: 'Team Offsite', date: '2024-07-19'},
    { id: '2', name: 'Client Workshop', date: '2024-07-22'},
];
export const mockKnowledgeBaseArticles: KnowledgeBaseArticle[] = [];

export const mockAppSettings: AppSettings = {
    companyName: 'MVM Studio',
    companyLogo: 'https://i.imgur.com/K7IfH2s.png',
    favicon: 'https://i.imgur.com/K7IfH2s.png',
    copyrightText: '© 2024 MVM Studio. All rights reserved.',
    timezone: '(UTC+03:00) Istanbul',
    companyLatitude: 37.1293,
    companyLongitude: 37.3015,
    companyLocationRadius: 500,
    businessAddress: '123 Business Rd, Business City',
};

export const mockCurrencies: Currency[] = [
    { id: '1', name: 'US Dollar', code: 'USD', symbol: '$', exchangeRate: 1.00 },
    { id: '2', name: 'UAE Dirham', code: 'AED', symbol: 'DH', exchangeRate: 3.67 },
    { id: '3', name: 'Turkish Lira', code: 'TRY', symbol: '₺', exchangeRate: 32.83 },
];

export const mockThemeSettings: ThemeSettings = {
    primaryColor: '#3b82f6',
    bgColorPrimaryLight: '#f9fafb',
    bgColorSecondaryLight: '#ffffff',
    textColorPrimaryLight: '#111827',
    textColorSecondaryLight: '#6b7280',
    borderColorLight: '#e5e7eb',
    bgColorPrimaryDark: '#111827',
    bgColorSecondaryDark: '#1f2937',
    textColorPrimaryDark: '#f9fafb',
    textColorSecondaryDark: '#9ca3af',
    borderColorDark: '#374151',
    borderRadius: '0.75rem',
    cardShadow: 'md',
    cardBorder: true,
};

export const mockModules: ModuleStatus[] = [
    { id: 'clients', nameKey: 'clients', enabled: true, icon: UsersIcon },
    { id: 'employees', nameKey: 'employees', enabled: true, icon: UsersIcon },
    { id: 'projects', nameKey: 'projects', enabled: true, icon: BriefcaseIcon },
    { id: 'tasks', nameKey: 'tasks', enabled: true, icon: CheckSquareIcon },
    { id: 'leads', nameKey: 'leads', enabled: true, icon: TagIcon },
    { id: 'orders', nameKey: 'orders', enabled: false, icon: ShoppingCartIcon },
];

export const mockSecuritySettings: SecuritySettings = {
    twoFactorEnabled: false,
    activeSessions: [
        { id: '1', browser: 'Chrome', os: 'macOS', location: 'Dubai, UAE', lastActivity: 'Active now' },
        { id: '2', browser: 'Safari', os: 'iPhone', location: 'Dubai, UAE', lastActivity: '2 hours ago' },
    ],
};

export const mockFinanceSettings: FinanceSettings = {
    defaultCurrency: '3', // Turkish Lira
    fiscalYearStart: '2024-01-01',
    invoicePrefix: 'INV-',
    estimatePrefix: 'EST-',
    incentiveBonusPool: 50000,
};

export const mockProjectSettings: ProjectSettings = {
    sendTaskReminder: true,
    allowClientToCreateTasks: false,
};

export const mockTaskSettings: TaskSettings = {
    allowUnassignedTasks: true,
};

export const mockAttendanceShifts: AttendanceShift[] = [
    { id: '1', name: 'General Shift', startTime: '08:30 AM', endTime: '06:00 PM', halfDayTime: '01:00 PM', lateMarkAfter: 10, maxCheckIn: 2, officeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], isDefault: true },
    { id: '2', name: 'Night Shift', startTime: '09:00 PM', halfDayTime: '01:00 AM', endTime: '06:00 AM', lateMarkAfter: 10, maxCheckIn: 2, officeDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], isDefault: false },
];

export const mockLeaveTypes: LeaveType[] = [
    { id: '1', name: 'Annual Leave', daysAllowed: 20, isPaid: true, requiresDocument: false },
    { id: '2', name: 'Sick Leave', daysAllowed: 10, isPaid: true, requiresDocument: true },
    { id: '3', name: 'Unpaid Leave', daysAllowed: 15, isPaid: false, requiresDocument: false },
];

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

export const mockAttendanceRecords: AttendanceRecord[] = [
    // On-time
    { id: 'att_1', employeeId: '2', checkInTime: new Date(currentYear, currentMonth, 2, 8, 35, 0).getTime(), checkOutTime: new Date(currentYear, currentMonth, 2, 18, 5, 0).getTime(), locationType: 'office', latitude: 37.1293, longitude: 37.3015 },
    // Late (15 mins late)
    { id: 'att_2', employeeId: '2', checkInTime: new Date(currentYear, currentMonth, 3, 8, 55, 0).getTime(), checkOutTime: new Date(currentYear, currentMonth, 3, 18, 2, 0).getTime(), locationType: 'office', latitude: 37.1293, longitude: 37.3015 },
    // On-time
    { id: 'att_3', employeeId: '1', checkInTime: new Date(currentYear, currentMonth, 3, 8, 32, 0).getTime(), locationType: 'home', latitude: 37.0662, longitude: 37.3833 },
    // Very Late (40 mins late)
    { id: 'att_4', employeeId: '2', checkInTime: new Date(currentYear, currentMonth, 4, 9, 20, 0).getTime(), checkOutTime: new Date(currentYear, currentMonth, 4, 18, 0, 0).getTime(), locationType: 'external', latitude: 41.0082, longitude: 28.9784 },
];


export const mockKpis: KPI[] = [
    { id: 'kpi_punctuality', nameKey: 'punctuality', type: 'automatic', weight: 20 },
    { id: 'kpi_efficiency', nameKey: 'task_efficiency', type: 'automatic', weight: 30 },
    { id: 'kpi_productivity', nameKey: 'productivity', type: 'automatic', weight: 30 },
    { id: 'kpi_cooperation', nameKey: 'team_cooperation', type: 'manual', weight: 20 },
];

export const mockManualKpiScores: Record<string, Record<string, number>> = {
    '1': { 'kpi_cooperation': 4 },
    '2': { 'kpi_cooperation': 5 },
    '3': { 'kpi_cooperation': 3 },
    '4': { 'kpi_cooperation': 4.5 },
    '5': { 'kpi_cooperation': 4 },
    '6': { 'kpi_cooperation': 5 },
};

export const mockCustomTables: CustomTable[] = [];
export const mockCustomTableData: Record<string, Record<string, any>[]> = {};