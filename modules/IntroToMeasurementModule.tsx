import React, { useState, useEffect, useCallback } from 'react';
import { generateIntroToMeasurementProblem } from '../services/readinessService';
import { Problem, IntroToMeasurementSettings, IntroMeasurementType, MathReadinessTheme } from '../types';
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

const IntroToMeasurementModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<IntroToMeasurementSettings>({
        type: IntroMeasurementType.CompareLength,
        theme: 'mixed',
        difficulty: 'easy',
        problemsPerPage: 4,
        pageCount: 1,
        autoFit: true,
        useWordProblems: false,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const { settings: printSettings } = usePrintSettings();

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsGenerating(true);
        setIsLoading(true);
        try {
            const problemCount = settings.autoFit
                ? calculateMaxProblems(contentRef, printSettings, { question: '<svg height="100"></svg>' })
                : settings.problemsPerPage * settings.pageCount;
            
            const results = Array.from({ length: problemCount }, () => generateIntroToMeasurementProblem(settings));
            const problems = results.map(r => r.problem);
            const title = results.length > 0 ? results[0].title : '';

            onGenerate(problems, clearPrevious, title, 'intro-to-measurement', settings.pageCount);
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'intro-to-measurement') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof IntroToMeasurementSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };
    
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Ölçmeye Giriş</h2>
            <Select
                label="Problem Türü"
                id="intro-measure-type"
                value={settings.type}
                onChange={e => handleSettingChange('type', e.target.value as IntroMeasurementType)}
                options={[
                    { value: IntroMeasurementType.CompareLength, label: 'Uzunluk Karşılaştırma' },
                    { value: IntroMeasurementType.CompareWeight, label: 'Ağırlık Karşılaştırma' },
                    { value: IntroMeasurementType.CompareCapacity, label: 'Kapasite Karşılaştırma' },
                    { value: IntroMeasurementType.NonStandardLength, label: 'Standart Olmayan Ölçüm' },
                ]}
            />
            <Select
                label="Tema"
                id="intro-measure-theme"
                value={settings.theme}
                onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                options={[
                    { value: 'mixed', label: 'Karışık' },
                    { value: 'animals', label: 'Hayvanlar' },
                    { value: 'vehicles', label: 'Taşıtlar' },
                    { value: 'fruits', label: 'Meyveler' },
                ]}
            />
             <Select
                label="Zorluk"
                id="intro-measure-difficulty"
                value={settings.difficulty}
                onChange={e => handleSettingChange('difficulty', e.target.value as 'easy' | 'medium')}
                options={[
                    { value: 'easy', label: 'Kolay' },
                    { value: 'medium', label: 'Orta' },
                ]}
            />
            
             <div className="grid grid-cols-2 gap-4">
                <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={settings.autoFit} />
                <NumberInput label="Problem Sayısı / Sayfa" id="problems-per-page" min={1} max={10} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={settings.autoFit} />
            </div>
            <Checkbox label="Otomatik Sığdır" id="auto-fit" checked={settings.autoFit} onChange={e => handleSettingChange('autoFit', e.target.checked)} />

            <Button onClick={() => handleGenerate(true)} className="w-full" disabled={isGenerating}>
                 {isGenerating && <LoadingIcon className="w-5 h-5" />}
                Oluştur
            </Button>
            <SettingsPresetManager
                moduleKey="intro-to-measurement"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default IntroToMeasurementModule;
