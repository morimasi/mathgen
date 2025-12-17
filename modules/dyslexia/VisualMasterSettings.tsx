import React from 'react';
import { VisualDiscriminationSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: VisualDiscriminationSettings;
    onChange: (settings: Partial<VisualDiscriminationSettings>) => void;
}

const VisualMasterSettings: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Görsel Usta Ayarları</h3>
                <HintButton text="Dislekside sıkça görülen harf ve kelime karıştırmalarını (ters çevirme, sıralama hatası) azaltmaya yönelik görsel dikkat egzersizleri oluşturur." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Egzersiz Tipi"
                    id="vm-type"
                    value={settings.type}
                    onChange={e => onChange({ type: e.target.value as VisualDiscriminationSettings['type'] })}
                    options={[
                        { value: 'letter', label: 'Harf Ayırt Etme' },
                        { value: 'word', label: 'Kelime Ayırt Etme' },
                    ]}
                />
                <Select
                    label="Görev"
                    id="vm-task"
                    value={settings.task}
                    onChange={e => onChange({ task: e.target.value as VisualDiscriminationSettings['task'] })}
                    options={[
                        { value: 'find-all', label: 'Hepsini Bul' },
                        { value: 'odd-one-out', label: 'Farklı Olanı Bul' },
                    ]}
                />
                {settings.type === 'letter' && (
                    <Select
                        label="Hedef Harf Çifti"
                        id="vm-targetPair"
                        value={settings.targetPair}
                        onChange={e => onChange({ targetPair: e.target.value as VisualDiscriminationSettings['targetPair'] })}
                        options={[
                            { value: 'b-d', label: 'b / d' },
                            { value: 'p-q', label: 'p / q' },
                            { value: 'm-n', label: 'm / n' },
                            { value: 's-z', label: 's / z' },
                            { value: 'f-v', label: 'f / v' },
                            { value: 'g-ğ', label: 'g / ğ' },
                            { value: 'mixed', label: 'Karışık' },
                        ]}
                    />
                )}
                {settings.type === 'letter' && settings.task === 'find-all' && (
                    <Select
                        label="Izgara Yoğunluğu"
                        id="vm-gridDensity"
                        value={settings.gridDensity}
                        onChange={e => onChange({ gridDensity: e.target.value as VisualDiscriminationSettings['gridDensity'] })}
                        options={[
                            { value: 'low', label: 'Düşük' },
                            { value: 'medium', label: 'Orta' },
                            { value: 'high', label: 'Yüksek' },
                        ]}
                    />
                )}
                {settings.type === 'word' && (
                    <Select
                        label="Kelime Karmaşıklığı"
                        id="vm-wordComplexity"
                        value={settings.wordComplexity}
                        onChange={e => onChange({ wordComplexity: e.target.value as VisualDiscriminationSettings['wordComplexity'] })}
                        options={[
                            { value: 'easy', label: 'Kolay (3-4 harf)' },
                            { value: 'medium', label: 'Orta (5-6 harf)' },
                            { value: 'hard', label: 'Zor (Benzer kelimeler)' },
                        ]}
                        containerClassName="col-span-2"
                    />
                )}
            </div>
        </div>
    );
};

export default VisualMasterSettings;
