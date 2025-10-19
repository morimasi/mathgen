import React from 'react';
import { ArithmeticFluencySettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: ArithmeticFluencySettings;
    onChange: (settings: Partial<ArithmeticFluencySettings>) => void;
}

const ArithmeticFluencySettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Aritmetik Akıcılığı Ayarları</h3>
                <HintButton text="Temel toplama ve çıkarma işlemlerinde hız ve doğruluk kazanmaya yönelik basit alıştırmalar sunar." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="İşlem Türü"
                    id="af-operation"
                    value={settings.operation}
                    onChange={e => onChange({ operation: e.target.value as ArithmeticFluencySettings['operation'] })}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <Select
                    label="Zorluk"
                    id="af-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as ArithmeticFluencySettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay (Tek Basamaklı)' },
                        { value: 'medium', label: 'Orta (İki Basamaklı)' },
                    ]}
                />
            </div>
        </div>
    );
};

export default ArithmeticFluencySettingsComponent;
