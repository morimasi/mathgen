import React from 'react';
import { MathLanguageSettings } from '../../types';
import Select from '../../components/form/Select';
import HintButton from '../../components/HintButton';

interface Props {
    settings: MathLanguageSettings;
    onChange: (settings: Partial<MathLanguageSettings>) => void;
}

const MathLanguageSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Matematiksel Dil Ayarları</h3>
                <HintButton text="Matematiksel sembollerin (+, -, =) ve kelimelerin ('artı', 'eksi', 'eşittir') anlamlarını eşleştirme etkinlikleri sunar." />
            </div>
            <Select
                label="Etkinlik Türü"
                id="ml-type"
                value={settings.type}
                onChange={e => onChange({ type: e.target.value as MathLanguageSettings['type'] })}
                options={[
                    { value: 'symbol-match', label: 'Sembol-Kelime Eşleştirme' },
                    { value: 'word-to-symbol', label: 'Kelimeyi Sembole Çevirme' },
                ]}
            />
        </div>
    );
};

export default MathLanguageSettingsComponent;
