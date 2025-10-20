import React, { useState, useMemo } from 'react';
import { generatePlaceValueProblem } from '../services/placeValueService.ts';
import { generateContextualWordProblems } from '../services/geminiService.ts';
// FIX: Add .ts extension to import path
import { PlaceValueSettings, PlaceValueProblemType, RoundingPlace } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import Checkbox from '../components/form/Checkbox.tsx';
import TextInput from '../components/form/TextInput.tsx';
import { ShuffleIcon } from '../components/icons/Icons.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import { TOPIC_SUGGESTIONS } from '../constants.ts';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

const PlaceValueModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<PlaceValueSettings>({
        gradeLevel: 2,
        type: PlaceValueProblemType.Identification,
        digits: 3,
        roundingPlace: 'auto',
        problemsPerPage: 20,
        pageCount: 1,
        useWordProblems: false,
        topic: '',
        autoFit: false,
        fromWordsOrder: 'ordered',
        fromWordsFormat: 'inline',
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'place-value',
        settings,
        generatorFn: generatePlaceValueProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Gerçek Hayat Problemleri - Basamak Değeri'
    });

    const handleSettingChange = (field: keyof PlaceValueSettings, value: any) => {
        const newSettings: PlaceValueSettings = { ...settings, [field]: value };

        if (field === 'digits') {
            const newDigits = Number(value);
            if (newDigits < 4 && newSettings.roundingPlace === 'thousands') {
                newSettings.roundingPlace = 'auto';
            }
            if (newDigits < 3 && newSettings.roundingPlace === 'hundreds') {
                newSettings.roundingPlace = 'auto';
            }
            if (newDigits < 2 && newSettings.roundingPlace === 'tens') {
                newSettings.roundingPlace = 'auto';
            }
        }
        setSettings(newSettings);
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<PlaceValueSettings> = { gradeLevel: grade };

        switch (grade) {
            case 1:
                newSettings = { ...newSettings, type: PlaceValueProblemType.Identification, digits: 2 };
                break;
            case 2:
                newSettings = { ...newSettings, type: PlaceValueProblemType.Comparison, digits: 3 };
                break;
            case 3:
                newSettings = { ...newSettings, type: PlaceValueProblemType.Rounding, digits: 4 };
                break;
            case 4:
                newSettings = { ...newSettings, type: PlaceValueProblemType.ExpandedForm, digits: 6 };
                break;
            case 5:
                newSettings = { ...newSettings, type: PlaceValueProblemType.FromExpanded, digits: 7 };
                break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const isWordProblemCompatible = [
        PlaceValueProblemType.Identification,
        PlaceValueProblemType.Rounding,
        PlaceValueProblemType.Comparison
    ].includes(settings.type);
    
    const roundingOptions = useMemo(() => {
        const options = [{ value: 'auto', label: 'Otomatik' }];
        if (settings.digits >= 2) options.push({ value: 'tens', label: 'En Yakın Onluğa' });
        if (settings.digits >= 3) options.push({ value: 'hundreds', label: 'En Yakın Yüzlüğe' });
        if (settings.digits >= 4) options.push({ value: 'thousands', label: 'En Yakın Binliğe' });
        return options;
    }, [settings.digits]);
    
    const isTableLayout = printSettings.layoutMode === 'table';

    const getHintText = () => {
        switch (settings.type) {
            case PlaceValueProblemType.Rounding:
                return "'Yuvarlama Yeri' seçeneği, 'Basamak Sayısı' ayarına göre dinamik olarak güncellenir. Örneğin, 3 basamaklı bir sayı için en fazla yüzlüğe yuvarlama seçeneği görünür.";
            case PlaceValueProblemType.FromWords:
                return "Bu yeni etkinlik, öğrencilerin '5 onluk + 2 birlik' gibi yazılı ifadeleri '52' gibi bir sayıya dönüştürmesini ister. 'Sıralama' ve 'Format' ayarlarıyla zorluğu ve görünümü özelleştirebilirsiniz.";
            case PlaceValueProblemType.FromExpanded:
                return "Bu etkinlikte, çözümlemesi verilmiş bir sayının kendisini bulma istenir. Sayıların basamak değerlerini pekiştirmek için etkilidir.";
            case PlaceValueProblemType.Identification:
                return "Bu etkinlikte, sayının içinden rastgele bir rakamın altı çizilir ve bu rakamın basamak değeri sorulur. Örneğin, 456 sayısında 5'in basamak değeri 50'dir.";
            default:
                return "'Sınıf Düzeyi' ayarı, basamak sayısı ve problem türü gibi özellikleri ilgili sınıf seviyesi için otomatik olarak ayarlar. Hızlı bir başlangıç için idealdir.";
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Basamak Değeri Ayarları</h2>
                <HintButton text={getHintText()} />
            </div>
            
            <div className="space-y-1.5">
                {isWordProblemCompatible && (
                     <details className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg" open={settings.useWordProblems}>
                        <summary className="text-xs font-semibold cursor-pointer select-none">Gerçek Hayat Problemleri (AI)</summary>
                         <div className="mt-2 pl-4 space-y-1.5">
                            <Checkbox
                                label="Yapay Zeka ile Problem Oluştur"
                                id="use-word-problems-place-value"
                                checked={settings.useWordProblems}
                                onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                            />
                            <div className="relative">
                                <TextInput
                                    label="Problem Konusu (İsteğe Bağlı)"
                                    id="place-value-topic"
                                    value={settings.topic || ''}
                                    onChange={e => handleSettingChange('topic', e.target.value)}
                                    placeholder="Örn: Nüfus, Uzaklık, Fiyat"
                                    className="pr-9"
                                />
                                <button type="button" onClick={handleRandomTopic} className="absolute right-2 bottom-[3px] text-stone-500 hover:text-accent-text" title="Rastgele Konu Öner">
                                    <ShuffleIcon className="w-4 h-4" />
                                </button>
                            </div>
                         </div>
                    </details>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5">
                     <Select
                        label="Sınıf Düzeyi"
                        id="place-value-grade-level"
                        value={settings.gradeLevel}
                        onChange={handleGradeLevelChange}
                        options={[{ value: 1, label: '1. Sınıf' },{ value: 2, label: '2. Sınıf' },{ value: 3, label: '3. Sınıf' },{ value: 4, label: '4. Sınıf' },{ value: 5, label: '5. Sınıf' }]}
                    />
                    <Select
                        label="Problem Türü"
                        id="placevalue-type"
                        value={settings.type}
                        onChange={e => handleSettingChange('type', e.target.value as PlaceValueProblemType)}
                        options={[
                            { value: PlaceValueProblemType.Identification, label: 'Basamak Değeri Bulma' },
                            { value: PlaceValueProblemType.Rounding, label: 'Yuvarlama' },
                            { value: PlaceValueProblemType.ExpandedForm, label: 'Çözümleme' },
                            { value: PlaceValueProblemType.FromExpanded, label: 'Çözümlenmiş Sayıyı Bulma' },
                            { value: PlaceValueProblemType.FromWords, label: 'Basamak Değerinden Sayı Oluşturma' },
                            { value: PlaceValueProblemType.WriteInWords, label: 'Yazıyla Yazma' },
                            { value: PlaceValueProblemType.WordsToNumber, label: 'Okunuşu Verilen Sayıyı Yazma' },
                            { value: PlaceValueProblemType.Comparison, label: 'Karşılaştırma' },
                            { value: PlaceValueProblemType.ResultAsWords, label: 'İşlem Sonucunu Yazıyla Yazma' },
                        ]}
                    />
                    <NumberInput
                        label="Basamak Sayısı"
                        id="placevalue-digits"
                        min={2}
                        max={7}
                        value={settings.digits}
                        onChange={e => handleSettingChange('digits', parseInt(e.target.value))}
                    />
                     {settings.type === PlaceValueProblemType.Rounding && (
                        <Select
                            label="Yuvarlama Yeri"
                            id="rounding-place"
                            value={settings.roundingPlace}
                            onChange={e => handleSettingChange('roundingPlace', e.target.value as RoundingPlace)}
                            options={roundingOptions}
                        />
                     )}
                     {settings.type === PlaceValueProblemType.FromWords && (
                        <>
                            <Select
                                label="Sıralama"
                                id="from-words-order"
                                value={settings.fromWordsOrder}
                                onChange={e => handleSettingChange('fromWordsOrder', e.target.value as 'ordered' | 'mixed')}
                                options={[
                                    { value: 'ordered', label: 'Sıralı' },
                                    { value: 'mixed', label: 'Karışık Sıra' },
                                ]}
                            />
                            <Select
                                label="Format"
                                id="from-words-format"
                                value={settings.fromWordsFormat}
                                onChange={e => handleSettingChange('fromWordsFormat', e.target.value as 'inline' | 'vertical')}
                                options={[
                                    { value: 'inline', label: 'Yan Yana' },
                                    { value: 'vertical', label: 'Alt Alta' },
                                ]}
                            />
                        </>
                     )}
                </div>
                 <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg" open>
                    <summary className="text-xs font-semibold cursor-pointer select-none">Sayfa Düzeni</summary>
                    <div className="mt-2 space-y-2">
                        <Checkbox label="Otomatik Sığdır" id="autoFit-placevalue" checked={settings.autoFit ?? true} onChange={e => handleSettingChange('autoFit', e.target.checked)} disabled={isTableLayout} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
                            <NumberInput label="Sayfa Başına Problem Sayısı" id="problems-per-page" min={1} max={100} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={isTableLayout || settings.autoFit} />
                            <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={isTableLayout} />
                        </div>
                    </div>
                </details>
            </div>
             <SettingsPresetManager moduleKey="place-value" currentSettings={settings} onLoadSettings={setSettings} />
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => generate(true)} size="sm">Oluştur</Button>
                <Button onClick={() => generate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default PlaceValueModule;