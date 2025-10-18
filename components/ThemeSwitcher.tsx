import React, { useState } from 'react';
import { useTheme } from '../services/ThemeContext.tsx';
import { useFontTheme, fontThemes, FontTheme } from '../services/FontThemeContext.tsx';
import { useColorTheme, colorThemes, ColorTheme } from '../services/ColorThemeContext.tsx';
import { SunIcon, MoonIcon, PaletteIcon } from './icons/Icons.tsx';
import CustomColorPickerModal from './CustomColorPickerModal.tsx';

const ThemeSwitcher: React.FC = () => {
    const { mode, toggleMode } = useTheme();
    const { fontTheme, setFontTheme } = useFontTheme();
    const { colorTheme, setColorTheme } = useColorTheme();
    const [isPickerVisible, setIsPickerVisible] = useState(false);

    return (
        <>
        <div className="flex items-center gap-3">
            <button onClick={toggleMode} title="Aydınlık/Karanlık Mod" className="p-2 rounded-full hover:bg-white/10 text-amber-100/80 hover:text-white transition-colors">
                {mode === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
            <div className="relative group">
                <button title="Tema ve Yazı Tipi" className="p-2 rounded-full hover:bg-white/10 text-amber-100/80 hover:text-white transition-colors">
                    <PaletteIcon className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white dark:bg-stone-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-150">
                    <div className="px-3 py-1">
                        <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Renk Teması</label>
                        <div className="flex items-center gap-2 mt-1">
                            {Object.entries(colorThemes).filter(([key]) => key !== 'custom').map(([key, theme]) => (
                                <button key={key} onClick={() => setColorTheme(key as ColorTheme)}
                                    className={`w-6 h-6 rounded-full ring-2 ring-offset-2 dark:ring-offset-stone-800 transition-all ${colorTheme === key ? 'ring-stone-600 dark:ring-stone-300' : 'ring-transparent hover:ring-stone-400'}`}
                                    style={{ backgroundColor: theme.primary }}
                                    title={theme.name}
                                />
                            ))}
                             <button onClick={() => setIsPickerVisible(true)}
                                className={`w-6 h-6 rounded-full ring-2 ring-offset-2 dark:ring-offset-stone-800 transition-all flex items-center justify-center bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 ${colorTheme === 'custom' ? 'ring-stone-600 dark:ring-stone-300' : 'ring-transparent hover:ring-stone-400'}`}
                                title="Özel Renk"
                            />
                        </div>
                    </div>
                     <div className="px-3 py-2 mt-2 border-t border-stone-200 dark:border-stone-700">
                        <label htmlFor="font-theme-select" className="text-xs font-semibold text-stone-600 dark:text-stone-400">Yazı Tipi</label>
                        <select id="font-theme-select" value={fontTheme} onChange={(e) => setFontTheme(e.target.value as FontTheme)}
                            className="block w-full mt-1 px-2 py-1 text-sm bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600">
                           {Object.entries(fontThemes).map(([key, theme]) => (
                               <option key={key} value={key}>{theme.name}</option>
                           ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <CustomColorPickerModal isVisible={isPickerVisible} onClose={() => setIsPickerVisible(false)} />
        </>
    );
};

export default ThemeSwitcher;
