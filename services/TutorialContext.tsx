
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { useUI } from './UIContext.tsx';

export interface TutorialStep {
    targetId: string;
    title: string;
    content: string;
    // Action can now be async to allow for UI transitions (e.g. waiting for a tab to switch)
    action?: (ui: ReturnType<typeof useUI>) => Promise<void> | void;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TutorialContextType {
    isTutorialActive: boolean;
    currentStepIndex: number;
    steps: TutorialStep[];
    startTutorial: (steps: TutorialStep[]) => void;
    endTutorial: () => void;
    goToStep: (index: number) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isTutorialActive, setIsTutorialActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [steps, setSteps] = useState<TutorialStep[]>([]);
    const ui = useUI();

    const executeStepAction = async (step: TutorialStep) => {
        if (step.action) {
            await step.action(ui);
            // Add a small delay after action to allow UI to settle (rendering panels etc)
            await new Promise(resolve => setTimeout(resolve, 300)); 
        }
    };

    const startTutorial = useCallback(async (tutorialSteps: TutorialStep[]) => {
        setSteps(tutorialSteps);
        setCurrentStepIndex(0);
        setIsTutorialActive(true);
        if (tutorialSteps.length > 0) {
            await executeStepAction(tutorialSteps[0]);
        }
    }, [ui]);

    const endTutorial = useCallback(() => {
        setIsTutorialActive(false);
        setCurrentStepIndex(0);
        setSteps([]);
        localStorage.setItem('hasSeenTutorial', 'true');
    }, []);

    const goToStep = useCallback(async (index: number) => {
        if (index < 0 || index >= steps.length) {
            endTutorial();
            return;
        }
        
        // Execute the action for the upcoming step
        const step = steps[index];
        await executeStepAction(step);
        
        setCurrentStepIndex(index);
    }, [steps, endTutorial, ui]);

    return (
        <TutorialContext.Provider value={{ isTutorialActive, currentStepIndex, steps, startTutorial, endTutorial, goToStep }}>
            {children}
        </TutorialContext.Provider>
    );
};

export const useTutorial = (): TutorialContextType => {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorial must be used within a TutorialProvider');
    }
    return context;
};
