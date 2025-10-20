import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Problem, DyslexiaSettings, DyslexiaSubModuleType } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import { ShuffleIcon } from '../components/icons/Icons.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import { calculateMaxProblems } from '../services/layoutService.ts';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import { generateDyslexiaProblem } from '../services/dyslexiaService.ts';
import { useWorksheet } from '../services/WorksheetContext.tsx';

// Import all sub-module setting components
import SoundWizardSettings from './dyslexia/SoundWizardSettings.tsx';
import LetterDetectiveSettings from './dyslexia/LetterDetectiveSettings.tsx';
import ReadingFluencyCoachSettings from './dyslexia/ReadingFluencyCoachSettings.tsx';
import ComprehensionExplorerSettings from './dyslexia/ComprehensionExplorerSettings.tsx';
import VocabularyExplorerSettings from './dyslexia/VocabularyExplorerSettings.tsx';
import VisualMasterSettings from './dyslexia/VisualMasterSettings.tsx';
import WordHunterSettings from './dyslexia/WordHunterSettings.tsx';
import SpellingChampionSettings from './dyslexia/SpellingChampionSettings.tsx';
import MemoryGamerSettings from './dyslexia/MemoryGamerSettings.tsx';
import AuditoryWritingSettings from './dyslexia/AuditoryWritingSettings.tsx';
import InteractiveStorySettings from './dyslexia/InteractiveStorySettings.tsx';
import AttentionQuestionSettings from './dyslexia/AttentionQuestionSettings.tsx';
import MapReadingSettings from './dyslexia/MapReadingSettings.tsx';


// Import all sub-module icons
import {
    NumberSenseIcon, // Placeholder, replace with actual icons if available
    LetterFormationIcon,
    ReadingFluencyCoachSettings as ReadingIcon,
    ComprehensionExplorerSettings as ComprehensionIcon,
    VocabularyExplorerSettings as VocabularyIcon,
    VisualMasterSettings as VisualIcon,
    WordHunterSettings as WordHunterIcon,
    SpellingChampionSettings as SpellingIcon,
    MemoryGamerSettings as MemoryIcon,
    AuditoryWritingSettings as AuditoryIcon,
    InteractiveStoryIcon,
    AttentionQuestionSettings as AttentionIcon,
    MapReadingSettings as MapIcon,
} from '../components/icons/Icons.tsx';


const subModules: { id: DyslexiaSubModuleType; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'sound-wizard', label: 'Ses Büyücüsü', icon: NumberSenseIcon },
    { id: 'letter-detective', label: 'Harf Dedektifi', icon: LetterFormationIcon },
    { id: 'reading-fluency-coach', label: 'Sesli Okuma Koçu (AI)', icon: ReadingIcon },
    { id: 'comprehension-explorer', label: 'Anlam Kâşifi (AI)', icon: ComprehensionIcon },
    { id: 'vocabulary-explorer', label: 'Kelime Kâşifi (AI)', icon: VocabularyIcon },
    { id: 'visual-master', label: 'Görsel Usta', icon: VisualIcon },
    { id: 'word-hunter', label: 'Kelime Avcısı (AI)', icon: WordHunterIcon },
    { id: 'spelling-champion', label: 'Yazım Şampiyonu (AI)', icon: SpellingIcon },
    { id: 'memory-gamer', label: 'Hafıza Oyuncusu', icon: MemoryIcon },
    { id: 'auditory-writing', label: 'İşitsel Yazma (AI)', icon: AuditoryIcon },
    { id: 'interactive-story', label: 'Hikaye Macerası (AI)', icon: InteractiveStoryIcon },
    { id: 'attention-question', label: 'Dikkat Soruları', icon: AttentionIcon },
    { id: 'map-reading', label: 'Harita Okuma', icon: MapIcon },
];

const defaultSettings: DyslexiaSettings = {
    activeSubModule: 'sound-wizard',
    problemsPerPage: 10, pageCount: 1, autoFit: true,
    soundWizard: { type: 'rhyme', difficulty: 'easy', wordLength: 4 },
    letterDetective: { letterGroup: 'vowels', difficulty: 'easy' },
    readingFluencyCoach: { gradeLevel: '1', topic: 'Hayvanlar' },
    comprehensionExplorer: { gradeLevel: '2', textLength: 'short', questionType: 'main_idea' },
    vocabularyExplorer: { gradeLevel: '2', difficulty: 'easy' },
    visualMaster: { type: 'letter', pair: 'b-d' },
    wordHunter: { focus: 'suffix', difficulty: 'easy' },
    spellingChampion: { category: 'common_errors', difficulty: 'easy' },
    memoryGamer: { type: 'digit_span', sequenceLength: 3 },
    auditoryWriting: { type: 'single_words', difficulty: 'easy' },
    interactiveStory: { genre: 'adventure', gradeLevel: '2' },
    attentionQuestion: { questionType: 'numerical', difficulty: 'easy', numberRange: '1-50' },
    mapReading: { mapType: 'zoo', task: 'find-place' },
};


const DyslexiaModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<DyslexiaSettings>(defaultSettings);
    const { updateWorksheet, setIsLoading, autoRefreshTrigger, lastGeneratorModule } = useWorksheet();
    const contentRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    const activeSubModuleId = settings.activeSubModule;
    const activeSubModuleKey = activeSubModuleId.replace(/-(\w)/g, (_, c) => c.toUpperCase()) as keyof Omit<DyslexiaSettings, 'activeSubModule' | 'problemsPerPage' | 'pageCount' | 'autoFit'>;
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
            
            const result = await generateDyslexiaProblem(activeSubModuleId, activeSubModuleSettings, totalCount);

            if (result.error) {
                console.error(result.error);
            } else if (result.problems.length > 0) {
                updateWorksheet({
                    newProblems: result.problems, 
                    clearPrevious, 
                    title: result.title, 
                    preamble: result.preamble,
                    generatorModule: `dyslexia-${activeSubModuleId}`, 
                    pageCount: isTableLayout ? 1 : settings.pageCount
                });
            }
        } catch (error: any) {
            console.error(error);
        }
        setIsLoading(false);
    }, [settings, printSettings, updateWorksheet, setIsLoading, activeSubModuleId, activeSubModuleSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === `dyslexia-${activeSubModuleId}`) {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate, activeSubModuleId]);

    // Live update for non-AI modules
    useEffect(() => {
        const isAIModule = ['reading-fluency-coach', 'comprehension-explorer', 'vocabulary-explorer', 'word-hunter', 'spelling-champion', 'auditory-writing', 'interactive-story'].includes(activeSubModuleId);
        if (isInitialMount.current || isAIModule) {
            isInitialMount.current = false;
            return;
        }

        if (lastGeneratorModule === `dyslexia-${activeSubModuleId}`) {
            const handler = setTimeout(() => handleGenerate(true), 300);
            return () => clearTimeout(handler);
        }
    }, [settings, printSettings, lastGeneratorModule, handleGenerate, activeSubModuleId]);

    const handleSubModuleChange = (id: DyslexiaSubModuleType) => {
        setSettings(prev => ({ ...prev, activeSubModule: id }));
    };

    const handleSettingChange = (field: keyof DyslexiaSettings, value: any) => {
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
            case 'sound-wizard': return <SoundWizardSettings {...props} />;
            case 'letter-detective': return <LetterDetectiveSettings {...props} />;
            case 'reading-fluency-coach': return <ReadingFluencyCoachSettings {...props} />;
            case 'comprehension-explorer': return <ComprehensionExplorerSettings {...props} />;
            case 'vocabulary-explorer': return <VocabularyExplorerSettings {...props} />;
            case 'visual-master': return <VisualMasterSettings {...props} />;
            case 'word-hunter': return <WordHunterSettings {...props} />;
            case 'spelling-champion': return <SpellingChampionSettings {...props} />;
            case 'memory-gamer': return <MemoryGamerSettings {...props} />;
            case 'auditory-writing': return <AuditoryWritingSettings {...props} />;
            case 'interactive-story': return <InteractiveStorySettings {...props} />;
            case 'attention-question': return <AttentionQuestionSettings {...props} />;
            case 'map-reading': return <MapReadingSettings {...props} />;
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
                         <NumberInput label="Problem Sayısı" id="dx-problems-per-page" min={1} max={50}
                            value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value, 10))} disabled={settings.autoFit} />
                         <NumberInput label="Sayfa Sayısı" id="dx-page-count" min={1} max={20}
                            value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value, 10))} />
                    </div>
                </div>
                <SettingsPresetManager currentSettings={activeSubModuleSettings} onLoadSettings={handleSubModuleSettingChange} moduleKey={`dyslexia-${activeSubModuleId}`} />
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

export default DyslexiaModule;
