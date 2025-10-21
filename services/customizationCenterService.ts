// services/customizationCenterService.ts
import React from 'react';
import {
    AllSettings, ModuleKey, Problem, ArithmeticOperation,
    FractionsProblemType, FractionsOperation, ShapeType,
    PlaceValueProblemType, RhythmicProblemType, GeometryProblemType,
    DecimalsProblemType, TimeProblemType, MeasurementProblemType,
    MatchingType, ComparisonType, NumberRecognitionType, PatternType, ShapeRecognitionType,
    PositionalConceptType, IntroMeasurementType, SimpleGraphType, SimpleGraphTaskType
} from '../types';
import {
    ArithmeticIcon, FractionsIcon, DecimalsIcon, PlaceValueIcon, RhythmicIcon, TimeIcon, GeometryIcon, MeasurementIcon,
    MatchingIcon, ComparingIcon, NumberRecognitionIcon, PatternsIcon, BasicShapesIcon, PositionalConceptsIcon,
    IntroToMeasurementIcon, SimpleGraphsIcon, VisualAdditionSubtractionIcon, VerbalArithmeticIcon, MissingNumberIcon,
    SymbolicArithmeticIcon, ProblemCreationIcon
} from '../components/icons/Icons';
import { generateArithmeticProblem, generateDecimalProblem } from './mathService';
import { generateFractionsProblem } from './fractionsService';
import { generatePlaceValueProblem } from './placeValueService';
import { generateRhythmicCountingProblem } from './rhythmicCountingService';
import { generateGeometryProblem } from './geometryService';
import { generateTimeProblem } from './timeService';
import { generateMeasurementProblem } from './measurementService';
import { generateReadinessProblem } from './readinessService';

type ControlType = 'select' | 'number';
interface Control {
    key: string;
    label: string;
    type: ControlType;
    options?: { value: string | number; label: string }[];
    min?: number;
    max?: number;
}

interface ModuleConfig {
    title: string;
    icon: React.FC;
    controls: Control[];
}

export const moduleConfig: Partial<Record<keyof AllSettings, ModuleConfig>> = {
    arithmetic: {
        title: 'Dört İşlem',
        icon: ArithmeticIcon,
        controls: [
            {
                key: 'gradeLevel', label: 'Sınıf', type: 'select', options: [
                    { value: 1, label: '1. Sınıf' }, { value: 2, label: '2. Sınıf' }, { value: 3, label: '3. Sınıf' }, { value: 4, label: '4. Sınıf' }, { value: 5, label: '5. Sınıf' }
                ]
            },
            {
                key: 'operation', label: 'İşlem', type: 'select', options: [
                    { value: ArithmeticOperation.Addition, label: 'Toplama' }, { value: ArithmeticOperation.Subtraction, label: 'Çıkarma' },
                    { value: ArithmeticOperation.Multiplication, label: 'Çarpma' }, { value: ArithmeticOperation.Division, label: 'Bölme' },
                    { value: ArithmeticOperation.MixedAll, label: 'Karışık' }
                ]
            }
        ]
    },
    fractions: {
        title: 'Kesirler',
        icon: FractionsIcon,
        controls: [
            {
                key: 'type', label: 'Tür', type: 'select', options: [
                    { value: FractionsProblemType.FourOperations, label: 'Dört İşlem' },
                    { value: FractionsProblemType.Recognition, label: 'Şekille Gösterme' },
                    { value: FractionsProblemType.Comparison, label: 'Karşılaştırma' }
                ]
            },
            {
                key: 'difficulty', label: 'Zorluk', type: 'select', options: [
                    { value: 'easy', label: 'Kolay' }, { value: 'medium', label: 'Orta' }, { value: 'hard', label: 'Zor' }
                ]
            }
        ]
    },
    decimals: {
        title: 'Ondalık Sayılar',
        icon: DecimalsIcon,
        controls: [
            {
                key: 'type', label: 'Tür', type: 'select', options: [
                    { value: DecimalsProblemType.FourOperations, label: 'Dört İşlem' },
                    { value: DecimalsProblemType.ReadWrite, label: 'Okuma/Yazma' },
                    { value: DecimalsProblemType.ToFraction, label: 'Kesre Çevirme' }
                ]
            },
            {
                key: 'difficulty', label: 'Zorluk', type: 'select', options: [
                    { value: 'easy', label: 'Kolay' }, { value: 'medium', label: 'Orta' }, { value: 'hard', label: 'Zor' }
                ]
            }
        ]
    },
    placeValue: {
        title: 'Basamak Değeri',
        icon: PlaceValueIcon,
        controls: [
            {
                key: 'type', label: 'Tür', type: 'select', options: [
                    { value: PlaceValueProblemType.Identification, label: 'Değer Bulma' },
                    { value: PlaceValueProblemType.Rounding, label: 'Yuvarlama' },
                    { value: PlaceValueProblemType.ExpandedForm, label: 'Çözümleme' }
                ]
            },
            { key: 'digits', label: 'Basamak', type: 'number', min: 2, max: 7 }
        ]
    },
    rhythmicCounting: {
        title: 'Ritmik Sayma',
        icon: RhythmicIcon,
        controls: [
            {
                key: 'type', label: 'Tür', type: 'select', options: [
                    { value: RhythmicProblemType.Pattern, label: 'Örüntü' },
                    { value: RhythmicProblemType.Ordering, label: 'Sıralama' },
                    { value: RhythmicProblemType.OddEven, label: 'Tek/Çift' }
                ]
            },
            { key: 'step', label: 'Adım', type: 'number', min: 1, max: 100 }
        ]
    },
    time: {
        title: 'Zaman Ölçme',
        icon: TimeIcon,
        controls: [
            {
                key: 'type', label: 'Tür', type: 'select', options: [
                    { value: TimeProblemType.ReadAnalog, label: 'Saat Okuma' },
                    { value: TimeProblemType.Duration, label: 'Süre Hesaplama' },
                    { value: TimeProblemType.UnitConversion, label: 'Birim Dönüştürme' }
                ]
            },
            {
                key: 'difficulty', label: 'Zorluk', type: 'select', options: [
                    { value: 'easy', label: 'Kolay' }, { value: 'medium', label: 'Orta' }, { value: 'hard', label: 'Zor' }
                ]
            }
        ]
    },
    geometry: {
        title: 'Geometri',
        icon: GeometryIcon,
        controls: [
            {
                key: 'type', label: 'Tür', type: 'select', options: [
                    { value: GeometryProblemType.Area, label: 'Alan' },
                    { value: GeometryProblemType.Perimeter, label: 'Çevre' },
                    { value: GeometryProblemType.ShapeRecognition, label: 'Şekil Tanıma' }
                ]
            },
            {
                key: 'shape', label: 'Şekil', type: 'select', options: [
                    { value: ShapeType.Square, label: 'Kare' }, { value: ShapeType.Rectangle, label: 'Dikdörtgen' },
                    { value: ShapeType.Triangle, label: 'Üçgen' }, { value: ShapeType.Circle, label: 'Daire' }
                ]
            }
        ]
    },
    measurement: {
        title: 'Ölçüler',
        icon: MeasurementIcon,
        controls: [
            {
                key: 'type', label: 'Tür', type: 'select', options: [
                    { value: MeasurementProblemType.LengthConversion, label: 'Uzunluk' }, { value: MeasurementProblemType.WeightConversion, label: 'Ağırlık' }, { value: MeasurementProblemType.VolumeConversion, label: 'Hacim' }, { value: MeasurementProblemType.Mixed, label: 'Karışık' }
                ]
            },
             {
                key: 'difficulty', label: 'Zorluk', type: 'select', options: [
                    { value: 'easy', label: 'Kolay' }, { value: 'medium', label: 'Orta' }, { value: 'hard', label: 'Zor' }
                ]
            }
        ]
    },
    matchingAndSorting: {
        title: 'Eşleştirme & Gruplama',
        icon: MatchingIcon,
        controls: [
            { key: 'type', label: 'Tür', type: 'select', options: [{ value: MatchingType.OneToOne, label: 'Bire Bir' }, { value: MatchingType.Shadow, label: 'Gölge' }] },
            { key: 'itemCount', label: 'Nesne', type: 'number', min: 3, max: 8 }
        ]
    },
    comparingQuantities: {
        title: 'Miktar Karşılaştırma',
        icon: ComparingIcon,
        controls: [
            { key: 'type', label: 'Tür', type: 'select', options: [{ value: ComparisonType.MoreLess, label: 'Az/Çok' }, { value: ComparisonType.BiggerSmaller, label: 'Büyük/Küçük' }] },
            { key: 'maxObjectCount', label: 'Max Nesne', type: 'number', min: 3, max: 20 }
        ]
    },
    numberRecognition: {
        title: 'Rakam Tanıma',
        icon: NumberRecognitionIcon,
        controls: [
            { key: 'type', label: 'Tür', type: 'select', options: [{ value: NumberRecognitionType.CountAndWrite, label: 'Say ve Yaz' }, { value: NumberRecognitionType.ConnectTheDots, label: 'Nokta Birleştir' }] },
            { key: 'numberRange', label: 'Aralık', type: 'select', options: [{ value: '1-5', label: '1-5' }, { value: '1-10', label: '1-10' }, { value: '1-20', label: '1-20' }] }
        ]
    },
     patterns: {
        title: 'Örüntüler',
        icon: PatternsIcon,
        controls: [
            { key: 'type', label: 'Tür', type: 'select', options: [{ value: PatternType.RepeatingAB, label: 'AB Tekrar' }, { value: PatternType.RepeatingABC, label: 'ABC Tekrar' }, { value: PatternType.Growing, label: 'Büyüyen' }] },
            { key: 'theme', label: 'Tema', type: 'select', options: [{ value: 'shapes', label: 'Şekiller' }, { value: 'animals', label: 'Hayvanlar' }] }
        ]
    },
    basicShapes: {
        title: 'Temel Şekiller',
        icon: BasicShapesIcon,
        controls: [
            { key: 'type', label: 'Tür', type: 'select', options: [{ value: ShapeRecognitionType.ColorShape, label: 'Şekil Boya' }, { value: ShapeRecognitionType.CountShapes, label: 'Şekil Say' }] },
        ]
    },
    positionalConcepts: {
        title: 'Konum ve Yön',
        icon: PositionalConceptsIcon,
        controls: [
            { key: 'type', label: 'Tür', type: 'select', options: [{ value: PositionalConceptType.AboveBelow, label: 'Üst/Alt' }, { value: PositionalConceptType.LeftRight, label: 'Sağ/Sol' }] },
        ]
    },
    introToMeasurement: {
        title: 'Ölçmeye Giriş',
        icon: IntroToMeasurementIcon,
        controls: [
            { key: 'type', label: 'Tür', type: 'select', options: [{ value: IntroMeasurementType.CompareLength, label: 'Uzunluk' }, { value: IntroMeasurementType.CompareWeight, label: 'Ağırlık' }] },
        ]
    },
    simpleGraphs: {
        title: 'Basit Grafikler',
        icon: SimpleGraphsIcon,
        controls: [
            { key: 'taskType', label: 'Tür', type: 'select', options: [{ value: SimpleGraphTaskType.Create, label: 'Oluştur' }, { value: SimpleGraphTaskType.Read, label: 'Oku' }] },
            { key: 'categoryCount', label: 'Kategori', type: 'number', min: 2, max: 5 },
        ]
    },
    visualAdditionSubtraction: {
        title: 'Görsel Toplama/Çıkarma',
        icon: VisualAdditionSubtractionIcon,
        controls: [
            { key: 'operation', label: 'İşlem', type: 'select', options: [{ value: 'addition', label: '+' }, { value: 'subtraction', label: '-' }] },
            { key: 'maxNumber', label: 'Max Sayı', type: 'number', min: 2, max: 10 },
        ]
    },
    verbalArithmetic: {
        title: 'Sözel Aritmetik',
        icon: VerbalArithmeticIcon,
        controls: [
            { key: 'operation', label: 'İşlem', type: 'select', options: [{ value: 'addition', label: '+' }, { value: 'subtraction', label: '-' }] },
            { key: 'maxResult', label: 'Max Sonuç', type: 'number', min: 5, max: 100 },
        ]
    },
    missingNumberPuzzles: {
        title: 'Eksik Sayıyı Bulma',
        icon: MissingNumberIcon,
        controls: [
            { key: 'operation', label: 'İşlem', type: 'select', options: [{ value: 'addition', label: '+' }, { value: 'subtraction', label: '-' }] },
            { key: 'maxResult', label: 'Max Sonuç', type: 'number', min: 5, max: 20 },
        ]
    },
    symbolicArithmetic: {
        title: 'Simgesel Aritmetik',
        icon: SymbolicArithmeticIcon,
        controls: [
            { key: 'operation', label: 'İşlem', type: 'select', options: [{ value: 'addition', label: '+' }, { value: 'subtraction', label: '-' }] },
            { key: 'maxNumber', label: 'Max Sayı', type: 'number', min: 5, max: 10 },
        ]
    },
    problemCreation: {
        title: 'Problem Kurma',
        icon: ProblemCreationIcon,
        controls: [
            { key: 'operation', label: 'İşlem', type: 'select', options: [{ value: 'addition', label: '+' }, { value: 'subtraction', label: '-' }] },
            { key: 'difficulty', label: 'Zorluk', type: 'select', options: [{ value: 'easy', label: 'Kolay' }, { value: 'medium', label: 'Orta' }] },
        ]
    },
};

export const getModuleStats = (moduleKey: ModuleKey, settings: any): Record<string, string> => {
    switch (moduleKey) {
        case 'arithmetic':
            return {
                "Sayı Aralığı": `${10 ** (settings.digits1 - 1)}-${10 ** settings.digits1 - 1}`,
                "İşlem": settings.operation.replace('-', ' '),
                "Eldeli/Bozmalı": settings.carryBorrow === 'mixed' ? 'Karışık' : (settings.carryBorrow === 'with' ? 'Evet' : 'Hayır'),
            };
        case 'fractions':
            return {
                "Zorluk": { 'easy': 'Kolay (Eşit Payda)', 'medium': 'Orta (Farklı Payda)', 'hard': 'Zor (Tam Sayılı)' }[settings.difficulty] || 'Bilinmiyor',
                "İşlem": settings.operation || 'Yok',
            };
        case 'placeValue':
             return {
                "Sayı Aralığı": `${10 ** (settings.digits - 1)}-${10 ** settings.digits - 1}`,
                "Etkinlik": settings.type,
            };
        case 'rhythmicCounting':
            return {
                "Sayı Aralığı": `${10 ** (settings.digits - 1)}-${10 ** settings.digits - 1}`,
                "Adım": settings.step,
                "Yön": settings.direction === 'forward' ? 'İleri' : 'Geri'
            };
        case 'geometry':
            return {
                "Etkinlik": settings.type === 'Area' ? 'Alan' : 'Çevre',
                "Şekil": settings.shape || 'Seçilmedi'
            };
        case 'measurement':
            return {
                 "Etkinlik": settings.type === 'length' ? 'Uzunluk' : (settings.type === 'weight' ? 'Ağırlık' : 'Hacim'),
                 "Zorluk": settings.difficulty
            }
        case 'comparingQuantities':
            return {
                "Etkinlik": settings.type === 'more-less' ? 'Az/Çok' : 'Büyük/Küçük',
                "En Fazla Nesne": settings.maxObjectCount,
            };
        default:
            return { "Info": "İstatistikler bu modül için mevcut değil." };
    }
};

export const generateModulePreview = async (moduleKey: ModuleKey, settings: any): Promise<{ problem: Problem, title: string } | null> => {
    try {
        switch (moduleKey) {
            case 'arithmetic': return generateArithmeticProblem(settings);
            case 'fractions': return generateFractionsProblem(settings);
            case 'placeValue': return generatePlaceValueProblem(settings);
            case 'rhythmicCounting': return generateRhythmicCountingProblem(settings);
            case 'geometry': return generateGeometryProblem(settings);
            case 'measurement': return generateMeasurementProblem(settings);
            case 'time': return generateTimeProblem(settings);
            case 'decimals': return generateDecimalProblem(settings);
            
            // Readiness modules
            case 'matchingAndSorting': return generateReadinessProblem('matching-and-sorting', settings);
            case 'comparingQuantities': return generateReadinessProblem('comparing-quantities', settings);
            case 'numberRecognition': return generateReadinessProblem('number-recognition', settings);
            case 'patterns': return generateReadinessProblem('patterns', settings);
            case 'basicShapes': return generateReadinessProblem('basic-shapes', settings);
            case 'positionalConcepts': return generateReadinessProblem('positional-concepts', settings);
            case 'introToMeasurement': return generateReadinessProblem('intro-to-measurement', settings);
            case 'simpleGraphs': return generateReadinessProblem('simple-graphs', settings);
            case 'visualAdditionSubtraction': return generateReadinessProblem('visual-addition-subtraction', settings);
            case 'verbalArithmetic': return generateReadinessProblem('verbal-arithmetic', settings);
            case 'missingNumberPuzzles': return generateReadinessProblem('missing-number-puzzles', settings);
            case 'symbolicArithmetic': return generateReadinessProblem('symbolic-arithmetic', settings);
            case 'problemCreation': return generateReadinessProblem('problem-creation', settings);
            
            default: return null;
        }
    } catch (e) {
        console.error("Preview generation failed:", e);
        return { problem: { question: 'Önizleme oluşturulamadı.', answer: '', category: 'error'}, title: 'Hata'};
    }
};