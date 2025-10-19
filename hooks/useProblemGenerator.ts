import { useCallback, useRef, useEffect } from 'react';
import { useWorksheet } from '../services/WorksheetContext.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import { calculateMaxProblems } from '../services/layoutService.ts';
import { useToast } from '../services/ToastContext.tsx';
import { Problem } from '../types.ts';

interface GeneratorOptions<S> {
    moduleKey: string;
    settings: S & { useWordProblems?: boolean, problemsPerPage?: number, pageCount?: number, autoFit?: boolean };
    generatorFn: (settings: S) => { problem: Problem, title: string, error?: string, preamble?: string };
    aiGeneratorFn?: (module: string, settings: S) => Promise<Problem[]>;
    aiGeneratorTitle?: string;
    isPracticeSheet?: boolean;
}

export const useProblemGenerator = <S,>({
    moduleKey,
    settings,
    generatorFn,
    aiGeneratorFn,
    aiGeneratorTitle,
    isPracticeSheet = false,
}: GeneratorOptions<S>) => {
    const { updateWorksheet, setIsLoading, lastGeneratorModule, autoRefreshTrigger } = useWorksheet();
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!contentRef.current) {
            // FIX: Cast the result of getElementById to HTMLDivElement to match the ref's type.
            contentRef.current = document.getElementById('worksheet-container-0') as HTMLDivElement;
        }
    }, []);

    const generate = useCallback(async (clearPrevious: boolean, overrideSettings?: Partial<S>) => {
        setIsLoading(true);
        try {
            const finalSettings = { ...settings, ...overrideSettings };

            if (finalSettings.useWordProblems && aiGeneratorFn) {
                const problems = await aiGeneratorFn(moduleKey, finalSettings);
                updateWorksheet({ 
                    newProblems: problems, 
                    clearPrevious, 
                    title: aiGeneratorTitle || 'Yapay Zeka Destekli Problemler',
                    generatorModule: moduleKey,
                    pageCount: printSettings.layoutMode === 'table' ? 1 : finalSettings.pageCount
                });
            } else {
                let totalCount;
                if (isPracticeSheet) {
                    totalCount = finalSettings.pageCount ?? 1;
                } else if (printSettings.layoutMode === 'table') {
                    totalCount = printSettings.rows * printSettings.columns;
                } else if (finalSettings.autoFit) {
                    //FIX: contentRef can be null, provide fallback
                    const problemsPerPage = contentRef.current ? calculateMaxProblems(contentRef, printSettings) : finalSettings.problemsPerPage!;
                    totalCount = (problemsPerPage || finalSettings.problemsPerPage!) * (finalSettings.pageCount ?? 1);
                } else if (overrideSettings) {
                    totalCount = 1;
                }
                else {
                    totalCount = (finalSettings.problemsPerPage ?? 20) * (finalSettings.pageCount ?? 1);
                }
                
                const newProblems: Problem[] = [];
                let newTitle = '';
                let newPreamble: string | undefined = undefined;

                for (let i = 0; i < totalCount; i++) {
                    const { problem, title, error, preamble } = generatorFn(finalSettings);
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
                    pageCount: printSettings.layoutMode === 'table' || isPracticeSheet ? 1 : finalSettings.pageCount
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

    // Handle auto refresh on print settings change or header refresh button
    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === moduleKey) {
            generate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, generate, moduleKey]);

    return { generate };
};