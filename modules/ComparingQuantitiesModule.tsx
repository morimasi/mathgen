
import React, { useState } from 'react';
// FIX: Imported ComparisonType enum to use for initial settings.
import { ComparingQuantitiesSettings, ComparisonType } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateReadinessProblem } from '../services/readinessService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';

const initialSettings: ComparingQuantitiesSettings = {
    // FIX: Changed string literal to enum member to fix type error.
    type: ComparisonType.MoreLess,
    theme: 'fruits',
    maxObjectCount: 10,
    problemsPerPage: 10,
    pageCount: 1,
    useWordProblems: false,
    topic: '',
    autoFit: true,
};

const ComparingQuantitiesModule: React.FC = () => {
    const [settings, setSettings] = useState<ComparingQuantitiesSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'comparing-quantities',
        settings,
        generatorFn: (settings) => generateReadinessProblem('comparing-quantities', settings),
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Karşılaştırma Türü"
                    id="cq-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as any })}
                    options={[
                        { value: 'more-less', label: 'Çok / Az' },
                        { value: 'bigger-smaller', label: 'Büyük / Küçük' },
                        { value: 'taller-shorter', label: 'Uzun / Kısa' },
                    ]}
                />
                <Select
                    label="Tema (Nesneler)"
                    id="cq-theme"
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
                    label="Maksimum Nesne Sayısı"
                    id="cq-maxObjectCount"
                    value={settings.maxObjectCount}
                    onChange={e => setSettings({ ...settings, maxObjectCount: parseInt(e.target.value, 10) })}
                    min={3}
                    max={20}
                    containerClassName="col-span-2"
                    disabled={settings.type !== 'more-less'}
                />
                <Checkbox
                    label="Otomatik Sığdır"
                    id="cq-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>

            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="cq-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={50}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="cq-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}
            
            <SettingsPresetManager<ComparingQuantitiesSettings>
                moduleKey="comparingQuantities"
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

export default ComparingQuantitiesModule;
