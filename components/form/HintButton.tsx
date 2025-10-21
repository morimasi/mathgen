import React, { useState, useRef, useEffect, memo } from 'react';

// A simple lightbulb icon
const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15.09 16.05A6.49 6.49 0 0 1 12 19a6.5 6.5 0 0 1-3.09-1.05" />
        <path d="M12 14v1" />
        <path d="M12 21a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2Z" />
        <path d="M8.64 11.96A5.47 5.47 0 0 1 8 9.5a5.5 5.5 0 0 1 8-4.42" />
        <path d="M12 2v4" />
        <path d="M4.22 4.22l1.42 1.42" />
        <path d="M18.36 18.36l1.42 1.42" />
        <path d="M1 12h4" />
        <path d="M19 12h4" />
        <path d="M4.22 19.78l1.42-1.42" />
        <path d="M18.36 5.64l1.42-1.42" />
    </svg>
);


interface HintButtonProps {
    text: string;
}

const HintButton: React.FC<HintButtonProps> = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        setIsVisible(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
                popoverRef.current && !popoverRef.current.contains(event.target as Node)
            ) {
                setIsVisible(false);
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    return (
        <div className="relative inline-block">
            <button
                ref={buttonRef}
                onClick={handleClick}
                className="p-1 rounded-full text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-stone-700 transition-colors"
                title="İpucu göster"
                aria-haspopup="true"
                aria-expanded={isVisible}
            >
                <LightbulbIcon className="w-4 h-4" />
            </button>
            {isVisible && (
                <div
                    ref={popoverRef}
                    className="absolute z-20 w-64 p-3 text-sm text-stone-700 bg-amber-50 border border-amber-200 rounded-lg shadow-lg -translate-x-1/2 left-1/2 mt-2 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600"
                    role="tooltip"
                >
                    {text}
                    <div className="absolute w-3 h-3 bg-amber-50 border-t border-l border-amber-200 rotate-45 -top-1.5 left-1/2 -translate-x-1/2 dark:bg-stone-800 dark:border-stone-600"></div>
                </div>
            )}
        </div>
    );
};

export default memo(HintButton);