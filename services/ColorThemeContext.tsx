import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { hexToRgb } from './colorUtils.ts';

export type ColorTheme = 'orange' | 'blue' | 'green' | 'rose' | 'custom';

export const colorThemes: Record<ColorTheme, { name: string; primary: string; hover: string; focus: string; accentText: string; accentBg: string }> = {
    orange: { name: 'Turuncu', primary: '#f97316', hover: '#ea580c', focus: '#c2410c', accentText: 'var(--theme-accent-text-orange)', accentBg: 'var(--theme-accent-bg-orange)' },
    blue: { name: 'Mavi', primary: '#3b82f6', hover: '#2563eb', focus: '#1d4ed8', accentText: 'var(--theme-accent-text-blue)', accentBg: 'var(--theme-accent-bg-blue)' },
    green: { name: 'Yeşil', primary: '#22c55e', hover: '#16a34a', focus: '#15803d', accentText: 'var(--theme-accent-text-green)', accentBg: 'var(--theme-accent-bg-green)' },
    rose: { name: 'Gül', primary: '#f43f5e', hover: '#e11d48', focus: '#be123c', accentText: 'var(--theme-accent-text-rose)', accentBg: 'var(--theme-accent-bg-rose)' },
    custom: { name: 'Özel', primary: '#f97316', hover: '#ea580c', focus: '#c2410c', accentText: 'var(--theme-accent-text)', accentBg: 'var(--theme-accent-bg)' },
};

interface ColorThemeContextType {
    colorTheme: ColorTheme;
    setColorTheme: (theme: ColorTheme) => void;
    customColor: string;
    setCustomColor: (hex: string) => void;
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

// Helper functions to avoid module resolution issues
function rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): { r: number, g: number, b: number } {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { [r, g, b] = [c, x, 0]; }
    else if (h >= 60 && h < 120) { [r, g, b] = [x, c, 0]; }
    else if (h >= 120 && h < 180) { [r, g, b] = [0, c, x]; }
    else if (h >= 180 && h < 240) { [r, g, b] = [0, x, c]; }
    else if (h >= 240 && h < 300) { [r, g, b] = [x, 0, c]; }
    else if (h >= 300 && h < 360) { [r, g, b] = [c, 0, x]; }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    };
}


export const ColorThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
        const stored = localStorage.getItem('colorTheme');
        return (stored && colorThemes[stored as ColorTheme]) ? (stored as ColorTheme) : 'orange';
    });
    const [customColor, setStoredCustomColor] = useState<string>(() => {
        return localStorage.getItem('customColor') || '#f97316';
    });
    
    const setCustomColor = useCallback((hex: string) => {
        setStoredCustomColor(hex);
        localStorage.setItem('customColor', hex);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const currentTheme = colorTheme === 'custom' ? { ...colorThemes.custom, primary: customColor } : colorThemes[colorTheme];
        
        const primaryRgb = hexToRgb(currentTheme.primary);

        if(primaryRgb) {
            root.style.setProperty('--theme-color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
            if(colorTheme !== 'custom') {
                 const hoverRgb = hexToRgb(currentTheme.hover);
                 const focusRgb = hexToRgb(currentTheme.focus);
                 if (hoverRgb) root.style.setProperty('--theme-color-primary-hover-rgb', `${hoverRgb.r}, ${hoverRgb.g}, ${hoverRgb.b}`);
                 if (focusRgb) root.style.setProperty('--theme-color-primary-focus-rgb', `${focusRgb.r}, ${focusRgb.g}, ${focusRgb.b}`);
            } else {
                // For custom, calculate shades
                const hsl = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);
                const hoverL = Math.max(0, hsl.l - 5);
                const focusL = Math.max(0, hsl.l - 8);
                const hoverRgb = hslToRgb(hsl.h, hsl.s, hoverL);
                const focusRgb = hslToRgb(hsl.h, hsl.s, focusL);
                root.style.setProperty('--theme-color-primary-hover-rgb', `${hoverRgb.r}, ${hoverRgb.g}, ${hoverRgb.b}`);
                root.style.setProperty('--theme-color-primary-focus-rgb', `${focusRgb.r}, ${focusRgb.g}, ${focusRgb.b}`);
            }

            root.style.setProperty('--theme-accent-text', currentTheme.accentText);
            root.style.setProperty('--theme-accent-bg', currentTheme.accentBg);
        }

        localStorage.setItem('colorTheme', colorTheme);
    }, [colorTheme, customColor]);

    const value = useMemo(() => ({ colorTheme, setColorTheme, customColor, setCustomColor }), [colorTheme, customColor, setCustomColor]);

    return (
        <ColorThemeContext.Provider value={value}>
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
