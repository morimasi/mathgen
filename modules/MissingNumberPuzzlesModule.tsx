import React, { useState, useCallback } from 'react';
// FIX: Add .ts extension to import of readinessService to fix module resolution error.
import { generateReadinessProblem } from '../services/readinessService.ts';
import { MissingNumberPuzzlesSettings } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

const MissingNumberPuzzlesModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<MissingNumberPuzzlesSettings>({
        operation: 'addition',
        termCount: 2,
        maxResult: 10,
        problemsPerPage: 8,
        pageCount: 1,
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'missing-number-puzzles',
        settings: {...settings, autoFit: false},
        generatorFn: (s) => generateReadinessProblem('missing-number-puzzles', s),
    });

    const handleSettingChange = (field: keyof MissingNumberPuzzlesSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const isTableLayout = printSettings.layoutMode === 'table';

    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Eksik Sayıyı Bulma</h2>
                <HintButton text="`5 + ? = 8` veya `? - 2 = 4` gibi denklemlerde bilinmeyeni bulma alıştırmalarıdır. Sayıların yanındaki noktalar, görsel bir ipucu sağlar." />
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <Select
                    label="İşlem Türü"
                    id="mnp-operation"
                    value={settings.operation}
                    onChange={e => handleSettingChange('operation', e.target.value as 'addition' | 'subtraction')}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                    ]}
                />
                 <Select
                    label="Terim Sayısı"
                    id="mnp-term-count"
                    value={settings.termCount}
                    onChange={e => handleSettingChange('termCount', parseInt(e.target.value))}
                    options={[
                        { value: 2, label: '2 Terimli' },
                        { value: 3, label: '3 Terimli' },
                    ]}
                    disabled={settings.operation === 'subtraction'}
                />
                 <NumberInput 
                    label="En Büyük Sonuç"
                    id="mnp-max-result"
                    min={5} max={20}
                    value={settings.maxResult}
                    onChange={e => handleSettingChange('maxResult', parseInt(e.target.value))}
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
                moduleKey="missing-number-puzzles"
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

export default MissingNumberPuzzlesModule;
