import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    containerClassName?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, id, className, containerClassName, ...props }) => {
    return (
        <div className={`flex flex-col gap-1 ${containerClassName}`}>
            {label && <label htmlFor={id} className="font-medium text-sm text-stone-700 dark:text-stone-300">{label}</label>}
            <input
                type="text"
                id={id}
                className={`block w-full px-2.5 py-1.5 text-sm bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600 ${className}`}
                {...props}
            />
        </div>
    );
};

export default TextInput;