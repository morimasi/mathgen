import React from 'react';
import { PictureSequencingSettings } from '../../types';
import Select from '../../components/form/Select';
import TextInput from '../../components/form/TextInput';
import HintButton from '../../components/HintButton';

interface Props {
    settings: PictureSequencingSettings;
    onChange: (settings: Partial<PictureSequencingSettings>) => void;
}

const PictureSequencingSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Resim Sıralama (AI) Ayarları</h3>
                <HintButton text="Yapay zeka, belirli bir konuyla ilgili olayları anlatan kısa metinler oluşturur. Öğrenci bu metinleri mantıksal bir sıraya koyarak anlatı yapısını öğrenir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Hikaye Adım Sayısı"
                    id="ps-storyLength"
                    value={settings.storyLength}
                    onChange={e => onChange({ storyLength: parseInt(e.target.value, 10) as 3 | 4 | 5 })}
                    options={[
                        { value: 3, label: '3 Adım' },
                        { value: 4, label: '4 Adım' },
                        { value: 5, label: '5 Adım' },
                    ]}
                />
                <TextInput
                    label="Konu (İsteğe Bağlı)"
                    id="ps-topic"
                    value={settings.topic}
                    onChange={e => onChange({ topic: e.target.value })}
                    placeholder="Örn: Diş fırçalama"
                />
            </div>
        </div>
    );
};

export default PictureSequencingSettingsComponent;
