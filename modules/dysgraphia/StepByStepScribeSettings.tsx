import React from 'react';
import { StepByStepScribeSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: StepByStepScribeSettings;
    onChange: (settings: Partial<StepByStepScribeSettings>) => void;
}

const StepByStepScribeSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Adım Adım Çözüm (AI) Ayarları</h3>
                <HintButton text="Yapay zeka, bir problemin çözüm adımlarını boşluk doldurmalı bir formatta sunar. Öğrencinin görevi, bu adımları takip ederek ve boşlukları doldurarak çözümü yazmaktır. Düşünceleri yapılandırarak yazıya dökme pratiği sağlar." />
            </div>
             <div className="grid grid-cols-2 gap-2">
                <Select
                    label="İşlem Türü"
                    id="sbss-operation"
                    value={settings.operation}
                    onChange={e => onChange({ operation: e.target.value as StepByStepScribeSettings['operation'] })}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                        { value: 'multiplication', label: 'Çarpma' },
                    ]}
                />
                <Select
                    label="Zorluk"
                    id="sbss-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as StepByStepScribeSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Kolay' },
                        { value: 'medium', label: 'Orta' },
                    ]}
                />
            </div>
        </div>
    );
};

export default StepByStepScribeSettingsComponent;
