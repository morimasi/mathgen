import React from 'react';
import { SymbolStudioSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: SymbolStudioSettings;
    onChange: (settings: Partial<SymbolStudioSettings>) => void;
}

const SymbolStudioSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Sembol Stüdyosu Ayarları</h3>
                <HintButton text="Temel matematik sembollerinin (+, -, ×, ÷, =) doğru yazımını pekiştirir." />
            </div>
            <Select
                label="Çalışılacak Sembol"
                id="ss-symbol"
                value={settings.symbol}
                onChange={e => onChange({ symbol: e.target.value as SymbolStudioSettings['symbol'] })}
                options={[
                    { value: 'plus', label: 'Toplama (+)' },
                    { value: 'minus', label: 'Çıkarma (-)' },
                    { value: 'multiply', label: 'Çarpma (×)' },
                    { value: 'divide', label: 'Bölme (÷)' },
                    { value: 'equals', label: 'Eşittir (=)' },
                ]}
            />
        </div>
    );
};

export default SymbolStudioSettingsComponent;
