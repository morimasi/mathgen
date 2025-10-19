import React from 'react';
import { ComprehensionExplorerSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: ComprehensionExplorerSettings;
    onChange: (settings: Partial<ComprehensionExplorerSettings>) => void;
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
                    onChange={e => onChange({ gradeLevel: e.target.value })}
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
                    onChange={e => onChange({ textLength: e.target.value as ComprehensionExplorerSettings['textLength'] })}
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
                    onChange={e => onChange({ questionType: e.target.value as ComprehensionExplorerSettings['questionType'] })}
                    options={[
                        { value: 'main_idea', label: 'Ana Fikir' },
                        { value: 'inference', label: 'Çıkarım Yapma' },
                        { value: 'vocabulary', label: 'Kelime Bilgisi' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                    containerClassName="col-span-2"
                />
            </div>
        </div>
    );
};

export default ComprehensionExplorerSettings;
