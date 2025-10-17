import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Problem, VisualSupportSettings, ArithmeticOperation } from '../types';

interface UpdateWorksheetPayload {
    newProblems: Problem[];
    clearPrevious: boolean;
    title: string;
    generatorModule: string;
    pageCount: number;
}

interface WorksheetContextType {
    problems: Problem[];
    isLoading: boolean;
    worksheetTitle: string;
    pageCount: number;
    lastGeneratorModule: string | null;
    autoRefreshTrigger: number;
    visualSupportSettings: VisualSupportSettings;
    setIsLoading: (loading: boolean) => void;
    updateWorksheet: (payload: UpdateWorksheetPayload) => void;
    triggerAutoRefresh: () => void;
    setVisualSupportSettings: (settings: VisualSupportSettings) => void;
    resetWorksheet: () => void;
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
    const [lastGeneratorModule, setLastGeneratorModule] = useState<string | null>(null);
    const [autoRefreshTrigger, setAutoRefreshTrigger] = useState(0);
    const [visualSupportSettings, setVisualSupportSettings] = useState<VisualSupportSettings>(initialVisualSupportSettings);

    const updateWorksheet = useCallback((payload: UpdateWorksheetPayload) => {
        const { newProblems, clearPrevious, title, generatorModule, pageCount } = payload;
        setProblems(prev => clearPrevious ? newProblems : [...prev, ...newProblems]);
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
        setAutoRefreshTrigger(0);
        setLastGeneratorModule(null);
        setPageCount(1);
    }, []);

    return (
        <WorksheetContext.Provider value={{
            problems,
            isLoading,
            worksheetTitle,
            pageCount,
            lastGeneratorModule,
            autoRefreshTrigger,
            visualSupportSettings,
            setIsLoading,
            updateWorksheet,
            triggerAutoRefresh,
            setVisualSupportSettings,
            resetWorksheet
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
