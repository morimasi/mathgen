import React from 'react';
import { VocabularyExplorerSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: VocabularyExplorerSettings;
    onChange: (settings: Partial<VocabularyExplorerSettings>) => void;
}

const VocabularyExplorerSettings: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Kelime Kâşifi Ayarları</h3>
                <HintButton text="Yapay zeka, seçilen seviyeye uygun kelimeler seçer ve her biri için anlamını ve örnek bir cümleyi içeren bir çalışma kartı oluşturur." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Sınıf Seviyesi"
                    id="ve-gradeLevel"
                    value={settings.gradeLevel}
                    onChange={e => onChange({ gradeLevel: e.target.value })}
                    options={[
                        { value: '1', label: '1. Sınıf' },
                        { value: '2', label: '2. Sınıf' },
                        { value: '3', label: '3. Sınıf' },
                        { value: '4', label: '4. Sınıf' },
                    ]}
                />
                <Select
                    label="Kelime Zorluğu"
                    id="ve-difficulty"
                    value={settings.difficulty}
                    onChange={e => onChange({ difficulty: e.target.value as VocabularyExplorerSettings['difficulty'] })}
                    options={[
                        { value: 'easy', label: 'Temel Kelimeler' },
                        { value: 'medium', label: 'Orta Seviye Kelimeler' },
                        { value: 'hard', label: 'İleri Seviye Kelimeler' },
                    ]}
                />
            </div>
        </div>
    );
};

export default VocabularyExplorerSettings;
