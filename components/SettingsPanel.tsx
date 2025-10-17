import React, { Suspense } from 'react';
import { useUI } from '../services/UIContext';
import { LoadingIcon } from './icons/Icons';

// Lazily import all module components for code-splitting
const ArithmeticModule = React.lazy(() => import('../modules/ArithmeticModule'));
const FractionsModule = React.lazy(() => import('../modules/FractionsModule'));
const DecimalsModule = React.lazy(() => import('../modules/DecimalsModule'));
const PlaceValueModule = React.lazy(() => import('../modules/PlaceValueModule'));
// FIX: Changed to a named import to resolve a type error with React.lazy.
const RhythmicCountingModule = React.lazy(() => import('../modules/RhythmicCountingModule').then(module => ({ default: module.RhythmicCountingModule })));
const TimeModule = React.lazy(() => import('../modules/TimeModule'));
const GeometryModule = React.lazy(() => import('../modules/GeometryModule'));
const MeasurementModule = React.lazy(() => import('../modules/MeasurementModule'));
const WordProblemsModule = React.lazy(() => import('../modules/WordProblemsModule'));
const VisualSupportModule = React.lazy(() => import('../modules/VisualSupportModule'));
const MatchingAndSortingModule = React.lazy(() => import('../modules/MatchingAndSortingModule'));
const ComparingQuantitiesModule = React.lazy(() => import('../modules/ComparingQuantitiesModule'));
const NumberRecognitionModule = React.lazy(() => import('../modules/NumberRecognitionModule'));
const PatternsModule = React.lazy(() => import('../modules/PatternsModule'));
const BasicShapesModule = React.lazy(() => import('../modules/BasicShapesModule'));
const PositionalConceptsModule = React.lazy(() => import('../modules/PositionalConceptsModule'));
const IntroToMeasurementModule = React.lazy(() => import('../modules/IntroToMeasurementModule'));
const SimpleGraphsModule = React.lazy(() => import('../modules/SimpleGraphsModule'));
const DyslexiaModule = React.lazy(() => import('../modules/DyslexiaModule'));
const DyscalculiaModule = React.lazy(() => import('../modules/DyscalculiaModule'));
const DysgraphiaModule = React.lazy(() => import('../modules/DysgraphiaModule'));
const VisualAdditionSubtractionModule = React.lazy(() => import('../modules/VisualAdditionSubtractionModule'));
const VerbalArithmeticModule = React.lazy(() => import('../modules/VerbalArithmeticModule'));
const MissingNumberPuzzlesModule = React.lazy(() => import('../modules/MissingNumberPuzzlesModule'));
const SymbolicArithmeticModule = React.lazy(() => import('../modules/SymbolicArithmeticModule'));
const ProblemCreationModule = React.lazy(() => import('../modules/ProblemCreationModule'));


const SettingsPanel: React.FC = () => {
    const { activeTab } = useUI();

    const renderActiveModule = () => {
        switch (activeTab) {
            case 'arithmetic': return <ArithmeticModule />;
            case 'visual-support': return <VisualSupportModule />;
            case 'word-problems': return <WordProblemsModule />;
            case 'fractions': return <FractionsModule />;
            case 'decimals': return <DecimalsModule />;
            case 'place-value': return <PlaceValueModule />;
            case 'rhythmic-counting': return <RhythmicCountingModule />;
            case 'time': return <TimeModule />;
            case 'geometry': return <GeometryModule />;
            case 'measurement': return <MeasurementModule />;
            case 'matching-and-sorting': return <MatchingAndSortingModule />;
            case 'comparing-quantities': return <ComparingQuantitiesModule />;
            case 'number-recognition': return <NumberRecognitionModule />;
            case 'patterns': return <PatternsModule />;
            case 'basic-shapes': return <BasicShapesModule />;
            case 'positional-concepts': return <PositionalConceptsModule />;
            case 'intro-to-measurement': return <IntroToMeasurementModule />;
            case 'simple-graphs': return <SimpleGraphsModule />;
            case 'dyslexia': return <DyslexiaModule />;
            case 'dyscalculia': return <DyscalculiaModule />;
            case 'dysgraphia': return <DysgraphiaModule />;
            case 'visual-addition-subtraction': return <VisualAdditionSubtractionModule />;
            case 'verbal-arithmetic': return <VerbalArithmeticModule />;
            case 'missing-number-puzzles': return <MissingNumberPuzzlesModule />;
            case 'symbolic-arithmetic': return <SymbolicArithmeticModule />;
            case 'problem-creation': return <ProblemCreationModule />;
            default: return <div>Lütfen yukarıdaki menüden bir modül seçin.</div>;
        }
    };

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-48">
                <LoadingIcon className="w-8 h-8" />
            </div>
        }>
            {renderActiveModule()}
        </Suspense>
    );
};

export default SettingsPanel;