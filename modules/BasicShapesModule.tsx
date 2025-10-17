import React, { useState, useEffect, useCallback } from 'react';
import { generateBasicShapesProblem } from '../services/readinessService';
import { Problem, BasicShapesSettings, ShapeRecognitionType, ShapeType } from '../types';
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

const BasicShapesModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<BasicShapesSettings>({
        type: ShapeRecognitionType.ColorShape,
        shapes: [ShapeType.Circle, ShapeType.Square, ShapeType.Triangle],
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
            
            const results = Array.from({ length: problemCount }, () => generateBasicShapesProblem(settings));
            const problems = results.map(r => r.problem);
            const title = results.length > 0 ? results[0].title : '';

            onGenerate(problems, clearPrevious, title, 'basic-shapes', settings.pageCount);
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'basic-shapes') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof BasicShapesSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleShapeToggle = (shape: ShapeType) => {
        const currentShapes = settings.shapes || [];
        const newShapes = currentShapes.includes(shape)
            ? currentShapes.filter(s => s !== shape)
            : [...currentShapes, shape];
        handleSettingChange('shapes', newShapes);
    };
    
    const shapeOptions = [
        { id: ShapeType.Circle, label: "Daire" },
        { id: ShapeType.Square, label: "Kare" },
        { id: ShapeType.Rectangle, label: "Dikdörtgen" },
        { id: ShapeType.Triangle, label: "Üçgen" },
        { id: ShapeType.Pentagon, label: "Beşgen" },
        { id: ShapeType.Hexagon, label: "Altıgen" },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Temel Geometrik Şekiller</h2>
            <Select
                label="Problem Türü"
                id="shape-rec-type"
                value={settings.type}
                onChange={e => handleSettingChange('type', e.target.value as ShapeRecognitionType)}
                options={[
                    { value: ShapeRecognitionType.ColorShape, label: 'Şekli Boya' },
                    { value: ShapeRecognitionType.MatchObjectShape, label: 'Nesneyi Şekille Eşleştir' },
                    { value: ShapeRecognitionType.CountShapes, label: 'Şekilleri Say' },
                ]}
            />
            <div>
                <label className="font-medium text-xs text-stone-700 dark:text-stone-300 mb-2 block">Kullanılacak Şekiller</label>
                <div className="grid grid-cols-3 gap-2">
                    {shapeOptions.map(shape => (
                        <Checkbox
                            key={shape.id}
                            id={`shape-opt-${shape.id}`}
                            label={shape.label}
                            checked={(settings.shapes || []).includes(shape.id)}
                            onChange={() => handleShapeToggle(shape.id)}
                        />
                    ))}
                </div>
            </div>

             <div className="grid grid-cols-2 gap-4">
                <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={settings.autoFit} />
                <NumberInput label="Problem Sayısı / Sayfa" id="problems-per-page" min={1} max={12} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={settings.autoFit} />
            </div>
            <Checkbox label="Otomatik Sığdır" id="auto-fit" checked={settings.autoFit} onChange={e => handleSettingChange('autoFit', e.target.checked)} />

            <Button onClick={() => handleGenerate(true)} className="w-full" disabled={isGenerating}>
                 {isGenerating && <LoadingIcon className="w-5 h-5" />}
                Oluştur
            </Button>
            <SettingsPresetManager
                moduleKey="basic-shapes"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default BasicShapesModule;
