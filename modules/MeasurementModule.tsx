import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateMeasurementProblem } from '../services/measurementService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, MeasurementSettings, MeasurementProblemType, Difficulty } from '../types';
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

const MeasurementModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
    const [settings, setSettings] = useState<MeasurementSettings>({
        gradeLevel: 2,
        type: MeasurementProblemType.Mixed,
        difficulty: 'easy',
        problemsPerPage: 20,
        pageCount: 1,
        useWordProblems: false,
        autoFit: true,
        useVisuals: false,
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
                const problems = await generateContextualWordProblems('measurement', adjustedSettings);
                const typeNames: { [key: string]: string } = { 'length-conversion': 'Uzunluk', 'weight-conversion': 'Ağırlık', 'volume-conversion': 'Hacim', 'mixed': 'Karışık Ölçüler' };
                const title = `Gerçek Hayat Problemleri - ${typeNames[settings.type]}`;
                onGenerate(problems, clearPrevious, title, 'measurement', settings.pageCount);
                addToast(`${problems.length} problem başarıyla oluşturuldu!`, 'success');
            } else {
                const results = Array.from({ length: totalCount }, () => generateMeasurementProblem(settings));
                if (results.length > 0) {
                    const problems = results.map(r => r.problem);
                    const title = results[0].title;
                    onGenerate(problems, clearPrevious, title, 'measurement', settings.pageCount);
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
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'measurement') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule]);

    // Live update on settings change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (lastGeneratorModule === 'measurement') {
            const handler = setTimeout(() => {
                handleGenerate(true);
            }, 300); // Debounce to prevent rapid updates

            return () => clearTimeout(handler);
        }
    }, [settings, printSettings, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof MeasurementSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<MeasurementSettings> = { gradeLevel: grade };

        switch (grade) {
            case 2:
                newSettings.difficulty = 'easy';
                break;
            case 3:
                newSettings.difficulty = 'medium';
                break;
            case 4:
            case 5:
                newSettings.difficulty = 'hard';
                break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Ölçüler Ayarları</h2>

            <div className="grid grid-cols-1 gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <Checkbox
                        label="Gerçek Hayat Problemleri (AI)"
                        id="use-word-problems-measurement"
                        checked={!!settings.useWordProblems}
                        onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                    />
                     {settings.useWordProblems && (
                        <div className="mt-4 pl-6">
                             <Checkbox
                                label="Görsel Destek Ekle (Emoji)"
                                id="use-visuals-measurement"
                                checked={settings.useVisuals ?? false}
                                onChange={e => handleSettingChange('useVisuals', e.target.checked)}
                            />
                        </div>
                    )}
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                        label="Otomatik Sığdır"
                        id="auto-fit-measurement"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Sınıf Düzeyi"
                    id="measurement-grade-level"
                    value={settings.gradeLevel}
                    onChange={handleGradeLevelChange}
                    options={[
                        { value: 2, label: '2. Sınıf' },
                        { value: 3, label: '3. Sınıf' },
                        { value: 4, label: '4. Sınıf' },
                        { value: 5, label: '5. Sınıf' },
                    ]}
                />
                 <Select
                    label="Zorluk"
                    id="measurement-difficulty"
                    value={settings.difficulty}
                    onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                    options={[
                        { value: 'easy', label: 'Kolay (Tam Sayılar)' },
                        { value: 'medium', label: 'Orta (Ondalıklı Sayılar)' },
                        { value: 'hard', label: 'Zor (Karışık Birimler)' },
                        { value: 'mixed', label: 'Karışık (Tümü)' },
                    ]}
                />
                <Select
                    label="Problem Türü"
                    id="measurement-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as MeasurementProblemType)}
                    options={[
                        { value: MeasurementProblemType.Mixed, label: 'Karışık (Tümü)' },
                        { value: MeasurementProblemType.LengthConversion, label: 'Uzunluk (km, m, cm)' },
                        { value: MeasurementProblemType.WeightConversion, label: 'Ağırlık (t, kg, g)' },
                        { value: MeasurementProblemType.VolumeConversion, label: 'Hacim (L, mL)' },
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
             <SettingsPresetManager 
                moduleKey="measurement"
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

export default MeasurementModule;