import React, { useEffect, useRef } from 'react';
import Select from './form/Select.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import { PrintSettings } from '../types.ts';
import Checkbox from './form/Checkbox.tsx';
import TableSelector from './form/TableSelector.tsx';
import SettingsPresetManager from './SettingsPresetManager.tsx';

interface PrintSettingsPanelProps {
    isVisible: boolean;
    onClose: () => void;
}

const PrintSettingsPanel: React.FC<PrintSettingsPanelProps> = ({ isVisible, onClose }) => {
    const { settings, setSettings } = usePrintSettings();
    const panelRef = useRef<HTMLDivElement>(null);

    const handleChange = (field: keyof PrintSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };
    
    const handleTableSelect = (rows: number, cols: number) => {
        setSettings(prev => ({
            ...prev,
            rows,
            columns: cols
        }));
    };

    // Handle focus trapping and Escape key press
    useEffect(() => {
        if (!isVisible) return;
        const panel = panelRef.current;
        if (!panel) return;

        const focusableElements = Array.from(panel.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // FIX: Use instanceof check to ensure element is an HTMLElement before calling focus.
        if (firstElement instanceof HTMLElement) firstElement.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }

            if (event.key !== 'Tab') return;

            if (event.shiftKey) { // Shift+Tab
                if (document.activeElement === firstElement) {
                    // FIX: Use instanceof check to ensure element is an HTMLElement before calling focus.
                    if (lastElement instanceof HTMLElement) lastElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    // FIX: Use instanceof check to ensure element is an HTMLElement before calling focus.
                    if (firstElement instanceof HTMLElement) firstElement.focus();
                    event.preventDefault();
                }
            }
        };

        panel.addEventListener('keydown', handleKeyDown);
        return () => panel.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onClose]);


    const isTableMode = settings.layoutMode === 'table';

    return (
        <div 
            className={`print:hidden fixed inset-0 z-30 transition-opacity duration-300 ${isVisible ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                ref={panelRef}
                className={`bg-white dark:bg-stone-800 w-full max-w-sm h-full shadow-2xl p-6 overflow-y-auto absolute right-0 top-0 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the panel
                tabIndex={-1} // Make it focusable
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Gelişmiş Yazdırma Ayarları</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 -mr-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 text-2xl leading-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Kapat"
                    >
                        &times;
                    </button>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">Sayfa Düzeni</h3>
                        <div className="space-y-3">
                            <Select
                                label="Düzen Modu"
                                id="layout-mode"
                                value={settings.layoutMode}
                                onChange={e => handleChange('layoutMode', e.target.value as 'flow' | 'table')}
                                options={[
                                    { value: 'flow', label: 'Akış (Sütunlu)' },
                                    { value: 'table', label: 'Tablo (Satır ve Sütun)' }
                                ]}
                            />
                             <Select
                                label="Yönelim"
                                id="print-orientation"
                                value={settings.orientation}
                                onChange={e => handleChange('orientation', e.target.value as 'portrait' | 'landscape')}
                                options={[
                                    { value: 'portrait', label: 'Dikey' },
                                    { value: 'landscape', label: 'Yatay' }
                                ]}
                            />
                            
                            {isTableMode && (
                                <div>
                                    <label className="font-medium text-xs text-stone-700 dark:text-stone-300 mb-2 block">Tablo Boyutu</label>
                                    <TableSelector 
                                        rows={settings.rows} 
                                        cols={settings.columns}
                                        onSelect={handleTableSelect} 
                                    />
                                </div>
                            )}

                             <div className="space-y-1">
                                <label htmlFor="print-column-gap" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                                   <span>Sütun Aralığı</span>
                                   <span className="text-stone-500 dark:text-stone-400 font-normal">{`${settings.columnGap.toFixed(1)}rem`}</span>
                                </label>
                                <input
                                    type="range" id="print-column-gap" value={settings.columnGap} min={0} max={5} step={0.1}
                                    onChange={e => handleChange('columnGap', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
                                />
                            </div>
                           
                            <div className="space-y-1">
                                <label htmlFor="print-scale" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                                   <span>İçerik Ölçeği (Yazdırma)</span>
                                   <span className="text-stone-500 dark:text-stone-400 font-normal">{`${Math.round(settings.scale * 100)}%`}</span>
                                </label>
                                <input
                                    type="range" id="print-scale" value={settings.scale * 100} min={50} max={150} step={5}
                                    onChange={e => handleChange('scale', parseFloat(e.target.value) / 100)}
                                    className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
                                />
                            </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">Görünüm</h3>
                         <div className="space-y-3">
                              {/* This control has been moved to WorksheetToolbar */}
                         </div>
                    </div>
                     <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">İçerik</h3>
                        <div className="space-y-3">
                           <Checkbox
                                label="Başlık Ekle (Okul, İsim, Tarih)"
                                id="print-show-header"
                                checked={settings.showHeader}
                                onChange={e => handleChange('showHeader', e.target.checked)}
                            />
                             <Checkbox
                                label="Problem Numaralarını Göster"
                                id="print-show-problem-numbers"
                                checked={settings.showProblemNumbers}
                                onChange={e => handleChange('showProblemNumbers', e.target.checked)}
                            />
                        </div>
                    </div>
                </div>

                <SettingsPresetManager<PrintSettings>
                    moduleKey="printSettings"
                    currentSettings={settings}
                    onLoadSettings={setSettings}
                />
            </div>
        </div>
    );
};

export default PrintSettingsPanel;
