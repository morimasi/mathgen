import React from 'react';
import { AttentionQuestionSettings } from '../../types';
import Select from '../../components/form/Select';
import HintButton from '../../components/HintButton';

interface Props {
    settings: AttentionQuestionSettings;
    onChange: (settings: Partial<AttentionQuestionSettings>) => void;
}

const AttentionQuestionSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Dikkat Soruları Ayarları</h3>
                <HintButton text="Bu etkinlik, verilen ipuçlarını kullanarak doğru sayıyı veya kelimeyi bulmayı hedefler. Mantıksal düşünme ve dikkat becerilerini geliştirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Soru Tipi"
                    id="aq-questionType"
                    value={settings.questionType}
                    onChange={e => onChange({ questionType: e.target.value as AttentionQuestionSettings['questionType'] })}
                    options={[
                        { value: 'numerical', label: 'Sayısal' },
                        { value: 'verbal', label: 'Sözel' },
                    ]}
                />
                <Select
                    label="Zorluk Seviyesi"
                    id="aq-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as AttentionQuestionSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay (2 İpucu)' },
                        { value: 'medium', label: 'Orta (3 İpucu)' },
                        { value: 'hard', label: 'Zor (3 Karmaşık İpucu)' },
                    ]}
                />
                <Select
                    label="Sayı Aralığı"
                    id="aq-numberRange"
                    value={settings.numberRange}
                    onChange={e => onChange({ numberRange: e.target.value as AttentionQuestionSettings['numberRange'] })}
                    options={[
                        { value: '1-50', label: '1 - 50 Arası' },
                        { value: '1-100', label: '1 - 100 Arası' },
                        { value: '100-999', label: '100 - 999 Arası' },
                    ]}
                    disabled={settings.questionType === 'verbal'}
                    containerClassName="col-span-2"
                />
            </div>
        </div>
    );
};

export default AttentionQuestionSettingsComponent;