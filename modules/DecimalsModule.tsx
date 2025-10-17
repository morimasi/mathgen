import React, { useState, useEffect, useCallback } from 'react';
import { generateDecimalProblem } from '../services/mathService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, DecimalsSettings, DecimalsProblemType, DecimalsOperation, Difficulty } from '../types';
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

const DecimalsModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<DecimalsSettings>({
        type: DecimalsProblemType.FourOperations,
        operation: DecimalsOperation.Addition,
        difficulty: 'easy',
        problemsPerPage: 20,
        pageCount: 1,
        autoFit: true,
        useWordProblems: false,
        operationCount: 1,
        gradeLevel: 5,
        format: 'inline',
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
                problems = await generateContextualWordProblems('decimals', { ...settings, problemsPerPage: problemCount, pageCount: 1 });
                title = 'Ondalık Sayı Problemleri (AI)';
            } else {
                const results = Array.from({ length: problemCount }, () => generateDecimalProblem(settings));
                problems = results.map(r => r.problem);
                title = results.length > 0 ? results[0].title : '';
            }

            if (problems.length > 0) {
                onGenerate(problems, clearPrevious, title, 'decimals', settings.pageCount);
            }
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'decimals') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof DecimalsSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const isFourOps = settings.type === DecimalsProblemType.FourOperations;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Ondalık Sayılar Ayarları</h2>
            <Select
                label="Problem Türü"
                id="decimals-type"
                value={settings.type}
                onChange={e => handleSettingChange('type', e.target.value as DecimalsProblemType)}
                options={[
                    { value: DecimalsProblemType.FourOperations, label: 'Dört İşlem' },
                    { value: DecimalsProblemType.ReadWrite, label: 'Okuma / Yazma' },
                    { value: DecimalsProblemType.ToFraction, label: 'Kesre Çevirme' },
                ]}
            />
            {isFourOps && (
                <>
                    <Select
                        label="İşlem"
                        id="decimals-operation"
                        value={settings.operation}
                        onChange={e => handleSettingChange('operation', e.target.value as DecimalsOperation)}
                        options={[
                            { value: DecimalsOperation.Addition, label: 'Toplama' },
                            { value: DecimalsOperation.Subtraction, label: 'Çıkarma' },
                            { value: DecimalsOperation.Multiplication, label: 'Çarpma' },
                            { value: DecimalsOperation.Division, label: 'Bölme' },
                            { value: DecimalsOperation.Mixed, label: 'Karışık' },
                        ]}
                    />
                    <Select
                        label="Zorluk"
                        id="decimals-difficulty"
                        value={settings.difficulty}
                        onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                        options={[
                            { value: 'easy', label: 'Kolay' },
                            { value: 'medium', label: 'Orta' },
                            { value: 'hard', label: 'Zor' },
                        ]}
                    />
                </>
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
                moduleKey="decimals"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default DecimalsModule;
