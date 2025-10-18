import React, { useState, useCallback } from 'react';
import { generateReadinessProblem } from '../services/readinessService';
import { generateContextualWordProblems } from '../services/geminiService';
import { IntroToMeasurementSettings, IntroMeasurementType, MathReadinessTheme } from '../types';
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

const IntroToMeasurementModule: React.FC = () => {
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

    const { generate } = useProblemGenerator({
        moduleKey: 'intro-to-measurement',
        settings,
        generatorFn: (s) => generateReadinessProblem('intro-to-measurement', s),
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Yapay Zeka Destekli Ölçme Problemleri'
    });

    const handleSettingChange = (field: keyof IntroToMeasurementSettings, value: any) => {
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
                                onChange={e => handleSettingChange('topic', e.target.