

import React, { useState } from 'react';
// FIX: Imported IntroMeasurementType enum to use for initial settings.
import { IntroToMeasurementSettings, IntroMeasurementType } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateReadinessProblem } from '../services/readinessService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';

const initialSettings: IntroToMeasurementSettings = {
    // FIX: Changed string literal to enum member to fix type error.
    type: IntroMeasurementType.CompareLength,
    theme: 'measurement',
    difficulty: 'easy',
    problemsPerPage: 6,
    pageCount: 1,
    useWordProblems: false,
    topic: '',
    autoFit: true,
};

const IntroToMeasurementModule: React.FC = () => {
    const [settings, setSettings] = useState<IntroToMeasurementSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'intro-to-measurement',
        settings,
        generatorFn: (settings) => generateReadinessProblem('intro-to-measurement', settings),
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Etkinlik Türü"
                    id="itm-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as any })}
                    options={[
                        { value: 'compare-length', label: 'Uzunluk Karşılaştırma' },
                        { value: 'compare-weight', label: 'Ağırlık Karşılaştırma' },
                        { value: 'compare-capacity', label: 'Kapasite Karşılaştırma' },
                        { value: 'non-standard-length', label: 'Standart Olmayan Ölçüm' },
                    ]}
                />
                <Select
                    label="Tema (Nesneler)"
                    id="itm-theme"
                    value={settings.theme}
                    onChange={e => setSettings({ ...settings, theme: e.target.value as any })}
                    options={[
                        { value: 'measurement', label: 'Ölçüm Araçları' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Araçlar' },
                    ]}
                />
                 <Checkbox
                    label="Otomatik Sığdır"
                    id="itm-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>

            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="itm-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="itm-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={10}
                    />
                </div>
            )}
            
            <SettingsPresetManager<IntroToMeasurementSettings>
                moduleKey="introToMeasurement"
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

export default IntroToMeasurementModule;
