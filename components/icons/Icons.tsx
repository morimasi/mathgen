import React from 'react';

const GenericIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w.org/2000/svg" {...props}>
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
    </svg>
);

export const MicrophoneOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
        <line x1="12" y1="19" x2="12" y2="23" />
    </svg>
);


export const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

export const MoreVerticalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
);

export const LoadingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" {...props}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
);
export const DoubleArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
);
export const PrintIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
);
export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);
export const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/></svg>
);
export const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
);
export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);
export const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
export const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
);
export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
export const ClipboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
);
export const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>
);

export const VisualAdditionSubtractionIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const VerbalArithmeticIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const MissingNumberIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const SymbolicArithmeticIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const ProblemCreationIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const ArithmeticIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const FractionsIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const DecimalsIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const PlaceValueIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const RhythmicIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const TimeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
export const GeometryIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const MeasurementIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const WordProblemsIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const VisualSupportIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>);
export const ReadinessIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const MatchingIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const ComparingIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const NumberRecognitionIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const PatternsIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const BasicShapesIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const PositionalConceptsIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const IntroToMeasurementIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const SimpleGraphsIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const SpecialLearningIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const DyslexiaIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const DyscalculiaIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const DysgraphiaIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const ShuffleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2l.7 1.2c.7 1.3 2.1 2.2 3.6 2.2h3.2"/><path d="m18 22-4-4 4-4"/></svg>);
export const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>);
export const LoadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
export const DeleteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>);
export const FavoriteIcon: React.FC<React.SVGProps<SVGSVGElement>> = HeartIcon;
export const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>);
export const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>);
export const SoundWizardIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const LetterDetectiveIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const ReadingFluencyCoachIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const ComprehensionExplorerIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const VocabularyExplorerIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const VisualMasterIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const WordHunterIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const SpellingChampionIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const MemoryGamerIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const AuditoryWritingIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const InteractiveStoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const AttentionIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const MapIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const NumberSenseIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const ArithmeticFluencyIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const NumberGroupingIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const ProblemSolvingIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const MathLanguageIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const SpatialReasoningIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const EstimationSkillsIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const FractionsDecimalsIntroIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const VisualNumberRepresentationIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const VisualArithmeticIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const FineMotorSkillsIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const LetterFormationIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const LetterFormRecognitionIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const LegibleWritingIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const PictureSequencingIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const WritingSpeedIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const SentenceConstructionIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const PunctuationIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const WritingPlanningIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const CreativeWritingIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const KeyboardSkillsIcon: React.FC<React.SVGProps<SVGSVGElement>> = GenericIcon;
export const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.424-.16-.833-.437-1.145-.375-.427-.92-.688-1.43-.886-.424-.167-.847-.278-1.282-.278a3.989 3.989 0 0 1-1.642-.354c-.557-.224-1.054-.533-1.442-.917-.424-.424-.688-.92-.886-1.43-.224-.557-.354-1.054-.354-1.642s.13-1.085.354-1.642c.198-.51.462-1.008.886-1.43.384-.384.885-.693 1.442-.917.557-.224 1.054-.354 1.642-.354.435 0 .858.111 1.282.278.51.198 1.055.459 1.43.886.277.312.437.72.437 1.145C22 17.5 17.5 22 12 22"/></svg>);
export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>);
export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>);
export { XIcon as CloseIcon };