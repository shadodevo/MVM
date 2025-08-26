import React, { useState, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Employee } from '../types';
import { UploadCloudIcon } from './icons/Icons';

const ProfileSettingsPage = () => {
    const { t } = useTranslation();
    const { currentUser, setCurrentUser } = useApp();
    const [formData, setFormData] = useState<Partial<Employee>>(currentUser || {});
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
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
    
    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentUser(prev => ({ ...prev!, ...formData }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handlePasswordSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert("New passwords do not match.");
            return;
        }
        if (passwordData.new.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }
        // In a real app, you would verify the current password and send a request to the server.
        alert("Password changed successfully! (simulation)");
        setPasswordData({ current: '', new: '', confirm: '' });
    };

    const commonInputClass = "mt-1 block w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="p-6 h-full flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex-shrink-0">{t('profile_settings')}</h3>
            <div className="flex-grow overflow-y-auto pr-2">
                <form onSubmit={handleProfileSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Avatar & About */}
                    <div className="lg:col-span-1 space-y-6">
                         <div>
                            <label className={commonLabelClass}>{t('profile_picture')}</label>
                            <div className="mt-2 group relative">
                                <img src={formData.avatar || 'https://via.placeholder.com/150'} alt="Avatar Preview" className="w-40 h-40 rounded-full object-cover mx-auto ring-4 ring-gray-200 dark:ring-gray-700" />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 w-40 h-40 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity mx-auto">
                                    <UploadCloudIcon className="w-8 h-8"/>
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*"/>
                            </div>
                        </div>
                         <div>
                             <label className={commonLabelClass}>{t('about')}</label>
                             <textarea name="about" value={formData.about || ''} onChange={handleInputChange} rows={5} className={commonInputClass}></textarea>
                        </div>
                    </div>

                    {/* Right Column - Details Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className={commonLabelClass}>{t('full_name')} *</label>
                                <input name="name" type="text" value={formData.name || ''} onChange={handleInputChange} className={commonInputClass} required/>
                            </div>
                            <div>
                                <label className={commonLabelClass}>{t('email')} *</label>
                                <input name="email" type="email" value={formData.email || ''} onChange={handleInputChange} className={commonInputClass} required/>
                            </div>
                             <div>
                                <label className={commonLabelClass}>{t('mobile')}</label>
                                <input name="mobile" type="tel" value={formData.mobile || ''} onChange={handleInputChange} className={commonInputClass} />
                            </div>
                             <div>
                                <label className={commonLabelClass}>{t('country')}</label>
                                <input name="country" type="text" value={formData.country || ''} onChange={handleInputChange} className={commonInputClass} />
                            </div>
                             <div className="md:col-span-2">
                                <label className={commonLabelClass}>{t('address')}</label>
                                <textarea name="address" value={formData.address || ''} onChange={handleInputChange} rows={3} className={commonInputClass}></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                             {showSuccess && <span className="text-green-600 text-sm font-medium animate-pulse">{t('settings_saved_successfully')}</span>}
                            <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('save_changes')}</button>
                        </div>
                    </div>
                </form>

                 {/* Password Section */}
                 <form onSubmit={handlePasswordSave} className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{t('change_password')}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                             <label className={commonLabelClass}>{t('current_password')}*</label>
                             <input name="current" type="password" value={passwordData.current} onChange={handlePasswordChange} className={commonInputClass} required/>
                        </div>
                        <div>
                             <label className={commonLabelClass}>{t('new_password')}*</label>
                             <input name="new" type="password" value={passwordData.new} onChange={handlePasswordChange} className={commonInputClass} required/>
                        </div>
                        <div>
                             <label className={commonLabelClass}>{t('confirm_new_password')}*</label>
                             <input name="confirm" type="password" value={passwordData.confirm} onChange={handlePasswordChange} className={commonInputClass} required/>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 mt-2">
                         <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{t('change_password')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettingsPage;