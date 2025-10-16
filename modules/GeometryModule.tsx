import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateGeometryProblem } from '../services/geometryService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, GeometrySettings, GeometryProblemType, ShapeType } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import { ShuffleIcon } from '../components/icons/Icons';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const GeometryModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<GeometrySettings>({
        gradeLevel: 1,
        type: GeometryProblemType.ShapeRecognition,
        shape: ShapeType.Rectangle,
        problemsPerPage: 12,
        pageCount: 1,
        useWordProblems: false,
        autoFit: true,
    });
    const isInitialMount = useRef(true);

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsLoading(true);
        try {
            let totalCount;
            const isTableLayout = printSettings.layoutMode === 'table';

            if (isTableLayout) {
                totalCount = printSettings.rows * printSettings.columns;
            } else if (settings.autoFit) {
                const problemsPerPage = calculateMaxProblems(contentRef, printSettings) || settings.problemsPerPage;
                totalCount = problemsPerPage * settings.pageCount;
            } else {
                totalCount = settings.problemsPerPage * settings.pageCount;
            }

            if (settings.useWordProblems) {
                const adjustedSettings = { ...settings, problemsPerPage: totalCount, pageCount: 1 };
                const problems = await generateContextualWordProblems('geometry', adjustedSettings);
                const typeNames: { [key: string]: string } = { 'perimeter': 'Çevre', 'area': 'Alan' };
                const shapeNames: { [key: string]: string } = { 'square': 'Kare', 'rectangle': 'Dikdörtgen', 'triangle': 'Üçgen', 'circle': 'Daire' };
                const title = `Gerçek Hayat Problemleri - ${shapeNames[settings.shape!]} ${typeNames[settings.type]}`;
                onGenerate(problems, clearPrevious, title, 'geometry', settings.pageCount);
            } else {
                const results = Array.from({ length: totalCount }, () => generateGeometryProblem(settings));
                 
                const firstResultWithError = results.find(r => (r as any).error);
                if (firstResultWithError) {
                    console.error((firstResultWithError as any).error);
                } else if (results.length > 0) {
                    const problems = results.map(r => r.problem);
                    const title = results[0].title;
                    onGenerate(problems, clearPrevious, title, 'geometry', isTableLayout ? 1 : settings.pageCount);
                }
            }
        } catch (error: any) {
            console.error(error);
        }
        setIsLoading(false);
    }, [settings, printSettings, contentRef, onGenerate, setIsLoading]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'geometry') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    // Live update on settings change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (lastGeneratorModule === 'geometry') {
            const handler = setTimeout(() => {
                handleGenerate(true);
            }, 300); // Debounce to prevent rapid updates

            return () => clearTimeout(handler);
        }
    }, [settings, printSettings, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof GeometrySettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<GeometrySettings> = { gradeLevel: grade };

        switch (grade) {
            case 1:
                newSettings = { ...newSettings, type: GeometryProblemType.ShapeRecognition };
                break;
            case 2:
                newSettings = { ...newSettings, type: GeometryProblemType.Perimeter, shape: ShapeType.Rectangle };
                break;
            case 3:
                newSettings = { ...newSettings, type: GeometryProblemType.Area, shape: ShapeType.Square };
                break;
            case 4:
                newSettings = { ...newSettings, type: GeometryProblemType.AngleInfo };
                break;
            case 5:
                newSettings = { ...newSettings, type: GeometryProblemType.SolidRecognition };
                break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const showShapeSelector = [GeometryProblemType.Perimeter, GeometryProblemType.Area].includes(settings.type);
    
    const areaShapes = [
        ShapeType.Square, ShapeType.Rectangle, ShapeType.Triangle, ShapeType.Circle, ShapeType.Parallelogram, ShapeType.Trapezoid
    ];
    const perimeterShapes = Object.values(ShapeType);
    
    const shapeTurkishNames: { [key in ShapeType]: string } = {
        [ShapeType.Square]: 'Kare',
        [ShapeType.Rectangle]: 'Dikdörtgen',
        [ShapeType.Triangle]: 'Üçgen',
        [ShapeType.Circle]: 'Daire',
        [ShapeType.Parallelogram]: 'Paralelkenar',
        [ShapeType.Trapezoid]: 'Yamuk',
        [ShapeType.Pentagon]: 'Beşgen',
        [ShapeType.Hexagon]: 'Altıgen',
    };
    
    const shapeOptions = (settings.type === GeometryProblemType.Area ? areaShapes : perimeterShapes).map(s => ({value: s, label: shapeTurkishNames[s]}));
    const isTableLayout = printSettings.layoutMode === 'table';

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Geometri Ayarları</h2>

            <div className="grid grid-cols-2 gap-4">
                {showShapeSelector && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Checkbox
                            label="Gerçek Hayat Problemleri (AI)"
                            id="use-word-problems-geometry"
                            checked={settings.useWordProblems}
                            onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                        />
                    </div>
                )}
                 <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                        label="Otomatik Sığdır"
                        id="auto-fit-geometry"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                        disabled={isTableLayout}
                        title={isTableLayout ? "Tablo modunda bu ayar devre dışıdır." : ""}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Select
                    label="Sınıf Düzeyi"
                    id="geometry-grade-level"
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
                <Select
                    label="Problem Türü"
                    id="geo-type"
                    value={settings.type}
                    onChange={e => {
                        const newType = e.target.value as GeometryProblemType;
                        // Reset shape if it's not applicable to the new type
                        if (newType === GeometryProblemType.Area && !areaShapes.includes(settings.shape!)) {
                            handleSettingChange('shape', ShapeType.Rectangle);
                        }
                        handleSettingChange('type', newType);
                    }}
                    options={[
                        { value: GeometryProblemType.Perimeter, label: 'Çevre Hesaplama' },
                        { value: GeometryProblemType.Area, label: 'Alan Hesaplama' },
                        { value: GeometryProblemType.ShapeRecognition, label: 'Şekil Tanıma (Tanımdan)' },
                        { value: GeometryProblemType.AngleInfo, label: 'Açı Türleri' },
                        { value: GeometryProblemType.Symmetry, label: 'Simetri' },
                        { value: GeometryProblemType.SolidRecognition, label: 'Cisim Tanıma (Tanımdan)' },
                        { value: GeometryProblemType.SolidElements, label: 'Cisimlerin Elemanları' },
                    ]}
                />
                {showShapeSelector && (
                    <Select
                        label="Şekil"
                        id="geo-shape"
                        value={settings.shape}
                        onChange={e => handleSettingChange('shape', e.target.value as ShapeType)}
                        options={shapeOptions}
                    />
                )}
                <NumberInput 
                    label="Sayfa Başına Problem Sayısı"
                    id="problems-per-page"
                    min={1} max={100}
                    value={settings.problemsPerPage}
                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                    disabled={settings.autoFit || isTableLayout}
                    title={isTableLayout ? "Tablo modunda problem sayısı satır ve sütun sayısına göre belirlenir." : ""}
                />
                 <NumberInput 
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                    disabled={isTableLayout}
                    title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}
                />
            </div>
             <SettingsPresetManager 
                moduleKey="geometry"
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

export default GeometryModule;