import React from 'react';
import { AuditoryWritingSettings } from '../../types';
import Select from '../../components/form/Select';
import HintButton from '../../components/HintButton';

interface Props {
    settings: AuditoryWritingSettings;
    onChange: (settings: Partial<AuditoryWritingSettings>) => void;
}

const AuditoryWritingSettings: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">İşitsel Yazma (Dikte) Ayarları</h3>
                <HintButton text="Bu etkinlik, duyulan sesleri harflere dökme (ses-harf eşleştirme) ve kısa süreli hafıza becerilerini birleştirerek yazma pratiği sunar." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Dikte Türü"
                    id="aw-type"
                    value={settings.type}
                    onChange={e => onChange({ type: e.target.value as AuditoryWritingSettings['type'] })}
                    options={[
                        { value: 'single_words', label: 'Tek Kelimeler' },
                        { value: 'short_sentences', label: 'Kısa Cümleler' },
                    ]}
                />
                <Select
                    label="Zorluk"
                    id="aw-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as AuditoryWritingSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay (Ses-harf uyumlu)' },
                        { value: 'medium', label: 'Orta' },
                        { value: 'hard', label: 'Zor (Daha karmaşık kelimeler)' },
                    ]}
                />
            </div>
        </div>
    );
};

export default AuditoryWritingSettings;