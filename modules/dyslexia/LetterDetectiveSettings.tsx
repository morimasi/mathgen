import React from 'react';
import { LetterDetectiveSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: LetterDetectiveSettings;
    onChange: (settings: Partial<LetterDetectiveSettings>) => void;
}

const LetterDetectiveSettings: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
             <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Harf Dedektifi Ayarları</h3>
                <HintButton text="Harf-ses ilişkisini kurmak, okuryazarlığın temelidir. Bu etkinlik, öğrencilerin belirli harflerin seslerini tanıma becerisini geliştirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Harf Grubu"
                    id="ld-letterGroup"
                    value={settings.letterGroup}
                    onChange={e => onChange({ letterGroup: e.target.value as LetterDetectiveSettings['letterGroup'] })}
                    options={[
                        { value: 'vowels', label: 'Ünlüler (a, e, ı, i, o, ö, u, ü)' },
                        { value: 'common_consonants', label: 'Sık Kullanılan Ünsüzler (m, t, k, l)' },
                        { value: 'tricky_consonants', label: 'Karıştırılan Ünsüzler (b, d, p)' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <Select
                    label="Zorluk"
                    id="ld-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as LetterDetectiveSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay (Harfi Bul)' },
                        { value: 'medium', label: 'Orta (Harfle Başlayan Kelime)' },
                    ]}
                />
            </div>
        </div>
    );
};

export default LetterDetectiveSettings;
