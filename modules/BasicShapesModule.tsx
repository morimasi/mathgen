import React, { useState, useCallback } from 'react';
import { generateReadinessProblem } from '../services/readinessService.ts';
import { generateContextualWordProblems } from '../services/geminiService.ts';
import { BasicShapesSettings, ShapeRecognitionType, ShapeType } from '../types.ts';
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

const BasicShapesModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<BasicShapesSettings>({
        type: ShapeRecognitionType.ColorShape,
        shapes: [ShapeType.Circle, ShapeType.Square, ShapeType.Triangle],
        problemsPerPage: 6,
        pageCount: 1,
        autoFit: false,
        useWordProblems: false,
        topic: '',
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'basic-shapes',
        settings,
        generatorFn: (s) => generateReadinessProblem('basic-shapes', s),
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Yapay Zeka Destekli Şekil Problemleri'
    });

    const handleSettingChange = (field: keyof BasicShapesSettings, value: any) => {
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
                <h2 className="text-sm font-semibold">Temel Geometrik Şekiller Ayarları</h2>
                <HintButton text="'Şekil Boyama' belirli şekilleri tanımayı, 'Nesne-Şekil Eşleştirme' gerçek dünya nesneleriyle ilişki kurmayı, 'Şekil Sayma' ise dikkat ve sayma becerisini hedefler." />
            </div>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Checkbox
                    label="Gerçek Hayat Problemleri (AI)"
                    id="use-word-problems-shapes"
                    checked={settings.useWordProblems}
                    onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                />
                {settings.useWordProblems && (
                    <div className="mt-1.5 pl-6">
                         <div className="relative">
                            <TextInput
                                label="Problem Konusu (İsteğe bağlı)"
                                id="shapes-topic"
                                value={settings.topic || ''}
                                onChange={e => handleSettingChange('topic', e.target.value)}
                                placeholder="Örn: Oyuncaklar, Ev Eşyaları"
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
                    id="shape-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as ShapeRecognitionType)}
                    options={[
                        { value: ShapeRecognitionType.ColorShape, label: 'Şekil Boyama' },
                        { value: ShapeRecognitionType.MatchObjectShape, label: 'Nesne-Şekil Eşleştirme' },
                        { value: ShapeRecognitionType.CountShapes, label: 'Şekil Sayma' },
                    ]}
                    containerClassName="col-span-1 sm:col-span-2"
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
                moduleKey="basic-shapes"
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

export default BasicShapesModule;