

import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useTranslation } from '../hooks/useTranslation';
import { NavItem } from '../types';
import { 
    SettingsIcon, ChevronLeftIcon, 
    ChevronRightIcon, ChevronDownIcon
} from './icons/Icons';

const NavLink: React.FC<{ item: NavItem; isSubItem?: boolean }> = ({ item, isSubItem = false }) => {
  const { isSidebarOpen, activePage, setActivePage } = useApp();
  const { t } = useTranslation();
  const isActive = activePage === item.id;

  return (
    <li>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); setActivePage(item.id); }}
        className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
          isActive 
            ? 'bg-blue-600 text-white' 
            : `text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${isSubItem ? 'pl-11' : ''}`
        }`}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        <span className={`ms-3 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{t(item.labelKey)}</span>
      </a>
    </li>
  );
};

const NavDropdown: React.FC<{ item: NavItem }> = ({ item }) => {
    const { isSidebarOpen, activePage } = useApp();
    const { t } = useTranslation();
    const isParentActive = item.subItems?.some(sub => sub.id === activePage);
    const [isOpen, setIsOpen] = useState(isParentActive || false);
    
    const visibleSubItems = item.subItems?.filter(sub => sub.visible) || [];
    if (visibleSubItems.length === 0) {
        return <NavLink item={{...item, subItems: []}} />;
    }

    return (
        <li>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors duration-200 ${
                    isParentActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
                <div className="flex items-center">
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className={`ms-3 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{t(item.labelKey)}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
            </button>
            {isOpen && isSidebarOpen && (
                <ul className="pt-2 space-y-2">
                    {visibleSubItems.map(subItem => <NavLink key={subItem.id} item={subItem} isSubItem />)}
                </ul>
            )}
        </li>
    )
}

const Sidebar: React.FC = () => {
  const { isSidebarOpen, setIsSidebarOpen, language, activePage, setActivePage, navItems } = useApp();
  const { t } = useTranslation();

  return (
    <aside className={`fixed top-0 left-0 rtl:left-auto rtl:right-0 z-40 bg-gray-50 dark:bg-gray-800 h-screen flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className={`flex items-center gap-2 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <img src="https://i.imgur.com/K7IfH2s.png" alt="MVM Studio Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap">MVM Studio</span>
        </div>
        <div className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}>
           {!isSidebarOpen && <img src="https://i.imgur.com/K7IfH2s.png" alt="MVM Studio Logo" className="h-8 w-8 object-contain" />}
        </div>
      </div>
      
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="absolute top-5 -right-3.5 rtl:right-auto rtl:-left-3.5 z-50 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800"
        aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isSidebarOpen ? (language === 'ar' ? <ChevronRightIcon className="w-5 h-5"/> : <ChevronLeftIcon className="w-5 h-5"/>) : (language === 'ar' ? <ChevronLeftIcon className="w-5 h-5"/> : <ChevronRightIcon className="w-5 h-5"/>)}
      </button>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2">
        <ul className="space-y-1">
          {navItems.filter(item => item.visible).map((item) => (
            item.subItems ? <NavDropdown key={item.id} item={item} /> : <NavLink key={item.id} item={item} />
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); setActivePage('settings'); }}
          className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
            activePage === 'settings'
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <SettingsIcon className="w-5 h-5 shrink-0" />
          <span className={`ms-3 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{t('settings')}</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;