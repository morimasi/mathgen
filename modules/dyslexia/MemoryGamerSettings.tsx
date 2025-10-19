import React from 'react';
import { MemoryGamerSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import NumberInput from '../../components/form/NumberInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: MemoryGamerSettings;
    onChange: (settings: Partial<MemoryGamerSettings>) => void;
}

const MemoryGamerSettings: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
             <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Hafıza Oyuncusu Ayarları</h3>
                <HintButton text="Bu etkinlikler, dinlediğini anlama ve çalışma belleği gibi alanlarda kritik olan kısa süreli işitsel hafızayı güçlendirmeyi hedefler." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Etkinlik Türü"
                    id="mg-type"
                    value={settings.type}
                    onChange={e => onChange({ type: e.target.value as MemoryGamerSettings['type'] })}
                    options={[
                        { value: 'digit_span', label: 'Rakam Dizisi Tekrarlama' },
                        { value: 'word_sequence', label: 'Kelime Sırası Tekrarlama' },
                        { value: 'sentence_repeat', label: 'Cümle Tekrarlama' },
                    ]}
                />
                <NumberInput
                    label="Dizi Uzunluğu"
                    id="mg-sequenceLength"
                    min={3}
                    max={10}
                    value={settings.sequenceLength}
                    onChange={e => onChange({ sequenceLength: parseInt(e.target.value, 10) })}
                />
            </div>
        </div>
    );
};

export default MemoryGamerSettings;
