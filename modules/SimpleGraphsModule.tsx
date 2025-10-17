

import React, { useState } from 'react';
// FIX: Imported SimpleGraphType enum to use for initial settings.
import { SimpleGraphsSettings, SimpleGraphType } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateReadinessProblem } from '../services/readinessService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';

const initialSettings: SimpleGraphsSettings = {
    // FIX: Changed string literal to enum member to fix type error.
    graphType: SimpleGraphType.Pictograph,
    theme: 'fruits',
    categoryCount: 3,
    maxItemCount: 5,
    problemsPerPage: 1,
    pageCount: 1,
    useWordProblems: false,
    topic: '',
    autoFit: false, // This module is typically one big problem
};

const SimpleGraphsModule: React.FC = () => {
    const [settings, setSettings] = useState<SimpleGraphsSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'simple-graphs',
        settings,
        generatorFn: (settings) => generateReadinessProblem('simple-graphs', settings),
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Grafik Türü"
                    id="sg-graphType"
                    value={settings.graphType}
                    onChange={e => setSettings({ ...settings, graphType: e.target.value as any })}
                    options={[
                        { value: 'pictograph', label: 'Nesne Grafiği' },
                        { value: 'barchart', label: 'Sütun Grafiği' },
                    ]}
                />
                <Select
                    label="Tema (Nesneler)"
                    id="sg-theme"
                    value={settings.theme}
                    onChange={e => setSettings({ ...settings, theme: e.target.value as any })}
                    options={[
                        { value: 'fruits', label: 'Meyveler' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Araçlar' },
                        { value: 'shapes', label: 'Şekiller' },
                    ]}
                />
                <NumberInput
                    label="Kategori Sayısı"
                    id="sg-categoryCount"
                    value={settings.categoryCount}
                    onChange={e => setSettings({ ...settings, categoryCount: parseInt(e.target.value, 10) })}
                    min={2}
                    max={5}
                />
                 <NumberInput
                    label="Maksimum Nesne Sayısı"
                    id="sg-maxItemCount"
                    value={settings.maxItemCount}
                    onChange={e => setSettings({ ...settings, maxItemCount: parseInt(e.target.value, 10) })}
                    min={3}
                    max={10}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    label="Sayfa Sayısı"
                    id="sg-pageCount"
                    value={settings.pageCount}
                    onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                    min={1} max={5}
                    containerClassName="col-span-2"
                />
            </div>
            
            <SettingsPresetManager<SimpleGraphsSettings>
                moduleKey="simpleGraphs"
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

export default SimpleGraphsModule;
