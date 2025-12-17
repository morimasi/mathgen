import React from 'react';
import { InteractiveStorySettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';
import Checkbox from '../../components/form/Checkbox.tsx';

interface Props {
    settings: InteractiveStorySettings;
    onChange: (settings: Partial<InteractiveStorySettings>) => void;
}

const InteractiveStorySettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Uygulamalı Hikaye Macerası Ayarları</h3>
                <HintButton text="Yapay zeka, öğrencinin yaptığı seçimlere göre ilerleyen, 'kendi maceranı kendin seç' tarzı hikayeler oluşturur. Bu, okumayı motive eder ve anlama becerisini geliştirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Hikaye Türü"
                    id="is-genre"
                    value={settings.genre}
                    onChange={e => onChange({ genre: e.target.value as InteractiveStorySettings['genre'] })}
                    options={[
                        { value: 'adventure', label: 'Macera' },
                        { value: 'mystery', label: 'Gizem' },
                        { value: 'fantasy', label: 'Fantastik' },
                        { value: 'sci-fi', label: 'Bilim Kurgu' },
                    ]}
                />
                 <Select
                    label="Sınıf Seviyesi"
                    id="is-gradeLevel"
                    value={settings.gradeLevel}
                    onChange={e => onChange({ gradeLevel: e.target.value as InteractiveStorySettings['gradeLevel'] })}
                    options={[
                        { value: '2', label: '2. Sınıf' },
                        { value: '3', label: '3. Sınıf' },
                        { value: '4', label: '4. Sınıf' },
                    ]}
                />
                 <div className="col-span-2">
                    <Checkbox
                        label="Hikayeyi Resimle (AI)"
                        id="is-generateImage"
                        checked={settings.generateImage ?? false}
                        onChange={e => onChange({ generateImage: e.target.checked })}
                    />
                </div>
            </div>
        </div>
    );
};

export default InteractiveStorySettingsComponent;