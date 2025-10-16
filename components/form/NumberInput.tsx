import React from 'react';

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    containerClassName?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, id, className, containerClassName, ...props }) => {
    return (
        <div className={`flex flex-col gap-0.5 ${containerClassName}`}>
            {label && <label htmlFor={id} className="font-medium text-xs text-stone-700 dark:text-stone-300">{label}</label>}
            <input
                type="number"
                id={id}
                className={`block w-full px-2 py-0.5 text-xs bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600 ${className}`}
                {...props}
            />
        </div>
    );
};

export default NumberInput;