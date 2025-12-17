import React, { useEffect } from 'react';
import { useToast } from '../services/ToastContext.tsx';
import { ToastMessage } from '../types.ts';
import { SuccessIcon, ErrorIcon, InfoIcon, CloseIcon } from './icons/ToastIcons.tsx';

const toastConfig = {
    success: { Icon: SuccessIcon, className: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' },
    error: { Icon: ErrorIcon, className: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700' },
    info: { Icon: InfoIcon, className: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' },
    warning: { Icon: ErrorIcon, className: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' },
};

const Toast: React.FC<{ toast: ToastMessage; onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
    const { Icon, className } = toastConfig[toast.type];
    const [isExiting, setIsExiting] = React.useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            const removeTimer = setTimeout(() => onRemove(toast.id), 300); // match animation duration
            return () => clearTimeout(removeTimer);
        }, 5000); // 5 seconds duration

        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    const handleRemove = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
    };

    return (
        <div className={`toast-item ${isExiting ? 'toast-item-exit' : 'toast-item-enter'} ${className}`}>
            <Icon className="w-6 h-6 flex-shrink-0" />
            <p className="flex-grow text-sm font-medium">{toast.message}</p>
            <button onClick={handleRemove} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                <CloseIcon className="w-4 h-4" />
            </button>
        </div>
    );
};


const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;
