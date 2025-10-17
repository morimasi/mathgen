
import React, { useState, useEffect } from 'react';
import { saveSettingsPreset, loadSettingsPresets, deleteSettingsPreset } from '../services/settingsManager';
import Select from './form/Select';
import Button from './form/Button';
import TextInput from './form/TextInput';

interface SettingsPresetManagerProps<T> {
    moduleKey: string;
    currentSettings: T;
    onLoadSettings: (settings: T) => void;
    initialSettings?: T;
}

const SettingsPresetManager = <T,>({ moduleKey, currentSettings, onLoadSettings, initialSettings }: SettingsPresetManagerProps<T>) => {
    const [presets, setPresets] = useState<Record<string, T>>({});
    const [presetName, setPresetName] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');

    useEffect(() => {
        setPresets(loadSettingsPresets<T>(moduleKey));
    }, [moduleKey]);

    const handleSave = () => {
        if (!presetName) return;
        saveSettingsPreset(moduleKey, presetName, currentSettings);
        setPresets(loadSettingsPresets<T>(moduleKey));
        setSelectedPreset(presetName);
        setPresetName('');
    };

    const handleLoad = () => {
        if (!selectedPreset) return;
        const loadedSettings = presets[selectedPreset];
        if (loadedSettings) {
            onLoadSettings(loadedSettings);
        }
    };
    
    const handleDelete = () => {
        if (!selectedPreset) return;
        deleteSettingsPreset(moduleKey, selectedPreset);
        setPresets(loadSettingsPresets<T>(moduleKey));
        setSelectedPreset('');
    };

    const handleReset = () => {
        if(initialSettings) {
            onLoadSettings(initialSettings);
        }
    };

    const presetOptions = Object.keys(presets).map(name => ({ value: name, label: name }));

    return (
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700 space-y-3">
            <h3 className="text-sm font-semibold">Ayar Setleri</h3>
            <div className="space-y-2">
                <div className="flex gap-2">
                    <TextInput
                        containerClassName="flex-grow"
                        placeholder="Yeni ayar seti adı..."
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                    />
                    <Button onClick={handleSave} size="md" disabled={!presetName}>Kaydet</Button>
                </div>
                 {presetOptions.length > 0 && (
                    <div className="flex gap-2 items-end">
                        <Select
                            containerClassName="flex-grow"
                            options={[{ value: '', label: 'Yüklemek için seçin...' }, ...presetOptions]}
                            value={selectedPreset}
                            onChange={(e) => setSelectedPreset(e.target.value)}
                        />
                        <Button onClick={handleLoad} variant="secondary" size="md" disabled={!selectedPreset}>Yükle</Button>
                        <Button onClick={handleDelete} variant="danger" size="md" disabled={!selectedPreset}>Sil</Button>
                    </div>
                 )}
                 {initialSettings && <Button onClick={handleReset} variant="secondary" size="md" className="w-full">Varsayılan Ayarlara Dön</Button>}
            </div>
        </div>
    );
};

export default SettingsPresetManager;
