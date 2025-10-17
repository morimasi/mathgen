import React, { useState } from 'react';
import { SymbolicArithmeticSettings } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateReadinessProblem } from '../../services/readinessService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';

const initialSettings: SymbolicArithmeticSettings = {
    operation: 'addition',
    theme: 'fruits',
    maxNumber: 10,
    problemsPerPage: 10,
    pageCount: 1,
    autoFit: true,
};

const SymbolicArithmeticModule: React.FC = () => {
    const [settings, setSettings] = useState<SymbolicArithmeticSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'symbolic-arithmetic',
        settings,
        generatorFn: (settings) => generateReadinessProblem('symbolic-arithmetic', settings),
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
             <p className="text-xs text-stone-600 dark:text-stone-400">Bu alıştırma, sayılar yerine simgeler kullanarak soyut düşünme becerisini geliştirir. Her çalışma kağıdının başında simgelerin sayısal değerlerini gösteren bir anahtar oluşturulur.</p>
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="İşlem Türü"
                    id="sa-operation"
                    value={settings.operation}
                    onChange={e => setSettings({ ...settings, operation: e.target.value as any })}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <Select
                    label="Tema (Simgeler)"
                    id="sa-theme"
                    value={settings.theme}
                    onChange={e => setSettings({ ...settings, theme: e.target.value as any })}
                    options={[
                        { value: 'fruits', label: 'Meyveler' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Araçlar' },
                        { value: 'shapes', label: 'Şekiller' },
                    ]}
                />
                <Checkbox
                    label="Otomatik Sığdır"
                    id="sa-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>

            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="sa-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={50}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="sa-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}
            
            <SettingsPresetManager<SymbolicArithmeticSettings>
                moduleKey="symbolicArithmetic"
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

export default SymbolicArithmeticModule;