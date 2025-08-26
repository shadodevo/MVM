import React from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './hooks/useApp';
import { useTranslation } from './hooks/useTranslation';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import CalendarPage from './components/CalendarPage';
import TasksPage from './components/TasksPage';
import ProjectsPage from './components/ProjectsPage';
import CustomersPage from './components/CustomersPage';
import ContactsPage from './components/ContactsPage';
import OrdersPage from './components/OrdersPage';
import DealsPage from './components/DealsPage';
import ReportsPage from './components/ReportsPage';
import MessagesPage from './components/TeamChatPage';
import EmployeesPage from './components/EmployeesPage';
import AppreciationPage from './components/AppreciationPage';
import LeavesPage from './components/LeavesPage';
import ShiftRosterPage from './components/ShiftRosterPage';
import AttendancePage from './components/AttendancePage';
import HolidaysPage from './components/HolidaysPage';
import DesignationPage from './components/DesignationPage';
import DepartmentPage from './components/DepartmentPage';
import WarehousePage from './components/WarehousePage';
import VendorsPage from './components/VendorsPage';
import ProductsPage from './components/ProductsPage';
import TicketsPage from './components/TicketsPage';
import PerformancePage from './components/PerformancePage';
import SalariesPage from './components/SalariesPage';
import { NavItem } from './types';
import CustomTablePage from './components/CustomTablePage';

const PlaceholderPage: React.FC<{title: string}> = ({title}) => {
    const { t } = useTranslation();
    return (
        <div className="p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{title}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">{t('under_construction')}</p>
        </div>
    );
}

const findNavItemRec = (items: NavItem[], pageId: string): NavItem | null => {
    for (const item of items) {
        if (item.id === pageId) return item;
        if (item.subItems) {
            const found = findNavItemRec(item.subItems, pageId);
            if (found) return found;
        }
    }
    return null;
};

const PageContent: React.FC = () => {
    const { activePage, navItems, customTables } = useApp();
    const { t } = useTranslation();

    const renderPage = () => {
        const customTable = customTables.find(t => t.id === activePage);
        if (customTable) {
            return <CustomTablePage tableId={customTable.id} />;
        }

        switch(activePage) {
            case 'dashboard': return <Dashboard />;
            case 'my_calendar': return <CalendarPage />;
            
            // Leads
            case 'lead': return <PlaceholderPage title={t('lead')} />;
            case 'contacts': return <ContactsPage />;
            case 'deals': return <DealsPage />;
            
            case 'clients': return <CustomersPage />;
            case 'warehouse': return <WarehousePage />;
            case 'vendors': return <VendorsPage />;

            // HR
            case 'employees': return <EmployeesPage />;
            case 'appreciation': return <AppreciationPage />;
            case 'leaves': return <LeavesPage />;
            case 'shift_roster': return <ShiftRosterPage />;
            case 'attendance': return <AttendancePage />;
            case 'holiday': return <HolidaysPage />;
            case 'designation': return <DesignationPage />;
            case 'department': return <DepartmentPage />;
            case 'performance_kpis': return <PerformancePage />;
            
            // Work
            case 'contracts': return <PlaceholderPage title={t('contracts')} />;
            case 'projects': return <ProjectsPage />;
            case 'tasks': return <TasksPage />;

            // Finance
            case 'proposal': return <PlaceholderPage title={t('proposal')} />;
            case 'estimates': return <PlaceholderPage title={t('estimates')} />;
            case 'invoices': return <PlaceholderPage title={t('invoices')} />;
            case 'payments': return <PlaceholderPage title={t('payments')} />;
            case 'salaries_payroll': return <SalariesPage />;
            case 'credit_note': return <PlaceholderPage title={t('credit_note')} />;
            case 'expenses': return <PlaceholderPage title={t('expenses')} />;

            case 'bank_account': return <PlaceholderPage title={t('bank_account')} />;
            case 'products': return <ProductsPage />;
            case 'orders': return <OrdersPage />;
            case 'tickets': return <TicketsPage />;
            case 'events': return <PlaceholderPage title={t('events')} />;
            case 'messages': return <MessagesPage />;
            case 'notice_board':return <PlaceholderPage title={t('notice_board')} />;
            case 'feeds': return <PlaceholderPage title={t('feeds')} />;
            
            // Reports
            case 'reports': return <ReportsPage />;
            case 'task_report': return <PlaceholderPage title={t('task_report')} />;
            case 'time_log_report': return <PlaceholderPage title={t('time_log_report')} />;
            case 'finance_report': return <PlaceholderPage title={t('finance_report')} />;
            case 'income_vs_expense': return <PlaceholderPage title={t('income_vs_expense')} />;
            case 'leave_report': return <PlaceholderPage title={t('leave_report')} />;
            case 'attendance_report': return <PlaceholderPage title={t('attendance_report')} />;
            case 'expense_report': return <PlaceholderPage title={t('expense_report')} />;
            case 'deal_report': return <PlaceholderPage title={t('deal_report')} />;
            case 'sales_report': return <PlaceholderPage title={t('sales_report')} />;
            
            case 'settings': return <Settings />;
            default:
                const navItem = findNavItemRec(navItems, activePage);
                // This now handles custom links created via Sidebar Settings
                if (navItem?.isCustom) {
                     return <PlaceholderPage title={navItem.labelKey} />;
                }
                return (
                    <div className="p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('page_not_found')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{t('page_does_not_exist', { page: activePage })}</p>
                    </div>
                );
        }
    }
    return renderPage();
}

const AppLayout: React.FC = () => {
  const { isSidebarOpen } = useApp();

  return (
    <div className={`flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans`}>
      <Sidebar />
      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${isSidebarOpen ? 'ms-64' : 'ms-20'}`}>
        <Header />
        <main className="flex-1 overflow-y-auto">
          <PageContent />
        </main>
      </div>
    </div>
  );
}


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default App;