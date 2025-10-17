import React from 'react';
// FIX: Add .tsx extensions to module imports to resolve module resolution issues.
import ArithmeticModule from '../modules/ArithmeticModule.tsx';
import FractionsModule from '../modules/FractionsModule.tsx';
import DecimalsModule from '../modules/DecimalsModule.tsx';
import PlaceValueModule from '../modules/PlaceValueModule.tsx';
import RhythmicCountingModule from '../modules/RhythmicCountingModule.tsx';
import TimeModule from '../modules/TimeModule.tsx';
import GeometryModule from '../modules/GeometryModule.tsx';
import MeasurementModule from '../modules/MeasurementModule.tsx';
import WordProblemsModule from '../modules/WordProblemsModule.tsx';
import VisualSupportModule from '../modules/VisualSupportModule.tsx';
import MatchingAndSortingModule from '../modules/MatchingAndSortingModule.tsx';
import ComparingQuantitiesModule from '../modules/ComparingQuantitiesModule.tsx';
import NumberRecognitionModule from '../modules/NumberRecognitionModule.tsx';
import PatternsModule from '../modules/PatternsModule.tsx';
import BasicShapesModule from '../modules/BasicShapesModule.tsx';
import PositionalConceptsModule from '../modules/PositionalConceptsModule.tsx';
import IntroToMeasurementModule from '../modules/IntroToMeasurementModule.tsx';
import SimpleGraphsModule from '../modules/SimpleGraphsModule.tsx';
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
