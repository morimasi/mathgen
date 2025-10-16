import React, { useEffect, useCallback, useRef } from 'react';
import { generateVisualProblem } from '../services/mathService';
import { Problem, VisualSupportSettings, ArithmeticOperation } from '../types';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

interface VisualSupportModuleProps extends ModuleProps {
    settings: VisualSupportSettings;
    setSettings: (settings: VisualSupportSettings) => void;
}

const VisualSupportModule: React.FC<VisualSupportModuleProps> = ({ 
    onGenerate, 
    setIsLoading, 
    contentRef,
    lastGeneratorModule,
    settings,
    setSettings
}) => {
    const { settings: printSettings, setSettings: setPrintSettings } = usePrintSettings();
    const isInitialMount = useRef(true);
    
    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsLoading(true);
        try {
            let totalCount;
            if (settings.autoFit) {
                const sampleProblem = { question: '<div style="height: 120px">Sample</div>', answer: '1' };
                const problemsPerPage = calculateMaxProblems(contentRef, printSettings, sampleProblem);
                totalCount = (problemsPerPage > 0 ? problemsPerPage : settings.problemsPerPage) * settings.pageCount;
            } else {
                totalCount = settings.problemsPerPage * settings.pageCount;
            }

            const results = Array.from({ length: totalCount }, () => generateVisualProblem(settings));
            
            if (results.length > 0) {
                const problems = results.map(r => r.problem);
                const title = results[0].title;
                onGenerate(problems, clearPrevious, title, 'visual-support', settings.pageCount);
            }
        } catch (error: any) {
            console.error(error);
        }
        setIsLoading(false);
    }, [settings, printSettings, contentRef, onGenerate, setIsLoading]);
    
    useEffect(() => {
        // This module is "live", so it should update whenever its settings or print settings change.
        if (lastGeneratorModule !== 'visual-support' && !isInitialMount.current) {
            // Do not auto-run if another module is active
            return;
        }

        const handler = setTimeout(() => {
            handleGenerate(true);
        }, 300); // Debounce to prevent rapid updates while sliding

        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        return () => clearTimeout(handler);
    }, [settings, printSettings, handleGenerate, lastGeneratorModule]);

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
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Görsel Destek Ayarları</h2>
             <p className="text-sm text-stone-600 dark:text-stone-400">
                Bu modül, nesneler ve kutular kullanarak temel matematik işlemleri için görsel alıştırmalar oluşturur. Ayarlar anında çalışma kağıdına yansır.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pt-2">
                 {/* --- LEFT COLUMN: CORE SETTINGS --- */}
                <div className="flex flex-col gap-y-3">
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
                    
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                        <Checkbox
                            label="Sayfayı Yatay Yap"
                            id="visual-orientation"
                            checked={printSettings.orientation === 'landscape'}
                            onChange={handleOrientationChange}
                        />
                    </div>

                    <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg space-y-3">
                         <Checkbox
                            label="Otomatik Sığdır"
                            id="auto-fit-visual"
                            checked={settings.autoFit}
                            onChange={e => handleSettingChange('autoFit', e.target.checked)}
                        />
                        <div className={`grid grid-cols-2 gap-3 transition-opacity ${settings.autoFit ? 'opacity-50' : 'opacity-100'}`}>
                            <NumberInput 
                                label="Problem Sayısı"
                                id="problems-per-page-visual"
                                min={1} max={50}
                                value={settings.problemsPerPage}
                                onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                                disabled={settings.autoFit}
                            />
                            <NumberInput 
                                label="Sayfa Sayısı"
                                id="page-count-visual"
                                min={1} max={20}
                                value={settings.pageCount}
                                onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: VISUAL SLIDERS --- */}
                <div className="flex flex-col justify-around gap-y-2">
                     <div className="space-y-1">
                        <label htmlFor="emoji-size" className="flex justify-between items-center font-medium text-sm text-stone-700 dark:text-stone-300">
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
                        <label htmlFor="number-size" className="flex justify-between items-center font-medium text-sm text-stone-700 dark:text-stone-300">
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
                        <label htmlFor="box-size" className="flex justify-between items-center font-medium text-sm text-stone-700 dark:text-stone-300">
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