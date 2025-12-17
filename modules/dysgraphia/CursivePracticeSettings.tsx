import React from 'react';
import { CursivePracticeSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: CursivePracticeSettings;
    onChange: (settings: Partial<CursivePracticeSettings>) => void;
}

const CursivePracticeSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">El Yazısı Pratiği (AI) Ayarları</h3>
                <HintButton text="Yapay zeka, el yazısıyla yazma pratiği için noktalı harfler, kelimeler veya kısa cümleler oluşturur." />
            </div>
             <div className="grid grid-cols-2 gap-2">
                <Select
                    label="İçerik Türü"
                    id="cp-contentType"
                    value={settings.contentType}
                    onChange={e => onChange({ contentType: e.target.value as CursivePracticeSettings['contentType'] })}
                    options={[
                        { value: 'letters', label: 'Harfler' },
                        { value: 'words', label: 'Kelimeler' },
                        { value: 'sentence', label: 'Cümle' },
                    ]}
                />
                <Select
                    label="Zorluk"
                    id="cp-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as CursivePracticeSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay' },
                        { value: 'medium', label: 'Orta' },
                    ]}
                />
            </div>
        </div>
    );
};

export default CursivePracticeSettingsComponent;
