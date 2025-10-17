import React from 'react';
import { Problem, VisualSupportSettings } from '../types';

// Import all module components
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


interface SettingsPanelProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    activeTab: string;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
    visualSupportSettings: VisualSupportSettings;
    setVisualSupportSettings: (settings: VisualSupportSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
    const { activeTab, visualSupportSettings, setVisualSupportSettings } = props;

    const moduleProps = {
        onGenerate: props.onGenerate,
        setIsLoading: props.setIsLoading,
        contentRef: props.contentRef,
        autoRefreshTrigger: props.autoRefreshTrigger,
        lastGeneratorModule: props.lastGeneratorModule,
    };

    const renderActiveModule = () => {
        switch (activeTab) {
            case 'arithmetic':
                return <ArithmeticModule {...moduleProps} />;
            case 'visual-support':
                return <VisualSupportModule {...moduleProps} settings={visualSupportSettings} setSettings={setVisualSupportSettings} />;
            case 'word-problems':
                return <WordProblemsModule {...moduleProps} />;
            case 'fractions':
                return <FractionsModule {...moduleProps} />;
            case 'decimals':
                return <DecimalsModule {...moduleProps} />;
            case 'place-value':
                return <PlaceValueModule {...moduleProps} />;
            case 'rhythmic-counting':
                return <RhythmicCountingModule {...moduleProps} />;
            case 'time':
                return <TimeModule {...moduleProps} />;
            case 'geometry':
                return <GeometryModule {...moduleProps} />;
            case 'measurement':
                return <MeasurementModule {...moduleProps} />;
            case 'matching-and-sorting':
                return <MatchingAndSortingModule {...moduleProps} />;
            case 'comparing-quantities':
                return <ComparingQuantitiesModule {...moduleProps} />;
            case 'number-recognition':
                return <NumberRecognitionModule {...moduleProps} />;
            case 'patterns':
                return <PatternsModule {...moduleProps} />;
            case 'basic-shapes':
                return <BasicShapesModule {...moduleProps} />;
            case 'positional-concepts':
                return <PositionalConceptsModule {...moduleProps} />;
            case 'intro-to-measurement':
                return <IntroToMeasurementModule {...moduleProps} />;
            case 'simple-graphs':
                return <SimpleGraphsModule {...moduleProps} />;
            case 'dyslexia':
                return <DyslexiaModule {...moduleProps} />;
            case 'dyscalculia':
// FIX: Removed {...moduleProps} as the DyscalculiaModule component is a placeholder and does not accept props.
                return <DyscalculiaModule />;
            case 'dysgraphia':
// FIX: Removed {...moduleProps} as the DysgraphiaModule component is a placeholder and does not accept props.
                return <DysgraphiaModule />;
            default:
                return <div>Please select a module from the top menu.</div>;
        }
    };

    return (
        <div className="settings-panel-wrapper">
            {renderActiveModule()}
        </div>
    );
};

export default SettingsPanel;