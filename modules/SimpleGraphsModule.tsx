import React, { useState, useEffect, useCallback } from 'react';
import { generateSimpleGraphsProblem } from '../services/readinessService';
import { Problem, SimpleGraphsSettings, SimpleGraphType, MathReadinessTheme } from '../types';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { LoadingIcon } from '../components/icons/Icons';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const SimpleGraphsModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<SimpleGraphsSettings>({
        graphType: SimpleGraphType.Pictograph,
        theme: 'fruits',
        categoryCount: 3,
        maxItemCount: 5,
        problemsPerPage: 1,
        pageCount: 1,
        autoFit: false, // This module is usually one big problem
        useWordProblems: false,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const { settings: printSettings } = usePrintSettings();

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsGenerating(true);
        setIsLoading(true);
        try {
            // This module typically generates one large problem per page.
            const problemCount = settings.pageCount;
            
            const results = Array.from({ length: problemCount }, () => generateSimpleGraphsProblem(settings));
            const problems = results.map(r => r.problem);
            const title = results.length > 0 ? results[0].title : '';

            onGenerate(problems, clearPrevious, title, 'simple-graphs', settings.pageCount);
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'simple-graphs') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof SimpleGraphsSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };
    
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basit Grafikler</h2>
            <Select
                label="Grafik Türü"
                id="graph-type"
                value={settings.graphType}
                onChange={e => handleSettingChange('graphType', e.target.value as SimpleGraphType)}
                options={[
                    { value: SimpleGraphType.Pictograph, label: 'Resimli Grafik (Çetele)' },
                    { value: SimpleGraphType.BarChart, label: 'Sütun Grafiği' },
                ]}
            />
            <Select
                label="Tema"
                id="graph-theme"
                value={settings.theme}
                onChange={e => handleSettingChange('theme', e.target.value as MathReadinessTheme)}
                options={[
                    { value: 'fruits', label: 'Meyveler' },
                    { value: 'vehicles', label: 'Taşıtlar' },
                    { value: 'animals', label: 'Hayvanlar' },
                    { value: 'shapes', label: 'Şekiller' },
                ]}
            />
             <div className="grid grid-cols-2 gap-4">
                <NumberInput label="Kategori Sayısı" id="category-count" min={2} max={5} value={settings.categoryCount} onChange={e => handleSettingChange('categoryCount', parseInt(e.target.value))} />
                <NumberInput label="En Fazla Nesne" id="max-item-count" min={3} max={10} value={settings.maxItemCount} onChange={e => handleSettingChange('maxItemCount', parseInt(e.target.value))} />
            </div>
            
            <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} />

            <Button onClick={() => handleGenerate(true)} className="w-full" disabled={isGenerating}>
                 {isGenerating && <LoadingIcon className="w-5 h-5" />}
                Oluştur
            </Button>
            <SettingsPresetManager
                moduleKey="simple-graphs"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default SimpleGraphsModule;
