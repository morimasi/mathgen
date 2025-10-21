import React, { useEffect, useRef, Suspense } from 'react';
import LoadingDaisy from './LoadingDaisy';

const CustomizationCenterModule = React.lazy(() => import('../modules/CustomizationCenterModule.tsx'));

interface CustomizationCenterModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const CustomizationCenterModal: React.FC<CustomizationCenterModalProps> = ({ isVisible, onClose }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isVisible) return;
        const panel = panelRef.current;
        if (!panel) return;

        const focusableElements = Array.from(panel.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (firstElement instanceof HTMLElement) firstElement.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key !== 'Tab') return;

            if (event.shiftKey) { 
                if (document.activeElement === firstElement) {
                    if (lastElement instanceof HTMLElement) lastElement.focus();
                    event.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    if (firstElement instanceof HTMLElement) firstElement.focus();
                    event.preventDefault();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onClose]);

    return (
        <div
            className={`print:hidden fixed inset-0 z-40 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'bg-black/50' : 'bg-transparent pointer-events-none'}`}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={panelRef}
                className={`bg-white dark:bg-stone-800 w-full max-w-6xl h-[90vh] flex flex-col rounded-lg shadow-2xl transition-all duration-300 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <header className="flex justify-end items-center p-2 border-b border-stone-200 dark:border-stone-700 flex-shrink-0">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 text-3xl leading-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Kapat">&times;</button>
                </header>
                
                <main className="flex-grow overflow-y-auto p-6">
                    <Suspense fallback={
                        <div className="w-full h-full flex items-center justify-center">
                            <LoadingDaisy />
                        </div>
                    }>
                        <CustomizationCenterModule onClose={onClose} />
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

export default CustomizationCenterModal;