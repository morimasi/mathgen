import React from 'react';
import { WordFormWriterSettings } from '../../types.ts';
import NumberInput from '../../components/form/NumberInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: WordFormWriterSettings;
    onChange: (settings: Partial<WordFormWriterSettings>) => void;
}

const WordFormWriterSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Sayıları Yazıyla Yazma Ayarları</h3>
                <HintButton text="Rakamlarla verilen bir sayının okunuşunu yazıya dökme becerisini geliştirir. Sayı ve harf temsilleri arasında köprü kurar." />
            </div>
            <NumberInput
                label="Basamak Sayısı"
                id="wfw-digits"
                min={1}
                max={4}
                value={settings.digits}
                onChange={e => onChange({ digits: parseInt(e.target.value, 10) })}
            />
        </div>
    );
};

export default WordFormWriterSettingsComponent;
