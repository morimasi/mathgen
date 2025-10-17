import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateReadinessProblem } from '../services/readinessService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, IntroToMeasurementSettings, IntroMeasurementType, MathReadinessTheme } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import TextInput from '../components/form/TextInput';
import { ShuffleIcon } from '../components/icons/Icons';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { TOPIC_SUGGESTIONS } from '../constants';
import HintButton from '../components/HintButton';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const IntroToMeasurementModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<IntroToMeasurementSettings>({
        type: IntroMeasurementType.CompareLength,
        theme: 'mixed',
        difficulty: 'easy',
        problemsPerPage: 6,
        pageCount: 1,
        autoFit: true,
        useWordProblems: false,
        topic: '',
    });
    const isInitialMount = useRef(true);

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsLoading(true);
        try {
            let totalCount;
            const isTableLayout = printSettings.layoutMode === 'table';

            if (isTableLayout) {
                totalCount = printSettings.rows * printSettings.columns;
            } else if (settings.autoFit) {
                const problemsPerPage = calculateMaxProblems(contentRef, printSettings) || settings.problemsPerPage;
                totalCount = problemsPerPage * settings.pageCount;
            } else {
                totalCount = settings.problemsPerPage * settings.pageCount;
            }

            if (settings.useWordProblems) {
                 const problems = await generateContextualWordProblems('intro-to-measurement', { ...settings, problemsPerPage: totalCount, pageCount: 1 });
                onGenerate(problems, clearPrevious, "Yapay Zeka Destekli Ölçme Problemleri", 'intro-to-measurement', settings.pageCount);
            } else {
                const results = Array.from({ length: totalCount }, () => generateReadinessProblem('intro-to-measurement', settings));
                
                const firstResultWithError = results.find(r => (r as any).error);
                if (firstResultWithError) {
                    console.error((firstResultWithError as any).error);
                } else if (results.length > 0) {
                    const problems = results.map(r => r.problem);
                    const title = results[0].title;
                    onGenerate(problems, clearPrevious, title, 'intro-to-measurement', isTableLayout ? 1 : settings.pageCount);
                }
            }
        } catch (error: any) {
            console.error(error);
        }
        setIsLoading(false);
    }, [settings, printSettings, contentRef, onGenerate, setIsLoading]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'intro-to-measurement') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (lastGeneratorModule === 'intro-to-measurement') {
            const handler = setTimeout(() => handleGenerate(true), 300);
            return () => clearTimeout(handler);
        }
    }, [settings, printSettings, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof IntroToMeasurementSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const isTableLayout = printSettings.layoutMode === 'table';

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Ölçmeye Giriş Ayarları</h2>
                <HintButton text="'Uzunluk/Ağırlık/Kapasite Karşılaştırma' görsel tahmin becerisi kazandırırken, 'Standart Olmayan Ölçme' bir nesnenin başka bir nesne cinsinden uzunluğunu bulmayı öğretir (örn: kalem kaç ataş boyunda?)." />
            </div>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Checkbox
                    label="Gerçek Hayat Problemleri (AI)"
                    id="use-word-problems-measurement-intro"
                    checked={settings.useWordProblems}
                    onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                />
                 {settings.useWordProblems && (
                    <div className="mt-1.5 pl-6">
                         <div className="relative">
                            <TextInput
                                label="Problem Konusu (İsteğe bağlı)"
                                id="measurement-intro-topic"
                                value={settings.topic || ''}
                                onChange={e => handleSettingChange('topic', e.target.value)}
                                placeholder="Örn: Mutfak Eşyaları, Sınıf Malzemeleri"
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
                    id="measurement-intro-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as IntroMeasurementType)}
                    options={[
                        { value: IntroMeasurementType.CompareLength, label: 'Uzunluk Karşılaştırma' },
                        { value: IntroMeasurementType.CompareWeight, label: 'Ağırlık Karşılaştırma' },
                        { value: IntroMeasurementType.CompareCapacity, label: 'Kapasite Karşılaştırma' },
                        { value: IntroMeasurementType.NonStandardLength, label: 'Standart Olmayan Ölçme' },
                    ]}
                />
                <Select
                    label="Tema/Nesneler"
                    id="measurement-intro-theme"
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
                moduleKey="intro-to-measurement"
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

export default IntroToMeasurementModule;