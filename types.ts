// FIX: Replaced file content with proper type definitions and exports to resolve circular dependency and missing type errors.

export interface Problem {
    question: string;
    answer: string | number;
    category: string;
    display?: 'inline' | 'vertical-html' | 'long-division-html' | 'flow' | 'table';
    // FIX: Added optional layout property to support different problem layouts like 'given-wanted'.
    layout?: 'default' | 'with-visual-space' | 'given-wanted';
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

export type CarryBorrowPreference = 'mixed' | 'with' | 'without';
export type DivisionType = 'mixed' | 'with-remainder' | 'without-remainder';

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
    autoFit?: boolean;
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
    gradeLevel: number;
    type: FractionsProblemType;
    operation?: FractionsOperation;
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
    autoFit?: boolean;
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
    autoFit?: boolean;
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
    gradeLevel: number;
    type: PlaceValueProblemType;
    digits: number;
    roundingPlace: RoundingPlace;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    autoFit?: boolean;
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
    Comparison = 'comparison',
}

export interface RhythmicCountingSettings {
    digits: number;
    type: RhythmicProblemType;
    step: number;
    direction: 'forward' | 'backward' | 'mixed';
    useMultiplesOnly: boolean;
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
    autoFit?: boolean;
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
    gradeLevel: number;
    type: TimeProblemType;
    difficulty: Difficulty;
    format: '12h' | '24h';
    problemsPerPage: number;
    pageCount: number;
    showClockNumbers: boolean;
    showHourHand: boolean;
    showMinuteHand: boolean;
    useWordProblems: boolean;
    showDigitalTime: boolean;
    showMinuteMarkers: boolean;
    topic: string;
    autoFit?: boolean;
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
    gradeLevel: number;
    type: GeometryProblemType;
    shape?: ShapeType;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    autoFit?: boolean;
}

// --- WORD PROBLEMS ---
export interface WordProblemSettings {
    topic: string;
    gradeLevel: string;
    problemsPerPage: number;
    pageCount: number;
    operationCount: number;
    customPrompt: string;
    sourceModule: string;
    useVisuals: boolean;
    autoFit?: boolean;
    layout?: 'default' | 'with-visual-space' | 'given-wanted';
}

// --- MEASUREMENT ---
export enum MeasurementProblemType {
    LengthConversion = 'length',
    WeightConversion = 'weight',
    VolumeConversion = 'volume',
    Mixed = 'mixed',
}
export interface MeasurementSettings {
    gradeLevel: number;
    type: MeasurementProblemType;
    difficulty: Difficulty;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    useVisuals: boolean;
    topic: string;
    autoFit?: boolean;
}

// --- PRINT SETTINGS ---
export interface PrintSettings {
    layoutMode: 'flow' | 'table';
    rows: number;
    columns: number;
    columnGap: number;
    fontSize: number;
    showHeader: boolean;
    showProblemNumbers: boolean;
    notebookStyle: 'none' | 'lines' | 'grid' | 'dotted';
    borderStyle: 'none' | 'card' | 'solid' | 'dashed' | 'shadow-lift' | 'top-bar-color';
    problemSpacing: number;
    pageMargin: number;
    lineHeight: number;
    scale: number;
    colorTheme: 'black' | 'blue' | 'sepia';
    orientation: 'portrait' | 'landscape';
    textAlign: 'left' | 'center' | 'right';
}

// --- TOAST ---
export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

// --- MATH READINESS ---
export type MathReadinessTheme = 'animals' | 'vehicles' | 'fruits' | 'shapes' | 'mixed' | 'measurement';

// --- Matching & Sorting ---
export enum MatchingType {
    OneToOne = 'one-to-one',
    Shadow = 'shadow',
    ByProperty = 'by-property'
}
export interface MatchingAndSortingSettings {
    type: MatchingType;
    theme: MathReadinessTheme;
    itemCount: number;
    difficulty: 'easy' | 'hard';
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    autoFit?: boolean;
}

// --- Comparing Quantities ---
export enum ComparisonType {
    MoreLess = 'more-less',
    BiggerSmaller = 'bigger-smaller',
    TallerShorter = 'taller-shorter'
}
export interface ComparingQuantitiesSettings {
    type: ComparisonType;
    theme: MathReadinessTheme;
    maxObjectCount: number;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    autoFit?: boolean;
}

// --- Number Recognition ---
export enum NumberRecognitionType {
    CountAndWrite = 'count-and-write',
    CountAndColor = 'count-and-color',
    ConnectTheDots = 'connect-the-dots'
}
export interface NumberRecognitionSettings {
    type: NumberRecognitionType;
    theme: MathReadinessTheme;
    numberRange: '1-5' | '1-10' | '1-20';
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    autoFit?: boolean;
}

// --- Patterns ---
export enum PatternType {
    RepeatingAB = 'repeating-ab',
    RepeatingABC = 'repeating-abc',
    Growing = 'growing'
}
export interface PatternsSettings {
    type: PatternType;
    theme: MathReadinessTheme;
    difficulty: 'easy' | 'hard';
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    autoFit?: boolean;
}

// --- Basic Shapes ---
export enum ShapeRecognitionType {
    ColorShape = 'color-shape',
    MatchObjectShape = 'match-object-shape',
    CountShapes = 'count-shapes'
}
export interface BasicShapesSettings {
    type: ShapeRecognitionType;
    shapes: ShapeType[];
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    autoFit?: boolean;
}

// --- Positional Concepts ---
export enum PositionalConceptType {
    AboveBelow = 'above-below',
    InsideOutside = 'inside-outside',
    LeftRight = 'left-right'
}
export interface PositionalConceptsSettings {
    type: PositionalConceptType;
    theme: MathReadinessTheme;
    itemCount: number;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    autoFit?: boolean;
}

// --- Intro to Measurement ---
export enum IntroMeasurementType {
    CompareLength = 'compare-length',
    CompareWeight = 'compare-weight',
    CompareCapacity = 'compare-capacity',
    NonStandardLength = 'non-standard-length'
}
export interface IntroToMeasurementSettings {
    type: IntroMeasurementType;
    theme: MathReadinessTheme;
    difficulty: 'easy' | 'hard';
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    autoFit?: boolean;
}

// --- Simple Graphs ---
export enum SimpleGraphType {
    Pictograph = 'pictograph',
    BarChart = 'barchart'
}
export interface SimpleGraphsSettings {
    graphType: SimpleGraphType;
    theme: MathReadinessTheme;
    categoryCount: number;
    maxItemCount: number;
    problemsPerPage: number;
    pageCount: number;
    useWordProblems: boolean;
    topic: string;
    autoFit?: boolean;
}

// --- Visual Addition & Subtraction ---
export interface VisualAdditionSubtractionSettings {
    operation: 'addition' | 'subtraction' | 'mixed';
    theme: MathReadinessTheme;
    maxNumber: number;
    problemsPerPage: number;
    pageCount: number;
    autoFit?: boolean;
}

// --- Verbal Arithmetic ---
export interface VerbalArithmeticSettings {
    operation: 'addition' | 'subtraction';
    maxResult: number;
    problemsPerPage: number;
    pageCount: number;
    autoFit?: boolean;
}

// --- Missing Number Puzzles ---
export interface MissingNumberPuzzlesSettings {
    operation: 'addition' | 'subtraction';
    termCount: number;
    maxResult: number;
    problemsPerPage: number;
    pageCount: number;
    autoFit?: boolean;
}

// --- Symbolic Arithmetic ---
export interface SymbolicArithmeticSettings {
    operation: 'addition' | 'subtraction' | 'mixed';
    theme: MathReadinessTheme;
    maxNumber: number;
    problemsPerPage: number;
    pageCount: number;
    autoFit?: boolean;
}

// --- Problem Creation ---
export interface ProblemCreationSettings {
    operation: 'addition' | 'subtraction';
    difficulty: 'easy' | 'medium' | 'hard';
    theme: MathReadinessTheme;
    problemsPerPage: number;
    pageCount: number;
    autoFit?: boolean;
}


// --- DYSLEXIA ---
export type DyslexiaSubModuleType = 'attention-questions' | 'sound-wizard' | 'letter-detective' | 'reading-fluency-coach' | 'comprehension-explorer' | 'vocabulary-explorer' | 'visual-master' | 'word-hunter' | 'spelling-champion' | 'memory-gamer' | 'auditory-writing' | 'interactive-story';
export interface AttentionQuestionSettings { 
    questionType: 'numerical' | 'verbal';
    difficulty: 'easy' | 'medium' | 'hard'; 
    numberRange: '1-50' | '1-100' | '100-999'; 
}
export interface SoundWizardSettings { type: 'rhyme' | 'syllable' | 'blend'; difficulty: 'easy' | 'medium'; wordLength: number; }
export interface LetterDetectiveSettings { letterGroup: 'vowels' | 'common_consonants' | 'tricky_consonants' | 'mixed'; difficulty: 'easy' | 'medium'; }
export interface ReadingFluencyCoachSettings { gradeLevel: string; topic: string; }
export interface ComprehensionExplorerSettings { textLength: 'short' | 'medium' | 'long'; questionType: 'main_idea' | 'inference' | 'vocabulary' | 'mixed'; gradeLevel: string; }
export interface VocabularyExplorerSettings { difficulty: 'easy' | 'medium' | 'hard'; gradeLevel: string; }
export interface VisualMasterSettings { type: 'letter' | 'word'; pair: 'b-d' | 'p-q' | 'm-n' | 'ev-ve' | 'yok-koy' | 'kar-rak' | 'mixed'; }
export interface WordHunterSettings { focus: 'prefix' | 'suffix' | 'root'; difficulty: 'easy' | 'medium'; }
export interface SpellingChampionSettings { difficulty: 'easy' | 'medium' | 'hard'; category: 'common_errors' | 'homophones' | 'mixed'; }
export interface MemoryGamerSettings { type: 'digit_span' | 'word_sequence' | 'sentence_repeat'; sequenceLength: number; }
export interface AuditoryWritingSettings { type: 'single_words' | 'short_sentences'; difficulty: 'easy' | 'medium' | 'hard'; }
export interface InteractiveStorySettings { genre: 'adventure' | 'mystery' | 'fantasy' | 'sci-fi'; gradeLevel: string; }
export interface DyslexiaSettings {
    activeSubModule: DyslexiaSubModuleType;
    problemsPerPage: number;
    pageCount: number;
    autoFit?: boolean;
    attentionQuestions: AttentionQuestionSettings;
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

// --- DYSCALCULIA ---
export type DyscalculiaSubModuleType = 'number-sense' | 'arithmetic-fluency' | 'number-grouping' | 'problem-solving' | 'math-language' | 'time-measurement-geometry' | 'spatial-reasoning' | 'estimation-skills' | 'fractions-decimals-intro' | 'visual-number-representation' | 'visual-arithmetic' | 'interactive-story-dc';
export interface NumberSenseSettings { type: 'compare' | 'order' | 'number-line'; maxNumber: number; }
export interface ArithmeticFluencySettings { operation: 'addition' | 'subtraction' | 'mixed'; difficulty: 'easy' | 'medium'; }
export interface NumberGroupingSettings { maxNumber: number; }
export interface ProblemSolvingSettings { gradeLevel: string; topic: string; }
export interface MathLanguageSettings { type: 'symbol-match' | 'word-to-symbol'; }
export interface TimeMeasurementGeometrySettings { category: 'time' | 'measurement' | 'geometry'; }
export interface SpatialReasoningSettings { type: 'pattern-copy' | 'mental-rotation'; }
export interface EstimationSkillsSettings { type: 'quantity' | 'result'; }
export interface FractionsDecimalsIntroSettings { type: 'visual-match' | 'compare'; }
export interface VisualNumberRepresentationSettings { maxNumber: number; representation: 'dots' | 'blocks' | 'fingers'; }
export interface VisualArithmeticSettings { operation: 'addition' | 'subtraction'; maxNumber: number; }
export interface InteractiveStoryDcSettings { genre: 'market' | 'playground' | 'space'; gradeLevel: string; }
export interface DyscalculiaSettings {
    activeSubModule: DyscalculiaSubModuleType;
    problemsPerPage: number; pageCount: number;
    autoFit?: boolean;
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
export type DysgraphiaSubModuleType = 'fine-motor-skills' | 'letter-formation' | 'letter-form-recognition' | 'legible-writing' | 'picture-sequencing' | 'writing-speed' | 'sentence-construction' | 'punctuation' | 'writing-planning' | 'creative-writing' | 'keyboard-skills' | 'interactive-story-dg';
export interface FineMotorSkillsSettings { type: 'line-trace' | 'shape-trace' | 'maze'; }
export interface LetterFormationSettings { letter: string; case: 'lower' | 'upper' | 'mixed'; }
export interface LetterFormRecognitionSettings { targetLetter: string; difficulty: 'easy' | 'medium'; }
export interface LegibleWritingSettings { type: 'spacing' | 'sizing'; }
export interface PictureSequencingSettings { storyLength: 3 | 4 | 5; topic: string; }
export interface WritingSpeedSettings { duration: 1 | 2 | 5; }
export interface SentenceConstructionSettings { wordCount: number; }
export interface PunctuationSettings { type: 'end-of-sentence' | 'commas'; }
export interface WritingPlanningSettings { topic: string; }
export interface CreativeWritingSettings { promptType: 'story-starter' | 'what-if'; topic: string; }
export interface KeyboardSkillsSettings { level: 'home-row' | 'top-row' | 'full'; }
export interface InteractiveStoryDgSettings { genre: 'journal' | 'adventure' | 'fantasy'; gradeLevel: string; }
export interface DysgraphiaSettings {
    activeSubModule: DysgraphiaSubModuleType;
    problemsPerPage: number; pageCount: number;
    autoFit?: boolean;
    fineMotorSkills: FineMotorSkillsSettings;
    letterFormation: LetterFormationSettings;
    letterFormRecognition: LetterFormRecognitionSettings;
    legibleWriting: LegibleWritingSettings;
    pictureSequencing: PictureSequencingSettings;
    writingSpeed: WritingSpeedSettings;
    sentenceConstruction: SentenceConstructionSettings;
    punctuation: PunctuationSettings;
    writingPlanning: WritingPlanningSettings;
    creativeWriting: CreativeWritingSettings;
    keyboardSkills: KeyboardSkillsSettings;
    interactiveStoryDg: InteractiveStoryDgSettings;
}