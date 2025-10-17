

import React, { useState } from 'react';
// FIX: Imported PositionalConceptType enum to use for initial settings.
import { PositionalConceptsSettings, PositionalConceptType } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateReadinessProblem } from '../../services/readinessService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';

const initialSettings: PositionalConceptsSettings = {
    // FIX: Changed string literal to enum member to fix type error.
    type: PositionalConceptType.AboveBelow,
    theme: 'fruits',
    itemCount: 4,
    problemsPerPage: 6,
    pageCount: 1,
    useWordProblems: false,
    topic: '',
    autoFit: true,
};

const PositionalConceptsModule: React.FC = () => {
    const [settings, setSettings] = useState<PositionalConceptsSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'positional-concepts',
        settings,
        generatorFn: (settings) => generateReadinessProblem('positional-concepts', settings),
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Kavram Türü"
                    id="pc-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as any })}
                    options={[
                        { value: 'above-below', label: 'Üstünde / Altında' },
                        { value: 'inside-outside', label: 'İçinde / Dışında' },
                        { value: 'left-right', label: 'Sağında / Solunda' },
                    ]}
                />
                <Select
                    label="Tema (Nesneler)"
                    id="pc-theme"
                    value={settings.theme}
                    onChange={e => setSettings({ ...settings, theme: e.target.value as any })}
                    options={[
                        { value: 'fruits', label: 'Meyveler' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Araçlar' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <NumberInput
                    label="Nesne Sayısı"
                    id="pc-itemCount"
                    value={settings.itemCount}
                    onChange={e => setSettings({ ...settings, itemCount: parseInt(e.target.value, 10) })}
                    min={2}
                    max={8}
                    containerClassName="col-span-2"
                />
                <Checkbox
                    label="Otomatik Sığdır"
                    id="pc-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>
            
            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="pc-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="pc-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={10}
                    />
                </div>
            )}
            
            <SettingsPresetManager<PositionalConceptsSettings>
                moduleKey="positionalConcepts"
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

export default PositionalConceptsModule;