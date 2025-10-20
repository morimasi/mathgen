import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

export type FontTheme = 'klasik' | 'modern' | 'disleksi1' | 'disleksi2' | 'disleksi3' | 'disleksi4' | 'disleksi5' | 'eglenceli' | 'yumusak' | 'blok' | 'net';

export const fontThemes: Record<FontTheme, { name: string; className: string }> = {
  disleksi1: { name: 'Disleksi Dostu (Lexend)', className: 'font-theme-disleksi1' },
  disleksi2: { name: 'Okunaklı (Atkinson)', className: 'font-theme-disleksi2' },
  disleksi3: { name: 'Özel (OpenDyslexic)', className: 'font-theme-disleksi3' },
  disleksi4: { name: 'Yumuşak Hatlı (Comic Neue)', className: 'font-theme-disleksi4' },
  disleksi5: { name: 'Ekran Odaklı (Readex Pro)', className: 'font-theme-disleksi5' },
  klasik: { name: 'Klasik (Lora)', className: 'font-theme-klasik' },
  modern: { name: 'Modern (Nunito Sans)', className: 'font-theme-modern' },
  eglenceli: { name: 'El Yazısı (Caveat)', className: 'font-theme-eglenceli' },
  yumusak: { name: 'Yumuşak (Comfortaa)', className: 'font-theme-yumusak' },
  blok: { name: 'Blok (Roboto Slab)', className: 'font-theme-blok' },
  net: { name: 'Net (Montserrat)', className: 'font-theme-net' },
};

interface FontThemeContextType {
    fontTheme: FontTheme;
    setFontTheme: (theme: FontTheme) => void;
}

const FontThemeContext = createContext<FontThemeContextType | undefined>(undefined);

export const FontThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fontTheme, setFontTheme] = useState<FontTheme>(() => {
        const storedTheme = localStorage.getItem('fontTheme');
        return (storedTheme && fontThemes[storedTheme as FontTheme]) ? (storedTheme as FontTheme) : 'disleksi1';
    });

    useEffect(() => {
        Object.values(fontThemes).forEach(theme => {
            document.body.classList.remove(theme.className);
        });

        document.body.classList.add(fontThemes[fontTheme].className);
        localStorage.setItem('fontTheme', fontTheme);
    }, [fontTheme]);

    const value = useMemo(() => ({ fontTheme, setFontTheme }), [fontTheme]);

    return (
        <FontThemeContext.Provider value={value}>
            {children}
        </FontThemeContext.Provider>
    );
};

export const useFontTheme = (): FontThemeContextType => {
    const context = useContext(FontThemeContext);
    if (!context) {
        throw new Error('useFontTheme must be used within a FontThemeProvider');
    }
    return context;
};