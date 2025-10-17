
import React, { useState } from 'react';
import { DyscalculiaSettings, DyscalculiaSubModuleType } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateDyscalculiaProblem } from '../services/dyscalculiaService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';

import NumberSenseSettings from './dyscalculia/NumberSenseSettings';
import ArithmeticFluencySettings from './dyscalculia/ArithmeticFluencySettings';
import NumberGroupingSettings from './dyscalculia/NumberGroupingSettings';
import ProblemSolvingSettings from './dyscalculia/ProblemSolvingSettings';
import MathLanguageSettings from './dyscalculia/MathLanguageSettings';
import TimeMeasurementGeometrySettings from './dyscalculia/TimeMeasurementGeometrySettings';
import SpatialReasoningSettings from './dyscalculia/SpatialReasoningSettings';
import EstimationSkillsSettings from './dyscalculia/EstimationSkillsSettings';
import FractionsDecimalsIntroSettings from './dyscalculia/FractionsDecimalsIntroSettings';
import VisualNumberRepresentationSettings from './dyscalculia/VisualNumberRepresentationSettings';
import VisualArithmeticSettings from './dyscalculia/VisualArithmeticSettings';
import InteractiveStorySettings from './dyscalculia/InteractiveStorySettings';

const initialSettings: DyscalculiaSettings = {
    activeSubModule: 'number-sense',
    problemsPerPage: 10,
    pageCount: 1,
    autoFit: false,
    numberSense: { type: 'compare', maxNumber: 20 },
    arithmeticFluency: { operation: 'addition', difficulty: 'easy' },
    numberGrouping: { maxNumber: 20 },
    problemSolving: { gradeLevel: '1', topic: 'oyuncaklar' },
    mathLanguage: { type: 'symbol-match' },
    timeMeasurementGeometry: { category: 'time' },
    spatialReasoning: { type: 'pattern-copy' },
    estimationSkills: { type: 'quantity' },
    fractionsDecimalsIntro: { type: 'visual-match' },
    visualNumberRepresentation: { maxNumber: 10, representation: 'dots' },
    visualArithmetic: { operation: 'addition', maxNumber: 10 },
    interactiveStoryDc: { genre: 'market', gradeLevel: '1' },
};

const subModuleOptions: { value: DyscalculiaSubModuleType, label: string }[] = [
    { value: 'number-sense', label: 'Sayı Hissi' },
    { value: 'arithmetic-fluency', label: 'Aritmetik Akıcılığı' },
    { value: 'visual-arithmetic', label: 'Görsel Aritmetik' },
    { value: 'fractions-decimals-intro', label: 'Kesir/Ondalık Giriş' },
    { value: 'problem-solving', label: 'Problem Çözme (AI)' },
    { value: 'interactive-story-dc', label: 'Etkileşimli Hikaye (AI)' },
    // Add other modules as they are implemented
];

const DyscalculiaModule: React.FC = () => {
    const [settings, setSettings] = useState<DyscalculiaSettings>(initialSettings);
    
    const { generate } = useProblemGenerator({
        moduleKey: 'dyscalculia',
        settings,
        generatorFn: (s) => ({ problem: { question: '', answer: '', category: 'dyscalculia' }, title: '' }), // Dummy
        aiGeneratorFn: async (moduleKey, settings) => {
             const { problems } = await generateDyscalculiaProblem(settings.activeSubModule, settings[settings.activeSubModule], settings.problemsPerPage * settings.pageCount);
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
            case 'number-sense': return <NumberSenseSettings settings={settings.numberSense} onChange={(s) => handleSubSettingChange('numberSense', s)} />;
            case 'arithmetic-fluency': return <ArithmeticFluencySettings settings={settings.arithmeticFluency} onChange={(s) => handleSubSettingChange('arithmeticFluency', s)} />;
            case 'number-grouping': return <NumberGroupingSettings settings={settings.numberGrouping} onChange={(s) => handleSubSettingChange('numberGrouping', s)} />;
            case 'problem-solving': return <ProblemSolvingSettings settings={settings.problemSolving} onChange={(s) => handleSubSettingChange('problemSolving', s)} />;
            case 'math-language': return <MathLanguageSettings settings={settings.mathLanguage} onChange={(s) => handleSubSettingChange('mathLanguage', s)} />;
            case 'time-measurement-geometry': return <TimeMeasurementGeometrySettings settings={settings.timeMeasurementGeometry} onChange={(s) => handleSubSettingChange('timeMeasurementGeometry', s)} />;
            case 'spatial-reasoning': return <SpatialReasoningSettings settings={settings.spatialReasoning} onChange={(s) => handleSubSettingChange('spatialReasoning', s)} />;
            case 'estimation-skills': return <EstimationSkillsSettings settings={settings.estimationSkills} onChange={(s) => handleSubSettingChange('estimationSkills', s)} />;
            case 'fractions-decimals-intro': return <FractionsDecimalsIntroSettings settings={settings.fractionsDecimalsIntro} onChange={(s) => handleSubSettingChange('fractionsDecimalsIntro', s)} />;
            case 'visual-number-representation': return <VisualNumberRepresentationSettings settings={settings.visualNumberRepresentation} onChange={(s) => handleSubSettingChange('visualNumberRepresentation', s)} />;
            case 'visual-arithmetic': return <VisualArithmeticSettings settings={settings.visualArithmetic} onChange={(s) => handleSubSettingChange('visualArithmetic', s)} />;
            case 'interactive-story-dc': return <InteractiveStorySettings settings={settings.interactiveStoryDc} onChange={(s) => handleSubSettingChange('interactiveStoryDc', s)} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-4">
            <Select
                label="Diskalkuli Etkinlik Türü"
                id="dyscalculia-submodule"
                value={settings.activeSubModule}
                onChange={e => setSettings({ ...settings, activeSubModule: e.target.value as DyscalculiaSubModuleType })}
                options={subModuleOptions}
            />

            <div className="p-3 border rounded-md bg-stone-50 dark:bg-stone-700/50">
                {renderSubModuleSettings()}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    label="Problem / Etkinlik Sayısı"
                    id="dyscalculia-problemsPerPage"
                    value={settings.problemsPerPage}
                    onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                    min={1} max={50}
                />
                <NumberInput
                    label="Sayfa Sayısı"
                    id="dyscalculia-pageCount"
                    value={settings.pageCount}
                    onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                    min={1} max={20}
                />
            </div>

            <SettingsPresetManager<DyscalculiaSettings>
                moduleKey="dyscalculia"
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

export default DyscalculiaModule;
