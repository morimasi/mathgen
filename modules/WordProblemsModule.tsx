import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { generateWordProblems } from '../services/geminiService';
import { Problem, WordProblemSettings } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import TextInput from '../components/form/TextInput';
import Checkbox from '../components/form/Checkbox';
import { ShuffleIcon } from '../components/icons/Icons';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { useToast } from '../services/ToastContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { TABS } from '../constants';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const TOPIC_SUGGESTIONS = [
    'Market Alışverişi',
    'Okul Eşyaları',
    'Hayvanlar Alemi',
    'Spor Aktiviteleri',
    'Doğa ve Çevre',
    'Yemek Tarifleri',
    'Seyahat ve Ulaşım',
    'Para Hesaplamaları',
    'Zaman Ölçme',
    'Geometrik Şekiller',
    'Bilim Deneyleri',
    'Doğum Günü Partisi',
];

const moduleOptions = [
    { value: 'none', label: 'Genel Konu' },
    ...TABS.filter(tab => tab.id !== 'word-problems').map(tab => ({
        value: tab.id,
        label: tab.label
    }))
];

const WordProblemsModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
    const [settings, setSettings] = useState<WordProblemSettings>({
        topic: 'Dört İşlem',
        gradeLevel: '4',
        problemsPerPage: 5,
        pageCount: 1,
        operationCount: 1,
        customPrompt: '',
        autoFit: true,
        sourceModule: 'none',
        useVisuals: false,
    });
    const isInitialMount = useRef(true);

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsLoading(true);
        try {
            let totalCount;
            if (settings.autoFit) {
                const sampleProblem = {
                    question: "Bu, yapay zeka tarafından oluşturulmuş daha uzun bir metin problemi örneğidir ve genellikle birkaç satır yer kaplar.",
                    answer: "Cevap: 15 elma"
                };
                const problemsPerPage = calculateMaxProblems(contentRef, printSettings, sampleProblem) || settings.problemsPerPage;
                totalCount = problemsPerPage * settings.pageCount;
            } else {
                 totalCount = settings.problemsPerPage * settings.pageCount;
            }
            const adjustedSettings = { ...settings, problemsPerPage: totalCount, pageCount: 1 };
            const problems = await generateWordProblems(adjustedSettings);
            const title = `Yapay Zeka Destekli Problemler (${settings.customPrompt ? 'Özel' : settings.topic})`;
            onGenerate(problems, clearPrevious, title, 'word-problems', settings.pageCount);
            addToast(`${problems.length} AI problemi başarıyla oluşturuldu!`, 'success');
        } catch (err: any) {
            console.error(err);
            addToast(err.message || "Problem oluşturulurken bir hata oluştu.", 'error');
        }
        setIsLoading(false);
    }, [settings, printSettings, contentRef, onGenerate, setIsLoading, addToast]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'word-problems') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule]);

    // Live update for auto-fit
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (settings.autoFit && lastGeneratorModule === 'word-problems') {
            const handler = setTimeout(() => {
                handleGenerate(true);
            }, 300); // Debounce to prevent rapid updates

            return () => clearTimeout(handler);
        }
    }, [settings, printSettings, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof WordProblemSettings, value: string | number | boolean) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const dynamicPlaceholder = useMemo(() => {
        const totalProblems = settings.autoFit ? '(otomatik)' : settings.problemsPerPage * settings.pageCount;
        let subjectText = '';
        if (settings.sourceModule && settings.sourceModule !== 'none') {
            const moduleName = TABS.find(tab => tab.id === settings.sourceModule)?.label || '';
            subjectText = `${moduleName} konusunda`;
            if (settings.topic) {
                subjectText += ` ve '${settings.topic.toLowerCase()}' temalı`;
            }
        } else {
            subjectText = `'${settings.topic.toLowerCase()}' geçen`;
        }
        return `Örn: ${settings.gradeLevel}. sınıf seviyesinde, ${subjectText}, ${settings.operationCount} işlemli ${totalProblems} tane problem oluştur.`;
    }, [settings.topic, settings.gradeLevel, settings.operationCount, settings.problemsPerPage, settings.pageCount, settings.autoFit, settings.sourceModule]);

    const topicLabel = settings.sourceModule && settings.sourceModule !== 'none' ? 'Konu Detayı (İsteğe Bağlı)' : 'Konu';

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Problemler (AI)</h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
                Bu modül, Google Gemini AI kullanarak özel matematik problemleri oluşturur. Lütfen API anahtarınızın doğru yapılandırıldığından emin olun.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                        label="Otomatik Sığdır"
                        id="auto-fit-word-problems"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                    />
                </div>
                 <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <Checkbox
                        label="Görsel Destek Ekle (Emoji)"
                        id="use-visuals-word-problems"
                        checked={settings.useVisuals ?? false}
                        onChange={e => handleSettingChange('useVisuals', e.target.checked)}
                    />
                     <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 pl-6">
                        Yapay zekanın oluşturduğu problemlere konuyla ilgili emojiler eklemesini sağlar.
                    </p>
                </div>
            </div>


            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Sınıf Seviyesi"
                    id="gradeLevel"
                    value={settings.gradeLevel}
                    onChange={e => handleSettingChange('gradeLevel', e.target.value)}
                    options={[
                        { value: '1', label: '1. Sınıf' },
                        { value: '2', label: '2. Sınıf' },
                        { value: '3', label: '3. Sınıf' },
                        { value: '4', label: '4. Sınıf' },
                        { value: '5', label: '5. Sınıf' },
                        { value: '6', label: '6. Sınıf' },
                        { value: '7', label: '7. Sınıf' },
                        { value: '8', label: '8. Sınıf' },
                    ]}
                />
                <Select
                    label="İşlem Sayısı"
                    id="operationCount"
                    value={settings.operationCount}
                    onChange={e => handleSettingChange('operationCount', parseInt(e.target.value, 10))}
                    options={[
                        { value: 1, label: '1 İşlemli' },
                        { value: 2, label: '2 İşlemli' },
                        { value: 3, label: '3 İşlemli' },
                    ]}
                />
                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <Select
                        label="Problem Modülü"
                        id="sourceModule"
                        value={settings.sourceModule}
                        onChange={e => handleSettingChange('sourceModule', e.target.value)}
                        options={moduleOptions}
                    />
                    <div className="relative">
                        <TextInput
                            label={topicLabel}
                            id="topic"
                            value={settings.topic}
                            onChange={e => handleSettingChange('topic', e.target.value)}
                            placeholder="Örn: Mutfak, Hayvanlar"
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={handleRandomTopic}
                            className="absolute right-2.5 bottom-[9px] text-stone-500 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors"
                            title="Rastgele Konu Öner"
                        >
                            <ShuffleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <NumberInput
                    label="Sayfa Başına Problem Sayısı"
                    id="problems-per-page"
                    min={1} max={20}
                    value={settings.problemsPerPage}
                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value, 10))}
                    disabled={settings.autoFit}
                />
                 <NumberInput
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value, 10))}
                />
                <div className="col-span-2 pt-4">
                     <label htmlFor="custom-prompt" className="font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5 block">Veya Özel Talimat Girin</label>
                     <textarea
                        id="custom-prompt"
                        rows={4}
                        className="block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600 sm:text-sm"
                        placeholder={dynamicPlaceholder}
                        value={settings.customPrompt}
                        onChange={e => handleSettingChange('customPrompt', e.target.value)}
                     />
                </div>
            </div>
            <SettingsPresetManager 
                moduleKey="word-problems"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
            <div className="flex flex-wrap gap-4 pt-4">
                <Button onClick={() => handleGenerate(true)}>Oluştur (Temizle)</Button>
                <Button onClick={() => handleGenerate(true)} variant="secondary" title="Ayarları koruyarak soruları yenile">
                    <ShuffleIcon className="w-5 h-5" />
                    Yenile
                </Button>
                <Button onClick={() => handleGenerate(false)} variant="secondary">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default WordProblemsModule;