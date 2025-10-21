import React, { useCallback, useEffect, useRef } from 'react';
import { Problem, DysgraphiaSettings, DysgraphiaSubModuleType, ModuleKey } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import { ShuffleIcon } from '../components/icons/Icons';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { generateDysgraphiaProblem } from '../services/dysgraphiaService';
import { useWorksheet } from '../services/WorksheetContext';
import Checkbox from '../components/form/Checkbox';


// Import all sub-module setting components
import FineMotorSkillsSettings from './dysgraphia/FineMotorSkillsSettings';
import LetterFormationSettings from './dysgraphia/LetterFormationSettings';
import LetterFormRecognitionSettings from './dysgraphia/LetterFormRecognitionSettings';
import LegibleWritingSettings from './dysgraphia/LegibleWritingSettings';
import PictureSequencingSettings from './dysgraphia/PictureSequencingSettings';
import WritingSpeedSettings from './dysgraphia/WritingSpeedSettings';
import SentenceConstructionSettings from './dysgraphia/SentenceConstructionSettings';
import PunctuationSettings from './dysgraphia/PunctuationSettings';
import WritingPlanningSettings from './dysgraphia/WritingPlanningSettings';
import CreativeWritingSettings from './dysgraphia/CreativeWritingSettings';
import KeyboardSkillsSettings from './dysgraphia/KeyboardSkillsSettings';
import InteractiveStoryDgSettings from './dysgraphia/InteractiveStorySettings';

// Import all sub-module icons
import {
    FineMotorSkillsIcon, LetterFormationIcon, LetterFormRecognitionIcon, LegibleWritingIcon, PictureSequencingIcon,
    WritingSpeedIcon, SentenceConstructionIcon, PunctuationIcon, WritingPlanningIcon, CreativeWritingIcon,
    KeyboardSkillsIcon, InteractiveStoryIcon
} from '../components/icons/Icons';

const subModules: { id: DysgraphiaSubModuleType; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'fine-motor-skills', label: 'İnce Motor Becerileri', icon: FineMotorSkillsIcon },
    { id: 'letter-formation', label: 'Harf Şekillendirme', icon: LetterFormationIcon },
    { id: 'letter-form-recognition', label: 'Harf Formu Tanıma', icon: LetterFormRecognitionIcon },
    { id: 'legible-writing', label: 'Okunaklı Yazı', icon: LegibleWritingIcon },
    { id: 'picture-sequencing', label: 'Resim Sıralama (AI)', icon: PictureSequencingIcon },
    { id: 'writing-speed', label: 'Yazma Hızı', icon: WritingSpeedIcon },
    { id: 'sentence-construction', label: 'Cümle Kurma', icon: SentenceConstructionIcon },
    { id: 'punctuation', label: 'Noktalama İşaretleri', icon: PunctuationIcon },
    { id: 'writing-planning', label: 'Yazı Planlama (AI)', icon: WritingPlanningIcon },
    { id: 'creative-writing', label: 'Yaratıcı Yazarlık (AI)', icon: CreativeWritingIcon },
    { id: 'keyboard-skills', label: 'Klavye Becerileri', icon: KeyboardSkillsIcon },
    { id: 'interactive-story-dg', label: 'Hikaye Macerası (AI)', icon: InteractiveStoryIcon },
];

const DysgraphiaModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const { allSettings, handleSettingsChange: setContextSettings, updateWorksheet, setIsLoading, autoRefreshTrigger, lastGeneratorModule } = useWorksheet();
    const settings = allSettings.dysgraphia;
    const moduleKey: ModuleKey = 'dysgraphia';

    const contentRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);
    const autoRefreshTriggerRef = useRef(autoRefreshTrigger);

    
    const activeSubModuleId = settings.activeSubModule;
    const activeSubModuleKey = activeSubModuleId.replace(/-(\w)/g, (_, c) => c.toUpperCase()) as keyof Omit<DysgraphiaSettings, 'activeSubModule' | 'problemsPerPage' | 'pageCount' | 'autoFit'>;
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


    // Live update for non-AI modules
    useEffect(() => {
        const isAIModule = ['picture-sequencing', 'writing-planning', 'creative-writing', 'interactive-story-dg'].includes(activeSubModuleId);
        if (isInitialMount.current || isAIModule) {
            isInitialMount.current = false;
            return;
        }

        if (lastGeneratorModule === `dysgraphia-${activeSubModuleId}`) {
            const handler = setTimeout(() => handleGenerate(true), 300);
            return () => clearTimeout(handler);
        }
    }, [settings, printSettings, lastGeneratorModule, handleGenerate, activeSubModuleId]);

    const handleSubModuleChange = (id: DysgraphiaSubModuleType) => {
        setContextSettings(moduleKey, { activeSubModule: id });
    };

    const handleSettingChange = (field: keyof DysgraphiaSettings, value: any) => {
        setContextSettings(moduleKey, { [field]: value });
    };
    
    const handleSubModuleSettingChange = (subModuleSettings: any) => {
        const currentSubModuleSettings = (settings as any)[activeSubModuleKey];
        setContextSettings(moduleKey, { [activeSubModuleKey]: { ...currentSubModuleSettings, ...subModuleSettings } });
    };

    // FIX: Completed the renderSettingsPanel function and the component's return statement.
    // The component was previously incomplete, causing a type error because it didn't return a valid ReactNode.
    const renderSettingsPanel = () => {
        const props = { settings: activeSubModuleSettings, onChange: handleSubModuleSettingChange };
        switch (activeSubModuleId) {
            case 'fine-motor-skills': return <FineMotorSkillsSettings {...props} />;
            case 'letter-formation': return <LetterFormationSettings {...props} />;
            case 'letter-form-recognition': return <LetterFormRecognitionSettings {...props} />;
            case 'legible-writing': return <LegibleWritingSettings {...props} />;
            case 'picture-sequencing': return <PictureSequencingSettings {...props} />;
            case 'writing-speed': return <WritingSpeedSettings {...props} />;
            case 'sentence-construction': return <SentenceConstructionSettings {...props} />;
            case 'punctuation': return <PunctuationSettings {...props} />;
            case 'writing-planning': return <WritingPlanningSettings {...props} />;
            case 'creative-writing': return <CreativeWritingSettings {...props} />;
            case 'keyboard-skills': return <KeyboardSkillsSettings {...props} />;
            case 'interactive-story-dg': return <InteractiveStoryDgSettings {...props} />;
            default: return null;
        }
    };
    
    const isTableLayout = printSettings.layoutMode === 'table';

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