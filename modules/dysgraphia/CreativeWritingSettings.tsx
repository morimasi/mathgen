import React from 'react';
import { CreativeWritingSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import TextInput from '../../components/form/TextInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: CreativeWritingSettings;
    onChange: (settings: Partial<CreativeWritingSettings>) => void;
}

const CreativeWritingSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Yaratıcı Yazarlık (AI) Ayarları</h3>
                <HintButton text="Yapay zeka, öğrencinin hayal gücünü harekete geçirecek ilginç hikaye başlangıçları veya 'Eğer... olsaydı ne olurdu?' gibi senaryolar üreterek yazma motivasyonunu artırır." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Yönlendirme Türü"
                    id="cw-promptType"
                    value={settings.promptType}
                    onChange={e => onChange({ promptType: e.target.value as CreativeWritingSettings['promptType'] })}
                    options={[
                        { value: 'story-starter', label: 'Hikaye Başlatıcı' },
                        { value: 'what-if', label: 'Eğer... Olsaydı?' },
                    ]}
                />
                <TextInput
                    label="Konu (İsteğe Bağlı)"
                    id="cw-topic"
                    value={settings.topic}
                    onChange={e => onChange({ topic: e.target.value })}
                    placeholder="Örn: Uçan kediler"
                />
            </div>
        </div>
    );
};

export default CreativeWritingSettingsComponent;
