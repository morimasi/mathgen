import React from 'react';
import { GeometricDoodlingSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: GeometricDoodlingSettings;
    onChange: (settings: Partial<GeometricDoodlingSettings>) => void;
}

const GeometricDoodlingSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Geometrik Çizimler Ayarları</h3>
                <HintButton text="Temel geometrik şekillerin üzerinden giderek el-göz koordinasyonunu ve motor planlama becerilerini geliştirir." />
            </div>
            <Select
                label="Şekil Türü"
                id="gd-shape"
                value={settings.shape}
                onChange={e => onChange({ shape: e.target.value as GeometricDoodlingSettings['shape'] })}
                options={[
                    { value: 'square', label: 'Kare' },
                    { value: 'triangle', label: 'Üçgen' },
                    { value: 'circle', label: 'Daire' },
                    { value: 'star', label: 'Yıldız' },
                ]}
            />
        </div>
    );
};

export default GeometricDoodlingSettingsComponent;
