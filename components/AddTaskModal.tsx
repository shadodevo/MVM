import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Task, Employee } from '../types';
import { XIcon as CloseIcon, CheckIcon, SearchIcon } from './icons/Icons';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
    taskToEdit?: Task | null;
    parentId?: string | null;
}

const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
);

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit, parentId }) => {
    const { t } = useTranslation();
    const { projects, employees, taskCategories, setTaskCategories, tasks, vendors, customers } = useApp();
    const [formData, setFormData] = useState<Partial<Task>>({});
    const [selectedProjectId, setSelectedProjectId] = useState('');
    
    // State for editable perspectives
    const [localPerspectives, setLocalPerspectives] = useState<string[]>(['Side', 'Rolled', 'Corner Back', 'Detay', 'Corner', 'Macro', 'Close Up']);
    const [newPerspective, setNewPerspective] = useState('');

    // State for editable categories
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    // State for assignee selector
    const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
    const [assigneeSearch, setAssigneeSearch] = useState('');
    const assigneeRef = useRef<HTMLDivElement>(null);


    const initialFormState: Partial<Task> = {
        name: '',
        projectId: projects[0]?.id || '',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'Medium',
        status: 'To Do',
        assigneeIds: [],
        description: '',
        category: taskCategories[0] || '',
        perspectives: [],
        isBillable: false,
        estimatedTime: '0h 0m'
    };

    const availableAssignees = useMemo(() => {
        const currentProjectId = formData.projectId || selectedProjectId;
        const selectedProject = projects.find(p => p.id === currentProjectId);
        if (!selectedProject || !selectedProject.members || selectedProject.members.length === 0) {
            return []; // Return empty if no project or no members on project
        }
        return employees.filter(emp => selectedProject.members!.includes(emp.id));
    }, [employees, projects, formData.projectId, selectedProjectId]);

    useEffect(() => {
        if (isOpen) {
            const initialState = taskToEdit ? { ...taskToEdit } : { ...initialFormState, parentId: parentId || null };
            setFormData(initialState);
            setSelectedProjectId(initialState.projectId || '');
        }
    }, [isOpen, taskToEdit, parentId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (assigneeRef.current && !assigneeRef.current.contains(event.target as Node)) {
                setIsAssigneeDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [assigneeRef]);

    useEffect(() => {
        const availableAssigneeIds = availableAssignees.map(a => a.id);
        const currentAssignees = formData.assigneeIds || [];
        const validAssignees = currentAssignees.filter(id => availableAssigneeIds.includes(id));
        
        if (validAssignees.length !== currentAssignees.length) {
            setFormData(prev => ({...prev, assigneeIds: validAssignees}));
        }
    }, [availableAssignees, formData.assigneeIds]);


    if (!isOpen) return null;
    
    const selectedProject = projects.find(p => p.id === selectedProjectId);
    const client = customers.find(c => c.name === selectedProject?.client);
    const vendor = vendors.find(v => v.id === selectedProject?.vendorId);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'projectId') {
            setSelectedProjectId(value);
            setFormData(prev => ({ ...prev, [name]: value, assigneeIds: [] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleToggleChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleAssigneeSelect = (employeeId: string) => {
        setFormData(prev => {
            const newIds = [...(prev.assigneeIds || [])];
            if (newIds.includes(employeeId)) {
                return { ...prev, assigneeIds: newIds.filter(id => id !== employeeId) };
            }
            return { ...prev, assigneeIds: [...newIds, employeeId] };
        });
    };
    
    const handleSelectAllAssignees = () => setFormData(prev => ({ ...prev, assigneeIds: availableAssignees.map(e => e.id)}));
    const handleDeselectAllAssignees = () => setFormData(prev => ({ ...prev, assigneeIds: []}));

    const handlePerspectiveChange = (perspective: string, checked: boolean) => {
        setFormData(prev => {
            const currentPerspectives = prev.perspectives || [];
            if (checked) {
                return { ...prev, perspectives: [...currentPerspectives, perspective] };
            }
            return { ...prev, perspectives: currentPerspectives.filter(p => p !== perspective) };
        });
    };

    const handleAddPerspective = () => {
        if (newPerspective.trim() && !localPerspectives.includes(newPerspective.trim())) {
            setLocalPerspectives([...localPerspectives, newPerspective.trim()]);
            setNewPerspective('');
        }
    };

    const handleDeletePerspective = (p: string) => {
        setLocalPerspectives(localPerspectives.filter(opt => opt !== p));
    };
    
    const handleAddCategory = () => {
        if(newCategory.trim() && !taskCategories.includes(newCategory.trim())){
            setTaskCategories([...taskCategories, newCategory.trim()]);
            setFormData(prev => ({...prev, category: newCategory.trim()}));
            setNewCategory('');
            setIsAddingCategory(false);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const selectedAssignees = employees.filter(emp => formData.assigneeIds?.includes(emp.id))
            .map(emp => ({ id: emp.id, name: emp.name, avatar: emp.avatar }));

        const finalTask: Task = {
            id: taskToEdit?.id || `task_${Date.now()}`,
            taskCode: taskToEdit?.taskCode || `${Math.floor(Math.random() * 1000)}-${tasks.length}`,
            ...initialFormState,
            ...formData,
            assignees: selectedAssignees,
        } as Task;
        onSave(finalTask);
    };
    
    const filteredEmployees = availableAssignees.filter(e => e.name.toLowerCase().includes(assigneeSearch.toLowerCase()));
    const selectedAssigneeObjects = employees.filter(e => formData.assigneeIds?.includes(e.id));

    const commonInputClass = "mt-1 block w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{taskToEdit ? t('edit_task') : (parentId ? t('add_sub_task') : t('add_task'))}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-6 flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {/* Project and related info */}
                        <div className="lg:col-span-3">
                             <label className={commonLabelClass}>{t('project')}*</label>
                             <select name="projectId" value={selectedProjectId} onChange={handleChange} className={commonInputClass} required disabled={!!parentId}>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.projectCode} - {p.name}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className={commonLabelClass}>{t('client')}</label>
                             <input type="text" value={client?.name || ''} className={commonInputClass + " bg-gray-200 dark:bg-gray-800 cursor-not-allowed"} disabled />
                        </div>
                         <div>
                             <label className={commonLabelClass}>{t('vendor')}</label>
                             <input type="text" value={vendor?.name || ''} className={commonInputClass + " bg-gray-200 dark:bg-gray-800 cursor-not-allowed"} disabled />
                        </div>
                        <div>
                             <label className={commonLabelClass}>{t('collection_name')}</label>
                             <input type="text" value={selectedProject?.collectionNames?.join(', ') || ''} className={commonInputClass + " bg-gray-200 dark:bg-gray-800 cursor-not-allowed"} disabled />
                        </div>

                         {/* Task Info */}
                        <div className="lg:col-span-3">
                             <label className={commonLabelClass}>{t('title')}*</label>
                             <input name="name" value={formData.name || ''} onChange={handleChange} className={commonInputClass} required />
                        </div>
                         <div className="lg:col-span-3">
                             <label className={commonLabelClass}>{t('assigned_to')}</label>
                            <div className="relative" ref={assigneeRef}>
                                <button type="button" onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)} className="min-h-[44px] w-full text-left bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-2 flex flex-wrap gap-1.5">
                                    {selectedAssigneeObjects.length > 0 ? selectedAssigneeObjects.map(e => (
                                        <span key={e.id} className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                                            <img src={e.avatar} alt={e.name} className="w-4 h-4 rounded-full" />
                                            {e.name}
                                            <button onClick={(event) => { event.stopPropagation(); handleAssigneeSelect(e.id);}} className="text-blue-600 dark:text-blue-300">&times;</button>
                                        </span>
                                    )) : <span className="text-sm text-gray-500 px-2">{t('select')}...</span>}
                                </button>
                                {isAssigneeDropdownOpen && (
                                     <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700">
                                         <div className="p-2 border-b dark:border-gray-700">
                                            <div className="relative">
                                                 <SearchIcon className="absolute top-1/2 left-3 rtl:left-auto rtl:right-3 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input type="text" placeholder={t('start_typing_to_search')} value={assigneeSearch} onChange={e => setAssigneeSearch(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2 pl-9 rtl:pr-9 text-sm" />
                                            </div>
                                         </div>
                                         <div className="p-2 flex justify-between border-b dark:border-gray-700">
                                            <button type="button" onClick={handleSelectAllAssignees} className="text-sm text-blue-600">{t('select_all')}</button>
                                            <button type="button" onClick={handleDeselectAllAssignees} className="text-sm text-blue-600">{t('deselect_all')}</button>
                                         </div>
                                         <ul className="max-h-48 overflow-y-auto p-2">
                                             {filteredEmployees.map(e => (
                                                <li key={e.id} onClick={() => handleAssigneeSelect(e.id)} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                                     <div className="flex items-center gap-2">
                                                        <img src={e.avatar} alt={e.name} className="w-6 h-6 rounded-full" />
                                                        <span className="text-sm">{e.name}</span>
                                                     </div>
                                                     {formData.assigneeIds?.includes(e.id) && <CheckIcon className="w-5 h-5 text-blue-600" />}
                                                </li>
                                             ))}
                                         </ul>
                                     </div>
                                )}
                            </div>
                        </div>

                         <div>
                            <label className={commonLabelClass}>{t('start_date')}*</label>
                            <input name="startDate" type="date" value={formData.startDate || ''} onChange={handleChange} className={commonInputClass} required />
                        </div>
                        <div>
                            <label className={commonLabelClass}>{t('due_date')}*</label>
                            <input name="dueDate" type="date" value={formData.dueDate || ''} onChange={handleChange} className={commonInputClass} required />
                        </div>
                         <div>
                            <label className={commonLabelClass}>{t('status')}*</label>
                            <select name="status" value={formData.status} onChange={handleChange} className={commonInputClass} required>
                                <option value="To Do">{t('to_do')}</option>
                                <option value="In Progress">{t('in_progress')}</option>
                                <option value="Done">{t('done')}</option>
                            </select>
                        </div>

                        {/* Other Details */}
                         <div className="lg:col-span-3">
                             <h4 className="font-semibold mt-2 text-gray-800 dark:text-white">{t('other_details')}</h4>
                         </div>
                         <div>
                            <label className={commonLabelClass}>{t('priority')}*</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className={commonInputClass} required>
                                <option value="High">{t('high')}</option>
                                <option value="Medium">{t('medium')}</option>
                                <option value="Low">{t('low')}</option>
                            </select>
                        </div>
                        <div>
                            <label className={commonLabelClass}>{t('estimated_time')}</label>
                            <input name="estimatedTime" value={formData.estimatedTime || ''} onChange={handleChange} placeholder="e.g. 8h 30m" className={commonInputClass}/>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-auto mb-1">
                            <label className={commonLabelClass}>{t('billable_task')}</label>
                            <ToggleSwitch checked={formData.isBillable || false} onChange={e => handleToggleChange('isBillable', e.target.checked)}/>
                        </div>
                         <div className="lg:col-span-3">
                            <label className={commonLabelClass}>{t('task_category')}</label>
                             {isAddingCategory ? (
                                <div className="flex gap-2">
                                    <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} className={commonInputClass + " flex-grow"} />
                                    <button type="button" onClick={handleAddCategory} className="mt-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg">{t('save')}</button>
                                    <button type="button" onClick={() => setIsAddingCategory(false)} className="mt-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-sm rounded-lg">{t('cancel')}</button>
                                </div>
                             ) : (
                                <div className="flex gap-2">
                                    <select name="category" value={formData.category} onChange={handleChange} className={commonInputClass + " flex-grow"}>
                                        {taskCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <button type="button" onClick={() => setIsAddingCategory(true)} className="mt-1 px-3 bg-gray-200 dark:bg-gray-600 text-sm rounded-lg">+</button>
                                </div>
                             )}
                        </div>
                         <div className="lg:col-span-3">
                             <label className={commonLabelClass}>{t('description')}</label>
                            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={4} className={commonInputClass}></textarea>
                        </div>
                        
                        {/* Perspectives */}
                         <div className="lg:col-span-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                             <h4 className="font-semibold text-gray-800 dark:text-white mb-2">{t('perspectives')}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-2">
                                {localPerspectives.map(p => (
                                    <div key={p} className="flex items-center justify-between text-sm p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded">
                                         <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={formData.perspectives?.includes(p)} onChange={e => handlePerspectiveChange(p, e.target.checked)} className="rounded text-blue-600"/>
                                            <span>{p}</span>
                                        </label>
                                        <button type="button" onClick={() => handleDeletePerspective(p)} className="text-gray-400 hover:text-red-500">&times;</button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-2">
                                <input value={newPerspective} onChange={e => setNewPerspective(e.target.value)} placeholder={t('add')+'...'} className={commonInputClass + " mt-0"} />
                                <button type="button" onClick={handleAddPerspective} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg">{t('add')}</button>
                            </div>
                         </div>
                    </div>
                </div>
                <div className="flex justify-end items-center p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};

export default AddTaskModal;