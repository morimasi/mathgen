import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Problem, VisualSupportSettings, ArithmeticOperation } from '../types';

interface UpdateWorksheetPayload {
    newProblems: Problem[];
    clearPrevious: boolean;
    title: string;
    generatorModule: string;
    pageCount: number;
    preamble?: string;
}

interface PresetToLoad {
    moduleKey: string;
    presetName: string;
}

interface WorksheetContextType {
    problems: Problem[];
    isLoading: boolean;
    worksheetTitle: string;
    pageCount: number;
    preamble: string | null;
    lastGeneratorModule: string | null;
    autoRefreshTrigger: number;
    visualSupportSettings: VisualSupportSettings;
    presetToLoad: PresetToLoad | null;
    setIsLoading: (loading: boolean) => void;
    updateWorksheet: (payload: UpdateWorksheetPayload) => void;
    triggerAutoRefresh: () => void;
    setVisualSupportSettings: (settings: VisualSupportSettings) => void;
    resetWorksheet: () => void;
    setPresetToLoad: (preset: PresetToLoad | null) => void;
}

const WorksheetContext = createContext<WorksheetContextType | undefined>(undefined);

const initialVisualSupportSettings: VisualSupportSettings = {
    operation: ArithmeticOperation.Addition,
    maxNumber: 20,
    problemsPerPage: 10,
    pageCount: 1,
    autoFit: true,
    emojiSize: 22,
    numberSize: 24,
    boxSize: 60,
};

export const WorksheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [worksheetTitle, setWorksheetTitle] = useState('');
    const [pageCount, setPageCount] = useState(1);
    const [preamble, setPreamble] = useState<string | null>(null);
    const [lastGeneratorModule, setLastGeneratorModule] = useState<string | null>(null);
    const [autoRefreshTrigger, setAutoRefreshTrigger] = useState(0);
    const [visualSupportSettings, setVisualSupportSettings] = useState<VisualSupportSettings>(initialVisualSupportSettings);
    const [presetToLoad, setPresetToLoad] = useState<PresetToLoad | null>(null);

    const updateWorksheet = useCallback((payload: UpdateWorksheetPayload) => {
        const { newProblems, clearPrevious, title, generatorModule, pageCount, preamble: newPreamble } = payload;
        
        if (clearPrevious) {
            setProblems(newProblems);
            setPreamble(newPreamble || null);
        } else {
            setProblems(prev => [...prev, ...newProblems]);
        }

        setWorksheetTitle(title);
        setLastGeneratorModule(generatorModule);
        setPageCount(pageCount);
    }, []);

    const triggerAutoRefresh = useCallback(() => {
        if (problems.length > 0 && lastGeneratorModule) {
            setAutoRefreshTrigger(c => c + 1);
        }
    }, [problems, lastGeneratorModule]);

    const resetWorksheet = useCallback(() => {
        setProblems([]);
        setIsLoading(false);
        setWorksheetTitle('');
        setPreamble(null);
        setAutoRefreshTrigger(0);
        setLastGeneratorModule(null);
        setPageCount(1);
        setPresetToLoad(null);
    }, []);

    return (
        <WorksheetContext.Provider value={{
            problems,
            isLoading,
            worksheetTitle,
            pageCount,
            preamble,
            lastGeneratorModule,
            autoRefreshTrigger,
            visualSupportSettings,
            presetToLoad,
            setIsLoading,
            updateWorksheet,
            triggerAutoRefresh,
            setVisualSupportSettings,
            resetWorksheet,
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