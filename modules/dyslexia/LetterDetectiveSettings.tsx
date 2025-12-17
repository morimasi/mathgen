import React from 'react';
// FIX: Changed import from non-existent LetterDetectiveSettings to LetterSoundSettings.
import { LetterSoundSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: LetterSoundSettings;
    onChange: (settings: Partial<LetterSoundSettings>) => void;
}

const LetterDetectiveSettings: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
             <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Harf Dedektifi Ayarları</h3>
                <HintButton text="Harf-ses ilişkisini kurmak, okuryazarlığın temelidir. Bu etkinlik, öğrencilerin belirli harflerin seslerini tanıma becerisini geliştirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                 <Select
                    label="Görev"
                    id="ld-task"
                    value={settings.task}
                    onChange={e => onChange({ task: e.target.value as LetterSoundSettings['task'] })}
                    options={[
                        { value: 'find-in-grid', label: 'Izgarada Harf Bul' },
                        { value: 'odd-one-out', label: 'Farklı Olanı Bul' },
                    ]}
                />
                <Select
                    label="Hedef Harf Çifti"
                    id="ld-targetPair"
                    value={settings.targetPair}
                    onChange={e => onChange({ targetPair: e.target.value as LetterSoundSettings['targetPair'] })}
                    options={[
                        { value: 'b-d', label: 'b-d' },
                        { value: 'p-q', label: 'p-q' },
                        { value: 'm-n', label: 'm-n' },
                        { value: 's-z', label: 's-z' },
                        { value: 'f-v', label: 'f-v' },
                        { value: 'g-ğ', label: 'g-ğ' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                 <Select
                    label="Izgara Yoğunluğu"
                    id="ld-gridDensity"
                    value={settings.gridDensity}
                    onChange={e => onChange({ gridDensity: e.target.value as LetterSoundSettings['gridDensity'] })}
                    options={[
                        { value: 'low', label: 'Düşük' },
                        { value: 'medium', label: 'Orta' },
                         { value: 'high', label: 'Yüksek' },
                    ]}
                    disabled={settings.task !== 'find-in-grid'}
                />
            </div>
        </div>
    );
};

export default LetterDetectiveSettings;