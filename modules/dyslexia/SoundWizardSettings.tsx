import React from 'react';
// FIX: Changed import from non-existent SoundWizardSettings to PhonologicalAwarenessSettings.
import { PhonologicalAwarenessSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';
import Checkbox from '../../components/form/Checkbox.tsx';

interface Props {
    settings: PhonologicalAwarenessSettings;
    onChange: (settings: Partial<PhonologicalAwarenessSettings>) => void;
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
                    onChange={e => onChange({ type: e.target.value as PhonologicalAwarenessSettings['type'] })}
                    options={[
                        { value: 'rhyme', label: 'Kafiye Bulma' },
                        { value: 'syllable', label: 'Hece Sayma' },
                        { value: 'blend', label: 'Ses Birleştirme' },
                        { value: 'isolation', label: 'Ses Ayırma' },
                    ]}
                />
                <Select
                    label="Zorluk"
                    id="sw-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as PhonologicalAwarenessSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay' },
                        { value: 'medium', label: 'Orta' },
                        { value: 'hard', label: 'Zor' },
                    ]}
                />
                 <div className="col-span-2">
                    <Checkbox
                        label="Görsel Oluştur (AI)"
                        id="sw-generateImage"
                        checked={settings.generateImage}
                        onChange={e => onChange({ generateImage: e.target.checked })}
                    />
                </div>
            </div>
        </div>
    );
};

export default SoundWizardSettings;