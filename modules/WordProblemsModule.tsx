import React, { useState, useMemo, useCallback } from 'react';
import { generateContextualWordProblems } from '../services/geminiService';
import { WordProblemSettings, Problem } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import TextInput from '../components/form/TextInput';
import Checkbox from '../components/form/Checkbox';
import { ShuffleIcon } from '../components/icons/Icons';
import { usePrintSettings } from '../services/PrintSettingsContext';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { TABS, TOPIC_SUGGESTIONS } from '../constants';
import HintButton from '../components/HintButton';
import { useProblemGenerator } from '../hooks/useProblemGenerator';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const moduleOptions = [
    { value: 'none', label: 'Genel Konu' },
    ...TABS.filter(tab => tab.id !== 'word-problems').map(tab => ({
        value: tab.id,
        label: tab.label
    }))
];

const WordProblemsModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
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
        layout: 'default',
    });
    
    const { generate } = useProblemGenerator({
        moduleKey: 'word-problems',
        settings: { ...settings, useWordProblems: true }, // Force useWordProblems for this module
        // This module ONLY uses AI, so provide a dummy local generator
        generatorFn: () => ({ problem: { question: '', answer: '', category: '' }, title: '' }),
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: `Yapay Zeka Destekli Problemler (${settings.customPrompt ? 'Özel' : settings.topic})`
    });

    const handleSettingChange = (field: keyof WordProblemSettings, value: string | number | boolean) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };
    
    const isTableLayout = printSettings.layoutMode === 'table';

    const dynamicPlaceholder = useMemo(() => {
        const totalProblems = isTableLayout ? `${printSettings.rows * printSettings.columns}` : (settings.autoFit ? '(otomatik)' : settings.problemsPerPage * settings.pageCount);
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
    }, [settings.topic, settings.gradeLevel, settings.operationCount, settings.problemsPerPage, settings.pageCount, settings.autoFit, settings.sourceModule, isTableLayout, printSettings.rows, printSettings.columns]);

    const topicLabel = settings.sourceModule && settings.sourceModule !== 'none' ? 'Konu Detayı (İsteğe Bağlı)' : 'Konu';
    
    const getHintText = () => {
        if (settings.customPrompt) {
            return "Özel talimatınız, diğer tüm ayarları geçersiz kılar. Yapay zekaya tam olarak ne istediğinizi (sınıf seviyesi, konu, problem sayısı vb.) açıkça belirttiğinizden emin olun.";
        }
        if (settings.sourceModule && settings.sourceModule !== 'none') {
             const moduleName = TABS.find(tab => tab.id === settings.sourceModule)?.label || 'seçili modül';
             return `'${moduleName}' modülünü seçtiniz. Yapay zeka, bu modülün konusuyla ilgili problemler üretecektir. 'Konu Detayı' alanına ek anahtar kelimeler girerek (örn: 'pasta dilimleri') senaryoları daha da özelleştirebilirsiniz.`;
        }
        return "Bu modül, Google Gemini AI kullanarak tamamen size özel problemler üretir. 'Problem Modülü' seçerek belirli bir konuya odaklanabilir veya 'Özel Talimat' alanına hayalinizdeki problemi yazarak yaratıcılığınızı kullanabilirsiniz.";
    };
    
    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
             <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Problemler (AI)</h2>
                <HintButton text={getHintText()} />
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
                Bu modül, Google Gemini AI kullanarak özel matematik problemleri oluşturur. Lütfen API anahtarınızın doğru yapılandırıldığından emin olun.
            </p>
            
            <div className="grid grid-cols-1 gap-2">
                <div className="p-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                        label="Otomatik Sığdır"
                        id="auto-fit-word-problems"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                        disabled={isTableLayout}
                        title={isTableLayout ? "Tablo modunda bu ayar devre dışıdır." : ""}
                    />
                </div>
                 <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
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


            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
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
                 <Select
                    label="Problem Formatı"
                    id="problem-layout"
                    value={settings.layout || 'default'}
                    onChange={e => handleSettingChange('layout', e.target.value)}
                    options={[
                        { value: 'default', label: 'Standart' },
                        { value: 'with-visual-space', label: 'Çizim Alanı Ekle' },
                        { value: 'given-wanted', label: 'Verilen/İstenen/Çözüm' },
                    ]}
                    containerClassName="col-span-2"
                />
                <div className="col-span-2 grid grid-cols-2 gap-2">
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
                            className="absolute right-2.5 bottom-[5px] text-stone-500 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors"
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
                    disabled={settings.autoFit || isTableLayout}
                    title={isTableLayout ? "Tablo modunda problem sayısı satır ve sütun sayısına göre belirlenir." : ""}
                />
                 <NumberInput
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value, 10))}
                    disabled={isTableLayout}
                    title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}
                />
                <div className="col-span-2 pt-1">
                     <label htmlFor="custom-prompt" className="font-medium text-xs text-stone-700 dark:text-stone-300 mb-1 block">Veya Özel Talimat Girin</label>
                     <textarea
                        id="custom-prompt"
                        rows={3}
                        className="block w-full px-2 py-0.5 text-xs bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600"
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
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => handleGenerate(true)} size="sm">Oluştur (Temizle)</Button>
                <Button onClick={() => handleGenerate(true)} variant="secondary" title="Ayarları koruyarak soruları yenile" size="sm">
                    <ShuffleIcon className="w-4 h-4" />
                    Yenile
                </Button>
                <Button onClick={() => handleGenerate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default WordProblemsModule;