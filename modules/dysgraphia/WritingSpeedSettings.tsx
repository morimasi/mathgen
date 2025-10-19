import React from 'react';
import { WritingSpeedSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: WritingSpeedSettings;
    onChange: (settings: Partial<WritingSpeedSettings>) => void;
}

const WritingSpeedSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Yazma Hızı Ayarları</h3>
                <HintButton text="Belirli bir süre içinde basit ve tekrar eden kelimeleri veya cümleleri yazma alıştırmasıdır. Yazma işlemini otomatikleştirmeyi hedefler." />
            </div>
            <Select
                label="Egzersiz Süresi (Dakika)"
                id="ws-duration"
                value={settings.duration}
                onChange={e => onChange({ duration: parseInt(e.target.value, 10) as 1 | 2 | 5 })}
                options={[
                    { value: 1, label: '1 Dakika' },
                    { value: 2, label: '2 Dakika' },
                    { value: 5, label: '5 Dakika' },
                ]}
            />
        </div>
    );
};

export default WritingSpeedSettingsComponent;
