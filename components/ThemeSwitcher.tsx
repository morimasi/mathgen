import React, { useState, useRef, useEffect } from 'react';
import { useFontTheme, fontThemes, FontTheme } from '../services/FontThemeContext.tsx';
import { useColorTheme, colorThemes, ColorTheme } from '../services/ColorThemeContext.tsx';
import { useTheme } from '../services/ThemeContext.tsx';
import { PaletteIcon, SunIcon, MoonIcon } from './icons/Icons.tsx';
import ThemePreview from './ThemePreview.tsx';

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
            <div className={`absolute right-0 mt-2 w-72 origin-top-right bg-white dark:bg-stone-800 rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-10 p-2 transition-all duration-150 ease-out transform ${
                isOpen 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}>
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
                <div className="grid grid-cols-3 gap-2 px-2">
                    {Object.entries(colorThemes).map(([key, value]) => {
                        const themeKey = key as ColorTheme;
                        return (
                            <ThemePreview
                                key={key}
                                onClick={() => setColorTheme(themeKey)}
                                isSelected={colorTheme === themeKey}
                                label={value.name}
                                colorClass={value.className}
                                fontClass={fontThemes[fontTheme].className}
                            />
                        );
                    })}
                </div>
                
                <Divider />

                {/* Font Theme Section */}
                <SectionTitle>Yazı Tipi</SectionTitle>
                <div className="grid grid-cols-3 gap-2 px-2">
                    {Object.entries(fontThemes).map(([key, value]) => {
                        const themeKey = key as FontTheme;
                        return (
                           <ThemePreview
                                key={key}
                                onClick={() => setFontTheme(themeKey)}
                                isSelected={fontTheme === themeKey}
                                label={value.name}
                                colorClass={colorThemes[colorTheme].className}
                                fontClass={value.className}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ThemeSwitcher;