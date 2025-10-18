import { useCallback, useRef, useEffect } from 'react';
import { useWorksheet } from '../services/WorksheetContext';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { calculateMaxProblems } from '../services/layoutService';
import { useToast } from '../services/ToastContext';
import { Problem } from '../types';

interface GeneratorOptions<S> {
    moduleKey: string;
    settings: S & { useWordProblems?: boolean, problemsPerPage?: number, pageCount?: number, autoFit?: boolean };
    generatorFn: (settings: S) => { problem: Problem, title: string, error?: string, preamble?: string };
    aiGeneratorFn?: (module: string, settings: S) => Promise<Problem[]>;
    aiGeneratorTitle?: string;
    isLive?: boolean;
    isPracticeSheet?: boolean;
}

export const useProblemGenerator = <S,>({
    moduleKey,
    settings,
    generatorFn,
    aiGeneratorFn,
    aiGeneratorTitle,
    isLive = false,
    isPracticeSheet = false,
}: GeneratorOptions<S>) => {
    const { updateWorksheet, setIsLoading, lastGeneratorModule, autoRefreshTrigger } = useWorksheet();
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (!contentRef.current) {
            // FIX: Cast the result of getElementById to HTMLDivElement to match the ref's type.
            contentRef.current = document.getElementById('worksheet-container-0') as HTMLDivElement;
        }
    }, []);

    const generate = useCallback(async (clearPrevious: boolean) => {
        setIsLoading(true);
        try {
            if (settings.useWordProblems && aiGeneratorFn) {
                const problems = await aiGeneratorFn(moduleKey, settings);
                updateWorksheet({ 
                    newProblems: problems, 
                    clearPrevious, 
                    title: aiGeneratorTitle || 'Yapay Zeka Destekli Problemler',
                    generatorModule: moduleKey,
                    pageCount: printSettings.layoutMode === 'table' ? 1 : settings.pageCount
                });
            } else {
                let totalCount;
                if (isPracticeSheet) {
                    totalCount = settings.pageCount ?? 1;
                } else if (printSettings.layoutMode === 'table') {
                    totalCount = printSettings.rows * printSettings.columns;
                } else if (settings.autoFit) {
                    //FIX: contentRef can be null, provide fallback
                    const problemsPerPage = contentRef.current ? calculateMaxProblems(contentRef, printSettings) : settings.problemsPerPage!;
                    totalCount = (problemsPerPage || settings.problemsPerPage!) * (settings.pageCount ?? 1);
                } else {
                    totalCount = (settings.problemsPerPage ?? 20) * (settings.pageCount ?? 1);
                }
                
                const newProblems: Problem[] = [];
                let newTitle = '';
                let newPreamble: string | undefined = undefined;

                for (let i = 0; i < totalCount; i++) {
                    const { problem, title, error, preamble } = generatorFn(settings);
                    if (error) {
                        addToast(error, 'error');
                        break; 
                    }
                    newProblems.push(problem);
                    if (i === 0) {
                        newTitle = title;
                        newPreamble = preamble;
                    }
                }

                updateWorksheet({ 
                    newProblems, 
                    clearPrevious, 
                    title: newTitle, 
                    preamble: newPreamble,
                    generatorModule: moduleKey,
                    pageCount: printSettings.layoutMode === 'table' || isPracticeSheet ? 1 : settings.pageCount
                });
            }
        } catch (error: any) {
            console.error(`Error generating problems for ${moduleKey}:`, error);
            addToast(`Problem oluşturulurken hata: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [
        settings, 
        printSettings, 
        moduleKey, 
        aiGeneratorFn,
        aiGeneratorTitle,
        generatorFn,
        isPracticeSheet,
        setIsLoading, 
        updateWorksheet, 
        addToast,
    ]);

    // Handle live updates
    useEffect(() => {
        if (!isLive || isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (lastGeneratorModule === moduleKey) {
            const handler = setTimeout(() => {
                generate(true);
            }, 300); // Debounce
            return () => clearTimeout(handler);
        }
    }, [settings, printSettings, isLive, generate, lastGeneratorModule, moduleKey]);

    // Handle auto refresh on print settings change
    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === moduleKey) {
            generate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, generate, moduleKey]);

    return { generate };
};