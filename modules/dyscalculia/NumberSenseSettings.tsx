import React from 'react';
import { NumberSenseSettings } from '../../types';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import HintButton from '../../components/HintButton';

interface Props {
    settings: NumberSenseSettings;
    onChange: (settings: Partial<NumberSenseSettings>) => void;
}

const NumberSenseSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Sayı Hissi Ayarları</h3>
                <HintButton text="Bu etkinlikler sayıların büyüklüğünü anlama, karşılaştırma ve sayı doğrusu üzerinde konumlandırma gibi temel becerileri geliştirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Etkinlik Türü"
                    id="ns-type"
                    value={settings.type}
                    onChange={e => onChange({ type: e.target.value as NumberSenseSettings['type'] })}
                    options={[
                        { value: 'compare', label: 'Sayı Karşılaştırma' },
                        { value: 'order', label: 'Sıralama' },
                        { value: 'number-line', label: 'Sayı Doğrusu' },
                    ]}
                />
                <NumberInput
                    label="En Büyük Sayı"
                    id="ns-maxNumber"
                    min={10}
                    max={1000}
                    value={settings.maxNumber}
                    onChange={e => onChange({ maxNumber: parseInt(e.target.value, 10) })}
                />
            </div>
        </div>
    );
};

export default NumberSenseSettingsComponent;
