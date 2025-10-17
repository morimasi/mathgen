// types.ts

export interface Problem {
    question: string;
    answer: string | number;
    category: string;
    display?: 'inline' | 'vertical-html' | 'long-division-html' | string;
}

export type LayoutMode = 'flow' | 'table';
export type ColorTheme = 'black' | 'blue' | 'sepia';
export type Orientation = 'portrait' | 'landscape';
export type NotebookStyle = 'none' | 'lines' | 'grid' | 'dotted';
export type BorderStyle = 'none' | 'card' | 'solid' | 'dashed' | 'shadow-lift' | 'top-bar-color';
export type TextAlign = 'left' | 'center' | 'right';

export interface PrintSettings {
    layoutMode: LayoutMode;
    rows: number;
    columns: number;
    columnGap: number;
    fontSize: number;
    showHeader: boolean;
    showProblemNumbers: boolean;
    notebookStyle: NotebookStyle;
    borderStyle: BorderStyle;
    problemSpacing: number;
    pageMargin: number;
    lineHeight: number;
    scale: number;
    colorTheme: ColorTheme;
    orientation: Orientation;
    textAlign: TextAlign;
}

export enum ArithmeticOperation {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
    MixedAdditionSubtraction = 'mixed-add-sub',
    MixedAll = 'mixed-all',
}

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

export type CarryBorrowPreference = 'mixed' | 'with' | 'without';
export type DivisionType = 'mixed' | 'with-remainder' | 'without-remainder';
export type ProblemFormat = 'inline' | 'vertical-html' | 'long-division-html';
export type Representation = 'number' | 'word' | 'mixed';

export interface ArithmeticSettings {
    gradeLevel: number;
    operation: ArithmeticOperation;
    digits1: number;
    digits2: number;
    digits3: number;
    hasThirdNumber: boolean;
    carryBorrow: CarryBorrowPreference;
    divisionType: DivisionType;
    format: ProblemFormat;
    representation: Representation;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    operationCount: number;
    autoFit: boolean;
    useVisuals?: boolean;
    topic?: string;
}

export enum DecimalsOperation {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
    Mixed = 'mixed',
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export enum DecimalsProblemType {
    FourOperations = 'four-operations',
    ReadWrite = 'read-write',
    ToFraction = 'to-fraction',
}

export interface DecimalsSettings {
    gradeLevel: number;
    type: DecimalsProblemType;
    operation?: DecimalsOperation;
    difficulty: Difficulty;
    problemsPerPage: number;
    pageCount: number;
    format: 'inline' | 'vertical-html';
    representation: Representation;
    useWordProblems: boolean;
    operationCount: number;
    autoFit: boolean;
    useVisuals?: boolean;
    topic?: string;
}

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
    gradeLevel: number;
    type: FractionsProblemType;
    operation?: FractionsOperation;
    difficulty: Difficulty;
    maxSetSize?: number;
    problemsPerPage: number;
    pageCount: number;
    format: 'inline' | 'vertical-html';
    representation: Representation;
    useWordProblems: boolean;
    operationCount: number;
    autoFit: boolean;
    useVisuals?: boolean;
    topic?: string;
    useMixedNumbers?: boolean;
}

export enum TimeProblemType {
    ReadClock = 'read-clock',
    CalculateDuration = 'calculate-duration',
    CalculateEndTime = 'calculate-end-time',
    FindStartTime = 'find-start-time',
    ConvertUnits = 'convert-units',
    Calendar = 'calendar',
}

export interface TimeSettings {
    gradeLevel: number;
    type: TimeProblemType;
    difficulty: Difficulty;
    format: '12h' | '24h';
    problemsPerPage: number;
    pageCount: number;
    showClockNumbers: boolean;
    showHourHand: boolean;
    showMinuteHand: boolean;
    showDigitalTime: boolean;
    showMinuteMarkers: boolean;
    useWordProblems: boolean;
    autoFit: boolean;
    topic?: string;
}

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
    gradeLevel: number;
    type: PlaceValueProblemType;
    digits: number;
    roundingPlace: RoundingPlace;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    autoFit: boolean;
    topic?: string;
}

export enum RhythmicProblemType {
    Pattern = 'pattern',
    FindRule = 'find-rule',
    PracticeSheet = 'practice-sheet',
    FillBeforeAfter = 'fill-before-after',
    FillBetween = 'fill-between',
    OddEven = 'odd-even',
    Ordering = 'ordering',
    Comparison = 'comparison',
}

export interface RhythmicCountingSettings {
    gradeLevel: number;
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
    topic?: string;
    orderDirection: 'ascending' | 'descending' | 'mixed';
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

export enum GeometryProblemType {
    ShapeRecognition = 'shape-recognition',
    Perimeter = 'perimeter',
    Area = 'area',
    AngleInfo = 'angle-info',
    Symmetry = 'symmetry',
    SolidRecognition = 'solid-recognition',
    SolidElements = 'solid-elements',
}

export interface GeometrySettings {
    gradeLevel: number;
    type: GeometryProblemType;
    shape?: ShapeType;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    autoFit: boolean;
    topic?: string;
}

export interface WordProblemSettings {
    topic: string;
    gradeLevel: string;
    problemsPerPage: number;
    pageCount: number;
    operationCount: number;
    customPrompt: string;
    autoFit: boolean;
    sourceModule: string;
    useVisuals: boolean;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

export type MathReadinessTheme = 'mixed' | 'animals' | 'vehicles' | 'fruits' | 'shapes' | 'measurement';

export enum MatchingType {
    OneToOne = 'one-to-one',
    Shadow = 'shadow',
    ByProperty = 'by-property',
}

export interface MatchingAndSortingSettings {
    type: MatchingType;
    theme: MathReadinessTheme;
    itemCount: number;
    difficulty: Difficulty;
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
    difficulty: Difficulty;
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
    difficulty: Difficulty;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic?: string;
}

export enum SimpleGraphType {
    Pictograph = 'pictograph',
    BarChart = 'barchart',
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

export enum MeasurementProblemType {
    LengthConversion = 'length-conversion',
    WeightConversion = 'weight-conversion',
    VolumeConversion = 'volume-conversion',
    Mixed = 'mixed',
}

export interface MeasurementSettings {
    gradeLevel: number;
    type: MeasurementProblemType;
    difficulty: Difficulty;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    autoFit: boolean;
    useVisuals?: boolean;
    topic?: string;
}


// DYSLEXIA
export type DyslexiaSubModuleType =
    | 'sound-wizard'
    | 'letter-detective'
    | 'reading-fluency-coach'
    | 'comprehension-explorer'
    | 'vocabulary-explorer'
    | 'visual-master'
    | 'word-hunter'
    | 'spelling-champion'
    | 'memory-gamer'
    | 'auditory-writing'
    | 'interactive-story';

export interface SoundWizardSettings {
    type: 'rhyme' | 'syllable' | 'blend';
    difficulty: 'easy' | 'medium';
    wordLength: number;
}
export interface LetterDetectiveSettings {
    letterGroup: 'vowels' | 'common_consonants' | 'tricky_consonants' | 'mixed';
    difficulty: 'easy' | 'medium';
}
export interface ReadingFluencyCoachSettings {
    gradeLevel: string;
    topic: string;
}
export interface ComprehensionExplorerSettings {
    textLength: 'short' | 'medium' | 'long';
    questionType: 'main_idea' | 'inference' | 'vocabulary' | 'mixed';
    gradeLevel: string;
}
export interface VocabularyExplorerSettings {
    difficulty: 'easy' | 'medium' | 'hard';
    gradeLevel: string;
}
export interface VisualMasterSettings {
    type: 'letter' | 'word';
    pair: 'b-d' | 'p-q' | 'm-n' | 'ev-ve' | 'yok-koy' | 'kar-rak' | 'mixed';
}
export interface WordHunterSettings {
    focus: 'prefix' | 'suffix' | 'root';
    difficulty: 'easy' | 'medium';
}
export interface SpellingChampionSettings {
    difficulty: 'easy' | 'medium' | 'hard';
    category: 'common_errors' | 'homophones' | 'mixed';
}
export interface MemoryGamerSettings {
    type: 'digit_span' | 'word_sequence' | 'sentence_repeat';
    sequenceLength: number;
}
export interface AuditoryWritingSettings {
    type: 'single_words' | 'short_sentences';
    difficulty: 'easy' | 'medium' | 'hard';
}
export interface InteractiveStorySettings {
    genre: 'adventure' | 'mystery' | 'fantasy' | 'sci-fi';
    gradeLevel: string;
}

export interface DyslexiaSettings {
    activeSubModule: DyslexiaSubModuleType;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    soundWizard: SoundWizardSettings;
    letterDetective: LetterDetectiveSettings;
    readingFluencyCoach: ReadingFluencyCoachSettings;
    comprehensionExplorer: ComprehensionExplorerSettings;
    vocabularyExplorer: VocabularyExplorerSettings;
    visualMaster: VisualMasterSettings;
    wordHunter: WordHunterSettings;
    spellingChampion: SpellingChampionSettings;
    memoryGamer: MemoryGamerSettings;
    auditoryWriting: AuditoryWritingSettings;
    interactiveStory: InteractiveStorySettings;
}
