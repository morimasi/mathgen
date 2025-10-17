
import React, { useState } from 'react';
import { MeasurementSettings, MeasurementProblemType, Difficulty } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateMeasurementProblem } from '../../services/measurementService';
import { generateContextualWordProblems } from '../../services/geminiService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';
import TextInput from '../../components/form/TextInput';
import { TOPIC_SUGGESTIONS } from '../../constants';

const initialSettings: MeasurementSettings = {
    gradeLevel: 3,
    type: MeasurementProblemType.LengthConversion,
    difficulty: 'medium',
    problemsPerPage: 20,
    pageCount: 1,
    useWordProblems: false,
    useVisuals: false,
    topic: '',
    autoFit: true,
};

const MeasurementModule: React.FC = () => {
    const [settings, setSettings] = useState<MeasurementSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'measurement',
        settings,
        generatorFn: generateMeasurementProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: "Ölçü Problemleri (AI)",
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    return (
        <div className="space-y-4">
             <Checkbox
                label="Gerçek Hayat Problemleri (AI)"
                id="measurement-useWordProblems"
                checked={settings.useWordProblems}
                onChange={e => setSettings({ ...settings, useWordProblems: e.target.checked })}
            />

            {settings.useWordProblems && (
                 <div className="p-2 border rounded-md bg-stone-50 dark:bg-stone-700/50 space-y-2">
                    <TextInput
                        label="Problem Konusu"
                        id="measurement-topic"
                        list="topic-suggestions"
                        value={settings.topic}
                        onChange={e => setSettings({ ...settings, topic: e.target.value })}
                        placeholder="Örn: Mutfak Ölçüleri"
                    />
                    <datalist id="topic-suggestions">
                        {TOPIC_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                    </datalist>
                 </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Problem Türü"
                    id="measurement-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as MeasurementProblemType })}
                    options={[
                        { value: MeasurementProblemType.LengthConversion, label: 'Uzunluk (km, m, cm)' },
                        { value: MeasurementProblemType.WeightConversion, label: 'Ağırlık (t, kg, g)' },
                        { value: MeasurementProblemType.VolumeConversion, label: 'Hacim (L, mL)' },
                        { value: MeasurementProblemType.Mixed, label: 'Karışık' },
                    ]}
                />
                <Select
                    label="Zorluk"
                    id="measurement-difficulty"
                    value={settings.difficulty}
                    onChange={e => setSettings({ ...settings, difficulty: e.target.value as Difficulty })}
                    options={[
                        { value: 'easy', label: 'Kolay' },
                        { value: 'medium', label: 'Orta' },
                        { value: 'hard', label: 'Zor' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                 <Checkbox
                    label="Otomatik Sığdır"
                    id="measurement-autofit"
                    checked={!!settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>
             {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput label="Sayfa Başına Problem" id="measurement-problemsPerPage" value={settings.problemsPerPage} onChange={e => setSettings({...settings, problemsPerPage: parseInt(e.target.value,10)})} min={1} max={100} />
                    <NumberInput label="Sayfa Sayısı" id="measurement-pageCount" value={settings.pageCount} onChange={e => setSettings({...settings, pageCount: parseInt(e.target.value,10)})} min={1} max={20} />
                </div>
            )}

            <SettingsPresetManager<MeasurementSettings>
                moduleKey="measurement"
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

export default MeasurementModule;
