import React, { useState, useCallback } from 'react';
import { generateRhythmicCountingProblem } from '../services/rhythmicCountingService';
import { generateContextualWordProblems } from '../services/geminiService';
import { RhythmicCountingSettings, RhythmicProblemType } from '../types';
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

// FIX: Switched to a named export to resolve a React.lazy type error.
export const RhythmicCountingModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<RhythmicCountingSettings>({
        gradeLevel: 1,
        type: RhythmicProblemType.Pattern,
        step: 2,
        direction: 'forward',
        useMultiplesOnly: false,
        min: 1,
        max: 100,
        patternLength: 5,
        missingCount: 1,
        orderCount: 5,
        orderDigits: 3,
        beforeCount: 3,
        afterCount: 3,
        problemsPerPage: 20,
        pageCount: 1,
        useWordProblems: false,
        topic: '',
        orderDirection: 'ascending',
    });

    const isPracticeSheet = [RhythmicProblemType.PracticeSheet, RhythmicProblemType.FillBeforeAfter, RhythmicProblemType.FillBetween].includes(settings.type);

    const { generate } = useProblemGenerator({
        moduleKey: 'rhythmic-counting',
        settings,
        generatorFn: generateRhythmicCountingProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Gerçek Hayat Problemleri - Ritmik Sayma',
        isPracticeSheet,
    });

    const handleSettingChange = (field: keyof RhythmicCountingSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<RhythmicCountingSettings> = { gradeLevel: grade };

        switch (grade) {
            case 1:
                newSettings.max = 100;
                newSettings.step = 2;
                break;
            case 2:
                newSettings.max = 1000;
                newSettings.step = 3;
                break;
            default:
                newSettings.max = 1000;
                newSettings.step = 5;
                break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const showStep = [RhythmicProblemType.Pattern, RhythmicProblemType.PracticeSheet, RhythmicProblemType.FillBeforeAfter, RhythmicProblemType.FillBetween].includes(settings.type);
    const showRange = [RhythmicProblemType.Pattern, RhythmicProblemType.PracticeSheet, RhythmicProblemType.OddEven, RhythmicProblemType.FillBeforeAfter, RhythmicProblemType.FillBetween].includes(settings.type);
    const showPattern = settings.type === RhythmicProblemType.Pattern;
    const isOrdering = settings.type === RhythmicProblemType.Ordering;
    const isTableLayout = printSettings.layoutMode === 'table';

    const getHintText = () => {
        if (isPracticeSheet) {
            return "'Alıştırma Kağıdı' türleri, tüm sayfayı kaplayan pratik sayfaları oluşturur. 'Otomatik Sığdır' bu modda devre dışıdır. 'Sayfa Sayısı' ile doğrudan kaç sayfa oluşturacağınızı belirlersiniz.";
        }
        if (isOrdering) {
            return "'Sıralama' etkinliği, karışık olarak verilen sayıların küçükten büyüğe veya büyükten küçüğe sıralanmasını ister. Sayıların basamak sayısını 'Sınıf Düzeyi' ile ayarlayabilirsiniz.";
        }
        if (showPattern) {
             return "'Örüntü Tamamlama' için 'Adım' sayısını (örn: 5'er), 'Yön'ü (ileri/geri) ve sayıların 'Min/Max' aralığını belirleyebilirsiniz. 'Sadece Katları Kullan' seçeneği, örüntünün her zaman adımın bir katıyla başlamasını sağlar.";
        }
        return "Ritmik sayma ve sayı örüntüleri becerilerini geliştirmek için çeşitli problem türleri sunar. 'Alıştırma Kağıdı' seçenekleri, hızlıca ödev hazırlamak için idealdir.";
    };

    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Ritmik Sayma Ayarları</h2>
                <HintButton text={getHintText()} />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
                {showPattern && (
                     <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Checkbox
                            label="Gerçek Hayat Problemleri (AI)"
                            id="use-word-problems-rhythmic"
                            checked={settings.useWordProblems}
                            onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                        />
                         {settings.useWordProblems && (
                            <div className="mt-1.5 pl-6">
                                <div className="relative">
                                     <TextInput
                                        label="Problem Konusu (İsteğe bağlı)"
                                        id="rhythmic-topic"
                                        value={settings.topic || ''}
                                        onChange={e => handleSettingChange('topic', e.target.value)}
                                        placeholder="Örn: