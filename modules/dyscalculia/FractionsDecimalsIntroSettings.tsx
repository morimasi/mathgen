import React from 'react';
import { FractionsDecimalsIntroSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: FractionsDecimalsIntroSettings;
    onChange: (settings: Partial<FractionsDecimalsIntroSettings>) => void;
}

const FractionsDecimalsIntroSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Kesir ve Ondalık Ayarları</h3>
                <HintButton text="Bu soyut kavramları, kesirlerin görsel temsilleri (pasta dilimleri) ile eşleştirme veya basit kesirleri karşılaştırma gibi somut etkinliklerle basitleştirir." />
            </div>
            <Select
                label="Etkinlik Türü"
                id="fdi-type"
                value={settings.type}
                onChange={e => onChange({ type: e.target.value as FractionsDecimalsIntroSettings['type'] })}
                options={[
                    { value: 'visual-match', label: 'Görsel Eşleştirme' },
                    { value: 'compare', label: 'Basit Karşılaştırma (1/2, 1/4)' },
                ]}
            />
        </div>
    );
};

export default FractionsDecimalsIntroSettingsComponent;
