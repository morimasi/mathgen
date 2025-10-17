import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { generatePlaceValueProblem } from '../services/placeValueService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, PlaceValueSettings, PlaceValueProblemType, RoundingPlace } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import TextInput from '../components/form/TextInput';
import { ShuffleIcon } from '../components/icons/Icons';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { TOPIC_SUGGESTIONS } from '../constants';
import HintButton from '../components/HintButton';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const PlaceValueModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<PlaceValueSettings>({
        gradeLevel: 2,
        type: PlaceValueProblemType.Identification,
        digits: 3,
        roundingPlace: 'auto',
        problemsPerPage: 20,
        pageCount: 1,
        useWordProblems: false,
        autoFit: true,
        topic: '',
    });
    const isInitialMount = useRef(true);

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsLoading(true);
        try {
            let totalCount;
            const isTableLayout = printSettings.layoutMode === 'table';

            if (isTableLayout) {
                totalCount = printSettings.rows * printSettings.columns;
            } else if (settings.autoFit) {
                const problemsPerPage = calculateMaxProblems(contentRef, printSettings) || settings.problemsPerPage;
                totalCount = problemsPerPage * settings.pageCount;
            } else {
                totalCount = settings.problemsPerPage * settings.pageCount;
            }

            if (settings.useWordProblems) {
                const adjustedSettings = { ...settings, problemsPerPage: totalCount, pageCount: 1 };
                const problems = await generateContextualWordProblems('place-value', adjustedSettings);
                 const typeNames: { [key: string]: string } = { 'identification': 'Basamak Değeri Bulma', 'rounding': 'Yuvarlama', 'comparison': 'Karşılaştırma' };
                const title = `Gerçek Hayat Problemleri - ${typeNames[settings.type] || 'Basamak Değeri'}`;
                onGenerate(problems, clearPrevious, title, 'place-value', settings.pageCount);
            } else {
                const results = Array.from({ length: totalCount }, () => generatePlaceValueProblem(settings));
                
                const firstResultWithError = results.find(r => (r as any).error);
                if (firstResultWithError) {
                    console.error((firstResultWithError as any).error);
                } else if (results.length > 0) {
                    const problems = results.map(r => r.problem);
                    const title = results[0].title;
                    onGenerate(problems, clearPrevious, title, 'place-value', isTableLayout ? 1 : settings.pageCount);
                }
            }
        } catch (error: any) {
            console.error(error);
        }
        setIsLoading(false);
    }, [settings, printSettings, contentRef, onGenerate, setIsLoading]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'place-value') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    // Live update on settings change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (lastGeneratorModule === 'place-value') {
            const handler = setTimeout(() => {
                handleGenerate(true);
            }, 300); // Debounce to prevent rapid updates

            return () => clearTimeout(handler);
        }
    }, [settings, printSettings, lastGeneratorModule, handleGenerate]);

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
            
            <div className="grid grid-cols-1 gap-2">
                {isWordProblemCompatible && (
                     <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Checkbox
                            label="Gerçek Hayat Problemleri (AI)"
                            id="use-word-problems-place-value"
                            checked={settings.useWordProblems}
                            onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                        />
                         {settings.useWordProblems && (
                            <div className="mt-1.5 pl-6">
                                <div className="relative">
                                     <TextInput
                                        label="Problem Konusu (İsteğe bağlı)"
                                        id="place-value-topic"
                                        value={settings.topic || ''}
                                        onChange={e => handleSettingChange('topic', e.target.value)}
                                        placeholder="Örn: Nüfus, Uzaklık, Fiyat"
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
                        id="auto-fit-place-value"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                        disabled={isTableLayout}
                        title={isTableLayout ? "Tablo modunda bu ayar devre dışıdır." : ""}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                 <Select
                    label="Sınıf Düzeyi"
                    id="place-value-grade-level"
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
                moduleKey="place-value"
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

export default PlaceValueModule;