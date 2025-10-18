import React from 'react';

// --- GENERIC ICONS ---

export const LoadingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="animate-spin" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-3.182l-3.181 3.183m0 0l-3.181-3.182m3.181 3.182l3.181 3.183" />
    </svg>
);
export const DoubleArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" /></svg>
);
export const PrintIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6 18.25m0 0h12m-12 0a2.25 2.25 0 01-2.25-2.25v-2.25c0-1.242.758-2.31 1.84-2.656M12 2.25a2.25 2.25 0 012.25 2.25v4.5a2.25 2.25 0 01-4.5 0v-4.5A2.25 2.25 0 0112 2.25z" /></svg>
);
export const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-3.182l-3.181 3.183m0 0l-3.181-3.182m3.181 3.182l3.181 3.183" /></svg>
);
export const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
);
export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
);
export const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
);
export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.481.398.668 1.043.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.331.183-.581.495-.645.87l-.213 1.281c-.09.543-.56.941-1.11.941h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.003-.827c.293-.24.438-.613.438-.995s-.145-.755-.438-.995l-1.003-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.073-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
export const ShuffleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.091 1.21-.138 2.43-.138 3.662m14.862 0A48.678 48.678 0 0112 15.75c-2.672 0-5.316-.213-7.925-.638m14.862 0l-3.181 3.182m3.181-3.182l-3.181-3.182m-12.23 3.182l3.181 3.182M4.5 12.75l3.181-3.182" /></svg>
);
export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
);
export const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402a3.75 3.75 0 00-.625-6.25l-6.402-6.401a3.75 3.75 0 00-5.304 0 3.75 3.75 0 000 5.304l6.402 6.401-6.402 6.402a3.75 3.75 0 000 5.304zm1.13-1.13a2.25 2.25 0 010-3.182l6.401-6.402a2.25 2.25 0 013.182 0l.497.497a2.25 2.25 0 010 3.182l-6.402 6.401a2.25 2.25 0 01-3.182 0l-.497-.497z" /></svg>
);
export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
);
export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
);
export const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
);
export const LoadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 8.25L12 12.75m0 0L7.5 8.25M12 12.75V3" /></svg>
);
export const DeleteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);
export const FavoriteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <HeartIcon {...props} />;
export const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);
export const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);

// --- MODULE-SPECIFIC ICONS (using placeholders for simplicity) ---
const PlaceholderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104l-1.422 1.422a2.25 2.25 0 01-3.182 0l-1.422-1.422A2.25 2.25 0 013.104 1.682l1.422 1.422a2.25 2.25 0 003.182 0l1.422-1.422a2.25 2.25 0 013.182 0l1.422 1.422a2.25 2.25 0 003.182 0l1.422-1.422a2.25 2.25 0 013.182 0l1.422 1.422a2.25 2.25 0 003.182 0l1.422-1.422a2.25 2.25 0 011.422 3.182l-1.422 1.422a2.25 2.25 0 000 3.182l1.422 1.422a2.25 2.25 0 01-3.182 3.182l-1.422-1.422a2.25 2.25 0 00-3.182 0l-1.422 1.422a2.25 2.25 0 01-3.182 0l-1.422-1.422a2.25 2.25 0 00-3.182 0l-1.422 1.422a2.25 2.25 0 01-3.182-3.182l1.422-1.422a2.25 2.25 0 000-3.182L1.682 6.286a2.25 2.25 0 013.182-3.182z" />
    </svg>
);
export const VisualAdditionSubtractionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const VerbalArithmeticIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const MissingNumberIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const SymbolicArithmeticIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const ProblemCreationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const ArithmeticIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const FractionsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const DecimalsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const PlaceValueIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const RhythmicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const TimeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const GeometryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const MeasurementIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const WordProblemsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const VisualSupportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const ReadinessIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const MatchingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const ComparingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const NumberRecognitionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const PatternsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const BasicShapesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const PositionalConceptsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const IntroToMeasurementIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const SimpleGraphsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const SpecialLearningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const DyslexiaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const DyscalculiaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const DysgraphiaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const SoundWizardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const LetterDetectiveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const ReadingFluencyCoachIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const ComprehensionExplorerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const VocabularyExplorerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const VisualMasterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const WordHunterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const SpellingChampionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const MemoryGamerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const AuditoryWritingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const InteractiveStoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const AttentionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const MapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const NumberSenseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const ArithmeticFluencyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const NumberGroupingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const ProblemSolvingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const MathLanguageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const SpatialReasoningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const EstimationSkillsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const FractionsDecimalsIntroIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const VisualNumberRepresentationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const VisualArithmeticIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const FineMotorSkillsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const LetterFormationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const LetterFormRecognitionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const LegibleWritingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const PictureSequencingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const WritingSpeedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const SentenceConstructionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const PunctuationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const WritingPlanningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const CreativeWritingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
export const KeyboardSkillsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <PlaceholderIcon {...props} />;
