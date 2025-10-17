

import React, { useState } from 'react';
// FIX: Imported NumberRecognitionType enum to use for initial settings.
import { NumberRecognitionSettings, NumberRecognitionType } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateReadinessProblem } from '../../services/readinessService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';

const initialSettings: NumberRecognitionSettings = {
    // FIX: Changed string literal to enum member to fix type error.
    type: NumberRecognitionType.CountAndWrite,
    theme: 'animals',
    numberRange: '1-10',
    problemsPerPage: 10,
    pageCount: 1,
    useWordProblems: false,
    topic: '',
    autoFit: true,
};

const NumberRecognitionModule: React.FC = () => {
    const [settings, setSettings] = useState<NumberRecognitionSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'number-recognition',
        settings,
        generatorFn: (settings) => generateReadinessProblem('number-recognition', settings),
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Etkinlik Türü"
                    id="nr-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as any })}
                    options={[
                        { value: 'count-and-write', label: 'Say ve Yaz' },
                        { value: 'count-and-color', label: 'Sayı Kadar Boya' },
                        { value: 'connect-the-dots', label: 'Noktaları Birleştir' },
                    ]}
                />
                <Select
                    label="Tema (Nesneler)"
                    id="nr-theme"
                    value={settings.theme}
                    onChange={e => setSettings({ ...settings, theme: e.target.value as any })}
                    options={[
                        { value: 'fruits', label: 'Meyveler' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Araçlar' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <Select
                    label="Sayı Aralığı"
                    id="nr-numberRange"
                    value={settings.numberRange}
                    onChange={e => setSettings({ ...settings, numberRange: e.target.value as any })}
                    options={[
                        { value: '1-5', label: '1-5 Arası' },
                        { value: '1-10', label: '1-10 Arası' },
                        { value: '1-20', label: '1-20 Arası' },
                    ]}
                    containerClassName="col-span-2"
                />
                 <Checkbox
                    label="Otomatik Sığdır"
                    id="nr-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>

            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="nr-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={50}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="nr-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}
            
            <SettingsPresetManager<NumberRecognitionSettings>
                moduleKey="numberRecognition"
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

export default NumberRecognitionModule;