import { ArithmeticSettings, ArithmeticOperation, CarryBorrowPreference, DivisionType, ModuleKey } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import Checkbox from '../components/form/Checkbox.tsx';
import TextInput from '../components/form/TextInput.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import { ShuffleIcon, MicrophoneIcon, MicrophoneOffIcon } from '../components/icons/Icons.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import React, { useState, useEffect, useRef } from 'react';
import { generateArithmeticProblem } from '../services/mathService.ts';
import { generateContextualWordProblems } from '../services/geminiService.ts';
import { TOPIC_SUGGESTIONS } from '../constants.ts';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';
import { useToast } from '../services/ToastContext.tsx';
import { parseSpokenMath } from '../services/utils.ts';
import { useWorksheet } from '../services/WorksheetContext.tsx';

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}


const ArithmeticModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const [isSpeechApiSupported, setIsSpeechApiSupported] = useState(true);
    
    const { allSettings, handleSettingsChange: setContextSettings } = useWorksheet();
    const settings = allSettings.arithmetic;
    const moduleKey: ModuleKey = 'arithmetic';

    const handleSettingChange = (field: keyof ArithmeticSettings, value: any) => {
        const newState: Partial<ArithmeticSettings> = { [field]: value };
        if (field === 'allowNegativeNumbers' && value === true) {
            newState.format = 'inline';
            newState.representation = 'number';
            newState.useVisuals = false;
            newState.hasThirdNumber = false;
            newState.useWordProblems = false;
        }
        setContextSettings(moduleKey, newState);
    };
    
    const { generate } = useProblemGenerator({
        moduleKey,
        settings,
        generatorFn: generateArithmeticProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: `Gerçek Hayat Problemleri - ${settings.topic || 'Dört İşlem'}`,
    });

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsSpeechApiSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'tr-TR';
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            const parsed = parseSpokenMath(transcript);
            if (parsed) {
                const opSymbols: {[key: string]: string} = { 'addition': '+', 'subtraction': '-', 'multiplication': '×', 'division': '÷' };
                addToast(`Anlaşıldı: ${parsed.n1} ${opSymbols[parsed.operation]} ${parsed.n2}`, 'info');
                generate(true, { 
                    n1: parsed.n1, 
                    n2: parsed.n2,
                    operationOverride: parsed.operation,
                    format: 'inline'
                } as Partial<ArithmeticSettings>);
            } else {
                addToast(`Anlaşılamadı: "${transcript}"`, 'warning');
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            addToast(`Ses tanıma hatası: ${event.error}`, 'error');
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, [generate, addToast]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error("Could not start recognition:", e);
                addToast("Ses tanıma başlatılamadı.", "error");
            }
        }
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
        setContextSettings(moduleKey, newSettings);
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
        if (settings.allowNegativeNumbers) return "Negatif sayılar etkinleştirildiğinde, işlemler yan yana formatında ve rakamlarla gösterilir. Eldeli/onluk bozma gibi ayarlar bu modda devre dışı bırakılır.";
        if (settings.useWordProblems) return "Yapay zeka ile daha yaratıcı problemler için 'Problem Konusu' alanını kullanın (örn: 'parkta geçen', 'uzay macerası'). 'Görsel Destek' seçeneği, problemlere konuyla ilgili emojiler ekler.";
        if (settings.operation === ArithmeticOperation.Division) return "'Bölme Çatısı' formatı, öğrencilerin bölme işlemini adım adım yapmaları için klasik bir görünüm sunar. 'Bölme Türü' ile sadece kalanlı veya kalansız problemler üretebilirsiniz.";
        if (isAddSub) return "'Sınıf Düzeyi' seçimi, basamak sayısı ve eldeli/onluk bozma gibi ayarları o sınıf seviyesine uygun olarak otomatik düzenler. Daha hassas kontrol için bu ayarları manuel olarak da değiştirebilirsiniz.";
        return "Bu modül, temel dört işlem alıştırmaları oluşturur. 'Sınıf Düzeyi' seçerek hızlıca başlayabilir veya tüm ayarları manuel olarak da düzenleyebilirsiniz. 'Sesli Komut' ile hızlıca tek bir problem oluşturabilirsiniz.";
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Dört İşlem Ayarları</h2>
                <HintButton text={getHintText()} />
                {isSpeechApiSupported && (
                    <Button onClick={toggleListening} variant={isListening ? 'danger' : 'secondary'} size="sm" className="ml-auto !px-2" title="Sesli Komut">
                        {isListening ? <MicrophoneOffIcon className="w-4 h-4" /> : <MicrophoneIcon className="w-4 h-4" />}
                        <span className="hidden sm:inline">{isListening ? 'Durdur' : 'Sesli Komut'}</span>
                    </Button>
                )}
            </div>

            {isListening && <p className="text-sm text-accent-text animate-pulse text-center p-2 bg-accent-bg/20 rounded-md">Dinleniyor... "Beş artı üç" gibi bir komut söyleyin.</p>}
            
            <div className="space-y-2">
                <details className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg" open={settings.useWordProblems}>
                    <summary className="text-xs font-semibold cursor-pointer select-none">Gerçek Hayat Problemleri (AI)</summary>
                    <div className="mt-2 pl-4 space-y-1.5">
                        <Checkbox label="Yapay Zeka ile Problem Oluştur" id="use-word-problems" checked={settings.useWordProblems} onChange={e => handleSettingChange('useWordProblems', e.target.checked)} disabled={settings.allowNegativeNumbers} />
                        <Select label="Gereken İşlem Sayısı" id="arithmetic-op-count" value={settings.operationCount} onChange={e => handleSettingChange('operationCount', parseInt(e.target.value, 10))} options={[{ value: 1, label: '1 İşlemli' },{ value: 2, label: '2 İşlemli' },{ value: 3, label: '3 İşlemli' }]}/>
                        <div className="relative">
                            <TextInput label="Problem Konusu (İsteğe bağlı)" id="arithmetic-topic" value={settings.topic || ''} onChange={e => handleSettingChange('topic', e.target.value)} placeholder="Örn: Market, Park, Oyuncaklar" className="pr-9"/>
                            <button type="button" onClick={handleRandomTopic} className="absolute right-2 bottom-[3px] text-stone-500 hover:text-accent-text dark:text-stone-400 dark:hover:text-accent-text transition-colors" title="Rastgele Konu Öner"><ShuffleIcon className="w-4 h-4" /></button>
                        </div>
                        <Checkbox label="Görsel Destek Ekle (Emoji)" id="use-visuals-word-problems" checked={settings.useVisuals ?? false} onChange={e => handleSettingChange('useVisuals', e.target.checked)}/>
                    </div>
                </details>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5">
                    <Select label="Sınıf Düzeyi" id="arithmetic-grade-level" value={settings.gradeLevel} onChange={handleGradeLevelChange} options={[{ value: 1, label: '1. Sınıf' },{ value: 2, label: '2. Sınıf' },{ value: 3, label: '3. Sınıf' },{ value: 4, label: '4. Sınıf' },{ value: 5, label: '5. Sınıf' }]}/>
                    <Select label="İşlem Türü" id="operation" value={settings.operation} onChange={e => handleSettingChange('operation', e.target.value)} options={[{ value: ArithmeticOperation.Addition, label: 'Toplama' },{ value: ArithmeticOperation.Subtraction, label: 'Çıkarma' },{ value: ArithmeticOperation.Multiplication, label: 'Çarpma' },{ value: ArithmeticOperation.Division, label: 'Bölme' },{ value: ArithmeticOperation.MixedAdditionSubtraction, label: 'Karışık (Toplama-Çıkarma)' },{ value: ArithmeticOperation.MixedAll, label: 'Karışık (Tümü)' }]}/>
                </div>
                
                <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg">
                    <summary className="text-xs font-semibold cursor-pointer select-none">Sayı ve İşlem Detayları</summary>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5 mt-2">
                        <NumberInput label="1. Sayı Basamak" id="digits1" min={1} max={7} value={settings.digits1} onChange={e => handleSettingChange('digits1', parseInt(e.target.value))} disabled={settings.allowNegativeNumbers} />
                        <NumberInput label="2. Sayı Basamak" id="digits2" min={1} max={7} value={settings.digits2} onChange={e => handleSettingChange('digits2', parseInt(e.target.value))} disabled={settings.allowNegativeNumbers} />
                        {settings.hasThirdNumber && <NumberInput label="3. Sayı Basamak" id="digits3" min={1} max={7} value={settings.digits3} onChange={e => handleSettingChange('digits3', parseInt(e.target.value))} disabled={settings.useWordProblems || settings.allowNegativeNumbers}/>}
                        {isAddSub && <Select label={settings.operation === 'addition' ? "Eldeli" : "Onluk Bozma"} id="carryBorrow" value={settings.carryBorrow} onChange={e => handleSettingChange('carryBorrow', e.target.value as CarryBorrowPreference)} disabled={settings.useWordProblems || settings.allowNegativeNumbers} options={[{ value: 'mixed', label: 'Karışık' },{ value: 'with', label: 'Sadece Eldeli/Bozmalı' },{ value: 'without', label: 'Sadece Eldesiz/Bozmasız' }]}/>}
                        {settings.operation === ArithmeticOperation.Division && <Select label="Bölme Türü" id="divisionType" value={settings.divisionType} onChange={e => handleSettingChange('divisionType', e.target.value as DivisionType)} disabled={settings.useWordProblems || settings.allowNegativeNumbers} options={[{ value: 'mixed', label: 'Karışık' },{ value: 'with-remainder', label: 'Sadece Kalanlı' },{ value: 'without-remainder', label: 'Sadece Kalansız' }]}/>}
                    </div>
                </details>

                <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg">
                    <summary className="text-xs font-semibold cursor-pointer select-none">Gelişmiş Ayarlar</summary>
                    <div className="mt-2 pl-2">
                        <Checkbox 
                            label="Negatif Sayılara İzin Ver" 
                            id="allow-negative-numbers" 
                            checked={settings.allowNegativeNumbers} 
                            onChange={e => handleSettingChange('allowNegativeNumbers', e.target.checked)}
                        />
                    </div>
                </details>

                <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg">
                    <summary className="text-xs font-semibold cursor-pointer select-none">Format ve Gösterim</summary>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5 mt-2">
                        <Select label="Format" id="format" value={settings.format} onChange={e => handleSettingChange('format', e.target.value)} disabled={settings.useWordProblems || settings.allowNegativeNumbers} title={settings.useWordProblems ? "Bu özellik AI modunda otomatik ayarlanır." : ""} options={[{ value: 'inline', label: 'Yan Yana' },{ value: 'vertical-html', label: 'Alt Alta' }, ...(settings.operation === ArithmeticOperation.Division ? [{ value: 'long-division-html', label: 'Bölme Çatısı' }] : [])]}/>
                        <Select label="Gösterim" id="representation" value={settings.representation} onChange={e => handleSettingChange('representation', e.target.value)} disabled={isLongDivision || settings.useWordProblems || settings.allowNegativeNumbers} title={isLongDivision ? "Bu özellik 'Bölme Çatısı' formatında kullanılamaz." : ""} options={[{ value: 'number', label: 'Rakamla' },{ value: 'word', label: 'Yazıyla' },{ value: 'mixed', label: 'Karışık' }]}/>
                         <div className="flex items-center pt-3 col-span-2 gap-4">
                            {isAddSub && <Checkbox label="Üçüncü Sayı Ekle" id="hasThirdNumber" checked={settings.hasThirdNumber} onChange={e => handleSettingChange('hasThirdNumber', e.target.checked)} disabled={settings.useWordProblems || settings.allowNegativeNumbers}/>}
                            <Checkbox label="Görsel Destek (Nokta)" id="use-visual-dots" checked={settings.useVisuals} onChange={e => handleSettingChange('useVisuals', e.target.checked)} disabled={settings.format !== 'vertical-html' || settings.useWordProblems || settings.allowNegativeNumbers} title={settings.format !== 'vertical-html' ? "Sadece 'Alt Alta' formatında kullanılabilir." : ""} />
                        </div>
                    </div>
                </details>
                
                <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg" open>
                    <summary className="text-xs font-semibold cursor-pointer select-none">Sayfa Düzeni</summary>
                    <div className="mt-2 space-y-2">
                        <Checkbox label="Otomatik Sığdır" id="autoFit-arithmetic" checked={settings.autoFit} onChange={e => handleSettingChange('autoFit', e.target.checked)} disabled={isTableLayout} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
                            <NumberInput label="Sayfa Başına Problem Sayısı" id="problems-per-page" min={1} max={100} value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))} disabled={isTableLayout || settings.autoFit} title={isTableLayout ? "Tablo modunda problem sayısı satır ve sütun sayısına göre belirlenir." : ""}/>
                            <NumberInput label="Sayfa Sayısı" id="page-count" min={1} max={20} value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))} disabled={isTableLayout} title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}/>
                        </div>
                    </div>
                </details>
            </div>
             <SettingsPresetManager moduleKey="arithmetic" currentSettings={settings} onLoadSettings={(s) => setContextSettings(moduleKey, s)}/>
            <div className="flex flex-wrap gap-2 pt-1.5">
                <Button onClick={() => generate(true)} size="sm" enableFlyingLadybug>Oluştur</Button>
                <Button onClick={() => generate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default ArithmeticModule;