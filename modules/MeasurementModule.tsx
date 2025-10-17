import React, { useState, useEffect, useCallback } from 'react';
import { generateMeasurementProblem } from '../services/measurementService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, MeasurementSettings, MeasurementProblemType, Difficulty } from '../types';
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

const MeasurementModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<MeasurementSettings>({
        type: MeasurementProblemType.Mixed,
        difficulty: 'easy',
        problemsPerPage: 20,
        pageCount: 1,
        autoFit: true,
        useWordProblems: false,
        gradeLevel: 4,
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
                problems = await generateContextualWordProblems('measurement', { ...settings, problemsPerPage: problemCount, pageCount: 1 });
                title = 'Ölçü Problemleri (AI)';
            } else {
                const results = Array.from({ length: problemCount }, () => generateMeasurementProblem(settings));
                problems = results.map(r => r.problem);
                title = results.length > 0 ? results[0].title : '';
            }

            if (problems.length > 0) {
                onGenerate(problems, clearPrevious, title, 'measurement', settings.pageCount);
            }
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'measurement') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof MeasurementSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Ölçüler Ayarları</h2>
            <Select
                label="Ölçü Türü"
                id="measurement-type"
                value={settings.type}
                onChange={e => handleSettingChange('type', e.target.value as MeasurementProblemType)}
                options={[
                    { value: MeasurementProblemType.Mixed, label: 'Karışık Dönüşümler' },
                    { value: MeasurementProblemType.LengthConversion, label: 'Uzunluk (km, m, cm)' },
                    { value: MeasurementProblemType.WeightConversion, label: 'Ağırlık (t, kg, g)' },
                    { value: MeasurementProblemType.VolumeConversion, label: 'Hacim (L, mL)' },
                ]}
            />
            <Select
                label="Zorluk Seviyesi"
                id="measurement-difficulty"
                value={settings.difficulty}
                onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                options={[
                    { value: 'easy', label: 'Kolay (Tam Sayılar)' },
                    { value: 'medium', label: 'Orta (Ondalıklı Sayılar)' },
                    { value: 'hard', label: 'Zor (Karışık Birimler)' },
                    { value: 'mixed', label: 'Karışık Zorluk' },
                ]}
            />
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
                moduleKey="measurement"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default MeasurementModule;
