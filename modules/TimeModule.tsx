import React, { useState } from 'react';
import { generateTimeProblem } from '../services/timeService';
import { generateContextualWordProblems } from '../services/geminiService';
import { TimeSettings, TimeProblemType, Difficulty } from '../types';
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

const TimeModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<TimeSettings>({
        gradeLevel: 2,
        type: TimeProblemType.ReadClock,
        difficulty: 'medium',
        format: '24h',
        problemsPerPage: 12,
        pageCount: 1,
        showClockNumbers: true,
        showHourHand: true,
        showMinuteHand: true,
        useWordProblems: false,
        showDigitalTime: true,
        showMinuteMarkers: true,
        topic: '',
        autoFit: true,
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'time',
        settings,
        generatorFn: generateTimeProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Gerçek Hayat Problemleri - Zaman Ölçme'
    });

    const handleSettingChange = (field: keyof TimeSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

     const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<TimeSettings> = { gradeLevel: grade };

        switch (grade) {
            case 1:
                newSettings.difficulty = 'easy';
                break;
            case 2:
                newSettings.difficulty = 'medium';
                break;
            case 3:
            case 4:
            case 5:
                newSettings.difficulty = 'hard';
                break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const isReadClock = settings.type === TimeProblemType.ReadClock;
    const isWordProblemCompatible = [
        TimeProblemType.CalculateDuration,
        TimeProblemType.CalculateEndTime,
        TimeProblemType.FindStartTime
    ].includes(settings.type);
    const isTableLayout = printSettings.layoutMode === 'table';

    const getHintText = () => {
        if (isReadClock) {
            return "'Analog Saat Özelleştirme' bölümü ile saat üzerindeki sayıları, akrebi veya yelkovanı gizleyerek farklı zorluk seviyelerinde okuma alıştırmaları oluşturabilirsiniz.";
        }
        if (isWordProblemCompatible) {
            return "AI destekli gerçek hayat problemleri, öğrencilerin zaman hesaplamalarını (süre, bitiş/başlangıç zamanı) günlük yaşam senaryoları üzerinden anlamalarına yardımcı olur.";
        }
        if (settings.type === TimeProblemType.ConvertUnits) {
            return "Bu etkinlik, saat-dakika, gün-hafta gibi zaman birimleri arasında dönüşüm alıştırmaları üretir. Farklı sınıf seviyeleri için uygundur.";
        }
        return "'Zorluk' ayarı, saat problemlerinin hassasiyetini belirler: Kolay (tam saatler), Orta (çeyrek/yarım saatler), Zor (tüm dakikalar).";
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Zaman Ölçme Ayarları</h2>
                <HintButton text={getHintText()} />
            </div>

            <div className="space-y-1.5">
                {isWordProblemCompatible && (
                    <details className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg" open={settings.useWordProblems}>
                         <summary className="text-xs font-semibold cursor-pointer select-none">Gerçek Hayat Problemleri (AI)</summary>
                         <div className="mt-2 pl-4 space-y-1.5">
                            <Checkbox
                                label="Yapay Zeka ile Problem Oluştur"
                                id="use-word-problems-time"
                                checked={settings.useWordProblems}
                                onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                            />
                            <div className="relative">
                                <TextInput
                                    label="Problem Konusu (İsteğe bağlı)"
                                    id="time-topic"
                                    value={settings.topic || ''}
                                    onChange={e => handleSettingChange('topic', e.target.value)}
                                    placeholder="Örn: Yolculuk, Film, Fırın"
                                    className="pr-9"
                                />
                                <button type="button" onClick={handleRandomTopic} className="absolute right-2 bottom-[3px] text-stone-500 hover:text-orange-700" title="Rastgele Konu Öner">
                                    <ShuffleIcon className="w-4 h-4" />
                                </button>
                            </div>
                         </div>
                    </details>
                )}

                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                     <Select
                        label="Sınıf Düzeyi"
                        id="time-grade-level"
                        value={settings.gradeLevel}
                        onChange={handleGradeLevelChange}
                        options={[{ value: 1, label: '1. Sınıf' },{ value: 2, label: '2. Sınıf' },{ value: 3, label: '3. Sınıf' },{ value: 4, label: '4. Sınıf' },{ value: 5, label: '5. Sınıf' }]}
                    />
                     <Select
                        label="Zorluk"
                        id="time-difficulty"
                        value={settings.difficulty}
                        onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                        options={[{ value: 'easy', label: 'Kolay (Tam Saatler)' },{ value: 'medium', label: 'Orta (Çeyrek/Yarım Saatler)' },{ value: 'hard', label: 'Zor (Dakikalar)' },{ value: 'mixed', label: 'Karışık' }]}
                    />
                    <Select
                        label="Problem Türü"
                        id="time-type"
                        value={settings.type}
                        onChange={e => handleSettingChange('type', e.target.value as TimeProblemType)}
                        options={[
                            { value: TimeProblemType.ReadClock, label: 'Saat Okuma (Analog)' },
                            { value: TimeProblemType.CalculateDuration, label: 'Süre Hesaplama' },
                            { value: TimeProblemType.CalculateEndTime, label: 'Bitiş Zamanını Bulma' },
                            { value: TimeProblemType.FindStartTime, label: 'Başlangıç Zamanını Bulma' },
                            { value: TimeProblemType.ConvertUnits, label: 'Birim Dönüştürme' },
                            { value: TimeProblemType.Calendar, label: 'Takvim Problemleri' },
                        ]}
                    />
                     <Select
                        label="Saat Formatı"
                        id="time-format"
                        value={settings.format}
                        disabled={settings.useWordProblems}
                        onChange={e => handleSettingChange('format', e.target.value as '12h' | '24h')}
                        options={[{ value: '24h', label: '24 Saat' },{ value: '12h', label: '12 Saat (ÖÖ/ÖS)' }]}
                    />
                </div>
                {isReadClock && (
                    <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg" open>
                        <summary className="text-xs font-semibold cursor-pointer select-none">Analog Saat Özelleştirme</summary>
                         <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                            <Checkbox label="Sayıları Gizle" id="showClockNumbers" checked={!settings.showClockNumbers} onChange={e => handleSettingChange('showClockNumbers', !e.target.checked)} />
                            <Checkbox label="Akrebi Gizle" id="showHourHand" checked={!settings.showHourHand} onChange={e => handleSettingChange('showHourHand', !e.target.checked)} />
                             <Checkbox label="Yelkovanı Gizle" id="showMinuteHand" checked={!settings.showMinuteHand} onChange={e => handleSettingChange('showMinuteHand', !e.target.checked)} />
                            <Checkbox label="Dijital Saati Göster" id="showDigitalTime" checked={settings.showDigitalTime} onChange={e => handleSettingChange('showDigitalTime', e.target.checked)} />
                             <Checkbox label="5'er Dakikaları Göster" id="showMinuteMarkers" checked={settings.showMinuteMarkers} onChange={e => handleSettingChange('showMinuteMarkers', e.target.checked)} />
                         </div>
                    </details>
                )}
                 <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg" open>
                    <summary className="text-xs font-semibold cursor-pointer select-none">Sayfa Düzeni</summary>
                    <div className="mt-2 space-y-2">
                        <Checkbox label="Otomatik Sığdır" id="autoFit-time" checked={settings.autoFit ?? true} onChange={e => handleSettingChange('autoFit', e.target.checked)} disabled={isTableLayout} />
                        <div className="grid grid-cols-2 gap-x-2">
                            <NumberInput label="Sayfa Başına Problem Sayısı" id="problems-per-page" min={1} max={100} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={isTableLayout || settings.autoFit} />
                            <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={isTableLayout} />
                        </div>
                    </div>
                </details>
            </div>
             <SettingsPresetManager moduleKey="time" currentSettings={settings} onLoadSettings={setSettings} />
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => generate(true)} size="sm">Oluştur</Button>
                <Button onClick={() => generate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default TimeModule;