import React, { useState, useCallback } from 'react';
// FIX: Add .ts extension to import path
import { generateReadinessProblem } from '../services/readinessService.ts';
import { generateContextualWordProblems } from '../services/geminiService.ts';
import { SimpleGraphsSettings, MathReadinessTheme, SimpleGraphActivityType } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import Checkbox from '../components/form/Checkbox.tsx';
import TextInput from '../components/form/TextInput.tsx';
import { ShuffleIcon } from '../components/icons/Icons.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import { TOPIC_SUGGESTIONS } from '../constants.ts';
import HintButton from '../components/form/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

const SimpleGraphsModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<SimpleGraphsSettings>({
        activityType: SimpleGraphActivityType.ReadTallyChart,
        theme: 'custom',
        categoryCount: 4,
        maxItemCount: 20,
        scale: 2,
        problemsPerPage: 1,
        pageCount: 1,
        autoFit: false,
        useWordProblems: false,
        topic: '',
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'simple-graphs',
        settings,
        generatorFn: (s) => generateReadinessProblem('simple-graphs', s),
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Yapay Zeka Destekli Grafik Problemleri'
    });

    const handleSettingChange = (field: keyof SimpleGraphsSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const isTableLayout = printSettings.layoutMode === 'table';
    const showScale = [
        SimpleGraphActivityType.ReadObjectGraph, 
        SimpleGraphActivityType.ReadColumnGraph,
        SimpleGraphActivityType.ConvertGraph
    ].includes(settings.activityType);


    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    const getHintText = () => {
        switch (settings.activityType) {
            case SimpleGraphActivityType.ReadObjectGraph:
            case SimpleGraphActivityType.ReadColumnGraph:
                return "'Grafik Ölçeği' ayarı, grafikteki her bir nesnenin veya sembolün gerçekte kaç adedi temsil ettiğini belirler. Örneğin, ölçek 3 ise ve 4 🧸 varsa, bu 12 oyuncak anlamına gelir.";
            case SimpleGraphActivityType.CountAndFill:
                return "Bu etkinlikte, öğrencinin önce karışık olarak verilen nesneleri sayması, ardından boş çetele ve sıklık tablolarını doldurması ve son olarak da ilgili soruları yanıtlaması beklenir.";
            case SimpleGraphActivityType.ConvertGraph:
                return "Bu etkinlik, bir veri temsil formatından diğerine geçiş yapma becerisini ölçer. Öğrenciden, verilen bir nesne grafiğindeki bilgileri boş bir sütun grafiğine aktarması istenir.";
            default:
                return "'Etkinlik Türü' seçerek çetele ve sıklık tabloları, ölçekli nesne ve sütun grafikleri gibi çeşitli alıştırmalar oluşturabilirsiniz.";
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Basit Grafikler ve Veri Ayarları</h2>
                <HintButton text={getHintText()} />
            </div>
             <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Checkbox
                    label="Gerçek Hayat Problemleri (AI)"
                    id="use-word-problems-graphs"
                    checked={settings.useWordProblems}
                    onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                />
                 {settings.useWordProblems && (
                    <div className="mt-1.5 pl-6">
                         <div className="relative">
                            <TextInput
                                label="Problem Konusu (İsteğe bağlı)"
                                id="graphs-topic"
                                value={settings.topic || ''}
                                onChange={e => handleSettingChange('topic', e.target.value)}
                                placeholder="Örn: Sınıftaki Oyuncaklar"
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
                    label="Etkinlik Türü"
                    id="graph-activity-type"
                    value={settings.activityType}
                    onChange={e => handleSettingChange('activityType', e.target.value as SimpleGraphActivityType)}
                    options={[
                        { value: SimpleGraphActivityType.ReadTallyChart, label: 'Çetele Tablosu Okuma' },
                        { value: SimpleGraphActivityType.ReadFrequencyTable, label: 'Sıklık Tablosu Okuma' },
                        { value: SimpleGraphActivityType.ReadObjectGraph, label: 'Nesne Grafiği Okuma' },
                        { value: SimpleGraphActivityType.ReadColumnGraph, label: 'Sütun Grafiği Okuma' },
                        { value: SimpleGraphActivityType.CountAndFill, label: 'Say ve Tablo Doldur' },
                        { value: SimpleGraphActivityType.ConvertGraph, label: 'Grafik Dönüştürme' },
                    ]}
                    containerClassName="col-span-2"
                />
                <Select
                    label="Tema"
                    id="graph-theme"
                    value={settings.theme}
                    onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                    options={[
                        { value: 'custom', label: 'Rastgele Konular' },
                        { value: 'fruits', label: 'Meyveler/Yiyecekler' },
                        { value: 'animals', label: 'Hayvanlar' },
                        { value: 'vehicles', label: 'Taşıtlar' },
                        { value: 'shapes', label: 'Şekiller' },
                    ]}
                />
                <NumberInput 
                    label="Kategori Sayısı"
                    id="category-count"
                    min={2} max={6}
                    value={settings.categoryCount}
                    onChange={e => handleSettingChange('categoryCount', parseInt(e.target.value))}
                />
                {showScale && (
                     <NumberInput 
                        label="Grafik Ölçeği"
                        id="graph-scale"
                        min={1} max={5}
                        value={settings.scale}
                        onChange={e => handleSettingChange('scale', parseInt(e.target.value))}
                        title="Her bir nesnenin kaç adedi temsil edeceği."
                    />
                )}
                <NumberInput 
                    label="En Fazla Nesne"
                    id="max-item-count"
                    min={5} max={50}
                    value={settings.maxItemCount}
                    onChange={e => handleSettingChange('maxItemCount', parseInt(e.target.value))}
                />
                <NumberInput 
                    label="Sayfa Başına Problem"
                    id="problems-per-page"
                    min={1} max={5}
                    value={settings.problemsPerPage}
                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                    disabled={settings.autoFit || isTableLayout}
                    title={isTableLayout ? "Tablo modunda bu ayar devre dışıdır." : ""}
                />
                <NumberInput 
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={10}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                    disabled={isTableLayout}
                    title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}
                />
            </div>
            <SettingsPresetManager 
                moduleKey="simple-graphs"
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

export default SimpleGraphsModule;