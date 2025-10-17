import React, { useEffect } from 'react';
import { generateVisualProblem } from '../services/mathService';
import { VisualSupportSettings, ArithmeticOperation } from '../types';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import { usePrintSettings } from '../services/PrintSettingsContext';
import SettingsPresetManager from '../components/SettingsPresetManager';
import Button from '../components/form/Button';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { useWorksheet } from '../services/WorksheetContext';

const VisualSupportModule: React.FC = () => {
    const { visualSupportSettings: settings, setVisualSupportSettings: setSettings } = useWorksheet();
    const { settings: printSettings, setSettings: setPrintSettings } = usePrintSettings();

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

                    <div className="p-1.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg space-y-2">
                         <Checkbox
                            label="Otomatik Sığdır"
                            id="auto-fit-visual"
                            checked={settings.autoFit}
                            onChange={e => handleSettingChange('autoFit', e.target.checked)}
                        />
                        <div className={`transition-opacity ${settings.autoFit ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                           <div className="flex items-end gap-2">
                                <NumberInput 
                                    containerClassName="flex-grow"
                                    label="Problem Sayısı"
                                    id="problems-per-page-visual"
                                    min={1} max={50}
                                    value={settings.problemsPerPage}
                                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value, 10) || 1)}
                                    disabled={settings.autoFit}
                                />
                                <NumberInput 
                                    containerClassName="flex-grow"
                                    label="Sayfa Sayısı"
                                    id="page-count-visual"
                                    min={1} max={20}
                                    value={settings.pageCount}
                                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value, 10) || 1)}
                                    disabled={settings.autoFit}
                                />
                                <Button
                                    onClick={() => generate(true)}
                                    disabled={settings.autoFit}
                                    size="sm"
                                    variant="secondary"
                                    className="h-[27px]"
                                    title="Manuel sayfa ve problem sayısını uygula"
                                >
                                    Uygula
                                </Button>
                            </div>
                        </div>
                    </div>
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
