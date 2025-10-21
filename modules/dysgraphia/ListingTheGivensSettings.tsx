import React from 'react';
import { ListingTheGivensSettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: ListingTheGivensSettings;
    onChange: (settings: Partial<ListingTheGivensSettings>) => void;
}

const ListingTheGivensSettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Verilenleri Listeleme (AI) Ayarları</h3>
                <HintButton text="Öğrenciden bir metin problemini çözmesi değil, sadece problemdeki önemli bilgileri (verilenleri) okuyup listelemesi istenir. Bu, okuduğunu anlama ve bilgiyi organize etme becerisini geliştirir." />
            </div>
            <Select
                label="Sınıf Seviyesi"
                id="ltg-gradeLevel"
                value={settings.gradeLevel}
                onChange={e => onChange({ gradeLevel: parseInt(e.target.value, 10) })}
                options={[
                    { value: 1, label: '1. Sınıf' },
                    { value: 2, label: '2. Sınıf' },
                    { value: 3, label: '3. Sınıf' },
                ]}
            />
        </div>
    );
};

export default ListingTheGivensSettingsComponent;
