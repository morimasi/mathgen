
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTutorial } from '../services/TutorialContext.tsx';
import Button from './form/Button.tsx';

// Ladybug Mascot Component for the Tutorial
const TutorialMascot: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`relative w-24 h-24 flex-shrink-0 -mt-8 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
             <g transform="translate(0, 5) rotate(-10 50 50)">
                {/* Wings */}
                <path d="M 50 50 C 20 20, 20 80, 50 80 Z" fill="#ff4444" stroke="#991b1b" strokeWidth="2" />
                <path d="M 50 50 C 80 20, 80 80, 50 80 Z" fill="#ff4444" stroke="#991b1b" strokeWidth="2" />
                {/* Spots */}
                <circle cx="35" cy="45" r="5" fill="#111" />
                <circle cx="65" cy="45" r="5" fill="#111" />
                <circle cx="40" cy="65" r="4" fill="#111" />
                <circle cx="60" cy="65" r="4" fill="#111" />
                {/* Body & Head */}
                <ellipse cx="50" cy="55" rx="15" ry="25" fill="none" stroke="#111" strokeWidth="1" opacity="0.2"/>
                <circle cx="50" cy="30" r="15" fill="#111" />
                {/* Eyes */}
                <circle cx="44" cy="28" r="4" fill="white" />
                <circle cx="56" cy="28" r="4" fill="white" />
                <circle cx="44" cy="28" r="1.5" fill="black" />
                <circle cx="56" cy="28" r="1.5" fill="black" />
                {/* Antennae */}
                <path d="M 40 20 Q 30 10 25 15" stroke="#111" strokeWidth="2" fill="none" />
                <path d="M 60 20 Q 70 10 75 15" stroke="#111" strokeWidth="2" fill="none" />
             </g>
        </svg>
    </div>
);

const TutorialGuide: React.FC = () => {
    const { isTutorialActive, currentStepIndex, steps, goToStep, endTutorial } = useTutorial();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Handle Window Resize
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Track Target Element Position
    useEffect(() => {
        if (!isTutorialActive) return;

        const updatePosition = () => {
            const currentStep = steps[currentStepIndex];
            if (!currentStep) return;

            // Special case for 'root' or 'center' placement - no specific target highlight
            if (currentStep.targetId === 'root') {
                setTargetRect(null);
                return;
            }

            const element = document.getElementById(currentStep.targetId);
            if (element) {
                // Scroll element into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
            } else {
                // If element not found, fallback to center
                setTargetRect(null);
            }
        };

        // Run immediately and after a short delay for animations
        updatePosition();
        const t1 = setTimeout(updatePosition, 100);
        const t2 = setTimeout(updatePosition, 500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [isTutorialActive, currentStepIndex, steps, windowSize]);

    if (!isTutorialActive) return null;

    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;

    // --- Spotlight Calculation ---
    // We create a massive box-shadow on a div that sits *on top* of the target.
    // However, a cleaner CSS-only way for "cutout" is using a large border or outline,
    // or 4 divs. Let's use 4 divs to create the dark overlay around the target.
    
    let spotlightOverlay = null;
    if (targetRect) {
        const padding = 8; // Breathing room around element
        const top = targetRect.top - padding;
        const left = targetRect.left - padding;
        const width = targetRect.width + (padding * 2);
        const height = targetRect.height + (padding * 2);

        spotlightOverlay = (
            <>
                {/* Top overlay */}
                <div className="fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-[2px] transition-all duration-300 z-50" style={{ height: Math.max(0, top) }} />
                {/* Bottom overlay */}
                <div className="fixed left-0 right-0 bottom-0 bg-black/60 backdrop-blur-[2px] transition-all duration-300 z-50" style={{ top: top + height }} />
                {/* Left overlay */}
                <div className="fixed left-0 bg-black/60 backdrop-blur-[2px] transition-all duration-300 z-50" style={{ top: top, height: height, width: Math.max(0, left) }} />
                {/* Right overlay */}
                <div className="fixed right-0 bg-black/60 backdrop-blur-[2px] transition-all duration-300 z-50" style={{ top: top, height: height, left: left + width }} />
                
                {/* The "Hole" Border - An animated ring around the target */}
                <div 
                    className="fixed z-50 pointer-events-none rounded-lg border-2 border-primary shadow-[0_0_20px_rgba(234,88,12,0.6)] transition-all duration-300 animate-pulse"
                    style={{ top, left, width, height }}
                />
            </>
        );
    } else {
        // Full screen overlay for intro/outro
        spotlightOverlay = <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity" />;
    }

    // --- Popover Positioning ---
    const popoverStyle: React.CSSProperties = { position: 'fixed', zIndex: 60 };
    
    if (targetRect) {
        const gap = 20;
        const placement = currentStep.placement || 'bottom';
        
        // Calculate raw positions
        let top = 0, left = 0, transform = '';
        
        // Horizontal center of target
        const centerX = targetRect.left + targetRect.width / 2;
        // Vertical center of target
        const centerY = targetRect.top + targetRect.height / 2;

        switch (placement) {
            case 'top':
                top = targetRect.top - gap;
                left = centerX;
                transform = 'translate(-50%, -100%)';
                break;
            case 'bottom':
                top = targetRect.bottom + gap;
                left = centerX;
                transform = 'translateX(-50%)';
                break;
            case 'left':
                top = centerY;
                left = targetRect.left - gap;
                transform = 'translate(-100%, -50%)';
                break;
            case 'right':
                top = centerY;
                left = targetRect.right + gap;
                transform = 'translate(0, -50%)';
                break;
            default: // center
                top = windowSize.height / 2;
                left = windowSize.width / 2;
                transform = 'translate(-50%, -50%)';
        }

        // Clamp logic to keep popover within screen bounds (basic implementation)
        // Since transform depends on popover size (unknown in CSS), we trust standard placement mostly
        // but can adjust 'left' if it's too close to edges for top/bottom placement.
        if (placement === 'top' || placement === 'bottom') {
            if (left < 160) left = 160; // min-width/2 roughly
            if (left > windowSize.width - 160) left = windowSize.width - 160;
        }

        popoverStyle.top = top;
        popoverStyle.left = left;
        popoverStyle.transform = transform;

    } else {
        // Center of screen
        popoverStyle.top = '50%';
        popoverStyle.left = '50%';
        popoverStyle.transform = 'translate(-50%, -50%)';
    }

    return (
        <>
            {spotlightOverlay}
            
            <div 
                className="w-[90vw] max-w-md bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border-2 border-white/50 dark:border-stone-600 transition-all duration-300 animate-fade-in-scale"
                style={popoverStyle}
            >
                {/* Mascot - Peeking over the top */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
                    <TutorialMascot className="animate-bounce-slow" />
                </div>

                <div className="relative pt-12 pb-6 px-6 text-center">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                        {currentStep.title}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300 mb-6 text-sm leading-relaxed">
                        {currentStep.content}
                    </p>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-1.5 mb-6">
                        {steps.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    idx === currentStepIndex 
                                        ? 'w-6 bg-primary' 
                                        : idx < currentStepIndex ? 'w-1.5 bg-primary/40' : 'w-1.5 bg-stone-200 dark:bg-stone-700'
                                }`}
                            />
                        ))}
                    </div>

                    <div className="flex justify-between items-center gap-4">
                        <button 
                            onClick={endTutorial}
                            className="text-xs font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                        >
                            Turu Atla
                        </button>
                        
                        <div className="flex gap-2">
                            {currentStepIndex > 0 && (
                                <Button onClick={() => goToStep(currentStepIndex - 1)} variant="secondary" size="sm">
                                    Geri
                                </Button>
                            )}
                            <Button 
                                onClick={() => isLastStep ? endTutorial() : goToStep(currentStepIndex + 1)} 
                                size="md"
                                className="shadow-lg shadow-orange-500/20"
                            >
                                {isLastStep ? "Harika! Bitir" : "Devam Et"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TutorialGuide;
