import React, { useState, useCallback } from 'react';
// FIX: Add .ts extension to import of readinessService to fix module resolution error.
import { generateReadinessProblem } from '../services/readinessService.ts';
import { ProblemCreationSettings, MathReadinessTheme } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';
import Checkbox from '../components/form/Checkbox.tsx';
import TextInput from '../components/form/TextInput.tsx';
import { ShuffleIcon } from '../components/icons/Icons.tsx';
import { generateContextualWordProblems } from '../services/geminiService.ts';
import { TOPIC_SUGGESTIONS } from '../constants.ts';


const ProblemCreationModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<ProblemCreationSettings>({
        operation: 'addition',
        difficulty: 'easy',
        theme: 'mixed',
        problemsPerPage: 4,
        pageCount: 1,
        useWordProblems: false, 
        topic: ''
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'problem-creation',
        settings: {...settings, autoFit: false}, // This module has a larger fixed size, autofit isn't ideal
        generatorFn: (s) => generateReadinessProblem('problem-creation', s),
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Yapay Zeka Destekli Problem Kurma Örnekleri'
    });

    const handleSettingChange = (field: keyof ProblemCreationSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };
    
    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const isTableLayout = printSettings.layoutMode === 'table';

    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Problem Kurma</h2>
                <HintButton text="Öğrencilere hazır bir işlem (örn: 5+3=8) ve bir görsel tema verilir. Öğrenciden bu bilgileri kullanarak kendi metin problemini yazması istenir. Yaratıcılığı ve matematiksel düşünceyi birleştirir." />
            </div>

            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Checkbox
                    label="AI ile Örnek Problem Oluştur"
                    id="use-word-problems-pc"
                    checked={settings.useWordProblems ?? false}
                    onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                />
                 {settings.useWordProblems && (
                    <div className="mt-1.5 pl-6">
                         <div className="relative">
                            <TextInput
                                label="Problem Konusu"
                                id="pc-topic"
                                value={settings.topic || ''}
                                onChange={e => handleSettingChange('topic', e.target.value)}
                                placeholder="Örn: Çiftlik Hayvanları"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={handleRandomTopic}
                                className="absolute right-2.5 bottom-[5px] text-stone-500 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors"
                                title="Rastgele Konu Öner"
                            >
                                <ShuffleIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <Select
                    label="İşlem Türü"
                    id="pc-operation"
                    value={settings.operation}
                    onChange={e => handleSettingChange('operation', e.target.value as 'addition' | 'subtraction')}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                    ]}
                />
                 <Select
                    label="Zorluk (Sayı Büyüklüğü)"
                    id="pc-difficulty"
                    value={settings.difficulty}
                    onChange={e => handleSettingChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                    options={[
                        { value: 'easy', label: 'Kolay (Sonuç < 20)' },
                        { value: 'medium', label: 'Orta (Sonuç < 100)' },
                        { value: 'hard', label: 'Zor (Sonuç < 1000)' },
                    ]}
                />
                <Select
                    label="Görsel Teması"
                    id="pc-theme"
                    value={settings.theme}
                    onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                    options={[
                        { value: 'mixed', label: 'Karışık' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Taşıtlar' },
                        { value: 'fruits', label: 'Meyveler/Yiyecekler' },
                    ]}
                    containerClassName="col-span-2"
                />
                <NumberInput 
                    label="Sayfa Başına Problem"
                    id="problems-per-page"
                    min={1} max={8}
                    value={settings.problemsPerPage}
                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                    disabled={isTableLayout}
                />
                <NumberInput 
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                    disabled={isTableLayout}
                />
            </div>
            <SettingsPresetManager 
                moduleKey="problem-creation"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => handleGenerate(true)} size="sm">Oluştur (Temizle)</Button>
                <Button onClick={() => handleGenerate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default ProblemCreationModule;
