import React from 'react';
import { MapReadingSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import NumberInput from '../../components/form/NumberInput.tsx';
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
                <HintButton text="Bu etkinlik, Türkiye haritası üzerinde yönergeleri takip ederek şehirleri bulma, renklendirme ve işaretleme becerilerini geliştirir. Görsel dikkat, okuduğunu anlama ve temel coğrafya bilgisini birleştirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Bölge Seçimi"
                    id="mr-region"
                    value={settings.region}
                    onChange={e => onChange({ region: e.target.value as MapReadingSettings['region'] })}
                    options={[
                        { value: 'turkey', label: 'Tüm Türkiye' },
                        { value: 'marmara', label: 'Marmara Bölgesi' },
                        { value: 'ege', label: 'Ege Bölgesi' },
                        { value: 'akdeniz', label: 'Akdeniz Bölgesi' },
                        { value: 'karadeniz', label: 'Karadeniz Bölgesi' },
                        { value: 'icanadolu', label: 'İç Anadolu Bölgesi' },
                        { value: 'doguanadolu', label: 'Doğu Anadolu Bölgesi' },
                        { value: 'guneydoguanadolu', label: 'Güneydoğu Anadolu Bölgesi' },
                    ]}
                    containerClassName="col-span-2"
                />
                <Select
                    label="Zorluk Seviyesi"
                    id="mr-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as MapReadingSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay' },
                        { value: 'medium', label: 'Orta' },
                        { value: 'hard', label: 'Zor' },
                    ]}
                />
                <NumberInput
                    label="Yönerge Sayısı"
                    id="mr-questionCount"
                    min={3}
                    max={10}
                    value={settings.questionCount}
                    onChange={e => onChange({ questionCount: parseInt(e.target.value, 10) })}
                />
            </div>
        </div>
    );
};

export default MapReadingSettingsComponent;
