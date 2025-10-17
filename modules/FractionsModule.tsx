import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateFractionsProblem } from '../services/fractionsService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, FractionsSettings, FractionsProblemType, FractionsOperation, Difficulty } from '../types';
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

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const FractionsModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<FractionsSettings>({
        gradeLevel: 3,
        type: FractionsProblemType.FourOperations,
        operation: FractionsOperation.Addition,
        difficulty: 'easy',
        maxSetSize: 30,
        problemsPerPage: 20,
        pageCount: 1,
        format: 'vertical-html',
        representation: 'number',
        useWordProblems: false,
        operationCount: 1,
        autoFit: true,
        useVisuals: false,
        topic: '',
        useMixedNumbers: true,
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
                const problemsPerPage = calculateMaxProblems(contentRef, printSettings);
                totalCount = (problemsPerPage > 0 ? problemsPerPage : settings.problemsPerPage) * settings.pageCount;
            } else {
                totalCount = settings.problemsPerPage * settings.pageCount;
            }

            if (settings.useWordProblems && settings.type === FractionsProblemType.FourOperations) {
                const adjustedSettings = { ...settings, problemsPerPage: totalCount, pageCount: 1 };
                const problems = await generateContextualWordProblems('fractions', adjustedSettings);
                const opNames: { [key: string]: string } = { 'addition': 'Toplama', 'subtraction': 'Çıkarma', 'multiplication': 'Çarpma', 'division': 'Bölme', 'mixed': 'Karışık Dört İşlem' };
                const diffNames: { [key: string]: string } = { 'easy': 'Kolay', 'medium': 'Orta', 'hard': 'Zor' };
                const title = `Gerçek Hayat Problemleri - Kesirlerde ${opNames[settings.operation!]} (${diffNames[settings.difficulty!]})`;
                onGenerate(problems, clearPrevious, title, 'fractions', settings.pageCount);
            } else {
                const results = Array.from({ length: totalCount }, () => generateFractionsProblem(settings));
                
                const firstResultWithError = results.find(r => (r as any).error);
                if (firstResultWithError) {
                    console.error((firstResultWithError as any).error);
                } else if (results.length > 0) {
                    const problems = results.map(r => r.problem);
                    const title = results[0].title;
                    onGenerate(problems, clearPrevious, title, 'fractions', isTableLayout ? 1 : settings.pageCount);
                }
            }
        } catch (error: any) {
            console.error(error);
        }
        setIsLoading(false);
    }, [settings, printSettings, contentRef, onGenerate, setIsLoading]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'fractions') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    // Live update on settings change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (lastGeneratorModule === 'fractions') {
            const handler = setTimeout(() => {
                handleGenerate(true);
            }, 300); // Debounce to prevent rapid updates

            return () => clearTimeout(handler);
        }
    }, [settings, printSettings, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof FractionsSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };
    
    const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<FractionsSettings> = { gradeLevel: grade };

        switch (grade) {
            case 3:
                newSettings.difficulty = 'easy';
                break;
            case 4:
                newSettings.difficulty = 'medium';
                break;
            case 5:
                newSettings.difficulty = 'hard';
                break;
            default:
                newSettings.difficulty = 'easy';
                break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const isFourOps = settings.type === FractionsProblemType.FourOperations;
    const isFractionOfSet = settings.type === FractionsProblemType.FractionOfSet;
    const isWordProblemMode = settings.useWordProblems;
    const isTableLayout = printSettings.layoutMode === 'table';

    return (
        <div className="space-y-2">
            <h2 className="text-sm font-semibold">Kesirler Ayarları</h2>
            
            <div className="grid grid-cols-1 gap-2">
                 {isFourOps && (
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Checkbox
                            label="Gerçek Hayat Problemleri (AI)"
                            id="use-word-problems-fractions"
                            checked={settings.useWordProblems}
                            onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                        />
                        {settings.useWordProblems && (
                            <div className="mt-1.5 pl-6 space-y-1.5">
                                <Select
                                    label="Gereken İşlem Sayısı"
                                    id="fractions-op-count"
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
                                        id="fractions-topic"
                                        value={settings.topic || ''}
                                        onChange={e => handleSettingChange('topic', e.target.value)}
                                        placeholder="Örn: Pizza, Pasta, Kurdele"
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
                                    id="use-visuals-fractions"
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
                        id="auto-fit-fractions"
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
                    id="fractions-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as FractionsProblemType)}
                    options={[
                        { value: FractionsProblemType.FourOperations, label: 'Dört İşlem' },
                        { value: FractionsProblemType.Recognition, label: 'Şekille Gösterme' },
                        { value: FractionsProblemType.Comparison, label: 'Karşılaştırma' },
                        { value: FractionsProblemType.Equivalent, label: 'Denk Kesirler' },
                        { value: FractionsProblemType.FractionOfSet, label: 'Bir Bütünün Kesrini Bulma' },
                    ]}
                    containerClassName="col-span-2"
                />
                {isFourOps && (
                    <>
                         <Select
                            label="Sınıf Düzeyi"
                            id="fractions-grade-level"
                            value={settings.gradeLevel}
                            onChange={handleGradeLevelChange}
                            options={[
                                { value: 3, label: '3. Sınıf' },
                                { value: 4, label: '4. Sınıf' },
                                { value: 5, label: '5. Sınıf' },
                            ]}
                        />
                        <Select
                            label="Zorluk"
                            id="fractions-difficulty"
                            value={settings.difficulty}
                            onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                            options={[
                                { value: 'easy', label: 'Kolay (Paydalar Eşit)' },
                                { value: 'medium', label: 'Orta (Paydalar Farklı)' },
                                { value: 'hard', label: 'Zor (Bileşik/Tam Sayılı)' },
                            ]}
                        />
                        <Select
                            label="İşlem"
                            id="fractions-operation"
                            value={settings.operation}
                            onChange={e => handleSettingChange('operation', e.target.value as FractionsOperation)}
                            options={[
                                { value: FractionsOperation.Addition, label: 'Toplama' },
                                { value: FractionsOperation.Subtraction, label: 'Çıkarma' },
                                { value: FractionsOperation.Multiplication, label: 'Çarpma' },
                                { value: FractionsOperation.Division, label: 'Bölme' },
                                { value: FractionsOperation.Mixed, label: 'Karışık (Tümü)' },
                            ]}
                        />
                        <Select
                            label="Format"
                            id="fractions-format"
                            value={settings.format}
                            onChange={e => handleSettingChange('format', e.target.value as 'inline' | 'vertical-html')}
                            disabled={isWordProblemMode}
                            options={[
                                { value: 'inline', label: 'Yan Yana' },
                                { value: 'vertical-html', label: 'Alt Alta' },
                            ]}
                        />
                        <Select
                            label="Gösterim"
                            id="fractions-representation"
                            value={settings.representation}
                            onChange={e => handleSettingChange('representation', e.target.value)}
                            disabled={isWordProblemMode || settings.format === 'vertical-html'}
                            title={settings.format === 'vertical-html' ? "Bu özellik 'Alt Alta' formatında kullanılamaz." : ""}
                            options={[
                                { value: 'number', label: 'Rakamla' },
                                { value: 'word', label: 'Yazıyla' },
                                { value: 'mixed', label: 'Karışık' },
                            ]}
                        />
                         <div className="flex items-center pt-5">
                            {settings.difficulty === 'hard' && (
                                <Checkbox
                                    label="Tam Sayılı Kesir Kullan"
                                    id="use-mixed-numbers"
                                    checked={settings.useMixedNumbers ?? true}
                                    onChange={e => handleSettingChange('useMixedNumbers', e.target.checked)}
                                    disabled={isWordProblemMode}
                                />
                            )}
                        </div>
                    </>
                )}
                 {isFractionOfSet && (
                    <NumberInput
                        label="En Büyük Bütün Değeri"
                        id="max-set-size"
                        min={10}
                        max={200}
                        value={settings.maxSetSize}
                        onChange={e => handleSettingChange('maxSetSize', parseInt(e.target.value))}
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
                moduleKey="fractions"
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

export default FractionsModule;