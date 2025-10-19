import React from 'react';
import { WordHunterSettings } from '../../types';
import Select from '../../components/form/Select';
import HintButton from '../../components/HintButton';

interface Props {
    settings: WordHunterSettings;
    onChange: (settings: Partial<WordHunterSettings>) => void;
}

const WordHunterSettings: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
             <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Kelime Avcısı Ayarları</h3>
                <HintButton text="Bu morfolojik farkındalık egzersizi, öğrencilerin kelimelerin köklerini ve eklerini tanımalarına yardımcı olarak kelime dağarcığını ve anlama becerilerini geliştirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Odaklan"
                    id="wh-focus"
                    value={settings.focus}
                    onChange={e => onChange({ focus: e.target.value as WordHunterSettings['focus'] })}
                    options={[
                        { value: 'prefix', label: 'Ön Ekler' },
                        { value: 'suffix', label: 'Son Ekler (-ler, -lık, vb.)' },
                        { value: 'root', label: 'Kelime Kökü' },
                    ]}
                />
                <Select
                    label="Zorluk"
                    id="wh-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as WordHunterSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay (Yaygın Ekler)' },
                        { value: 'medium', label: 'Orta (Daha Az Yaygın Ekler)' },
                    ]}
                />
            </div>
        </div>
    );
};

export default WordHunterSettings;