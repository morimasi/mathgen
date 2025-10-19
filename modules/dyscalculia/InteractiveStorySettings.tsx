import React from 'react';
import { InteractiveStoryDcSettings } from '../../types';
import Select from '../../components/form/Select';
import HintButton from '../../components/HintButton';

interface Props {
    settings: InteractiveStoryDcSettings;
    onChange: (settings: Partial<InteractiveStoryDcSettings>) => void;
}

const InteractiveStorySettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Hikaye Macerası (AI) Ayarları</h3>
                <HintButton text="Yapay zeka, içinde basit sayma, karşılaştırma veya para hesabı gibi matematiksel seçimler barındıran ilgi çekici hikayeler oluşturur." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Hikaye Mekanı"
                    id="isd-genre"
                    value={settings.genre}
                    onChange={e => onChange({ genre: e.target.value as InteractiveStoryDcSettings['genre'] })}
                    options={[
                        { value: 'market', label: 'Market Alışverişi' },
                        { value: 'playground', label: 'Oyun Parkı' },
                        { value: 'space', label: 'Uzay Macerası' },
                    ]}
                />
                <Select
                    label="Sınıf Seviyesi"
                    id="isd-gradeLevel"
                    value={settings.gradeLevel}
                    onChange={e => onChange({ gradeLevel: e.target.value })}
                    options={[
                        { value: '1', label: '1. Sınıf' },
                        { value: '2', label: '2. Sınıf' },
                        { value: '3', label: '3. Sınıf' },
                    ]}
                />
            </div>
        </div>
    );
};

export default InteractiveStorySettingsComponent;
