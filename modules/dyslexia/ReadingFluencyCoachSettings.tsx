import React from 'react';
import { ReadingFluencyCoachSettings } from '../../types';
import Select from '../../components/form/Select';
import TextInput from '../../components/form/TextInput';
import HintButton from '../../components/HintButton';

interface Props {
    settings: ReadingFluencyCoachSettings;
    onChange: (settings: Partial<ReadingFluencyCoachSettings>) => void;
}

const ReadingFluencyCoachSettings: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Sesli Okuma Koçu Ayarları</h3>
                 <HintButton text="Bu özellik, öğrencinin metni sesli okumasını dinleyerek akıcılık ve doğruluk hakkında anında geri bildirim vermek için Gemini AI'nın canlı ses yeteneklerini kullanacaktır." />
            </div>
             <div className="text-sm text-stone-600 dark:text-stone-400 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-700">
                <p className="font-semibold">Geliştirme Aşamasında</p>
                <p>Bu modül yakında aktif olacaktır.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 opacity-50">
                <Select
                    label="Sınıf Seviyesi"
                    id="rfc-gradeLevel"
                    value={settings.gradeLevel}
                    onChange={e => onChange({ gradeLevel: e.target.value })}
                    options={[
                        { value: '1', label: '1. Sınıf' },
                        { value: '2', label: '2. Sınıf' },
                        { value: '3', label: '3. Sınıf' },
                    ]}
                    disabled
                />
                <TextInput
                    label="Okuma Metni Konusu"
                    id="rfc-topic"
                    value={settings.topic}
                    onChange={e => onChange({ topic: e.target.value })}
                    placeholder="Örn: Uzay Macerası"
                    disabled
                />
            </div>
        </div>
    );
};

export default ReadingFluencyCoachSettings;