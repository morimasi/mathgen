import React from 'react';
import { SoundWizardSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import NumberInput from '../../components/form/NumberInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: SoundWizardSettings;
    onChange: (settings: Partial<SoundWizardSettings>) => void;
}

const SoundWizardSettings: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Ses Büyücüsü Ayarları</h3>
                <HintButton text="Bu etkinlik, çocukların kelimelerin ses yapısını anlamalarına yardımcı olur. Kafiye, heceleme ve ses birleştirme fonolojik farkındalığın temelidir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Etkinlik Türü"
                    id="sw-type"
                    value={settings.type}
                    onChange={e => onChange({ type: e.target.value as SoundWizardSettings['type'] })}
                    options={[
                        { value: 'rhyme', label: 'Kafiye Bulma' },
                        { value: 'syllable', label: 'Hece Sayma' },
                        { value: 'blend', label: 'Ses Birleştirme' },
                    ]}
                />
                <Select
                    label="Zorluk"
                    id="sw-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as SoundWizardSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay' },
                        { value: 'medium', label: 'Orta' },
                    ]}
                />
                 <NumberInput
                    label="Kelime Uzunluğu (Harf)"
                    id="sw-word-length"
                    min={3}
                    max={8}
                    value={settings.wordLength}
                    onChange={e => onChange({ wordLength: parseInt(e.target.value, 10) })}
                    disabled={settings.type !== 'rhyme'}
                />
            </div>
        </div>
    );
};

export default SoundWizardSettings;
