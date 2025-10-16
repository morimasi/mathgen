
import React from 'react';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { PrintSettings } from '../types';
import Select from './form/Select';
import NumberInput from './form/NumberInput';
import Checkbox from './form/Checkbox';
import TableSelector from './form/TableSelector';

const PrintSettingsPanel: React.FC = () => {
    const { settings, setSettings } = usePrintSettings();

    const handleSettingChange = (field: keyof PrintSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleTableSelect = (rows: number, cols: number) => {
        setSettings(prev => ({ ...prev, rows, columns: cols }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-md font-semibold mb-3">Yerleşim</h3>
                <div className="space-y-3 p-3 bg-stone-50 dark:bg-stone-800/80 rounded-lg border border-stone-200 dark:border-stone-700">
                    <Select 
                        label="Yerleşim Modu"
                        id="layout-mode"
                        value={settings.layoutMode}
                        onChange={(e) => handleSettingChange('layoutMode', e.target.value)}
                        options={[
                            { value: 'flow', label: 'Sütunlu Akış' },
                            { value: 'table', label: 'Tablo' },
                        ]}
                    />
                    {settings.layoutMode === 'table' ? (
                        <div>
                             <label className="font-medium text-sm text-stone-700 dark:text-stone-300 mb-2 block">Tablo Boyutu</label>
                             <TableSelector rows={settings.rows} cols={settings.columns} onSelect={handleTableSelect} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                             <NumberInput 
                                label="Sütun Sayısı"
                                id="columns"
                                min={1} max={5}
                                value={settings.columns}
                                onChange={(e) => handleSettingChange('columns', parseInt(e.target.value))}
                            />
                             <NumberInput 
                                label="Sütun Boşluğu (rem)"
                                id="column-gap"
                                min={0} max={5} step={0.5}
                                value={settings.columnGap}
                                onChange={(e) => handleSettingChange('columnGap', parseFloat(e.target.value))}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-md font-semibold mb-3">Stil</h3>
                <div className="space-y-3 p-3 bg-stone-50 dark:bg-stone-800/80 rounded-lg border border-stone-200 dark:border-stone-700">
                    <div className="grid grid-cols-2 gap-3">
                         <NumberInput 
                            label="Yazı Tipi Boyutu (px)"
                            id="font-size"
                            min={8} max={32}
                            value={settings.fontSize}
                            onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                        />
                         <NumberInput 
                            label="Satır Yüksekliği"
                            id="line-height"
                            min={1} max={3} step={0.1}
                            value={settings.lineHeight}
                            onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
                        />
                    </div>
                     <Select 
                        label="Hizalama"
                        id="text-align"
                        value={settings.textAlign}
                        onChange={(e) => handleSettingChange('textAlign', e.target.value)}
                        options={[
                            { value: 'left', label: 'Sola Hizalı' },
                            { value: 'center', label: 'Ortalanmış' },
                            { value: 'right', label: 'Sağa Hizalı' },
                        ]}
                    />
                     <Select 
                        label="Renk Teması"
                        id="color-theme"
                        value={settings.colorTheme}
                        onChange={(e) => handleSettingChange('colorTheme', e.target.value)}
                        options={[
                            { value: 'black', label: 'Siyah' },
                            { value: 'blue', label: 'Mavi' },
                            { value: 'sepia', label: 'Sepya' },
                        ]}
                    />
                </div>
            </div>

             <div>
                <h3 className="text-md font-semibold mb-3">Sayfa</h3>
                 <div className="space-y-3 p-3 bg-stone-50 dark:bg-stone-800/80 rounded-lg border border-stone-200 dark:border-stone-700">
                    <Checkbox 
                        label="Başlık Göster (Ad, Tarih)"
                        id="show-header"
                        checked={settings.showHeader}
                        onChange={(e) => handleSettingChange('showHeader', e.target.checked)}
                    />
                     <Select 
                        label="Sayfa Stili (Zemin)"
                        id="notebook-style"
                        value={settings.notebookStyle}
                        onChange={(e) => handleSettingChange('notebookStyle', e.target.value)}
                        options={[
                            { value: 'none', label: 'Yok' },
                            { value: 'lines', label: 'Çizgili Defter' },
                            { value: 'grid', label: 'Kareli Defter' },
                            { value: 'dotted', label: 'Noktalı Defter' },
                        ]}
                    />
                     <Select 
                        label="Kenarlık Stili"
                        id="border-style"
                        value={settings.borderStyle}
                        onChange={(e) => handleSettingChange('borderStyle', e.target.value)}
                        options={[
                            { value: 'none', label: 'Yok' },
                            { value: 'card', label: 'Gölge' },
                            { value: 'solid', label: 'Düz Çizgi' },
                            { value: 'dashed', label: 'Kesik Çizgi' },
                            { value: 'dotted', label: 'Noktalı Çizgi' },
                            { value: 'double', label: 'Çift Çizgi' },
                            { value: 'fancy-geometric', label: 'Desenli - Geometrik' },
                            { value: 'fancy-ribbon', label: 'Desenli - Kurdele' },
                            { value: 'fancy-stars', label: 'Desenli - Yıldızlar' },
                            { value: 'fancy-lace', label: 'Desenli - Dantel' },
                        ]}
                    />
                     <NumberInput 
                        label="Sayfa Kenar Boşluğu (in)"
                        id="page-margin"
                        min={0.1} max={1.5} step={0.1}
                        value={settings.pageMargin}
                        onChange={(e) => handleSettingChange('pageMargin', parseFloat(e.target.value))}
                    />
                 </div>
            </div>
             <div>
                <h3 className="text-md font-semibold mb-3">Boşluklar</h3>
                 <div className="space-y-3 p-3 bg-stone-50 dark:bg-stone-800/80 rounded-lg border border-stone-200 dark:border-stone-700">
                     <NumberInput 
                        label="Problemler Arası Boşluk (rem)"
                        id="problem-spacing"
                        min={0} max={5} step={0.25}
                        value={settings.problemSpacing}
                        onChange={(e) => handleSettingChange('problemSpacing', parseFloat(e.target.value))}
                    />
                     <Select 
                        label="Sayfa Yönü"
                        id="orientation"
                        value={settings.orientation}
                        onChange={(e) => handleSettingChange('orientation', e.target.value)}
                        options={[
                            { value: 'portrait', label: 'Dikey' },
                            { value: 'landscape', label: 'Yatay' },
                        ]}
                    />
                 </div>
            </div>
        </div>
    );
};

export default PrintSettingsPanel;
