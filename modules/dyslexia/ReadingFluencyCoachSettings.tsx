import React from 'react';
import { ReadingFluencyCoachSettings } from '../../types';
import Select from '../../components/form/Select';
import TextInput from '../../components/form/TextInput';
import HintButton from '../../components/HintButton';

interface Props {
    settings: ReadingFluencyCoachSettings;
    onChange: (settings: Partial<ReadingFluencyCoachSettings>) => void;
}

const ReadingFluencyCoachSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Sesli Okuma Koçu Ayarları</h3>
                <HintButton text="Yapay zeka, seçilen sınıf seviyesine ve konuya uygun, akıcı okuma pratiği yapmak için tasarlanmış kısa metinler oluşturur." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Sınıf Seviyesi"
                    id="rfc-gradeLevel"
                    value={settings.gradeLevel}
                    onChange={e => onChange({ gradeLevel: e.target.value as ReadingFluencyCoachSettings['gradeLevel'] })}
                    options={[
                        { value: '1', label: '1. Sınıf' },
                        { value: '2', label: '2. Sınıf' },
                        { value: '3', label: '3. Sınıf' },
                    ]}
                />
                <TextInput
                    label="Metin Konusu"
                    id="rfc-topic"
                    value={settings.topic}
                    onChange={e => onChange({ topic: e.target.value })}
                    placeholder="Örn: Orman, Uzay, Deniz"
                />
            </div>
        </div>
    );
};

export default ReadingFluencyCoachSettingsComponent;