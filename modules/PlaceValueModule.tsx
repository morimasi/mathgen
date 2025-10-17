import React, { useState, useEffect, useCallback } from 'react';
import { generatePlaceValueProblem } from '../services/placeValueService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, PlaceValueSettings, PlaceValueProblemType, RoundingPlace } from '../types';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { LoadingIcon } from '../components/icons/Icons';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const PlaceValueModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<PlaceValueSettings>({
        type: PlaceValueProblemType.Identification,
        digits: 3,
        roundingPlace: 'auto',
        problemsPerPage: 20,
        pageCount: 1,
        autoFit: true,
        useWordProblems: false,
        gradeLevel: 3,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const { settings: printSettings } = usePrintSettings();

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsGenerating(true);
        setIsLoading(true);
        try {
            let problems: Problem[] = [];
            let title = '';

            const problemCount = settings.autoFit
                ? calculateMaxProblems(contentRef, printSettings)
                : settings.problemsPerPage * settings.pageCount;

            if (settings.useWordProblems) {
                problems = await generateContextualWordProblems('place-value', { ...settings, problemsPerPage: problemCount, pageCount: 1 });
                title = 'Basamak Değeri Problemleri (AI)';
            } else {
                const results = Array.from({ length: problemCount }, () => generatePlaceValueProblem(settings));
                 if (results.some(r => r.error)) {
                    const error = results.find(r => r.error)?.error;
                    alert(error);
                }
                problems = results.map(r => r.problem);
                title = results.length > 0 ? results[0].title : '';
            }
            
            if (problems.length > 0) {
                onGenerate(problems, clearPrevious, title, 'place-value', settings.pageCount);
            }
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'place-value') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof PlaceValueSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basamak Değeri Ayarları</h2>
            <Select
                label="Problem Türü"
                id="place-value-type"
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
            <NumberInput label="Basamak Sayısı" id="digits" min={1} max={7} value={settings.digits} onChange={e => handleSettingChange('digits', parseInt(e.target.value))} />
            {settings.type === PlaceValueProblemType.Rounding && (
                <Select
                    label="Yuvarlanacak Basamak"
                    id="rounding-place"
                    value={settings.roundingPlace}
                    onChange={e => handleSettingChange('roundingPlace', e.target.value as RoundingPlace)}
                    options={[
                        { value: 'auto', label: 'Rastgele' },
                        { value: 'tens', label: 'Onlar Basamağı' },
                        { value: 'hundreds', label: 'Yüzler Basamağı' },
                        { value: 'thousands', label: 'Binler Basamağı' },
                    ]}
                />
            )}
            <Checkbox label="Gerçek Hayat Problemleri (AI)" id="use-word-problems" checked={settings.useWordProblems} onChange={e => handleSettingChange('useWordProblems', e.target.checked)} />
            <div className="grid grid-cols-2 gap-4">
                <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={settings.autoFit} />
                <NumberInput label="Problem Sayısı" id="problems-per-page" min={1} max={100} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={settings.autoFit} />
            </div>
            <Checkbox label="Otomatik Sığdır" id="auto-fit" checked={settings.autoFit} onChange={e => handleSettingChange('autoFit', e.target.checked)} />
            <Button onClick={() => handleGenerate(true)} className="w-full" disabled={isGenerating}>
                {isGenerating && <LoadingIcon className="w-5 h-5" />}
                Oluştur
            </Button>
            <SettingsPresetManager
                moduleKey="place-value"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default PlaceValueModule;
