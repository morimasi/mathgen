import React, { createContext, useState, useContext, ReactNode } from 'react';
import { PrintSettings } from '../types';

interface PrintSettingsContextType {
    settings: PrintSettings;
    setSettings: React.Dispatch<React.SetStateAction<PrintSettings>>;
}

const PrintSettingsContext = createContext<PrintSettingsContextType | undefined>(undefined);

const initialPrintSettings: PrintSettings = {
    layoutMode: 'flow',
    rows: 10,
    columns: 1,
    columnGap: 2,
    fontSize: 16,
    showHeader: false,
    showProblemNumbers: false,
    notebookStyle: 'none',
    borderStyle: 'none',
    problemSpacing: 2,
    pageMargin: 2,
    lineHeight: 1.5,
    scale: 1,
    colorTheme: 'black',
    orientation: 'portrait',
    textAlign: 'left',
};

export const PrintSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<PrintSettings>(initialPrintSettings);

    return (
        <PrintSettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </PrintSettingsContext.Provider>
    );
};

export const usePrintSettings = (): PrintSettingsContextType => {
    const context = useContext(PrintSettingsContext);
    if (!context) {
        throw new Error('usePrintSettings must be used within a PrintSettingsProvider');
    }
    return context;
};