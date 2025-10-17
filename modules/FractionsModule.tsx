
import React, { useState } from 'react';
import { FractionsSettings, FractionsProblemType, FractionsOperation, Difficulty } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateFractionsProblem } from '../../services/fractionsService';
import { generateContextualWordProblems } from '../../services/geminiService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';
import TextInput from '../../components/form/TextInput';
import { TOPIC_SUGGESTIONS } from '../../constants';

const initialSettings: FractionsSettings = {
    gradeLevel: 3,
    type: FractionsProblemType.FourOperations,
    operation: FractionsOperation.Addition,
    difficulty: 'medium',
    maxSetSize: 50,
    problemsPerPage: 20,
    pageCount: 1,
    format: 'inline',
    representation: 'number',
    useWordProblems: false,
    operationCount: 1,
    useVisuals: false,
    topic: '',
    useMixedNumbers: true,
    autoFit: true,
};

const FractionsModule: React.FC = () => {
    const [settings, setSettings] = useState<FractionsSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'fractions',
        settings,
        generatorFn: generateFractionsProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Kesir Problemleri (AI)',
    });

    const handleGenerateClick = () => {
        generate(true);
    };
    
    const isFourOperations = settings.type === FractionsProblemType.FourOperations;

    return (
        <div className="space-y-4">
            <Checkbox
                label="Gerçek Hayat Problemleri (AI)"
                id="fractions-useWordProblems"
                checked={settings.useWordProblems}
                onChange={e => setSettings({ ...settings, useWordProblems: e.target.checked })}
            />

            {settings.useWordProblems && (
                 <div className="p-2 border rounded-md bg-stone-50 dark:bg-stone-700/50 space-y-2">
                    <TextInput
                        label="Problem Konusu"
                        id="fractions-topic"
                        list="topic-suggestions"
                        value={settings.topic}
                        onChange={e => setSettings({ ...settings, topic: e.target.value })}
                        placeholder="Örn: Pizza Partisi"
                    />
                    <datalist id="topic-suggestions">
                        {TOPIC_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                    </datalist>
                 </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Problem Türü"
                    id="fractions-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as FractionsProblemType })}
                    options={[
                        { value: FractionsProblemType.FourOperations, label: 'Dört İşlem' },
                        { value: FractionsProblemType.Recognition, label: 'Şekille Gösterme' },
                        { value: FractionsProblemType.Comparison, label: 'Karşılaştırma' },
                        { value: FractionsProblemType.Equivalent, label: 'Denk Kesirler' },
                        { value: FractionsProblemType.FractionOfSet, label: 'Bir Bütünün Kesri' },
                    ]}
                    containerClassName="col-span-2"
                />

                {isFourOperations && (
                    <>
                        <Select
                            label="İşlem"
                            id="fractions-operation"
                            value={settings.operation}
                            onChange={e => setSettings({ ...settings, operation: e.target.value as FractionsOperation })}
                            options={[
                                { value: FractionsOperation.Addition, label: 'Toplama' },
                                { value: FractionsOperation.Subtraction, label: 'Çıkarma' },
                                { value: FractionsOperation.Multiplication, label: 'Çarpma' },
                                { value: FractionsOperation.Division, label: 'Bölme' },
                                { value: FractionsOperation.Mixed, label: 'Karışık' },
                            ]}
                        />
                        <Select
                            label="Zorluk"
                            id="fractions-difficulty"
                            value={settings.difficulty}
                            onChange={e => setSettings({ ...settings, difficulty: e.target.value as Difficulty })}
                            options={[
                                { value: 'easy', label: 'Kolay (Paydalar Eşit)' },
                                { value: 'medium', label: 'Orta (Paydalar Farklı)' },
                                { value: 'hard', label: 'Zor (Tam Sayılı/Bileşik)' },
                            ]}
                        />
                         <Checkbox
                            label="Tam Sayılı / Bileşik Kesirler"
                            id="fractions-useMixed"
                            checked={settings.useMixedNumbers}
                            onChange={e => setSettings({ ...settings, useMixedNumbers: e.target.checked })}
                            disabled={settings.difficulty !== 'hard'}
                            containerClassName="col-span-2"
                        />
                    </>
                )}
                
                {settings.type === FractionsProblemType.FractionOfSet && (
                    <NumberInput
                        label="En Büyük Bütün Değeri"
                        id="fractions-maxSetSize"
                        value={settings.maxSetSize}
                        onChange={e => setSettings({ ...settings, maxSetSize: parseInt(e.target.value, 10)})}
                        min={10} max={200}
                    />
                )}

                {!settings.useWordProblems && (
                    <Select
                        label="Format"
                        id="fractions-format"
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
                    id="fractions-autofit"
                    checked={!!settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>
             {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="fractions-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={100}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="fractions-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}
            
            <SettingsPresetManager<FractionsSettings>
                moduleKey="fractions"
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

export default FractionsModule;
