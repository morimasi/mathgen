import React, { useState, useCallback } from 'react';
import { generateReadinessProblem } from '../services/readinessService.ts';
import { generateContextualWordProblems } from '../services/geminiService.ts';
import { PatternsSettings, PatternType, MathReadinessTheme } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import Checkbox from '../components/form/Checkbox.tsx';
import TextInput from '../components/form/TextInput.tsx';
import { ShuffleIcon } from '../components/icons/Icons.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import { TOPIC_SUGGESTIONS } from '../constants.ts';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

const PatternsModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<PatternsSettings>({
        type: PatternType.RepeatingAB,
        theme: 'shapes',
        difficulty: 'easy',
        problemsPerPage: 8,
        pageCount: 1,
        autoFit: true,
        useWordProblems: false,
        topic: '',
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'patterns',
        settings,
        generatorFn: (s) => generateReadinessProblem('patterns', s),
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Yapay Zeka Destekli Örüntü Problemleri'
    });

    const handleSettingChange = (field: keyof PatternsSettings, value: any) => {
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
                <h2 className="text-sm font-semibold">Örüntüler Ayarları</h2>
                <HintButton text="'Tekrar Eden (AB/ABC)' örüntüleri basit tekrarları öğretirken, 'Büyüyen/Sayısal' örüntüler daha ileri düzeyde bir kuralı (örn: birer artan) anlama becerisi gerektirir." />
            </div>
             <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Checkbox
                    label="Gerçek Hayat Problemleri (AI)"
                    id="use-word-problems-patterns"
                    checked={settings.useWordProblems}
                    onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                />
                {settings.useWordProblems && (
                    <div className="mt-1.5 pl-6">
                         <div className="relative">
                            <TextInput
                                label="Problem Konusu (İsteğe bağlı)"
                                id="patterns-topic"
                                value={settings.topic || ''}
                                onChange={e => handleSettingChange('topic', e.target.value)}
                                placeholder="Örn: Renkli Boncuklar, Robot Adımları"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5">
                <Select
                    label="Örüntü Tipi"
                    id="pattern-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as PatternType)}
                    options={[
                        { value: PatternType.RepeatingAB, label: 'Tekrar Eden (AB)' },
                        { value: PatternType.RepeatingABC, label: 'Tekrar Eden (ABC)' },
                        { value: PatternType.Growing, label: 'Büyüyen/Sayısal' },
                    ]}
                />
                <Select
                    label="Tema"
                    id="pattern-theme"
                    value={settings.theme}
                    onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                    options={[
                        { value: 'shapes', label: 'Şekiller' },
                        { value: 'mixed', label: 'Karışık Nesneler' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Taşıtlar' },
                        { value: 'fruits', label: 'Meyveler' },
                    ]}
                     disabled={settings.type === 'growing'}
                />
                <NumberInput 
                    label="Sayfa Başına Problem"
                    id="problems-per-page"
                    min={1} max={12}
                    value={settings.problemsPerPage}
                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                    disabled={settings.autoFit || isTableLayout}
                    title={isTableLayout ? "Tablo modunda bu ayar devre dışıdır." : ""}
                />
                <NumberInput 
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                    disabled={isTableLayout}
                    title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}
                />
            </div>
            <SettingsPresetManager 
                moduleKey="patterns"
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

export default PatternsModule;