import React, { useState } from 'react';
import { generateRhythmicCountingProblem } from '../services/rhythmicCountingService.ts';
import { generateContextualWordProblems } from '../services/geminiService.ts';
// FIX: Add .ts extension to import path
import { RhythmicCountingSettings, RhythmicProblemType } from '../types.ts';
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
// FIX: Add .ts extension to import path
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

// FIX: Switched to a named export to resolve a React.lazy type error. The original file content was corrupted with code from another module, causing numerous errors. The content has been fully restored.
export const RhythmicCountingModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<RhythmicCountingSettings>({
        type: RhythmicProblemType.Pattern,
        step: 2,
        direction: 'forward',
        useMultiplesOnly: false,
        digits: 2,
        patternLength: 5,
        missingCount: 1,
        orderCount: 5,
        beforeCount: 3,
        afterCount: 3,
        problemsPerPage: 20,
        pageCount: 1,
        useWordProblems: false,
        topic: '',
        orderDirection: 'ascending',
        autoFit: true,
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

    const showStep = [RhythmicProblemType.Pattern, RhythmicProblemType.PracticeSheet, RhythmicProblemType.FillBeforeAfter, RhythmicProblemType.FillBetween].includes(settings.type);
    const showPattern = settings.type === RhythmicProblemType.Pattern;
    const isOrdering = settings.type === RhythmicProblemType.Ordering;
    const isTableLayout = printSettings.layoutMode === 'table';

    const getHintText = () => {
        if (isPracticeSheet) {
            return "'Alıştırma Kağıdı' türleri, tüm sayfayı kaplayan pratik sayfaları oluşturur. 'Otomatik Sığdır' bu modda devre dışıdır. 'Sayfa Sayısı' ile doğrudan kaç sayfa oluşturacağınızı belirlersiniz.";
        }
        if (isOrdering) {
            return "'Sıralama' etkinliği, karışık olarak verilen sayıların küçükten büyüğe veya büyükten küçüğe sıralanmasını ister. Sayıların basamak sayısını 'Basamak Sayısı' ayarı ile belirleyebilirsiniz.";
        }
        if (showPattern) {
             return "'Örüntü Tamamlama' için 'Adım' sayısını (örn: 5'er), 'Yön'ü (ileri/geri) ve sayıların 'Basamak Sayısı'nı belirleyebilirsiniz. 'Sadece Katları Kullan' seçeneği, örüntünün her zaman adımın bir katıyla başlamasını sağlar.";
        }
        return "Ritmik sayma ve sayı örüntüleri becerilerini geliştirmek için çeşitli problem türleri sunar. 'Alıştırma Kağıdı' seçenekleri, hızlıca ödev hazırlamak için idealdir.";
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Ritmik Sayma Ayarları</h2>
                <HintButton text={getHintText()} />
            </div>
            
            <div className="space-y-1.5">
                {showPattern && (
                     <details className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg" open={settings.useWordProblems}>
                        <summary className="text-xs font-semibold cursor-pointer select-none">Gerçek Hayat Problemleri (AI)</summary>
                         <div className="mt-2 pl-4 space-y-1.5">
                            <Checkbox
                                label="Yapay Zeka ile Problem Oluştur"
                                id="use-word-problems-rhythmic"
                                checked={settings.useWordProblems}
                                onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                            />
                            <div className="relative">
                                <TextInput
                                    label="Problem Konusu (İsteğe bağlı)"
                                    id="rhythmic-topic"
                                    value={settings.topic || ''}
                                    onChange={e => handleSettingChange('topic', e.target.value)}
                                    placeholder="Örn: Zıplayan tavşan, merdiven çıkan çocuk"
                                    className="pr-9"
                                />
                                <button type="button" onClick={handleRandomTopic} className="absolute right-2 bottom-[3px] text-stone-500 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors" title="Rastgele Konu Öner">
                                    <ShuffleIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </details>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5">
                     <Select
                        label="Problem Türü"
                        id="rhythmic-type"
                        value={settings.type}
                        onChange={e => handleSettingChange('type', e.target.value as RhythmicProblemType)}
                        options={[
                            { value: RhythmicProblemType.Pattern, label: 'Örüntü Tamamlama' },
                            { value: RhythmicProblemType.FindRule, label: 'Örüntü Kuralı Bulma' },
                            { value: RhythmicProblemType.PracticeSheet, label: 'Alıştırma Kağıdı' },
                            { value: RhythmicProblemType.FillBeforeAfter, label: 'Öncesini/Sonrasını Doldur' },
                            { value: RhythmicProblemType.FillBetween, label: 'Arasını Doldur' },
                            { value: RhythmicProblemType.OddEven, label: 'Tek/Çift Sayılar' },
                            { value: RhythmicProblemType.Ordering, label: 'Sıralama' },
                            { value: RhythmicProblemType.Comparison, label: 'Karşılaştırma' },
                        ]}
                    />
                     <NumberInput
                        label="Basamak Sayısı" id="rhythmic-digits" min={1} max={7} value={settings.digits}
                        onChange={e => handleSettingChange('digits', parseInt(e.target.value))} 
                    />
                    
                    {showStep && (
                        <NumberInput
                            label="Adım" id="rhythmic-step" min={1} max={100} value={settings.step}
                            onChange={e => handleSettingChange('step', parseInt(e.target.value))} />
                    )}
                    {showStep && (
                        <Select
                            label="Yön" id="rhythmic-direction" value={settings.direction}
                            onChange={e => handleSettingChange('direction', e.target.value as 'forward' | 'backward' | 'mixed')}
                            options={[{ value: 'forward', label: 'İleri' }, { value: 'backward', label: 'Geri' }, { value: 'mixed', label: 'Karışık' }]} />
                    )}
                    {showPattern && (
                        <NumberInput
                            label="Örüntü Uzunluğu" id="rhythmic-patternLength" min={3} max={10} value={settings.patternLength}
                            onChange={e => handleSettingChange('patternLength', parseInt(e.target.value))} />
                    )}
                    {showPattern && (
                        <NumberInput
                            label="Eksik Sayısı" id="rhythmic-missingCount" min={1} max={5} value={settings.missingCount}
                            onChange={e => handleSettingChange('missingCount', parseInt(e.target.value))} />
                    )}
                    {isOrdering && (
                        <NumberInput
                            label="Sıralanacak Sayı Adedi" id="rhythmic-orderCount" min={3} max={10} value={settings.orderCount}
                            onChange={e => handleSettingChange('orderCount', parseInt(e.target.value))} />
                    )}
                    {isOrdering && (
                        <Select
                            label="Sıralama Yönü" id="rhythmic-orderDirection" value={settings.orderDirection}
                            onChange={e => handleSettingChange('orderDirection', e.target.value as 'ascending' | 'descending' | 'mixed')}
                            options={[{ value: 'ascending', label: 'Küçükten Büyüğe' }, { value: 'descending', label: 'Büyükten Küçüğe' }, { value: 'mixed', label: 'Karışık' }]} />
                    )}

                    {showStep && (
                        <Checkbox label="Sadece Katları Kullan" id="use-multiples" checked={settings.useMultiplesOnly}
                            onChange={e => handleSettingChange('useMultiplesOnly', e.target.checked)}
                            containerClassName="col-span-1 sm:col-span-2" />
                    )}
                </div>

                <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg" open>
                    <summary className="text-xs font-semibold cursor-pointer select-none">Sayfa Düzeni</summary>
                    <div className="mt-2 space-y-2">
                        <Checkbox label="Otomatik Sığdır" id="autoFit-rhythmic" checked={settings.autoFit ?? true}
                            onChange={e => handleSettingChange('autoFit', e.target.checked)}
                            disabled={isPracticeSheet || isTableLayout}
                            title={isPracticeSheet ? "Alıştırma kağıdı modunda bu ayar devre dışıdır." : (isTableLayout ? "Tablo modunda bu ayar devre dışıdır." : "")}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
                            <NumberInput label="Sayfa Başına Problem Sayısı" id="problems-per-page" min={1} max={100} value={settings.problemsPerPage}
                                onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                                disabled={isPracticeSheet || isTableLayout || settings.autoFit}
                                title={isPracticeSheet ? "Alıştırma kağıdı modunda problem sayısı otomatik ayarlanır." : (isTableLayout ? "Tablo modunda problem sayısı satır ve sütun sayısına göre belirlenir." : "")}
                            />
                            <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount}
                                onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                                disabled={isTableLayout} title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}
                            />
                        </div>
                    </div>
                </details>
            </div>
             <SettingsPresetManager moduleKey="rhythmic-counting" currentSettings={settings} onLoadSettings={setSettings}/>
            <div className="flex flex-wrap gap-2 pt-1.5">
                <Button onClick={() => generate(true)} size="sm" enableFlyingLadybug>Oluştur</Button>
                <Button onClick={() => generate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};