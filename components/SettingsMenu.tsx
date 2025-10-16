import React from 'react';
import { TABS } from '../constants';
import {
    ArithmeticIcon,
    FractionsIcon,
    DecimalsIcon,
    PlaceValueIcon,
    RhythmicIcon,
    TimeIcon,
    GeometryIcon,
    WordProblemsIcon,
} from './icons/Icons';

interface SettingsMenuProps {
    activeTab: string;
    setActiveTab: (tabId: string) => void;
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    'arithmetic': ArithmeticIcon,
    'fractions': FractionsIcon,
    'decimals': DecimalsIcon,
    'place-value': PlaceValueIcon,
    'rhythmic-counting': RhythmicIcon,
    'time': TimeIcon,
    'geometry': GeometryIcon,
    'word-problems': WordProblemsIcon,
};

const SettingsMenu: React.FC<SettingsMenuProps> = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="flex flex-col gap-2">
            {TABS.map(tab => {
                const Icon = iconMap[tab.id];
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md text-left transition-colors ${
                            isActive 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default SettingsMenu;