import React from 'react';
import { ProblemSolvingSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import TextInput from '../../components/form/TextInput.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: ProblemSolvingSettings;
    onChange: (settings: Partial<ProblemSolvingSettings>) => void;
}

const ProblemSolvingSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Problem Çözme (AI) Ayarları</h3>
                <HintButton text="Yapay zeka, diskalkuliye uygun, basit ve net bir dille yazılmış, tek adımlı gerçek hayat problemleri oluşturur." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Sınıf Seviyesi"
                    id="ps-gradeLevel"
                    value={settings.gradeLevel}
                    onChange={e => onChange({ gradeLevel: e.target.value })}
                    options={[
                        { value: '1', label: '1. Sınıf' },
                        { value: '2', label: '2. Sınıf' },
                        { value: '3', label: '3. Sınıf' },
                    ]}
                />
                <TextInput
                    label="Konu (İsteğe Bağlı)"
                    id="ps-topic"
                    value={settings.topic}
                    onChange={e => onChange({ topic: e.target.value })}
                    placeholder="Örn: Park, Market"
                />
            </div>
        </div>
    );
};

export default ProblemSolvingSettingsComponent;
