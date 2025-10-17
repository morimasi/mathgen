
import React, { useState } from 'react';
// FIX: Imported PatternType enum to use for initial settings.
import { PatternsSettings, PatternType } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateReadinessProblem } from '../services/readinessService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';

const initialSettings: PatternsSettings = {
    // FIX: Changed string literal to enum member to fix type error.
    type: PatternType.RepeatingAB,
    theme: 'shapes',
    difficulty: 'easy',
    problemsPerPage: 8,
    pageCount: 1,
    useWordProblems: false,
    topic: '',
    autoFit: true,
};

const PatternsModule: React.FC = () => {
    const [settings, setSettings] = useState<PatternsSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'patterns',
        settings,
        generatorFn: (settings) => generateReadinessProblem('patterns', settings),
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Örüntü Türü"
                    id="p-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as any })}
                    options={[
                        { value: 'repeating-ab', label: 'Tekrarlayan (AB)' },
                        { value: 'repeating-abc', label: 'Tekrarlayan (ABC)' },
                        { value: 'growing', label: 'Genişleyen (Sayısal)' },
                    ]}
                />
                <Select
                    label="Tema (Nesneler)"
                    id="p-theme"
                    value={settings.theme}
                    onChange={e => setSettings({ ...settings, theme: e.target.value as any })}
                    options={[
                        { value: 'shapes', label: 'Şekiller' },
                        { value: 'fruits', label: 'Meyveler' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                    disabled={settings.type === 'growing'}
                />
                 <Checkbox
                    label="Otomatik Sığdır"
                    id="p-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>
            
            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="p-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={50}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="p-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}

            <SettingsPresetManager<PatternsSettings>
                moduleKey="patterns"
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

export default PatternsModule;
