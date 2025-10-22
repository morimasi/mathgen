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
            const timer = setTimeout(() => setIsVisible(true), 1500);
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
        <div 
            className="fixed inset-0 z-40 flex items-center justify-center p-4 print:hidden animate-fade-in"
            aria-modal="true"
            role="dialog"
        >
            <div className="absolute inset-0 bg-black/60" onClick={handleDismiss}></div>
            <div 
                className="relative bg-white dark:bg-stone-800 shadow-2xl rounded-lg p-6 w-full max-w-md text-center animate-fade-in-scale"
                role="document"
            >
                <div className="text-6xl mb-4">👋</div>
                <h3 className="text-xl font-bold mb-2">MathGen'e Hoş Geldiniz!</h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 mb-6">
                    Uygulamayı nasıl kullanacağınızı öğrenmek için hızlı ve etkileşimli bir tura katılın.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button onClick={handleStartTour} size="lg" className="w-full sm:w-auto">Turu Başlat</Button>
                    <Button onClick={handleDismiss} variant="secondary" size="lg" className="w-full sm:w-auto">Daha Sonra</Button>
                </div>
            </div>
        </div>
    );
};

export default FirstTimeUserBanner;