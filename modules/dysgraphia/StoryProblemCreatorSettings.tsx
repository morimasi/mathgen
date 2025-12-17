import React from 'react';
import { StoryProblemCreatorSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import TextInput from '../../components/form/TextInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: StoryProblemCreatorSettings;
    onChange: (settings: Partial<StoryProblemCreatorSettings>) => void;
}

const StoryProblemCreatorSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Hikaye Problemi Oluşturma (AI) Ayarları</h3>
                <HintButton text="Yapay zeka, `5 + 3 = 8` gibi basit bir işlem verir. Öğrenciden bu işleme uygun, seçilen temada bir hikaye problemi yazması istenir. Yaratıcılığı ve matematiksel ifade becerisini birleştirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                 <Select
                    label="Zorluk (Sayı Büyüklüğü)"
                    id="spc-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as StoryProblemCreatorSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay (Sonuç < 10)' },
                        { value: 'medium', label: 'Orta (Sonuç < 50)' },
                    ]}
                />
                <TextInput
                    label="Problem Teması"
                    id="spc-topic"
                    value={settings.topic}
                    onChange={e => onChange({ topic: e.target.value })}
                    placeholder="Örn: Hayvanlar, Oyuncaklar"
                />
            </div>
        </div>
    );
};

export default StoryProblemCreatorSettingsComponent;
