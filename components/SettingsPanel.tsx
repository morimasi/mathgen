import React from 'react';
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
import { Problem, VisualSupportSettings } from '../types';

interface SettingsPanelProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    activeTab: string;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
    visualSupportSettings: VisualSupportSettings;
    setVisualSupportSettings: React.Dispatch<React.SetStateAction<VisualSupportSettings>>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    onGenerate, 
    setIsLoading, 
    activeTab, 
    contentRef, 
    autoRefreshTrigger, 
    lastGeneratorModule,
    visualSupportSettings,
    setVisualSupportSettings
}) => {
    const renderModule = () => {
        const commonProps = { onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule };
        switch (activeTab) {
            case 'arithmetic':
                return <ArithmeticModule {...commonProps} />;
            case 'visual-support':
                return <VisualSupportModule {...commonProps} settings={visualSupportSettings} setSettings={setVisualSupportSettings} />;
            case 'fractions':
                return <FractionsModule {...commonProps} />;
            case 'decimals':
                return <DecimalsModule {...commonProps} />;
            case 'place-value':
                return <PlaceValueModule {...commonProps} />;
            case 'rhythmic-counting':
                return <RhythmicCountingModule {...commonProps} />;
            case 'time':
                return <TimeModule {...commonProps} />;
            case 'geometry':
                return <GeometryModule {...commonProps} />;
            case 'measurement':
                return <MeasurementModule {...commonProps} />;
            case 'word-problems':
                return <WordProblemsModule {...commonProps} />;
            default:
                return null;
        }
    };
    
    return (
        <div className="print:hidden">
            {renderModule()}
        </div>
    );
};

export default SettingsPanel;