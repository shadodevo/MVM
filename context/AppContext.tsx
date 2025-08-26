import React, { createContext, useState, useEffect } from 'react';
import { 
    AppContextType, Theme, Language, CustomField, Project, Task, Appreciation, Customer, Contact, 
    Order, Deal, TimeLog, LeaveRequest, Holiday, Department, Designation, ChatMessage, Vendor, 
    Product, WarehouseItem, Ticket, Contract, Invoice, Estimate, Proposal, Payment, CreditNote, 
    Expense, BankAccount, Event, KnowledgeBaseArticle, NotificationSetting, Role, Notification, 
    Employee, AppSettings, Currency, ThemeSettings, ModuleStatus, SecuritySettings, FinanceSettings,
    ProjectSettings, TaskSettings, AttendanceShift, LeaveType, CheckInStatus, NavItem, ModalRequest, AttendanceRecord, ActiveTimer, KPI, ChatConversation, Payslip, CustomTable
} from '../types';
import {
    mockCustomFields, mockProjects, mockTasks, mockAppreciations, mockCustomers, mockContacts,
    mockOrders, mockDeals, mockTimeLogs, mockLeaveRequests, mockHolidays, mockDepartments,
    mockDesignations, mockChatMessages, mockVendors, mockProducts, mockWarehouseItems, mockTickets,
    mockContracts, mockInvoices, mockEstimates, mockProposals, mockPayments, mockCreditNotes,
    mockExpenses, mockBankAccounts, mockEvents, mockKnowledgeBaseArticles, mockNotificationSettings,
    mockRoles, mockNotifications, mockEmployees, mockAppSettings, mockCurrencies, mockThemeSettings,
    mockModules, mockSecuritySettings, mockFinanceSettings, mockProjectSettings, mockTaskSettings,
    mockAttendanceShifts, mockLeaveTypes, mockNavItems, mockTaskCategories, mockAttendanceRecords,
    mockKpis, mockManualKpiScores, mockChatConversations, mockPayslips, mockCustomTables, mockCustomTableData
} from '../data/mockData';

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [modalRequest, setModalRequest] = useState<ModalRequest>(null);

  // Global state for all data models
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [appreciations, setAppreciations] = useState<Appreciation[]>(mockAppreciations);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(mockTimeLogs);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [designations, setDesignations] = useState<Designation[]>(mockDesignations);
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>(mockChatConversations);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>(mockWarehouseItems);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [estimates, setEstimates] = useState<Estimate[]>(mockEstimates);
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>(mockCreditNotes);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [knowledgeBaseArticles, setKnowledgeBaseArticles] = useState<KnowledgeBaseArticle[]>(mockKnowledgeBaseArticles);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>(mockNotificationSettings);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [customFields, setCustomFields] = useState<CustomField[]>(mockCustomFields);
  const [taskCategories, setTaskCategories] = useState<string[]>(mockTaskCategories);
  const [payslips, setPayslips] = useState<Payslip[]>(mockPayslips);
  
  // Settings State
  const [appSettings, setAppSettings] = useState<AppSettings>(mockAppSettings);
  const [currencies, setCurrencies] = useState<Currency[]>(mockCurrencies);
  const [activeThemeSettings, setActiveThemeSettings] = useState<ThemeSettings>(mockThemeSettings);
  const [modules, setModules] = useState<ModuleStatus[]>(mockModules);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(mockSecuritySettings);
  const [financeSettings, setFinanceSettings] = useState<FinanceSettings>(mockFinanceSettings);
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>(mockProjectSettings);
  const [taskSettings, setTaskSettings] = useState<TaskSettings>(mockTaskSettings);
  const [attendanceShifts, setAttendanceShifts] = useState<AttendanceShift[]>(mockAttendanceShifts);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(mockLeaveTypes);
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>({ isCheckedIn: false, checkInTime: null, locationStatus: null, locationMessage: null });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [navItems, setNavItems] = useState<NavItem[]>(mockNavItems);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [kpis, setKpis] = useState<KPI[]>(mockKpis);
  const [manualKpiScores, setManualKpiScores] = useState<Record<string, Record<string, number>>>(mockManualKpiScores);

  // Custom Table Builder State
  const [customTables, setCustomTables] = useState<CustomTable[]>(mockCustomTables);
  const [customTableData, setCustomTableData] = useState<Record<string, Record<string, any>[]>>(mockCustomTableData);

  
  // Detail View Navigation
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Current User
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => mockEmployees.find(e => e.id === '7') || null);


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
    root.classList.add(theme);
    root.lang = language;
    root.dir = language === Language.AR ? 'rtl' : 'ltr';
    // Font family is now handled via CSS variables in the next useEffect
  }, [theme, language]);

  useEffect(() => {
    const styleTag = document.getElementById('dynamic-theme-styles');
    if (!styleTag) return;

    const isLight = theme === Theme.LIGHT;

    const shadowMap = {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    };

    styleTag.innerHTML = `
      :root {
        --font-inter: 'Inter', sans-serif;
        --font-cairo: 'Cairo', sans-serif;
        
        /* Static Theme Settings */
        --color-primary: ${activeThemeSettings.primaryColor};
        --radius: ${activeThemeSettings.borderRadius};
        --card-shadow: ${shadowMap[activeThemeSettings.cardShadow] || 'none'};
        --card-border-width: ${activeThemeSettings.cardBorder ? '1px' : '0px'};

        /* Dynamic Colors based on Light/Dark Mode */
        --color-bg-primary: ${isLight ? activeThemeSettings.bgColorPrimaryLight : activeThemeSettings.bgColorPrimaryDark};
        --color-bg-secondary: ${isLight ? activeThemeSettings.bgColorSecondaryLight : activeThemeSettings.bgColorSecondaryDark};
        --color-text-primary: ${isLight ? activeThemeSettings.textColorPrimaryLight : activeThemeSettings.textColorPrimaryDark};
        --color-text-secondary: ${isLight ? activeThemeSettings.textColorSecondaryLight : activeThemeSettings.textColorSecondaryDark};
        --color-border: ${isLight ? activeThemeSettings.borderColorLight : activeThemeSettings.borderColorDark};
      }
    `;
    
    // Set body font based on language
     document.body.style.fontFamily = language === Language.AR ? "var(--font-cairo)" : "var(--font-inter)";

  }, [activeThemeSettings, theme, language]);


  const value = {
    theme, setTheme,
    language, setLanguage,
    isSidebarOpen, setIsSidebarOpen,
    activePage, setActivePage,
    modalRequest, setModalRequest,
    
    employees, setEmployees,
    projects, setProjects,
    tasks, setTasks,
    appreciations, setAppreciations,
    customers, setCustomers,
    contacts, setContacts,
    orders, setOrders,
    deals, setDeals,
    timeLogs, setTimeLogs,
    leaveRequests, setLeaveRequests,
    holidays, setHolidays,
    departments, setDepartments,
    designations, setDesignations,
    chatConversations, setChatConversations,
    chatMessages, setChatMessages,
    vendors, setVendors,
    products, setProducts,
    warehouseItems, setWarehouseItems,
    tickets, setTickets,
    contracts, setContracts,
    invoices, setInvoices,
    estimates, setEstimates,
    proposals, setProposals,
    payments, setPayments,
    creditNotes, setCreditNotes,
    expenses, setExpenses,
    bankAccounts, setBankAccounts,
    events, setEvents,
    knowledgeBaseArticles, setKnowledgeBaseArticles,
    notificationSettings, setNotificationSettings,
    roles, setRoles,
    notifications, setNotifications,
    customFields, setCustomFields,
    taskCategories, setTaskCategories,
    payslips, setPayslips,

    // Settings
    appSettings, setAppSettings,
    currencies, setCurrencies,
    activeThemeSettings, setActiveThemeSettings,
    modules, setModules,
    securitySettings, setSecuritySettings,
    financeSettings, setFinanceSettings,
    projectSettings, setProjectSettings,
    taskSettings, setTaskSettings,
    attendanceShifts, setAttendanceShifts,
    leaveTypes, setLeaveTypes,
    checkInStatus, setCheckInStatus,
    attendanceRecords, setAttendanceRecords,
    activeTimer, setActiveTimer,
    kpis, setKpis,
    manualKpiScores, setManualKpiScores,
    
    // Sidebar
    navItems, setNavItems,

    // Detail View Navigation
    selectedProjectId, setSelectedProjectId,
    selectedTaskId, setSelectedTaskId,

    // Current User
    currentUser, setCurrentUser,

    // Custom Table Builder
    customTables, setCustomTables,
    customTableData, setCustomTableData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};