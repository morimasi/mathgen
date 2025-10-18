import React, { useState, useCallback } from 'react';
import { generateReadinessProblem } from '../services/readinessService.ts';
import { SymbolicArithmeticSettings, MathReadinessTheme } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

const SymbolicArithmeticModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<SymbolicArithmeticSettings>({
        operation: 'addition',
        theme: 'animals',
        maxNumber: 10,
        problemsPerPage: 6,
        pageCount: 1,
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'symbolic-arithmetic',
        settings: {...settings, autoFit: false},
        generatorFn: (s) => generateReadinessProblem('symbolic-arithmetic', s),
    });

    const handleSettingChange = (field: keyof SymbolicArithmeticSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const isTableLayout = printSettings.layoutMode === 'table';

    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Simgelerle İşlemler</h2>
                <HintButton text="Sayılar yerine eğlenceli simgeler (emojiler) kullanarak işlem yapmayı gerektirir. Sayfanın başına bir 'simge anahtarı' eklenir. Soyut düşünme ve dikkat becerilerini geliştirir." />
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <Select
                    label="İşlem Türü"
                    id="sa-operation"
                    value={settings.operation}
                    onChange={e => handleSettingChange('operation', e.target.value as 'addition' | 'subtraction' | 'mixed')}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <Select
                    label="Simge Teması"
                    id="sa-theme"
                    value={settings.theme}
                    onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                    options={[
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Taşıtlar' },
                        { value: 'fruits', label: 'Meyveler' },
                        { value: 'shapes', label: 'Şekiller' },
                    ]}
                />
                 <NumberInput 
                    label="En Büyük Sayı"
                    id="sa-max-number"
                    min={5} max={10}
                    value={settings.maxNumber}
                    onChange={e => handleSettingChange('maxNumber', parseInt(e.target.value))}
                    title="Bu modül için en fazla 10 önerilir."
                />
                <NumberInput 
                    label="Sayfa Başına Problem"
                    id="problems-per-page"
                    min={1} max={12}
                    value={settings.problemsPerPage}
                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                    disabled={isTableLayout}
                />
                <NumberInput 
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                    disabled={isTableLayout}
                />
            </div>
            <SettingsPresetManager 
                moduleKey="symbolic-arithmetic"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => handleGenerate(true)} size="sm">Oluştur (Temizle)</Button>
                <Button onClick={() => handleGenerate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default SymbolicArithmeticModule;
