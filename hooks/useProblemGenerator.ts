import { useCallback, useEffect, useRef } from 'react';
import { useWorksheet } from '../services/WorksheetContext';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { useToast } from '../services/ToastContext';
import { calculateMaxProblems } from '../services/layoutService';
import { Problem } from '../types';

interface GeneratorOptions<T> {
    moduleKey: string;
    settings: T & { useWordProblems?: boolean; autoFit?: boolean; problemsPerPage?: number; pageCount?: number, layout?: Problem['layout'] };
    generatorFn: (settings: T) => { problem: Problem, title: string, error?: string, preamble?: string };
    aiGeneratorFn?: (moduleKey: string, settings: T) => Promise<Problem[]>;
    aiGeneratorTitle?: string;
    isLive?: boolean;
    isPracticeSheet?: boolean;
}

export const useProblemGenerator = <T,>({
    moduleKey,
    settings,
    generatorFn,
    aiGeneratorFn,
    aiGeneratorTitle,
    isLive = false,
    isPracticeSheet = false,
}: GeneratorOptions<T>) => {
    const { 
        updateWorksheet, 
        setIsLoading, 
        autoRefreshTrigger, 
        lastGeneratorModule 
    } = useWorksheet();
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
    const contentRef = useRef<HTMLDivElement | null>(null); // This should be connected to the real ref
    const isInitialMount = useRef(true);

    // This is a bit of a hack since hooks can't access refs from other components directly.
    // We rely on the fact that the ref is attached to the element with this ID.
    useEffect(() => {
        if (!contentRef.current) {
            contentRef.current = document.getElementById('worksheet-container-0') as HTMLDivElement;
        }
    }, []);

    const generate = useCallback(async (clearPrevious: boolean) => {
        setIsLoading(true);
        try {
            const { useWordProblems, autoFit, problemsPerPage = 20, pageCount = 1, layout } = settings;
            const isTableLayout = printSettings.layoutMode === 'table';

            let totalCount: number;

            if (isPracticeSheet) {
                totalCount = pageCount;
            } else if (isTableLayout) {
                totalCount = printSettings.rows * printSettings.columns * pageCount;
            } else if (autoFit) {
                 // Generate a single sample problem to measure its height accurately.
                let sampleForMeasurement: Problem | undefined;
                if (!useWordProblems) { // Don't generate sample for AI problems
                    const sampleResult = generatorFn(settings);
                    if (sampleResult.problem) {
                        sampleForMeasurement = sampleResult.problem;
                    }
                }
                const calculatedProblems = calculateMaxProblems(contentRef, printSettings, sampleForMeasurement);
                totalCount = (calculatedProblems > 0 ? calculatedProblems : problemsPerPage) * pageCount;
            } else {
                totalCount = problemsPerPage * pageCount;
            }
            
            if (useWordProblems && aiGeneratorFn) {
                const adjustedSettings = { ...settings, problemsPerPage: totalCount, pageCount: 1 };
                const problems = await aiGeneratorFn(moduleKey, adjustedSettings);
                // Assign layout to each problem
                const problemsWithLayout = problems.map(p => ({ ...p, layout }));

                updateWorksheet({
                    newProblems: problemsWithLayout,
                    clearPrevious,
                    title: aiGeneratorTitle || `Yapay Zeka Problemleri - ${moduleKey}`,
                    generatorModule: moduleKey,
                    pageCount: isTableLayout ? 1 : pageCount
                });
            } else {
                let preamble: string | undefined = undefined;
                const results = Array.from({ length: totalCount }, (_, i) => {
                    const result = generatorFn(settings);
                    // Capture preamble only from the first generated problem
                    if (i === 0 && result.preamble) {
                        preamble = result.preamble;
                    }
                    // Assign layout if it exists in settings
                    if (layout) {
                        result.problem.layout = layout;
                    }
                    return result;
                });

                const firstError = results.find(r => r.error);

                if (firstError?.error) {
                    addToast(firstError.error, 'error');
                } else if (results.length > 0) {
                    updateWorksheet({
                        newProblems: results.map(r => r.problem),
                        clearPrevious,
                        title: results[0].title,
                        generatorModule: moduleKey,
                        pageCount: isTableLayout || isPracticeSheet ? 1 : pageCount,
                        preamble: preamble
                    });
                }
            }
        } catch (error: any) {
            console.error(`Error in ${moduleKey} generator:`, error);
            addToast(`Problem oluşturulurken bir hata oluştu: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [
        moduleKey, settings, printSettings, generatorFn, aiGeneratorFn, aiGeneratorTitle, isPracticeSheet,
        setIsLoading, addToast, updateWorksheet
    ]);

    // Auto-refresh trigger
    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === moduleKey) {
            generate(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoRefreshTrigger]);

    // Live update trigger
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (isLive && lastGeneratorModule === moduleKey) {
            const handler = setTimeout(() => {
                generate(true);
            }, 300); // Debounce

            return () => clearTimeout(handler);
        }
    }, [isLive, lastGeneratorModule, settings, printSettings, generate]);

    return { generate };
};