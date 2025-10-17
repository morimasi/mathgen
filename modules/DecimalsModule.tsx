import React, { useState, useCallback } from 'react';
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
        autoFit: true,
        useVisuals: false,
        topic: '',
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
    
    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Ondalık Sayılar Ayarları</h2>
                <HintButton text={getHintText()} />
            </div>

            <div className="grid grid-cols-1 gap-2">
                {isFourOps && (
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Checkbox
                            label="Gerçek Hayat Problemleri (AI)"
                            id="use-word-problems-decimals"
                            checked={settings.useWordProblems}
                            onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                        />
                         {settings.useWordProblems && (
                            <div className="mt-1.5 pl-6 space-y-1.5">
                                <Select
                                    label="Gereken İşlem Sayısı"
                                    id="decimals-op-count"
                                    value={settings.operationCount}
                                    onChange={e => handleSettingChange('operationCount', parseInt(e.target.value, 10))}
                                    options={[
                                        { value: 1, label: '1 İşlemli' },
                                        { value: 2, label: '2 İşlemli' },
                                        { value: 3, label: '3 İşlemli' },
                                    ]}
                                />
                                <div className="relative">
                                    <TextInput
                                        label="Problem Konusu (İsteğe bağlı)"
                                        id="decimals-topic"
                                        value={settings.topic || ''}
                                        onChange={e => handleSettingChange('topic', e.target.value)}
                                        placeholder="Örn: Para, Ağırlık, Uzunluk"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRandomTopic}
                                        className="absolute right-2.5 bottom-[5px] text-stone-500 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors"
                                        title="Rastgele Konu Öner"
                                    >
                                        <ShuffleIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <Checkbox
                                    label="Görsel Destek Ekle (Emoji)"
                                    id="use-visuals-decimals"
                                    checked={settings.useVisuals ?? false}
                                    onChange={e => handleSettingChange('useVisuals', e.target.checked)}
                                />
                            </div>
                        )}
                    </div>
                )}
                <div className="p-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                        label="Otomatik Sığdır"
                        id="auto-fit-decimals"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                        disabled={isTableLayout}
                        title={isTableLayout ? "Tablo modunda bu ayar devre dışıdır." : ""}
                    />
                </div>
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
                            options={[
                                { value: 4, label: '4. Sınıf' },
                                { value: 5, label: '5. Sınıf' },
                            ]}
                        />
                        <Select
                            label="Zorluk"
                            id="decimals-difficulty"
                            value={settings.difficulty}
                            onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                            options={[
                                { value: 'easy', label: 'Kolay' },
                                { value: 'medium', label: 'Orta' },
                                { value: 'hard', label: 'Zor' },
                            ]}
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
                            options={[
                                { value: 'inline', label: 'Yan Yana' },
                                { value: 'vertical-html', label: 'Alt Alta' },
                            ]}
                        />
                         <Select
                            label="Gösterim"
                            id="decimals-representation"
                            value={settings.representation}
                            onChange={e => handleSettingChange('representation', e.target.value)}
                            disabled={settings.useWordProblems || settings.format === 'vertical-html'}
                            title={settings.format === 'vertical-html' ? "Bu özellik 'Alt Alta' formatında kullanılamaz." : ""}
                            options={[
                                { value: 'number', label: 'Rakamla' },
                                { value: 'word', label: 'Yazıyla' },
                                { value: 'mixed', label: 'Karışık' },
                            ]}
                        />
                    </>
                )}
                <NumberInput 
                    label="Sayfa Başına Problem Sayısı"
                    id="problems-per-page"
                    min={1} max={100}
                    value={settings.problemsPerPage}
                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                    disabled={settings.autoFit || isTableLayout}
                    title={isTableLayout ? "Tablo modunda problem sayısı satır ve sütun sayısına göre belirlenir." : ""}
                />
                 <NumberInput 
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                    disabled={isTableLayout}
                    title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}
                />
            </div>
             <SettingsPresetManager 
                moduleKey="decimals"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => handleGenerate(true)} size="sm">Oluştur (Temizle)</Button>
                <Button onClick={() => handleGenerate(true)} variant="secondary" title="Ayarları koruyarak soruları yenile" size="sm">
                    <ShuffleIcon className="w-4 h-4" />
                    Yenile
                </Button>
                <Button onClick={() => handleGenerate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default DecimalsModule;
