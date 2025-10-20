import React, { memo } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    containerClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, className, containerClassName, ...props }) => {
    return (
        <div className={`flex items-center gap-1.5 ${containerClassName}`}>
            <input
                type="checkbox"
                id={id}
                className={`h-4 w-4 rounded border-stone-300 text-orange-700 focus:ring-orange-600 dark:bg-stone-700 dark:border-stone-600 dark:checked:bg-orange-700 dark:focus:ring-orange-700 dark:ring-offset-stone-800 ${className}`}
                {...props}
            />
            <label htmlFor={id} className="font-medium text-xs text-stone-700 dark:text-stone-300 select-none cursor-pointer">
                {label}
            </label>
        </div>
    );
};

export default memo(Checkbox);