import React, { useState, useRef, useEffect } from 'react';
import { useFontTheme, fontThemes, FontTheme } from '../services/FontThemeContext';
import { useTheme } from '../services/ThemeContext';
import { PaletteIcon, SunIcon, MoonIcon } from './icons/Icons';

const ThemeSwitcher: React.FC = () => {
    const { fontTheme, setFontTheme } = useFontTheme();
    const { mode, toggleMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleFontChange = (theme: FontTheme) => {
        setFontTheme(theme);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const Divider: React.FC = () => <div className="my-2 h-px bg-stone-200 dark:bg-stone-700" />;
    const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3 className="px-3 py-2 text-xs font-semibold text-stone-500 dark:text-stone-400 tracking-wider uppercase">{children}</h3>;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(o => !o)}
                className="p-2 rounded-md hover:bg-white/20 transition-colors"
                title="Görünüm Ayarları"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <PaletteIcon />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 origin-top-right bg-white dark:bg-stone-800 rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-10 p-2">
                    {/* Mode Section */}
                    <SectionTitle>Mod</SectionTitle>
                    <div className="px-2">
                        <div className="flex w-full bg-stone-100 dark:bg-stone-700 rounded-full p-1">
                             <button
                                onClick={mode === 'dark' ? toggleMode : undefined}
                                className={`w-1/2 flex justify-center items-center gap-2 px-3 py-1.5 text-sm rounded-full transition-all duration-300 ${
                                    mode === 'light' ? 'bg-white dark:bg-stone-500 shadow' : 'text-stone-500 dark:text-stone-400'
                                }`}
                                title='Aydınlık Mod'
                            >
                                <SunIcon className="w-5 h-5"/> Aydınlık
                            </button>
                             <button
                                onClick={mode === 'light' ? toggleMode : undefined}
                                className={`w-1/2 flex justify-center items-center gap-2 px-3 py-1.5 text-sm rounded-full transition-all duration-300 ${
                                    mode === 'dark' ? 'bg-white dark:bg-stone-500 shadow' : 'text-stone-500 dark:text-stone-400'
                                }`}
                                title='Karanlık Mod'
                            >
                                <MoonIcon className="w-5 h-5"/> Karanlık
                            </button>
                        </div>
                    </div>
                    
                    <Divider />

                    {/* Font Theme Section */}
                    <SectionTitle>Yazı Tipi</SectionTitle>
                    <div className="flex flex-col gap-1">
                        {Object.entries(fontThemes).map(([key, value]) => (
                            <button
                                key={key}
                                onClick={() => handleFontChange(key as FontTheme)}
                                className={`w-full text-left block px-3 py-1.5 text-sm rounded-md transition-colors ${
                                    fontTheme === key
                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                                }`}
                            >
                                {value.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;