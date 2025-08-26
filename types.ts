import React from 'react';

export enum Language {
  EN = 'en',
  AR = 'ar',
  TR = 'tr',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface AppSettings {
  companyName: string;
  companyLogo: string;
  favicon: string;
  copyrightText: string;
  timezone: string;
  companyLatitude: number;
  companyLongitude: number;
  companyLocationRadius: number; // in meters
  businessAddress?: string;
}

export interface Currency {
    id: string;
    name: string;
    code: string;
    symbol: string;
    exchangeRate: number;
}

export interface ThemeSettings {
    primaryColor: string;
    
    // Light Mode
    bgColorPrimaryLight: string;
    bgColorSecondaryLight: string;
    textColorPrimaryLight: string;
    textColorSecondaryLight: string;
    borderColorLight: string;

    // Dark Mode
    bgColorPrimaryDark: string;
    bgColorSecondaryDark: string;
    textColorPrimaryDark: string;
    textColorSecondaryDark: string;
    borderColorDark: string;

    // General Styles
    borderRadius: string; 
    cardShadow: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    cardBorder: boolean;
}

export interface SecuritySettings {
    twoFactorEnabled: boolean;
    activeSessions: { id: string; browser: string; os: string; location: string; lastActivity: string }[];
}

export interface FinanceSettings {
    defaultCurrency: string; // Currency ID
    fiscalYearStart: string; // e.g., '01-01'
    invoicePrefix: string;
    estimatePrefix: string;
    incentiveBonusPool: number;
}

export interface ProjectSettings {
    sendTaskReminder: boolean;
    allowClientToCreateTasks: boolean;
}

export interface TaskSettings {
    allowUnassignedTasks: boolean;
}


export interface ModuleStatus {
    id: string;
    nameKey: string;
    enabled: boolean;
    icon: React.ComponentType<{ className?: string }>;
    isCustom?: boolean;
}

export interface AttendanceShift {
    id: string;
    name: string;
    startTime: string;
    halfDayTime: string;
    endTime: string;
    lateMarkAfter: number;
    maxCheckIn: number;
    officeDays: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
    isDefault: boolean;
}

export interface LeaveType {
    id: string;
    name: string;
    daysAllowed: number;
    isPaid: boolean;
    requiresDocument: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  checkInTime: number; // epoch time
  checkOutTime?: number; // epoch time
  locationType: CheckInLocation;
  latitude: number;
  longitude: number;
}

export type CheckInLocation = 'office' | 'home' | 'external';

export interface CheckInStatus {
  isCheckedIn: boolean;
  checkInTime: number | null; // epoch time
  locationStatus: CheckInLocation | 'error' | null;
  locationMessage: string | null;
}

export interface ActiveTimer {
  taskId: string;
  startTime: number; // epoch time
}

export type ModalRequest = 'add_project' | 'add_task' | 'add_client' | 'add_employee' | null;

export interface KPI {
    id: string;
    nameKey: string;
    type: 'automatic' | 'manual';
    weight: number;
}

export type MessageStatus = 'sent' | 'delivered' | 'seen';

export interface ChatMessage {
    id: string;
    chatId: string;
    senderId: string; // Employee ID of sender
    text: string;
    timestamp: string; // ISO String for easier sorting
    status: MessageStatus;
    attachment?: { type: 'image' | 'file', url: string, name: string, size?: string };
    voiceNoteUrl?: string;
    voiceNoteDuration?: number;
    replyToMessageId?: string; // messageId of the message being replied to
    forwardedFrom?: { name: string };
    mentionedUserIds?: string[];
}

export interface ChatConversation {
    id: string;
    isGroup: boolean;
    name: string;
    avatar: string;
    lastMessageText: string;
    lastMessageTimestamp: string;
    unreadCount: number;
    participantIds: string[];
    isMuted?: boolean;
    isPinned?: boolean;
}

export interface SalaryComponent {
    name: string;
    amount: number;
}

export interface SalaryStructure {
    payType: 'Monthly' | 'Hourly';
    monthlyRate?: number;
    hourlyRate?: number;
    overtimeRate?: number;
    allowances: SalaryComponent[];
    deductions: SalaryComponent[];
}
export interface AttendanceSummary {
    daysWorked: number;
    lateDays: number;
    totalLatenessMinutes: number;
    latenessDeduction: number;
}

export interface PerformanceSummary {
    kpiScore: number;
    performanceBonus: number;
}

export interface Payslip {
    id: string;
    employeeId: string;
    payPeriod: string; // e.g., "2024-07"
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
    earnings: SalaryComponent[];
    deductions: SalaryComponent[];
    status: 'Pending' | 'Paid' | 'Cancelled';
    attendanceSummary: AttendanceSummary;
    performanceSummary: PerformanceSummary;
}

export interface CustomTable {
  id: string;
  name: string; // Singular name
  pluralName: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  modalRequest: ModalRequest;
  setModalRequest: React.Dispatch<React.SetStateAction<ModalRequest>>;

  // Global State for all data
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  appreciations: Appreciation[];
  setAppreciations: React.Dispatch<React.SetStateAction<Appreciation[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  timeLogs: TimeLog[];
  setTimeLogs: React.Dispatch<React.SetStateAction<TimeLog[]>>;
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  holidays: Holiday[];
  setHolidays: React.Dispatch<React.SetStateAction<Holiday[]>>;
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  designations: Designation[];
  setDesignations: React.Dispatch<React.SetStateAction<Designation[]>>;
  chatConversations: ChatConversation[];
  setChatConversations: React.Dispatch<React.SetStateAction<ChatConversation[]>>;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  warehouseItems: WarehouseItem[];
  setWarehouseItems: React.Dispatch<React.SetStateAction<WarehouseItem[]>>;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  contracts: Contract[];
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  estimates: Estimate[];
  setEstimates: React.Dispatch<React.SetStateAction<Estimate[]>>;
  proposals: Proposal[];
  setProposals: React.Dispatch<React.SetStateAction<Proposal[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  creditNotes: CreditNote[];
  setCreditNotes: React.Dispatch<React.SetStateAction<CreditNote[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  bankAccounts: BankAccount[];
  setBankAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  knowledgeBaseArticles: KnowledgeBaseArticle[];
  setKnowledgeBaseArticles: React.Dispatch<React.SetStateAction<KnowledgeBaseArticle[]>>;
  notificationSettings: NotificationSetting[];
  setNotificationSettings: React.Dispatch<React.SetStateAction<NotificationSetting[]>>;
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  customFields: CustomField[];
  setCustomFields: React.Dispatch<React.SetStateAction<CustomField[]>>;
  taskCategories: string[];
  setTaskCategories: React.Dispatch<React.SetStateAction<string[]>>;
  payslips: Payslip[];
  setPayslips: React.Dispatch<React.SetStateAction<Payslip[]>>;
  
  // New Settings State
  appSettings: AppSettings;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  currencies: Currency[];
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>;
  activeThemeSettings: ThemeSettings;
  setActiveThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings>>;
  modules: ModuleStatus[];
  setModules: React.Dispatch<React.SetStateAction<ModuleStatus[]>>;
  securitySettings: SecuritySettings;
  setSecuritySettings: React.Dispatch<React.SetStateAction<SecuritySettings>>;
  financeSettings: FinanceSettings;
  setFinanceSettings: React.Dispatch<React.SetStateAction<FinanceSettings>>;
  projectSettings: ProjectSettings;
  setProjectSettings: React.Dispatch<React.SetStateAction<ProjectSettings>>;
  taskSettings: TaskSettings;
  setTaskSettings: React.Dispatch<React.SetStateAction<TaskSettings>>;
  attendanceShifts: AttendanceShift[];
  setAttendanceShifts: React.Dispatch<React.SetStateAction<AttendanceShift[]>>;
  leaveTypes: LeaveType[];
  setLeaveTypes: React.Dispatch<React.SetStateAction<LeaveType[]>>;
  checkInStatus: CheckInStatus;
  setCheckInStatus: React.Dispatch<React.SetStateAction<CheckInStatus>>;
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  activeTimer: ActiveTimer | null;
  setActiveTimer: React.Dispatch<React.SetStateAction<ActiveTimer | null>>;
  kpis: KPI[];
  setKpis: React.Dispatch<React.SetStateAction<KPI[]>>;
  manualKpiScores: Record<string, Record<string, number>>; // { employeeId: { kpiId: score } }
  setManualKpiScores: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;

  // Dynamic Sidebar
  navItems: NavItem[];
  setNavItems: React.Dispatch<React.SetStateAction<NavItem[]>>;
  
  // Detail View Navigation
  selectedProjectId: string | null;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTaskId: string | null;
  setSelectedTaskId: React.Dispatch<React.SetStateAction<string | null>>;

  // Current User
  currentUser: Employee | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<Employee | null>>;
  
  // Custom Table Builder
  customTables: CustomTable[];
  setCustomTables: React.Dispatch<React.SetStateAction<CustomTable[]>>;
  customTableData: Record<string, Record<string, any>[]>;
  setCustomTableData: React.Dispatch<React.SetStateAction<Record<string, Record<string, any>[]>>>;
}

export type ModuleDataMap = {
  [K in CustomFieldModule]: any[];
};


export interface NavItem {
  id: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  isCustom?: boolean;
  subItems?: NavItem[];
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  role: string; // This is designation title
  department: string; // This is department name
  email: string;
  status: 'Active' | 'On Leave';
  customFieldData?: Record<string, any>;
  
  // New fields from the form
  salutation?: 'Mr' | 'Mrs' | 'Miss' | 'Ms' | 'Dr';
  password?: string;
  country?: string;
  gender?: 'Male' | 'Female' | 'Other';
  mobile?: string;
  joiningDate: string;
  dateOfBirth?: string;
  reportingTo?: string; // another employee's ID
  language?: Language;
  userRole?: string; // Role name, e.g., 'Admin', 'Employee'
  address?: string;
  about?: string;
  loginAllowed?: boolean;
  emailNotifications?: boolean;
  skills?: string;
  slackMemberId?: string;
  probationEndDate?: string;
  noticePeriodStartDate?: string;
  noticePeriodEndDate?: string;
  employmentType?: string;
  maritalStatus?: string;
  businessAddress?: string;
  marriageAnniversaryDate?: string;

  // Salary fields
  salaryStructure?: SalaryStructure;
}

export interface Project {
  id: string;
  projectCode: string;
  name: string;
  client: string;
  vendorId?: string;
  collectionNames?: string[];
  deadline: string;
  progress: number;
  status: 'In Progress' | 'Completed' | 'Pending';
  team: { avatar: string }[];
  customFieldData?: Record<string, any>;

  // New fields from the modal
  projectPrefix?: string;
  startDate?: string;
  category?: string; // category ID
  department?: string[];
  summary?: string; // rich text
  notes?: string; // rich text
  publicGantt?: boolean;
  publicTaskBoard?: boolean;
  taskNeedsApproval?: boolean;
  isPublic?: boolean;
  members?: string[]; // employee IDs
  files?: any[]; // file objects
  budget?: number;
  hoursEstimate?: number;
  currency?: string; // currency ID
  allowManualTimeLogs?: boolean;
  miroboardEnabled?: boolean;
  sendTaskNotificationToClient?: boolean;

  // Custom style fields
  styles?: {
    normalSize?: string[];
    round?: string[];
    runner?: string[];
    styleLife?: string[];
    video?: string[];
  };
  quantities?: {
    normal?: number;
    round?: number;
    runner?: number;
    video?: number;
  };
}

export interface TaskFile {
  id: string;
  name: string;
  url: string;
  size: string;
}

export interface TaskComment {
    id: string;
    author: { id: string; name: string; avatar: string };
    text: string;
    timestamp: string;
}

export interface TaskHistory {
    id: string;
    actor: { name: string };
    action: string;
    timestamp: string;
}


export interface Task {
  id: string;
  taskCode: string;
  name: string;
  projectId?: string;
  parentId?: string | null;
  startDate: string;
  dueDate: string;
  completedOn?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
  assigneeIds?: string[];
  assignees?: { id: string; name: string; avatar: string }[];
  assignedById?: string; // Employee ID
  isBillable?: boolean;
  estimatedTime?: string; // e.g., "8h"
  hoursLogged?: string; // e.g., "5h 30m"
  description?: string;
  category?: string;
  label?: string;
  milestones?: string;
  perspectives?: string[];
  files?: TaskFile[];
  comments?: TaskComment[];
  notes?: string;
  history?: TaskHistory[];
  customFieldData?: Record<string, any>;
}

export interface Appreciation {
  id: string;
  from: { name: string; avatar: string };
  to: { name: string; avatar: string };
  message: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string; // Client Name
  email: string;
  status: 'Active' | 'Inactive';
  avatar: string; // Profile Picture
  
  // Account Details
  salutation?: 'Mr' | 'Mrs' | 'Miss' | 'Ms' | 'Dr';
  password?: string;
  mobile?: string;
  country?: string;
  gender?: 'Male' | 'Female' | 'Other';
  language?: Language;
  category?: string;
  subCategory?: string;
  loginAllowed?: boolean;
  emailNotifications?: boolean;
  
  // Company Details
  company: string;
  website?: string;
  taxName?: string;
  gstNumber?: string;
  officePhone?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  companyAddress?: string;
  shippingAddress?: string;
  addedBy?: string; 
  companyLogo?: string;
  note?: string;
  
  customFieldData?: Record<string, any>;
}

export interface Deal {
    id: string;
    title: string;
    customer: string;
    value: number;
    stage: 'Lead' | 'Contact Made' | 'Proposal Sent' | 'Won' | 'Lost';
    customFieldData?: Record<string, any>;
}

export interface TimeLog {
    id: string;
    employeeId: string;
    taskId: string;
    startTime: number; // epoch
    endTime: number; // epoch
    memo: string;
    // Denormalized for easier display
    employeeName: string;
    projectName: string;
    taskName: string;
    date: string;
    duration: string;
}

export interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    employeeAvatar: string;
    leaveType: 'Annual' | 'Sick' | 'Unpaid';
    startDate: string;
    endDate: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    reason: string;
    customFieldData?: Record<string, any>;
}

export interface Holiday {
    date: string;
    name: string;
    day: string;
}

export interface Department {
    id: string;
    name: string;
    head: string;
    memberCount: number;
    customFieldData?: Record<string, any>;
}

export interface Designation {
    id: string;
    title: string;
    department: string;
    customFieldData?: Record<string, any>;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar: string;
  customFieldData?: Record<string, any>;
}

export interface Order {
    id: string;
    customerName: string;
    date: string;
    amount: number;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    customFieldData?: Record<string, any>;
}

export interface Vendor {
    id: string;
    name: string;
    category: string;
    email: string;
    customFieldData?: Record<string, any>;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    customFieldData?: Record<string, any>;
}

export interface WarehouseItem {
    id: string;
    clientName: string;
    vendorId: string;
    collectionNames: string[];
    numberOfCarpets: number;
    entryDate: string;
    exitDate: string;
    projectId?: string | null;
    receivedById?: string; // employee ID
    customFieldData?: Record<string, any>;
}

export interface Ticket {
    id: string;
    subject: string;
    clientName: string;
    assignedTo: string;
    status: 'Open' | 'In Progress' | 'Closed';
    priority: 'High' | 'Medium' | 'Low';
    date: string;
    customFieldData?: Record<string, any>;
}

export interface NotificationSetting {
    id: string;
    labelKey: string;
    email: boolean;
    inApp: boolean;
}

export type PermissionLevel = 'all' | 'added' | 'owned' | 'both' | 'none';

export interface Permission {
    moduleKey: string;
    add: PermissionLevel;
    view: PermissionLevel;
    update: PermissionLevel;
    delete: PermissionLevel;
    more?: boolean;
    isSpecial?: boolean;
}

export interface Role {
    id: string;
    nameKey: string;
    permissions: Permission[];
}

export interface Notification {
    id: string;
    avatar: string;
    text: string;
    timestamp: string;
    read: boolean;
}

export interface Contract {
    id: string;
    name: string;
    client: string;
    amount: number;
    startDate: string;
    endDate: string;
    customFieldData?: Record<string, any>;
}
export interface Proposal {
    id: string;
    name: string;
    lead: string;
    amount: number;
    date: string;
    customFieldData?: Record<string, any>;
}
export interface Estimate {
    id: string;
    name: string;
    client: string;
    amount: number;
    validTill: string;
    customFieldData?: Record<string, any>;
}
export interface Invoice {
    id: string;
    name: string;
    project: string;
    amount: number;
    issueDate: string;
    customFieldData?: Record<string, any>;
}
export interface Payment {
    id: string;
    name: string;
    invoice: string;
    amount: number;
    paymentDate: string;
    customFieldData?: Record<string, any>;
}
export interface CreditNote {
    id: string;
    name: string;
    invoice: string;
    amount: number;
    customFieldData?: Record<string, any>;
}
export interface Expense {
    id: string;
    name: string;
    category: string;
    amount: number;
    customFieldData?: Record<string, any>;
}
export interface BankAccount {
    id: string;
    name: string;
    bankName: string;
    customFieldData?: Record<string, any>;
}
export interface Event {
    id: string;
    name: string;
    date: string;
    customFieldData?: Record<string, any>;
}
export interface KnowledgeBaseArticle {
    id: string;
    name: string;
    category: string;
    customFieldData?: Record<string, any>;
}

// Custom Fields
export type CustomFieldModule = 
    | 'projects' | 'tasks' | 'clients' | 'leads' | 'products' | 'contacts' 
    | 'deals' | 'warehouse' | 'vendors' | 'employees' | 'leaves' | 'designation' 
    | 'department' | 'contracts' | 'proposal' | 'estimates' | 'invoices' 
    | 'payments' | 'credit_note' | 'expenses' | 'bank_account' | 'orders' 
    | 'tickets' | 'events' | 'knowledge_base';

export type CustomFieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'multiselect';

export interface CustomField {
    id: string;
    module: CustomFieldModule | string; // Allow string for custom table IDs
    label: string;
    type: CustomFieldType;
    required: boolean;
    options?: string[]; // For 'select' & 'multiselect' (manual source)
    relatedModule?: CustomFieldModule | string; // For 'select' & 'multiselect' (relational source)
}