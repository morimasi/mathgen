import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useUI } from '../services/UIContext.tsx';
import { TABS } from '../constants.ts';
import { SearchIcon, XIcon } from './icons/Icons.tsx';
import {
    ArithmeticIcon, FractionsIcon, DecimalsIcon, PlaceValueIcon, RhythmicIcon, TimeIcon,
    GeometryIcon, MeasurementIcon, WordProblemsIcon, VisualSupportIcon, MatchingIcon,
    ComparingIcon, NumberRecognitionIcon, PatternsIcon, BasicShapesIcon, PositionalConceptsIcon,
    IntroToMeasurementIcon, SimpleGraphsIcon, DyslexiaIcon, DyscalculiaIcon, DysgraphiaIcon,
    VisualAdditionSubtractionIcon, VerbalArithmeticIcon, MissingNumberIcon, SymbolicArithmeticIcon,
    ProblemCreationIcon,
} from './icons/Icons.tsx';

// Replicating itemIconMap from Tabs.tsx to avoid circular dependencies or complex exports
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
    'positional-concepts': PositionalConceptsIcon,
    'intro-to-measurement': IntroToMeasurementIcon,
    'simple-graphs': SimpleGraphsIcon,
    'dyslexia': DyslexiaIcon,
    'dyscalculia': DyscalculiaIcon,
    'dysgraphia': DysgraphiaIcon,
    'visual-addition-subtraction': VisualAdditionSubtractionIcon,
    'verbal-arithmetic': VerbalArithmeticIcon,
    'missing-number-puzzles': MissingNumberIcon,
    'symbolic-arithmetic': SymbolicArithmeticIcon,
    'problem-creation': ProblemCreationIcon,
};

const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { setActiveTab, setIsSettingsPanelCollapsed } = useUI();
    const searchRef = useRef<HTMLDivElement>(null);

    const filteredTabs = useMemo(() => {
        if (!query) return [];
        const lowerCaseQuery = query.toLowerCase();
        const keywords: {[key: string]: string[]} = {
            "arithmetic": ["toplama", "çıkarma", "çarpma", "bölme", "dört işlem"],
            "fractions": ["kesir"],
            "decimals": ["ondalık"],
            "word-problems": ["problem", "ai", "yapay zeka"],
            "rhythmic-counting": ["ritmik"],
            "place-value": ["basamak"],
            "time": ["saat"],
        }

        return TABS.filter(tab =>
            tab.label.toLowerCase().includes(lowerCaseQuery) || 
            (keywords[tab.id] && keywords[tab.id].some(k => k.includes(lowerCaseQuery)))
        );
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectTab = (tabId: string) => {
        setActiveTab(tabId);
        setIsSettingsPanelCollapsed(false);
        setQuery('');
        setIsFocused(false);
    };

    const showDropdown = isFocused && query.length > 0;

    return (
        <div ref={searchRef} className="relative">
            <div className="relative flex items-center">
                <SearchIcon className="absolute left-3 w-4 h-4 text-white/70 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Modül ara..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="w-48 pl-9 pr-8 py-1.5 text-sm text-white placeholder:text-white/70 bg-white/10 rounded-md border border-transparent focus:bg-white/20 focus:border-white/50 focus:outline-none transition-all"
                />
                {query && (
                    <button onClick={() => setQuery('')} className="absolute right-2 p-0.5 rounded-full text-white/80 hover:bg-white/20 hover:text-white">
                        <XIcon className="w-4 h-4" />
                    </button>
                )}
            </div>

            {showDropdown && (
                <div className="absolute left-0 mt-2 w-64 origin-top-left bg-white dark:bg-stone-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 py-1 max-h-80 overflow-y-auto">
                    {filteredTabs.length > 0 ? (
                        filteredTabs.map(tab => {
                            const Icon = itemIconMap[tab.id];
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleSelectTab(tab.id)}
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                                >
                                    {Icon && <Icon className="w-5 h-5" />}
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })
                    ) : (
                        <div className="px-4 py-2 text-sm text-stone-500">Sonuç bulunamadı.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
