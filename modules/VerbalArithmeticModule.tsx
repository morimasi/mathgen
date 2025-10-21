import React, { useCallback } from 'react';
import { generateReadinessProblem } from '../services/readinessService.ts';
import { VerbalArithmeticSettings, ModuleKey } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';
import { useWorksheet } from '../services/WorksheetContext.tsx';

const VerbalArithmeticModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const { allSettings, handleSettingsChange: setContextSettings } = useWorksheet();
    const settings = allSettings.verbalArithmetic;
    const moduleKey: ModuleKey = 'verbalArithmetic';

    const { generate } = useProblemGenerator({
        moduleKey,
        settings: {...settings, autoFit: false},
        generatorFn: (s) => generateReadinessProblem('verbal-arithmetic', s),
    });

    const handleSettingChange = (field: keyof VerbalArithmeticSettings, value: any) => {
        setContextSettings(moduleKey, { [field]: value });
    };

    const isTableLayout = printSettings.layoutMode === 'table';

    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">İşlemi Sözel İfade Etme</h2>
                <HintButton text="Bu etkinlik, öğrencilerden `3 + 2 = 5` gibi bir işlemi 'Üç artı iki eşittir beş' şeklinde yazıya dökmelerini isteyerek matematiksel dil becerilerini geliştirir." />
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <Select
                    label="İşlem Türü"
                    id="va-operation"
                    value={settings.operation}
                    onChange={e => handleSettingChange('operation', e.target.value as 'addition' | 'subtraction' | 'mixed')}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                 <NumberInput 
                    label="En Büyük Sonuç"
                    id="va-max-result"
                    min={5} max={100}
                    value={settings.maxResult}
                    onChange={e => handleSettingChange('maxResult', parseInt(e.target.value))}
                />
                <NumberInput 
                    label="Sayfa Başına Problem"
                    id="problems-per-page"
                    min={1} max={20}
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
                moduleKey="verbalArithmetic"
                currentSettings={settings}
                onLoadSettings={(s) => setContextSettings(moduleKey, s)}
            />
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => handleGenerate(true)} size="sm">Oluştur (Temizle)</Button>
                <Button onClick={() => handleGenerate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default VerbalArithmeticModule;