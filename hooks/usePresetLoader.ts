import { useEffect } from 'react';
import { useWorksheet } from '../services/WorksheetContext.tsx';
import { useSettingsManager } from '../services/settingsManager.ts';

export const usePresetLoader = <T,>(moduleKey: string, setSettings: (settings: T) => void) => {
    const { presetToLoad, setPresetToLoad } = useWorksheet();
    const { loadPreset } = useSettingsManager<T>(moduleKey);

    useEffect(() => {
        if (presetToLoad && presetToLoad.moduleKey === moduleKey) {
            const loaded = loadPreset(presetToLoad.presetName);
            if (loaded) {
                setSettings(loaded);
            }
            setPresetToLoad(null); // Clear after loading
        }
    }, [presetToLoad, setPresetToLoad, loadPreset, setSettings, moduleKey]);
};
