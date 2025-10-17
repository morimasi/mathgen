import React from 'react';

interface HintButtonProps {
    hint: string;
    className?: string;
}

const HintButton: React.FC<HintButtonProps> = ({ hint, className }) => {
    return (
        <div className={`relative inline-block group ${className}`}>
            <button
                type="button"
                className="w-4 h-4 text-xs font-bold text-stone-400 bg-stone-200 dark:bg-stone-600 dark:text-stone-300 rounded-full flex items-center justify-center cursor-help focus:outline-none"
            >
                ?
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 text-xs text-white bg-stone-700 dark:bg-stone-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {hint}
            </div>
        </div>
    );
};

export default HintButton;
