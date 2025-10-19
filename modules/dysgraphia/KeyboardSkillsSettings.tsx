import React from 'react';
import { KeyboardSkillsSettings } from '../../types';
import Select from '../../components/form/Select';
import HintButton from '../../components/HintButton';

interface Props {
    settings: KeyboardSkillsSettings;
    onChange: (settings: Partial<KeyboardSkillsSettings>) => void;
}

const KeyboardSkillsSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Klavye Becerileri Ayarları</h3>
                <HintButton text="On parmak klavye kullanımının temellerini öğretmek için tasarlanmış alıştırmalar sunar. Dijital çağda önemli bir beceridir." />
            </div>
            <Select
                label="Alıştırma Seviyesi"
                id="ks-level"
                value={settings.level}
                onChange={e => onChange({ level: e.target.value as KeyboardSkillsSettings['level'] })}
                options={[
                    { value: 'home-row', label: 'Temel Sıra (asdf jklş)' },
                    { value: 'top-row', label: 'Üst Sıra (qwer uıop)' },
                    { value: 'full', label: 'Tüm Klavye' },
                ]}
            />
        </div>
    );
};

export default KeyboardSkillsSettingsComponent;
