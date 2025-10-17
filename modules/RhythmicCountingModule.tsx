import React, { useState, useEffect, useCallback } from 'react';
import { generateRhythmicCountingProblem } from '../services/rhythmicCountingService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, RhythmicCountingSettings, RhythmicProblemType } from '../types';
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

const RhythmicCountingModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<RhythmicCountingSettings>({
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
        problemsPerPage: 15,
        pageCount: 1,
        autoFit: true,
        useWordProblems: false,
        gradeLevel: 2,
        orderDirection: 'ascending',
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const { settings: printSettings } = usePrintSettings();

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsGenerating(true);
        setIsLoading(true);
        try {
            let problems: Problem[] = [];
            let title = '';

            const isPracticeSheet = ['PracticeSheet', 'FillBeforeAfter', 'FillBetween'].includes(settings.type);
            const problemCount = isPracticeSheet ? 1 : (settings.autoFit ? calculateMaxProblems(contentRef, printSettings) : settings.problemsPerPage * settings.pageCount);

            if (settings.useWordProblems) {
                problems = await generateContextualWordProblems('rhythmic-counting', { ...settings, problemsPerPage: problemCount, pageCount: 1 });
                title = 'Ritmik Sayma Problemleri (AI)';
            } else {
                const results = Array.from({ length: problemCount }, () => generateRhythmicCountingProblem(settings));
                if (results.some(r => r.error)) {
                    const error = results.find(r => r.error)?.error;
                    alert(error);
                }
                problems = results.map(r => r.problem);
                title = results.length > 0 ? results[0].title : '';
            }
            
            if (problems.length > 0) {
                onGenerate(problems, clearPrevious, title, 'rhythmic-counting', settings.pageCount);
            }
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'rhythmic-counting') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof RhythmicCountingSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const showPatternSettings = settings.type === RhythmicProblemType.Pattern || settings.type === RhythmicProblemType.FindRule;
    const isPracticeSheet = ['PracticeSheet', 'FillBeforeAfter', 'FillBetween'].includes(settings.type);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Ritmik Sayma Ayarları</h2>
            <Select
                label="Problem Türü"
                id="rhythmic-type"
                value={settings.type}
                onChange={e => handleSettingChange('type', e.target.value as RhythmicProblemType)}
                options={[
                    { value: RhythmicProblemType.PracticeSheet, label: 'Alıştırma Kağıdı' },
                    { value: RhythmicProblemType.FillBeforeAfter, label: 'Öncesini/Sonrasını Doldur' },
                    { value: RhythmicProblemType.FillBetween, label: 'Arasını Doldur' },
                    { value: RhythmicProblemType.Pattern, label: 'Örüntü Tamamlama' },
                    { value: RhythmicProblemType.FindRule, label: 'Örüntü Kuralı Bulma' },
                    { value: RhythmicProblemType.OddEven, label: 'Tek / Çift' },
                    { value: RhythmicProblemType.Ordering, label: 'Sıralama' },
                    { value: RhythmicProblemType.Comparison, label: 'Karşılaştırma' },
                ]}
            />

            {!isPracticeSheet && !['OddEven', 'Ordering', 'Comparison'].includes(settings.type) && (
                 <Checkbox label="Gerçek Hayat Problemleri (AI)" id="use-word-problems" checked={settings.useWordProblems} onChange={e => handleSettingChange('useWordProblems', e.target.checked)} />
            )}
           
            <div className="grid grid-cols-2 gap-4">
                <NumberInput label="Adım" id="step" min={1} max={100} value={settings.step} onChange={e => handleSettingChange('step', parseInt(e.target.value))} />
                <Select
                    label="Yön"
                    id="direction"
                    value={settings.direction}
                    onChange={e => handleSettingChange('direction', e.target.value as 'forward' | 'backward' | 'mixed')}
                    options={[{ value: 'forward', label: 'İleri' }, { value: 'backward', label: 'Geri' }, { value: 'mixed', label: 'Karışık' }]}
                />
                <NumberInput label="Min Değer" id="min" min={0} max={9999} value={settings.min} onChange={e => handleSettingChange('min', parseInt(e.target.value))} />
                <NumberInput label="Max Değer" id="max" min={1} max={10000} value={settings.max} onChange={e => handleSettingChange('max', parseInt(e.target.value))} />
            </div>

             {showPatternSettings && (
                 <div className="grid grid-cols-2 gap-4">
                    <NumberInput label="Örüntü Uzunluğu" id="pattern-length" min={3} max={10} value={settings.patternLength} onChange={e => handleSettingChange('patternLength', parseInt(e.target.value))} />
                    <NumberInput label="Eksik Sayısı" id="missing-count" min={1} max={5} value={settings.missingCount} onChange={e => handleSettingChange('missingCount', parseInt(e.target.value))} />
                </div>
            )}

            {!isPracticeSheet && (
                <>
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={settings.autoFit} />
                    <NumberInput label="Problem Sayısı" id="problems-per-page" min={1} max={100} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={settings.autoFit} />
                </div>
                <Checkbox label="Otomatik Sığdır" id="auto-fit" checked={settings.autoFit} onChange={e => handleSettingChange('autoFit', e.target.checked)} />
                </>
            )}

            <Button onClick={() => handleGenerate(true)} className="w-full" disabled={isGenerating}>
                {isGenerating && <LoadingIcon className="w-5 h-5" />}
                Oluştur
            </Button>
             <SettingsPresetManager
                moduleKey="rhythmic-counting"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default RhythmicCountingModule;
