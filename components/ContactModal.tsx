import React, { useEffect, useRef } from 'react';
import ContactModule from '../modules/ContactModule.tsx';

interface ContactModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isVisible, onClose }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // Handle focus trapping and Escape key press
    useEffect(() => {
        if (!isVisible) return;
        const panel = panelRef.current;
        if (!panel) return;

        const focusableElements = Array.from(panel.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // FIX: Use instanceof check to ensure element is an HTMLElement before calling focus.
        if (firstElement instanceof HTMLElement) firstElement.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key !== 'Tab') return;

            if (event.shiftKey) { // Shift+Tab
                if (document.activeElement === firstElement) {
                    // FIX: Use instanceof check to ensure element is an HTMLElement before calling focus.
                    if (lastElement instanceof HTMLElement) lastElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    // FIX: Use instanceof check to ensure element is an HTMLElement before calling focus.
                    if (firstElement instanceof HTMLElement) firstElement.focus();
                    event.preventDefault();
                }
            }
        };
        
        panel.addEventListener('keydown', handleKeyDown);
        return () => panel.removeEventListener('keydown', handleKeyDown);
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
                className={`bg-white dark:bg-stone-800 w-full max-w-lg rounded-lg shadow-2xl p-6 transition-all duration-300 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">İletişim &amp; Geri Bildirim</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 -mt-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 text-3xl leading-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Kapat"
                    >
                        &times;
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <ContactModule />
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
