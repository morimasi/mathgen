import React, { useState, useEffect, useCallback } from 'react';
import { generateTimeProblem } from '../services/timeService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, TimeSettings, TimeProblemType, Difficulty } from '../types';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { LoadingIcon } from '../components/icons/Icons';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const TimeModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<TimeSettings>({
        type: TimeProblemType.ReadClock,
        difficulty: 'easy',
        format: '24h',
        problemsPerPage: 12,
        pageCount: 1,
        showClockNumbers: true,
        showHourHand: true,
        showMinuteHand: true,
        showDigitalTime: false,
        showMinuteMarkers: true,
        useWordProblems: false,
        autoFit: true,
        gradeLevel: 3,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const { settings: printSettings } = usePrintSettings();

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsGenerating(true);
        setIsLoading(true);
        try {
            let problems: Problem[] = [];
            let title = '';

            const problemCount = settings.autoFit
                ? calculateMaxProblems(contentRef, printSettings)
                : settings.problemsPerPage * settings.pageCount;

            if (settings.useWordProblems) {
                problems = await generateContextualWordProblems('time', { ...settings, problemsPerPage: problemCount, pageCount: 1 });
                title = 'Zaman Problemleri (AI)';
            } else {
                const results = Array.from({ length: problemCount }, () => generateTimeProblem(settings));
                problems = results.map(r => r.problem);
                title = results.length > 0 ? results[0].title : '';
            }

            if (problems.length > 0) {
                onGenerate(problems, clearPrevious, title, 'time', settings.pageCount);
            }
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'time') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof TimeSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const isReadClock = settings.type === TimeProblemType.ReadClock;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Zaman Ölçme Ayarları</h2>
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
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Zorluk"
                    id="time-difficulty"
                    value={settings.difficulty}
                    onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                    options={[
                        { value: 'easy', label: 'Kolay (Tam Saatler)' },
                        { value: 'medium', label: 'Orta (Çeyrek/Yarım)' },
                        { value: 'hard', label: 'Zor (Dakikalı)' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <Select
                    label="Saat Formatı"
                    id="time-format"
                    value={settings.format}
                    onChange={e => handleSettingChange('format', e.target.value as '12h' | '24h')}
                    options={[
                        { value: '24h', label: '24 Saat' },
                        { value: '12h', label: '12 Saat (ÖÖ/ÖS)' },
                    ]}
                />
            </div>
            
            {isReadClock && (
                <div className="p-2 border rounded-md border-stone-200 dark:border-stone-700 space-y-2">
                    <h3 className="text-xs font-semibold">Analog Saat Özelleştirme</h3>
                    <div className="grid grid-cols-2 gap-2">
                         <Checkbox label="Sayıları Göster" id="show-clock-numbers" checked={settings.showClockNumbers} onChange={e => handleSettingChange('showClockNumbers', e.target.checked)} />
                        <Checkbox label="Akrep" id="show-hour-hand" checked={settings.showHourHand} onChange={e => handleSettingChange('showHourHand', e.target.checked)} />
                        <Checkbox label="Yelkovan" id="show-minute-hand" checked={settings.showMinuteHand} onChange={e => handleSettingChange('showMinuteHand', e.target.checked)} />
                        <Checkbox label="Dakika İşaretleri" id="show-minute-markers" checked={settings.showMinuteMarkers} onChange={e => handleSettingChange('showMinuteMarkers', e.target.checked)} />
                        <Checkbox label="Dijital Saati Göster" id="show-digital-time" checked={settings.showDigitalTime} onChange={e => handleSettingChange('showDigitalTime', e.target.checked)} />
                    </div>
                </div>
            )}

            <Checkbox label="Gerçek Hayat Problemleri (AI)" id="use-word-problems" checked={settings.useWordProblems} onChange={e => handleSettingChange('useWordProblems', e.target.checked)} />
            
            <div className="grid grid-cols-2 gap-4">
                <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={settings.autoFit} />
                <NumberInput label="Problem Sayısı" id="problems-per-page" min={1} max={100} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={settings.autoFit} />
            </div>
            <Checkbox label="Otomatik Sığdır" id="auto-fit" checked={settings.autoFit} onChange={e => handleSettingChange('autoFit', e.target.checked)} />
            
            <Button onClick={() => handleGenerate(true)} className="w-full" disabled={isGenerating}>
                {isGenerating && <LoadingIcon className="w-5 h-5" />}
                Oluştur
            </Button>

            <SettingsPresetManager
                moduleKey="time"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default TimeModule;
