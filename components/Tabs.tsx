import React, { useState, useRef, useEffect } from 'react';
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
    ChevronDownIcon,
    ReadinessIcon,
    MatchingIcon,
    ComparingIcon,
    NumberRecognitionIcon,
    PatternsIcon,
    BasicShapesIcon,
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

const itemIconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
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
    'matching-and-sorting': MatchingIcon,
    'comparing-quantities': ComparingIcon,
    'number-recognition': NumberRecognitionIcon,
    'patterns': PatternsIcon,
    'basic-shapes': BasicShapesIcon,
};

const groupIconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    'Matematiğe Hazırlık': ReadinessIcon,
    'İşlemler': ArithmeticIcon,
    'Sayılar': RhythmicIcon,
    'Ölçümler': MeasurementIcon,
};

const Tabs: React.FC<TabsProps> = ({ tabGroups, activeTab, onTabClick }) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    const handleMouseEnter = (menuTitle: string) => {
        if (!isMenuSticky) {
            setOpenMenu(menuTitle);
        }
    };

    const handleClick = (menuTitle: string) => {
        if (openMenu === menuTitle && isMenuSticky) {
            setOpenMenu(null);
            setIsMenuSticky(false);
        } else {
            setOpenMenu(menuTitle);
            setIsMenuSticky(true);
        }
    };
    
    const handleItemClick = (tabId: string) => {
        onTabClick(tabId);
        setOpenMenu(null);
        setIsMenuSticky(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
                setIsMenuSticky(false);
            }
        };

        if (openMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenu]);

    return (
        <nav ref={navRef} className="-mb-px flex space-x-2" aria-label="Tabs">
            {tabGroups.map((group) => {
                const GroupIcon = groupIconMap[group.title];
                const isGroupActive = group.tabs.some(tab => tab.id === activeTab);
                
                return (
                    <div
                        key={group.title}
                        className="relative"
                    >
                        <button
                            onClick={() => handleClick(group.title)}
                            onMouseEnter={() => handleMouseEnter(group.title)}
                            className={`tab-button-nav-item flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none ${
                                isGroupActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-amber-100/70 hover:bg-white/10 hover:text-white'
                            }`}
                             aria-haspopup="true"
                             aria-expanded={openMenu === group.title}
                        >
                            {GroupIcon && <GroupIcon className="w-4 h-4" />}
                            <span>{group.title}</span>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${openMenu === group.title ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <div
                             className={`absolute left-0 mt-2 w-56 origin-top-left bg-white dark:bg-stone-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 py-1 transition-all duration-150 ease-out ${
                                 openMenu === group.title ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                             }`}
                             role="menu"
                        >
                            {group.tabs.map((tab) => {
                                const Icon = itemIconMap[tab.id];
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleItemClick(tab.id)}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                                                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                                        }`}
                                        role="menuitem"
                                    >
                                        {Icon && <Icon className="w-5 h-5" />}
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </nav>
    );
};

export default Tabs;