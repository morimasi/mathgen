// types.ts

export interface Problem {
    question: string;
    answer: string | number;
    category: string;
    display?: 'inline' | 'vertical-html' | 'long-division-html';
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

// --- ARITHMETIC ---
export enum ArithmeticOperation {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
    MixedAdditionSubtraction = 'mixed-add-sub',
    MixedAll = 'mixed-all',
}

export type CarryBorrowPreference = 'with' | 'without' | 'mixed';
export type DivisionType = 'with-remainder' | 'without-remainder' | 'mixed';

export interface ArithmeticSettings {
    operation: ArithmeticOperation;
    digits1: number;
    digits2: number;
    digits3: number;
    hasThirdNumber: boolean;
    carryBorrow: CarryBorrowPreference;
    divisionType: DivisionType;
    format: 'inline' | 'vertical-html' | 'long-division-html';
    representation: 'number' | 'word' | 'mixed';
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    operationCount: number;
    autoFit: boolean;
    useVisuals?: boolean;
    gradeLevel: number;
    topic?: string;
}

// --- VISUAL SUPPORT ---
export interface VisualSupportSettings {
    operation: ArithmeticOperation;
    maxNumber: number;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    emojiSize: number;
    numberSize: number;
    boxSize: number;
}

// --- MATH READINESS ---
export type MathReadinessTheme = 'animals' | 'vehicles' | 'fruits' | 'shapes' | 'mixed';

export enum MatchingType {
    OneToOne = 'one-to-one',
    Shadow = 'shadow',
    ByProperty = 'by-property',
}
export interface MatchingAndSortingSettings {
    type: MatchingType;
    theme: MathReadinessTheme;
    itemCount: number;
    difficulty: 'easy' | 'medium';
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic?: string;
}

export enum ComparisonType {
    MoreLess = 'more-less',
    BiggerSmaller = 'bigger-smaller',
    TallerShorter = 'taller-shorter',
}
export interface ComparingQuantitiesSettings {
    type: ComparisonType;
    theme: MathReadinessTheme;
    maxObjectCount: number;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic?: string;
}

export enum NumberRecognitionType {
    CountAndWrite = 'count-and-write',
    CountAndColor = 'count-and-color',
    ConnectTheDots = 'connect-the-dots',
}
export interface NumberRecognitionSettings {
    type: NumberRecognitionType;
    theme: MathReadinessTheme;
    numberRange: '1-5' | '1-10' | '1-20';
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic?: string;
}

export enum PatternType {
    RepeatingAB = 'repeating-ab',
    RepeatingABC = 'repeating-abc',
    Growing = 'growing',
}
export interface PatternsSettings {
    type: PatternType;
    theme: MathReadinessTheme;
    difficulty: 'easy' | 'medium' | 'hard';
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic?: string;
}

export enum ShapeRecognitionType {
    ColorShape = 'color-shape',
    MatchObjectShape = 'match-object-shape',
    CountShapes = 'count-shapes',
}
export interface BasicShapesSettings {
    type: ShapeRecognitionType;
    shapes: ShapeType[];
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic?: string;
}

export enum PositionalConceptType {
    AboveBelow = 'above-below',
    InsideOutside = 'inside-outside',
    LeftRight = 'left-right',
}
export interface PositionalConceptsSettings {
    type: PositionalConceptType;
    theme: MathReadinessTheme;
    itemCount: number;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic?: string;
}

export enum IntroMeasurementType {
    CompareLength = 'compare-length',
    CompareWeight = 'compare-weight',
    CompareCapacity = 'compare-capacity',
    NonStandardLength = 'non-standard-length',
}
export interface IntroToMeasurementSettings {
    type: IntroMeasurementType;
    theme: MathReadinessTheme;
    difficulty: 'easy' | 'medium';
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic?: string;
}

export enum SimpleGraphType {
    Pictograph = 'pictograph',
    BarChart = 'bar-chart',
}
export interface SimpleGraphsSettings {
    graphType: SimpleGraphType;
    theme: MathReadinessTheme;
    categoryCount: number;
    maxItemCount: number;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic?: string;
}


// --- FRACTIONS ---
export enum FractionsProblemType {
    FourOperations = 'four-operations',
    Recognition = 'recognition',
    Comparison = 'comparison',
    Equivalent = 'equivalent',
    FractionOfSet = 'fraction-of-set',
}

export enum FractionsOperation {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
    Mixed = 'mixed',
}

export interface FractionsSettings {
    type: FractionsProblemType;
    operation?: FractionsOperation;
    difficulty?: Difficulty;
    maxSetSize?: number;
    problemsPerPage: number;
    pageCount: number;
    format?: 'inline' | 'vertical-html';
    representation?: 'number' | 'word' | 'mixed';
    useWordProblems: boolean;
    operationCount: number;
    autoFit: boolean;
    useVisuals?: boolean;
    gradeLevel: number;
    topic?: string;
    useMixedNumbers?: boolean;
}

// --- DECIMALS ---
export enum DecimalsProblemType {
    FourOperations = 'four-operations',
    ReadWrite = 'read-write',
    ToFraction = 'to-fraction',
}

export enum DecimalsOperation {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
    Mixed = 'mixed',
}

export interface DecimalsSettings {
    type: DecimalsProblemType;
    operation?: DecimalsOperation;
    difficulty?: Difficulty;
    problemsPerPage: number;
    pageCount: number;
    format?: 'inline' | 'vertical-html';
    representation?: 'number' | 'word' | 'mixed';
    useWordProblems: boolean;
    operationCount: number;
    autoFit: boolean;
    useVisuals?: boolean;
    gradeLevel: number;
    topic?: string;
}

// --- PLACE VALUE ---
export enum PlaceValueProblemType {
    Identification = 'identification',
    Rounding = 'rounding',
    ExpandedForm = 'expanded-form',
    FromExpanded = 'from-expanded',
    WriteInWords = 'write-in-words',
    WordsToNumber = 'words-to-number',
    Comparison = 'comparison',
    ResultAsWords = 'result-as-words',
}

export type RoundingPlace = 'auto' | 'tens' | 'hundreds' | 'thousands';

export interface PlaceValueSettings {
    type: PlaceValueProblemType;
    digits: number;
    roundingPlace: RoundingPlace;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    autoFit: boolean;
    gradeLevel: number;
    topic?: string;
}

// --- RHYTHMIC COUNTING ---
export enum RhythmicProblemType {
    Pattern = 'pattern',
    FindRule = 'find-rule',
    PracticeSheet = 'practice-sheet',
    FillBeforeAfter = 'fill-before-after',
    FillBetween = 'fill-between',
    OddEven = 'odd-even',
    Ordering = 'ordering',
    Comparison = 'comparison'
}

export interface RhythmicCountingSettings {
    type: RhythmicProblemType;
    step: number;
    direction: 'forward' | 'backward' | 'mixed';
    useMultiplesOnly: boolean;
    min: number;
    max: number;
    patternLength: number;
    missingCount: number;
    orderCount: number;
    orderDigits: number;
    beforeCount: number;
    afterCount: number;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    autoFit: boolean;
    gradeLevel: number;
    topic?: string;
    orderDirection?: 'ascending' | 'descending' | 'mixed';
}

// --- TIME ---
export enum TimeProblemType {
    ReadClock = 'read-clock',
    CalculateDuration = 'calculate-duration',
    CalculateEndTime = 'calculate-end-time',
    FindStartTime = 'find-start-time',
    ConvertUnits = 'convert-units',
    Calendar = 'calendar',
}

export interface TimeSettings {
    type: TimeProblemType;
    difficulty: Difficulty;
    format: '12h' | '24h';
    problemsPerPage: number;
    pageCount: number;
    showClockNumbers: boolean;
    showHourHand: boolean;
    showMinuteHand: boolean;
    useWordProblems: boolean;
    autoFit: boolean;
    showDigitalTime: boolean;
    showMinuteMarkers: boolean;
    gradeLevel: number;
    topic?: string;
}

// --- GEOMETRY ---
export enum GeometryProblemType {
    Perimeter = 'perimeter',
    Area = 'area',
    ShapeRecognition = 'shape-recognition',
    AngleInfo = 'angle-info',
    Symmetry = 'symmetry',
    SolidRecognition = 'solid-recognition',
    SolidElements = 'solid-elements',
}

export enum ShapeType {
    Square = 'square',
    Rectangle = 'rectangle',
    Triangle = 'triangle',
    Circle = 'circle',
    Parallelogram = 'parallelogram',
    Trapezoid = 'trapezoid',
    Pentagon = 'pentagon',
    Hexagon = 'hexagon',
}

export interface GeometrySettings {
    type: GeometryProblemType;
    shape?: ShapeType;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    autoFit: boolean;
    gradeLevel: number;
    topic?: string;
}

// --- MEASUREMENT ---
export enum MeasurementProblemType {
    LengthConversion = 'length-conversion',
    WeightConversion = 'weight-conversion',
    VolumeConversion = 'volume-conversion',
    Mixed = 'mixed',
}

export interface MeasurementSettings {
    type: MeasurementProblemType;
    difficulty: Difficulty;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    autoFit: boolean;
    useVisuals?: boolean;
    gradeLevel: number;
    topic?: string;
}


// --- WORD PROBLEMS (AI) ---
export interface WordProblemSettings {
    topic: string;
    gradeLevel: string;
    problemsPerPage: number;
    pageCount: number;
    operationCount: number;
    customPrompt: string;
    autoFit: boolean;
    sourceModule?: string;
    useVisuals?: boolean;
}

// --- PRINTING ---
export interface PrintSettings {
    layoutMode: 'flow' | 'table';
    rows: number;
    columns: number;
    columnGap: number;
    fontSize: number;
    showHeader: boolean;
    showProblemNumbers: boolean;
    notebookStyle: 'none' | 'lines' | 'grid' | 'dotted';
    borderStyle: 'none' | 'card' | 'solid' | 'dashed' | 'dotted' | 'double' | 'shadow-lift' | 'corner-accent' | 'top-bar-color' | 'stitched-edge' | 'double-frame';
    problemSpacing: number;
    pageMargin: number;
    lineHeight: number;
    scale: number;
    colorTheme: 'black' | 'blue' | 'sepia';
    orientation: 'portrait' | 'landscape';
    textAlign: 'left' | 'center' | 'right';
}

// --- UI ---
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}