import React from 'react';
import { DigitCalligraphySettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: DigitCalligraphySettings;
    onChange: (settings: Partial<DigitCalligraphySettings>) => void;
}

const DigitCalligraphySettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Rakam Kaligrafisi Ayarları</h3>
                <HintButton text="Belirli bir rakamın doğru yazılış formuna odaklanarak motor belleği güçlendirir." />
            </div>
            <Select
                label="Çalışılacak Rakam"
                id="dc-digit"
                value={settings.digit}
                onChange={e => onChange({ digit: parseInt(e.target.value, 10) })}
                options={Array.from({ length: 10 }, (_, i) => ({ value: i, label: String(i) }))}
            />
        </div>
    );
};

export default DigitCalligraphySettingsComponent;
