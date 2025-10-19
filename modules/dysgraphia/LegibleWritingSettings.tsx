import React from 'react';
import { LegibleWritingSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: LegibleWritingSettings;
    onChange: (settings: Partial<LegibleWritingSettings>) => void;
}

const LegibleWritingSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Okunaklı Yazı Ayarları</h3>
                <HintButton text="Harf boyutu, harfler ve kelimeler arası boşluklar gibi okunaklılığı etkileyen faktörler üzerine odaklanan pratik sayfaları oluşturur." />
            </div>
            <Select
                label="Odak Alanı"
                id="lw-type"
                value={settings.type}
                onChange={e => onChange({ type: e.target.value as LegibleWritingSettings['type'] })}
                options={[
                    { value: 'spacing', label: 'Boşluk Çalışması' },
                    { value: 'sizing', label: 'Boyut Çalışması' },
                ]}
            />
        </div>
    );
};

export default LegibleWritingSettingsComponent;
