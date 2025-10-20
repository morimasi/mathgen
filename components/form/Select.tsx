import React, { memo } from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    containerClassName?: string;
}

const Select: React.FC<SelectProps> = ({ label, id, options, className, containerClassName, ...props }) => {
    return (
        <div className={`flex flex-col gap-0.5 ${containerClassName}`}>
            {label && <label htmlFor={id} className="font-medium text-xs text-stone-700 dark:text-stone-300">{label}</label>}
            <select
                id={id}
                className={`block w-full px-2 py-0.5 text-xs bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-stone-700 ${className}`}
                {...props}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default memo(Select);