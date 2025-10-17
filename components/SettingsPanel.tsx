
import React from 'react';
import { useUI } from '../services/UIContext';

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
import BasicShapesModule from '../modules/BasicShapesModule';
import PatternsModule from '../modules/PatternsModule';
import PositionalConceptsModule from '../modules/PositionalConceptsModule';
import IntroToMeasurementModule from '../modules/IntroToMeasurementModule';
import SimpleGraphsModule from '../modules/SimpleGraphsModule';

import DyslexiaModule from '../modules/DyslexiaModule';
import DyscalculiaModule from '../modules/DyscalculiaModule';
import DysgraphiaModule from '../modules/DysgraphiaModule';


const SettingsPanel: React.FC = () => {
    const { activeTab } = useUI();

    switch (activeTab) {
        // Okul Hazırbulunuşluğu
        case 'matching-and-sorting':
            return <MatchingAndSortingModule />;
        case 'comparing-quantities':
            return <ComparingQuantitiesModule />;
        case 'number-recognition':
            return <NumberRecognitionModule />;
        case 'basic-shapes':
            return <BasicShapesModule />;
        case 'patterns':
            return <PatternsModule />;
        case 'positional-concepts':
            return <PositionalConceptsModule />;
        case 'intro-to-measurement':
            return <IntroToMeasurementModule />;
        case 'simple-graphs':
            return <SimpleGraphsModule />;

        // Sayılar ve İşlemler
        case 'visual-support':
            return <VisualSupportModule />;
        case 'arithmetic':
            return <ArithmeticModule />;
        case 'fractions':
            return <FractionsModule />;
        case 'decimals':
            return <DecimalsModule />;
        case 'place-value':
            return <PlaceValueModule />;
        case 'rhythmic-counting':
            return <RhythmicCountingModule />;
        
        // Ölçme ve Geometri
        case 'time':
            return <TimeModule />;
        case 'geometry':
            return <GeometryModule />;
        case 'measurement':
            return <MeasurementModule />;

        // Problem Çözme
        case 'word-problems':
            return <WordProblemsModule />;

        // Öğrenme Güçlükleri
        case 'dyslexia':
            return <DyslexiaModule />;
        case 'dyscalculia':
            return <DyscalculiaModule />;
        case 'dysgraphia':
            return <DysgraphiaModule />;
            
        default:
            return <div>Select a module</div>;
    }
};

export default SettingsPanel;
