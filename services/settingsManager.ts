import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'mathGenPresets_v2';

interface StoredData {
    favorites: Record<string, string[]>;
    modules: Record<string, Record<string, any>>;
}

const getStoredData = (): StoredData => {
    try {
        if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
            return { favorites: {}, modules: {} };
        }
        const item = window.localStorage.getItem(STORAGE_KEY);
        const parsed = item ? JSON.parse(item) : {};
        return {
            favorites: parsed.favorites || {},
            modules: parsed.modules || {}
        };
    } catch (error) {
        console.error("Error reading presets from localStorage", error);
        return { favorites: {}, modules: {} };
    }
};

const setStoredData = (data: StoredData) => {
    try {
        if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
            return;
        }
        const event = new Event('storage');
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        window.dispatchEvent(event);
    } catch (error) {
        console.error("Error saving presets to localStorage", error);
    }
};

export const useSettingsManager = <T,>(moduleKey: string) => {
    const [presets, setPresets] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    const refreshState = useCallback(() => {
        const data = getStoredData();
        setPresets(Object.keys(data.modules[moduleKey] || {}));
        setFavorites(data.favorites[moduleKey] || []);
    }, [moduleKey]);

    useEffect(() => {
        refreshState();
        window.addEventListener('storage', refreshState);
        return () => window.removeEventListener('storage', refreshState);
    }, [refreshState]);

    const savePreset = useCallback((name: string, settings: T) => {
        if (!name) return;
        const data = getStoredData();
        if (!data.modules[moduleKey]) {
            data.modules[moduleKey] = {};
        }
        data.modules[moduleKey][name] = settings;
        setStoredData(data);
    }, [moduleKey]);

    const loadPreset = useCallback((name: string): T | null => {
        const data = getStoredData();
        return data.modules[moduleKey]?.[name] || null;
    }, [moduleKey]);

    const deletePreset = useCallback((name: string) => {
        const data = getStoredData();
        if (data.modules[moduleKey]?.[name]) {
            delete data.modules[moduleKey][name];
            if (data.favorites[moduleKey]) {
                data.favorites[moduleKey] = data.favorites[moduleKey].filter(fav => fav !== name);
            }
            setStoredData(data);
        }
    }, [moduleKey]);

    const toggleFavorite = useCallback((name: string) => {
        const data = getStoredData();
        if (!data.favorites[moduleKey]) {
            data.favorites[moduleKey] = [];
        }
        const favIndex = data.favorites[moduleKey].indexOf(name);
        if (favIndex > -1) {
            data.favorites[moduleKey].splice(favIndex, 1);
        } else {
            data.favorites[moduleKey].push(name);
        }
        setStoredData(data);
    }, [moduleKey]);

    return { presets, favorites, savePreset, loadPreset, deletePreset, toggleFavorite };
};

export const useFavorites = () => {
    const [allFavorites, setAllFavorites] = useState<Record<string, string[]>>({});

    const refreshAllFavorites = useCallback(() => {
        const data = getStoredData();
        setAllFavorites(data.favorites);
    }, []);

    useEffect(() => {
        refreshAllFavorites();
        window.addEventListener('storage', refreshAllFavorites);
        return () => window.removeEventListener('storage', refreshAllFavorites);
    }, [refreshAllFavorites]);
    
    const removeFavorite = useCallback((moduleKey: string, name: string) => {
        const data = getStoredData();
        if (data.favorites[moduleKey]) {
            data.favorites[moduleKey] = data.favorites[moduleKey].filter(fav => fav !== name);
            if (data.favorites[moduleKey].length === 0) {
                delete data.favorites[moduleKey];
            }
            setStoredData(data);
        }
    }, []);

    const loadPreset = useCallback((moduleKey: string, presetName: string): any | null => {
        const data = getStoredData();
        return data.modules[moduleKey]?.[presetName] || null;
    }, []);

    return { allFavorites, removeFavorite, loadPreset };
};
