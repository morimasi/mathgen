import React, { useState, useEffect } from 'react';
import { useSettingsManager } from '../services/settingsManager.ts';
import TextInput from './form/TextInput.tsx';
import Select from './form/Select.tsx';
import Button from './form/Button.tsx';
import { SaveIcon, LoadIcon, DeleteIcon, FavoriteIcon } from './icons/Icons.tsx';

interface SettingsPresetManagerProps<T> {
    moduleKey: string;
    currentSettings: T;
    onLoadSettings: (settings: T) => void;
}

const SettingsPresetManager = <T,>({ moduleKey, currentSettings, onLoadSettings }: SettingsPresetManagerProps<T>) => {
    const { presets, favorites, savePreset, loadPreset, deletePreset, toggleFavorite } = useSettingsManager<T>(moduleKey);
    const [newPresetName, setNewPresetName] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');

    useEffect(() => {
        if (!presets.includes(selectedPreset)) {
            setSelectedPreset('');
        }
    }, [presets, selectedPreset]);

    const handleSave = () => {
        const name = newPresetName.trim();
        if (name) {
            if (presets.includes(name) && !window.confirm(`'${name}' adında bir set zaten mevcut. Üzerine yazmak istiyor musunuz?`)) {
                return;
            }
            savePreset(name, currentSettings);
            setNewPresetName('');
            setSelectedPreset(name);
        }
    };

    const handleLoad = () => {
        if (selectedPreset) {
            const loaded = loadPreset(selectedPreset);
            if (loaded) {
                onLoadSettings(loaded);
            }
        }
    };

    const handleDelete = () => {
        if (selectedPreset) {
            if (window.confirm(`'${selectedPreset}' adlı ayar setini silmek istediğinizden emin misiniz?`)) {
                deletePreset(selectedPreset);
            }
        }
    };
    
    const handleToggleFavorite = () => {
        if (selectedPreset) {
            toggleFavorite(selectedPreset);
        }
    };

    return (
        <div className="pt-3 mt-3 border-t border-stone-200 dark:border-stone-700 space-y-2">
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">Ayar Setleri</h3>
            
            <div className="space-y-1.5 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
                <label htmlFor={`preset-name-${moduleKey}`} className="font-medium text-xs text-stone-700 dark:text-stone-300">Yeni Ayar Seti Kaydet</label>
                <div className="flex gap-2">
                    <TextInput 
                        id={`preset-name-${moduleKey}`}
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                        placeholder="Örn: Günlük Çarpma Alıştırması"
                        containerClassName="flex-grow"
                    />
                    <Button onClick={handleSave} disabled={!newPresetName.trim()} size="md" variant="secondary" title="Mevcut ayarları kaydet">
                        <SaveIcon className="w-5 h-5" />
                        Kaydet
                    </Button>
                </div>
            </div>

            {presets.length > 0 && (
                <div className="space-y-1.5 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
                     <label htmlFor={`select-preset-${moduleKey}`} className="font-medium text-xs text-stone-700 dark:text-stone-300">Kayıtlı Ayar Setini Yönet</label>
                    <div className="flex gap-2 items-center">
                        <Select 
                            id={`select-preset-${moduleKey}`}
                            value={selectedPreset}
                            onChange={(e) => setSelectedPreset(e.target.value)}
                            options={[
                                { value: '', label: 'Bir ayar seti seçin...' },
                                ...presets.map(p => ({ value: p, label: p }))
                            ]}
                            containerClassName="flex-grow"
                        />
                         <button onClick={handleToggleFavorite} disabled={!selectedPreset} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Favorilere Ekle/Çıkar">
                            <FavoriteIcon className={`w-5 h-5 transition-colors ${favorites.includes(selectedPreset) ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleLoad} disabled={!selectedPreset} size="md">
                            <LoadIcon className="w-5 h-5" />
                            Yükle
                        </Button>
                        <Button onClick={handleDelete} disabled={!selectedPreset} size="md" variant="danger">
                            <DeleteIcon className="w-5 h-5" />
                            Sil
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPresetManager;
