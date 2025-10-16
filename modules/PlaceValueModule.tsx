import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { generatePlaceValueProblem } from '../services/placeValueService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, PlaceValueSettings, PlaceValueProblemType, RoundingPlace } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import { ShuffleIcon } from '../components/icons/Icons';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { useToast } from '../services/ToastContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const PlaceValueModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
    const [settings, setSettings] = useState<PlaceValueSettings>({
        gradeLevel: 2,
        type: PlaceValueProblemType.Identification,
        digits: 3,
        roundingPlace: 'auto',
        problemsPerPage: 20,
        pageCount: 1,
        useWordProblems: false,
        autoFit: true,
    });
    const isInitialMount = useRef(true);

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsLoading(true);
        try {
            let totalCount;
            if (settings.autoFit) {
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
                addToast(`${problems.length} problem başarıyla oluşturuldu!`, 'success');
            } else {
                const results = Array.from({ length: totalCount }, () => generatePlaceValueProblem(settings));
                
                const firstResultWithError = results.find(r => (r as any).error);
                if (firstResultWithError) {
                    addToast((firstResultWithError as any).error, 'error');
                } else if (results.length > 0) {
                    const problems = results.map(r => r.problem);
                    const title = results[0].title;
                    onGenerate(problems, clearPrevious, title, 'place-value', settings.pageCount);
                    addToast(`${problems.length} problem başarıyla oluşturuldu!`, 'success');
                }
            }
        } catch (error: any) {
            console.error(error);
            addToast(error.message || "Problem oluşturulurken bir hata oluştu.", 'error');
        }
        setIsLoading(false);
    }, [settings, printSettings, contentRef, onGenerate, setIsLoading, addToast]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'place-value') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule]);

    // Live update for auto-fit
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (settings.autoFit && lastGeneratorModule === 'place-value') {
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


    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Basamak Değeri Ayarları</h2>
            
            <div className="grid grid-cols-2 gap-4">
                {isWordProblemCompatible && (
                     <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Checkbox
                            label="Gerçek Hayat Problemleri (AI)"
                            id="use-word-problems-place-value"
                            checked={settings.useWordProblems}
                            onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                        />
                    </div>
                )}
                 <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                        label="Otomatik Sığdır"
                        id="auto-fit-place-value"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    disabled={settings.autoFit}
                />
                 <NumberInput 
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                />
            </div>
             <SettingsPresetManager 
                moduleKey="place-value"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
            <div className="flex flex-wrap gap-4 pt-4">
                <Button onClick={() => handleGenerate(true)}>Oluştur (Temizle)</Button>
                <Button onClick={() => handleGenerate(true)} variant="secondary" title="Ayarları koruyarak soruları yenile">
                    <ShuffleIcon className="w-5 h-5" />
                    Yenile
                </Button>
                <Button onClick={() => handleGenerate(false)} variant="secondary">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default PlaceValueModule;