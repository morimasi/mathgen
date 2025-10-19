import React from 'react';
import { PunctuationSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: PunctuationSettings;
    onChange: (settings: Partial<PunctuationSettings>) => void;
}

const PunctuationSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Noktalama İşaretleri Ayarları</h3>
                <HintButton text="Cümle sonlarına doğru noktalama işaretini (nokta, soru işareti, ünlem) koyma veya cümle içinde virgül kullanımı gibi temel becerileri öğretir." />
            </div>
            <Select
                label="Odak Alanı"
                id="p-type"
                value={settings.type}
                onChange={e => onChange({ type: e.target.value as PunctuationSettings['type'] })}
                options={[
                    { value: 'end-of-sentence', label: 'Cümle Sonu İşaretleri' },
                    { value: 'commas', label: 'Virgül Kullanımı' },
                ]}
            />
        </div>
    );
};

export default PunctuationSettingsComponent;
