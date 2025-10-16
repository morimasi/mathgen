import React, { useEffect, useRef } from 'react';
import Select from './form/Select';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { PrintSettings } from '../types';
import Checkbox from './form/Checkbox';
import TableSelector from './form/TableSelector';
import SettingsPresetManager from './SettingsPresetManager';

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

    // Handle closing on Escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Handle focus trapping
    useEffect(() => {
        if (isVisible) {
            panelRef.current?.focus();
        }
    }, [isVisible]);

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
                    <h2 className="text-lg font-semibold">Yazdırma Ayarları</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 -mr-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 text-2xl leading-none"
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
                            
                            {isTableMode ? (
                                <div>
                                    <label className="font-medium text-sm text-stone-700 dark:text-stone-300 mb-2 block">Tablo Boyutu</label>
                                    <TableSelector 
                                        rows={settings.rows} 
                                        cols={settings.columns}
                                        onSelect={handleTableSelect} 
                                        isVisible={isVisible}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <label htmlFor="print-columns" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                                       <span>Sütun Sayısı</span>
                                       <span className="text-stone-500 dark:text-stone-400 font-normal">{settings.columns}</span>
                                    </label>
                                    <input
                                        type="range" id="print-columns" value={settings.columns} min={1} max={7} step={1}
                                        onChange={e => handleChange('columns', parseInt(e.target.value, 10))}
                                        className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
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
                                <label htmlFor="print-problem-spacing" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                                   <span>Problem Aralığı (Dikey)</span>
                                   <span className="text-stone-500 dark:text-stone-400 font-normal">{`${settings.problemSpacing.toFixed(1)}rem`}</span>
                                </label>
                                <input
                                    type="range" id="print-problem-spacing" value={settings.problemSpacing} min={0} max={5} step={0.1}
                                    onChange={e => handleChange('problemSpacing', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="print-page-margin" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                                   <span>Kenar Boşluğu</span>
                                   <span className="text-stone-500 dark:text-stone-400 font-normal">{`${settings.pageMargin.toFixed(1)}rem`}</span>
                                </label>
                                <input
                                    type="range" id="print-page-margin" value={settings.pageMargin} min={0.5} max={4} step={0.1}
                                    onChange={e => handleChange('pageMargin', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="print-scale" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                                   <span>İçerik Ölçeği</span>
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
                            <div className="space-y-1">
                                <label htmlFor="print-font-size" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                                   <span>Yazı Tipi Boyutu</span>
                                   <span className="text-stone-500 dark:text-stone-400 font-normal">{`${settings.fontSize}px`}</span>
                                </label>
                                <input
                                    type="range" id="print-font-size" value={settings.fontSize} min={10} max={50} step={1}
                                    onChange={e => handleChange('fontSize', parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Problem Hizalama"
                                    id="print-text-align"
                                    value={settings.textAlign || 'left'}
                                    onChange={e => handleChange('textAlign', e.target.value as 'left' | 'center' | 'right')}
                                    options={[
                                        { value: 'left', label: 'Sola Hizalı' },
                                        { value: 'center', label: 'Ortalanmış' },
                                        { value: 'right', label: 'Sağa Hizalı' }
                                    ]}
                                />
                                <Select
                                    label="Renk Teması" id="print-color-theme" value={settings.colorTheme}
                                    onChange={e => handleChange('colorTheme', e.target.value as 'black' | 'blue' | 'sepia')}
                                    options={[{ value: 'sepia', label: 'Kahverengi (Sepya)' }, { value: 'black', label: 'Siyah' }, { value: 'blue', label: 'Mavi' }]}
                                />
                                <Select
                                    label="Defter Stili" id="notebook-style" value={settings.notebookStyle}
                                    onChange={e => handleChange('notebookStyle', e.target.value as 'none' | 'lines' | 'grid' | 'dotted')}
                                    options={[{ value: 'none', label: 'Yok' }, { value: 'lines', label: 'Çizgili (İnce)' }, { value: 'grid', label: 'Kareli (İnce)' }, { value: 'dotted', label: 'Noktalı' }]}
                                />
                                <Select
                                    label="Kenarlık Stili" id="border-style" value={settings.borderStyle} onChange={e => handleChange('borderStyle', e.target.value)}
                                    options={[
                                        { value: 'none', label: 'Yok' },
                                        { value: 'card', label: 'Kart Görünümü' },
                                        { value: 'solid', label: 'Düz Çizgi (İnce)' },
                                        { value: 'dashed', label: 'Kesik Çizgili (İnce)' },
                                        { value: 'dotted', label: 'Noktalı (İnce)' },
                                        { value: 'double', label: 'Çift Çizgi (İnce)' },
                                        { value: 'shadow-lift', label: 'Gölge Efekti' },
                                        { value: 'corner-accent', label: 'Köşe Vurgusu' },
                                        { value: 'top-bar-color', label: 'Renkli Üst Çizgi' },
                                        { value: 'stitched-edge', label: 'Dikişli Kenar' },
                                        { value: 'double-frame', label: 'Çift Çerçeve' },
                                    ]}
                                />
                            </div>
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