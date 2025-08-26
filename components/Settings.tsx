import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import {
    ShieldIcon, BellIcon, DollarSignIcon, GlobeIcon, CheckSquareIcon, PlaneIcon,
    BarChartIcon, BriefcaseIcon, ClockIcon, ListPlusIcon, CreditCardIcon,
    FileTextIcon, FilePlusIcon, LifeBuoyIcon, MessageSquareIcon, TagIcon, PlusIcon, AtSignIcon,
    XIcon, KeyIcon, LogOutIcon, MoreVerticalIcon, GridIcon, BookOpenIcon,
    UploadCloudIcon, Trash2Icon, GripVerticalIcon, UserPlusIcon, PaletteIcon, ListIcon, SettingsIcon
} from './icons/Icons';
import {
    NotificationSetting, Role, Permission, PermissionLevel, CustomField,
    CustomFieldModule, CustomFieldType, AppSettings, Currency, ThemeSettings,
    SecuritySettings, FinanceSettings, ProjectSettings, TaskSettings,
    AttendanceShift, LeaveType, ModuleStatus, NavItem, KPI
} from '../types';
import CustomPagesSettingsPage from './CustomPagesSettingsPage';

const settingsMenu = [
    {key: 'profile_settings', icon: UserPlusIcon},
    {key: 'app_settings', icon: SettingsIcon},
    {key: 'theme_settings', icon: PaletteIcon},
    {key: 'sidebar_settings', icon: ListIcon},
    {key: 'custom_pages', icon: FilePlusIcon},
    {key: 'module_settings', icon: GridIcon},
    {key: 'security_settings', icon: ShieldIcon},
    {key: 'notification_settings', icon: BellIcon},
    {key: 'finance_settings', icon: DollarSignIcon},
    {key: 'currency_settings', icon: GlobeIcon},
    {key: 'attendance_settings', icon: CheckSquareIcon}, 
    {key: 'leaves_settings', icon: PlaneIcon},
    {key: 'kpi_settings', icon: BarChartIcon},
    {key: 'project_settings', icon: BriefcaseIcon},
    {key: 'task_settings', icon: CheckSquareIcon},
    {key: 'custom_fields', icon: ListPlusIcon},
    {key: 'roles_&_permissions', icon: ShieldIcon},
    {key: 'payment_credentials', icon: CreditCardIcon},
    {key: 'contract_settings', icon: FileTextIcon},
    {key: 'tax_settings', icon: FileTextIcon},
    {key: 'ticket_settings', icon: LifeBuoyIcon},
    {key: 'message_settings', icon: MessageSquareIcon},
    {key: 'lead_settings', icon: TagIcon},
    {key: 'time_log_settings', icon: ClockIcon},
];

const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
);

const UnderConstruction = ({pageName}) => {
    const {t} = useTranslation();
    return <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md"><h2 className="text-2xl font-bold">{pageName}</h2><p className="mt-2 text-gray-500">{t('under_construction')}</p></div>
};


// START: All settings pages as components
const NotificationSettingsPage = () => {
    const { t } = useTranslation();
    const { notificationSettings, setNotificationSettings } = useApp();

    const handleToggle = (id: string, type: 'email' | 'inApp') => {
        setNotificationSettings(prevSettings =>
            prevSettings.map(setting =>
                setting.id === id ? { ...setting, [type]: !setting[type] } : setting
            )
        );
    };

    const handleSelectAll = (type: 'email' | 'inApp', value: boolean) => {
        setNotificationSettings(prevSettings =>
            prevSettings.map(setting => ({ ...setting, [type]: value }))
        );
    };

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('notification_settings')}</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('notification_type')}</th>
                                <th scope="col" className="py-3 px-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {t('email')}
                                        <input type="checkbox" onChange={(e) => handleSelectAll('email', e.target.checked)} className="rounded" />
                                    </div>
                                </th>
                                <th scope="col" className="py-3 px-6 text-center">
                                     <div className="flex items-center justify-center gap-2">
                                        {t('in_app')}
                                        <input type="checkbox" onChange={(e) => handleSelectAll('inApp', e.target.checked)} className="rounded" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {notificationSettings.map(setting => (
                                <tr key={setting.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="py-4 px-6 font-medium text-gray-800 dark:text-white">{t(setting.labelKey)}</td>
                                    <td className="py-4 px-6 text-center">
                                        <ToggleSwitch checked={setting.email} onChange={() => handleToggle(setting.id, 'email')} />
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <ToggleSwitch checked={setting.inApp} onChange={() => handleToggle(setting.id, 'inApp')} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><AtSignIcon className="w-5 h-5"/>{t('smtp_settings')}</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('smtp_host')}</label>
                        <input type="text" placeholder="e.g., smtp.gmail.com" className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('smtp_port')}</label>
                        <input type="text" placeholder="e.g., 587" className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('smtp_username')}</label>
                        <input type="text" placeholder={t('smtp_username')} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('smtp_password')}</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                 </div>
                 <div className="flex justify-end gap-4 mt-6">
                    <button className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/50">{t('test_connection')}</button>
                    <button className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">{t('save_changes')}</button>
                </div>
            </div>
        </div>
    );
};

const PermissionSelector: React.FC<{ value: PermissionLevel, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ value, onChange }) => {
    const { t } = useTranslation();
    const options: PermissionLevel[] = ['all', 'added', 'owned', 'both', 'none'];
    return (
        <select value={value} onChange={onChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
            {options.map(opt => (
                <option key={opt} value={opt}>{t(opt)}</option>
            ))}
        </select>
    );
};

const RolesPermissionsSettingsPage = () => {
    const { t } = useTranslation();
    const { roles, setRoles } = useApp();
    const [activeRoleId, setActiveRoleId] = useState<string>(roles[0]?.id);
    const [isAddingRole, setIsAddingRole] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    
    const activeRole = roles.find(r => r.id === activeRoleId);

    useEffect(() => {
        if (!activeRole && roles.length > 0) {
            setActiveRoleId(roles[0].id);
        }
    }, [roles, activeRole]);

    const handlePermissionChange = (moduleKey: string, permission: 'add' | 'view' | 'update' | 'delete', value: PermissionLevel) => {
        setRoles(prevRoles => 
            prevRoles.map(role => {
                if (role.id === activeRoleId) {
                    const newPermissions = role.permissions.map(p => {
                        if (p.moduleKey === moduleKey) {
                            return { ...p, [permission]: value };
                        }
                        return p;
                    });
                    return { ...role, permissions: newPermissions };
                }
                return role;
            })
        );
    };

    const handleSaveNewRole = () => {
        if (newRoleName.trim() === '') return;
        
        const employeeRoleTemplate = roles.find(r => r.nameKey === 'employee');
        const newPermissions = employeeRoleTemplate 
            ? JSON.parse(JSON.stringify(employeeRoleTemplate.permissions)) // Deep copy
            : [];
        
        const newRole: Role = {
            id: `role_${Date.now()}`,
            nameKey: newRoleName.trim(),
            permissions: newPermissions
        };
        setRoles([...roles, newRole]);
        setActiveRoleId(newRole.id);
        setNewRoleName("");
        setIsAddingRole(false);
    };
    
    if (!activeRole) return null;

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('roles_&_permissions')}</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="mb-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-wrap gap-4">
                    <nav className="-mb-px flex space-x-6 rtl:space-x-reverse" aria-label="Tabs">
                        {roles.map(role => (
                            <button
                                key={role.id}
                                onClick={() => setActiveRoleId(role.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeRole.id === role.id
                                    ? 'border-blue-500 text-blue-600 dark:text-white'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                {t(role.nameKey) || role.nameKey}
                            </button>
                        ))}
                    </nav>
                    
                    {isAddingRole ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                placeholder={t('role_name')}
                                className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button onClick={handleSaveNewRole} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">{t('save')}</button>
                            <button onClick={() => setIsAddingRole(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md text-sm font-medium">{t('cancel')}</button>
                        </div>
                    ) : (
                         <button onClick={() => setIsAddingRole(true)} className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 text-sm font-medium">
                            <PlusIcon className="w-4 h-4" />
                            {t('add_role')}
                        </button>
                    )}
                </div>

                <div>
                    <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{t('permissions')} for {t(activeRole.nameKey) || activeRole.nameKey}</h4>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6 w-1/4">{t('module')}</th>
                                    <th scope="col" className="py-3 px-6 text-center">{t('add')}</th>
                                    <th scope="col" className="py-3 px-6 text-center">{t('view')}</th>
                                    <th scope="col" className="py-3 px-6 text-center">{t('update')}</th>
                                    <th scope="col" className="py-3 px-6 text-center">{t('delete')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeRole.permissions.map(perm => (
                                    <tr key={perm.moduleKey} className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="py-3 px-6 font-medium text-gray-800 dark:text-white flex items-center gap-2">
                                            <span>{t(perm.moduleKey)}</span>
                                            {perm.more && <a href="#" className="text-blue-600 text-xs hover:underline">({t('more')})</a>}
                                        </td>
                                        {perm.isSpecial ? (
                                            <>
                                                <td className="py-2 px-6 text-center font-bold text-gray-400">--</td>
                                                <td className="py-2 px-6 text-center font-bold text-gray-400">--</td>
                                                <td className="py-2 px-6 text-center font-bold text-gray-400">--</td>
                                                <td className="py-2 px-6 text-center font-bold text-gray-400">--</td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-2 px-6"><PermissionSelector value={perm.add} onChange={(e) => handlePermissionChange(perm.moduleKey, 'add', e.target.value as PermissionLevel)} /></td>
                                                <td className="py-2 px-6"><PermissionSelector value={perm.view} onChange={(e) => handlePermissionChange(perm.moduleKey, 'view', e.target.value as PermissionLevel)} /></td>
                                                <td className="py-2 px-6"><PermissionSelector value={perm.update} onChange={(e) => handlePermissionChange(perm.moduleKey, 'update', e.target.value as PermissionLevel)} /></td>
                                                <td className="py-2 px-6"><PermissionSelector value={perm.delete} onChange={(e) => handlePermissionChange(perm.moduleKey, 'delete', e.target.value as PermissionLevel)} /></td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                 <div className="pt-6 text-right">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">{t('save_changes')}</button>
                </div>
            </div>
        </div>
    );
};

const CustomFieldModal = ({ isOpen, onClose, onSave, field }) => {
    const { t, language } = useTranslation();
    const { customTables } = useApp();
    
    const initialFormData = {
        label: '',
        type: 'text' as CustomFieldType,
        required: false,
        options: '', // string for the input
        relatedModule: '' as CustomFieldModule | '',
        module: '' as CustomFieldModule | '',
    };
    
    const [formData, setFormData] = useState(initialFormData);
    const [optionsSource, setOptionsSource] = useState<'manual' | 'relational'>('manual');

    useEffect(() => {
        if (isOpen) {
            if (field) { // Editing existing field
                setFormData({
                    label: field.label || '',
                    type: field.type || 'text',
                    required: field.required || false,
                    options: field.options?.join(', ') || '',
                    relatedModule: field.relatedModule || '',
                    module: field.module || '',
                });
                setOptionsSource(field.relatedModule ? 'relational' : 'manual');
            } else { // Adding new field
                setFormData(initialFormData);
                setOptionsSource('manual');
            }
        }
    }, [field, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = () => {
        const finalField: Partial<CustomField> = {
            ...field,
            id: field?.id || `cf_${Date.now()}`,
            module: formData.module as CustomFieldModule,
            label: formData.label,
            type: formData.type,
            required: formData.required,
        };

        if (formData.type === 'select' || formData.type === 'multiselect') {
            if (optionsSource === 'manual') {
                finalField.options = formData.options.split(',').map(s => s.trim()).filter(Boolean);
                finalField.relatedModule = undefined;
            } else {
                finalField.relatedModule = formData.relatedModule as CustomFieldModule;
                finalField.options = undefined;
            }
        } else {
            finalField.options = undefined;
            finalField.relatedModule = undefined;
        }

        onSave(finalField as CustomField);
        onClose();
    };

    const fieldTypes: CustomFieldType[] = ['text', 'textarea', 'number', 'date', 'select', 'multiselect', 'checkbox'];
    const builtInModules: CustomFieldModule[] = ['projects', 'tasks', 'clients', 'leads', 'products', 'contacts', 'deals', 'warehouse', 'vendors', 'employees', 'leaves', 'designation', 'department', 'contracts', 'proposal', 'estimates', 'invoices', 'payments', 'credit_note', 'expenses', 'bank_account', 'orders', 'tickets', 'events', 'knowledge_base'];
    const moduleOptions = [
        ...builtInModules,
        ...customTables.map(t => t.id)
    ].sort();
    
    const getModuleName = (moduleId: string) => {
        const customTable = customTables.find(t => t.id === moduleId);
        return customTable ? customTable.pluralName : t(moduleId);
    };

    const commonInputClass = "mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{field?.id ? t('edit_custom_field') : t('add_custom_field')}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('module')} *</label>
                        <select
                            name="module"
                            value={formData.module}
                            onChange={handleChange}
                            className={commonInputClass}
                            required
                            disabled={!!field?.id} // Disable when editing
                        >
                            <option value="" disabled>-- {t('select_module')} --</option>
                            {moduleOptions.map(m => <option key={m} value={m}>{getModuleName(m)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('field_label')}</label>
                        <input type="text" name="label" value={formData.label} onChange={handleChange} className={commonInputClass} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('field_type')}</label>
                        <select name="type" value={formData.type} onChange={handleChange} className={commonInputClass}>
                            {fieldTypes.map(type => <option key={type} value={type}>{t(type)}</option>)}
                        </select>
                    </div>

                    {(formData.type === 'select' || formData.type === 'multiselect') && (
                        <div className="p-3 border rounded-md border-gray-200 dark:border-gray-700 space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('choose_source')}</label>
                             <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="optionsSource" value="manual" checked={optionsSource === 'manual'} onChange={() => setOptionsSource('manual')} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                                    {t('manual_options')}
                                </label>
                                 <label className="flex items-center gap-2">
                                    <input type="radio" name="optionsSource" value="relational" checked={optionsSource === 'relational'} onChange={() => setOptionsSource('relational')} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                                    {t('relational_source')}
                                </label>
                            </div>

                            {optionsSource === 'manual' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('options_comma_separated')}</label>
                                    <input type="text" name="options" value={formData.options} onChange={handleChange} className={commonInputClass} />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('related_module')}</label>
                                    <select name="relatedModule" value={formData.relatedModule} onChange={handleChange} className={commonInputClass}>
                                        <option value="" disabled>-- {t('select')} --</option>
                                        {moduleOptions.filter(m => m !== formData.module).map(m => <option key={m} value={m}>{getModuleName(m)}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="required" name="required" checked={formData.required} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="required" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('required')}</label>
                    </div>
                </div>
                <div className="flex justify-end items-center p-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button onClick={handleSave} className="px-6 py-2 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </div>
        </div>
    );
};

const CustomFieldsSettingsPage = () => {
    const { t } = useTranslation();
    const { customFields, setCustomFields, customTables } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingField, setEditingField] = useState<Partial<CustomField> | null>(null);

    const handleAddField = () => {
        setEditingField(null);
        setIsModalOpen(true);
    };

    const handleEditField = (field: CustomField) => {
        setEditingField(field);
        setIsModalOpen(true);
    };
    
    const handleDeleteField = (id: string) => {
        if(window.confirm('Are you sure you want to delete this field?')) {
            setCustomFields(prevFields => prevFields.filter(f => f.id !== id));
        }
    };

    const handleSaveField = (field: CustomField) => {
        setCustomFields(prevFields => {
            const index = prevFields.findIndex(f => f.id === field.id);
            if (index > -1) {
                return prevFields.map(f => (f.id === field.id ? field : f));
            } else {
                return [...prevFields, field];
            }
        });
    };

    const getModuleName = (moduleId: string) => {
        const customTable = customTables.find(t => t.id === moduleId);
        return customTable ? customTable.pluralName : t(moduleId);
    };
    
    return (
        <div className="p-6">
             <CustomFieldModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveField}
                field={editingField}
            />
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('custom_fields')}</h3>
                <button onClick={handleAddField} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    <PlusIcon className="w-5 h-5"/>
                    {t('add_custom_field')}
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('field_label')}</th>
                                <th scope="col" className="py-3 px-6">{t('module')}</th>
                                <th scope="col" className="py-3 px-6">{t('field_type')}</th>
                                <th scope="col" className="py-3 px-6">{t('required')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customFields.length > 0 ? customFields.map(field => (
                                <tr key={field.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="py-4 px-6 font-medium text-gray-800 dark:text-white">{field.label}</td>
                                    <td className="py-4 px-6 font-medium text-gray-600 dark:text-gray-300">{getModuleName(field.module)}</td>
                                    <td className="py-4 px-6 capitalize">
                                        {field.relatedModule ? `${t(field.type)} (${t('relational_source')}: ${getModuleName(field.relatedModule)})` : t(field.type)}
                                    </td>
                                    <td className="py-4 px-6">{field.required ? t('yes') : t('no')}</td>
                                    <td className="py-4 px-6 text-center space-x-2 rtl:space-x-reverse">
                                        <button onClick={() => handleEditField(field)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{t('edit')}</button>
                                        <button onClick={() => handleDeleteField(field.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">{t('delete')}</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">No custom fields have been created yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AppSettingsPage = () => {
    const { t } = useTranslation();
    const { appSettings, setAppSettings } = useApp();
    const [localSettings, setLocalSettings] = useState(appSettings);

    useEffect(() => {
        setLocalSettings(appSettings);
    }, [appSettings]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setLocalSettings(prev => ({...prev, [name]: type === 'number' ? parseFloat(value) : value}));
    };
    
    const handleSave = () => {
        setAppSettings(localSettings);
        alert(t('settings_saved_successfully'));
    };

    const timezones = ["(UTC-12:00) International Date Line West", "(UTC-08:00) Pacific Time (US & Canada)", "(UTC-05:00) Eastern Time (US & Canada)", "(UTC+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London", "(UTC+03:00) Moscow, St. Petersburg, Volgograd", "(UTC+03:00) Istanbul", "(UTC+04:00) Abu Dhabi, Muscat", "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi", "(UTC+09:00) Osaka, Sapporo, Tokyo"];

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('app_settings')}</h3>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('company_name')}</label>
                            <input type="text" name="companyName" value={localSettings.companyName} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('copyright_text')}</label>
                            <input type="text" name="copyrightText" value={localSettings.copyrightText} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('timezone')}</label>
                            <select name="timezone" value={localSettings.timezone} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
                                {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('app_company_logo')}</label>
                            <div className="mt-1 flex items-center gap-4">
                                <img src={localSettings.companyLogo} alt="Logo" className="h-16 w-16 object-contain bg-gray-200 dark:bg-gray-700 p-1 rounded-md" />
                                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300">{t('upload_logo')}</button>
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('favicon')}</label>
                            <div className="mt-1 flex items-center gap-4">
                                <img src={localSettings.favicon} alt="Favicon" className="h-10 w-10 object-contain bg-gray-200 dark:bg-gray-700 p-1 rounded-md" />
                                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300">{t('upload_favicon')}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                     <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('company_location')}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('latitude')}</label>
                            <input type="number" step="any" name="companyLatitude" value={localSettings.companyLatitude} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('longitude')}</label>
                            <input type="number" step="any" name="companyLongitude" value={localSettings.companyLongitude} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('location_radius_meters')}</label>
                            <input type="number" name="companyLocationRadius" value={localSettings.companyLocationRadius} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2"/>
                        </div>
                     </div>
                </div>

                <div className="text-right border-t border-gray-200 dark:border-gray-700 pt-6">
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">{t('save_changes')}</button>
                </div>
            </div>
        </div>
    );
};

const ColorInput = ({ label, name, value, onChange }) => {
    const {t} = useTranslation();
    return (
        <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t(label)}</label>
            <div className="flex items-center gap-2 p-1 border border-gray-300 dark:border-gray-600 rounded-md">
                <input type="color" name={name} value={value} onChange={onChange} className="w-7 h-7 border-none cursor-pointer bg-transparent" />
                <input type="text" value={value} onChange={onChange} name={name} className="w-20 text-sm p-1 rounded-sm bg-gray-100 dark:bg-gray-700 focus:outline-none" />
            </div>
        </div>
    );
};

const ThemeSettingsPage = () => {
    const { t } = useTranslation();
    const { activeThemeSettings, setActiveThemeSettings, theme } = useApp();
    const [localSettings, setLocalSettings] = useState(activeThemeSettings);

    useEffect(() => {
        setLocalSettings(activeThemeSettings);
    }, [activeThemeSettings]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalSettings(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));
    };

    const handleSave = () => {
        setActiveThemeSettings(localSettings);
        alert(t('settings_saved_successfully'));
    };
    
    const isLightModePreview = theme === 'light';
    const previewStyles = {
        '--preview-bg-primary': isLightModePreview ? localSettings.bgColorPrimaryLight : localSettings.bgColorPrimaryDark,
        '--preview-bg-secondary': isLightModePreview ? localSettings.bgColorSecondaryLight : localSettings.bgColorSecondaryDark,
        '--preview-text-primary': isLightModePreview ? localSettings.textColorPrimaryLight : localSettings.textColorPrimaryDark,
        '--preview-text-secondary': isLightModePreview ? localSettings.textColorSecondaryLight : localSettings.textColorSecondaryDark,
        '--preview-border': isLightModePreview ? localSettings.borderColorLight : localSettings.borderColorDark,
        '--preview-primary': localSettings.primaryColor,
        '--preview-radius': localSettings.borderRadius,
        '--preview-shadow': {none: 'none', sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', md: '0 4px 6px -1px rgb(0 0 0 / 0.1)', lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)', xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}[localSettings.cardShadow] || 'none',
        '--preview-border-width': localSettings.cardBorder ? '1px' : '0px',
    } as React.CSSProperties;

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('theme_settings')}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
                    {/* General Colors & Appearance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                         <div>
                            <h4 className="font-bold text-lg mb-3">{t('primary_color')}</h4>
                             <ColorInput label='primary_color' name="primaryColor" value={localSettings.primaryColor} onChange={handleChange} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-3">{t('appearance')}</h4>
                             <div className="space-y-3">
                                 <div className="flex items-center justify-between">
                                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('border_radius')}</label>
                                     <select name="borderRadius" value={localSettings.borderRadius} onChange={handleChange} className="w-32 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-1 text-sm focus:ring-blue-500 focus:border-blue-500">
                                         <option value="0.25rem">{t('sharp')}</option>
                                         <option value="0.75rem">{t('rounded')}</option>
                                         <option value="1.5rem">{t('extra_rounded')}</option>
                                     </select>
                                </div>
                                <div className="flex items-center justify-between">
                                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('card_shadow')}</label>
                                     <select name="cardShadow" value={localSettings.cardShadow} onChange={handleChange} className="w-32 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-1 text-sm focus:ring-blue-500 focus:border-blue-500">
                                         {['none', 'sm', 'md', 'lg', 'xl'].map(s => <option key={s} value={s}>{t(s)}</option>)}
                                     </select>
                                </div>
                                 <div className="flex items-center justify-between">
                                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('card_border')}</label>
                                     <ToggleSwitch checked={localSettings.cardBorder} onChange={(e) => handleChange({target: {name: 'cardBorder', type:'checkbox', checked: e.target.checked}})} />
                                 </div>
                             </div>
                        </div>
                    </div>
                     <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Light Mode */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-lg">{t('light_mode')}</h4>
                                <ColorInput label='app_background' name="bgColorPrimaryLight" value={localSettings.bgColorPrimaryLight} onChange={handleChange} />
                                <ColorInput label='card_background' name="bgColorSecondaryLight" value={localSettings.bgColorSecondaryLight} onChange={handleChange} />
                                <ColorInput label='primary_text' name="textColorPrimaryLight" value={localSettings.textColorPrimaryLight} onChange={handleChange} />
                                <ColorInput label='secondary_text' name="textColorSecondaryLight" value={localSettings.textColorSecondaryLight} onChange={handleChange} />
                                <ColorInput label='border_color' name="borderColorLight" value={localSettings.borderColorLight} onChange={handleChange} />
                            </div>
                             {/* Dark Mode */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-lg">{t('dark_mode')}</h4>
                                <ColorInput label='app_background' name="bgColorPrimaryDark" value={localSettings.bgColorPrimaryDark} onChange={handleChange} />
                                <ColorInput label='card_background' name="bgColorSecondaryDark" value={localSettings.bgColorSecondaryDark} onChange={handleChange} />
                                <ColorInput label='primary_text' name="textColorPrimaryDark" value={localSettings.textColorPrimaryDark} onChange={handleChange} />
                                <ColorInput label='secondary_text' name="textColorSecondaryDark" value={localSettings.textColorSecondaryDark} onChange={handleChange} />
                                <ColorInput label='border_color' name="borderColorDark" value={localSettings.borderColorDark} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                     <div className="text-right border-t border-gray-200 dark:border-gray-700 pt-6">
                        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">{t('save_changes')}</button>
                    </div>
                </div>

                 {/* Live Preview */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('live_preview')}</h4>
                    <div className="p-4 rounded-lg" style={{ ...previewStyles, backgroundColor: 'var(--preview-bg-primary)' }}>
                        <div className="p-4 shadow-lg" style={{backgroundColor: 'var(--preview-bg-secondary)', borderRadius: 'var(--preview-radius)', boxShadow: 'var(--preview-shadow)', borderWidth: 'var(--preview-border-width)', borderColor: 'var(--preview-border)'}}>
                             <h5 className="font-bold" style={{color: 'var(--preview-primary)'}}>{t('sample_card')}</h5>
                             <p className="text-sm mt-1" style={{color: 'var(--preview-text-secondary)'}}>{t('sample_card_desc')}</p>
                        </div>
                        <button style={{backgroundColor: 'var(--preview-primary)', borderRadius: 'var(--preview-radius)'}} className="w-full text-white font-bold py-2 px-4 mt-4">
                            {t('sample_button')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CurrencyModal = ({ isOpen, onClose, onSave, currency }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        id: currency?.id || '',
        name: currency?.name || '',
        code: currency?.code || '',
        symbol: currency?.symbol || '',
        exchangeRate: currency?.exchangeRate || 1,
    });

    useEffect(() => {
        if (isOpen) {
            if (currency) {
                setFormData({
                    id: currency.id,
                    name: currency.name,
                    code: currency.code,
                    symbol: currency.symbol,
                    exchangeRate: currency.exchangeRate,
                });
            } else {
                setFormData({
                    id: '',
                    name: '',
                    code: '',
                    symbol: '',
                    exchangeRate: 1,
                });
            }
        }
    }, [currency, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const commonInputClass = "mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{currency ? t('edit_currency') : t('add_currency')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('currency_name')}*</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={commonInputClass} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('currency_code')}*</label>
                        <input type="text" name="code" value={formData.code} onChange={handleChange} className={commonInputClass} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('currency_symbol')}*</label>
                        <input type="text" name="symbol" value={formData.symbol} onChange={handleChange} className={commonInputClass} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('exchange_rate')}*</label>
                        <input type="number" step="any" name="exchangeRate" value={formData.exchangeRate} onChange={handleChange} className={commonInputClass} required />
                    </div>
                </div>
                <div className="flex justify-end items-center p-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};

const CurrencySettingsPage = () => {
    const { t } = useTranslation();
    const { currencies, setCurrencies } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

    const handleSave = (currency: Currency) => {
        if (editingCurrency) {
            setCurrencies(prev => prev.map(c => c.id === currency.id ? currency : c));
        } else {
            setCurrencies(prev => [...prev, {...currency, id: `curr_${Date.now()}`}]);
        }
        setIsModalOpen(false);
        setEditingCurrency(null);
    };

    const handleEdit = (currency: Currency) => {
        setEditingCurrency(currency);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(`Are you sure you want to delete this currency?`)) {
            setCurrencies(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <div className="p-6">
            <CurrencyModal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); setEditingCurrency(null);}} onSave={handleSave} currency={editingCurrency} />
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('currency_settings')}</h3>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    <PlusIcon className="w-5 h-5" />
                    {t('add_currency')}
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('currency_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('currency_code')}</th>
                                <th scope="col" className="py-3 px-6">{t('currency_symbol')}</th>
                                <th scope="col" className="py-3 px-6">{t('exchange_rate')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currencies.map(currency => (
                                <tr key={currency.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="py-4 px-6 font-medium text-gray-800 dark:text-white">{currency.name}</td>
                                    <td className="py-4 px-6">{currency.code}</td>
                                    <td className="py-4 px-6">{currency.symbol}</td>
                                    <td className="py-4 px-6">{currency.exchangeRate}</td>
                                    <td className="py-4 px-6 text-center space-x-2 rtl:space-x-reverse">
                                        <button onClick={() => handleEdit(currency)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{t('edit')}</button>
                                        <button onClick={() => handleDelete(currency.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">{t('delete')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SecuritySettingsPage = () => {
    const {t} = useTranslation();
    const { securitySettings, setSecuritySettings } = useApp();
    const [localSettings, setLocalSettings] = useState(securitySettings);

    const handleToggle2FA = (e) => {
        setLocalSettings(prev => ({...prev, twoFactorEnabled: e.target.checked }));
    };
    
    const handleSave = () => {
        setSecuritySettings(localSettings);
        alert(t('settings_saved_successfully'));
    };

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('security_settings')}</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-8">
                {/* Change Password */}
                <div>
                     <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{t('change_password')}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <input type="password" placeholder={t('current_password')} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" />
                        <input type="password" placeholder={t('new_password')} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" />
                        <input type="password" placeholder={t('confirm_new_password')} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" />
                     </div>
                </div>

                {/* 2FA */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                     <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{t('two_factor_auth')}</h4>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('two_factor_desc')}</p>
                     <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <ToggleSwitch checked={localSettings.twoFactorEnabled} onChange={handleToggle2FA} />
                        <span>{t('enable_2fa')}</span>
                     </div>
                </div>

                {/* Active Sessions */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                     <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{t('active_sessions')}</h4>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('active_sessions_desc')}</p>
                     <ul className="space-y-3">
                        {localSettings.activeSessions.map(session => (
                            <li key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <KeyIcon className="w-6 h-6 text-gray-500" />
                                    <div>
                                        <p className="font-semibold">{session.browser} on {session.os}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{session.location} - <span className={session.lastActivity === 'Active now' ? 'text-green-500' : ''}>{session.lastActivity}</span></p>
                                    </div>
                                </div>
                                {session.lastActivity !== 'Active now' &&
                                    <button className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700">
                                        <LogOutIcon className="w-4 h-4" />
                                        {t('log_out')}
                                    </button>
                                }
                            </li>
                        ))}
                     </ul>
                </div>
                 <div className="pt-6 text-right border-t border-gray-200 dark:border-gray-700">
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">{t('save_changes')}</button>
                </div>
            </div>
        </div>
    );
}

const FinanceSettingsPage = () => {
    const {t} = useTranslation();
    const { financeSettings, setFinanceSettings, currencies } = useApp();
    const [localSettings, setLocalSettings] = useState(financeSettings);

    useEffect(() => {
        setLocalSettings(financeSettings);
    }, [financeSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setLocalSettings(prev => ({...prev, [name]: type === 'number' ? Number(value) : value}));
    };
    
    const handleSave = () => {
        setFinanceSettings(localSettings);
        alert(t('settings_saved_successfully'));
    };

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('finance_settings')}</h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('default_currency')}</label>
                        <select name="defaultCurrency" value={localSettings.defaultCurrency} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2">
                           {currencies.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fiscal_year_start')}</label>
                        <input name="fiscalYearStart" type="date" value={localSettings.fiscalYearStart} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice_prefix')}</label>
                        <input name="invoicePrefix" type="text" value={localSettings.invoicePrefix} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('estimate_prefix')}</label>
                        <input name="estimatePrefix" type="text" value={localSettings.estimatePrefix} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('total_incentive_pool')}</label>
                        <input name="incentiveBonusPool" type="number" value={localSettings.incentiveBonusPool} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" />
                        <p className="text-xs text-gray-500 mt-1">{t('incentive_bonus_pool_description')}</p>
                    </div>
                </div>

                 <div className="pt-6 text-right border-t border-gray-200 dark:border-gray-700">
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">{t('save_changes')}</button>
                </div>
            </div>
        </div>
    );
};

const ProjectSettingsPage = () => {
    const {t} = useTranslation();
    const { projectSettings, setProjectSettings } = useApp();
    const [localSettings, setLocalSettings] = useState(projectSettings);

    const handleToggle = (name, checked) => {
        setLocalSettings(prev => ({...prev, [name]: checked}));
    };
    
    const handleSave = () => {
        setProjectSettings(localSettings);
        alert(t('settings_saved_successfully'));
    };

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('project_settings')}</h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <label className="font-medium text-gray-700 dark:text-gray-300">{t('send_task_reminder')}</label>
                    <ToggleSwitch checked={localSettings.sendTaskReminder} onChange={(e) => handleToggle('sendTaskReminder', e.target.checked)} />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <label className="font-medium text-gray-700 dark:text-gray-300">{t('allow_client_create_task')}</label>
                    <ToggleSwitch checked={localSettings.allowClientToCreateTasks} onChange={(e) => handleToggle('allowClientToCreateTasks', e.target.checked)} />
                </div>
                 <div className="pt-6 text-right border-t border-gray-200 dark:border-gray-700">
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">{t('save_changes')}</button>
                </div>
            </div>
        </div>
    )
};

const TaskSettingsPage = () => {
     const {t} = useTranslation();
    const { taskSettings, setTaskSettings } = useApp();
    const [localSettings, setLocalSettings] = useState(taskSettings);

    const handleToggle = (name, checked) => {
        setLocalSettings(prev => ({...prev, [name]: checked}));
    };
    
    const handleSave = () => {
        setTaskSettings(localSettings);
        alert(t('settings_saved_successfully'));
    };

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('task_settings')}</h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <label className="font-medium text-gray-700 dark:text-gray-300">{t('allow_unassigned_tasks')}</label>
                    <ToggleSwitch checked={localSettings.allowUnassignedTasks} onChange={(e) => handleToggle('allowUnassignedTasks', e.target.checked)} />
                </div>
                 <div className="pt-6 text-right border-t border-gray-200 dark:border-gray-700">
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">{t('save_changes')}</button>
                </div>
            </div>
        </div>
    )
}

const AttendanceSettingsPage = () => {
    const {t} = useTranslation();
    const { attendanceShifts, setAttendanceShifts } = useApp();

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('attendance_settings')}</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    <PlusIcon className="w-5 h-5"/>
                    {t('add_new_shift')}
                </button>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('shift_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('time')}</th>
                                <th scope="col" className="py-3 px-6">{t('others')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceShifts.map(shift => (
                                <tr key={shift.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="py-4 px-6 font-medium text-gray-800 dark:text-white">{shift.name} {shift.isDefault && <span className="text-xs font-normal bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">{t('default')}</span>}</td>
                                    <td className="py-4 px-6">{shift.startTime} to {shift.endTime}</td>
                                    <td className="py-4 px-6">{t('late_mark_after_minutes')}: {shift.lateMarkAfter}</td>
                                    <td className="py-4 px-6 text-center">
                                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <MoreVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const LeavesSettingsPage = () => {
    const {t} = useTranslation();
    const { leaveTypes, setLeaveTypes } = useApp();
    
    return (
         <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('leaves_settings')}</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    <PlusIcon className="w-5 h-5"/>
                    {t('add_leave_type')}
                </button>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('leave_type_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('days_per_year')}</th>
                                <th scope="col" className="py-3 px-6">{t('status')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveTypes.map(type => (
                                <tr key={type.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="py-4 px-6 font-medium text-gray-800 dark:text-white">{type.name}</td>
                                    <td className="py-4 px-6">{type.daysAllowed}</td>
                                    <td className="py-4 px-6">{type.isPaid ? t('paid_leave') : t('unpaid_leave')}</td>
                                    <td className="py-4 px-6 text-center">
                                         <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <MoreVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const ModuleSettingsPage = () => {
    const { t } = useTranslation();
    const { modules, setModules } = useApp();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [newModuleName, setNewModuleName] = useState("");

    const handleToggle = (id: string) => {
        setModules(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
    };

    const handleUninstall = (id: string) => {
        if (window.confirm("Are you sure you want to uninstall this custom module?")) {
            setModules(prev => prev.filter(m => m.id !== id));
        }
    };
    
    const handleInstall = () => {
        if (!newModuleName.trim()) return;
        const newModule: ModuleStatus = {
            id: newModuleName.toLowerCase().replace(/\s+/g, '_'),
            nameKey: newModuleName,
            enabled: true,
            icon: GridIcon, // Default icon for custom modules
            isCustom: true,
        };
        setModules(prev => [...prev, newModule]);
        setNewModuleName("");
        setIsUploadModalOpen(false);
    }
    
    const Guideline = ({ titleKey, descKey }) => (
        <div>
            <h5 className="font-bold text-gray-800 dark:text-white">{t(titleKey)}</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t(descKey)}</p>
        </div>
    );

    return (
        <div className="p-6">
             {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="flex justify-between items-center p-6 border-b"><h3 className="text-xl font-bold">{t('upload_install_module')}</h3><button onClick={() => setIsUploadModalOpen(false)}><XIcon className="w-6 h-6"/></button></div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">{t('module_name')}</label>
                                <input type="text" value={newModuleName} onChange={e => setNewModuleName(e.target.value)} placeholder={t('module_name')} className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">{t('choose_zip_file')}</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400"/>
                                        <p className="text-sm text-gray-600 dark:text-gray-400"> (This is a simulation) </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end p-6 border-t"><button onClick={handleInstall} className="px-6 py-2 bg-blue-600 text-white rounded-md">{t('install')}</button></div>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('module_settings')}</h3>
                <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    <UploadCloudIcon className="w-5 h-5"/>
                    {t('upload_install_module')}
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('enable_module_description')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map(module => (
                        <div key={module.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <module.icon className="w-6 h-6 text-gray-500"/>
                                <span className="font-medium text-gray-800 dark:text-white">{t(module.nameKey) || module.nameKey}</span>
                                {module.isCustom && <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">{t('custom')}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                               {module.isCustom && <button onClick={() => handleUninstall(module.id)} className="p-1 text-red-500 hover:text-red-700"><Trash2Icon className="w-4 h-4"/></button>}
                                <ToggleSwitch checked={module.enabled} onChange={() => handleToggle(module.id)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6">
                 <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <BookOpenIcon className="w-6 h-6 text-blue-600" />
                    {t('module_dev_guidelines')}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('guidelines_intro')}</p>
                <div className="space-y-4">
                    <Guideline titleKey="guideline_component_title" descKey="guideline_component_desc" />
                    <Guideline titleKey="guideline_state_title" descKey="guideline_state_desc" />
                    <Guideline titleKey="guideline_nav_title" descKey="guideline_nav_desc" />
                    <Guideline titleKey="guideline_style_title" descKey="guideline_style_desc" />
                    <Guideline titleKey="guideline_i18n_title" descKey="guideline_i18n_desc" />
                    <Guideline titleKey="guideline_types_title" descKey="guideline_types_desc" />
                </div>
            </div>
        </div>
    )
};

const LinkModal = ({ isOpen, onClose, onSave, item }) => {
    const {t} = useTranslation();
    const [formData, setFormData] = useState({ id: item?.id || '', labelKey: item?.labelKey || ''});
    
    useEffect(() => {
        setFormData({ id: item?.id || '', labelKey: item?.labelKey || ''});
    }, [item]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b"><h3 className="text-xl font-bold">{item ? t('edit_link') : t('add_custom_link')}</h3><button type="button" onClick={onClose}><XIcon className="w-6 h-6"/></button></div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('link_name')}</label>
                        <input type="text" value={formData.labelKey} onChange={e => setFormData(p => ({...p, labelKey: e.target.value}))} placeholder={t('link_name')} className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">{t('link_id')}</label>
                        <input type="text" value={formData.id} onChange={e => setFormData(p => ({...p, id: e.target.value.toLowerCase().replace(/\s+/g, '_')}))} placeholder={t('link_id')} className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2" required disabled={!!item?.id}/>
                    </div>
                </div>
                <div className="flex justify-end p-6 border-t"><button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md">{t('save')}</button></div>
            </form>
        </div>
    );
}

const SidebarSettingsPage = () => {
    const {t} = useTranslation();
    const {navItems, setNavItems} = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<NavItem> | null>(null);

    const dragItem = useRef<NavItem | null>(null);
    const dragOverItem = useRef<NavItem | null>(null);

    const deepCloneNavItems = (items: NavItem[]): NavItem[] => {
        return items.map(item => ({
            ...item,
            icon: item.icon, 
            subItems: item.subItems ? deepCloneNavItems(item.subItems) : undefined,
        }));
    };

    const handleDragSort = () => {
        if (!dragItem.current || !dragOverItem.current || dragItem.current.id === dragOverItem.current.id) {
            return;
        }

        const newNavItems = deepCloneNavItems(navItems);

        const findAndReorder = (items: NavItem[]) => {
            const dragItemIndex = items.findIndex(item => item.id === dragItem.current!.id);
            const dragOverItemIndex = items.findIndex(item => item.id === dragOverItem.current!.id);

            if (dragItemIndex !== -1 && dragOverItemIndex !== -1) {
                const _dragItem = items.splice(dragItemIndex, 1)[0];
                items.splice(dragOverItemIndex, 0, _dragItem);
                return true;
            }

            for (const item of items) {
                if (item.subItems && findAndReorder(item.subItems)) {
                    return true;
                }
            }
            return false;
        };

        findAndReorder(newNavItems);
        setNavItems(newNavItems);
        dragItem.current = null;
        dragOverItem.current = null;
    };
    
    const handleVisibilityToggle = (id: string) => {
        const newNavItems = deepCloneNavItems(navItems);
        const findAndToggle = (items: NavItem[]) => {
            for (const item of items) {
                if (item.id === id) {
                    item.visible = !item.visible;
                    return true;
                }
                if (item.subItems && findAndToggle(item.subItems)) return true;
            }
            return false;
        };
        findAndToggle(newNavItems);
        setNavItems(newNavItems);
    };
    
    const handleSaveLink = (formData: Partial<NavItem>) => {
        const newNavItems = deepCloneNavItems(navItems);
        if (editingItem?.id) { // Edit
            const findAndUpdate = (items: NavItem[]) => {
                 for (const item of items) {
                    if (item.id === editingItem.id) {
                        item.labelKey = formData.labelKey!;
                        return true;
                    }
                     if (item.subItems && findAndUpdate(item.subItems)) return true;
                }
                return false;
            };
            findAndUpdate(newNavItems);
        } else { // Add
             const newLink: NavItem = {
                id: formData.id!,
                labelKey: formData.labelKey!,
                icon: FileTextIcon,
                visible: true,
                isCustom: true
            };
            newNavItems.push(newLink);
        }
        setNavItems(newNavItems);
        setIsModalOpen(false);
        setEditingItem(null);
    };
    
    const handleDeleteLink = (id: string) => {
        if (window.confirm("Are you sure you want to delete this custom link?")) {
            setNavItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const DraggableItem = ({item, isSubItem = false}) => (
        <li 
            className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg flex items-center gap-3"
            draggable
            onDragStart={() => dragItem.current = item}
            onDragEnter={() => dragOverItem.current = item}
            onDragEnd={handleDragSort}
            onDragOver={(e) => e.preventDefault()}
        >
            <GripVerticalIcon className="w-5 h-5 text-gray-400 cursor-grab" />
            <item.icon className="w-5 h-5 text-gray-500" />
            <span className="flex-grow font-medium text-gray-800 dark:text-white">{t(item.labelKey) || item.labelKey}</span>
            <div className="flex items-center gap-3">
                 {item.isCustom && <button onClick={() => handleDeleteLink(item.id)} className="text-red-500 hover:text-red-700"><Trash2Icon className="w-4 h-4" /></button>}
                <ToggleSwitch checked={item.visible} onChange={() => handleVisibilityToggle(item.id)} />
            </div>
        </li>
    );

    return (
        <div className="p-6">
            {isModalOpen && <LinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLink} item={editingItem} />}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('sidebar_settings')}</h3>
                <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    <PlusIcon className="w-5 h-5"/>
                    {t('add_custom_link')}
                </button>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('sidebar_settings_desc')}</p>
                 <ul className="space-y-3">
                    {navItems.map(item => (
                        <React.Fragment key={item.id}>
                           <DraggableItem item={item} />
                            {item.subItems && item.subItems.length > 0 && (
                                <ul className="pl-10 space-y-3 pt-2">
                                    {item.subItems.map(subItem => <DraggableItem key={subItem.id} item={subItem} isSubItem />)}
                                </ul>
                            )}
                        </React.Fragment>
                    ))}
                 </ul>
             </div>
        </div>
    );
};

const KpiModal = ({ isOpen, onClose, onSave, kpi }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ nameKey: '', type: 'automatic' as 'automatic' | 'manual', weight: 10 });

    useEffect(() => {
        if (kpi) {
            setFormData({ nameKey: kpi.nameKey, type: kpi.type, weight: kpi.weight });
        } else {
            setFormData({ nameKey: '', type: 'automatic', weight: 10 });
        }
    }, [kpi, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...kpi, ...formData });
    };

    const commonInputClass = "mt-1 w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500";
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b"><h3 className="text-xl font-bold">{kpi ? t('edit') : t('add')} KPI</h3><button type="button" onClick={onClose}><XIcon className="w-6 h-6"/></button></div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('kpi_name')}</label>
                        <input type="text" value={formData.nameKey} onChange={e => setFormData(p => ({...p, nameKey: e.target.value}))} placeholder={t('kpi_name')} className={commonInputClass} required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('kpi_type')}</label>
                        <select value={formData.type} onChange={e => setFormData(p => ({...p, type: e.target.value as any}))} className={commonInputClass}>
                            <option value="automatic">{t('automatic')}</option>
                            <option value="manual">{t('manual')}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('weight_percentage')}</label>
                        <input type="number" min="0" max="100" value={formData.weight} onChange={e => setFormData(p => ({...p, weight: parseInt(e.target.value)}))} className={commonInputClass} required/>
                    </div>
                </div>
                <div className="flex justify-end p-6 border-t"><button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md">{t('save')}</button></div>
            </form>
        </div>
    );
}

const KpiSettingsPage = () => {
    const { t } = useTranslation();
    const { kpis, setKpis } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKpi, setEditingKpi] = useState<Partial<KPI> | null>(null);

    const handleSave = (kpiData) => {
        setKpis(prev => {
            if (editingKpi?.id) {
                return prev.map(k => k.id === kpiData.id ? kpiData : k);
            }
            return [...prev, { ...kpiData, id: `kpi_${Date.now()}` }];
        });
        setIsModalOpen(false);
        setEditingKpi(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this KPI?")) {
            setKpis(prev => prev.filter(k => k.id !== id));
        }
    };

    return (
        <div className="p-6">
            {isModalOpen && <KpiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} kpi={editingKpi} />}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('kpi_settings')}</h3>
                <button onClick={() => { setEditingKpi(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    <PlusIcon className="w-5 h-5"/>
                    {t('add_kpi')}
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('kpi_name')}</th>
                                <th scope="col" className="py-3 px-6">{t('kpi_type')}</th>
                                <th scope="col" className="py-3 px-6">{t('weight_percentage')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kpis.map(kpi => (
                                <tr key={kpi.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="py-4 px-6 font-medium text-gray-800 dark:text-white">{t(kpi.nameKey)}</td>
                                    <td className="py-4 px-6 capitalize">{t(kpi.type)}</td>
                                    <td className="py-4 px-6">{kpi.weight}%</td>
                                    <td className="py-4 px-6 text-center space-x-2 rtl:space-x-reverse">
                                        <button onClick={() => { setEditingKpi(kpi); setIsModalOpen(true); }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{t('edit')}</button>
                                        <button onClick={() => handleDelete(kpi.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">{t('delete')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// END: All settings pages as components

const Settings: React.FC = () => {
    const { t } = useTranslation();
    const [activeSetting, setActiveSetting] = useState('app_settings');

    const renderSettingPage = () => {
        switch (activeSetting) {
            case 'profile_settings': return <UnderConstruction pageName={t('profile_settings')} />;
            case 'app_settings': return <AppSettingsPage />;
            case 'theme_settings': return <ThemeSettingsPage />;
            case 'sidebar_settings': return <SidebarSettingsPage />;
            case 'custom_pages': return <CustomPagesSettingsPage />;
            case 'module_settings': return <ModuleSettingsPage />;
            case 'notification_settings': return <NotificationSettingsPage />;
            case 'currency_settings': return <CurrencySettingsPage />;
            case 'security_settings': return <SecuritySettingsPage />;
            case 'finance_settings': return <FinanceSettingsPage />;
            case 'project_settings': return <ProjectSettingsPage />;
            case 'task_settings': return <TaskSettingsPage />;
            case 'attendance_settings': return <AttendanceSettingsPage />;
            case 'leaves_settings': return <LeavesSettingsPage />;
            case 'kpi_settings': return <KpiSettingsPage />;
            case 'roles_&_permissions': return <RolesPermissionsSettingsPage />;
            case 'custom_fields': return <CustomFieldsSettingsPage />;
            case 'payment_credentials': return <UnderConstruction pageName={t('payment_credentials')} />;
            case 'contract_settings': return <UnderConstruction pageName={t('contract_settings')} />;
            case 'tax_settings': return <UnderConstruction pageName={t('tax_settings')} />;
            case 'ticket_settings': return <UnderConstruction pageName={t('ticket_settings')} />;
            case 'message_settings': return <UnderConstruction pageName={t('message_settings')} />;
            case 'lead_settings': return <UnderConstruction pageName={t('lead_settings')} />;
            case 'time_log_settings': return <UnderConstruction pageName={t('time_log_settings')} />;
            default:
                return <UnderConstruction pageName={"Settings"} />;
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 p-6 bg-gray-100 dark:bg-gray-900 h-full">
            <aside className="w-full md:w-1/4 xl:w-1/5">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                    <ul className="space-y-1">
                        {settingsMenu.map(item => (
                            <li key={item.key}>
                                <button
                                    onClick={() => setActiveSetting(item.key)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                                        activeSetting === item.key
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 shrink-0" />
                                    <span className="text-left rtl:text-right">{t(item.key)}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                {renderSettingPage()}
            </main>
        </div>
    );
};

export default Settings;