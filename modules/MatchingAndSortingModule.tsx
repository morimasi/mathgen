import React, { useState, useCallback } from 'react';
// FIX: Add .ts extension to import path
import { generateReadinessProblem } from '../services/readinessService.ts';
import { generateContextualWordProblems } from '../services/geminiService.ts';
import { MatchingAndSortingSettings, MatchingType, MathReadinessTheme } from '../types.ts';
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

const MatchingAndSortingModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<MatchingAndSortingSettings>({
        type: MatchingType.OneToOne,
        theme: 'mixed',
        itemCount: 4,
        difficulty: 'easy',
        problemsPerPage: 4,
        pageCount: 1,
        autoFit: false,
        useWordProblems: false,
        topic: '',
        letterSpacing: 2,
        letterHorizontalSpacing: 4,
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'matching-and-sorting',
        settings,
        generatorFn: (s) => generateReadinessProblem('matching-and-sorting', s),
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Yapay Zeka Destekli Eşleştirme Problemleri'
    });

    const handleSettingChange = (field: keyof MatchingAndSortingSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const isTableLayout = printSettings.layoutMode === 'table';
    const isLetterMatching = settings.type === MatchingType.LetterMatching;

    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Eşleştirme ve Gruplama Ayarları</h2>
                <HintButton text="'Bire Bir Eşleştirme' görsel algıyı, 'Gölge Eşleştirme' form tanımayı, 'Özelliğe Göre Gruplama' ise kategorizasyon becerisini, 'Harf Eşleştirme' ise harf tanımayı geliştirir." />
            </div>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Checkbox
                    label="Gerçek Hayat Problemleri (AI)"
                    id="use-word-problems-matching"
                    checked={settings.useWordProblems}
                    onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                />
                 {settings.useWordProblems && (
                    <div className="mt-1.5 pl-6">
                         <div className="relative">
                            <TextInput
                                label="Problem Konusu (İsteğe bağlı)"
                                id="matching-topic"
                                value={settings.topic || ''}
                                onChange={e => handleSettingChange('topic', e.target.value)}
                                placeholder="Örn: Çiftlik Hayvanları, Giysiler"
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
                    label="Etkinlik Türü"
                    id="matching-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as MatchingType)}
                    options={[
                        { value: MatchingType.OneToOne, label: 'Bire Bir Eşleştirme' },
                        { value: MatchingType.Shadow, label: 'Gölge Eşleştirme' },
                        { value: MatchingType.ByProperty, label: 'Özelliğe Göre Gruplama' },
                        { value: MatchingType.LetterMatching, label: 'Harf Eşleştirme' },
                    ]}
                />
                <Select
                    label="Tema"
                    id="matching-theme"
                    value={settings.theme}
                    onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                    options={[
                        { value: 'mixed', label: 'Karışık' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Taşıtlar' },
                        { value: 'fruits', label: 'Meyveler' },
                        { value: 'shapes', label: 'Şekiller' },
                    ]}
                    disabled={isLetterMatching}
                    title={isLetterMatching ? "Harf Eşleştirme için tema seçilemez." : ""}
                />
                 <NumberInput 
                    label="Nesne/Harf Sayısı"
                    id="item-count"
                    min={3} max={8}
                    value={settings.itemCount}
                    onChange={e => handleSettingChange('itemCount', parseInt(e.target.value))}
                />
                 {isLetterMatching && (
                    <div className="space-y-3 col-span-1 sm:col-span-2">
                        <div className="space-y-1">
                            <label htmlFor="letter-spacing-slider" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                               <span>Dikey Harf Aralığı</span>
                               <span className="text-stone-500 dark:text-stone-400 font-normal">{`${(settings.letterSpacing ?? 2).toFixed(1)}rem`}</span>
                            </label>
                            <input
                                type="range" id="letter-spacing-slider" value={settings.letterSpacing || 2} min={0.5} max={10} step={0.1}
                                onChange={e => handleSettingChange('letterSpacing', parseFloat(e.target.value))}
                                className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="letter-horizontal-spacing-slider" className="flex justify-between items-center font-medium text-xs text-stone-700 dark:text-stone-300">
                               <span>Yatay Harf Aralığı</span>
                               <span className="text-stone-500 dark:text-stone-400 font-normal">{`${(settings.letterHorizontalSpacing ?? 4).toFixed(1)}rem`}</span>
                            </label>
                            <input
                                type="range" id="letter-horizontal-spacing-slider" value={settings.letterHorizontalSpacing || 4} min={0} max={15} step={0.5}
                                onChange={e => handleSettingChange('letterHorizontalSpacing', parseFloat(e.target.value))}
                                className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    </div>
                )}
                <NumberInput 
                    label="Sayfa Başına Problem"
                    id="problems-per-page"
                    min={1} max={10}
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
                moduleKey="matching-and-sorting"
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

export default MatchingAndSortingModule;