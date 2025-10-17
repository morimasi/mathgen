import React, { useState } from 'react';
import { VisualAdditionSubtractionSettings } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateVisualAdditionSubtractionProblem } from '../../services/readinessService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';

const initialSettings: VisualAdditionSubtractionSettings = {
    operation: 'addition',
    theme: 'fruits',
    maxNumber: 10,
    problemsPerPage: 10,
    pageCount: 1,
    autoFit: true,
};

const VisualAdditionSubtractionModule: React.FC = () => {
    const [settings, setSettings] = useState<VisualAdditionSubtractionSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'visual-addition-subtraction',
        settings,
        generatorFn: generateVisualAdditionSubtractionProblem,
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="İşlem Türü"
                    id="vas-operation"
                    value={settings.operation}
                    onChange={e => setSettings({ ...settings, operation: e.target.value as any })}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <Select
                    label="Tema (Nesneler)"
                    id="vas-theme"
                    value={settings.theme}
                    onChange={e => setSettings({ ...settings, theme: e.target.value as any })}
                    options={[
                        { value: 'fruits', label: 'Meyveler' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Araçlar' },
                        { value: 'shapes', label: 'Şekiller' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <NumberInput
                    label="En Büyük Sayı"
                    id="vas-maxNumber"
                    value={settings.maxNumber}
                    onChange={e => setSettings({ ...settings, maxNumber: parseInt(e.target.value, 10) })}
                    min={5}
                    max={20}
                    containerClassName="col-span-2"
                />
                <Checkbox
                    label="Otomatik Sığdır"
                    id="vas-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>

            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="vas-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={50}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="vas-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}
            
            <SettingsPresetManager<VisualAdditionSubtractionSettings>
                moduleKey="visualAdditionSubtraction"
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

export default VisualAdditionSubtractionModule;