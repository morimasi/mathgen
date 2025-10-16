import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateRhythmicCountingProblem } from '../services/rhythmicCountingService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, RhythmicCountingSettings, RhythmicProblemType } from '../types';
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

const RhythmicCountingModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
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
        autoFit: true,
    });
    const isInitialMount = useRef(true);

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsLoading(true);
        try {
            const isSheet = [RhythmicProblemType.PracticeSheet, RhythmicProblemType.FillBeforeAfter, RhythmicProblemType.FillBetween].includes(settings.type);
            let totalCount;
            const isTableLayout = printSettings.layoutMode === 'table';

            if (isTableLayout) {
                totalCount = printSettings.rows * printSettings.columns;
            } else if (settings.autoFit && !isSheet) {
                const problemsPerPage = calculateMaxProblems(contentRef, printSettings) || settings.problemsPerPage;
                totalCount = problemsPerPage * settings.pageCount;
            } else {
                 totalCount = settings.problemsPerPage * settings.pageCount;
            }

             if (settings.useWordProblems && settings.type === RhythmicProblemType.Pattern) {
                const adjustedSettings = { ...settings, problemsPerPage: totalCount, pageCount: 1 };
                const problems = await generateContextualWordProblems('rhythmic-counting', adjustedSettings);
                const title = `Gerçek Hayat Problemleri - Ritmik Sayma`;
                onGenerate(problems, clearPrevious, title, 'rhythmic-counting', settings.pageCount);
                addToast(`${problems.length} problem başarıyla oluşturuldu!`, 'success');
            } else {
                const generationCount = isSheet ? settings.pageCount : totalCount;

                const results = Array.from({ length: generationCount }, () => generateRhythmicCountingProblem(settings));
                
                const firstResultWithError = results.find(r => (r as any).error);
                if (firstResultWithError) {
                    addToast((firstResultWithError as any).error, 'error');
                } else if (results.length > 0) {
                    const problems = results.map(r => r.problem);
                    const title = results[0].title;
                    onGenerate(problems, clearPrevious, title, 'rhythmic-counting', isTableLayout ? 1 : settings.pageCount);
                    addToast(isSheet ? `${results.length} sayfa başarıyla oluşturuldu!` : `${problems.length} problem başarıyla oluşturuldu!`, 'success');
                }
            }
        } catch (error: any) {
            console.error(error);
            addToast(error.message || "Problem oluşturulurken bir hata oluştu.", 'error');
        }
        setIsLoading(false);
    }, [settings, printSettings, contentRef, onGenerate, setIsLoading, addToast]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'rhythmic-counting') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    // Live update on settings change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (lastGeneratorModule === 'rhythmic-counting') {
            const handler = setTimeout(() => {
                handleGenerate(true);
            }, 300); // Debounce to prevent rapid updates

            return () => clearTimeout(handler);
        }
    }, [settings, printSettings, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof RhythmicCountingSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
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
    const isPracticeSheet = [RhythmicProblemType.PracticeSheet, RhythmicProblemType.FillBeforeAfter, RhythmicProblemType.FillBetween].includes(settings.type);
    const isTableLayout = printSettings.layoutMode === 'table';

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Ritmik Sayma Ayarları</h2>
            
            <div className="grid grid-cols-2 gap-4">
                {showPattern && (
                     <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Checkbox
                            label="Gerçek Hayat Problemleri (AI)"
                            id="use-word-problems-rhythmic"
                            checked={settings.useWordProblems}
                            onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                        />
                    </div>
                )}
                 <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                        label="Otomatik Sığdır"
                        id="auto-fit-rhythmic"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                        disabled={isPracticeSheet || isTableLayout}
                        title={isPracticeSheet ? "Alıştırma kağıtları her zaman tüm sayfayı doldurur." : (isTableLayout ? "Tablo modunda bu ayar devre dışıdır." : "")}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Select
                    label="Problem Türü"
                    id="rhythmic-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as RhythmicProblemType)}
                    options={[
                        { value: RhythmicProblemType.Pattern, label: 'Örüntü Tamamlama' },
                        { value: RhythmicProblemType.FindRule, label: 'Örüntü Kuralı Bulma' },
                        { value: RhythmicProblemType.PracticeSheet, label: 'Alıştırma Kağıdı (3+Boşluk)' },
                        { value: RhythmicProblemType.FillBeforeAfter, label: 'Alıştırma Kağıdı (Önce/Sonra)' },
                        { value: RhythmicProblemType.FillBetween, label: 'Alıştırma Kağıdı (Arası)' },
                        { value: RhythmicProblemType.OddEven, label: 'Tek / Çift' },
                        { value: RhythmicProblemType.Ordering, label: 'Sıralama' },
                    ]}
                />
                 <Select
                    label="Sınıf Düzeyi"
                    id="rhythmic-grade-level"
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
                {showStep && (
                    <NumberInput label="Adım" id="rhythmic-step" value={settings.step} onChange={e => handleSettingChange('step', parseInt(e.target.value))} />
                )}
                 {showStep && (
                    <Select label="Yön" id="rhythmic-direction" value={settings.direction} onChange={e => handleSettingChange('direction', e.target.value as 'forward' | 'backward' | 'mixed')}
                        options={[
                            { value: 'forward', label: 'İleri' },
                            { value: 'backward', label: 'Geri' },
                            { value: 'mixed', label: 'Karışık' },
                        ]}
                    />
                )}
                {showRange && (
                    <>
                    <NumberInput label="Min Değer" id="rhythmic-min" value={settings.min} onChange={e => handleSettingChange('min', parseInt(e.target.value))} disabled={settings.useWordProblems} />
                    <NumberInput label="Max Değer" id="rhythmic-max" value={settings.max} onChange={e => handleSettingChange('max', parseInt(e.target.value))} disabled={settings.useWordProblems} />
                    </>
                )}
                {showPattern && (
                    <>
                    <NumberInput label="Örüntü Uzunluğu" id="pattern-length" value={settings.patternLength} onChange={e => handleSettingChange('patternLength', parseInt(e.target.value))} disabled={settings.useWordProblems} />
                    <NumberInput label="Eksik Sayısı" id="missing-count" value={settings.missingCount} onChange={e => handleSettingChange('missingCount', parseInt(e.target.value))} disabled={settings.useWordProblems} />
                    </>
                )}
                 {!isPracticeSheet && (
                     <NumberInput 
                        label="Sayfa Başına Problem Sayısı" 
                        id="problems-per-page" 
                        min={1} max={100} 
                        value={settings.problemsPerPage} 
                        onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} 
                        disabled={settings.autoFit || isTableLayout}
                        title={isTableLayout ? "Tablo modunda problem sayısı satır ve sütun sayısına göre belirlenir." : ""}
                     />
                 )}
                 <NumberInput 
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                    disabled={isTableLayout}
                    title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}
                />
                 {showStep && (
                    <div className="flex items-center pt-5">
                        <Checkbox label="Sadece Katları Kullan" id="use-multiples" checked={settings.useMultiplesOnly} onChange={e => handleSettingChange('useMultiplesOnly', e.target.checked)} disabled={settings.useWordProblems} />
                    </div>
                 )}
            </div>
             <SettingsPresetManager 
                moduleKey="rhythmic-counting"
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

export default RhythmicCountingModule;