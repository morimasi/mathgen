import React, { useState, useEffect, useCallback } from 'react';
import { generateFractionsProblem } from '../services/fractionsService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, FractionsSettings, FractionsProblemType, FractionsOperation, Difficulty } from '../types';
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

const FractionsModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<FractionsSettings>({
        type: FractionsProblemType.FourOperations,
        operation: FractionsOperation.Addition,
        difficulty: 'medium',
        problemsPerPage: 20,
        pageCount: 1,
        autoFit: true,
        useWordProblems: false,
        useVisuals: false,
        operationCount: 1,
        gradeLevel: 4,
        maxSetSize: 50,
        format: 'inline',
        useMixedNumbers: true,
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
                problems = await generateContextualWordProblems('fractions', { ...settings, problemsPerPage: problemCount, pageCount: 1 });
                title = 'Kesir Problemleri (AI)';
            } else {
                const results = Array.from({ length: problemCount }, () => generateFractionsProblem(settings));
                 if (results.some(r => r.error)) {
                    const error = results.find(r => r.error)?.error;
                    alert(error);
                }
                problems = results.map(r => r.problem);
                title = results.length > 0 ? results[0].title : '';
            }

            if (problems.length > 0) {
                onGenerate(problems, clearPrevious, title, 'fractions', settings.pageCount);
            }
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'fractions') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof FractionsSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const isFourOps = settings.type === FractionsProblemType.FourOperations;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Kesirler Ayarları</h2>
            <Select
                label="Problem Türü"
                id="fractions-type"
                value={settings.type}
                onChange={e => handleSettingChange('type', e.target.value)}
                options={[
                    { value: FractionsProblemType.FourOperations, label: 'Dört İşlem' },
                    { value: FractionsProblemType.Recognition, label: 'Şekille Gösterme' },
                    { value: FractionsProblemType.Comparison, label: 'Karşılaştırma' },
                    { value: FractionsProblemType.Equivalent, label: 'Denk Kesirler' },
                    { value: FractionsProblemType.FractionOfSet, label: 'Bir Bütünün Kesrini Bulma' },
                ]}
            />
            {isFourOps && (
                <>
                    <Select
                        label="İşlem"
                        id="fractions-operation"
                        value={settings.operation}
                        onChange={e => handleSettingChange('operation', e.target.value as FractionsOperation)}
                        options={[
                            { value: FractionsOperation.Addition, label: 'Toplama' },
                            { value: FractionsOperation.Subtraction, label: 'Çıkarma' },
                            { value: FractionsOperation.Multiplication, label: 'Çarpma' },
                            { value: FractionsOperation.Division, label: 'Bölme' },
                            { value: FractionsOperation.Mixed, label: 'Karışık' },
                        ]}
                    />
                     <Select
                        label="Zorluk"
                        id="fractions-difficulty"
                        value={settings.difficulty}
                        onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                        options={[
                            { value: 'easy', label: 'Kolay (Paydalar Eşit)' },
                            { value: 'medium', label: 'Orta (Paydalar Farklı)' },
                            { value: 'hard', label: 'Zor (Tam Sayılı/Bileşik)' },
                        ]}
                    />
                    <Checkbox label="Tam Sayılı Kesir Kullan" id="use-mixed-numbers" checked={settings.useMixedNumbers} onChange={e => handleSettingChange('useMixedNumbers', e.target.checked)} disabled={settings.difficulty !== 'hard'} />
                </>
            )}
            {settings.type === FractionsProblemType.FractionOfSet && (
                <NumberInput label="En Büyük Bütün Sayısı" id="max-set-size" value={settings.maxSetSize} onChange={e => handleSettingChange('maxSetSize', parseInt(e.target.value))} />
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
                moduleKey="fractions"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default FractionsModule;
