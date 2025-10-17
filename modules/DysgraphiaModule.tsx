
import React, { useState } from 'react';
import { DysgraphiaSettings, DysgraphiaSubModuleType } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateDysgraphiaProblem } from '../../services/dysgraphiaService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';

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
import InteractiveStorySettings from './dysgraphia/InteractiveStorySettings';

const initialSettings: DysgraphiaSettings = {
    activeSubModule: 'fine-motor-skills',
    problemsPerPage: 5,
    pageCount: 1,
    autoFit: false,
    fineMotorSkills: { type: 'line-trace' },
    letterFormation: { letter: 'a', case: 'lower' },
    letterFormRecognition: { targetLetter: 'b', difficulty: 'easy' },
    legibleWriting: { type: 'spacing' },
    pictureSequencing: { storyLength: 3, topic: 'park' },
    writingSpeed: { duration: 1 },
    sentenceConstruction: { wordCount: 4 },
    punctuation: { type: 'end-of-sentence' },
    writingPlanning: { topic: 'tatil' },
    creativeWriting: { promptType: 'story-starter', topic: '' },
    keyboardSkills: { level: 'home-row' },
    interactiveStoryDg: { genre: 'journal', gradeLevel: '2' },
};

const subModuleOptions: { value: DysgraphiaSubModuleType, label: string }[] = [
    { value: 'fine-motor-skills', label: 'İnce Motor Becerileri' },
    { value: 'letter-formation', label: 'Harf Şekillendirme' },
    { value: 'sentence-construction', label: 'Cümle Kurma' },
    { value: 'picture-sequencing', label: 'Resim Sıralama (AI)' },
    { value: 'writing-planning', label: 'Yazı Planlama (AI)' },
    { value: 'creative-writing', label: 'Yaratıcı Yazarlık (AI)' },
    { value: 'interactive-story-dg', label: 'Etkileşimli Hikaye (AI)' },
    // Add other modules as they are implemented
];

const DysgraphiaModule: React.FC = () => {
    const [settings, setSettings] = useState<DysgraphiaSettings>(initialSettings);
    
    const { generate } = useProblemGenerator({
        moduleKey: 'dysgraphia',
        settings,
        generatorFn: (s) => ({ problem: { question: '', answer: '', category: 'dysgraphia' }, title: '' }), // Dummy
        aiGeneratorFn: async (moduleKey, settings) => {
             const { problems } = await generateDysgraphiaProblem(settings.activeSubModule, settings[settings.activeSubModule], settings.problemsPerPage * settings.pageCount);
             return problems;
        }
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    const handleSubSettingChange = (subModuleKey: any, newSubSettings: any) => {
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
            case 'fine-motor-skills': return <FineMotorSkillsSettings settings={settings.fineMotorSkills} onChange={(s) => handleSubSettingChange('fineMotorSkills', s)} />;
            case 'letter-formation': return <LetterFormationSettings settings={settings.letterFormation} onChange={(s) => handleSubSettingChange('letterFormation', s)} />;
            case 'letter-form-recognition': return <LetterFormRecognitionSettings settings={settings.letterFormRecognition} onChange={(s) => handleSubSettingChange('letterFormRecognition', s)} />;
            case 'legible-writing': return <LegibleWritingSettings settings={settings.legibleWriting} onChange={(s) => handleSubSettingChange('legibleWriting', s)} />;
            case 'picture-sequencing': return <PictureSequencingSettings settings={settings.pictureSequencing} onChange={(s) => handleSubSettingChange('pictureSequencing', s)} />;
            case 'writing-speed': return <WritingSpeedSettings settings={settings.writingSpeed} onChange={(s) => handleSubSettingChange('writingSpeed', s)} />;
            case 'sentence-construction': return <SentenceConstructionSettings settings={settings.sentenceConstruction} onChange={(s) => handleSubSettingChange('sentenceConstruction', s)} />;
            case 'punctuation': return <PunctuationSettings settings={settings.punctuation} onChange={(s) => handleSubSettingChange('punctuation', s)} />;
            case 'writing-planning': return <WritingPlanningSettings settings={settings.writingPlanning} onChange={(s) => handleSubSettingChange('writingPlanning', s)} />;
            case 'creative-writing': return <CreativeWritingSettings settings={settings.creativeWriting} onChange={(s) => handleSubSettingChange('creativeWriting', s)} />;
            case 'keyboard-skills': return <KeyboardSkillsSettings settings={settings.keyboardSkills} onChange={(s) => handleSubSettingChange('keyboardSkills', s)} />;
            case 'interactive-story-dg': return <InteractiveStorySettings settings={settings.interactiveStoryDg} onChange={(s) => handleSubSettingChange('interactiveStoryDg', s)} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-4">
            <Select
                label="Disgrafi Etkinlik Türü"
                id="dysgraphia-submodule"
                value={settings.activeSubModule}
                onChange={e => setSettings({ ...settings, activeSubModule: e.target.value as DysgraphiaSubModuleType })}
                options={subModuleOptions}
            />

            <div className="p-3 border rounded-md bg-stone-50 dark:bg-stone-700/50">
                {renderSubModuleSettings()}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    label="Problem / Etkinlik Sayısı"
                    id="dysgraphia-problemsPerPage"
                    value={settings.problemsPerPage}
                    onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                    min={1} max={50}
                />
                <NumberInput
                    label="Sayfa Sayısı"
                    id="dysgraphia-pageCount"
                    value={settings.pageCount}
                    onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                    min={1} max={20}
                />
            </div>

            <SettingsPresetManager<DysgraphiaSettings>
                moduleKey="dysgraphia"
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

export default DysgraphiaModule;
