import React from 'react';
import { NumberTraceSettings } from '../../types.ts';
import NumberInput from '../../components/form/NumberInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: NumberTraceSettings;
    onChange: (settings: Partial<NumberTraceSettings>) => void;
}

const NumberTraceSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Sayı Yolları Ayarları</h3>
                <HintButton text="Öğrencilerin sayıları doğru formda yazma pratiği yapmaları için noktalı sayıların üzerinden gitmelerini sağlar." />
            </div>
            <NumberInput
                label="Basamak Sayısı"
                id="nt-digits"
                min={1}
                max={4}
                value={settings.digits}
                onChange={e => onChange({ digits: parseInt(e.target.value, 10) })}
            />
        </div>
    );
};

export default NumberTraceSettingsComponent;
