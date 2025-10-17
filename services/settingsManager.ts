
const PRESETS_STORAGE_KEY = 'mathgen_presets';

const getAllPresets = <T>(): Record<string, Record<string, T>> => {
    try {
        const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error("Failed to parse presets from localStorage", error);
        return {};
    }
};

export const loadSettingsPresets = <T,>(moduleKey: string): Record<string, T> => {
    const allPresets = getAllPresets<T>();
    return allPresets[moduleKey] || {};
};

export const saveSettingsPreset = <T,>(moduleKey: string, presetName: string, settings: T): void => {
    const allPresets = getAllPresets<T>();
    if (!allPresets[moduleKey]) {
        allPresets[moduleKey] = {};
    }
    allPresets[moduleKey][presetName] = settings;
    try {
        localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(allPresets));
    } catch (error) {
        console.error("Failed to save preset to localStorage", error);
    }
};

export const deleteSettingsPreset = (moduleKey: string, presetName: string): void => {
    const allPresets = getAllPresets();
    if (allPresets[moduleKey] && allPresets[moduleKey][presetName]) {
        delete allPresets[moduleKey][presetName];
        try {
            localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(allPresets));
        } catch (error) {
            console.error("Failed to delete preset from localStorage", error);
        }
    }
};
