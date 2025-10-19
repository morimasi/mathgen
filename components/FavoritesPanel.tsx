import React, { useEffect, useRef } from 'react';
import { useFavorites } from '../services/settingsManager.ts';
import { useUI } from '../services/UIContext.tsx';
import { useWorksheet } from '../services/WorksheetContext.tsx';
import { TAB_GROUPS } from '../constants.ts';
import { LoadIcon, FavoriteIcon } from './icons/Icons.tsx';
import Button from './form/Button.tsx';

interface FavoritesPanelProps {
    isVisible: boolean;
    onClose: () => void;
}

const allTabs = TAB_GROUPS.flatMap(g => g.tabs);
const moduleNames: Record<string, string> = allTabs.reduce((acc, tab) => {
    acc[tab.id] = tab.label;
    return acc;
}, {} as Record<string, string>);
moduleNames['printSettings'] = 'Yazdırma Ayarları';

const FavoritesPanel: React.FC<FavoritesPanelProps> = ({ isVisible, onClose }) => {
    const { allFavorites, removeFavorite } = useFavorites();
    const { setActiveTab } = useUI();
    const { setPresetToLoad } = useWorksheet();
    const panelRef = useRef<HTMLDivElement>(null);

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

    const handleLoad = (moduleKey: string, presetName: string) => {
        setPresetToLoad({ moduleKey, presetName });
        if (moduleKey !== 'printSettings') {
            setActiveTab(moduleKey);
        }
        onClose();
    };

    const handleRemove = (moduleKey: string, presetName: string) => {
        if (window.confirm(`'${presetName}' ayarını favorilerden kaldırmak istediğinizden emin misiniz?`)) {
            removeFavorite(moduleKey, presetName);
        }
    };
    
    // FIX: Add type guard and assertion to correctly type favoriteEntries and resolve 'unknown' type errors.
    const favoriteEntries = Object.entries(allFavorites).filter(([, presets]) => Array.isArray(presets) && presets.length > 0) as [string, string[]][];

    return (
        <div 
            className={`print:hidden fixed inset-0 z-30 transition-opacity duration-300 ${isVisible ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                ref={panelRef}
                className={`bg-white dark:bg-stone-800 w-full max-w-sm h-full shadow-2xl p-6 overflow-y-auto absolute right-0 top-0 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Favori Ayarlarım</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 -mr-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 text-2xl leading-none"
                        aria-label="Kapat"
                    >
                        &times;
                    </button>
                </div>
                
                <div className="space-y-6">
                    {favoriteEntries.length > 0 ? (
                        favoriteEntries.map(([moduleKey, presets]) => (
                            <div key={moduleKey}>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2 border-b border-stone-200 dark:border-stone-700 pb-1">
                                    {moduleNames[moduleKey] || moduleKey}
                                </h3>
                                <div className="space-y-2 mt-2">
                                    {presets.map(presetName => (
                                        <div key={presetName} className="flex items-center justify-between p-2 bg-stone-50 dark:bg-stone-700/50 rounded-md">
                                            <span className="text-sm font-medium">{presetName}</span>
                                            <div className="flex items-center gap-2">
                                                <Button onClick={() => handleLoad(moduleKey, presetName)} size="sm" variant="secondary" title="Yükle">
                                                    <LoadIcon className="w-4 h-4" />
                                                </Button>
                                                <button onClick={() => handleRemove(moduleKey, presetName)} className="p-1 rounded-full text-stone-400 hover:text-rose-500 transition-colors" title="Favorilerden Kaldır">
                                                    <FavoriteIcon className="w-5 h-5 fill-rose-500 text-rose-500" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-stone-600 dark:text-stone-400">Henüz favori ayar setiniz yok.</p>
                            <p className="text-sm text-stone-500 dark:text-stone-500 mt-2">Bir ayar setini kaydettikten sonra yanındaki kalp ikonuna ❤️ tıklayarak favorilerinize ekleyebilirsiniz.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FavoritesPanel;