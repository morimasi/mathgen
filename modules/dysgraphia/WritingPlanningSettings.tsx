import React from 'react';
import { WritingPlanningSettings } from '../../types.ts';
import TextInput from '../../components/form/TextInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: WritingPlanningSettings;
    onChange: (settings: Partial<WritingPlanningSettings>) => void;
}

const WritingPlanningSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Yazı Planlama (AI) Ayarları</h3>
                <HintButton text="Yapay zeka, belirtilen bir konu hakkında bir metin yazmak için basit bir 3 adımlı (Giriş, Gelişme, Sonuç) taslak oluşturur. Düşünceleri organize etme becerisini geliştirir." />
            </div>
            <TextInput
                label="Yazı Konusu"
                id="wp-topic"
                value={settings.topic}
                onChange={e => onChange({ topic: e.target.value })}
                placeholder="Örn: En sevdiğim hayvan"
            />
        </div>
    );
};

export default WritingPlanningSettingsComponent;
