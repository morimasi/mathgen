import React, { useState, useEffect, useCallback } from 'react';
import { generateArithmeticProblem } from '../services/mathService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, ArithmeticSettings, ArithmeticOperation, CarryBorrowPreference, DivisionType } from '../types';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { LoadingIcon } from '../components/icons/Icons';
import { TOPIC_SUGGESTIONS } from '../constants';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const ArithmeticModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<ArithmeticSettings>({
        operation: ArithmeticOperation.Addition,
        digits1: 2,
        digits2: 2,
        digits3: 2,
        hasThirdNumber: false,
        carryBorrow: 'mixed',
        divisionType: 'mixed',
        format: 'vertical-html',
        representation: 'number',
        problemsPerPage: 20,
        pageCount: 1,
        useWordProblems: false,
        operationCount: 1,
        autoFit: true,
        gradeLevel: 2,
        topic: '',
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
                problems = await generateContextualWordProblems('arithmetic', { ...settings, problemsPerPage: problemCount, pageCount: 1 });
                title = 'Sözel Problemler';
            } else {
                const results = Array.from({ length: problemCount }, () => generateArithmeticProblem(settings));
                if (results.some(r => r.error)) {
                    const error = results.find(r => r.error)?.error;
                    alert(error);
                }
                problems = results.map(r => r.problem);
                title = results.length > 0 ? results[0].title : '';
            }

            if (problems.length > 0) {
                onGenerate(problems, clearPrevious, title, 'arithmetic', settings.pageCount);
            }
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'arithmetic') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof ArithmeticSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Dört İşlem Ayarları</h2>
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="İşlem Türü"
                    id="operation"
                    value={settings.operation}
                    onChange={e => handleSettingChange('operation', e.target.value)}
                    options={[
                        { value: ArithmeticOperation.Addition, label: 'Toplama' },
                        { value: ArithmeticOperation.Subtraction, label: 'Çıkarma' },
                        { value: ArithmeticOperation.Multiplication, label: 'Çarpma' },
                        { value: ArithmeticOperation.Division, label: 'Bölme' },
                        { value: ArithmeticOperation.MixedAdditionSubtraction, label: 'Karışık (Toplama-Çıkarma)' },
                        { value: ArithmeticOperation.MixedAll, label: 'Karışık (Dört İşlem)' },
                    ]}
                />
                <Select
                    label="Format"
                    id="format"
                    value={settings.format}
                    onChange={e => handleSettingChange('format', e.target.value)}
                    options={[
                        { value: 'vertical-html', label: 'Alt Alta' },
                        { value: 'inline', label: 'Yan Yana' },
                        ...(settings.operation === 'division' ? [{ value: 'long-division-html', label: 'Bölme Çatısı' }] : []),
                    ]}
                />
                <NumberInput label="1. Sayı Basamak" id="digits1" min={1} max={7} value={settings.digits1} onChange={e => handleSettingChange('digits1', parseInt(e.target.value))} />
                <NumberInput label="2. Sayı Basamak" id="digits2" min={1} max={7} value={settings.digits2} onChange={e => handleSettingChange('digits2', parseInt(e.target.value))} />
                {settings.hasThirdNumber && <NumberInput label="3. Sayı Basamak" id="digits3" min={1} max={7} value={settings.digits3} onChange={e => handleSettingChange('digits3', parseInt(e.target.value))} />}
            </div>
             <Checkbox label="Üçüncü Sayı Ekle" id="has-third-number" checked={settings.hasThirdNumber} onChange={e => handleSettingChange('hasThirdNumber', e.target.checked)} />

            {(settings.operation === ArithmeticOperation.Addition || settings.operation === ArithmeticOperation.Subtraction || settings.operation === ArithmeticOperation.MixedAdditionSubtraction) && (
                <Select
                    label={settings.operation === ArithmeticOperation.Addition ? 'Eldeli Toplama' : 'Onluk Bozmalı Çıkarma'}
                    id="carry-borrow"
                    value={settings.carryBorrow}
                    onChange={e => handleSettingChange('carryBorrow', e.target.value as CarryBorrowPreference)}
                    options={[
                        { value: 'mixed', label: 'Karışık' },
                        { value: 'with', label: 'Sadece Gerektirenler' },
                        { value: 'without', label: 'Sadece Gerektirmeyenler' },
                    ]}
                />
            )}
             {settings.operation === ArithmeticOperation.Division && (
                <Select
                    label="Bölme Türü"
                    id="division-type"
                    value={settings.divisionType}
                    onChange={e => handleSettingChange('divisionType', e.target.value as DivisionType)}
                    options={[
                        { value: 'mixed', label: 'Karışık' },
                        { value: 'with-remainder', label: 'Kalanlı' },
                        { value: 'without-remainder', label: 'Kalansız' },
                    ]}
                />
            )}
            <Checkbox label="Gerçek Hayat Problemleri (AI)" id="use-word-problems" checked={settings.useWordProblems} onChange={e => handleSettingChange('useWordProblems', e.target.checked)} />
            {settings.useWordProblems && (
                 <Select
                    label="Problem Konusu"
                    id="word-problem-topic"
                    value={settings.topic}
                    onChange={(e) => handleSettingChange('topic', e.target.value)}
                    options={[{ value: '', label: 'Genel' }, ...TOPIC_SUGGESTIONS.map(s => ({ value: s, label: s }))]}
                />
            )}

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
                moduleKey="arithmetic"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default ArithmeticModule;
