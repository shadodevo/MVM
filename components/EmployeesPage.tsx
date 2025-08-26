import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Employee, Language, SalaryComponent } from '../types';
import { PlusIcon, SearchIcon, UserPlusIcon, XIcon as CloseIcon, UploadCloudIcon, MoreVerticalIcon, DownloadIcon, Trash2Icon } from './icons/Icons';
import EmployeeDetailView from './EmployeeDetailView';
import { exportToCsv } from '../lib/utils';

const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
);

const AddEmployeeModal = ({ isOpen, onClose, onSave, employeeToEdit }) => {
    const { t } = useTranslation();
    const { employees, departments, designations, roles } = useApp();
    const [formData, setFormData] = useState<Partial<Employee>>({});

    const initialFormState: Partial<Employee> = {
        salutation: 'Mr',
        gender: 'Male',
        language: Language.EN,
        loginAllowed: true,
        emailNotifications: true,
        country: 'United Arab Emirates',
        employmentType: 'Full-time',
        maritalStatus: 'Single',
    };

    useEffect(() => {
        if (isOpen) {
            if (employeeToEdit) {
                setFormData(employeeToEdit);
            } else {
                setFormData(initialFormState);
            }
        } else {
            setFormData({});
        }
    }, [isOpen, employeeToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({ ...prev, avatar: event.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const finalEmployeeData: Employee = {
            id: employeeToEdit?.id || `emp_${Date.now()}`,
            status: employeeToEdit?.status || 'Active',
            ...initialFormState,
            ...formData,
            name: formData.name || '',
            employeeId: formData.employeeId || `MVM-${String(employees.length + 1).padStart(3, '0')}`,
            email: formData.email || '',
            joiningDate: formData.joiningDate || '',
            role: formData.role || designations[0]?.title || '',
            department: formData.department || departments[0]?.name || '',
            avatar: formData.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
        };
        onSave(finalEmployeeData);
        onClose();
    };

    const commonInputClass = "mt-1 block w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    const salutations = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'];
    const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{employeeToEdit ? t('edit_employee') : t('add_employee')}</h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6 flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        <div className="md:col-span-2">
                            <label className={commonLabelClass}>{t('employee_id')}*</label>
                            <input name="employeeId" type="text" value={formData.employeeId || ''} onChange={handleChange} placeholder={t('employee_id_desc')} className={commonInputClass} required />
                        </div>
                        <div className="md:col-span-1">
                            <label className={commonLabelClass}>{t('salutation')}</label>
                            <select name="salutation" value={formData.salutation} onChange={handleChange} className={commonInputClass}>
                                {salutations.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('employee_name')}*</label>
                            <input name="name" type="text" value={formData.name || ''} onChange={handleChange} placeholder="e.g. John Doe" className={commonInputClass} required />
                        </div>

                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('employee_email')}*</label>
                            <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="e.g. johndoe@example.com" className={commonInputClass} required />
                        </div>
                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('password')}</label>
                            <input name="password" type="password" placeholder={employeeToEdit ? "Leave blank to keep unchanged" : "Must have at least 8 characters"} className={commonInputClass} minLength={employeeToEdit ? undefined : 8} />
                        </div>

                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('designation')}*</label>
                            <select name="role" value={formData.role} onChange={handleChange} className={commonInputClass} required>
                                {designations.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('department')}*</label>
                            <select name="department" value={formData.department} onChange={handleChange} className={commonInputClass} required>
                                {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                            </select>
                        </div>

                        <div className="md:col-span-6">
                            <label className={commonLabelClass}>{t('profile_picture')}</label>
                            <div className="mt-2 flex items-center gap-4">
                                <img src={formData.avatar || 'https://via.placeholder.com/100'} alt="Avatar Preview" className="w-24 h-24 rounded-lg object-cover" />
                                <label htmlFor="file-upload" className="cursor-pointer bg-white dark:bg-gray-700 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 w-full flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <UploadCloudIcon className="w-8 h-8 text-gray-500 mb-2"/>
                                    <span className="text-sm font-semibold text-blue-600">{t('choose_a_file')}</span>
                                </label>
                                <input id="file-upload" name="avatar" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('country')}</label>
                            <select name="country" value={formData.country} onChange={handleChange} className={commonInputClass}>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('gender')}</label>
                            <div className="mt-2 flex gap-4 p-2.5">
                                <label className="flex items-center gap-2"><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> {t('male')}</label>
                                <label className="flex items-center gap-2"><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> {t('female')}</label>
                                <label className="flex items-center gap-2"><input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} /> {t('other')}</label>
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('mobile')}*</label>
                            <input name="mobile" type="tel" value={formData.mobile || ''} onChange={handleChange} placeholder="+93 e.g. 1234567890" className={commonInputClass} required />
                        </div>
                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('joining_date')}*</label>
                            <input name="joiningDate" type="date" value={formData.joiningDate || ''} onChange={handleChange} className={commonInputClass} required />
                        </div>

                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('date_of_birth')}</label>
                            <input name="dateOfBirth" type="date" value={formData.dateOfBirth || ''} onChange={handleChange} className={commonInputClass} />
                        </div>
                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('reporting_to')}</label>
                            <select name="reportingTo" value={formData.reportingTo} onChange={handleChange} className={commonInputClass}>
                                <option value="">-- Select --</option>
                                {employees.filter(e => e.id !== employeeToEdit?.id).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>

                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('change_language')}</label>
                            <select name="language" value={formData.language} onChange={handleChange} className={commonInputClass}>
                                <option value={Language.EN}>{t('english')}</option>
                                <option value={Language.AR}>{t('arabic')}</option>
                                <option value={Language.TR}>{t('turkish')}</option>
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label className={commonLabelClass}>{t('user_role')}</label>
                            <select name="userRole" value={formData.userRole} onChange={handleChange} className={commonInputClass}>
                                {roles.map(r => <option key={r.id} value={r.nameKey}>{t(r.nameKey)}</option>)}
                            </select>
                        </div>

                        <div className="md:col-span-6">
                            <label className={commonLabelClass}>{t('address')}</label>
                            <textarea name="address" value={formData.address || ''} onChange={handleChange} rows={3} placeholder="e.g. 132, My Street, Kingston, New York 12401" className={commonInputClass}></textarea>
                        </div>
                        <div className="md:col-span-6">
                            <label className={commonLabelClass}>{t('about')}</label>
                            <textarea name="about" value={formData.about || ''} onChange={handleChange} rows={3} className={commonInputClass}></textarea>
                        </div>
                        
                        <div className="md:col-span-6 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                             <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{t('other_details')}</h4>
                             <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                                <div className="md:col-span-3 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <label className={commonLabelClass}>{t('login_allowed')}</label>
                                    <ToggleSwitch checked={formData.loginAllowed || false} onChange={e => handleToggleChange('loginAllowed', e.target.checked)} />
                                </div>
                                 <div className="md:col-span-3">
                                    {/* Placeholder for alignment */}
                                </div>
                                <div className="md:col-span-3 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <label className={commonLabelClass}>{t('receive_email_notifications')}</label>
                                    <ToggleSwitch checked={formData.emailNotifications || false} onChange={e => handleToggleChange('emailNotifications', e.target.checked)} />
                                </div>
                                <div className="md:col-span-3">
                                    <label className={commonLabelClass}>{t('skills')}</label>
                                    <input name="skills" type="text" value={formData.skills || ''} onChange={handleChange} placeholder={t('skills_desc')} className={commonInputClass} />
                                </div>
                                <div className="md:col-span-3">
                                    <label className={commonLabelClass}>{t('slack_member_id')}</label>
                                    <input name="slackMemberId" type="text" value={formData.slackMemberId || ''} onChange={handleChange} placeholder="e.g. U023BECGF" className={commonInputClass} />
                                </div>
                                <div className="md:col-span-3">
                                    <label className={commonLabelClass}>{t('probation_end_date')}</label>
                                    <input name="probationEndDate" type="date" value={formData.probationEndDate || ''} onChange={handleChange} className={commonInputClass} />
                                </div>
                                <div className="md:col-span-3">
                                    <label className={commonLabelClass}>{t('notice_period_start_date')}</label>
                                    <input name="noticePeriodStartDate" type="date" value={formData.noticePeriodStartDate || ''} onChange={handleChange} className={commonInputClass} />
                                </div>
                                <div className="md:col-span-3">
                                    <label className={commonLabelClass}>{t('notice_period_end_date')}</label>
                                    <input name="noticePeriodEndDate" type="date" value={formData.noticePeriodEndDate || ''} onChange={handleChange} className={commonInputClass} />
                                </div>
                                <div className="md:col-span-3">
                                    <label className={commonLabelClass}>{t('employment_type')}</label>
                                    <select name="employmentType" value={formData.employmentType} onChange={handleChange} className={commonInputClass}>
                                        <option value="Full-time">{t('full_time')}</option>
                                        <option value="Part-time">{t('part_time')}</option>
                                        <option value="Contract">{t('contract')}</option>
                                        <option value="Internship">{t('internship')}</option>
                                    </select>
                                </div>
                                <div className="md:col-span-3">
                                    <label className={commonLabelClass}>{t('marital_status')}</label>
                                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={commonInputClass}>
                                        <option value="Single">{t('single')}</option>
                                        <option value="Married">{t('married')}</option>
                                        <option value="Other">{t('other')}</option>
                                    </select>
                                </div>
                                 <div className="md:col-span-6">
                                    <label className={commonLabelClass}>{t('business_address')}</label>
                                    <input name="businessAddress" type="text" value={formData.businessAddress || ''} onChange={handleChange} placeholder="MVM Studio" className={commonInputClass} />
                                </div>
                             </div>
                        </div>

                    </div>
                </div>

                <div className="flex justify-end items-center p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button type="submit" className="px-6 py-2.5 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save')}</button>
                </div>
            </form>
        </div>
    );
};


const EmployeesPage: React.FC = () => {
    const { t } = useTranslation();
    const { employees, setEmployees } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [actionMenu, setActionMenu] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const importInputRef = useRef<HTMLInputElement>(null);

    const filteredEmployees = useMemo(() => {
        return employees.filter(employee =>
            employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [employees, searchQuery]);

    const handleSaveEmployee = (employeeData: Employee) => {
        setEmployees(prev => {
            const exists = prev.find(e => e.id === employeeData.id);
            if (exists) {
                return prev.map(e => e.id === employeeData.id ? {...e, ...employeeData} : e);
            }
            return [...prev, employeeData];
        });
        setIsModalOpen(false);
        setEmployeeToEdit(null);
    };
    
    const handleOpenModal = (employee: Employee | null = null) => {
        setEmployeeToEdit(employee);
        setIsModalOpen(true);
        setActionMenu(null);
    };

    const handleDeleteEmployee = (id: string) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            setEmployees(prev => prev.filter(e => e.id !== id));
        }
        setActionMenu(null);
    }
    
    const handleEditFromDetail = (employee: Employee) => {
        setSelectedEmployee(null); 
        handleOpenModal(employee);
    }
    
    const handleImportClick = () => {
        importInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            alert(`File "${file.name}" selected for import. (This is a simulation)`);
        }
    };

    const handleExport = () => {
        const dataToExport = filteredEmployees.map(({ avatar, customFieldData, ...rest }) => ({
            ...rest,
            customFieldData: JSON.stringify(customFieldData || {})
        }));
        exportToCsv('employees.csv', dataToExport);
    };

    const statusColors = {
        'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'On Leave': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    };
    
    if (selectedEmployee) {
        return <EmployeeDetailView employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} onEdit={handleEditFromDetail} />;
    }

    return (
        <div className="p-6 space-y-6">
            <AddEmployeeModal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); setEmployeeToEdit(null);}} onSave={handleSaveEmployee} employeeToEdit={employeeToEdit} />
            <input
                type="file"
                ref={importInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileImport}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('employees')}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                     <div className="relative">
                        <SearchIcon className="absolute top-1/2 left-3 rtl:left-auto rtl:right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 ps-10 pe-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        <UploadCloudIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline text-sm font-medium">{t('import')}</span>
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        <DownloadIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline text-sm font-medium">{t('export')}</span>
                    </button>
                    <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <UserPlusIcon className="w-5 h-5"/>
                        <span className="text-sm font-medium">{t('add_employee')}</span>
                    </button>
                </div>
            </div>

             <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">{t('employees')}</th>
                                <th scope="col" className="py-3 px-6">{t('employee_id')}</th>
                                <th scope="col" className="py-3 px-6">{t('email')}</th>
                                <th scope="col" className="py-3 px-6">{t('role')}</th>
                                <th scope="col" className="py-3 px-6">{t('joining_date')}</th>
                                <th scope="col" className="py-3 px-6">{t('status')}</th>
                                <th scope="col" className="py-3 px-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(employee => (
                                <tr key={employee.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full" />
                                            <span onClick={() => setSelectedEmployee(employee)} className="font-medium text-gray-800 dark:text-white hover:underline cursor-pointer">{employee.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">{employee.employeeId}</td>
                                    <td className="py-4 px-6">{employee.email}</td>
                                    <td className="py-4 px-6">{employee.role}</td>
                                    <td className="py-4 px-6">{employee.joiningDate}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[employee.status]}`}>{employee.status}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center relative">
                                         <button onClick={() => setActionMenu(actionMenu === employee.id ? null : employee.id)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <MoreVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>
                                        {actionMenu === employee.id && (
                                            <div className="absolute right-10 top-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 py-1">
                                                <a href="#" onClick={(e) => { e.preventDefault(); setSelectedEmployee(employee); setActionMenu(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <span>{t('view')}</span>
                                                </a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleOpenModal(employee); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <span>{t('edit')}</span>
                                                </a>
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteEmployee(employee.id); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <span>{t('delete')}</span>
                                                </a>
                                            </div>
                                        )}
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

export default EmployeesPage;
