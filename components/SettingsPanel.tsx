import React, { Suspense } from 'react';
import { useUI } from '../services/UIContext.tsx';
// FIX: Add .tsx extension to import path
import { LoadingIcon } from './icons/Icons.tsx';

// Lazily import all module components for code-splitting
// FIX: Added file extensions (.tsx) to all lazy-loaded module imports to resolve module resolution errors.
const ArithmeticModule = React.lazy(() => import('../modules/ArithmeticModule.tsx'));
const FractionsModule = React.lazy(() => import('../modules/FractionsModule.tsx'));
const DecimalsModule = React.lazy(() => import('../modules/DecimalsModule.tsx'));
const PlaceValueModule = React.lazy(() => import('../modules/PlaceValueModule.tsx'));
// FIX: Changed to a named import to resolve a type error with React.lazy.
const RhythmicCountingModule = React.lazy(() => import('../modules/RhythmicCountingModule.tsx').then(module => ({ default: module.RhythmicCountingModule })));
// FIX: Add .tsx extension to import path
const TimeModule = React.lazy(() => import('../modules/TimeModule.tsx'));
const GeometryModule = React.lazy(() => import('../modules/GeometryModule.tsx'));
const MeasurementModule = React.lazy(() => import('../modules/MeasurementModule.tsx'));
const WordProblemsModule = React.lazy(() => import('../modules/WordProblemsModule.tsx'));
const VisualSupportModule = React.lazy(() => import('../modules/VisualSupportModule.tsx'));
const MatchingAndSortingModule = React.lazy(() => import('../modules/MatchingAndSortingModule.tsx'));
const ComparingQuantitiesModule = React.lazy(() => import('../modules/ComparingQuantitiesModule.tsx'));
const NumberRecognitionModule = React.lazy(() => import('../modules/NumberRecognitionModule.tsx'));
const PatternsModule = React.lazy(() => import('../modules/PatternsModule.tsx'));
const BasicShapesModule = React.lazy(() => import('../modules/BasicShapesModule.tsx'));
const PositionalConceptsModule = React.lazy(() => import('../modules/PositionalConceptsModule.tsx'));
// FIX: Changed to a named import for IntroToMeasurementModule to resolve a type error with React.lazy, similar to the fix for RhythmicCountingModule.
const IntroToMeasurementModule = React.lazy(() => import('../modules/IntroToMeasurementModule.tsx').then(module => ({ default: module.IntroToMeasurementModule })));
const SimpleGraphsModule = React.lazy(() => import('../modules/SimpleGraphsModule.tsx'));
const DyslexiaModule = React.lazy(() => import('../modules/DyslexiaModule.tsx'));
const DyscalculiaModule = React.lazy(() => import('../modules/DyscalculiaModule.tsx'));
const DysgraphiaModule = React.lazy(() => import('../modules/DysgraphiaModule.tsx'));
const VisualAdditionSubtractionModule = React.lazy(() => import('../modules/VisualAdditionSubtractionModule.tsx'));
const VerbalArithmeticModule = React.lazy(() => import('../modules/VerbalArithmeticModule.tsx'));
const MissingNumberPuzzlesModule = React.lazy(() => import('../modules/MissingNumberPuzzlesModule.tsx'));
const SymbolicArithmeticModule = React.lazy(() => import('../modules/SymbolicArithmeticModule.tsx'));
// FIX: Correctly handle default export with React.lazy to fix type error.
const ProblemCreationModule = React.lazy(() => import('../modules/ProblemCreationModule.tsx'));


const SettingsPanel: React.FC = () => {
    const { activeTab } = useUI();

    const renderActiveModule = () => {
        switch (activeTab) {
            case 'arithmetic': return <ArithmeticModule />;
            case 'visual-support': return <VisualSupportModule />;
            case 'word-problems': return <WordProblemsModule />;
            case 'problem-creation': return <ProblemCreationModule />;
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