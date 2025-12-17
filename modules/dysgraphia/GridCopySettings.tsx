import React from 'react';
import { GridCopySettings } from '../../types.ts';
import Select from '../../components/form/Select.tsx';
import HintButton from '../../components/HintButton.tsx';

interface Props {
    settings: GridCopySettings;
    onChange: (settings: Partial<GridCopySettings>) => void;
}

const GridCopySettingsComponent: React.FC<Props> = ({ settings, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Izgara Kopyalama Ayarları</h3>
                <HintButton text="Görsel bir deseni boş bir ızgaraya kopyalama etkinliğidir. Uzamsal planlama, görsel algı ve ince motor becerilerini geliştirir." />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Izgara Boyutu"
                    id="gc-gridSize"
                    value={settings.gridSize}
                    onChange={e => onChange({ gridSize: parseInt(e.target.value, 10) as GridCopySettings['gridSize'] })}
                    options={[
                        { value: 3, label: '3x3' },
                        { value: 4, label: '4x4' },
                        { value: 5, label: '5x5' },
                    ]}
                />
                <Select
                    label="Karmaşıklık"
                    id="gc-complexity"
                    value={settings.complexity}
                    onChange={e => onChange({ complexity: e.target.value as GridCopySettings['complexity'] })}
                    options={[
                        { value: 'easy', label: 'Kolay' },
                        { value: 'medium', label: 'Orta' },
                    ]}
                />
            </div>
        </div>
    );
};

export default GridCopySettingsComponent;
