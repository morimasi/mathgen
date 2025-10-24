

import React from 'react';

// Common props for icons to pass down
type IconProps = React.SVGProps<SVGSVGElement>;

// This is a fallback icon, but it shouldn't be used if all icons are implemented.
const DummyIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ children, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        {children}
    </svg>
);

export const ArithmeticIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="8" x2="12" y2="16" /></IconWrapper>;
export const FractionsIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M5 8h14M5 16h14M8 4l8 8-8 8" /></IconWrapper>;
export const DecimalsIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M12 12h.01M7 12h.01M17 12h.01" /></IconWrapper>;
export const PlaceValueIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M4 4h16v2H4zM4 18h16v2H4zM8 8v8M12 8v8M16 8v8" /><circle cx="8" cy="10" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r="2" fill="currentColor" stroke="none"/></IconWrapper>;
export const RhythmicIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M3 12h2l2-4l4 4l4-4l2 4h2" /></IconWrapper>;
export const TimeIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></IconWrapper>;
export const GeometryIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M21 12L12 3 3 12l9 9 9-9z" /><circle cx="12" cy="12" r="3" /></IconWrapper>;
export const MeasurementIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M21.2 15.8L18 19l-1.4-1.4m-4.2-4.2L9 17l-1.4-1.4M3 21l8-8M3 3l18 18" /></IconWrapper>;
export const WordProblemsIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM12 8v.01M12 11h.01" /></IconWrapper>;
export const VisualSupportIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></IconWrapper>;

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

export const ReadinessIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></IconWrapper>;
export const MatchingIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M10 3H5a2 2 0 0 0-2 2v5m3-7v5h5M14 3h5a2 2 0 0 1 2 2v5m-7-5v5h5" /><path d="M10 21H5a2 2 0 0 1-2-2v-5m3 7v-5h5M14 21h5a2 2 0 0 0 2-2v-5m-7 5v-5h5" /></IconWrapper>;
export const ComparingIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M10 13l-4-4 4-4M14 5l4 4-4 4" /></IconWrapper>;
export const NumberRecognitionIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M12 12h.01M10 12h.01M8 12h.01M14 12h.01M16 12h.01" /></IconWrapper>;
export const PatternsIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><circle cx="6" cy="12" r="3" /><circle cx="18" cy="12" r="3" /><rect x="9" y="9" width="6" height="6" rx="1" /></IconWrapper>;
export const BasicShapesIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="5" /><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /></IconWrapper>;
export const PositionalConceptsIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M12 2v20M12 2l-4 4M12 2l4 4M12 22l-4-4M12 22l4-4" /><rect x="3" y="10" width="18" height="4" rx="1" /></IconWrapper>;
export const IntroToMeasurementIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M3 3v18h18" /><path d="M7 3v2M12 3v2M17 3v2M3 7h2M3 12h2M3 17h2" /></IconWrapper>;
export const SimpleGraphsIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M3 3v18h18" /><path d="M7 12v4M12 7v9M17 4v12" /></IconWrapper>;
export const SpecialLearningIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M12 2a10 10 0 0 0-7.5 16.5A10 10 0 0 0 12 22a10 10 0 0 0 7.5-3.5A10 10 0 0 0 12 2zM6 10h4v4H6zM14 10h4v4h-4zM10 16h4v4h-4z" /></IconWrapper>;
export const DyscalculiaIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /><path d="M8 8l8 8M16 8l-8 8" /></IconWrapper>;
export const DysgraphiaIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /><path d="M15 5l4 4" /></IconWrapper>;
export const VisualAdditionSubtractionIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="8" x2="12" y2="16" /></IconWrapper>;
export const VerbalArithmeticIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="10" y1="11" x2="14" y2="11" /><line x1="12" y1="9" x2="12" y2="13" /></IconWrapper>;
export const MissingNumberIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 10a3 3 0 1 1 3 3" /><path d="M12 17v.01" /></IconWrapper>;
export const SymbolicArithmeticIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="8" x2="12" y2="16" /></IconWrapper>;
export const ProblemCreationIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /><path d="M12 18H5" /><path d="M19 11H5" /></IconWrapper>;

export const DoubleArrowLeftIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
    </svg>
);
export const PrintIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}>
    <path d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
</IconWrapper>;
export const RefreshIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}>
    <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-11.667 0l-3.181 3.183m0 0l-3.181-3.183m0 0h16.5m-16.5 0l3.181-3.183M12 5.25v2.101m0 0a4.5 4.5 0 014.5 4.5m-4.5-4.5a4.5 4.5 0 00-4.5 4.5m4.5-4.5v2.101m0 0a4.5 4.5 0 014.5 4.5m0 0a4.5 4.5 0 01-4.5 4.5m4.5-4.5a4.5 4.5 0 00-4.5-4.5m0 0v-2.101m0 0a4.5 4.5 0 00-4.5 4.5m-4.5 4.5a4.5 4.5 0 004.5 4.5m-4.5 4.5v-2.101m0 0a4.5 4.5 0 014.5-4.5" />
</IconWrapper>;
export const HelpIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}>
    <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
</IconWrapper>;

export const HeartIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></IconWrapper>;
export const MailIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></IconWrapper>;
export const SettingsIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></IconWrapper>;
export const DownloadIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></IconWrapper>;
export const MenuIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></IconWrapper>;
export const MoreVerticalIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></IconWrapper>;
export const ShuffleIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="16 16 21 16 21 21" /><line x1="4" y1="4" x2="11" y2="11" /></IconWrapper>;
export const SearchIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></IconWrapper>;
export const MicrophoneIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></IconWrapper>;
export const MicrophoneOffIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><line x1="2" y1="2" x2="22" y2="22" /><path d="M18.89 13.23A7.12 7.12 0 0 1 19 12v-2" /><path d="M5 10v2a7 7 0 0 0 12 5" /><path d="M15 9.34V4a3 3 0 0 0-5.68-1.33" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12" /><line x1="12" y1="19" x2="12" y2="23" /></IconWrapper>;
export const SaveIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></IconWrapper>;
export const LoadIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" /><path d="M12 10v6" /><path d="m15 13-3-3-3 3" /></IconWrapper>;
export const DeleteIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></IconWrapper>;
export const FavoriteIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></IconWrapper>;
export const XIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M18 6L6 18M6 6l12 12" /></IconWrapper>;
export const InstagramIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="18.5" y1="5.5" x2="18.51" y2="5.5" /></IconWrapper>;
export const LoadingIcon = RefreshIcon;
// FIX: Exported missing icons as aliases of existing ones to fix import errors.
export const LetterFormationIcon = DysgraphiaIcon;
export const LetterFormRecognitionIcon = SearchIcon;
export const CreativeWritingIcon = WordProblemsIcon;
export const PaletteIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 0-3.5 19.33A10 10 0 0 1 15.5 4.67" /><path d="M12 2a10 10 0 0 1 3.5 19.33A10 10 0 0 0 8.5 4.67" /></IconWrapper>;
export const SunIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></IconWrapper>;
export const MoonIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></IconWrapper>;

export const NumberSenseIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M3 6h18M3 18h18M7 6l4 6-4 6" /><path d="M17 6l-4 6 4 6" /></IconWrapper>;
export const InteractiveStoryIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></IconWrapper>;
export const ArithmeticFluencyIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /><path d="m8 16 2-2 2 2-2 2-2-2z" /></IconWrapper>;
export const NumberGroupingIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><circle cx="6" cy="6" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="12" r="2" /></IconWrapper>;
export const ProblemSolvingIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /><path d="M16.5 9.4a4 4 0 1 1-7.9 1.2" /></IconWrapper>;
export const MathLanguageIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM9 9l6 6M15 9l-6 6" /></IconWrapper>;
export const SpatialReasoningIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M21 12L12 3 3 12l9 9 9-9zM3.27 12H20.8" /><path d="M12 3v18" /></IconWrapper>;
export const EstimationSkillsIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M4 22h16" /><path d="M6 18h12" /><path d="M8 14h8" /><path d="M10 10h4" /><path d="M12 6L12 2" /><path d="M15 3l-3-3-3 3" /></IconWrapper>;
export const FractionsDecimalsIntroIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="10" /><path d="M12 2v10h10" /><path d="M12 12H2" /></IconWrapper>;
export const VisualNumberRepresentationIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><rect x="2" y="7" width="20" height="10" rx="2" /><circle cx="7" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="17" cy="12" r="1.5" /></IconWrapper>;
export const VisualArithmeticIcon: React.FC<IconProps> = (props) => <IconWrapper {...props}><path d="M3 10h18" /><path d="M3 14h18" /><path d="M3 6h18" /><path d="M3 18h18" /><circle cx="6" cy="6" r="2" /><circle cx="10" cy="10" r="2" /><circle cx="14" cy="14" r="2" /><circle cx="18" cy="18" r="2" /></IconWrapper>;

export const NumberTraceIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M7 20l4-16 4 16"/>
        <path d="M5 16h14"/>
        <path d="M17 4l-3 4-3-4"/>
    </svg>
);
export const GeometricTraceIcon: React.FC<IconProps> = (props) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 12L12 3 3 12l9 9 9-9z"/>
        <path d="M3 12h18"/>
    </svg>
);
export const DigitTraceIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9.9 5.9a1 1 0 00-1.8 0L3.5 16.2A.9.9 0 004.2 18h16.4a.9.9 0 00.7-1.8L15.9 5.9a1 1 0 00-1.8 0L12 10.4z"/>
    </svg>
);
export const SymbolTraceIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 5v14M5 12h14"/>
    </svg>
);

export default DummyIcon;