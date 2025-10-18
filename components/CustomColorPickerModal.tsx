import React, { useState, useEffect, useRef } from 'react';
import { useColorTheme } from '../services/ColorThemeContext.tsx';
import Button from './form/Button.tsx';

interface CustomColorPickerModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const CustomColorPickerModal: React.FC<CustomColorPickerModalProps> = ({ isVisible, onClose }) => {
    const { customColor, setCustomColor, setColorTheme } = useColorTheme();
    const [hex, setHex] = useState(customColor);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHex(customColor);
    }, [customColor]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    useEffect(() => {
        if (isVisible) panelRef.current?.focus();
    }, [isVisible]);

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHex(e.target.value);
    };

    const handleApply = () => {
        const validHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
        if (validHex) {
            setCustomColor(hex);
            setColorTheme('custom');
            onClose();
        } else {
            alert("Lütfen geçerli bir HEX renk kodu girin (örn: #f97316).");
        }
    };

    return (
         <div
            className={`print:hidden fixed inset-0 z-40 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'bg-black/50' : 'bg-transparent pointer-events-none'}`}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={panelRef}
                className={`bg-white dark:bg-stone-800 w-full max-w-xs rounded-lg shadow-2xl p-6 transition-all duration-300 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Özel Renk Seçimi</h2>
                    <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 text-3xl leading-none" aria-label="Kapat">&times;</button>
                </header>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <input
                            type="color"
                            value={hex}
                            onChange={handleHexChange}
                            className="w-16 h-16 border-none p-0 cursor-pointer rounded-md overflow-hidden bg-transparent"
                        />
                         <div className="flex-grow">
                             <label htmlFor="hex-input" className="font-medium text-xs text-stone-700 dark:text-stone-300">HEX Kodu</label>
                            <input
                                id="hex-input"
                                type="text"
                                value={hex}
                                onChange={handleHexChange}
                                className="block w-full px-2 py-1 text-sm bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600"
                            />
                        </div>
                    </div>
                    <Button onClick={handleApply} className="w-full">Uygula ve Kapat</Button>
                </div>
            </div>
        </div>
    );
};

export default CustomColorPickerModal;
