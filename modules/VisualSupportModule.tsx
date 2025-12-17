import React, { useEffect } from 'react';
import { generateVisualProblem } from '../services/mathService.ts';
import { VisualSupportSettings, ArithmeticOperation } from '../types.ts';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import Checkbox from '../components/form/Checkbox.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import Button from '../components/form/Button.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';
import { useWorksheet } from '../services/WorksheetContext.tsx';

const VisualSupportModule: React.FC = () => {
    const { visualSupportSettings: settings, setVisualSupportSettings: setSettings } = useWorksheet();
    const { settings: printSettings, setSettings: setPrintSettings } = usePrintSettings();
    const isTableLayout = printSettings.layoutMode === 'table';

    const { generate } = useProblemGenerator({
        moduleKey: 'visual-support',
        settings,
        generatorFn: generateVisualProblem,
        isLive: true,
    });

    useEffect(() => {
        // Automatically generate on initial mount for this specific module
        generate(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSettingChange = (field: keyof VisualSupportSettings, value: any) => {
        setSettings({ ...settings, [field]: value });
    };

    const handleOrientationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrintSettings(prev => ({
            ...prev,
            orientation: e.target.checked ? 'landscape' : 'portrait'
        }));
    };

    return (
        <div className="space-y-2">
            <h2 className="text-sm font-semibold flex items-center gap-2">
                Görsel Destek Ayarları
                <span className="live-indicator" title="Bu modüldeki değişiklikler anında yansıtılır">Canlı</span>
            </h2>
             <p className="text-xs text-stone-600 dark:text-stone-400">
                Bu modül, nesneler ve kutular kullanarak temel matematik işlemleri için görsel alıştırmalar oluşturur. Ayarlar anında çalışma kağıdına yansır.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pt-1">
                <div className="flex flex-col gap-y-2">
                    <Select
                        label="İşlem Türü"
                        id="visual-operation"
                        value={settings.operation}
                        onChange={e => handleSettingChange('operation', e.target.value)}
                        options={[
                            { value: ArithmeticOperation.Addition, label: 'Toplama' },
                            { value: ArithmeticOperation.Subtraction, label: 'Çıkarma' },
                            { value: ArithmeticOperation.Multiplication, label: 'Çarpma' },
                            { value: ArithmeticOperation.Division, label: 'Bölme' },
                            { value: ArithmeticOperation.MixedAdditionSubtraction, label: 'Karışık (Toplama-Çıkarma)' },
                        ]}
                    />

                    <Select
                        label="Görsel Tema"
                        id="visual-theme"
                        value={settings.theme}
                        onChange={e => handleSettingChange('theme', e.target.value)}
                        options={[
                            { value: 'mixed', label: 'Karışık' },
                            { value: 'animals', label: 'Hayvanlar' },
                            { value: 'vehicles', label: 'Taşıtlar' },
                            { value: 'fruits', label: 'Meyveler/Yiyecekler' },
                            { value: 'shapes', label: 'Şekiller' },
                        ]}
                    />
                    
                    <NumberInput 
                        label="En Büyük Sayı"
                        id="max-number"
                        min={5} max={50}
                        value={settings.maxNumber}
                        onChange={e => handleSettingChange('maxNumber', parseInt(e.target.value))}
                        title="İşlemlerde kullanılacak en büyük sayı (sonuçlar bunu aşabilir)."
                    />
                    
                    <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                        <Checkbox
                            label="Sayfayı Yatay Yap"
                            id="visual-orientation"
                            checked={printSettings.orientation === 'landscape'}
                            onChange={handleOrientationChange}
                        />
                    </div>

                    <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg" open>
                        <summary className="text-xs font-semibold cursor-pointer select-none">Sayfa Düzeni</summary>
                        <div className="mt-2 space-y-2">
                            <Checkbox 
                                label="Otomatik Sığdır" 
                                id="auto-fit-visual" 
                                checked={settings.autoFit} 
                                onChange={e => handleSettingChange('autoFit', e.target.checked)} 
                                disabled={isTableLayout}
                            />
                            <div className={`grid grid-cols-2 gap-2 transition-opacity ${settings.autoFit || isTableLayout ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                                <NumberInput 
                                    label="Problem Sayısı"
                                    id="problems-per-page-visual"
                                    min={1} max={50}
                                    value={settings.problemsPerPage}
                                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value, 10) || 1)}
                                    disabled={settings.autoFit || isTableLayout}
                                />
                                <NumberInput 
                                    label="Sayfa Sayısı"
                                    id="page-count-visual"
                                    min={1} max={20}
                                    value={settings.pageCount}
                                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value, 10) || 1)}
                                    disabled={isTableLayout}
                                />
                            </div>
                        </div>
                    </details>
                </div>

                <div className="flex flex-col justify-around gap-y-1">
                     <div className="space-y-1">
                        <label htmlFor="emoji-size" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                            <span>Görsel Boyutu (Emoji)</span>
                            <span className="text-stone-500 dark:text-stone-400 font-normal">{settings.emojiSize}px</span>
                        </label>
                        <input
                            type="range" id="emoji-size" value={settings.emojiSize} min={12} max={70} step={1}
                            onChange={e => handleSettingChange('emojiSize', parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="number-size" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                            <span>Sayı/Operatör Boyutu</span>
                            <span className="text-stone-500 dark:text-stone-400 font-normal">{settings.numberSize}px</span>
                        </label>
                        <input
                            type="range" id="number-size" value={settings.numberSize} min={5} max={48} step={1}
                            onChange={e => handleSettingChange('numberSize', parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="box-size" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                            <span>Kutu Genişliği</span>
                            <span className="text-stone-500 dark:text-stone-400 font-normal">{settings.boxSize}px</span>
                        </label>
                        <input
                            type="range" id="box-size" value={settings.boxSize} min={20} max={100} step={1}
                            onChange={e => handleSettingChange('boxSize', parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
                        />
                    </div>
                </div>
            </div>
             <SettingsPresetManager 
                moduleKey="visual-support"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default VisualSupportModule;