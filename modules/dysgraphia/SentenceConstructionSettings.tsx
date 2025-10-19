import React from 'react';
import { SentenceConstructionSettings } from '../../types.ts';
import NumberInput from '../../components/form/NumberInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: SentenceConstructionSettings;
    onChange: (settings: Partial<SentenceConstructionSettings>) => void;
}

const SentenceConstructionSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Cümle Kurma Ayarları</h3>
                <HintButton text="Karışık halde verilen kelimeleri anlamlı ve kurallı cümleler haline getirme alıştırmasıdır. Dilbilgisi ve sözdizimi becerilerini geliştirir." />
            </div>
            <NumberInput
                label="Cümledeki Kelime Sayısı"
                id="sc-wordCount"
                min={3}
                max={8}
                value={settings.wordCount}
                onChange={e => onChange({ wordCount: parseInt(e.target.value, 10) })}
            />
        </div>
    );
};

export default SentenceConstructionSettingsComponent;
