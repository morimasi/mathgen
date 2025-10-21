import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { useUI } from './UIContext.tsx';

export interface TutorialStep {
    targetId: string;
    title: string;
    content: string;
    action?: (ui: ReturnType<typeof useUI>) => void;
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

    const startTutorial = useCallback((tutorialSteps: TutorialStep[]) => {
        setSteps(tutorialSteps);
        setCurrentStepIndex(0);
        setIsTutorialActive(true);
        if (tutorialSteps[0]?.action) {
            tutorialSteps[0].action(ui);
        }
    }, [ui]);

    const endTutorial = useCallback(() => {
        setIsTutorialActive(false);
        setCurrentStepIndex(0);
        setSteps([]);
        localStorage.setItem('hasSeenTutorial', 'true');
    }, []);

    const goToStep = useCallback((index: number) => {
        if (index < 0 || index >= steps.length) {
            endTutorial();
            return;
        }
        const step = steps[index];
        if (step.action) {
            step.action(ui);
        }
        // A small delay to allow UI to update (e.g., panel opening)
        setTimeout(() => {
            setCurrentStepIndex(index);
        }, 150);
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
