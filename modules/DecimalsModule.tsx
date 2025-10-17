import React, { useState } from 'react';
import { generateDecimalProblem } from '../services/mathService';
import { generateContextualWordProblems } from '../services/geminiService';
import { DecimalsSettings, DecimalsProblemType, DecimalsOperation, Difficulty } from '../types';
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

const DecimalsModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<DecimalsSettings>({
        gradeLevel: 4,
        type: DecimalsProblemType.FourOperations,
        operation: DecimalsOperation.Addition,
        difficulty: 'easy',
        problemsPerPage: 20,
        pageCount: 1,
        format: 'inline',
        representation: 'number',
        useWordProblems: false,
        operationCount: 1,
        useVisuals: false,
        topic: '',
        autoFit: true,
    });
    
    const { generate } = useProblemGenerator({
        moduleKey: 'decimals',
        settings,
        generatorFn: generateDecimalProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Gerçek Hayat Problemleri - Ondalık Sayılar'
    });

    const handleSettingChange = (field: keyof DecimalsSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<DecimalsSettings> = { gradeLevel: grade };

        switch (grade) {
            case 4:
                newSettings.difficulty = 'easy';
                break;
            case 5:
                newSettings.difficulty = 'medium';
                break;
            default:
                 newSettings.difficulty = 'easy';
                 break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const isFourOps = settings.type === DecimalsProblemType.FourOperations;
    const isTableLayout = printSettings.layoutMode === 'table';

    const getHintText = () => {
        if (settings.useWordProblems) {
            return "AI ile ondalık sayı problemleri oluştururken 'Problem Konusu' olarak 'para (TL)', 'market alışverişi', 'uzunluk ölçümü (metre)' gibi konular belirleyerek daha gerçekçi senaryolar elde edebilirsiniz.";
        }
        switch (settings.type) {
            case DecimalsProblemType.FourOperations:
                return "'Zorluk' ayarı ondalık basamak sayısını belirler: Kolay (onda birler), Orta (yüzde birler), Zor (binde birler). 'Alt Alta' formatı, öğrencilerin virgülleri hizalama pratiği yapması için idealdir.";
            case DecimalsProblemType.ReadWrite:
                return "Bu etkinlik, ondalık sayıların sözel ve rakamsal gösterimi arasındaki ilişkiyi kurmayı hedefler. Öğrencilerin kavramsal anlayışını güçlendirir.";
            case DecimalsProblemType.ToFraction:
                return "Ondalık sayıları kesre çevirme alıştırmaları, bu iki sayı türü arasındaki bağlantıyı somutlaştırır. Üretilen cevaplar en sade halde verilir.";
            default:
                return "Ondalık sayılarla ilgili farklı becerileri geliştirmek için 'Problem Türü' menüsündeki seçenekleri keşfedin.";
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Ondalık Sayılar Ayarları</h2>
                <HintButton text={getHintText()} />
            </div>

            <div className="space-y-1.5">
                {isFourOps && (
                    <details className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg" open={settings.useWordProblems}>
                        <summary className="text-xs font-semibold cursor-pointer select-none">Gerçek Hayat Problemleri (AI)</summary>
                         <div className="mt-2 pl-4 space-y-1.5">
                            <Checkbox
                                label="Yapay Zeka ile Problem Oluştur"
                                id="use-word-problems-decimals"
                                checked={settings.useWordProblems}
                                onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                            />
                            <Select
                                label="Gereken İşlem Sayısı"
                                id="decimals-op-count"
                                value={settings.operationCount}
                                onChange={e => handleSettingChange('operationCount', parseInt(e.target.value, 10))}
                                options={[{ value: 1, label: '1 İşlemli' },{ value: 2, label: '2 İşlemli' },{ value: 3, label: '3 İşlemli' }]}
                            />
                            <div className="relative">
                                <TextInput
                                    label="Problem Konusu (İsteğe bağlı)"
                                    id="decimals-topic"
                                    value={settings.topic || ''}
                                    onChange={e => handleSettingChange('topic', e.target.value)}
                                    placeholder="Örn: Para, Ağırlık, Uzunluk"
                                    className="pr-9"
                                />
                                <button type="button" onClick={handleRandomTopic} className="absolute right-2 bottom-[3px] text-stone-500 hover:text-orange-700" title="Rastgele Konu Öner">
                                    <ShuffleIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <Checkbox
                                label="Görsel Destek Ekle (Emoji)"
                                id="use-visuals-decimals"
                                checked={settings.useVisuals ?? false}
                                onChange={e => handleSettingChange('useVisuals', e.target.checked)}
                            />
                        </div>
                    </details>
                )}
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                 <Select
                    label="Problem Türü"
                    id="decimals-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as DecimalsProblemType)}
                    options={[
                        { value: DecimalsProblemType.FourOperations, label: 'Dört İşlem' },
                        { value: DecimalsProblemType.ReadWrite, label: 'Okuma / Yazma' },
                        { value: DecimalsProblemType.ToFraction, label: 'Kesre Çevirme' },
                    ]}
                    containerClassName="col-span-2"
                />
                {isFourOps && (
                    <>
                        <Select
                            label="Sınıf Düzeyi"
                            id="decimals-grade-level"
                            value={settings.gradeLevel}
                            onChange={handleGradeLevelChange}
                            options={[{ value: 4, label: '4. Sınıf' },{ value: 5, label: '5. Sınıf' }]}
                        />
                        <Select
                            label="Zorluk"
                            id="decimals-difficulty"
                            value={settings.difficulty}
                            onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                            options={[{ value: 'easy', label: 'Kolay' },{ value: 'medium', label: 'Orta' },{ value: 'hard', label: 'Zor' }]}
                        />
                        <Select
                            label="İşlem"
                            id="decimals-operation"
                            value={settings.operation}
                            onChange={e => handleSettingChange('operation', e.target.value as DecimalsOperation)}
                            options={[
                                { value: DecimalsOperation.Addition, label: 'Toplama' },
                                { value: DecimalsOperation.Subtraction, label: 'Çıkarma' },
                                { value: DecimalsOperation.Multiplication, label: 'Çarpma' },
                                { value: DecimalsOperation.Division, label: 'Bölme' },
                                { value: DecimalsOperation.Mixed, label: 'Karışık (Tümü)' },
                            ]}
                        />
                        <Select
                            label="Format"
                            id="decimals-format"
                            value={settings.format}
                            onChange={e => handleSettingChange('format', e.target.value as 'inline' | 'vertical-html')}
                            disabled={settings.useWordProblems}
                            options={[{ value: 'inline', label: 'Yan Yana' },{ value: 'vertical-html', label: 'Alt Alta' }]}
                        />
                         <Select
                            label="Gösterim"
                            id="decimals-representation"
                            value={settings.representation}
                            onChange={e => handleSettingChange('representation', e.target.value)}
                            disabled={settings.useWordProblems || settings.format === 'vertical-html'}
                            title={settings.format === 'vertical-html' ? "Bu özellik 'Alt Alta' formatında kullanılamaz." : ""}
                            options={[{ value: 'number', label: 'Rakamla' },{ value: 'word', label: 'Yazıyla' },{ value: 'mixed', label: 'Karışık' }]}
                        />
                    </>
                )}
            </div>
             <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg" open>
                <summary className="text-xs font-semibold cursor-pointer select-none">Sayfa Düzeni</summary>
                <div className="mt-2 space-y-2">
                    <Checkbox label="Otomatik Sığdır" id="autoFit-decimals" checked={settings.autoFit ?? true} onChange={e => handleSettingChange('autoFit', e.target.checked)} disabled={isTableLayout} />
                    <div className="grid grid-cols-2 gap-x-2">
                        <NumberInput label="Sayfa Başına Problem Sayısı" id="problems-per-page" min={1} max={100} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={isTableLayout || settings.autoFit}/>
                        <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={isTableLayout}/>
                    </div>
                </div>
            </details>
             <SettingsPresetManager moduleKey="decimals" currentSettings={settings} onLoadSettings={setSettings} />
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => generate(true)} size="sm">Oluştur</Button>
                <Button onClick={() => generate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default DecimalsModule;