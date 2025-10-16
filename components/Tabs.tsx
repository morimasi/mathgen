import React from 'react';
import { useFlyingLadybugs } from '../services/FlyingLadybugContext';
import {
    ArithmeticIcon,
    FractionsIcon,
    DecimalsIcon,
    PlaceValueIcon,
    RhythmicIcon,
    TimeIcon,
    GeometryIcon,
    MeasurementIcon,
    WordProblemsIcon,
    VisualSupportIcon,
} from './icons/Icons';

interface Tab {
    id: string;
    label: string;
}

interface TabGroup {
    title: string;
    tabs: Tab[];
}

interface TabsProps {
    tabGroups: TabGroup[];
    activeTab: string;
    onTabClick: (tabId: string) => void;
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    'arithmetic': ArithmeticIcon,
    'visual-support': VisualSupportIcon,
    'fractions': FractionsIcon,
    'decimals': DecimalsIcon,
    'place-value': PlaceValueIcon,
    'rhythmic-counting': RhythmicIcon,
    'time': TimeIcon,
    'geometry': GeometryIcon,
    'measurement': MeasurementIcon,
    'word-problems': WordProblemsIcon,
};


const Tabs: React.FC<TabsProps> = ({ tabGroups, activeTab, onTabClick }) => {
    const { spawnLadybug } = useFlyingLadybugs();

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        spawnLadybug(e.clientX, e.clientY);
    };
    
    return (
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
            {tabGroups.map((group, groupIndex) => (
                <div key={group.title} className="flex items-center gap-4">
                    {groupIndex > 0 && <div className="h-6 w-px bg-white/20"></div>}
                    <div className="flex items-center gap-4">
                        {group.tabs.map((tab) => {
                            const Icon = iconMap[tab.id];
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabClick(tab.id)}
                                    onMouseEnter={handleMouseEnter}
                                    className={`tab-button-nav-item flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'border-amber-200 text-amber-200'
                                            : 'border-transparent text-amber-100/60 hover:text-amber-100 hover:border-amber-300/70'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                                    aria-current={activeTab === tab.id ? 'page' : undefined}
                                >
                                    {Icon && <Icon className="w-4 h-4" />}
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
};

export default Tabs;
