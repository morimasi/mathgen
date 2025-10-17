
import React, { useState } from 'react';
import { DyslexiaSettings, DyslexiaSubModuleType } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateDyslexiaProblem } from '../services/dyslexiaService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';

// Import sub-module settings components
import AttentionQuestionSettings from './dyslexia/AttentionQuestionSettings';
import SoundWizardSettings from './dyslexia/SoundWizardSettings';
import LetterDetectiveSettings from './dyslexia/LetterDetectiveSettings';
import ReadingFluencyCoachSettings from './dyslexia/ReadingFluencyCoachSettings';
import ComprehensionExplorerSettings from './dyslexia/ComprehensionExplorerSettings';
import VocabularyExplorerSettings from './dyslexia/VocabularyExplorerSettings';
import VisualMasterSettings from './dyslexia/VisualMasterSettings';
import WordHunterSettings from './dyslexia/WordHunterSettings';
import SpellingChampionSettings from './dyslexia/SpellingChampionSettings';
import MemoryGamerSettings from './dyslexia/MemoryGamerSettings';
import AuditoryWritingSettings from './dyslexia/AuditoryWritingSettings';
import InteractiveStorySettings from './dyslexia/InteractiveStorySettings';

const initialSettings: DyslexiaSettings = {
    activeSubModule: 'attention-questions',
    problemsPerPage: 10,
    pageCount: 1,
    autoFit: false,
    attentionQuestions: { questionType: 'numerical', difficulty: 'easy', numberRange: '1-50' },
    soundWizard: { type: 'rhyme', difficulty: 'easy', wordLength: 4 },
    letterDetective: { letterGroup: 'vowels', difficulty: 'easy' },
    readingFluencyCoach: { gradeLevel: '1', topic: 'hayvanlar' },
    comprehensionExplorer: { textLength: 'short', questionType: 'main_idea', gradeLevel: '1' },
    vocabularyExplorer: { difficulty: 'easy', gradeLevel: '1' },
    visualMaster: { type: 'letter', pair: 'b-d' },
    wordHunter: { focus: 'suffix', difficulty: 'easy' },
    spellingChampion: { difficulty: 'easy', category: 'common_errors' },
    memoryGamer: { type: 'digit_span', sequenceLength: 4 },
    auditoryWriting: { type: 'single_words', difficulty: 'easy' },
    interactiveStory: { genre: 'adventure', gradeLevel: '2' },
};

const subModuleOptions: { value: DyslexiaSubModuleType, label: string }[] = [
    { value: 'attention-questions', label: 'Dikkat Soruları' },
    { value: 'sound-wizard', label: 'Ses Büyücüsü' },
    { value: 'letter-detective', label: 'Harf Dedektifi' },
    { value: 'reading-fluency-coach', label: 'Akıcı Okuma Koçu (AI)' },
    { value: 'comprehension-explorer', label: 'Anlam Kâşifi (AI)' },
    { value: 'vocabulary-explorer', label: 'Kelime Kâşifi (AI)' },
    { value: 'visual-master', label: 'Görsel Usta' },
    { value: 'word-hunter', label: 'Kelime Avcısı (AI)' },
    { value: 'spelling-champion', label: 'Yazım Şampiyonu (AI)' },
    { value: 'memory-gamer', label: 'Hafıza Oyuncusu (AI)' },
    { value: 'auditory-writing', label: 'İşitsel Yazma (Dikte) (AI)' },
    { value: 'interactive-story', label: 'Etkileşimli Hikaye (AI)' },
];

const DyslexiaModule: React.FC = () => {
    const [settings, setSettings] = useState<DyslexiaSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'dyslexia',
        settings,
        generatorFn: (s) => {
            // This is a dummy for the hook, as logic is handled by the async function
            return { problem: { question: '', answer: '', category: 'dyslexia' }, title: '' };
        },
        aiGeneratorFn: async (moduleKey, settings) => {
             const { problems } = await generateDyslexiaProblem(settings.activeSubModule, settings[settings.activeSubModule], settings.problemsPerPage * settings.pageCount);
             return problems;
        }
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    const handleSubSettingChange = (subModuleKey: keyof Omit<DyslexiaSettings, 'activeSubModule' | 'problemsPerPage' | 'pageCount' | 'autoFit'>, newSubSettings: any) => {
        setSettings(prev => ({
            ...prev,
            [subModuleKey]: {
                ...(prev[subModuleKey] as any),
                ...newSubSettings,
            }
        }));
    };
    
    const renderSubModuleSettings = () => {
        const { activeSubModule } = settings;
        switch (activeSubModule) {
            case 'attention-questions': return <AttentionQuestionSettings settings={settings.attentionQuestions} onChange={(s) => handleSubSettingChange('attentionQuestions', s)} />;
            case 'sound-wizard': return <SoundWizardSettings settings={settings.soundWizard} onChange={(s) => handleSubSettingChange('soundWizard', s)} />;
            case 'letter-detective': return <LetterDetectiveSettings settings={settings.letterDetective} onChange={(s) => handleSubSettingChange('letterDetective', s)} />;
            case 'reading-fluency-coach': return <ReadingFluencyCoachSettings settings={settings.readingFluencyCoach} onChange={(s) => handleSubSettingChange('readingFluencyCoach', s)} />;
            case 'comprehension-explorer': return <ComprehensionExplorerSettings settings={settings.comprehensionExplorer} onChange={(s) => handleSubSettingChange('comprehensionExplorer', s)} />;
            case 'vocabulary-explorer': return <VocabularyExplorerSettings settings={settings.vocabularyExplorer} onChange={(s) => handleSubSettingChange('vocabularyExplorer', s)} />;
            case 'visual-master': return <VisualMasterSettings settings={settings.visualMaster} onChange={(s) => handleSubSettingChange('visualMaster', s)} />;
            case 'word-hunter': return <WordHunterSettings settings={settings.wordHunter} onChange={(s) => handleSubSettingChange('wordHunter', s)} />;
            case 'spelling-champion': return <SpellingChampionSettings settings={settings.spellingChampion} onChange={(s) => handleSubSettingChange('spellingChampion', s)} />;
            case 'memory-gamer': return <MemoryGamerSettings settings={settings.memoryGamer} onChange={(s) => handleSubSettingChange('memoryGamer', s)} />;
            case 'auditory-writing': return <AuditoryWritingSettings settings={settings.auditoryWriting} onChange={(s) => handleSubSettingChange('auditoryWriting', s)} />;
            case 'interactive-story': return <InteractiveStorySettings settings={settings.interactiveStory} onChange={(s) => handleSubSettingChange('interactiveStory', s)} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-4">
            <Select
                label="Disleksi Etkinlik Türü"
                id="dyslexia-submodule"
                value={settings.activeSubModule}
                onChange={e => setSettings({ ...settings, activeSubModule: e.target.value as DyslexiaSubModuleType })}
                options={subModuleOptions}
            />

            <div className="p-3 border rounded-md bg-stone-50 dark:bg-stone-700/50">
                {renderSubModuleSettings()}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    label="Problem / Etkinlik Sayısı"
                    id="dyslexia-problemsPerPage"
                    value={settings.problemsPerPage}
                    onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                    min={1} max={50}
                />
                <NumberInput
                    label="Sayfa Sayısı"
                    id="dyslexia-pageCount"
                    value={settings.pageCount}
                    onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                    min={1} max={20}
                />
            </div>

            <SettingsPresetManager<DyslexiaSettings>
                moduleKey="dyslexia"
                currentSettings={settings}
                onLoadSettings={setSettings}
                initialSettings={initialSettings}
            />

            <Button onClick={handleGenerateClick} className="w-full" enableFlyingLadybug>
                Çalışma Kağıdı Oluştur
            </Button>
        </div>
    );
};

export default DyslexiaModule;
