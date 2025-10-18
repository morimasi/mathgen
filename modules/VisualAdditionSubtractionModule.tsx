import React, { useState, useCallback } from 'react';
import { generateReadinessProblem } from '../services/readinessService.ts';
import { VisualAdditionSubtractionSettings, MathReadinessTheme } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

const VisualAdditionSubtractionModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<VisualAdditionSubtractionSettings>({
        operation: 'addition',
        theme: 'mixed',
        maxNumber: 5,
        problemsPerPage: 4,
        pageCount: 1,
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'visual-addition-subtraction',
        settings: {...settings, autoFit: false}, // This module has fixed-size visuals, autofit is not ideal
        generatorFn: (s) => generateReadinessProblem('visual-addition-subtraction', s),
    });

    const handleSettingChange = (field: keyof VisualAdditionSubtractionSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const isTableLayout = printSettings.layoutMode === 'table';

    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Şekillerle Toplama/Çıkarma</h2>
                <HintButton text="Öğrencilerin nesne gruplarını sayarak toplama ve çıkarma işlemlerinin temel mantığını anlamalarına yardımcı olan görsel bir etkinliktir." />
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <Select
                    label="İşlem Türü"
                    id="vas-operation"
                    value={settings.operation}
                    onChange={e => handleSettingChange('operation', e.target.value as 'addition' | 'subtraction' | 'mixed')}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <Select
                    label="Tema"
                    id="vas-theme"
                    value={settings.theme}
                    onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                    options={[
                        { value: 'mixed', label: 'Karışık' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Taşıtlar' },
                        { value: 'fruits', label: 'Meyveler' },
                        { value: 'shapes', label: 'Şekiller' },
                    ]}
                />
                 <NumberInput 
                    label="Her Gruptaki Max. Nesne"
                    id="vas-max-number"
                    min={2} max={10}
                    value={settings.maxNumber}
                    onChange={e => handleSettingChange('maxNumber', parseInt(e.target.value))}
                />
                <NumberInput 
                    label="Sayfa Başına Problem"
                    id="problems-per-page"
                    min={1} max={10}
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
                moduleKey="visual-addition-subtraction"
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

export default VisualAdditionSubtractionModule;
