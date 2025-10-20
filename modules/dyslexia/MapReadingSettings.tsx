import React from 'react';
import { MapReadingSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: MapReadingSettings;
    onChange: (settings: Partial<MapReadingSettings>) => void;
}

const MapReadingSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Harita Okuma Ayarları</h3>
                <HintButton text="Görsel-uzamsal becerileri ve yönergeleri takip etme yeteneğini geliştirmek için basit harita okuma etkinlikleri sunar." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Harita Türü"
                    id="mr-mapType"
                    value={settings.mapType}
                    onChange={e => onChange({ mapType: e.target.value as MapReadingSettings['mapType'] })}
                    options={[
                        { value: 'neighborhood', label: 'Mahalle' },
                        { value: 'zoo', label: 'Hayvanat Bahçesi' },
                        { value: 'city', label: 'Şehir Merkezi' },
                    ]}
                />
                <Select
                    label="Görev"
                    id="mr-task"
                    value={settings.task}
                    onChange={e => onChange({ task: e.target.value as MapReadingSettings['task'] })}
                    options={[
                        { value: 'find-place', label: 'Yeri Bul' },
                        { value: 'follow-directions', label: 'Yönergeleri Takip Et' },
                    ]}
                />
            </div>
        </div>
    );
};

export default MapReadingSettingsComponent;
