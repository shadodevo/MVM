import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../hooks/useApp';
import { useTranslation } from '../hooks/useTranslation';
import { Theme, Language, Notification, ModalRequest, CheckInLocation, AttendanceRecord, TimeLog, Task } from '../types';
import { SunIcon, MoonIcon, SearchIcon, PlusIcon, ClockIcon, BellIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, MapPinIcon, FilePlusIcon, CheckSquareIcon, UserPlusIcon, BriefcaseIcon, HomeIcon, StopIcon } from './icons/Icons';
import LogTimeModal from './LogTimeModal';


const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    return (
        <a href="#" className="flex items-start gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50">
            <img src={notification.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: notification.text }}></p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.timestamp}</p>
            </div>
            {!notification.read && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1 shrink-0"></span>}
        </a>
    )
}

const CheckOutSummaryModal = ({ isOpen, onClose, duration, tasksCompleted }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
                 <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('check_out_summary')}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="font-medium text-gray-600 dark:text-gray-300">{t('total_time')}</span>
                        <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{duration}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="font-medium text-gray-600 dark:text-gray-300">{t('tasks_completed_today')}</span>
                        <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{tasksCompleted}</span>
                    </div>
                </div>
                 <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">{t('close')}</button>
                </div>
            </div>
        </div>
    );
};

const CheckInModal = ({ isOpen, onClose, onSelectLocation }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    const locationOptions = [
        { key: 'office' as CheckInLocation, label: t('mvm_studio'), icon: <BriefcaseIcon /> },
        { key: 'home' as CheckInLocation, label: t('home'), icon: <HomeIcon /> },
        { key: 'external' as CheckInLocation, label: t('external_photoshoot'), icon: <MapPinIcon /> },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm">
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('check_in_location')}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-3">
                    {locationOptions.map(opt => (
                        <button 
                            key={opt.key} 
                            onClick={() => onSelectLocation(opt.key)}
                            className="w-full flex items-center gap-4 p-4 text-left bg-gray-100 dark:bg-gray-700/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition"
                        >
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow">{React.cloneElement(opt.icon, { className: 'w-6 h-6 text-blue-600' })}</div>
                            <span className="font-semibold text-gray-800 dark:text-white">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Helper functions for time calculation
const parseDurationStringToMinutes = (durationStr: string): number => {
    if (!durationStr || durationStr.toLowerCase().includes('s')) return 0;
    let totalMinutes = 0;
    const hoursMatch = durationStr.match(/(\d+)\s*h/);
    const minutesMatch = durationStr.match(/(\d+)\s*m/);
    if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
    if (minutesMatch) totalMinutes += parseInt(minutesMatch[1]);
    return totalMinutes;
};

const formatMinutesToDurationString = (totalMinutes: number): string => {
    if (totalMinutes === 0) return '0m';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    return result.trim();
};


const Header: React.FC = () => {
  const { theme, setTheme, language, setLanguage, setIsSidebarOpen, notifications, appSettings, checkInStatus, setCheckInStatus, tasks, setActivePage, setModalRequest, setAttendanceRecords, activeTimer, setActiveTimer, setTimeLogs, setTasks } = useApp();
  const { t } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [lastDuration, setLastDuration] = useState("00:00:00");
  const [runningTimer, setRunningTimer] = useState("00:00:00");
  const [isLogTimeModalOpen, setIsLogTimeModalOpen] = useState(false);

  useEffect(() => {
    let intervalId;
    if (checkInStatus.isCheckedIn && checkInStatus.checkInTime) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const diff = now - checkInStatus.checkInTime;
        const h = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const m = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
        const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        setTimer(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [checkInStatus.isCheckedIn, checkInStatus.checkInTime]);
  
   useEffect(() => {
    let intervalId;
    if (activeTimer) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const diff = now - activeTimer.startTime;
        const h = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const m = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
        const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        setRunningTimer(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [activeTimer]);

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };
  
  const handleCheckIn = async (locationType: CheckInLocation) => {
    setIsCheckInModalOpen(false);
    setIsCheckingLocation(true);
    
    if (!navigator.geolocation) {
        setIsCheckingLocation(false);
        alert(t('geolocation_not_supported'));
        return;
    }

    if (navigator.permissions) {
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            if (permissionStatus.state === 'denied') {
                alert(t('geolocation_permission_denied'));
                setIsCheckingLocation(false);
                return;
            }
        } catch(e) {
            console.warn("Could not query geolocation permission state.", e);
        }
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            let message = '';
            
            if (locationType === 'office') {
                 message = t('check_in_from_mvm_studio');
            } else if (locationType === 'home') {
                message = t('check_in_from_home');
            } else if (locationType === 'external') {
                message = t('check_in_from_external');
            }
            
            setCheckInStatus({
                isCheckedIn: true,
                checkInTime: Date.now(),
                locationStatus: locationType,
                locationMessage: message
            });

            const newRecord: AttendanceRecord = {
                id: `att_${Date.now()}`,
                employeeId: '2', // Hardcoded for demo user 'Ali erkan karakurt'
                checkInTime: Date.now(),
                locationType: locationType,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            setAttendanceRecords(prev => [...prev, newRecord]);

            setIsCheckingLocation(false);
        },
        (error) => {
            let userMessage = t('check_in_error');
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    userMessage = t('geolocation_permission_denied');
                    break;
                case error.POSITION_UNAVAILABLE:
                    userMessage = t('geolocation_position_unavailable');
                    break;
                case error.TIMEOUT:
                    userMessage = t('geolocation_timeout');
                    break;
            }
            
            alert(userMessage);

            setIsCheckingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCheckOut = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = tasks.filter(task => task.status === 'Done' && task.dueDate === today).length;
    setLastDuration(timer);
    setIsSummaryVisible(true);
    setCheckInStatus({ isCheckedIn: false, checkInTime: null, locationStatus: null, locationMessage: null });
    
    setAttendanceRecords(prev => {
        let activeRecordIndex = -1;
        for (let i = prev.length - 1; i >= 0; i--) {
            if (prev[i].employeeId === '2' && !prev[i].checkOutTime) {
                activeRecordIndex = i;
                break;
            }
        }

        if (activeRecordIndex > -1) {
            const updatedRecords = [...prev];
            updatedRecords[activeRecordIndex] = {
                ...updatedRecords[activeRecordIndex],
                checkOutTime: Date.now(),
            };
            return updatedRecords;
        }
        return prev;
    });

    setTimer("00:00:00");
  };
  
    const handleStopTimer = () => {
        setIsLogTimeModalOpen(true);
    };

    const handleSaveTimeLogFromTimer = (logData: Omit<TimeLog, 'id'>) => {
        const newLog: TimeLog = { ...logData, id: `log_${Date.now()}` };
        setTimeLogs(prev => [...prev, newLog]);

        const durationMinutes = (newLog.endTime - newLog.startTime) / (1000 * 60);
        
        setTasks(prevTasks => prevTasks.map(t => {
            if (t.id === activeTimer?.taskId) {
                const existingMinutes = parseDurationStringToMinutes(t.hoursLogged || '');
                const newTotalMinutes = existingMinutes + durationMinutes;
                const newHoursLogged = formatMinutesToDurationString(Math.round(newTotalMinutes));
                return { ...t, hoursLogged: newHoursLogged };
            }
            return t;
        }));
        
        setActiveTimer(null);
        setIsLogTimeModalOpen(false);
    };

  const handleQuickAction = (page: string, modal: ModalRequest) => {
      setModalRequest(modal);
      setActivePage(page);
      setQuickActionsOpen(false);
  }

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeTaskForTimer = activeTimer ? tasks.find(t => t.id === activeTimer.taskId) : null;
  
  const locationStatusColors = {
        office: 'text-green-500',
        home: 'text-purple-500',
        external: 'text-orange-500',
        error: 'text-red-500',
    };

  return (
    <>
    <CheckOutSummaryModal 
        isOpen={isSummaryVisible}
        onClose={() => setIsSummaryVisible(false)}
        duration={lastDuration}
        tasksCompleted={0} // Replace with actual logic later
    />
    <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onSelectLocation={handleCheckIn}
    />
    <LogTimeModal 
        isOpen={isLogTimeModalOpen && !!activeTimer}
        onClose={() => setIsLogTimeModalOpen(false)}
        onSave={handleSaveTimeLogFromTimer}
        task={activeTaskForTimer || null}
        startTimeEpoch={activeTimer?.startTime}
        endTimeEpoch={Date.now()}
      />
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden text-gray-500 dark:text-gray-400"
          aria-label="Open sidebar"
        >
          {language === 'ar' ? <ChevronRightIcon className="w-6 h-6"/> : <ChevronLeftIcon className="w-6 h-6"/>}
        </button>
        <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{t('welcome_back')}, Shady Omar!</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('project_manager')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {/* Quick Actions */}
        <div className="relative">
            <button onClick={() => setQuickActionsOpen(!quickActionsOpen)} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2">
                <PlusIcon className="w-5 h-5"/>
                <span className="hidden sm:inline">{t('quick_actions')}</span>
            </button>
            {quickActionsOpen && (
                 <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 py-1">
                    <a href="#" onClick={(e) => {e.preventDefault(); handleQuickAction('projects', 'add_project')}} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FilePlusIcon className="w-5 h-5 text-gray-500" />
                        <span>{t('add_project')}</span>
                    </a>
                    <a href="#" onClick={(e) => {e.preventDefault(); handleQuickAction('tasks', 'add_task')}} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CheckSquareIcon className="w-5 h-5 text-gray-500" />
                        <span>{t('add_task')}</span>
                    </a>
                     <a href="#" onClick={(e) => {e.preventDefault(); handleQuickAction('clients', 'add_client')}} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <UserPlusIcon className="w-5 h-5 text-gray-500" />
                        <span>{t('add_customer')}</span>
                    </a>
                    <a href="#" onClick={(e) => {e.preventDefault(); handleQuickAction('employees', 'add_employee')}} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <UserPlusIcon className="w-5 h-5 text-gray-500" />
                        <span>{t('add_employee')}</span>
                    </a>
                 </div>
            )}
        </div>
        
        {/* Active Task Timer */}
         {activeTimer && activeTaskForTimer && (
             <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 animate-pulse">
                <ClockIcon className="w-5 h-5 text-yellow-600"/>
                <div className="text-sm hidden lg:block">
                    <span className="font-semibold text-yellow-800 dark:text-yellow-200 truncate max-w-[150px] inline-block">{activeTaskForTimer.name}</span>
                </div>
                 <span className="font-mono font-bold text-gray-800 dark:text-white mx-2">{runningTimer}</span>
                <button onClick={handleStopTimer} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600" title={t('stop_timer')}>
                    <StopIcon className="w-4 h-4" />
                </button>
            </div>
        )}

        {/* Check-in/out button */}
        {checkInStatus.isCheckedIn ? (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <ClockIcon className="w-5 h-5 text-blue-500"/>
                    <span className="font-mono font-semibold text-gray-800 dark:text-white">{timer}</span>
                    {checkInStatus.locationStatus && (
                        <>
                            <span className="w-px h-4 bg-gray-300 dark:bg-gray-600"></span>
                            <MapPinIcon className={`w-5 h-5 ${locationStatusColors[checkInStatus.locationStatus] || 'text-gray-500'}`}/>
                            <span className="hidden lg:inline text-sm text-gray-600 dark:text-gray-300">{checkInStatus.locationMessage}</span>
                        </>
                    )}
                </div>
                <button onClick={handleCheckOut} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">{t('check_out')}</button>
            </div>
        ) : (
             <button 
                onClick={() => setIsCheckInModalOpen(true)}
                disabled={isCheckingLocation} 
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                <ClockIcon className="w-5 h-5"/>
                <span className="text-sm font-medium">{isCheckingLocation ? t('checking_location') : t('check_in')}</span>
            </button>
        )}
        
        <div className="relative">
            <button onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition relative">
                <BellIcon className="w-6 h-6"/>
                {unreadCount > 0 && <span className="absolute top-2 right-2 block w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            {notificationDropdownOpen && (
                 <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700">
                    <div className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-800 dark:text-white">{t('notifications')}</h4>
                        {unreadCount > 0 && <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.map(n => <NotificationItem key={n.id} notification={n}/>)}
                    </div>
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                        <a href="#" className="text-sm font-medium text-blue-600 hover:underline">{t('view_all_notifications')}</a>
                    </div>
                 </div>
            )}
        </div>

        <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          {theme === Theme.LIGHT ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
        
        <div className="relative">
            <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1">
                <span className="font-medium">{language.toUpperCase()}</span>
            </button>
            {langDropdownOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
                    <a href="#" onClick={(e) => {e.preventDefault(); changeLanguage(Language.EN)}} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('english')}</a>
                    <a href="#" onClick={(e) => {e.preventDefault(); changeLanguage(Language.AR)}} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('arabic')}</a>
                    <a href="#" onClick={(e) => {e.preventDefault(); changeLanguage(Language.TR)}} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t('turkish')}</a>
                </div>
            )}
        </div>

        <div className="flex items-center gap-2">
            <img src="https://i.pravatar.cc/150?u=shady" alt="User Avatar" className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;