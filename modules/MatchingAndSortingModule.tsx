

import React, { useState } from 'react';
// FIX: Imported MatchingType enum to use for initial settings.
import { MatchingAndSortingSettings, MatchingType } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateReadinessProblem } from '../services/readinessService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';

const initialSettings: MatchingAndSortingSettings = {
    // FIX: Changed string literal to enum member to fix type error.
    type: MatchingType.OneToOne,
    theme: 'animals',
    itemCount: 5,
    difficulty: 'easy',
    problemsPerPage: 5,
    pageCount: 1,
    useWordProblems: false,
    topic: '',
    autoFit: true,
};

const MatchingAndSortingModule: React.FC = () => {
    const [settings, setSettings] = useState<MatchingAndSortingSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'matching-and-sorting',
        settings,
        generatorFn: (settings) => generateReadinessProblem('matching-and-sorting', settings),
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Eşleştirme Türü"
                    id="ms-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as any })}
                    options={[
                        { value: 'one-to-one', label: 'Birebir Eşleştirme' },
                        { value: 'shadow', label: 'Gölge Eşleştirme' },
                        { value: 'by-property', label: 'Özelliğe Göre Gruplama' },
                    ]}
                />
                <Select
                    label="Tema (Nesneler)"
                    id="ms-theme"
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
                    id="ms-itemCount"
                    value={settings.itemCount}
                    onChange={e => setSettings({ ...settings, itemCount: parseInt(e.target.value, 10) })}
                    min={3}
                    max={8}
                    containerClassName="col-span-2"
                />
                 <Checkbox
                    label="Otomatik Sığdır"
                    id="ms-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>
            
            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="ms-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={10}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="ms-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={10}
                    />
                </div>
            )}

            <SettingsPresetManager<MatchingAndSortingSettings>
                moduleKey="matchingAndSorting"
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

export default MatchingAndSortingModule;
