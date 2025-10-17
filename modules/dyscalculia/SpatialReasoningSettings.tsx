import React from 'react';
import { SpatialReasoningSettings } from '../../types';
import Select from '../../components/form/Select';
import HintButton from '../../components/HintButton';

interface Props {
    settings: SpatialReasoningSettings;
    onChange: (settings: Partial<SpatialReasoningSettings>) => void;
}

const SpatialReasoningSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Uzamsal Akıl Yürütme Ayarları</h3>
                <HintButton text="Basit görsel desenleri kopyalama veya zihinde döndürülmüş şekilleri tanıma gibi etkinliklerle geometrik düşünmenin temelini atar." />
            </div>
            <Select
                label="Etkinlik Türü"
                id="sr-type"
                value={settings.type}
                onChange={e => onChange({ type: e.target.value as SpatialReasoningSettings['type'] })}
                options={[
                    { value: 'pattern-copy', label: 'Desen Kopyalama' },
                    { value: 'mental-rotation', label: 'Zihinsel Döndürme' },
                ]}
            />
        </div>
    );
};

export default SpatialReasoningSettingsComponent;
