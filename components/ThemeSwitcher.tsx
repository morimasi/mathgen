import React, { useState, useRef, useEffect } from 'react';
import { useFontTheme, fontThemes, FontTheme } from '../services/FontThemeContext.tsx';
import { useColorTheme, colorThemes, ColorTheme } from '../services/ColorThemeContext.tsx';
import { useTheme } from '../services/ThemeContext.tsx';
import { PaletteIcon, SunIcon, MoonIcon } from './icons/Icons.tsx';

const ThemeSwitcher: React.FC = () => {
    const { fontTheme, setFontTheme } = useFontTheme();
    const { colorTheme, setColorTheme } = useColorTheme();
    const { mode, toggleMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

                    {/* Color Theme Section */}
                    <SectionTitle>Renk Paleti</SectionTitle>
                     <div className="grid grid-cols-4 gap-3 px-3">
                        {Object.entries(colorThemes).map(([key, value]) => {
                            const themeKey = key as ColorTheme;
                            const colorClass = {
                                orange: 'bg-orange-500 text-orange-500',
                                mint: 'bg-emerald-500 text-emerald-500',
                                rose: 'bg-rose-500 text-rose-500',
                                sky: 'bg-sky-500 text-sky-500',
                                lavender: 'bg-violet-500 text-violet-500',
                                graphite: 'bg-slate-600 text-slate-600',
                                gold: 'bg-amber-400 text-amber-400',
                                forest: 'bg-green-700 text-green-700',
                                coral: 'bg-red-400 text-red-400',
                                midnight: 'bg-blue-800 text-blue-800',
                                ruby: 'bg-rose-800 text-rose-800',
                                emerald: 'bg-emerald-800 text-emerald-800',
                                amethyst: 'bg-purple-800 text-purple-800',
                            }[themeKey];
                            
                            return (
                                <button
                                    key={key}
                                    onClick={() => setColorTheme(themeKey)}
                                    className={`w-full h-8 rounded-md flex items-center justify-center transition-all ${colorClass} ${colorTheme === key ? 'ring-2 ring-offset-2 dark:ring-offset-stone-800 ring-primary-focus' : ''}`}
                                    title={value.name}
                                    aria-label={value.name}
                                />
                            );
                        })}
                    </div>
                    
                    <Divider />

                    {/* Font Theme Section */}
                    <SectionTitle>Yazı Tipi</SectionTitle>
                    <div className="flex flex-col gap-1">
                        {Object.entries(fontThemes).map(([key, value]) => (
                            <button
                                key={key}
                                onClick={() => setFontTheme(key as FontTheme)}
                                className={`w-full text-left block px-3 py-1.5 text-sm rounded-md transition-colors ${
                                    fontTheme === key
                                        ? 'bg-accent-bg text-accent-text'
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
