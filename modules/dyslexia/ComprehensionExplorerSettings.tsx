import React from 'react';
// FIX: Changed import from non-existent ComprehensionExplorerSettings to ReadingComprehensionSettings.
import { ReadingComprehensionSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';
import Checkbox from '../../components/form/Checkbox.tsx';

interface Props {
    settings: ReadingComprehensionSettings;
    onChange: (settings: Partial<ReadingComprehensionSettings>) => void;
}

const ComprehensionExplorerSettings: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Anlam Kâşifi Ayarları</h3>
                <HintButton text="Yapay zeka, seçtiğiniz sınıf seviyesine ve uzunluğa uygun bir metin ve bu metinle ilgili anlama soruları oluşturacaktır." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Sınıf Seviyesi"
                    id="ce-gradeLevel"
                    value={settings.gradeLevel}
                    onChange={e => onChange({ gradeLevel: e.target.value as ReadingComprehensionSettings['gradeLevel'] })}
                    options={[
                        { value: '1', label: '1. Sınıf' },
                        { value: '2', label: '2. Sınıf' },
                        { value: '3', label: '3. Sınıf' },
                        { value: '4', label: '4. Sınıf' },
                    ]}
                />
                <Select
                    label="Metin Uzunluğu"
                    id="ce-textLength"
                    value={settings.textLength}
                    onChange={e => onChange({ textLength: e.target.value as ReadingComprehensionSettings['textLength'] })}
                    options={[
                        { value: 'short', label: 'Kısa (1-2 Paragraf)' },
                        { value: 'medium', label: 'Orta (3-4 Paragraf)' },
                        { value: 'long', label: 'Uzun (5+ Paragraf)' },
                    ]}
                />
                <Select
                    label="Soru Türü"
                    id="ce-questionType"
                    value={settings.questionType}
                    onChange={e => onChange({ questionType: e.target.value as ReadingComprehensionSettings['questionType'] })}
                    options={[
                        { value: 'main_idea', label: 'Ana Fikir' },
                        { value: 'inference', label: 'Çıkarım Yapma' },
                        { value: 'vocabulary', label: 'Kelime Bilgisi' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                    containerClassName="col-span-2"
                />
                <div className="col-span-2">
                    <Checkbox
                        label="Görsel Oluştur (AI)"
                        id="ce-generateImage"
                        checked={settings.generateImage}
                        onChange={e => onChange({ generateImage: e.target.checked })}
                    />
                </div>
            </div>
        </div>
    );
};

export default ComprehensionExplorerSettings;