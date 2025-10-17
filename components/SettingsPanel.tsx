import React from 'react';
import ArithmeticModule from '../modules/ArithmeticModule';
import FractionsModule from '../modules/FractionsModule';
import DecimalsModule from '../modules/DecimalsModule';
import PlaceValueModule from '../modules/PlaceValueModule';
import RhythmicCountingModule from '../modules/RhythmicCountingModule';
import TimeModule from '../modules/TimeModule';
import GeometryModule from '../modules/GeometryModule';
import MeasurementModule from '../modules/MeasurementModule';
import WordProblemsModule from '../modules/WordProblemsModule';
import VisualSupportModule from '../modules/VisualSupportModule';
import MatchingAndSortingModule from '../modules/MatchingAndSortingModule';
import ComparingQuantitiesModule from '../modules/ComparingQuantitiesModule';
import NumberRecognitionModule from '../modules/NumberRecognitionModule';
import PatternsModule from '../modules/PatternsModule';
import BasicShapesModule from '../modules/BasicShapesModule';
import PositionalConceptsModule from '../modules/PositionalConceptsModule';
import IntroToMeasurementModule from '../modules/IntroToMeasurementModule';
import SimpleGraphsModule from '../modules/SimpleGraphsModule';
import DyslexiaModule from '../modules/DyslexiaModule';
import DyscalculiaModule from '../modules/DyscalculiaModule';
import DysgraphiaModule from '../modules/DysgraphiaModule';
import { Problem, VisualSupportSettings } from '../types';

interface SettingsPanelProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    activeTab: string;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
    visualSupportSettings: VisualSupportSettings;
    setVisualSupportSettings: React.Dispatch<React.SetStateAction<VisualSupportSettings>>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    onGenerate, 
    setIsLoading, 
    activeTab, 
    contentRef, 
    autoRefreshTrigger, 
    lastGeneratorModule,
    visualSupportSettings,
    setVisualSupportSettings
}) => {
    const renderModule = () => {
        const commonProps = { onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule };
        switch (activeTab) {
            // Math Readiness
            case 'matching-and-sorting':
                return <MatchingAndSortingModule {...commonProps} />;
            case 'comparing-quantities':
                return <ComparingQuantitiesModule {...commonProps} />;
            case 'number-recognition':
                return <NumberRecognitionModule {...commonProps} />;
            case 'patterns':
                return <PatternsModule {...commonProps} />;
            case 'basic-shapes':
                return <BasicShapesModule {...commonProps} />;
            case 'positional-concepts':
                return <PositionalConceptsModule {...commonProps} />;
            case 'intro-to-measurement':
                return <IntroToMeasurementModule {...commonProps} />;
            case 'simple-graphs':
                return <SimpleGraphsModule {...commonProps} />;
            
            // Operations
            case 'arithmetic':
                return <ArithmeticModule {...commonProps} />;
            case 'visual-support':
                return <VisualSupportModule {...commonProps} settings={visualSupportSettings} setSettings={setVisualSupportSettings} />;
            case 'word-problems':
                return <WordProblemsModule {...commonProps} />;

            // Numbers
            case 'fractions':
                return <FractionsModule {...commonProps} />;
            case 'decimals':
                return <DecimalsModule {...commonProps} />;
            case 'place-value':
                return <PlaceValueModule {...commonProps} />;
            case 'rhythmic-counting':
                return <RhythmicCountingModule {...commonProps} />;

            // Measurements
            case 'time':
                return <TimeModule {...commonProps} />;
            case 'geometry':
                return <GeometryModule {...commonProps} />;
            case 'measurement':
                return <MeasurementModule {...commonProps} />;
            
            // Special Learning
            case 'dyslexia':
                return <DyslexiaModule {...commonProps} />;
            case 'dyscalculia':
                return <DyscalculiaModule {...commonProps} />;
            case 'dysgraphia':
                return <DysgraphiaModule {...commonProps} />;

            default:
                return null;
        }
    };
    
    return (
        <div className="print:hidden space-y-4">
            {renderModule()}
        </div>
    );
};

export default SettingsPanel;