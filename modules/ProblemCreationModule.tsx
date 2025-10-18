import React, { useState, useCallback } from 'react';
import { generateReadinessProblem } from '../services/readinessService.ts';
import { ProblemCreationSettings, MathReadinessTheme } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

const ProblemCreationModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<ProblemCreationSettings>({
        operation: 'addition',
        difficulty: 'easy',
        theme: 'mixed',
        problemsPerPage: 4,
        pageCount: 1,
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'problem-creation',
        settings: {...settings, autoFit: false},
        generatorFn: (s) => generateReadinessProblem('problem-creation', s),
    });

    const handleSettingChange = (field: keyof ProblemCreationSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const isTableLayout = printSettings.layoutMode === 'table';

    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Problem Kurma</h2>
                <HintButton text="Öğrencilere hazır bir işlem (örn: 5+3=8) ve bir görsel tema verilir. Öğrenciden bu bilgileri kullanarak kendi metin problemini yazması istenir. Yaratıcılığı ve matematiksel düşünceyi birleştirir." />
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <Select
                    label="İşlem Türü"
                    id="pc-operation"
                    value={settings.operation}
                    onChange={e => handleSettingChange('operation', e.target.value as 'addition' | 'subtraction')}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                    ]}
                />
                 <Select
                    label="Zorluk (Sayı Büyüklüğü)"
                    id="pc-difficulty"
                    value={settings.difficulty}
                    onChange={e => handleSettingChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                    options={[
                        { value: 'easy', label: 'Kolay (Sonuç < 20)' },
                        { value: 'medium', label: 'Orta (Sonuç < 100)' },
                        { value: 'hard', label: 'Zor (Sonuç < 1000)' },
                    ]}
                />
                <Select
                    label="Görsel Teması"
                    id="pc-theme"
                    value={settings.theme}
                    onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                    options={[
                        { value: 'mixed', label: 'Karışık' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Taşıtlar' },
                        { value: 'fruits', label: 'Meyveler/Yiyecekler' },
                    ]}
                    containerClassName="col-span-2"
                />
                <NumberInput 
                    label="Sayfa Başına Problem"
                    id="problems-per-page"
                    min={1} max={8}
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
                moduleKey="problem-creation"
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

export default ProblemCreationModule;
