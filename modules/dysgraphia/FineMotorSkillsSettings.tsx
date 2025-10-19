import React from 'react';
import { FineMotorSkillsSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: FineMotorSkillsSettings;
    onChange: (settings: Partial<FineMotorSkillsSettings>) => void;
}

const FineMotorSkillsSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">İnce Motor Becerileri Ayarları</h3>
                <HintButton text="El-göz koordinasyonunu ve kalem kontrolünü geliştirmek için çizgi, şekil ve labirent takibi gibi ön yazma etkinlikleri sunar." />
            </div>
            <Select
                label="Etkinlik Türü"
                id="fms-type"
                value={settings.type}
                onChange={e => onChange({ type: e.target.value as FineMotorSkillsSettings['type'] })}
                options={[
                    { value: 'line-trace', label: 'Çizgi Takibi' },
                    { value: 'shape-trace', label: 'Şekil Takibi' },
                    { value: 'maze', label: 'Labirent' },
                ]}
            />
        </div>
    );
};

export default FineMotorSkillsSettingsComponent;
