
import React, { useEffect } from 'react';
import { useWorksheet } from '../services/WorksheetContext';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateVisualProblem } from '../services/mathService';
import { ArithmeticOperation, VisualSupportSettings } from '../types';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { usePrintSettings } from '../services/PrintSettingsContext';

const VisualSupportModule: React.FC = () => {
    const { visualSupportSettings, setVisualSupportSettings, resetWorksheet } = useWorksheet();
    const { settings: printSettings, setSettings: setPrintSettings } = usePrintSettings();

    const { generate } = useProblemGenerator({
        moduleKey: 'visual-support',
        settings: visualSupportSettings,
        generatorFn: generateVisualProblem,
        isLive: true,
    });

    const handleSettingChange = (field: keyof VisualSupportSettings, value: any) => {
        setVisualSupportSettings({ ...visualSupportSettings, [field]: value });
    };

    const handleApplyClick = () => {
        generate(true);
    };
    
    // Reset worksheet when component mounts if it's not already on this module
    useEffect(() => {
        generate(true);
        return () => {
            resetWorksheet();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="İşlem Türü"
                    id="vs-operation"
                    value={visualSupportSettings.operation}
                    onChange={e => handleSettingChange('operation', e.target.value as ArithmeticOperation)}
                    options={[
                        { value: ArithmeticOperation.Addition, label: 'Toplama' },
                        { value: ArithmeticOperation.Subtraction, label: 'Çıkarma' },
                        { value: ArithmeticOperation.Multiplication, label: 'Çarpma' },
                        { value: ArithmeticOperation.Division, label: 'Bölme' },
                        { value: ArithmeticOperation.MixedAdditionSubtraction, label: 'Toplama & Çıkarma Karışık' },
                    ]}
                    containerClassName="col-span-2"
                />
                <NumberInput
                    label="En Büyük Sayı"
                    id="vs-maxNumber"
                    value={visualSupportSettings.maxNumber}
                    onChange={e => handleSettingChange('maxNumber', parseInt(e.target.value, 10))}
                    min={5}
                    max={50}
                    containerClassName="col-span-2"
                />
            </div>
            
            <div className="space-y-3 p-3 border rounded-md bg-stone-50 dark:bg-stone-700/50">
                 <h3 className="text-xs font-semibold mb-1">Sayfa Düzeni (Canlı)</h3>
                <Checkbox
                    label="Otomatik Sığdır"
                    id="vs-autofit"
                    checked={visualSupportSettings.autoFit}
                    onChange={e => handleSettingChange('autoFit', e.target.checked)}
                />
                {!visualSupportSettings.autoFit && (
                    <div className="flex gap-2 items-end">
                        <NumberInput
                            label="Problem Sayısı"
                            id="vs-problemsPerPage"
                            value={visualSupportSettings.problemsPerPage}
                            onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value, 10))}
                            min={1} max={20}
                        />
                         <Button onClick={handleApplyClick} size="md">Uygula</Button>
                    </div>
                )}
                 <div className="space-y-1">
                    <label htmlFor="vs-emoji-size" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                        <span>Emoji Boyutu</span>
                        <span className="text-stone-500 dark:text-stone-400 font-normal">{`${visualSupportSettings.emojiSize}px`}</span>
                    </label>
                    <input type="range" id="vs-emoji-size" value={visualSupportSettings.emojiSize} min={12} max={40} step={1} onChange={e => handleSettingChange('emojiSize', parseFloat(e.target.value))} className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700" />
                </div>
                 <div className="space-y-1">
                    <label htmlFor="vs-box-size" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                        <span>Kutu Boyutu</span>
                        <span className="text-stone-500 dark:text-stone-400 font-normal">{`${visualSupportSettings.boxSize}px`}</span>
                    </label>
                    <input type="range" id="vs-box-size" value={visualSupportSettings.boxSize} min={40} max={120} step={2} onChange={e => handleSettingChange('boxSize', parseFloat(e.target.value))} className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700" />
                </div>
                 <Button 
                    onClick={() => setPrintSettings({...printSettings, orientation: printSettings.orientation === 'portrait' ? 'landscape' : 'portrait'})} 
                    variant="secondary"
                    className="w-full"
                >
                    Sayfayı {printSettings.orientation === 'portrait' ? 'Yatay' : 'Dikey'} Yap
                </Button>
            </div>


            <SettingsPresetManager<VisualSupportSettings>
                moduleKey="visualSupport"
                currentSettings={visualSupportSettings}
                onLoadSettings={setVisualSupportSettings}
            />
        </div>
    );
};

export default VisualSupportModule;
