import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Event } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XIcon, BriefcaseIcon } from './icons/Icons';

const AddEventModal = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [date, setDate] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !date) return;
        const newEvent: Partial<Event> = {
            id: `e_${Date.now()}`,
            name,
            date,
        };
        onSave(newEvent as Event);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('add_event')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name')} *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('name')}
                            className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('date')} *</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                     <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};

const CalendarPage: React.FC = () => {
    const { t } = useTranslation();
    const { events, setEvents, projects } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthName = 'July 2024';
    
    // Dummy calendar data for grid structure
    const dates = Array.from({ length: 35 }, (_, i) => {
        const day = i - 3;
        if (day > 0 && day <= 31) return day;
        return null;
    });

    // Combine events and project deadlines into one list for the calendar
    const eventColors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];
    const calendarItems = [
        ...events.map((event, index) => ({
            id: `event-${event.id}`,
            date: event.date,
            title: event.name,
            type: 'event' as const,
            color: eventColors[index % eventColors.length],
        })),
        ...projects.map(project => ({
            id: `project-${project.id}`,
            date: project.deadline,
            title: project.name,
            type: 'project' as const,
            color: '#22c55e', // Green for projects
        })),
    ];

    // Process all calendar items into a daily map
    const processedItems = calendarItems.reduce((acc, item) => {
        // We are assuming the date format is YYYY-MM-DD and the month is July 2024 for this demo
        if (item.date && item.date.startsWith('2024-07-')) {
            const day = parseInt(item.date.split('-')[2], 10);
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(item);
        }
        return acc;
    }, {} as Record<number, typeof calendarItems>);

    const handleSaveEvent = (newEvent: Event) => {
        setEvents(prevEvents => [...prevEvents, newEvent]);
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveEvent} />
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                        <ChevronLeftIcon className="w-6 h-6"/>
                    </button>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{monthName}</h2>
                    <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                        <ChevronRightIcon className="w-6 h-6"/>
                    </button>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <PlusIcon className="w-5 h-5"/>
                    <span className="text-sm font-medium">{t('add_event')}</span>
                </button>
            </div>

            <div className="flex-grow bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col">
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                    {days.map(day => (
                        <div key={day} className="p-4 text-center font-semibold text-sm text-gray-600 dark:text-gray-300 uppercase">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-5 flex-grow">
                    {dates.map((date, i) => (
                        <div 
                            key={i} 
                            className={`p-2 border-r border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 space-y-1 ${date ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-800/50'} 
                            ${(i % 7 === 6) ? 'border-r-0' : ''} ${i > 27 ? 'border-b-0' : ''}`}
                        >
                            {date && (
                                <>
                                    <span className={`text-sm font-medium ${date === 20 ? 'bg-blue-600 text-white rounded-full h-7 w-7 flex items-center justify-center' : 'text-gray-800 dark:text-white'}`}>
                                        {date}
                                    </span>
                                    <div className="space-y-1">
                                        {processedItems[date]?.map(item => (
                                            <div 
                                                key={item.id}
                                                className="p-1 rounded-md text-white text-[10px] leading-tight flex items-center gap-1" 
                                                style={{ backgroundColor: item.color }}
                                                title={item.title}
                                            >
                                                {item.type === 'project' && <BriefcaseIcon className="w-3 h-3 shrink-0" />}
                                                <span className="truncate">{item.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;