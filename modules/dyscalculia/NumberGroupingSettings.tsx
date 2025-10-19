import React from 'react';
import { NumberGroupingSettings } from '../../types.ts';
import NumberInput from '../../components/form/NumberInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: NumberGroupingSettings;
    onChange: (settings: Partial<NumberGroupingSettings>) => void;
}

const NumberGroupingSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Sayı Gruplama Ayarları</h3>
                <HintButton text="Onluk gruplar (onluk bloklar gibi) oluşturarak sayıları daha iyi anlama ve toplama/çıkarma işlemlerini kolaylaştırma becerisi kazandırır." />
            </div>
            <NumberInput
                label="En Büyük Sayı"
                id="ng-maxNumber"
                min={10}
                max={50}
                value={settings.maxNumber}
                onChange={e => onChange({ maxNumber: parseInt(e.target.value, 10) })}
            />
        </div>
    );
};

export default NumberGroupingSettingsComponent;
