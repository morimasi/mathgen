import React from 'react';
import { VisualNumberRepresentationSettings } from '../../types';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import HintButton from '../../components/HintButton';

interface Props {
    settings: VisualNumberRepresentationSettings;
    onChange: (settings: Partial<VisualNumberRepresentationSettings>) => void;
}

const VisualNumberRepresentationSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Görsel Sayı Temsili Ayarları</h3>
                <HintButton text="Sayıları, karşılık geldikleri miktarlarla (noktalar, onluk bloklar, parmaklar) eşleştirerek sayı kavramını somutlaştırır." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Temsil Yöntemi"
                    id="vnr-representation"
                    value={settings.representation}
                    onChange={e => onChange({ representation: e.target.value as VisualNumberRepresentationSettings['representation'] })}
                    options={[
                        { value: 'dots', label: 'Noktalar' },
                        { value: 'blocks', label: 'Onluk Bloklar' },
                        { value: 'fingers', label: 'Parmaklar' },
                    ]}
                />
                <NumberInput
                    label="En Büyük Sayı"
                    id="vnr-maxNumber"
                    min={5}
                    max={20}
                    value={settings.maxNumber}
                    onChange={e => onChange({ maxNumber: parseInt(e.target.value, 10) })}
                />
            </div>
        </div>
    );
};

export default VisualNumberRepresentationSettingsComponent;
