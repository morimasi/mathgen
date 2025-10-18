import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type ColorTheme = 'orange' | 'mint' | 'rose' | 'sky' | 'lavender' | 'graphite' | 'gold' | 'forest' | 'coral' | 'midnight' | 'ruby' | 'emerald' | 'amethyst';

export const colorThemes: Record<ColorTheme, { name: string; className: string }> = {
  orange: { name: 'Varsayılan (Turuncu)', className: 'theme-orange' },
  mint: { name: 'Nane Yeşili', className: 'theme-mint' },
  rose: { name: 'Gül Pembesi', className: 'theme-rose' },
  sky: { name: 'Gökyüzü Mavisi', className: 'theme-sky' },
  lavender: { name: 'Lavanta', className: 'theme-lavender' },
  graphite: { name: 'Grafit', className: 'theme-graphite' },
  gold: { name: 'Altın', className: 'theme-gold' },
  forest: { name: 'Orman', className: 'theme-forest' },
  coral: { name: 'Mercan', className: 'theme-coral' },
  midnight: { name: 'Gece Mavisi', className: 'theme-midnight' },
  ruby: { name: 'Yakut Kırmızısı', className: 'theme-ruby' },
  emerald: { name: 'Zümrüt Yeşili', className: 'theme-emerald' },
  amethyst: { name: 'Ametist Moru', className: 'theme-amethyst' },
};

interface ColorThemeContextType {
    colorTheme: ColorTheme;
    setColorTheme: (theme: ColorTheme) => void;
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export const ColorThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
        const storedTheme = localStorage.getItem('colorTheme');
        return (storedTheme && colorThemes[storedTheme as ColorTheme]) ? (storedTheme as ColorTheme) : 'orange';
    });

    useEffect(() => {
        Object.values(colorThemes).forEach(theme => {
            document.body.classList.remove(theme.className);
        });

        document.body.classList.add(colorThemes[colorTheme].className);
        localStorage.setItem('colorTheme', colorTheme);
    }, [colorTheme]);

    return (
        <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
            {children}
        </ColorThemeContext.Provider>
    );
};

export const useColorTheme = (): ColorThemeContextType => {
    const context = useContext(ColorThemeContext);
    if (!context) {
        throw new Error('useColorTheme must be used within a ColorThemeProvider');
    }
    return context;
};
