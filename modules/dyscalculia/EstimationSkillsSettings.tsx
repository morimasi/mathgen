import React from 'react';
import { EstimationSkillsSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: EstimationSkillsSettings;
    onChange: (settings: Partial<EstimationSkillsSettings>) => void;
}

const EstimationSkillsSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Tahmin Becerileri Ayarları</h3>
                <HintButton text="Bir resimdeki nesne sayısını yaklaşık olarak tahmin etme (Miktar) veya basit bir işlemin sonucunun yaklaşık ne olacağını kestirme (Sonuç) becerilerini geliştirir." />
            </div>
            <Select
                label="Etkinlik Türü"
                id="es-type"
                value={settings.type}
                onChange={e => onChange({ type: e.target.value as EstimationSkillsSettings['type'] })}
                options={[
                    { value: 'quantity', label: 'Miktar Tahmini' },
                    { value: 'result', label: 'Sonuç Tahmini (Yuvarlama)' },
                ]}
            />
        </div>
    );
};

export default EstimationSkillsSettingsComponent;
