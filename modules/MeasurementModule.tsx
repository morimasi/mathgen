import React, { useState } from 'react';
import { generateMeasurementProblem } from '../services/measurementService';
import { generateContextualWordProblems } from '../services/geminiService';
import { MeasurementSettings, MeasurementProblemType, Difficulty } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import TextInput from '../components/form/TextInput';
import { ShuffleIcon } from '../components/icons/Icons';
import { usePrintSettings } from '../services/PrintSettingsContext';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { TOPIC_SUGGESTIONS } from '../constants';
import HintButton from '../components/HintButton';
import { useProblemGenerator } from '../hooks/useProblemGenerator';

const MeasurementModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<MeasurementSettings>({
        gradeLevel: 2,
        type: MeasurementProblemType.Mixed,
        difficulty: 'easy',
        problemsPerPage: 20,
        pageCount: 1,
        useWordProblems: false,
        autoFit: true,
        useVisuals: false,
        topic: '',
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

    const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<MeasurementSettings> = { gradeLevel: grade };

        switch (grade) {
            case 2:
                newSettings.difficulty = 'easy';
                break;
            case 3:
                newSettings.difficulty = 'medium';
                break;
            case 4:
            case 5:
                newSettings.difficulty = 'hard';
                break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };
    
    const isTableLayout = printSettings.layoutMode === 'table';

    const getHintText = () => {
        if (settings.useWordProblems) {
            return "AI ile ölçü problemleri oluştururken, 'Problem Konusu' alanına 'mutfak tarifi', 'terzi' veya 'yolculuk' gibi temalar girerek daha bağlamsal ve ilgi çekici senaryolar yaratabilirsiniz.";
        }
        return "'Zorluk' ayarı, dönüşümlerin karmaşıklığını belirler. 'Kolay' tam sayılarla, 'Orta' ondalıklı sayılarla, 'Zor' ise kesirli ifadeler ve birden fazla birim içeren (örn: 3 km 250 m = ? m) problemler üretir.";
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Ölçüler Ayarları</h2>
                <HintButton text={getHintText()} />
            </div>

            <div className="space-y-1.5">
                <details className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg" open={settings.useWordProblems}>
                    <summary className="text-xs font-semibold cursor-pointer select-none">Gerçek Hayat Problemleri (AI)</summary>
                    <div className="mt-2 pl-4 space-y-1.5">
                        <Checkbox
                            label="Yapay Zeka ile Problem Oluştur"
                            id="use-word-problems-measurement"
                            checked={!!settings.useWordProblems}
                            onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                        />
                        <div className="relative">
                            <TextInput
                                label="Problem Konusu (İsteğe bağlı)"
                                id="measurement-topic"
                                value={settings.topic || ''}
                                onChange={e => handleSettingChange('topic', e.target.value)}
                                placeholder="Örn: Mutfak, Terzi, Manav"
                                className="pr-9"
                            />
                            <button type="button" onClick={handleRandomTopic} className="absolute right-2 bottom-[3px] text-stone-500 hover:text-orange-700" title="Rastgele Konu Öner" >
                                <ShuffleIcon className="w-4 h-4" />
                            </button>
                        </div>
                            <Checkbox
                            label="Görsel Destek Ekle (Emoji)"
                            id="use-visuals-measurement"
                            checked={settings.useVisuals ?? false}
                            onChange={e => handleSettingChange('useVisuals', e.target.checked)}
                        />
                    </div>
                </details>
                
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                    <Select
                        label="Sınıf Düzeyi"
                        id="measurement-grade-level"
                        value={settings.gradeLevel}
                        onChange={handleGradeLevelChange}
                        options={[{ value: 2, label: '2. Sınıf' },{ value: 3, label: '3. Sınıf' },{ value: 4, label: '4. Sınıf' },{ value: 5, label: '5. Sınıf' }]}
                    />
                     <Select
                        label="Zorluk"
                        id="measurement-difficulty"
                        value={settings.difficulty}
                        onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                        options={[
                            { value: 'easy', label: 'Kolay (Tam Sayılar)' },
                            { value: 'medium', label: 'Orta (Ondalıklı Sayılar)' },
                            { value: 'hard', label: 'Zor (Karışık Birimler)' },
                            { value: 'mixed', label: 'Karışık (Tümü)' },
                        ]}
                    />
                    <Select
                        label="Problem Türü"
                        id="measurement-type"
                        value={settings.type}
                        onChange={e => handleSettingChange('type', e.target.value as MeasurementProblemType)}
                        options={[
                            { value: MeasurementProblemType.Mixed, label: 'Karışık (Tümü)' },
                            { value: MeasurementProblemType.LengthConversion, label: 'Uzunluk (km, m, cm)' },
                            { value: MeasurementProblemType.WeightConversion, label: 'Ağırlık (t, kg, g)' },
                            { value: MeasurementProblemType.VolumeConversion, label: 'Hacim (L, mL)' },
                        ]}
                    />
                </div>
                 <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg" open>
                    <summary className="text-xs font-semibold cursor-pointer select-none">Sayfa Düzeni</summary>
                    <div className="mt-2 space-y-2">
                        <Checkbox label="Otomatik Sığdır" id="auto-fit-measurement" checked={settings.autoFit ?? true} onChange={e => handleSettingChange('autoFit', e.target.checked)} disabled={isTableLayout} />
                        <div className="grid grid-cols-2 gap-x-2">
                            <NumberInput label="Sayfa Başına Problem Sayısı" id="problems-per-page" min={1} max={100} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={isTableLayout || settings.autoFit} />
                            <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={isTableLayout} />
                        </div>
                    </div>
                </details>
            </div>
             <SettingsPresetManager moduleKey="measurement" currentSettings={settings} onLoadSettings={setSettings} />
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => generate(true)} size="sm">Oluştur</Button>
                <Button onClick={() => generate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default MeasurementModule;