import React from 'react';
import { useFlyingLadybugs } from '../../services/FlyingLadybugContext.tsx';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    enableFlyingLadybug?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
    variant = 'primary', 
    size = 'md',
    children, 
    className, 
    enableFlyingLadybug = false,
    ...props 
}) => {
    const { spawnLadybug } = useFlyingLadybugs();
    const baseClasses = 'font-semibold rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-stone-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 active:brightness-95 hover:brightness-105';

    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary-focus',
        secondary: 'bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-200 dark:hover:bg-stone-600 focus:ring-stone-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizeClasses = {
        sm: 'px-3 py-0.5 text-xs',
        md: 'px-4 py-1 text-sm',
        lg: 'px-5 py-1.5 text-base',
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (enableFlyingLadybug) {
            spawnLadybug(e.clientX, e.clientY);
        }
        if (props.onMouseEnter) {
            props.onMouseEnter(e);
        }
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            onMouseEnter={handleMouseEnter}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;