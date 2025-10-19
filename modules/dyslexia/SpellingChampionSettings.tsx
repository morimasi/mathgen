import React from 'react';
import { SpellingChampionSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: SpellingChampionSettings;
    onChange: (settings: Partial<SpellingChampionSettings>) => void;
}

const SpellingChampionSettings: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Yazım Şampiyonu Ayarları</h3>
                <HintButton text="Doğru ve yanlış yazılmış kelimeleri ayırt etme veya boşluk doldurma gibi etkinliklerle imla kurallarını pekiştirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Kategori"
                    id="sc-category"
                    value={settings.category}
                    onChange={e => onChange({ category: e.target.value as SpellingChampionSettings['category'] })}
                    options={[
                        { value: 'common_errors', label: 'Sık Yapılan Hatalar (örn: herkez/herkes)' },
                        { value: 'homophones', label: 'Eş Sesli Kelimeler (örn: yüz)' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <Select
                    label="Zorluk"
                    id="sc-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as SpellingChampionSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay' },
                        { value: 'medium', label: 'Orta' },
                        { value: 'hard', label: 'Zor' },
                    ]}
                />
            </div>
        </div>
    );
};

export default SpellingChampionSettings;
