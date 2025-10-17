
import React, { useState } from 'react';
import { DecimalsSettings, DecimalsProblemType, DecimalsOperation, Difficulty } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateDecimalProblem } from '../../services/mathService';
import { generateContextualWordProblems } from '../../services/geminiService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';
import TextInput from '../../components/form/TextInput';
import { TOPIC_SUGGESTIONS } from '../../constants';

const initialSettings: DecimalsSettings = {
    gradeLevel: 4,
    type: DecimalsProblemType.FourOperations,
    operation: DecimalsOperation.Addition,
    difficulty: 'medium',
    problemsPerPage: 20,
    pageCount: 1,
    format: 'inline',
    representation: 'number',
    useWordProblems: false,
    operationCount: 1,
    useVisuals: false,
    topic: '',
    autoFit: true,
};

const DecimalsModule: React.FC = () => {
    const [settings, setSettings] = useState<DecimalsSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'decimals',
        settings,
        generatorFn: generateDecimalProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Ondalık Sayı Problemleri (AI)',
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    const isFourOperations = settings.type === DecimalsProblemType.FourOperations;

    return (
        <div className="space-y-4">
            <Checkbox
                label="Gerçek Hayat Problemleri (AI)"
                id="decimals-useWordProblems"
                checked={settings.useWordProblems}
                onChange={e => setSettings({ ...settings, useWordProblems: e.target.checked })}
            />

            {settings.useWordProblems && (
                <div className="p-2 border rounded-md bg-stone-50 dark:bg-stone-700/50 space-y-2">
                    <TextInput
                        label="Problem Konusu"
                        id="decimals-topic"
                        list="topic-suggestions"
                        value={settings.topic}
                        onChange={e => setSettings({ ...settings, topic: e.target.value })}
                        placeholder="Örn: Para Hesaplamaları"
                    />
                    <datalist id="topic-suggestions">
                        {TOPIC_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                    </datalist>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Problem Türü"
                    id="decimals-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as DecimalsProblemType })}
                    options={[
                        { value: DecimalsProblemType.FourOperations, label: 'Dört İşlem' },
                        { value: DecimalsProblemType.ReadWrite, label: 'Okuma / Yazma' },
                        { value: DecimalsProblemType.ToFraction, label: 'Kesre Çevirme' },
                    ]}
                    containerClassName="col-span-2"
                />

                {isFourOperations && (
                    <>
                        <Select
                            label="İşlem"
                            id="decimals-operation"
                            value={settings.operation}
                            onChange={e => setSettings({ ...settings, operation: e.target.value as DecimalsOperation })}
                            options={[
                                { value: DecimalsOperation.Addition, label: 'Toplama' },
                                { value: DecimalsOperation.Subtraction, label: 'Çıkarma' },
                                { value: DecimalsOperation.Multiplication, label: 'Çarpma' },
                                { value: DecimalsOperation.Division, label: 'Bölme' },
                                { value: DecimalsOperation.Mixed, label: 'Karışık' },
                            ]}
                        />
                        <Select
                            label="Zorluk"
                            id="decimals-difficulty"
                            value={settings.difficulty}
                            onChange={e => setSettings({ ...settings, difficulty: e.target.value as Difficulty })}
                            options={[
                                { value: 'easy', label: 'Kolay' },
                                { value: 'medium', label: 'Orta' },
                                { value: 'hard', label: 'Zor' },
                            ]}
                        />
                    </>
                )}

                {!settings.useWordProblems && (
                    <Select
                        label="Format"
                        id="decimals-format"
                        value={settings.format}
                        onChange={e => setSettings({ ...settings, format: e.target.value as any })}
                        options={[
                            { value: 'inline', label: 'Yan Yana' },
                            { value: 'vertical-html', label: 'Alt Alta' },
                        ]}
                        disabled={!isFourOperations}
                    />
                )}
                 <Checkbox
                    label="Otomatik Sığdır"
                    id="decimals-autofit"
                    checked={!!settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>

            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="decimals-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={100}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="decimals-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}

            <SettingsPresetManager<DecimalsSettings>
                moduleKey="decimals"
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

export default DecimalsModule;
