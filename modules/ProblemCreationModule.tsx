import React, { useState } from 'react';
import { ProblemCreationSettings } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateProblemCreationProblem } from '../../services/readinessService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';

const initialSettings: ProblemCreationSettings = {
    operation: 'addition',
    difficulty: 'easy',
    theme: 'animals',
    problemsPerPage: 5,
    pageCount: 1,
    autoFit: false,
};

const ProblemCreationModule: React.FC = () => {
    const [settings, setSettings] = useState<ProblemCreationSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'problem-creation',
        settings,
        generatorFn: generateProblemCreationProblem,
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
            <p className="text-xs text-stone-600 dark:text-stone-400">Bu yaratıcı alıştırma, öğrencilere verilen bir işlem ve temayı kullanarak kendi metin problemlerini yazma becerisi kazandırır.</p>
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="İşlem Türü"
                    id="pc-operation"
                    value={settings.operation}
                    onChange={e => setSettings({ ...settings, operation: e.target.value as any })}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                    ]}
                />
                 <Select
                    label="Zorluk (Sayı Büyüklüğü)"
                    id="pc-difficulty"
                    value={settings.difficulty}
                    onChange={e => setSettings({ ...settings, difficulty: e.target.value as any })}
                    options={[
                        { value: 'easy', label: 'Kolay (Sonuç < 10)' },
                        { value: 'medium', label: 'Orta (Sonuç < 50)' },
                        { value: 'hard', label: 'Zor (Sonuç < 100)' },
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
                     containerClassName="col-span-2"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    label="Sayfa Başına Problem"
                    id="pc-problemsPerPage"
                    value={settings.problemsPerPage}
                    onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                    min={1} max={10}
                />
                <NumberInput
                    label="Sayfa Sayısı"
                    id="pc-pageCount"
                    value={settings.pageCount}
                    onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                    min={1} max={5}
                />
            </div>
            
            <SettingsPresetManager<ProblemCreationSettings>
                moduleKey="problemCreation"
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

export default ProblemCreationModule;