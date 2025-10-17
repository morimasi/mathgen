import React, { useState } from 'react';
import { VerbalArithmeticSettings } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateVerbalArithmeticProblem } from '../../services/readinessService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';

const initialSettings: VerbalArithmeticSettings = {
    operation: 'addition',
    maxResult: 20,
    problemsPerPage: 20,
    pageCount: 1,
    autoFit: true,
};

const VerbalArithmeticModule: React.FC = () => {
    const [settings, setSettings] = useState<VerbalArithmeticSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'verbal-arithmetic',
        settings,
        generatorFn: generateVerbalArithmeticProblem,
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
            <p className="text-xs text-stone-600 dark:text-stone-400">Bu alıştırma, öğrencinin verilen matematiksel ifadenin okunuşunu yazı ile yazmasını hedefler.</p>
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="İşlem Türü"
                    id="va-operation"
                    value={settings.operation}
                    onChange={e => setSettings({ ...settings, operation: e.target.value as any })}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                    ]}
                />
                <NumberInput
                    label="Maksimum Sonuç"
                    id="va-maxResult"
                    value={settings.maxResult}
                    onChange={e => setSettings({ ...settings, maxResult: parseInt(e.target.value, 10) })}
                    min={10}
                    max={1000}
                />
                <Checkbox
                    label="Otomatik Sığdır"
                    id="va-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>

            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="va-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={100}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="va-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}
            
            <SettingsPresetManager<VerbalArithmeticSettings>
                moduleKey="verbalArithmetic"
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

export default VerbalArithmeticModule;