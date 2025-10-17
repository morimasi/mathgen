import React, { useState, useCallback } from 'react';
import { generateRhythmicCountingProblem } from '../services/rhythmicCountingService';
import { generateContextualWordProblems } from '../services/geminiService';
import { RhythmicCountingSettings, RhythmicProblemType } from '../types';
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

const RhythmicCountingModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<RhythmicCountingSettings>({
        gradeLevel: 1,
        type: RhythmicProblemType.Pattern,
        step: 2,
        direction: 'forward',
        useMultiplesOnly: false,
        min: 1,
        max: 100,
        patternLength: 5,
        missingCount: 1,
        orderCount: 5,
        orderDigits: 3,
        beforeCount: 3,
        afterCount: 3,
        problemsPerPage: 20,
        pageCount: 1,
        useWordProblems: false,
        autoFit: true,
        topic: '',
        orderDirection: 'ascending',
    });

    const isPracticeSheet = [RhythmicProblemType.PracticeSheet, RhythmicProblemType.FillBeforeAfter, RhythmicProblemType.FillBetween].includes(settings.type);

    const { generate } = useProblemGenerator({
        moduleKey: 'rhythmic-counting',
        settings,
        generatorFn: generateRhythmicCountingProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Gerçek Hayat Problemleri - Ritmik Sayma',
        isPracticeSheet,
    });

    const handleSettingChange = (field: keyof RhythmicCountingSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<RhythmicCountingSettings> = { gradeLevel: grade };

        switch (grade) {
            case 1:
                newSettings.max = 100;
                newSettings.step = 2;
                break;
            case 2:
                newSettings.max = 1000;
                newSettings.step = 3;
                break;
            default:
                newSettings.max = 1000;
                newSettings.step = 5;
                break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const showStep = [RhythmicProblemType.Pattern, RhythmicProblemType.PracticeSheet, RhythmicProblemType.FillBeforeAfter, RhythmicProblemType.FillBetween].includes(settings.type);
    const showRange = [RhythmicProblemType.Pattern, RhythmicProblemType.PracticeSheet, RhythmicProblemType.OddEven, RhythmicProblemType.FillBeforeAfter, RhythmicProblemType.FillBetween].includes(settings.type);
    const showPattern = settings.type === RhythmicProblemType.Pattern;
    const isOrdering = settings.type === RhythmicProblemType.Ordering;
    const isTableLayout = printSettings.layoutMode === 'table';

    const getHintText = () => {
        if (isPracticeSheet) {
            return "'Alıştırma Kağıdı' türleri, tüm sayfayı kaplayan pratik sayfaları oluşturur. 'Otomatik Sığdır' bu modda devre dışıdır. 'Sayfa Sayısı' ile doğrudan kaç sayfa oluşturacağınızı belirlersiniz.";
        }
        if (isOrdering) {
            return "'Sıralama' etkinliği, karışık olarak verilen sayıların küçükten büyüğe veya büyükten küçüğe sıralanmasını ister. Sayıların basamak sayısını 'Sınıf Düzeyi' ile ayarlayabilirsiniz.";
        }
        if (showPattern) {
             return "'Örüntü Tamamlama' için 'Adım' sayısını (örn: 5'er), 'Yön'ü (ileri/geri) ve sayıların 'Min/Max' aralığını belirleyebilirsiniz. 'Sadece Katları Kullan' seçeneği, örüntünün her zaman adımın bir katıyla başlamasını sağlar.";
        }
        return "Ritmik sayma ve sayı örüntüleri becerilerini geliştirmek için çeşitli problem türleri sunar. 'Alıştırma Kağıdı' seçenekleri, hızlıca ödev hazırlamak için idealdir.";
    };

    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Ritmik Sayma Ayarları</h2>
                <HintButton text={getHintText()} />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
                {showPattern && (
                     <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Checkbox
                            label="Gerçek Hayat Problemleri (AI)"
                            id="use-word-problems-rhythmic"
                            checked={settings.useWordProblems}
                            onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                        />
                         {settings.useWordProblems && (
                            <div className="mt-1.5 pl-6">
                                <div className="relative">
                                     <TextInput
                                        label="Problem Konusu (İsteğe bağlı)"
                                        id="rhythmic-topic"
                                        value={settings.topic || ''}
                                        onChange={e => handleSettingChange('topic', e.target.value)}
                                        placeholder="Örn: Merdiven, Takvim, Sayı Dizisi"
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
                            </div>
                         )}
                    </div>
                )}
                 <div className="p-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                        label="Otomatik Sığdır"
                        id="auto-fit-rhythmic"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                        disabled={isPracticeSheet || isTableLayout}
                        title={isPracticeSheet ? "Alıştırma kağıtları her zaman tüm sayfayı doldurur." : (isTableLayout ? "Tablo modunda bu ayar devre dışıdır." : "")}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <Select
                    label="Problem Türü"
                    id="rhythmic-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as RhythmicProblemType)}
                    options={[
                        { value: RhythmicProblemType.Pattern, label: 'Örüntü Tamamlama' },
                        { value: RhythmicProblemType.FindRule, label: 'Örüntü Kuralı Bulma' },
                        { value: RhythmicProblemType.PracticeSheet, label: 'Alıştırma Kağıdı (3+Boşluk)' },
                        { value: RhythmicProblemType.FillBeforeAfter, label: 'Alıştırma Kağıdı (Önce/Sonra)' },
                        { value: RhythmicProblemType.FillBetween, label: 'Alıştırma Kağıdı (Arası)' },
                        { value: RhythmicProblemType.OddEven, label: 'Tek / Çift' },
                        { value: RhythmicProblemType.Ordering, label: 'Sıralama' },
                    ]}
                />
                 <Select
                    label="Sınıf Düzeyi"
                    id="rhythmic-grade-level"
                    value={settings.gradeLevel}
                    onChange={handleGradeLevelChange}
                    options={[
                        { value: 1, label: '1. Sınıf' },
                        { value: 2, label: '2. Sınıf' },
                        { value: 3, label: '3. Sınıf' },
                        { value: 4, label: '4. Sınıf' },
                        { value: 5, label: '5. Sınıf' },
                    ]}
                />
                {showStep && (
                    <NumberInput label="Adım" id="rhythmic-step" value={settings.step} onChange={e => handleSettingChange('step', parseInt(e.target.value))} />
                )}
                 {showStep && (
                    <Select label="Yön" id="rhythmic-direction" value={settings.direction} onChange={e => handleSettingChange('direction', e.target.value as 'forward' | 'backward' | 'mixed')}
                        options={[
                            { value: 'forward', label: 'İleri' },
                            { value: 'backward', label: 'Geri' },
                            { value: 'mixed', label: 'Karışık' },
                        ]}
                    />
                )}
                {showRange && (
                    <>
                    <NumberInput label="Min Değer" id="rhythmic-min" value={settings.min} onChange={e => handleSettingChange('min', parseInt(e.target.value))} disabled={settings.useWordProblems} />
                    <NumberInput label="Max Değer" id="rhythmic-max" value={settings.max} onChange={e => handleSettingChange('max', parseInt(e.target.value))} disabled={settings.useWordProblems} />
                    </>
                )}
                {showPattern && (
                    <>
                    <NumberInput label="Örüntü Uzunluğu" id="pattern-length" value={settings.patternLength} onChange={e => handleSettingChange('patternLength', parseInt(e.target.value))} disabled={settings.useWordProblems} />
                    <NumberInput label="Eksik Sayısı" id="missing-count" value={settings.missingCount} onChange={e => handleSettingChange('missingCount', parseInt(e.target.value))} disabled={settings.useWordProblems} />
                    </>
                )}
                {isOrdering && (
                     <Select label="Sıralama Yönü" id="order-direction" value={settings.orderDirection} onChange={e => handleSettingChange('orderDirection', e.target.value as 'ascending' | 'descending' | 'mixed')}
                        options={[
                            { value: 'ascending', label: 'Küçükten Büyüğe' },
                            { value: 'descending', label: 'Büyükten Küçüğe' },
                            { value: 'mixed', label: 'Karışık' },
                        ]}
                    />
                )}
                 {!isPracticeSheet && (
                     <NumberInput 
                        label="Sayfa Başına Problem Sayısı" 
                        id="problems-per-page" 
                        min={1} max={100} 
                        value={settings.problemsPerPage} 
                        onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} 
                        disabled={settings.autoFit || isTableLayout}
                        title={isTableLayout ? "Tablo modunda problem sayısı satır ve sütun sayısına göre belirlenir." : ""}
                     />
                 )}
                 <NumberInput 
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                    disabled={isTableLayout}
                    title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}
                />
                 {showStep && (
                    <div className="flex items-center pt-5">
                        <Checkbox label="Sadece Katları Kullan" id="use-multiples" checked={settings.useMultiplesOnly} onChange={e => handleSettingChange('useMultiplesOnly', e.target.checked)} disabled={settings.useWordProblems} />
                    </div>
                 )}
            </div>
             <SettingsPresetManager 
                moduleKey="rhythmic-counting"
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

export default RhythmicCountingModule;
