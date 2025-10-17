
import React, { useState } from 'react';
import { BasicShapesSettings, ShapeRecognitionType, ShapeType } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateReadinessProblem } from '../services/readinessService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';

const initialSettings: BasicShapesSettings = {
    type: ShapeRecognitionType.ColorShape,
    shapes: [ShapeType.Circle, ShapeType.Square, ShapeType.Triangle],
    problemsPerPage: 10,
    pageCount: 1,
    useWordProblems: false,
    topic: '',
    autoFit: true,
};

const BasicShapesModule: React.FC = () => {
    const [settings, setSettings] = useState<BasicShapesSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'basic-shapes',
        settings,
        generatorFn: (settings) => generateReadinessProblem('basic-shapes', settings),
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <Select
                    label="Etkinlik Türü"
                    id="bs-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as any })}
                    options={[
                        { value: 'color-shape', label: 'Şekli Boya' },
                        { value: 'match-object-shape', label: 'Nesne-Şekil Eşleştir' },
                        { value: 'count-shapes', label: 'Şekilleri Say' },
                    ]}
                />
                
                <Checkbox
                    label="Otomatik Sığdır"
                    id="bs-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                />
            </div>

            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="bs-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={50}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="bs-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}
            
            <SettingsPresetManager<BasicShapesSettings>
                moduleKey="basicShapes"
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

export default BasicShapesModule;
