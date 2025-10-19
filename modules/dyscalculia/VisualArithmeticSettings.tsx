import React from 'react';
import { VisualArithmeticSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import NumberInput from '../../components/form/NumberInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: VisualArithmeticSettings;
    onChange: (settings: Partial<VisualArithmeticSettings>) => void;
}

const VisualArithmeticSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Görsel Aritmetik Ayarları</h3>
                <HintButton text="Sayılar yerine resimler ve emojiler kullanarak temel toplama ve çıkarma işlemlerini somut ve eğlenceli hale getirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="İşlem Türü"
                    id="va-operation"
                    value={settings.operation}
                    onChange={e => onChange({ operation: e.target.value as VisualArithmeticSettings['operation'] })}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                    ]}
                />
                <NumberInput
                    label="En Büyük Sayı"
                    id="va-maxNumber"
                    min={5}
                    max={20}
                    value={settings.maxNumber}
                    onChange={e => onChange({ maxNumber: parseInt(e.target.value, 10) })}
                />
            </div>
        </div>
    );
};

export default VisualArithmeticSettingsComponent;
