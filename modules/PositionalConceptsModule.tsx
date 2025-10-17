import React, { useState, useCallback } from 'react';
import { generateReadinessProblem } from '../services/readinessService';
import { generateContextualWordProblems } from '../services/geminiService';
import { PositionalConceptsSettings, PositionalConceptType, MathReadinessTheme } from '../types';
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

const PositionalConceptsModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<PositionalConceptsSettings>({
        type: PositionalConceptType.AboveBelow,
        theme: 'mixed',
        itemCount: 3,
        problemsPerPage: 4,
        pageCount: 1,
        autoFit: true,
        useWordProblems: false,
        topic: '',
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'positional-concepts',
        settings,
        generatorFn: (s) => generateReadinessProblem('positional-concepts', s),
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Yapay Zeka Destekli Konum Problemleri'
    });

    const handleSettingChange = (field: keyof PositionalConceptsSettings, value: any) => {
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
                <h2 className="text-sm font-semibold">Konum ve Yön Ayarları</h2>
                <HintButton text="'Üstünde/Altında', 'İçinde/Dışında', 'Sağında/Solunda' gibi temel mekansal kavramları görsel senaryolar üzerinden öğretir." />
            </div>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Checkbox
                    label="Gerçek Hayat Problemleri (AI)"
                    id="use-word-problems-positional"
                    checked={settings.useWordProblems}
                    onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                />
                 {settings.useWordProblems && (
                    <div className="mt-1.5 pl-6">
                         <div className="relative">
                            <TextInput
                                label="Problem Konusu (İsteğe bağlı)"
                                id="positional-topic"
                                value={settings.topic || ''}
                                onChange={e => handleSettingChange('topic', e.target.value)}
                                placeholder="Örn: Sınıftaki Eşyalar, Oyuncak Kutusu"
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
                    label="Kavram Türü"
                    id="positional-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as PositionalConceptType)}
                    options={[
                        { value: PositionalConceptType.AboveBelow, label: 'Üstünde / Altında' },
                        { value: PositionalConceptType.InsideOutside, label: 'İçinde / Dışında' },
                        { value: PositionalConceptType.LeftRight, label: 'Sağında / Solunda' },
                    ]}
                />
                <Select
                    label="Tema"
                    id="positional-theme"
                    value={settings.theme}
                    onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                    options={[
                        { value: 'mixed', label: 'Karışık' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Taşıtlar' },
                        { value: 'fruits', label: 'Meyveler/Eşyalar' },
                    ]}
                />
                <NumberInput 
                    label="Toplam Nesne Sayısı"
                    id="item-count"
                    min={2} max={6}
                    value={settings.itemCount}
                    onChange={e => handleSettingChange('itemCount', parseInt(e.target.value))}
                />
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
                moduleKey="positional-concepts"
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

export default PositionalConceptsModule;
