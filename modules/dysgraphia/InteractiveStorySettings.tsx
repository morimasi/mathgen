import React from 'react';
import { InteractiveStoryDgSettings } from '../../types';
import Select from '../../components/form/Select';
import HintButton from '../../components/HintButton';

interface Props {
    settings: InteractiveStoryDgSettings;
    onChange: (settings: Partial<InteractiveStoryDgSettings>) => void;
}

const InteractiveStorySettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Hikaye Macerası (AI) Ayarları</h3>
                <HintButton text="Yapay zeka, öğrencinin kısa bir cümle yazarak devam ettireceği bir hikaye başlangıcı sunar. Yazma eylemini bir oyun haline getirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Hikaye Türü"
                    id="isg-genre"
                    value={settings.genre}
                    onChange={e => onChange({ genre: e.target.value as InteractiveStoryDgSettings['genre'] })}
                    options={[
                        { value: 'journal', label: 'Günlük' },
                        { value: 'adventure', label: 'Macera' },
                        { value: 'fantasy', label: 'Fantastik' },
                    ]}
                />
                 <Select
                    label="Sınıf Seviyesi"
                    id="isg-gradeLevel"
                    value={settings.gradeLevel}
                    onChange={e => onChange({ gradeLevel: e.target.value })}
                    options={[
                        { value: '2', label: '2. Sınıf' },
                        { value: '3', label: '3. Sınıf' },
                        { value: '4', label: '4. Sınıf' },
                    ]}
                />
            </div>
        </div>
    );
};

export default InteractiveStorySettingsComponent;
