import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateTimeProblem } from '../services/timeService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, TimeSettings, TimeProblemType, Difficulty } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import { ShuffleIcon } from '../components/icons/Icons';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { useToast } from '../services/ToastContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const TimeModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
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
        autoFit: true,
        showDigitalTime: true,
        showMinuteMarkers: true,
    });
    const isInitialMount = useRef(true);

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsLoading(true);
        try {
            let totalCount;
            if (settings.autoFit) {
                const problemsPerPage = calculateMaxProblems(contentRef, printSettings) || settings.problemsPerPage;
                totalCount = problemsPerPage * settings.pageCount;
            } else {
                totalCount = settings.problemsPerPage * settings.pageCount;
            }

            if (settings.useWordProblems) {
                const adjustedSettings = { ...settings, problemsPerPage: totalCount, pageCount: 1 };
                const problems = await generateContextualWordProblems('time', adjustedSettings);
                const typeNames: { [key: string]: string } = { 'calculate-duration': 'Süre Hesaplama', 'calculate-end-time': 'Bitiş Zamanı Bulma', 'find-start-time': 'Başlangıç Zamanı Bulma' };
                const diffNames: { [key: string]: string } = { 'easy': 'Kolay', 'medium': 'Orta', 'hard': 'Zor', 'mixed': 'Karışık' };
                const title = `Gerçek Hayat Problemleri - ${typeNames[settings.type]} (${diffNames[settings.difficulty]})`;
                onGenerate(problems, clearPrevious, title, 'time', settings.pageCount);
                addToast(`${problems.length} problem başarıyla oluşturuldu!`, 'success');
            } else {
                const results = Array.from({ length: totalCount }, () => generateTimeProblem(settings));
                if (results.length > 0) {
                    const problems = results.map(r => r.problem);
                    const title = results[0].title;
                    onGenerate(problems, clearPrevious, title, 'time', settings.pageCount);
                    addToast(`${problems.length} problem başarıyla oluşturuldu!`, 'success');
                }
            }
        } catch (error: any) {
            console.error(error);
            addToast(error.message || "Problem oluşturulurken bir hata oluştu.", 'error');
        }
        setIsLoading(false);
    }, [settings, printSettings, contentRef, onGenerate, setIsLoading, addToast]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'time') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule]);

    // Live update on settings change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (lastGeneratorModule === 'time') {
            const handler = setTimeout(() => {
                handleGenerate(true);
            }, 300); // Debounce to prevent rapid updates

            return () => clearTimeout(handler);
        }
    }, [settings, printSettings, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof TimeSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
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


    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Zaman Ölçme Ayarları</h2>

            <div className="grid grid-cols-2 gap-4">
                {isWordProblemCompatible && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Checkbox
                            label="Gerçek Hayat Problemleri (AI)"
                            id="use-word-problems-time"
                            checked={settings.useWordProblems}
                            onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                        />
                    </div>
                )}
                 <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                        label="Otomatik Sığdır"
                        id="auto-fit-time"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <Select
                    label="Sınıf Düzeyi"
                    id="time-grade-level"
                    value={settings.gradeLevel}
                    onChange={handleGradeLevelChange}
                    options={[
                        { value: 1, label: '1. Sınıf' },
                        { value: 2, label: '2. Sınıf' },
                        { value: 3, label: '3. Sınıf' },
                        { value: 4, label: '4. Sınıf' },
                        { value: 5, label: '5. Sınıf' },
                    ]}
                />
                 <Select
                    label="Zorluk"
                    id="time-difficulty"
                    value={settings.difficulty}
                    onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                    options={[
                        { value: 'easy', label: 'Kolay (Tam Saatler)' },
                        { value: 'medium', label: 'Orta (Çeyrek/Yarım Saatler)' },
                        { value: 'hard', label: 'Zor (Dakikalar)' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
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
                    options={[
                        { value: '24h', label: '24 Saat' },
                        { value: '12h', label: '12 Saat (ÖÖ/ÖS)' },
                    ]}
                />
                <NumberInput 
                    label="Sayfa Başına Problem Sayısı"
                    id="problems-per-page"
                    min={1} max={100}
                    value={settings.problemsPerPage}
                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                    disabled={settings.autoFit}
                />
                <NumberInput 
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                />
            </div>

            {isReadClock && (
                <div className="pt-4 mt-4 border-t border-stone-200 dark:border-stone-700">
                     <h3 className="text-md font-semibold mb-2">Analog Saat Özelleştirme</h3>
                     <div className="flex flex-wrap gap-4">
                        <Checkbox 
                            label="Sayıları Gizle"
                            id="showClockNumbers"
                            checked={!settings.showClockNumbers}
                            onChange={e => handleSettingChange('showClockNumbers', !e.target.checked)}
                        />
                        <Checkbox 
                            label="Akrebi Gizle"
                            id="showHourHand"
                            checked={!settings.showHourHand}
                            onChange={e => handleSettingChange('showHourHand', !e.target.checked)}
                        />
                         <Checkbox 
                            label="Yelkovanı Gizle"
                            id="showMinuteHand"
                            checked={!settings.showMinuteHand}
                            onChange={e => handleSettingChange('showMinuteHand', !e.target.checked)}
                        />
                        <Checkbox 
                            label="Dijital Saati Göster"
                            id="showDigitalTime"
                            checked={settings.showDigitalTime}
                            onChange={e => handleSettingChange('showDigitalTime', e.target.checked)}
                        />
                         <Checkbox 
                            label="5'er Dakikaları Göster"
                            id="showMinuteMarkers"
                            checked={settings.showMinuteMarkers}
                            onChange={e => handleSettingChange('showMinuteMarkers', e.target.checked)}
                        />
                     </div>
                </div>
            )}
             <SettingsPresetManager 
                moduleKey="time"
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

export default TimeModule;