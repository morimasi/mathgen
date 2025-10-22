import React, { useState, useEffect } from 'react';
import { useTutorial } from '../services/TutorialContext.tsx';
import { TUTORIAL_STEPS } from '../tutorialSteps.ts';
import Button from './form/Button.tsx';

const FirstTimeUserBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { startTutorial } = useTutorial();

    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenTutorial');
        if (!hasSeen) {
            // Delay showing the banner slightly
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleStartTour = () => {
        startTutorial(TUTORIAL_STEPS);
        setIsVisible(false); // Hide banner when tour starts
    };

    const handleDismiss = () => {
        localStorage.setItem('hasSeenTutorial', 'true');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-stone-800 shadow-2xl rounded-lg p-4 flex items-center gap-4 z-40 animate-fade-in-up print:hidden">
            <div className="text-5xl -mt-2">👋</div>
            <div>
                <h3 className="font-bold">MathGen'e Hoş Geldiniz!</h3>
                <p className="text-sm text-stone-600 dark:text-stone-300">Uygulamayı nasıl kullanacağınızı öğrenmek için hızlı bir tura katılın.</p>
            </div>
            <div className="flex gap-2">
                <Button onClick={handleStartTour} size="sm">Turu Başlat</Button>
                <Button onClick={handleDismiss} variant="secondary" size="sm">Kapat</Button>
            </div>
        </div>
    );
};

export default FirstTimeUserBanner;