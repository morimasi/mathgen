
import React, { useState } from 'react';

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

const Tabs: React.FC<TabsProps> = ({ tabGroups, activeTab, onTabClick }) => {
    const [openGroup, setOpenGroup] = useState(tabGroups[0]?.title || '');

    return (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pb-2">
            {tabGroups.map((group) => (
                <div key={group.title} className="relative tab-group">
                    <button
                        onClick={() => setOpenGroup(openGroup === group.title ? '' : group.title)}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                            group.tabs.some(t => t.id === activeTab)
                                ? 'bg-amber-100 text-orange-800 dark:bg-stone-700 dark:text-amber-50'
                                : 'bg-white/10 text-amber-50 hover:bg-white/20'
                        }`}
                    >
                        {group.title}
                        <svg className={`w-3 h-3 transition-transform ${openGroup === group.title ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openGroup === group.title && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-stone-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 p-1">
                            {group.tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        onTabClick(tab.id);
                                        setOpenGroup('');
                                    }}
                                    className={`w-full text-left block px-3 py-1.5 text-sm rounded-md transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                                            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Tabs;
