import { useState, useCallback } from 'react';

const STORAGE_KEY = 'mathGenPresets';

const getStoredPresets = () => {
    try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        return item ? JSON.parse(item) : {};
    } catch (error) {
        console.error("Error reading presets from localStorage", error);
        return {};
    }
};

const setStoredPresets = (presets: Record<string, any>) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    } catch (error) {
        console.error("Error saving presets to localStorage", error);
    }
};

export const useSettingsManager = <T,>(moduleKey: string) => {
    const [presets, setPresets] = useState<string[]>(() => {
        const allPresets = getStoredPresets();
        return Object.keys(allPresets[moduleKey] || {});
    });

    const refreshPresets = useCallback(() => {
        const allPresets = getStoredPresets();
        setPresets(Object.keys(allPresets[moduleKey] || {}));
    }, [moduleKey]);

    const savePreset = useCallback((name: string, settings: T) => {
        if (!name) return;
        const allPresets = getStoredPresets();
        if (!allPresets[moduleKey]) {
            allPresets[moduleKey] = {};
        }
        allPresets[moduleKey][name] = settings;
        setStoredPresets(allPresets);
        refreshPresets();
    }, [moduleKey, refreshPresets]);

    const loadPreset = useCallback((name: string): T | null => {
        const allPresets = getStoredPresets();
        return allPresets[moduleKey]?.[name] || null;
    }, [moduleKey]);

    const deletePreset = useCallback((name: string) => {
        const allPresets = getStoredPresets();
        if (allPresets[moduleKey]?.[name]) {
            delete allPresets[moduleKey][name];
            setStoredPresets(allPresets);
            refreshPresets();
        }
    }, [moduleKey, refreshPresets]);

    return { presets, savePreset, loadPreset, deletePreset };
};