
// types.ts

export interface Problem {
    question: string;
    answer: string | number;
    category: string;
    display?: 'inline' | 'vertical-html' | 'long-division-html' | 'flow' | 'table';
    layout?: 'default' | 'given-wanted' | 'with-visual-space';
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

// --- Arithmetic ---
export enum ArithmeticOperation {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
    MixedAdditionSubtraction = 'mixed-add-sub',
    MixedAll = 'mixed-all'
}

export type CarryBorrowPreference = 'with' | 'without' | 'mixed';
export type DivisionType = 'with-remainder' | 'without-remainder' | 'mixed';

export interface ArithmeticSettings {
    gradeLevel: number;
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
    useVisuals: boolean;
    topic: string;
    autoFit: boolean;
    allowNegativeNumbers: boolean;

    // For voice commands
    n1?: number;
    n2?: number;
    operationOverride?: ArithmeticOperation;
}


// --- Fractions ---
export enum FractionsProblemType {
    FourOperations = 'four-operations',
    Recognition = 'recognition',
    Comparison = 'comparison',
    Equivalent = 'equivalent',
    FractionOfSet = 'fraction-of-set'
}

export enum FractionsOperation {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
    Mixed = 'mixed'
}

export interface FractionsSettings {
    gradeLevel: number;
    type: FractionsProblemType;
    operation: FractionsOperation;
    difficulty: Difficulty;
    maxSetSize: number;
    problemsPerPage: number;
    pageCount: number;
    format: 'inline' | 'vertical-html';
    representation: 'number' | 'word' | 'mixed';
    useWordProblems: boolean;
    operationCount: number;
    useVisuals: boolean;
    topic: string;
    useMixedNumbers: boolean;
    autoFit: boolean;
    visualRepresentation: 'none' | 'pie' | 'line';
}

// --- Decimals ---
export enum DecimalsProblemType {
    FourOperations = 'four-operations',
    ReadWrite = 'read-write',
    ToFraction = 'to-fraction'
}

export enum DecimalsOperation {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
    Mixed = 'mixed'
}

export interface DecimalsSettings {
    gradeLevel: number;
    type: DecimalsProblemType;
    operation?: DecimalsOperation;
    difficulty: Difficulty;
    problemsPerPage: number;
    pageCount: number;
    format: 'inline' | 'vertical-html';
    representation: 'number' | 'word' | 'mixed';
    useWordProblems: boolean;
    operationCount: number;
    useVisuals: boolean;
    topic: string;
    autoFit: boolean;
}


// --- Time ---
export enum TimeProblemType {
    ReadAnalog = 'read-analog',
    DrawTime = 'draw-time',
    Duration = 'duration',
    FindEndTime = 'find-end-time',
    FindStartTime = 'find-start-time',
    UnitConversion = 'unit-conversion',
    Calendar = 'calendar'
}

export type ClockFaceDetail = 'full' | 'no-numbers' | 'no-hands' | 'no-minute-hand';

export interface TimeSettings {
    gradeLevel: number;
    type: TimeProblemType;
    difficulty: Difficulty;
    clockFace: ClockFaceDetail;
    digitalClockDisplay: 'show' | 'box' | 'hide';
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    autoFit: boolean;
}

// --- Place Value ---
export enum PlaceValueProblemType {
    Identification = 'identification',
    Rounding = 'rounding',
    ExpandedForm = 'expanded-form',
    FromExpanded = 'from-expanded',
    FromWords = 'from-words',
    WriteInWords = 'write-in-words',
    WordsToNumber = 'words-to-number',
    Comparison = 'comparison',
    NumberFromClues = 'number-from-clues',
    ResultAsWords = 'result-as-words'
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
    topic: string;
    autoFit: boolean;
    fromWordsOrder: 'ordered' | 'mixed';
    fromWordsFormat: 'inline' | 'vertical';
}

// --- Rhythmic Counting ---
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
    digits: number;
    patternLength: number;
    missingCount: number;
    orderCount: number;
    beforeCount: number;
    afterCount: number;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    orderDirection: 'ascending' | 'descending' | 'mixed';
    autoFit: boolean;
}

// --- Geometry ---
export enum GeometryProblemType {
    // --- 2D Shapes & Properties ---
    ShapeRecognition = 'shape-recognition', // "What is this?" or "Find the circle"
    FindShapesInScene = 'find-shapes-in-scene', // "How many triangles in the robot?"
    ShapeProperties = 'shape-properties', // Count sides/corners of 2D shapes
    TriangleTypes = 'triangle-types', // Visual identification
    AngleTypes = 'angle-types', // Identify acute, right, obtuse
    CountAnglesInShape = 'count-angles-in-shape', // "How many right angles in the house?"
    Symmetry = 'symmetry', // "Is this line of symmetry correct?"
    CompleteSymmetricalShape = 'complete-symmetrical-shape', // Draw the other half

    // --- 2D Measurement ---
    Perimeter = 'perimeter',
    Area = 'area',
    CircleProperties = 'circle-properties',

    // --- 3D Solids & Properties ---
    SolidRecognition = 'solid-recognition',
    SolidElements = 'solid-elements', // faces, edges, vertices
    ShapeNets = 'shape-nets',

    // --- 3D Measurement ---
    Volume = 'volume',
    SurfaceArea = 'surface-area',
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
    Rhombus = 'rhombus',
    Star = 'star'
}

export enum SolidShapeType {
    Cube = 'cube',
    Cuboid = 'cuboid', // Rectangular Prism
    Cylinder = 'cylinder',
    Sphere = 'sphere',
    Cone = 'cone',
    Pyramid = 'pyramid', // Square base pyramid
}

export interface GeometrySettings {
    gradeLevel: number;
    type: GeometryProblemType;
    shape?: ShapeType;
    solidShape?: SolidShapeType;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    autoFit: boolean;
    topic: string;
}

// --- Measurement ---
export enum MeasurementProblemType {
    LengthConversion = 'length',
    WeightConversion = 'weight',
    VolumeConversion = 'volume',
    Mixed = 'mixed'
}

export interface MeasurementSettings {
    gradeLevel: number;
    type: MeasurementProblemType;
    difficulty: Difficulty;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    autoFit: boolean;
    useVisuals: boolean;
    topic: string;
}


// --- Word Problems ---
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
    layout: 'default' | 'with-visual-space' | 'given-wanted';
    digits: string;
    uploadedImage?: string;
}

// --- Visual Support ---
export interface VisualSupportSettings {
    operation: ArithmeticOperation;
    maxNumber: number;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    emojiSize: number;
    numberSize: number;
    boxSize: number;
    theme: MathReadinessTheme;
}

// --- Print Settings ---
export interface PrintSettings {
    layoutMode: 'flow' | 'table';
    rows: number;
    columns: number;
    columnGap: number;
    fontSize: number;
    showHeader: boolean;
    showProblemNumbers: boolean;
    showPageNumbers: boolean;
    notebookStyle: 'none' | 'lines' | 'grid' | 'dotted' | 'handwriting';
    borderStyle: 'none' | 'card' | 'solid' | 'dashed' | 'shadow-lift' | 'top-bar-color';
    problemSpacing: number;
    pageMargin: number;
    lineHeight: number;
    scale: number;
    textColor: string;
    orientation: 'portrait' | 'landscape';
    textAlign: 'left' | 'center' | 'right';
}

// --- Toast ---
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

// --- Math Readiness ---
export type MathReadinessTheme = 'animals' | 'vehicles' | 'fruits' | 'shapes' | 'mixed';

// Matching & Sorting
export enum MatchingType {
    OneToOne = 'one-to-one',
    Shadow = 'shadow',
    ByProperty = 'by-property',
    LetterMatching = 'letter-matching',
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
    topic: string;
    letterSpacing?: number;
    letterHorizontalSpacing?: number;
}

// Comparing Quantities
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
    topic: string;
}

// Number Recognition
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
    topic: string;
}

// Patterns
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
    topic: string;
}

// Basic Shapes
export enum ShapeRecognitionType {
    ColorShape = 'color-shape',
    MatchObjectShape = 'match-object-shape',
    CountShapes = 'count-shapes',
    TraceShape = 'trace-shape',
    ShapeProperties = 'shape-properties',
}
export interface BasicShapesSettings {
    type: ShapeRecognitionType;
    shapes: ShapeType[];
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic: string;
}

// Positional Concepts
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
    topic: string;
}

// Intro to Measurement
export enum IntroMeasurementType {
    CompareLength = 'compare-length',
    CompareWeight = 'compare-weight',
    CompareCapacity = 'compare-capacity',
    NonStandardLength = 'non-standard-length',
}
export interface IntroToMeasurementSettings {
    type: IntroMeasurementType;
    theme: MathReadinessTheme | 'measurement';
    difficulty: Difficulty;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic: string;
}

// Simple Graphs
export enum SimpleGraphActivityType {
    ReadTallyChart = 'read-tally-chart',
    ReadFrequencyTable = 'read-frequency-table',
    ReadObjectGraph = 'read-object-graph',
    ReadColumnGraph = 'read-column-graph',
    CountAndFill = 'count-and-fill',
    ConvertGraph = 'convert-graph',
}

export interface SimpleGraphsSettings {
    activityType: SimpleGraphActivityType;
    theme: MathReadinessTheme | 'custom';
    categoryCount: number;
    maxItemCount: number;
    scale: number;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    useWordProblems: boolean;
    topic: string;
}


// --- Special Learning Modules ---

// Visual Addition/Subtraction (Readiness)
export interface VisualAdditionSubtractionSettings {
    operation: 'addition' | 'subtraction' | 'mixed';
    theme: MathReadinessTheme;
    maxNumber: number;
    problemsPerPage: number;
    pageCount: number;
}

// Verbal Arithmetic (Readiness)
export enum VerbalArithmeticActivityType {
    WriteAsWords = 'write-as-words', // 5 + 3 -> Beş artı üç
    WriteAsMath = 'write-as-math',   // Beş artı üç -> 5 + 3
    Matching = 'matching',           // Match column A with B
    FillInTheBlank = 'fill-in-blank' // 5 ... 3 = 8 (artı/eksi)
}

export interface VerbalArithmeticSettings {
    activityType: VerbalArithmeticActivityType;
    operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
    difficulty: Difficulty; // easy: basic words, medium: sum/diff, hard: visual/word problems logic
    maxResult: number;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
}

// Missing Number Puzzles (Readiness)
export interface MissingNumberPuzzlesSettings {
    operation: 'addition' | 'subtraction';
    termCount: 2 | 3;
    maxResult: number;
    problemsPerPage: number;
    pageCount: number;
}

// Symbolic Arithmetic (Readiness)
export interface SymbolicArithmeticSettings {
    operation: 'addition' | 'subtraction' | 'mixed';
    theme: MathReadinessTheme;
    maxNumber: number;
    problemsPerPage: number;
    pageCount: number;
}

// Problem Creation (Readiness)
export interface ProblemCreationSettings {
    operation: 'addition' | 'subtraction';
    difficulty: Difficulty;
    theme: MathReadinessTheme;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems?: boolean;
    topic?: string;
}

// --- DYSCALCULIA ---
export type DyscalculiaSubModuleType =
  | 'number-sense'
  | 'arithmetic-fluency'
  | 'number-grouping'
  | 'problem-solving'
  | 'math-language'
  | 'time-measurement-geometry'
  | 'spatial-reasoning'
  | 'estimation-skills'
  | 'fractions-decimals-intro'
  | 'visual-number-representation'
  | 'visual-arithmetic'
  | 'interactive-story-dc';

export interface NumberSenseSettings { type: 'compare' | 'order' | 'number-line'; maxNumber: number; }
export interface ArithmeticFluencySettings { operation: 'addition' | 'subtraction' | 'mixed'; difficulty: 'easy' | 'medium'; }
export interface NumberGroupingSettings { maxNumber: number; }
export interface ProblemSolvingSettings { gradeLevel: '1' | '2' | '3'; topic: string; }
export interface MathLanguageSettings { type: 'symbol-match' | 'word-to-symbol'; }
export interface TimeMeasurementGeometrySettings { category: 'time' | 'measurement' | 'geometry'; }
// FIX: Merged two `SpatialReasoningSettings` interfaces into one with optional properties to avoid redeclaration errors.
export interface SpatialReasoningSettings { 
    type?: 'pattern-copy' | 'mental-rotation'; // For Dyscalculia
    mapComplexity?: 'simple' | 'medium'; // For Dyslexia
    task?: 'follow-directions' | 'identify-landmark'; // For Dyslexia
}
export interface EstimationSkillsSettings { type: 'quantity' | 'result'; }
export interface FractionsDecimalsIntroSettings { type: 'visual-match' | 'compare'; }
export interface VisualNumberRepresentationSettings { maxNumber: number; representation: 'dots' | 'blocks' | 'fingers'; }
export interface VisualArithmeticSettings { operation: 'addition' | 'subtraction'; maxNumber: number; }
export interface InteractiveStoryDcSettings { genre: 'market' | 'playground' | 'space'; gradeLevel: '1' | '2' | '3'; generateImage?: boolean; }

export interface DyscalculiaSettings {
    activeSubModule: DyscalculiaSubModuleType;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    numberSense: NumberSenseSettings;
    arithmeticFluency: ArithmeticFluencySettings;
    numberGrouping: NumberGroupingSettings;
    problemSolving: ProblemSolvingSettings;
    mathLanguage: MathLanguageSettings;
    timeMeasurementGeometry: TimeMeasurementGeometrySettings;
    spatialReasoning: SpatialReasoningSettings;
    estimationSkills: EstimationSkillsSettings;
    fractionsDecimalsIntro: FractionsDecimalsIntroSettings;
    visualNumberRepresentation: VisualNumberRepresentationSettings;
    visualArithmetic: VisualArithmeticSettings;
    interactiveStoryDc: InteractiveStoryDcSettings;
}

// --- DYSGRAPHIA ---
export type DysgraphiaSubModuleType =
  | 'number-trace'
  | 'geometric-doodling'
  | 'math-connect-the-dots'
  | 'grid-copy'
  | 'digit-calligraphy'
  | 'symbol-studio'
  | 'word-form-writer'
  | 'cursive-practice-ai'
  | 'listing-the-givens-ai'
  | 'step-by-step-scribe-ai'
  | 'story-problem-creator-ai'
  | 'sentence-unscramble-ai';

export interface NumberTraceSettings { digits: number; isSequence: boolean; }
export interface GeometricDoodlingSettings { shape: 'square' | 'triangle' | 'circle' | 'star' | 'spiral' | 'maze'; }
export interface MathConnectTheDotsSettings { countingType: 'sequential' | 'by-twos' | 'by-fives'; }
export interface GridCopySettings { gridSize: 3 | 4 | 5; complexity: 'easy' | 'medium'; }
export interface DigitCalligraphySettings { digit: number; }
export interface SymbolStudioSettings { symbol: 'plus' | 'minus' | 'multiply' | 'divide' | 'equals'; }
export interface WordFormWriterSettings { digits: number; }
export interface CursivePracticeSettings { contentType: 'letters' | 'words' | 'sentence'; difficulty: 'easy' | 'medium'; }
export interface ListingTheGivensSettings { gradeLevel: number; }
export interface StepByStepScribeSettings { operation: 'addition' | 'subtraction' | 'multiplication'; difficulty: 'easy' | 'medium'; }
export interface StoryProblemCreatorSettings { difficulty: 'easy' | 'medium'; topic: string; }
export interface SentenceUnscrambleSettings { gradeLevel: number; sentenceLength: 'short' | 'medium'; }

export interface DysgraphiaSettings {
    activeSubModule: DysgraphiaSubModuleType;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    numberTrace: NumberTraceSettings;
    geometricDoodling: GeometricDoodlingSettings;
    mathConnectTheDots: MathConnectTheDotsSettings;
    gridCopy: GridCopySettings;
    digitCalligraphy: DigitCalligraphySettings;
    symbolStudio: SymbolStudioSettings;
    wordFormWriter: WordFormWriterSettings;
    cursivePracticeAi: CursivePracticeSettings;
    listingTheGivensAi: ListingTheGivensSettings;
    stepByStepScribeAi: StepByStepScribeSettings;
    storyProblemCreatorAi: StoryProblemCreatorSettings;
    sentenceUnscrambleAi: SentenceUnscrambleSettings;
}
// --- DYSLEXIA (New, Professional Version) ---
// FIX: Updated DyslexiaSubModuleType to match the implemented module IDs, resolving multiple 'not assignable' errors.
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
  | 'interactive-story'
  | 'attention-question'
  | 'map-reading';

export interface PhonologicalAwarenessSettings { type: 'rhyme' | 'syllable' | 'blend'; difficulty: 'easy' | 'medium' | 'hard'; generateImage?: boolean; }
// FIX: Added optional properties `task`, `targetPair`, and `gridDensity` to align with component usage.
export interface LetterSoundSettings { 
    letterGroup: 'vowels' | 'common_consonants' | 'tricky_consonants' | 'mixed'; 
    difficulty: 'easy' | 'medium'; 
    task?: 'find-in-grid' | 'odd-one-out';
    targetPair?: 'b-d' | 'p-q' | 'm-n' | 's-z' | 'f-v' | 'g-ğ' | 'mixed';
    gridDensity?: 'low' | 'medium' | 'high';
}
export interface ReadingFluencySettings { passageType?: 'leveled' | 'decodable'; phonicsPattern?: string; gradeLevel: '1' | '2' | '3' | '4'; topic: string; }
export interface ReadingComprehensionSettings { gradeLevel: '1' | '2' | '3' | '4'; textLength: 'short' | 'medium' | 'long'; questionType: 'main_idea' | 'inference' | 'vocabulary' | 'mixed'; generateImage?: boolean; }
export interface VocabularySettings { task?: 'context' | 'synonym-antonym' | 'visual'; gradeLevel: '1' | '2' | '3' | '4'; difficulty: 'easy' | 'medium' | 'hard'; }
export interface VisualDiscriminationSettings {
    type: 'letter' | 'word';
    task: 'find-all' | 'odd-one-out';
    targetPair: 'b-d' | 'p-q' | 'm-n' | 's-z' | 'f-v' | 'g-ğ' | 'mixed'; 
    gridDensity: 'low' | 'medium' | 'high';
    wordComplexity: 'easy' | 'medium' | 'hard'; 
}
export interface MorphologicalAwarenessSettings { focus: 'prefix' | 'suffix' | 'root'; difficulty: 'easy' | 'medium'; }
export interface SpellingSettings { category: 'common_errors' | 'homophones' | 'mixed'; difficulty: 'easy' | 'medium' | 'hard'; generateImageClue?: boolean; }
export interface WorkingMemorySettings { type: 'digit_span' | 'word_sequence' | 'sentence_repeat'; sequenceLength: number; complexity?: 'easy' | 'medium' | 'hard'; }
export interface AuditoryWritingSettings { type: 'single_words' | 'short_sentences'; difficulty: 'easy' | 'medium' | 'hard'; }
export interface InteractiveStorySettings { genre: 'adventure' | 'mystery' | 'fantasy' | 'sci-fi'; gradeLevel: '2' | '3' | '4' | '5'; withComprehensionChecks: boolean; generateImage?: boolean; }
export interface ExecutiveFunctionSettings { questionType: 'numerical' | 'verbal'; difficulty: 'easy' | 'medium' | 'hard'; numberRange: '1-50' | '1-100' | '100-999'; }
export interface MapReadingSettings { mapType: 'neighborhood' | 'zoo' | 'city'; task: 'find-place' | 'follow-directions'; }

export interface DyslexiaSettings {
    activeSubModule: DyslexiaSubModuleType;
    problemsPerPage: number;
    pageCount: number;
    autoFit: boolean;
    soundWizard: PhonologicalAwarenessSettings;
    letterDetective: LetterSoundSettings;
    readingFluencyCoach: ReadingFluencySettings;
    comprehensionExplorer: ReadingComprehensionSettings;
    vocabularyExplorer: VocabularySettings;
    visualMaster: VisualDiscriminationSettings;
    wordHunter: MorphologicalAwarenessSettings;
    spellingChampion: SpellingSettings;
    memoryGamer: WorkingMemorySettings;
    auditoryWriting: AuditoryWritingSettings;
    interactiveStory: InteractiveStorySettings;
    attentionQuestion: ExecutiveFunctionSettings;
    mapReading: MapReadingSettings;
}