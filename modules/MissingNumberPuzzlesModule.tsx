import React, { useState } from 'react';
import { MissingNumberPuzzlesSettings } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateMissingNumberPuzzlesProblem } from '../../services/readinessService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';

const initialSettings: MissingNumberPuzzlesSettings = {
    operation: 'addition',
    termCount: 2,
    maxResult: 20,
    problemsPerPage: 15,
    pageCount: 1,
    autoFit: true,
};

const MissingNumberPuzzlesModule: React.FC = () => {
    const [settings, setSettings] = useState<MissingNumberPuzzlesSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'missing-number-puzzles',
        settings,
        generatorFn: generateMissingNumberPuzzlesProblem,
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
             <p className="text-xs text-stone-600 dark:text-stone-400">Bu alıştırma, öğrencilerin toplama ve çıkarma arasındaki ilişkiyi anlamalarına yardımcı olur. Her problem, noktalarla görsel olarak desteklenir.</p>
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="İşlem Türü"
                    id="mnp-operation"
                    value={settings.operation}
                    onChange={e => setSettings({ ...settings, operation: e.target.value as any })}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                    ]}
                />
                <NumberInput
                    label="Maksimum Sonuç"
                    id="mnp-maxResult"
                    value={settings.maxResult}
                    onChange={e => setSettings({ ...settings, maxResult: parseInt(e.target.value, 10) })}
                    min={5}
                    max={100}
                />
                <Checkbox
                    label="Otomatik Sığdır"
                    id="mnp-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>

            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="mnp-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={50}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="mnp-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}
            
            <SettingsPresetManager<MissingNumberPuzzlesSettings>
                moduleKey="missingNumberPuzzles"
                currentSettings={settings}
                onLoadSettings={setSettings}
                initialSettings={initialSettings}
            />

            <Button onClick={handleGenerateClick} className="w-full" enableFlyingLadybug>
                Çalışma Kağıdı Oluştur
            </Button>
        </div>
    );
};

export default MissingNumberPuzzlesModule;