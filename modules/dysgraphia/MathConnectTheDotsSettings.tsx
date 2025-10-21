import React from 'react';
import { MathConnectTheDotsSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: MathConnectTheDotsSettings;
    onChange: (settings: Partial<MathConnectTheDotsSettings>) => void;
}

const MathConnectTheDotsSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Noktadan Noktaya Matematik Ayarları</h3>
                <HintButton text="Sayı sırasını takip etme becerisini eğlenceli bir çizim etkinliğiyle birleştirir. Ritmik sayma pratiği için de kullanılabilir." />
            </div>
            <Select
                label="Sayma Türü"
                id="mctd-counting-type"
                value={settings.countingType}
                onChange={e => onChange({ countingType: e.target.value as MathConnectTheDotsSettings['countingType'] })}
                options={[
                    { value: 'sequential', label: 'Sıralı (1, 2, 3...)' },
                    { value: 'by-twos', label: 'İkişer Ritmik' },
                    { value: 'by-fives', label: 'Beşer Ritmik' },
                ]}
            />
        </div>
    );
};

export default MathConnectTheDotsSettingsComponent;
