
import React, { useState } from 'react';
import { WordProblemSettings, Problem } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateContextualWordProblems } from '../services/geminiService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';
import TextInput from '../components/form/TextInput';
import { TOPIC_SUGGESTIONS } from '../constants';
import { TABS } from '../constants';

const initialSettings: WordProblemSettings = {
    topic: '',
    gradeLevel: '3',
    problemsPerPage: 10,
    pageCount: 1,
    operationCount: 1,
    customPrompt: '',
    sourceModule: 'arithmetic',
    useVisuals: true,
    autoFit: false,
    layout: 'default',
};

const WordProblemsModule: React.FC = () => {
    const [settings, setSettings] = useState<WordProblemSettings>(initialSettings);
    const [useCustomPrompt, setUseCustomPrompt] = useState(false);
    
    // A dummy generator function for when AI is the only source
    const dummyGenerator = () => ({ problem: { question: '', answer: '', category: '' }, title: '' });

    const { generate } = useProblemGenerator<WordProblemSettings>({
        moduleKey: 'word-problems',
        settings,
        generatorFn: dummyGenerator, // This won't be called because useWordProblems is effectively always true
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: "Yapay Zeka Destekli Problemler",
    });

    const handleGenerateClick = () => {
        // Force useWordProblems to true for this module
        generate(true);
    };

    const moduleOptions = TABS.filter(t => !['dyslexia', 'dyscalculia', 'dysgraphia', 'visual-support'].includes(t.id))
        .map(tab => ({ value: tab.id, label: tab.label }));

    return (
        <div className="space-y-4">
            <Checkbox
                label="Özel Talimat Girin"
                id="wp-useCustomPrompt"
                checked={useCustomPrompt}
                onChange={(e) => setUseCustomPrompt(e.target.checked)}
                containerClassName="mb-2"
            />

            {useCustomPrompt ? (
                <div className="space-y-2">
                    <label htmlFor="wp-customPrompt" className="font-medium text-xs text-stone-700 dark:text-stone-300">Özel Talimatınız</label>
                    <textarea
                        id="wp-customPrompt"
                        rows={4}
                        className="block w-full px-2 py-1 text-xs bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600"
                        placeholder="Örn: 3. sınıf için, içinde uzaylılar geçen ve hem çarpma hem toplama gerektiren 5 problem oluştur."
                        value={settings.customPrompt}
                        onChange={e => setSettings({ ...settings, customPrompt: e.target.value })}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Problem Modülü"
                        id="wp-sourceModule"
                        value={settings.sourceModule}
                        onChange={e => setSettings({ ...settings, sourceModule: e.target.value })}
                        options={moduleOptions}
                        containerClassName="col-span-2"
                    />
                    <Select
                        label="Sınıf Seviyesi"
                        id="wp-gradeLevel"
                        value={settings.gradeLevel}
                        onChange={e => setSettings({ ...settings, gradeLevel: e.target.value })}
                        options={[
                            { value: '1', label: '1. Sınıf' },
                            { value: '2', label: '2. Sınıf' },
                            { value: '3', label: '3. Sınıf' },
                            { value: '4', label: '4. Sınıf' },
                            { value: '5', label: '5. Sınıf' },
                        ]}
                    />
                    <NumberInput
                        label="İşlem Sayısı"
                        id="wp-operationCount"
                        value={settings.operationCount}
                        onChange={e => setSettings({ ...settings, operationCount: parseInt(e.target.value, 10) })}
                        min={1} max={3}
                    />
                    <TextInput
                        label="Konu (İsteğe Bağlı)"
                        id="wp-topic"
                        list="topic-suggestions"
                        value={settings.topic}
                        onChange={e => setSettings({ ...settings, topic: e.target.value })}
                        placeholder="Örn: Market Alışverişi"
                        containerClassName="col-span-2"
                    />
                    <datalist id="topic-suggestions">
                        {TOPIC_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                    </datalist>
                </div>
            )}
            
            <Select
                label="Problem Yerleşimi"
                id="wp-layout"
                value={settings.layout}
                onChange={e => setSettings({ ...settings, layout: e.target.value as Problem['layout'] })}
                options={[
                    { value: 'default', label: 'Standart' },
                    { value: 'with-visual-space', label: 'Görsel Çözüm Alanlı' },
                    { value: 'given-wanted', label: 'Verilen/İstenen/Çözüm' },
                ]}
            />
            
            <Checkbox
                label="Görsel Destek (Emoji)"
                id="wp-useVisuals"
                checked={settings.useVisuals}
                onChange={e => setSettings({ ...settings, useVisuals: e.target.checked })}
            />
            
            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    label="Problem Sayısı"
                    id="wp-problemsPerPage"
                    value={settings.problemsPerPage}
                    onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                    min={1} max={50}
                />
                <NumberInput
                    label="Sayfa Sayısı"
                    id="wp-pageCount"
                    value={settings.pageCount}
                    onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                    min={1} max={20}
                />
            </div>

            <SettingsPresetManager<WordProblemSettings>
                moduleKey="wordProblems"
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

export default WordProblemsModule;
