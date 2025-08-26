import React from 'react';
import { WarehouseItem, Language } from '../types';
import { translations } from '../lib/translations';
import { useApp } from '../hooks/useApp';
import { XIcon, PrinterIcon } from './icons/Icons';

interface PrintStickerProps {
    item: WarehouseItem & { projectName?: string, projectCode?: string, vendorName?: string };
    onDonePrinting: () => void;
}

// Reusable layout for both preview and print, ensuring WYSIWYG
const StickerLayout: React.FC<{ item: any, num: number, appSettings: any, t: (key: string) => string }> = ({ item, num, appSettings, t }) => (
    <div
        className="sticker-layout"
        style={{
            width: '110mm',
            height: '60mm',
            padding: '4mm',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            color: 'black',
            backgroundColor: 'white',
            fontFamily: "'Inter', sans-serif",
            fontSize: '9pt',
        }}
    >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #ccc', paddingBottom: '2mm', marginBottom: '2mm', flexShrink: 0 }}>
            <img src={appSettings.companyLogo} alt="Logo" style={{ height: '8mm' }} />
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>{item.projectCode}</div>
                <div style={{ fontSize: '8pt', color: '#555' }}>{item.projectName}</div>
            </div>
        </div>
        
        {/* Main Content */}
        <div style={{ flexGrow: 1, display: 'flex', gap: '4mm' }}>
            {/* Left Column - Details */}
            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '1.5mm' }}>
                 <div>
                    <div style={{ fontSize: '8pt', color: '#555', textTransform: 'uppercase' }}>{t('client')}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>{item.clientName}</div>
                </div>
                <div>
                    <div style={{ fontSize: '8pt', color: '#555', textTransform: 'uppercase' }}>{t('collection_name')}</div>
                    <div style={{ fontWeight: 'normal' }}>{item.collectionNames.join(', ')}</div>
                </div>
                 <div>
                    <div style={{ fontSize: '8pt', color: '#555', textTransform: 'uppercase' }}>{t('vendor')}</div>
                    <div style={{ fontWeight: 'normal' }}>{item.vendorName}</div>
                </div>
            </div>

            {/* Right Column - Carpet Number and Dates */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center', borderLeft: '1px solid #eee', paddingLeft: '4mm' }}>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '10pt', textTransform: 'uppercase', color: '#555' }}>{t('carpet_number')}</div>
                    <div style={{ fontSize: '48pt', fontWeight: 900, lineHeight: 1 }}>
                        {num}/{item.numberOfCarpets}
                    </div>
                </div>
                 <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', fontSize: '8pt', borderTop: '1px solid #eee', paddingTop: '2mm' }}>
                    <div>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{t('entry_date')}</div>
                        <div>{item.entryDate}</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{t('exit_date')}</div>
                        <div>{item.exitDate}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


const PrintSticker: React.FC<PrintStickerProps> = ({ item, onDonePrinting }) => {
    const { appSettings, language } = useApp();
    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    const handlePrint = () => {
        window.print();
    };

    const stickers = Array.from({ length: item.numberOfCarpets || 0 }).map((_, i) => i + 1);

    return (
        <>
            <div id="print-modal" className="fixed inset-0 bg-black bg-opacity-60 z-50 flex flex-col p-4" aria-modal="true" role="dialog">
                <style>
                    {`
                        .printable-area {
                            display: none;
                        }
                        @page {
                            size: 110mm 60mm;
                            margin: 0;
                        }
                        @media print {
                            body > *:not(.printable-area) {
                                display: none !important;
                            }
                            .printable-area {
                                display: block !important;
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                            }
                            .sticker-layout {
                                page-break-after: always;
                            }
                            .sticker-layout:last-child {
                                page-break-after: auto;
                            }
                        }
                    `}
                </style>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl mx-auto flex flex-col h-full">
                    <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('print')} Stickers for {item.clientName}</h3>
                        <div className="flex items-center gap-2">
                            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                <PrinterIcon className="w-5 h-5"/>
                                <span>{t('print')} ({stickers.length})</span>
                            </button>
                            <button onClick={onDonePrinting} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <XIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                    </header>
                    <main className="flex-grow p-6 bg-gray-200 dark:bg-gray-900 overflow-y-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stickers.map(num => (
                                <div key={num} className="bg-white shadow-lg mx-auto">
                                    <StickerLayout item={item} num={num} appSettings={appSettings} t={t} />
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>

            <div className="printable-area">
                 {stickers.map(num => (
                    <StickerLayout key={`print-${num}`} item={item} num={num} appSettings={appSettings} t={t} />
                ))}
            </div>
        </>
    );
};

export default PrintSticker;