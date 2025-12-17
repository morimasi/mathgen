
import React, { useState, useCallback } from 'react';
import { generateMeasurementProblem } from '../services/measurementService.ts';
import { generateContextualWordProblems } from '../services/geminiService.ts';
import { MeasurementSettings, MeasurementProblemType, MeasurementDomain, Difficulty, VisualStyle } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import Checkbox from '../components/form/Checkbox.tsx';
import TextInput from '../components/form/TextInput.tsx';
import { ShuffleIcon } from '../components/icons/Icons.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import { TOPIC_SUGGESTIONS } from '../constants.ts';
import HintButton from '../components/form/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

const MeasurementModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<MeasurementSettings>({
        gradeLevel: 3,
        domain: MeasurementDomain.Length,
        type: MeasurementProblemType.Conversion,
        difficulty: 'medium',
        problemsPerPage: 10,
        pageCount: 1,
        useWordProblems: false,
        autoFit: false,
        topic: '',
        rulerDetail: 'cm',
        scaleType: 'balance',
        visualStyle: 'none',
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'measurement',
        settings,
        generatorFn: generateMeasurementProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Gerçek Hayat Problemleri - Ölçüler'
    });

    const handleSettingChange = (field: keyof MeasurementSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const isTableLayout = printSettings.layoutMode === 'table';

    // Domain Specific Helpers
    const showRulerOptions = settings.domain === MeasurementDomain.Length && settings.type === MeasurementProblemType.ReadTool;
    const showScaleOptions = settings.domain === MeasurementDomain.Weight && settings.type === MeasurementProblemType.ReadTool;

    const handleDomainChange = (domain: MeasurementDomain) => {
        setSettings(prev => ({ 
            ...prev, 
            domain,
            // Reset tool specific types when changing domain if they don't apply
            type: (domain === MeasurementDomain.Temperature && prev.type === MeasurementProblemType.Conversion) ? MeasurementProblemType.ReadTool : prev.type 
        }));
    };

    const getHintText = () => {
        if (settings.useWordProblems) return "AI modu, seçilen ölçü birimiyle ilgili (örn: 'manavda ağırlık', 'terzide uzunluk') hikayeleştirilmiş problemler üretir. 'Görsel Stil' ayarından 'Teknik Çizim'i seçerek cetvel veya terazi gibi araçların eklenmesini sağlayabilirsiniz.";
        if (settings.type === MeasurementProblemType.ReadTool) return "Öğrencilerin cetvel, termometre, terazi veya dereceli kap gibi gerçek ölçüm araçlarını okuma becerilerini geliştirir.";
        if (settings.type === MeasurementProblemType.Estimation) return "Gerçek dünyadaki nesnelerin (bir elma, bir kapı vb.) tahmini ölçüleri üzerine farkındalık yaratır.";
        return "Ölçüler modülü, birim dönüştürmeden araç kullanımına kadar kapsamlı bir matematiksel ölçme deneyimi sunar.";
    };

    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Ölçüler Laboratuvarı</h2>
                <HintButton text={getHintText()} />
            </div>

            {/* Domain Tabs */}
            <div className="flex p-1 space-x-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
                {[
                    { id: MeasurementDomain.Length, label: '📏 Uzunluk' },
                    { id: MeasurementDomain.Weight, label: '⚖️ Tartma' },
                    { id: MeasurementDomain.Capacity, label: '🧪 Sıvı' },
                    { id: MeasurementDomain.Temperature, label: '🌡️ Sıcaklık' },
                    { id: MeasurementDomain.Mixed, label: 'Karma' },
                ].map((d) => (
                    <button
                        key={d.id}
                        onClick={() => handleDomainChange(d.id)}
                        className={`
                            w-full py-1.5 text-xs font-medium leading-5 rounded-md focus:outline-none transition-all
                            ${settings.domain === d.id
                                ? 'bg-white dark:bg-stone-600 text-primary shadow'
                                : 'text-stone-500 hover:text-stone-700 hover:bg-white/[0.12]'
                            }
                        `}
                    >
                        {d.label}
                    </button>
                ))}
            </div>

            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Checkbox
                    label="Gerçek Hayat Problemleri (AI)"
                    id="use-word-problems-measurement"
                    checked={!!settings.useWordProblems}
                    onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                />
                 {settings.useWordProblems && (
                    <div className="mt-1.5 pl-6 grid grid-cols-1 gap-2">
                         <div className="relative">
                            <TextInput
                                label="Senaryo (Örn: Mutfak, İnşaat)"
                                id="measurement-topic"
                                value={settings.topic || ''}
                                onChange={e => handleSettingChange('topic', e.target.value)}
                                className="pr-10"
                            />
                            <button type="button" onClick={handleRandomTopic} className="absolute right-2.5 bottom-[5px] text-stone-500 hover:text-orange-700" title="Rastgele">
                                <ShuffleIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <Select
                            label="Görsel Stil"
                            id="measurement-visual-style"
                            value={settings.visualStyle}
                            onChange={e => handleSettingChange('visualStyle', e.target.value as VisualStyle)}
                            options={[
                                { value: 'none', label: 'Yalnızca Metin' },
                                { value: 'ai-illustration', label: 'AI İllüstrasyon (Resim)' },
                                { value: 'technical-svg', label: 'Teknik Çizim (Cetvel/Terazi)' },
                            ]}
                        />
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <Select
                    label="Kazanım / Etkinlik"
                    id="measurement-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as MeasurementProblemType)}
                    options={[
                        { value: MeasurementProblemType.ReadTool, label: 'Araç Okuma (Görsel)' },
                        { value: MeasurementProblemType.Conversion, label: 'Birim Dönüştürme' },
                        { value: MeasurementProblemType.Comparison, label: 'Kıyaslama & Denge' },
                        { value: MeasurementProblemType.Estimation, label: 'Tahmin Etme' },
                    ]}
                    containerClassName="col-span-2"
                />

                <Select
                    label="Zorluk Seviyesi"
                    id="measurement-difficulty"
                    value={settings.difficulty}
                    onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                    options={[
                        { value: 'easy', label: 'Başlangıç (Tam Sayılar)' },
                        { value: 'medium', label: 'Orta (Basit Ondalıklar)' },
                        { value: 'hard', label: 'İleri (Karmaşık Birimler)' },
                    ]}
                />
                
                {/* Dynamic Options based on Domain/Type */}
                {showRulerOptions && (
                     <Select
                        label="Cetvel Detayı"
                        id="ruler-detail"
                        value={settings.rulerDetail}
                        onChange={e => handleSettingChange('rulerDetail', e.target.value)}
                        options={[
                            { value: 'cm', label: 'Sadece CM' },
                            { value: 'mm', label: 'CM ve MM' },
                            { value: 'broken', label: 'Kırık Cetvel (Sıfırdan Başlamayan)' },
                        ]}
                    />
                )}

                <NumberInput 
                    label="Sayfa Başına Soru" 
                    id="problems-per-page" 
                    min={1} max={20} 
                    value={settings.problemsPerPage} 
                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} 
                    disabled={isTableLayout || settings.autoFit} 
                />
            </div>

             <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg" open>
                <summary className="text-xs font-semibold cursor-pointer select-none">Sayfa Düzeni</summary>
                <div className="mt-2 space-y-2">
                    <Checkbox label="Otomatik Sığdır" id="auto-fit-measurement" checked={settings.autoFit} onChange={e => handleSettingChange('autoFit', e.target.checked)} disabled={isTableLayout} />
                    <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={10} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={isTableLayout} />
                </div>
            </details>

             <SettingsPresetManager moduleKey="measurement" currentSettings={settings} onLoadSettings={setSettings} />
            
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => handleGenerate(true)} size="sm">Oluştur</Button>
                <Button onClick={() => handleGenerate(false)} variant="secondary" size="sm">Ekle</Button>
            </div>
        </div>
    );
};

export default MeasurementModule;
