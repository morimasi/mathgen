import React, { useState, useEffect, useCallback } from 'react';
import { generateNumberRecognitionProblem } from '../services/readinessService';
import { Problem, NumberRecognitionSettings, NumberRecognitionType, MathReadinessTheme } from '../types';
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

const NumberRecognitionModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<NumberRecognitionSettings>({
        type: NumberRecognitionType.CountAndWrite,
        theme: 'mixed',
        numberRange: '1-10',
        problemsPerPage: 6,
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
                ? calculateMaxProblems(contentRef, printSettings, { question: '<svg height="80"></svg>' })
                : settings.problemsPerPage * settings.pageCount;
            
            const results = Array.from({ length: problemCount }, () => generateNumberRecognitionProblem(settings));
            const problems = results.map(r => r.problem);
            const title = results.length > 0 ? results[0].title : '';

            onGenerate(problems, clearPrevious, title, 'number-recognition', settings.pageCount);
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'number-recognition') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof NumberRecognitionSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };
    
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Rakam Tanıma ve Sayma</h2>
            <Select
                label="Problem Türü"
                id="number-rec-type"
                value={settings.type}
                onChange={e => handleSettingChange('type', e.target.value as NumberRecognitionType)}
                options={[
                    { value: NumberRecognitionType.CountAndWrite, label: 'Say ve Yaz' },
                    { value: NumberRecognitionType.CountAndColor, label: 'Say ve Boya' },
                    { value: NumberRecognitionType.ConnectTheDots, label: 'Noktaları Birleştir' },
                ]}
            />
            <Select
                label="Tema"
                id="number-rec-theme"
                value={settings.theme}
                onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                options={[
                    { value: 'mixed', label: 'Karışık' },
                    { value: 'animals', label: 'Hayvanlar' },
                    { value: 'vehicles', label: 'Taşıtlar' },
                    { value: 'fruits', label: 'Meyveler' },
                    { value: 'shapes', label: 'Şekiller' },
                ]}
            />
            <Select
                label="Sayı Aralığı"
                id="number-range"
                value={settings.numberRange}
                onChange={e => handleSettingChange('numberRange', e.target.value as '1-5' | '1-10' | '1-20')}
                options={[
                    { value: '1-5', label: '1 - 5' },
                    { value: '1-10', label: '1 - 10' },
                    { value: '1-20', label: '1 - 20' },
                ]}
            />
            
             <div className="grid grid-cols-2 gap-4">
                <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={settings.autoFit} />
                <NumberInput label="Problem Sayısı / Sayfa" id="problems-per-page" min={1} max={20} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={settings.autoFit} />
            </div>
            <Checkbox label="Otomatik Sığdır" id="auto-fit" checked={settings.autoFit} onChange={e => handleSettingChange('autoFit', e.target.checked)} />

            <Button onClick={() => handleGenerate(true)} className="w-full" disabled={isGenerating}>
                 {isGenerating && <LoadingIcon className="w-5 h-5" />}
                Oluştur
            </Button>
            <SettingsPresetManager
                moduleKey="number-recognition"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default NumberRecognitionModule;
