import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { ThemeSettings } from '../types';

// Helper component for color inputs
const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="mt-1 flex items-center gap-2">
                <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-8 h-8 p-0 border-none rounded-md cursor-pointer" />
                <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>
    );
};

// Live Preview Component
const LivePreview: React.FC<{ settings: ThemeSettings; isDarkMode: boolean }> = ({ settings, isDarkMode }) => {
    const { t } = useTranslation();
    const shadowMap = {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    };

    const previewStyles = {
        '--preview-color-primary': settings.primaryColor,
        '--preview-radius': settings.borderRadius,
        '--preview-card-shadow': shadowMap[settings.cardShadow] || 'none',
        '--preview-card-border': settings.cardBorder ? `1px solid ${isDarkMode ? settings.borderColorDark : settings.borderColorLight}` : 'none',
        backgroundColor: isDarkMode ? settings.bgColorPrimaryDark : settings.bgColorPrimaryLight,
        padding: '1.5rem',
        borderRadius: 'var(--preview-radius)',
        transition: 'all 0.3s ease',
    } as React.CSSProperties;
    
    const cardStyles: React.CSSProperties = {
        backgroundColor: isDarkMode ? settings.bgColorSecondaryDark : settings.bgColorSecondaryLight,
        color: isDarkMode ? settings.textColorPrimaryDark : settings.textColorPrimaryLight,
        borderRadius: 'var(--preview-radius)',
        padding: '1.5rem',
        boxShadow: 'var(--preview-card-shadow)',
        border: 'var(--preview-card-border)',
        transition: 'all 0.3s ease',
    };
    
    const buttonStyles: React.CSSProperties = {
         backgroundColor: 'var(--preview-color-primary)',
         color: '#ffffff',
         padding: '0.5rem 1rem',
         borderRadius: 'var(--preview-radius)',
         border: 'none',
         transition: 'all 0.3s ease',
    };

    const secondaryTextStyles: React.CSSProperties = {
        color: isDarkMode ? settings.textColorSecondaryDark : settings.textColorSecondaryLight,
        transition: 'all 0.3s ease',
    };

    return (
        <div style={previewStyles}>
            <div style={cardStyles}>
                <h4 className="font-bold text-lg mb-2">{t('sample_card')}</h4>
                <p className="text-sm mb-4" style={secondaryTextStyles}>{t('sample_card_desc')}</p>
                <button style={buttonStyles}>{t('sample_button')}</button>
            </div>
        </div>
    );
};

const ThemeSettingsPage = () => {
    const { t } = useTranslation();
    const { activeThemeSettings, setActiveThemeSettings, theme } = useApp();
    const [localSettings, setLocalSettings] = useState<ThemeSettings>(activeThemeSettings);
    const [showSuccess, setShowSuccess] = useState(false);
    
    useEffect(() => {
        setLocalSettings(activeThemeSettings);
    }, [activeThemeSettings]);

    const handleColorChange = (key: keyof ThemeSettings, value: string) => {
        setLocalSettings(prev => ({...prev, [key]: value}));
    };
    
    const handleStyleChange = (key: keyof ThemeSettings, value: string | boolean) => {
        setLocalSettings(prev => ({...prev, [key]: value}));
    };

    const handleSaveChanges = () => {
        setActiveThemeSettings(localSettings);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const isDarkMode = theme === 'dark';

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t('theme_settings')}</h3>
                <div className="flex items-center gap-4">
                    {showSuccess && <span className="text-green-600 text-sm font-medium animate-pulse">{t('settings_saved_successfully')}</span>}
                    <button onClick={handleSaveChanges} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                        {t('save_changes')}
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-y-auto">
                <div className="lg:col-span-2 space-y-8">
                    {/* Colors Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">{t('colors')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
                            <div className="md:col-span-2">
                                <ColorInput label={t('primary_color')} value={localSettings.primaryColor} onChange={val => handleColorChange('primaryColor', val)} />
                            </div>
                             {/* Light Mode */}
                            <fieldset className="p-3 border rounded-md space-y-4">
                                <legend className="font-medium px-1">{t('light_mode')}</legend>
                                <ColorInput label={t('app_background')} value={localSettings.bgColorPrimaryLight} onChange={val => handleColorChange('bgColorPrimaryLight', val)} />
                                <ColorInput label={t('card_background')} value={localSettings.bgColorSecondaryLight} onChange={val => handleColorChange('bgColorSecondaryLight', val)} />
                                <ColorInput label={t('primary_text')} value={localSettings.textColorPrimaryLight} onChange={val => handleColorChange('textColorPrimaryLight', val)} />
                                <ColorInput label={t('secondary_text')} value={localSettings.textColorSecondaryLight} onChange={val => handleColorChange('textColorSecondaryLight', val)} />
                                <ColorInput label={t('border_color')} value={localSettings.borderColorLight} onChange={val => handleColorChange('borderColorLight', val)} />
                            </fieldset>
                            {/* Dark Mode */}
                             <fieldset className="p-3 border rounded-md space-y-4">
                                <legend className="font-medium px-1">{t('dark_mode')}</legend>
                                <ColorInput label={t('app_background')} value={localSettings.bgColorPrimaryDark} onChange={val => handleColorChange('bgColorPrimaryDark', val)} />
                                <ColorInput label={t('card_background')} value={localSettings.bgColorSecondaryDark} onChange={val => handleColorChange('bgColorSecondaryDark', val)} />
                                <ColorInput label={t('primary_text')} value={localSettings.textColorPrimaryDark} onChange={val => handleColorChange('textColorPrimaryDark', val)} />
                                <ColorInput label={t('secondary_text')} value={localSettings.textColorSecondaryDark} onChange={val => handleColorChange('textColorSecondaryDark', val)} />
                                <ColorInput label={t('border_color')} value={localSettings.borderColorDark} onChange={val => handleColorChange('borderColorDark', val)} />
                            </fieldset>
                        </div>
                    </div>
                    {/* Appearance Section */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">{t('appearance')}</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
                            <div>
                                <label className="block text-sm font-medium">{t('border_radius')}</label>
                                <div className="mt-2 flex rounded-md shadow-sm">
                                    <button onClick={() => handleStyleChange('borderRadius', '0.25rem')} className={`flex-1 p-2 text-sm rounded-l-md ${localSettings.borderRadius === '0.25rem' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('sharp')}</button>
                                    <button onClick={() => handleStyleChange('borderRadius', '0.75rem')} className={`flex-1 p-2 text-sm border-x border-gray-300 dark:border-gray-600 ${localSettings.borderRadius === '0.75rem' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('rounded')}</button>
                                    <button onClick={() => handleStyleChange('borderRadius', '1.5rem')} className={`flex-1 p-2 text-sm rounded-r-md ${localSettings.borderRadius === '1.5rem' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{t('extra_rounded')}</button>
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium">{t('card_shadow')}</label>
                                <select value={localSettings.cardShadow} onChange={e => handleStyleChange('cardShadow', e.target.value)} className="mt-2 w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="none">{t('none')}</option>
                                    <option value="sm">{t('sm')}</option>
                                    <option value="md">{t('md')}</option>
                                    <option value="lg">{t('lg')}</option>
                                    <option value="xl">{t('xl')}</option>
                                </select>
                            </div>
                             <div className="flex items-center gap-3">
                                <input type="checkbox" id="cardBorder" checked={localSettings.cardBorder} onChange={e => handleStyleChange('cardBorder', e.target.checked)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"/>
                                <label htmlFor="cardBorder" className="text-sm font-medium">{t('show_border')}</label>
                            </div>
                         </div>
                    </div>
                </div>
                {/* Live Preview */}
                <div className="lg:col-span-1">
                    <h4 className="text-lg font-semibold mb-4">{t('live_preview')}</h4>
                    <LivePreview settings={localSettings} isDarkMode={isDarkMode} />
                </div>
            </div>
        </div>
    );
};

export default ThemeSettingsPage;
