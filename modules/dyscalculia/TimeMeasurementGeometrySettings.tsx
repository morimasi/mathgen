import React from 'react';
import { TimeMeasurementGeometrySettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: TimeMeasurementGeometrySettings;
    onChange: (settings: Partial<TimeMeasurementGeometrySettings>) => void;
}

const TimeMeasurementGeometrySettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Zaman, Ölçme, Geometri Ayarları</h3>
                <HintButton text="Bu alanlardaki temel kavramları (örn: saat okuma, uzunluk karşılaştırma, şekil tanıma) basitleştirilmiş görsellerle öğretir." />
            </div>
            <Select
                label="Kategori"
                id="tmg-category"
                value={settings.category}
                onChange={e => onChange({ category: e.target.value as TimeMeasurementGeometrySettings['category'] })}
                options={[
                    { value: 'time', label: 'Zaman (Saat Okuma)' },
                    { value: 'measurement', label: 'Ölçme (Uzun/Kısa)' },
                    { value: 'geometry', label: 'Geometri (Şekil Tanıma)' },
                ]}
            />
        </div>
    );
};

export default TimeMeasurementGeometrySettingsComponent;
