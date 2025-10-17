import { ArithmeticSettings, ArithmeticOperation, CarryBorrowPreference, DivisionType } from '../types';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import TextInput from '../components/form/TextInput';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { ShuffleIcon } from '../components/icons/Icons';
import SettingsPresetManager from '../components/SettingsPresetManager';
import React, { useState, useEffect } from 'react';
import { generateArithmeticProblem } from '../services/mathService';
import { generateContextualWordProblems } from '../services/geminiService';
import { TOPIC_SUGGESTIONS } from '../constants';
import HintButton from '../components/HintButton';
import { useProblemGenerator } from '../hooks/useProblemGenerator';

const ArithmeticModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
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
        useVisuals: false, // Changed to boolean
        topic: '',
    });
    
    const { generate } = useProblemGenerator({
        moduleKey: 'arithmetic',
        settings,
        generatorFn: generateArithmeticProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: `Gerçek Hayat Problemleri - ${settings.topic || 'Dört İşlem'}`,
    });

    const handleSettingChange = (field: keyof ArithmeticSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<ArithmeticSettings> = { gradeLevel: grade };

        switch (grade) {
            case 1: newSettings = { ...newSettings, digits1: 1, digits2: 1, carryBorrow: 'without', operation: ArithmeticOperation.Addition, hasThirdNumber: false }; break;
            case 2: newSettings = { ...newSettings, digits1: 2, digits2: 2, carryBorrow: 'mixed', operation: ArithmeticOperation.MixedAdditionSubtraction }; break;
            case 3: newSettings = { ...newSettings, digits1: 3, digits2: 2, operation: ArithmeticOperation.Multiplication }; break;
            case 4: newSettings = { ...newSettings, digits1: 4, digits2: 3, operation: ArithmeticOperation.Division }; break;
            case 5: newSettings = { ...newSettings, digits1: 5, digits2: 4, operation: ArithmeticOperation.MixedAll }; break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    useEffect(() => {
        if (settings.format === 'long-division-html' && settings.operation !== ArithmeticOperation.Division) {
            handleSettingChange('format', 'inline');
        }
    }, [settings.operation, settings.format]);
    
    const isAddSub = [ArithmeticOperation.Addition, ArithmeticOperation.Subtraction, ArithmeticOperation.MixedAdditionSubtraction].includes(settings.operation);
    const isLongDivision = settings.format === 'long-division-html';
    const isTableLayout = printSettings.layoutMode === 'table';
    
    const getHintText = () => {
        if (settings.useWordProblems) return "Yapay zeka ile daha yaratıcı problemler için 'Problem Konusu' alanını kullanın (örn: 'parkta geçen', 'uzay macerası'). 'Görsel Destek' seçeneği, problemlere konuyla ilgili emojiler ekler.";
        if (settings.operation === ArithmeticOperation.Division) return "'Bölme Çatısı' formatı, öğrencilerin bölme işlemini adım adım yapmaları için klasik bir görünüm sunar. 'Bölme Türü' ile sadece kalanlı veya kalansız problemler üretebilirsiniz.";
        if (isAddSub) return "'Sınıf Düzeyi' seçimi, basamak sayısı ve eldeli/onluk bozma gibi ayarları o sınıf seviyesine uygun olarak otomatik düzenler. Daha hassas kontrol için bu ayarları manuel olarak da değiştirebilirsiniz.";
        return "Bu modül, temel dört işlem alıştırmaları oluşturur. 'Sınıf Düzeyi' seçerek hızlıca başlayabilir veya tüm ayarları manuel olarak da düzenleyebilirsiniz.";
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Dört İşlem Ayarları</h2>
                <HintButton text={getHintText()} />
            </div>
            
            <div className="space-y-2">
                <details className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg" open={settings.useWordProblems}>
                    <summary className="text-xs font-semibold cursor-pointer select-none">Gerçek Hayat Problemleri (AI)</summary>
                    <div className="mt-2 pl-4 space-y-1.5">
                        <Checkbox label="Yapay Zeka ile Problem Oluştur" id="use-word-problems" checked={settings.useWordProblems} onChange={e => handleSettingChange('useWordProblems', e.target.checked)}/>
                        <Select label="Gereken İşlem Sayısı" id="arithmetic-op-count" value={settings.operationCount} onChange={e => handleSettingChange('operationCount', parseInt(e.target.value, 10))} options={[{ value: 1, label: '1 İşlemli' },{ value: 2, label: '2 İşlemli' },{ value: 3, label: '3 İşlemli' }]}/>
                        <div className="relative">
                            <TextInput label="Problem Konusu (İsteğe bağlı)" id="arithmetic-topic" value={settings.topic || ''} onChange={e => handleSettingChange('topic', e.target.value)} placeholder="Örn: Market, Park, Oyuncaklar" className="pr-9"/>
                            <button type="button" onClick={handleRandomTopic} className="absolute right-2 bottom-[3px] text-stone-500 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors" title="Rastgele Konu Öner"><ShuffleIcon className="w-4 h-4" /></button>
                        </div>
                        <Checkbox label="Görsel Destek Ekle (Emoji)" id="use-visuals-word-problems" checked={settings.useVisuals ?? false} onChange={e => handleSettingChange('useVisuals', e.target.checked)}/>
                    </div>
                </details>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                    <Select label="Sınıf Düzeyi" id="arithmetic-grade-level" value={settings.gradeLevel} onChange={handleGradeLevelChange} options={[{ value: 1, label: '1. Sınıf' },{ value: 2, label: '2. Sınıf' },{ value: 3, label: '3. Sınıf' },{ value: 4, label: '4. Sınıf' },{ value: 5, label: '5. Sınıf' }]}/>
                    <Select label="İşlem Türü" id="operation" value={settings.operation} onChange={e => handleSettingChange('operation', e.target.value)} options={[{ value: ArithmeticOperation.Addition, label: 'Toplama' },{ value: ArithmeticOperation.Subtraction, label: 'Çıkarma' },{ value: ArithmeticOperation.Multiplication, label: 'Çarpma' },{ value: ArithmeticOperation.Division, label: 'Bölme' },{ value: ArithmeticOperation.MixedAdditionSubtraction, label: 'Karışık (Toplama-Çıkarma)' },{ value: ArithmeticOperation.MixedAll, label: 'Karışık (Tümü)' }]}/>
                </div>
                
                <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg">
                    <summary className="text-xs font-semibold cursor-pointer select-none">Sayı ve İşlem Detayları</summary>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2">
                        <NumberInput label="1. Sayı Basamak" id="digits1" min={1} max={7} value={settings.digits1} onChange={e => handleSettingChange('digits1', parseInt(e.target.value))}/>
                        <NumberInput label="2. Sayı Basamak" id="digits2" min={1} max={7} value={settings.digits2} onChange={e => handleSettingChange('digits2', parseInt(e.target.value))}/>
                        {settings.hasThirdNumber && <NumberInput label="3. Sayı Basamak" id="digits3" min={1} max={7} value={settings.digits3} onChange={e => handleSettingChange('digits3', parseInt(e.target.value))} disabled={settings.useWordProblems}/>}
                        {isAddSub && <Select label={settings.operation === 'addition' ? "Eldeli" : "Onluk Bozma"} id="carryBorrow" value={settings.carryBorrow} onChange={e => handleSettingChange('carryBorrow', e.target.value as CarryBorrowPreference)} disabled={settings.useWordProblems} options={[{ value: 'mixed', label: 'Karışık' },{ value: 'with', label: 'Sadece Eldeli/Bozmalı' },{ value: 'without', label: 'Sadece Eldesiz/Bozmasız' }]}/>}
                        {settings.operation === ArithmeticOperation.Division && <Select label="Bölme Türü" id="divisionType" value={settings.divisionType} onChange={e => handleSettingChange('divisionType', e.target.value as DivisionType)} disabled={settings.useWordProblems} options={[{ value: 'mixed', label: 'Karışık' },{ value: 'with-remainder', label: 'Sadece Kalanlı' },{ value: 'without-remainder', label: 'Sadece Kalansız' }]}/>}
                    </div>
                </details>

                <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg">
                    <summary className="text-xs font-semibold cursor-pointer select-none">Format ve Gösterim</summary>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2">
                        <Select label="Format" id="format" value={settings.format} onChange={e => handleSettingChange('format', e.target.value)} disabled={settings.useWordProblems} title={settings.useWordProblems ? "Bu özellik AI modunda otomatik ayarlanır." : ""} options={[{ value: 'inline', label: 'Yan Yana' },{ value: 'vertical-html', label: 'Alt Alta' }, ...(settings.operation === ArithmeticOperation.Division ? [{ value: 'long-division-html', label: 'Bölme Çatısı' }] : [])]}/>
                        <Select label="Gösterim" id="representation" value={settings.representation} onChange={e => handleSettingChange('representation', e.target.value)} disabled={isLongDivision || settings.useWordProblems} title={isLongDivision ? "Bu özellik 'Bölme Çatısı' formatında kullanılamaz." : ""} options={[{ value: 'number', label: 'Rakamla' },{ value: 'word', label: 'Yazıyla' },{ value: 'mixed', label: 'Karışık' }]}/>
                         <div className="flex items-center pt-3 col-span-2 gap-4">
                            {isAddSub && <Checkbox label="Üçüncü Sayı Ekle" id="hasThirdNumber" checked={settings.hasThirdNumber} onChange={e => handleSettingChange('hasThirdNumber', e.target.checked)} disabled={settings.useWordProblems}/>}
                            <Checkbox label="Görsel Destek (Nokta)" id="use-visual-dots" checked={settings.useVisuals} onChange={e => handleSettingChange('useVisuals', e.target.checked)} disabled={settings.format !== 'vertical-html' || settings.useWordProblems} title={settings.format !== 'vertical-html' ? "Sadece 'Alt Alta' formatında kullanılabilir." : ""} />
                        </div>
                    </div>
                </details>
                
                <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg">
                    <summary className="text-xs font-semibold cursor-pointer select-none">Sayfa Düzeni</summary>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2">
                         <div className="p-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg col-span-2">
                            <Checkbox label="Otomatik Sığdır" id="auto-fit" checked={settings.autoFit} onChange={e => handleSettingChange('autoFit', e.target.checked)} disabled={isTableLayout} title={isTableLayout ? "Tablo modunda bu ayar devre dışıdır." : ""}/>
                        </div>
                        <NumberInput label="Sayfa Başına Problem Sayısı" id="problems-per-page" min={1} max={100} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={settings.autoFit || isTableLayout} title={isTableLayout ? "Tablo modunda problem sayısı satır ve sütun sayısına göre belirlenir." : ""}/>
                        <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={isTableLayout} title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}/>
                    </div>
                </details>
            </div>
             <SettingsPresetManager moduleKey="arithmetic" currentSettings={settings} onLoadSettings={setSettings}/>
            <div className="flex flex-wrap gap-2 pt-1.5">
                <Button onClick={() => generate(true)} size="sm" enableFlyingLadybug>Oluştur</Button>
                <Button onClick={() => generate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default ArithmeticModule;