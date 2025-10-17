import React from 'react';
import { LetterFormationSettings } from '../../types';
import Select from '../../components/form/Select';
import TextInput from '../../components/form/TextInput';
import HintButton from '../../components/HintButton';

interface Props {
    settings: LetterFormationSettings;
    onChange: (settings: Partial<LetterFormationSettings>) => void;
}

const LetterFormationSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    const handleLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().slice(-1); // Only take the last character
        onChange({ letter: value });
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Harf Şekillendirme Ayarları</h3>
                <HintButton text="Harflerin doğru ve akıcı bir şekilde nasıl yazılacağını öğretmek için kesikli çizgi formatında harf şablonları oluşturur." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <TextInput
                    label="Çalışılacak Harf"
                    id="lf-letter"
                    value={settings.letter}
                    onChange={handleLetterChange}
                    maxLength={1}
                />
                <Select
                    label="Büyük/Küçük Harf"
                    id="lf-case"
                    value={settings.case}
                    onChange={e => onChange({ case: e.target.value as LetterFormationSettings['case'] })}
                    options={[
                        { value: 'lower', label: 'Küçük Harf' },
                        { value: 'upper', label: 'Büyük Harf' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
            </div>
        </div>
    );
};

export default LetterFormationSettingsComponent;
