import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Problem } from '../types.ts';

interface UpdateWorksheetArgs {
    newProblems: Problem[];
    clearPrevious: boolean;
    title?: string;
    preamble?: string;
    generatorModule?: string;
    pageCount?: number;
}

interface PresetToLoad {
    moduleKey: string;
    presetName: string;
}

interface WorksheetContextType {
    problems: Problem[];
    title: string;
    preamble: string | null;
    isLoading: boolean;
    pageCount: number;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
    presetToLoad: PresetToLoad | null;
    updateWorksheet: (args: UpdateWorksheetArgs) => void;
    clearWorksheet: () => void;
    setIsLoading: (loading: boolean) => void;
    triggerAutoRefresh: () => void;
    setPresetToLoad: (preset: PresetToLoad | null) => void;
}

const WorksheetContext = createContext<WorksheetContextType | undefined>(undefined);

export const WorksheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [title, setTitle] = useState('Çalışma Kağıdı');
    const [preamble, setPreamble] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [autoRefreshTrigger, setAutoRefreshTrigger] = useState(0);
    const [lastGeneratorModule, setLastGeneratorModule] = useState<string | null>(null);
    const [presetToLoad, setPresetToLoad] = useState<PresetToLoad | null>(null);

    const updateWorksheet = useCallback(({ newProblems, clearPrevious, title: newTitle, preamble: newPreamble, generatorModule, pageCount: newPageCount }: UpdateWorksheetArgs) => {
        setProblems(prev => clearPrevious ? newProblems : [...prev, ...newProblems]);
        if (newTitle) setTitle(newTitle);
        setPreamble(newPreamble ?? null);
        if (generatorModule) setLastGeneratorModule(generatorModule);
        if (newPageCount !== undefined) setPageCount(newPageCount);
    }, []);

    const clearWorksheet = useCallback(() => {
        setProblems([]);
        setTitle('Çalışma Kağıdı');
        setPreamble(null);
        setLastGeneratorModule(null);
    }, []);

    const triggerAutoRefresh = useCallback(() => {
        setAutoRefreshTrigger(c => c + 1);
    }, []);

    return (
        <WorksheetContext.Provider value={{
            problems,
            title,
            preamble,
            isLoading,
            pageCount,
            autoRefreshTrigger,
            lastGeneratorModule,
            presetToLoad,
            updateWorksheet,
            clearWorksheet,
            setIsLoading,
            triggerAutoRefresh,
            setPresetToLoad
        }}>
            {children}
        </WorksheetContext.Provider>
    );
};

export const useWorksheet = (): WorksheetContextType => {
    const context = useContext(WorksheetContext);
    if (!context) {
        throw new Error('useWorksheet must be used within a WorksheetProvider');
    }
    return context;
};