import React, { useState, useEffect, useCallback } from 'react';
import { generateGeometryProblem } from '../services/geometryService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, GeometrySettings, GeometryProblemType, ShapeType } from '../types';
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

const GeometryModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<GeometrySettings>({
        type: GeometryProblemType.Perimeter,
        shape: ShapeType.Rectangle,
        problemsPerPage: 10,
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
                ? calculateMaxProblems(contentRef, printSettings, { question: '<svg height="120"></svg>' })
                : settings.problemsPerPage * settings.pageCount;

            if (settings.useWordProblems) {
                problems = await generateContextualWordProblems('geometry', { ...settings, problemsPerPage: problemCount, pageCount: 1 });
                title = 'Geometri Problemleri (AI)';
            } else {
                const results = Array.from({ length: problemCount }, () => generateGeometryProblem(settings));
                 if (results.some(r => r.error)) {
                    const error = results.find(r => r.error)?.error;
                    alert(error);
                }
                problems = results.map(r => r.problem);
                title = results.length > 0 ? results[0].title : '';
            }

            if (problems.length > 0) {
                onGenerate(problems, clearPrevious, title, 'geometry', settings.pageCount);
            }
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'geometry') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof GeometrySettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const showShapeSelector = settings.type === GeometryProblemType.Perimeter || settings.type === GeometryProblemType.Area;
    
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Geometri Ayarları</h2>
            <Select
                label="Problem Türü"
                id="geometry-type"
                value={settings.type}
                onChange={e => handleSettingChange('type', e.target.value as GeometryProblemType)}
                options={[
                    { value: GeometryProblemType.Perimeter, label: 'Çevre Hesaplama' },
                    { value: GeometryProblemType.Area, label: 'Alan Hesaplama' },
                    { value: GeometryProblemType.ShapeRecognition, label: 'Şekil Tanıma (Sözel)' },
                    { value: GeometryProblemType.AngleInfo, label: 'Açı Türleri' },
                    { value: GeometryProblemType.Symmetry, label: 'Simetri' },
                    { value: GeometryProblemType.SolidRecognition, label: 'Cisim Tanıma (Sözel)' },
                    { value: GeometryProblemType.SolidElements, label: 'Cisimlerin Elemanları' },
                ]}
            />
            {showShapeSelector && (
                 <Select
                    label="Şekil"
                    id="geometry-shape"
                    value={settings.shape}
                    onChange={e => handleSettingChange('shape', e.target.value as ShapeType)}
                    options={[
                        { value: ShapeType.Rectangle, label: 'Dikdörtgen' },
                        { value: ShapeType.Square, label: 'Kare' },
                        { value: ShapeType.Triangle, label: 'Üçgen' },
                        { value: ShapeType.Circle, label: 'Daire' },
                        { value: ShapeType.Parallelogram, label: 'Paralelkenar' },
                        { value: ShapeType.Trapezoid, label: 'Yamuk' },
                        { value: ShapeType.Pentagon, label: 'Düzgün Beşgen' },
                        { value: ShapeType.Hexagon, label: 'Düzgün Altıgen' },
                    ]}
                />
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
                moduleKey="geometry"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default GeometryModule;
