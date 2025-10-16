import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateArithmeticProblem } from '../services/mathService';
import { generateContextualWordProblems } from '../services/geminiService';
import { Problem, ArithmeticSettings, ArithmeticOperation, CarryBorrowPreference, DivisionType } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { useToast } from '../services/ToastContext';
import { ShuffleIcon } from '../components/icons/Icons';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const ArithmeticModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
    const [settings, setSettings] = useState<ArithmeticSettings>({
        gradeLevel: 2,
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
        useVisuals: false,
    });
    const isInitialMount = useRef(true);
    
    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsLoading(true);
        try {
            let totalCount;
            if (settings.autoFit) {
                const problemsPerPage = calculateMaxProblems(contentRef, printSettings);
                totalCount = (problemsPerPage > 0 ? problemsPerPage : settings.problemsPerPage) * settings.pageCount;
            } else {
                totalCount = settings.problemsPerPage * settings.pageCount;
            }

            if (settings.useWordProblems) {
                const adjustedSettings = { ...settings, problemsPerPage: totalCount, pageCount: 1 };
                const problems = await generateContextualWordProblems('arithmetic', adjustedSettings);
                const opNames: { [key: string]: string } = { 'addition': 'Toplama', 'subtraction': 'Çıkarma', 'multiplication': 'Çarpma', 'division': 'Bölme', 'mixed-add-sub': 'Toplama ve Çıkarma' };
                const title = `Gerçek Hayat Problemleri - ${opNames[settings.operation]}`;
                onGenerate(problems, clearPrevious, title, 'arithmetic');
                addToast(`${problems.length} problem başarıyla oluşturuldu!`, 'success');
            } else {
                const results = Array.from({ length: totalCount }, () => generateArithmeticProblem(settings));
                
                const firstResultWithError = results.find(r => (r as any).error);

                if (firstResultWithError) {
                    addToast((firstResultWithError as any).error, 'error');
                } else if (results.length > 0) {
                    const problems = results.map(r => r.problem);
                    const title = results[0].title;
                    onGenerate(problems, clearPrevious, title, 'arithmetic');
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
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'arithmetic') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (settings.autoFit && lastGeneratorModule === 'arithmetic') {
            const handler = setTimeout(() => {
                handleGenerate(true);
            }, 300);

            return () => clearTimeout(handler);
        }
    }, [printSettings, settings.autoFit, lastGeneratorModule, handleGenerate]);


    const handleSettingChange = (field: keyof ArithmeticSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<ArithmeticSettings> = { gradeLevel: grade };

        switch (grade) {
            case 1:
                newSettings = { ...newSettings, digits1: 1, digits2: 1, carryBorrow: 'without', operation: ArithmeticOperation.Addition, hasThirdNumber: false };
                break;
            case 2:
                newSettings = { ...newSettings, digits1: 2, digits2: 2, carryBorrow: 'mixed', operation: ArithmeticOperation.MixedAdditionSubtraction };
                break;
            case 3:
                newSettings = { ...newSettings, digits1: 3, digits2: 2, operation: ArithmeticOperation.Multiplication };
                break;
            case 4:
                newSettings = { ...newSettings, digits1: 4, digits2: 3, operation: ArithmeticOperation.Division };
                break;
            case 5:
                newSettings = { ...newSettings, digits1: 5, digits2: 4, operation: ArithmeticOperation.Division };
                break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    useEffect(() => {
        if (settings.format === 'long-division-html' && settings.operation !== ArithmeticOperation.Division) {
            handleSettingChange('format', 'inline');
        }
    }, [settings.operation, settings.format]);
    
    const isAddSub = settings.operation === ArithmeticOperation.Addition || settings.operation === ArithmeticOperation.Subtraction || settings.operation === ArithmeticOperation.MixedAdditionSubtraction;
    const isLongDivision = settings.format === 'long-division-html';

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Dört İşlem Ayarları</h2>
            
            <div className="grid grid-cols-1 gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <Checkbox
                        label="Gerçek Hayat Problemleri (AI)"
                        id="use-word-problems"
                        checked={settings.useWordProblems}
                        onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                    />
                    {settings.useWordProblems && (
                        <div className="mt-4 pl-6 space-y-4">
                            <Select
                                label="Gereken İşlem Sayısı"
                                id="arithmetic-op-count"
                                value={settings.operationCount}
                                onChange={e => handleSettingChange('operationCount', parseInt(e.target.value, 10))}
                                options={[
                                    { value: 1, label: '1 İşlemli' },
                                    { value: 2, label: '2 İşlemli' },
                                    { value: 3, label: '3 İşlemli' },
                                ]}
                            />
                             <Checkbox
                                label="Görsel Destek Ekle (Emoji)"
                                id="use-visuals-word-problems"
                                checked={settings.useVisuals ?? false}
                                onChange={e => handleSettingChange('useVisuals', e.target.checked)}
                            />
                        </div>
                    )}
                </div>
                 <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                        label="Otomatik Sığdır"
                        id="auto-fit"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                    />
                </div>
            </div>


            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Sınıf Düzeyi"
                    id="arithmetic-grade-level"
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
                    ]}
                />
                <NumberInput 
                    label="1. Sayı Basamak"
                    id="digits1"
                    min={1} max={7}
                    value={settings.digits1}
                    onChange={e => handleSettingChange('digits1', parseInt(e.target.value))}
                />
                <NumberInput 
                    label="2. Sayı Basamak"
                    id="digits2"
                    min={1} max={7}
                    value={settings.digits2}
                    onChange={e => handleSettingChange('digits2', parseInt(e.target.value))}
                />
                {settings.hasThirdNumber && (
                    <NumberInput 
                        label="3. Sayı Basamak"
                        id="digits3"
                        min={1} max={7}
                        value={settings.digits3}
                        onChange={e => handleSettingChange('digits3', parseInt(e.target.value))}
                        disabled={settings.useWordProblems}
                    />
                )}
                 {isAddSub && (
                    <Select
                        label={settings.operation === 'addition' ? "Eldeli" : "Onluk Bozma"}
                        id="carryBorrow"
                        value={settings.carryBorrow}
                        onChange={e => handleSettingChange('carryBorrow', e.target.value as CarryBorrowPreference)}
                        disabled={settings.useWordProblems}
                        options={[
                            { value: 'mixed', label: 'Karışık' },
                            { value: 'with', label: 'Sadece Eldeli/Bozmalı' },
                            { value: 'without', label: 'Sadece Eldesiz/Bozmasız' },
                        ]}
                    />
                )}
                {settings.operation === ArithmeticOperation.Division && (
                    <Select
                        label="Bölme Türü"
                        id="divisionType"
                        value={settings.divisionType}
                        onChange={e => handleSettingChange('divisionType', e.target.value as DivisionType)}
                        disabled={settings.useWordProblems}
                        options={[
                            { value: 'mixed', label: 'Karışık' },
                            { value: 'with-remainder', label: 'Sadece Kalanlı' },
                            { value: 'without-remainder', label: 'Sadece Kalansız' },
                        ]}
                    />
                )}
                 <Select
                    label="Format"
                    id="format"
                    value={settings.format}
                    onChange={e => handleSettingChange('format', e.target.value)}
                    disabled={settings.useWordProblems}
                    title={settings.useWordProblems ? "Bu özellik AI modunda otomatik ayarlanır." : ""}
                    options={[
                        { value: 'inline', label: 'Yan Yana' },
                        { value: 'vertical-html', label: 'Alt Alta' },
                        ...(settings.operation === ArithmeticOperation.Division ? [{ value: 'long-division-html', label: 'Bölme Çatısı' }] : [])
                    ]}
                />
                <Select
                    label="Gösterim"
                    id="representation"
                    value={settings.representation}
                    onChange={e => handleSettingChange('representation', e.target.value)}
                    disabled={isLongDivision || settings.useWordProblems}
                    title={isLongDivision ? "Bu özellik 'Bölme Çatısı' formatında kullanılamaz." : ""}
                    options={[
                        { value: 'number', label: 'Rakamla' },
                        { value: 'word', label: 'Yazıyla' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
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
                <div className="flex items-center pt-5">
                    {isAddSub && (
                        <Checkbox
                            label="Üçüncü Sayı Ekle"
                            id="hasThirdNumber"
                            checked={settings.hasThirdNumber}
                            onChange={e => handleSettingChange('hasThirdNumber', e.target.checked)}
                            disabled={settings.useWordProblems}
                        />
                    )}
                </div>
            </div>
             <SettingsPresetManager 
                moduleKey="arithmetic"
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

export default ArithmeticModule;