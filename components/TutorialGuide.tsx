import React, { useEffect, useState, useRef } from 'react';
import { useTutorial } from '../services/TutorialContext.tsx';
import Button from './form/Button.tsx';

const TutorialGuide: React.FC = () => {
    const { isTutorialActive, currentStepIndex, steps, goToStep, endTutorial } = useTutorial();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const previousHighlightedElement = useRef<Element | null>(null);

    useEffect(() => {
        const updatePosition = () => {
            if (!isTutorialActive) return;
            const currentStep = steps[currentStepIndex];
            if (!currentStep) return;

            if (previousHighlightedElement.current) {
                previousHighlightedElement.current.classList.remove('tutorial-highlight');
            }
            
            const element = document.getElementById(currentStep.targetId);
            if (element) {
                element.classList.add('tutorial-highlight');
                setTargetRect(element.getBoundingClientRect());
                previousHighlightedElement.current = element;
            } else {
                setTargetRect(null); // Center if no element
            }
        };

        if (isTutorialActive) {
            // Use a small timeout to allow actions to complete and UI to re-render
            const timeoutId = setTimeout(updatePosition, 50); 
            window.addEventListener('resize', updatePosition);
            
            return () => {
                clearTimeout(timeoutId);
                window.removeEventListener('resize', updatePosition);
            };
        } else {
            if (previousHighlightedElement.current) {
                previousHighlightedElement.current.classList.remove('tutorial-highlight');
                previousHighlightedElement.current = null;
            }
        }

    }, [isTutorialActive, currentStepIndex, steps]);
    
    if (!isTutorialActive) return null;

    const currentStep = steps[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === steps.length - 1;

    const popoverStyle: React.CSSProperties = {};
    if (targetRect) {
        const placement = currentStep.placement || 'bottom';
        const gap = 15;
        if (placement === 'bottom') {
            popoverStyle.top = `${targetRect.bottom + gap}px`;
            popoverStyle.left = `${targetRect.left + targetRect.width / 2}px`;
            popoverStyle.transform = 'translateX(-50%)';
        } else if (placement === 'top') {
            popoverStyle.top = `${targetRect.top - gap}px`;
            popoverStyle.left = `${targetRect.left + targetRect.width / 2}px`;
            popoverStyle.transform = 'translate(-50%, -100%)';
        } else if (placement === 'right') {
            popoverStyle.top = `${targetRect.top}px`;
            popoverStyle.left = `${targetRect.right + gap}px`;
        } else if (placement === 'left') {
            popoverStyle.top = `${targetRect.top}px`;
            popoverStyle.left = `${targetRect.left - gap}px`;
            popoverStyle.transform = 'translateX(-100%)';
        } else { // center
             popoverStyle.top = '50%';
             popoverStyle.left = '50%';
             popoverStyle.transform = 'translate(-50%, -50%)';
        }
    } else {
        popoverStyle.top = '50%';
        popoverStyle.left = '50%';
        popoverStyle.transform = 'translate(-50%, -50%)';
    }
    
    return (
        <>
            <div className="tutorial-overlay" onClick={endTutorial}></div>
            <div className="tutorial-popover" style={popoverStyle} onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-2 text-primary">{currentStep.title}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-300">{currentStep.content}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-stone-500">{currentStepIndex + 1} / {steps.length}</span>
                    <div className="flex gap-2">
                        {!isFirstStep && <Button onClick={() => goToStep(currentStepIndex - 1)} variant="secondary" size="sm">Geri</Button>}
                        {isLastStep ? (
                            <Button onClick={endTutorial} size="sm">Bitir</Button>
                        ) : (
                            <Button onClick={() => goToStep(currentStepIndex + 1)} size="sm">İleri</Button>
                        )}
                         <Button onClick={endTutorial} variant="secondary" size="sm">Turu Kapat</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TutorialGuide;