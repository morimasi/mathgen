import React from 'react';
import { SentenceUnscrambleSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: SentenceUnscrambleSettings;
    onChange: (settings: Partial<SentenceUnscrambleSettings>) => void;
}

const SentenceUnscrambleSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Cümle Düzenleme (AI) Ayarları</h3>
                <HintButton text="Yapay zeka, kelimeleri karışık olarak verilmiş bir cümle sunar. Öğrencinin görevi, kelimeleri doğru sıraya koyarak anlamlı bir cümle yazmaktır." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Sınıf Seviyesi"
                    id="su-gradeLevel"
                    value={settings.gradeLevel}
                    onChange={e => onChange({ gradeLevel: parseInt(e.target.value, 10) as SentenceUnscrambleSettings['gradeLevel'] })}
                    options={[
                        { value: 1, label: '1. Sınıf' },
                        { value: 2, label: '2. Sınıf' },
                        { value: 3, label: '3. Sınıf' },
                    ]}
                />
                 <Select
                    label="Cümle Uzunluğu"
                    id="su-sentenceLength"
                    value={settings.sentenceLength}
                    onChange={e => onChange({ sentenceLength: e.target.value as SentenceUnscrambleSettings['sentenceLength'] })}
                    options={[
                        { value: 'short', label: 'Kısa (3-4 Kelime)' },
                        { value: 'medium', label: 'Orta (5-6 Kelime)' },
                    ]}
                />
            </div>
        </div>
    );
};

export default SentenceUnscrambleSettingsComponent;
