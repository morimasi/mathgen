import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Problem, DyscalculiaSettings, DyscalculiaSubModuleType } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import { ShuffleIcon } from '../components/icons/Icons.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import { calculateMaxProblems } from '../services/layoutService.ts';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
// FIX: Add .ts extension to import of dyscalculiaService to fix module resolution error.
import { generateDyscalculiaProblem } from '../services/dyscalculiaService.ts';
import { useWorksheet } from '../services/WorksheetContext.tsx';
import { useDebounce } from '../hooks/useDebounce.ts';

// Import all sub-module setting components
import NumberSenseSettings from './dyscalculia/NumberSenseSettings.tsx';
import ArithmeticFluencySettings from './dyscalculia/ArithmeticFluencySettings.tsx';
import NumberGroupingSettings from './dyscalculia/NumberGroupingSettings.tsx';
import ProblemSolvingSettings from './dyscalculia/ProblemSolvingSettings.tsx';
import MathLanguageSettings from './dyscalculia/MathLanguageSettings.tsx';
import TimeMeasurementGeometrySettings from './dyscalculia/TimeMeasurementGeometrySettings.tsx';
import SpatialReasoningSettings from './dyscalculia/SpatialReasoningSettings.tsx';
import EstimationSkillsSettings from './dyscalculia/EstimationSkillsSettings.tsx';
import FractionsDecimalsIntroSettings from './dyscalculia/FractionsDecimalsIntroSettings.tsx';
import VisualNumberRepresentationSettings from './dyscalculia/VisualNumberRepresentationSettings.tsx';
import VisualArithmeticSettings from './dyscalculia/VisualArithmeticSettings.tsx';
import InteractiveStoryDcSettings from './dyscalculia/InteractiveStorySettings.tsx';


// Import all sub-module icons
import {
    NumberSenseIcon, ArithmeticFluencyIcon, NumberGroupingIcon, ProblemSolvingIcon, MathLanguageIcon,
    TimeIcon, SpatialReasoningIcon, EstimationSkillsIcon, FractionsDecimalsIntroIcon,
    VisualNumberRepresentationIcon, VisualArithmeticIcon, InteractiveStoryIcon
} from '../components/icons/Icons.tsx';

const subModules: { id: DyscalculiaSubModuleType; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'number-sense', label: 'Sayı Hissi', icon: NumberSenseIcon },
    { id: 'arithmetic-fluency', label: 'Aritmetik Akıcılığı', icon: ArithmeticFluencyIcon },
    { id: 'number-grouping', label: 'Sayı Gruplama', icon: NumberGroupingIcon },
    { id: 'problem-solving', label: 'Problem Çözme (AI)', icon: ProblemSolvingIcon },
    { id: 'math-language', label: 'Matematiksel Dil', icon: MathLanguageIcon },
    { id: 'time-measurement-geometry', label: 'Zaman/Ölçme/Geometri', icon: TimeIcon },
    { id: 'spatial-reasoning', label: 'Uzamsal Akıl Yürütme', icon: SpatialReasoningIcon },
    { id: 'estimation-skills', label: 'Tahmin Becerileri', icon: EstimationSkillsIcon },
    { id: 'fractions-decimals-intro', label: 'Kesir/Ondalık Giriş', icon: FractionsDecimalsIntroIcon },
    { id: 'visual-number-representation', label: 'Sayıların Görsel Temsili', icon: VisualNumberRepresentationIcon },
    { id: 'visual-arithmetic', label: 'Görsel Aritmetik', icon: VisualArithmeticIcon },
    { id: 'interactive-story-dc', label: 'Hikaye Macerası (AI)', icon: InteractiveStoryIcon },
];

const defaultSettings: DyscalculiaSettings = {
    activeSubModule: 'number-sense',
    problemsPerPage: 10, pageCount: 1, autoFit: true,
    numberSense: { type: 'number-line', maxNumber: 20 },
    arithmeticFluency: { operation: 'addition', difficulty: 'easy' },
    numberGrouping: { maxNumber: 10 },
    problemSolving: { gradeLevel: '1', topic: 'Oyuncaklar' },
    mathLanguage: { type: 'symbol-match' },
    timeMeasurementGeometry: { category: 'time' },
    spatialReasoning: { type: 'pattern-copy' },
    estimationSkills: { type: 'quantity' },
    fractionsDecimalsIntro: { type: 'visual-match' },
    visualNumberRepresentation: { maxNumber: 10, representation: 'dots' },
    visualArithmetic: { operation: 'addition', maxNumber: 10 },
    interactiveStoryDc: { genre: 'market', gradeLevel: '1' },
};


const DyscalculiaModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<DyscalculiaSettings>(defaultSettings);
    const { updateWorksheet, setIsLoading, autoRefreshTrigger, lastGeneratorModule } = useWorksheet();
    const contentRef = useRef<HTMLDivElement>(null);
    const debouncedSettings = useDebounce(settings, 500);
    
    const activeSubModuleId = settings.activeSubModule;
    const activeSubModuleKey = activeSubModuleId.replace(/-(\w)/g, (_, c) => c.toUpperCase()) as keyof Omit<DyscalculiaSettings, 'activeSubModule' | 'problemsPerPage' | 'pageCount' | 'autoFit'>;
    const activeSubModuleSettings = (settings as any)[activeSubModuleKey];

    useEffect(() => {
        if (!contentRef.current) {
            (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = document.getElementById('worksheet-container-0') as HTMLDivElement;
        }
    }, []);

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
            
            const result = await generateDyscalculiaProblem(activeSubModuleId, activeSubModuleSettings, totalCount);

            if (result.error) {
                console.error(result.error);
            } else if (result.problems.length > 0) {
                updateWorksheet({
                    newProblems: result.problems, 
                    clearPrevious, 
                    title: result.title, 
                    generatorModule: `dyscalculia-${activeSubModuleId}`, 
                    pageCount: isTableLayout ? 1 : settings.pageCount
                });
            }
        } catch (error: any) {
            console.error(error);
        }
        setIsLoading(false);
    }, [settings, printSettings, updateWorksheet, setIsLoading, activeSubModuleId, activeSubModuleSettings]);

    // Auto-refresh on header button click
    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === `dyscalculia-${activeSubModuleId}`) {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate, activeSubModuleId]);

    // Debounced live update for non-AI modules
    useEffect(() => {
        const isAIModule = ['problem-solving', 'interactive-story-dc'].includes(debouncedSettings.activeSubModule);
        if (isAIModule) return;
        
        if (lastGeneratorModule === `dyscalculia-${debouncedSettings.activeSubModule}`) {
            handleGenerate(true);
        }
    }, [debouncedSettings, lastGeneratorModule, handleGenerate]);


    const handleSubModuleChange = (id: DyscalculiaSubModuleType) => {
        setSettings(prev => ({ ...prev, activeSubModule: id }));
    };

    const handleSettingChange = (field: keyof DyscalculiaSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSubModuleSettingChange = (subModuleSettings: any) => {
        setSettings(prev => ({
            ...prev,
            [activeSubModuleKey]: { ...(prev as any)[activeSubModuleKey], ...subModuleSettings }
        }));
    };

    const renderSettingsPanel = () => {
        const props = { settings: activeSubModuleSettings, onChange: handleSubModuleSettingChange };
        switch (activeSubModuleId) {
            case 'number-sense': return <NumberSenseSettings {...props} />;
            case 'arithmetic-fluency': return <ArithmeticFluencySettings {...props} />;
            case 'number-grouping': return <NumberGroupingSettings {...props} />;
            case 'problem-solving': return <ProblemSolvingSettings {...props} />;
            case 'math-language': return <MathLanguageSettings {...props} />;
            case 'time-measurement-geometry': return <TimeMeasurementGeometrySettings {...props} />;
            case 'spatial-reasoning': return <SpatialReasoningSettings {...props} />;
            case 'estimation-skills': return <EstimationSkillsSettings {...props} />;
            case 'fractions-decimals-intro': return <FractionsDecimalsIntroSettings {...props} />;
            case 'visual-number-representation': return <VisualNumberRepresentationSettings {...props} />;
            case 'visual-arithmetic': return <VisualArithmeticSettings {...props} />;
            case 'interactive-story-dc': return <InteractiveStoryDcSettings {...props} />;
            default: return null;
        }
    };

    return (
        <div className="flex gap-4">
            <aside className="w-1/3 pr-2 border-r border-stone-200 dark:border-stone-700">
                <nav className="flex flex-col gap-1">
                    {subModules.map(module => (
                        <button key={module.id} onClick={() => handleSubModuleChange(module.id)}
                            className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                activeSubModuleId === module.id
                                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                            }`}>
                            <module.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-grow">{module.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>
            
            <main className="w-2/3 space-y-3">
                {renderSettingsPanel()}
                <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                    <div className="grid grid-cols-2 gap-2">
                         <NumberInput label="Problem Sayısı" id="dc-problems-per-page" min={1} max={50}
                            value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value, 10))} disabled={settings.autoFit} />
                         <NumberInput label="Sayfa Sayısı" id="dc-page-count" min={1} max={20}
                            value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value, 10))} />
                    </div>
                </div>
                <SettingsPresetManager currentSettings={activeSubModuleSettings} onLoadSettings={handleSubModuleSettingChange} moduleKey={`dyscalculia-${activeSubModuleId}`} />
                <div className="flex flex-wrap gap-2 pt-2">
                    <Button onClick={() => handleGenerate(true)} size="sm">Oluştur</Button>
                    <Button onClick={() => handleGenerate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
                    <Button onClick={() => handleGenerate(true)} variant="secondary" title="Ayarları koruyarak soruları yenile" size="sm">
                        <ShuffleIcon className="w-4 h-4" /> Yenile
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default DyscalculiaModule;