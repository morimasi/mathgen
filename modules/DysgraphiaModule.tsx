import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Problem, DysgraphiaSettings, DysgraphiaSubModuleType } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import { ShuffleIcon } from '../components/icons/Icons.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import { calculateMaxProblems } from '../services/layoutService.ts';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import { generateDysgraphiaProblem } from '../services/dysgraphiaService.ts';
import { useWorksheet } from '../services/WorksheetContext.tsx';
import Checkbox from '../components/form/Checkbox.tsx';

// Import all sub-module setting components
import NumberTraceSettings from './dysgraphia/NumberTraceSettings.tsx';
import GeometricDoodlingSettings from './dysgraphia/GeometricDoodlingSettings.tsx';
import MathConnectTheDotsSettings from './dysgraphia/MathConnectTheDotsSettings.tsx';
import DigitCalligraphySettings from './dysgraphia/DigitCalligraphySettings.tsx';
import SymbolStudioSettings from './dysgraphia/SymbolStudioSettings.tsx';
import WordFormWriterSettings from './dysgraphia/WordFormWriterSettings.tsx';
import ListingTheGivensSettings from './dysgraphia/ListingTheGivensSettings.tsx';
import StepByStepScribeSettings from './dysgraphia/StepByStepScribeSettings.tsx';
import StoryProblemCreatorSettings from './dysgraphia/StoryProblemCreatorSettings.tsx';

// Import all sub-module icons
import {
    NumberTraceIcon,
    GeometricTraceIcon,
    RhythmicIcon,
    DigitTraceIcon,
    SymbolTraceIcon,
    CreativeWritingIcon,
    ProblemSolvingIcon,
    WordProblemsIcon,
    InteractiveStoryIcon,
} from '../components/icons/Icons.tsx';


const subModuleGroups = [
    {
        title: "Sayısal El Becerileri",
        modules: [
            { id: 'number-trace', label: 'Sayı Yolları', icon: NumberTraceIcon },
            { id: 'geometric-doodling', label: 'Geometrik Çizimler', icon: GeometricTraceIcon },
            { id: 'math-connect-the-dots', label: 'Noktadan Noktaya Matematik', icon: RhythmicIcon },
        ]
    },
    {
        title: "Matematiksel Yazı Atölyesi",
        modules: [
            { id: 'digit-calligraphy', label: 'Rakam Kaligrafisi', icon: DigitTraceIcon },
            { id: 'symbol-studio', label: 'Sembol Stüdyosu', icon: SymbolTraceIcon },
            { id: 'word-form-writer', label: 'Sayıları Yazıyla Yazma', icon: CreativeWritingIcon },
        ]
    },
    {
        title: "Problem Çözümleme ve Yazma (AI)",
        modules: [
            { id: 'listing-the-givens-ai', label: 'Verilenleri Listeleme', icon: ProblemSolvingIcon },
            { id: 'step-by-step-scribe-ai', label: 'Adım Adım Çözüm', icon: WordProblemsIcon },
            { id: 'story-problem-creator-ai', label: 'Hikaye Problemi Oluşturma', icon: InteractiveStoryIcon },
        ]
    }
];

const allSubModules = subModuleGroups.flatMap(g => g.modules);


const defaultSettings: DysgraphiaSettings = {
    activeSubModule: 'number-trace',
    problemsPerPage: 8, pageCount: 1, autoFit: true,
    numberTrace: { digits: 2 },
    geometricDoodling: { shape: 'square' },
    mathConnectTheDots: { countingType: 'sequential' },
    digitCalligraphy: { digit: 5 },
    symbolStudio: { symbol: 'plus' },
    wordFormWriter: { digits: 2 },
    listingTheGivensAi: { gradeLevel: 2 },
    stepByStepScribeAi: { operation: 'addition', difficulty: 'easy' },
    storyProblemCreatorAi: { difficulty: 'easy', topic: 'Market' },
};


const DysgraphiaModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<DysgraphiaSettings>(defaultSettings);
    const { updateWorksheet, setIsLoading, autoRefreshTrigger, lastGeneratorModule } = useWorksheet();
    const contentRef = useRef<HTMLDivElement>(null);
    const autoRefreshTriggerRef = useRef(autoRefreshTrigger);

    const activeSubModuleId = settings.activeSubModule;
    const activeSubModuleKey = activeSubModuleId.replace(/-(\w)/g, (_, c) => c.toUpperCase()).replace(/Ai$/, 'Ai') as keyof Omit<DysgraphiaSettings, 'activeSubModule' | 'problemsPerPage' | 'pageCount' | 'autoFit'>;
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
            
            const result = await generateDysgraphiaProblem(activeSubModuleId, activeSubModuleSettings, totalCount);

            if (result.error) {
                console.error(result.error);
            } else if (result.problems.length > 0) {
                updateWorksheet({
                    newProblems: result.problems, 
                    clearPrevious, 
                    title: result.title, 
                    preamble: result.preamble,
                    generatorModule: `dysgraphia-${activeSubModuleId}`, 
                    pageCount: isTableLayout ? 1 : settings.pageCount
                });
            }
        } catch (error: any) {
            console.error(error);
        }
        setIsLoading(false);
    }, [settings, printSettings, updateWorksheet, setIsLoading, activeSubModuleId, activeSubModuleSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > autoRefreshTriggerRef.current && lastGeneratorModule === `dysgraphia-${activeSubModuleId}`) {
            autoRefreshTriggerRef.current = autoRefreshTrigger;
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate, activeSubModuleId]);

    const handleSubModuleChange = (id: DysgraphiaSubModuleType) => {
        setSettings(prev => ({ ...prev, activeSubModule: id }));
    };

    const handleSettingChange = (field: keyof DysgraphiaSettings, value: any) => {
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
            case 'number-trace': return <NumberTraceSettings {...props} />;
            case 'geometric-doodling': return <GeometricDoodlingSettings {...props} />;
            case 'math-connect-the-dots': return <MathConnectTheDotsSettings {...props} />;
            case 'digit-calligraphy': return <DigitCalligraphySettings {...props} />;
            case 'symbol-studio': return <SymbolStudioSettings {...props} />;
            case 'word-form-writer': return <WordFormWriterSettings {...props} />;
            case 'listing-the-givens-ai': return <ListingTheGivensSettings {...props} />;
            case 'step-by-step-scribe-ai': return <StepByStepScribeSettings {...props} />;
            case 'story-problem-creator-ai': return <StoryProblemCreatorSettings {...props} />;
            default: return null;
        }
    };

    const isTableLayout = printSettings.layoutMode === 'table';

    return (
        <div className="flex gap-4">
            <aside className="w-1/3 pr-2 border-r border-stone-200 dark:border-stone-700">
                <nav className="flex flex-col gap-1">
                    {subModuleGroups.map(group => (
                        <div key={group.title}>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 my-2 px-2">
                                {group.title}
                            </h3>
                            {group.modules.map(module => (
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
                        </div>
                    ))}
                </nav>
            </aside>
            
            <main className="w-2/3 space-y-3">
                {renderSettingsPanel()}
                <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg" open>
                    <summary className="text-xs font-semibold cursor-pointer select-none">Sayfa Düzeni</summary>
                    <div className="mt-2 space-y-2">
                        <Checkbox label="Otomatik Sığdır" id="autoFit-dysgraphia" checked={settings.autoFit} onChange={e => handleSettingChange('autoFit', e.target.checked)} disabled={isTableLayout} />
                        <div className="grid grid-cols-2 gap-2">
                             <NumberInput label="Sayfa Başına Problem" id="dg-problems-per-page" min={1} max={50}
                                value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value, 10))} disabled={settings.autoFit || isTableLayout} />
                             <NumberInput label="Sayfa Sayısı" id="dg-page-count" min={1} max={20}
                                value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value, 10))} disabled={isTableLayout} />
                        </div>
                    </div>
                </details>
                <SettingsPresetManager currentSettings={activeSubModuleSettings} onLoadSettings={handleSubModuleSettingChange} moduleKey={`dysgraphia-${activeSubModuleId}`} />
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

export default DysgraphiaModule;
