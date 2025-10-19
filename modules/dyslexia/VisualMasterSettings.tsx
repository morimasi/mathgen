import React from 'react';
import { VisualMasterSettings } from '../../types';
import Select from '../../components/form/Select';
import HintButton from '../../components/HintButton';

interface Props {
    settings: VisualMasterSettings;
    onChange: (settings: Partial<VisualMasterSettings>) => void;
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
                    onChange={e => onChange({ type: e.target.value as VisualMasterSettings['type'] })}
                    options={[
                        { value: 'letter', label: 'Harf Ayırt Etme' },
                        { value: 'word', label: 'Kelime Ayırt Etme' },
                    ]}
                />
                <Select
                    label="Odaklanılacak Çift"
                    id="vm-pair"
                    value={settings.pair}
                    onChange={e => onChange({ pair: e.target.value as VisualMasterSettings['pair'] })}
                    options={
                        settings.type === 'letter'
                        ? [
                            { value: 'b-d', label: 'b / d' },
                            { value: 'p-q', label: 'p / q' },
                            { value: 'm-n', label: 'm / n' },
                            { value: 'mixed', label: 'Karışık Harfler' },
                          ]
                        : [
                            { value: 'ev-ve', label: 'ev / ve' },
                            { value: 'yok-koy', label: 'yok / koy' },
                            { value: 'kar-rak', label: 'kar / rak' },
                            { value: 'mixed', label: 'Karışık Kelimeler' },
                          ]
                    }
                />
            </div>
        </div>
    );
};

export default VisualMasterSettings;