import React from 'react';
import { useUI } from '../services/UIContext.tsx';
import LoadingDaisy from './LoadingDaisy.tsx';

// Lazy load modules
const ArithmeticModule = React.lazy(() => import('../modules/ArithmeticModule.tsx'));
const FractionsModule = React.lazy(() => import('../modules/FractionsModule.tsx'));
const DecimalsModule = React.lazy(() => import('../modules/DecimalsModule.tsx'));
const PlaceValueModule = React.lazy(() => import('../modules/PlaceValueModule.tsx'));
const RhythmicCountingModule = React.lazy(() => import('../modules/RhythmicCountingModule.tsx'));
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
const IntroToMeasurementModule = React.lazy(() => import('../modules/IntroToMeasurementModule.tsx'));
const SimpleGraphsModule = React.lazy(() => import('../modules/SimpleGraphsModule.tsx'));
const VisualAdditionSubtractionModule = React.lazy(() => import('../modules/VisualAdditionSubtractionModule.tsx'));
const VerbalArithmeticModule = React.lazy(() => import('../modules/VerbalArithmeticModule.tsx'));
const MissingNumberPuzzlesModule = React.lazy(() => import('../modules/MissingNumberPuzzlesModule.tsx'));
const SymbolicArithmeticModule = React.lazy(() => import('../modules/SymbolicArithmeticModule.tsx'));
const ProblemCreationModule = React.lazy(() => import('../modules/ProblemCreationModule.tsx'));
const DyslexiaModule = React.lazy(() => import('../modules/DyslexiaModule.tsx'));
const DyscalculiaModule = React.lazy(() => import('../modules/DyscalculiaModule.tsx'));
const DysgraphiaModule = React.lazy(() => import('../modules/DysgraphiaModule.tsx'));


// FIX: Changed type from React.FC<{}> to React.ComponentType<any> to match the return type of React.lazy.
const moduleMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<any>> } = {
    'arithmetic': ArithmeticModule,
    'fractions': FractionsModule,
    'decimals': DecimalsModule,
    'place-value': PlaceValueModule,
    'rhythmic-counting': RhythmicCountingModule,
    'time': TimeModule,
    'geometry': GeometryModule,
    'measurement': MeasurementModule,
    'word-problems': WordProblemsModule,
    'visual-support': VisualSupportModule,
    'matching-and-sorting': MatchingAndSortingModule,
    'comparing-quantities': ComparingQuantitiesModule,
    'number-recognition': NumberRecognitionModule,
    'patterns': PatternsModule,
    'basic-shapes': BasicShapesModule,
    'positional-concepts': PositionalConceptsModule,
    'intro-to-measurement': IntroToMeasurementModule,
    'simple-graphs': SimpleGraphsModule,
    'visual-addition-subtraction': VisualAdditionSubtractionModule,
    'verbal-arithmetic': VerbalArithmeticModule,
    'missing-number-puzzles': MissingNumberPuzzlesModule,
    'symbolic-arithmetic': SymbolicArithmeticModule,
    'problem-creation': ProblemCreationModule,
    'dyslexia': DyslexiaModule,
    'dyscalculia': DyscalculiaModule,
    'dysgraphia': DysgraphiaModule,
};

const SettingsPanel: React.FC = () => {
    const { activeTab } = useUI();
    const ActiveModule = moduleMap[activeTab];

    if (!ActiveModule) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-stone-500">Lütfen geçerli bir modül seçin.</p>
            </div>
        );
    }

    return (
        <React.Suspense fallback={<div className="flex justify-center items-center h-full"><LoadingDaisy /></div>}>
            <ActiveModule />
        </React.Suspense>
    );
};

export default SettingsPanel;