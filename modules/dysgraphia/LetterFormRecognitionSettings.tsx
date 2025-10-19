import React from 'react';
import { LetterFormRecognitionSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import TextInput from '../../components/form/TextInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: LetterFormRecognitionSettings;
    onChange: (settings: Partial<LetterFormRecognitionSettings>) => void;
}

const LetterFormRecognitionSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    const handleLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().slice(-1);
        onChange({ targetLetter: value });
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Harf Formu Tanıma Ayarları</h3>
                <HintButton text="Farklı harfler arasında belirli bir hedef harfi bulma etkinliğidir. Harfleri görsel olarak ayırt etme becerisini güçlendirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <TextInput
                    label="Aranacak Harf"
                    id="lfr-targetLetter"
                    value={settings.targetLetter}
                    onChange={handleLetterChange}
                    maxLength={1}
                />
                <Select
                    label="Zorluk"
                    id="lfr-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as LetterFormRecognitionSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay (Farklı Harfler)' },
                        { value: 'medium', label: 'Orta (Benzer Harfler örn: b/d)' },
                    ]}
                />
            </div>
        </div>
    );
};

export default LetterFormRecognitionSettingsComponent;
