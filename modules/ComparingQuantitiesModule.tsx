import React, { useState, useCallback } from 'react';
import { generateReadinessProblem } from '../services/readinessService';
import { generateContextualWordProblems } from '../services/geminiService';
import { ComparingQuantitiesSettings, ComparisonType, MathReadinessTheme } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import TextInput from '../components/form/TextInput';
import { ShuffleIcon } from '../components/icons/Icons';
import { usePrintSettings } from '../services/PrintSettingsContext';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { TOPIC_SUGGESTIONS } from '../constants';
import HintButton from '../components/HintButton';
import { useProblemGenerator } from '../hooks/useProblemGenerator';

const ComparingQuantitiesModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<ComparingQuantitiesSettings>({
        type: ComparisonType.MoreLess,
        theme: 'mixed',
        maxObjectCount: 10,
        problemsPerPage: 8,
        pageCount: 1,
        autoFit: true,
        useWordProblems: false,
        topic: '',
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'comparing-quantities',
        settings,
        generatorFn: (s) => generateReadinessProblem('comparing-quantities', s),
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Yapay Zeka Destekli Karşılaştırma Problemleri'
    });

    const handleSettingChange = (field: keyof ComparingQuantitiesSettings, value: any) => {
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
                <h2 className="text-sm font-semibold">Miktarları Karşılaştırma Ayarları</h2>
                <HintButton text="'Az - Çok' sayma becerisini, 'Büyük - Küçük' ve 'Uzun - Kısa' ise görsel ayrım yapma yeteneğini hedefler. Okul öncesi için temel kavramlardır." />
            </div>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Checkbox
                    label="Gerçek Hayat Problemleri (AI)"
                    id="use-word-problems-comparing"
                    checked={settings.useWordProblems}
                    onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                />
                 {settings.useWordProblems && (
                    <div className="mt-1.5 pl-6">
                         <div className="relative">
                            <TextInput
                                label="Problem Konusu (İsteğe Bağlı)"
                                id="comparing-topic"
                                value={settings.topic || ''}
                                onChange={e => handleSettingChange('topic', e.target.value)}
                                placeholder="Örn: Meyve Sepetleri, Akvaryum"
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
                    label="Karşılaştırma Türü"
                    id="comparison-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as ComparisonType)}
                    options={[
                        { value: ComparisonType.MoreLess, label: 'Az - Çok' },
                        { value: ComparisonType.BiggerSmaller, label: 'Büyük - Küçük' },
                        { value: ComparisonType.TallerShorter, label: 'Uzun - Kısa' },
                    ]}
                />
                <Select
                    label="Tema"
                    id="comparison-theme"
                    value={settings.theme}
                    onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                    options={[
                        { value: 'mixed', label: 'Karışık' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Taşıtlar' },
                        { value: 'fruits', label: 'Meyveler' },
                        { value: 'shapes', label: 'Şekiller' },
                    ]}
                />
                 <NumberInput 
                    label="En Fazla Nesne Sayısı"
                    id="max-object-count"
                    min={3} max={20}
                    value={settings.maxObjectCount}
                    onChange={e => handleSettingChange('maxObjectCount', parseInt(e.target.value))}
                    disabled={settings.type !== ComparisonType.MoreLess}
                />
                <NumberInput 
                    label="Sayfa Başına Problem"
                    id="problems-per-page"
                    min={1} max={20}
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
                moduleKey="comparing-quantities"
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

export default ComparingQuantitiesModule;