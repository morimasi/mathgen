import React, { useState, useMemo, useCallback } from 'react';
import { useWorksheet } from '../services/WorksheetContext';
import { useUI } from '../services/UIContext';
import { ModuleKey, Problem } from '../types';
import { moduleConfig, getModuleStats, generateModulePreview } from '../services/customizationCenterService';
import Button from '../components/form/Button';
import Select from '../components/form/Select';
import { RefreshIcon } from '../components/icons/Icons';
import NumberInput from '../components/form/NumberInput';
import { TAB_GROUPS } from '../constants';

interface ModuleCardProps {
    moduleKey: ModuleKey;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ moduleKey }) => {
    const { allSettings, handleSettingsChange } = useWorksheet();
    const { setActiveTab } = useUI();
    const [preview, setPreview] = useState<Problem | null>(null);

    const config = moduleConfig[moduleKey];
    if (!config) return null;

    const settings = allSettings[moduleKey];
    const stats = getModuleStats(moduleKey, settings);

    const generatePreview = useCallback(async () => {
        const result = await generateModulePreview(moduleKey, settings);
        if (result) {
            setPreview(result.problem);
        }
    }, [moduleKey, settings]);

    // Generate initial preview
    React.useEffect(() => {
        generatePreview();
    }, [generatePreview]);

    return (
        <div className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg p-4 flex flex-col h-full">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex-shrink-0 text-primary"><config.icon /></div>
                <h3 className="text-base font-bold text-stone-800 dark:text-stone-200 flex-grow">{config.title}</h3>
                <Button onClick={() => setActiveTab(moduleKey)} size="sm" variant="secondary">Modüle Git</Button>
            </div>
            <div className="flex-grow space-y-3 mt-3">
                <div className="grid grid-cols-2 gap-2">
                    {config.controls.map(control => {
                        const commonProps = {
                            label: control.label,
                            id: `${moduleKey}-${control.key}`,
                            value: (settings as any)[control.key],
                            onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => handleSettingsChange(moduleKey, { [control.key]: control.type === 'number' ? parseInt(e.target.value, 10) : e.target.value })
                        };
                        if (control.type === 'select') {
                            return <Select key={control.key} {...commonProps} options={control.options || []} />;
                        }
                        if (control.type === 'number') {
                            return <NumberInput key={control.key} {...commonProps} min={control.min} max={control.max} />;
                        }
                        return null;
                    })}
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400">Özet İstatistikler</h4>
                    <ul className="text-xs text-stone-700 dark:text-stone-300 mt-1 space-y-0.5">
                        {Object.entries(stats).map(([key, value]) => (
                            <li key={key}><span className="font-semibold">{key}:</span> {value}</li>
                        ))}
                    </ul>
                </div>

                <div className="flex-grow flex flex-col">
                    <div className="flex justify-between items-center">
                        <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400">Anlık Önizleme</h4>
                        <button onClick={generatePreview} className="p-1 rounded-full text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700" title="Önizlemeyi Yenile"><RefreshIcon className="w-3 h-3" /></button>
                    </div>
                    <div className="flex-grow mt-1 p-2 bg-white dark:bg-stone-900/50 rounded-md text-sm border border-stone-200 dark:border-stone-700/50 min-h-[60px] flex items-center justify-center">
                        {preview ? (
                            <div className="text-center w-full" dangerouslySetInnerHTML={{ __html: preview.question }} />
                        ) : (
                            <span className="text-xs text-stone-400">Önizleme yükleniyor...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CustomizationCenterModule: React.FC = () => {
    return (
        <div className="space-y-6">
             <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Özelleştirme Merkezi</h2>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400">
                Tüm modüllerin temel ayarlarını buradan yönetin. Hızlıca değişiklik yapın, anlık önizlemeyi görün ve tam kontrol için ilgili modüle gidin.
            </p>

            {TAB_GROUPS.filter(g => g.title !== 'Genel').map(group => (
                <div key={group.title}>
                    <h3 className="text-lg font-semibold mb-3 border-b border-stone-300 dark:border-stone-600 pb-2">{group.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.tabs.map(tab => (
                            (moduleConfig as any)[tab.id] ? <ModuleCard key={tab.id} moduleKey={tab.id as ModuleKey} /> : null
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomizationCenterModule;