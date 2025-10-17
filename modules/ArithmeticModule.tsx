
import React, { useState } from 'react';
import { ArithmeticSettings, ArithmeticOperation, CarryBorrowPreference, DivisionType } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateArithmeticProblem } from '../services/mathService';
import { generateContextualWordProblems } from '../services/geminiService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { TOPIC_SUGGESTIONS } from '../constants';
import TextInput from '../components/form/TextInput';

const initialSettings: ArithmeticSettings = {
    gradeLevel: 1,
    operation: ArithmeticOperation.Addition,
    digits1: 2,
    digits2: 2,
    digits3: 2,
    hasThirdNumber: false,
    carryBorrow: 'mixed',
    divisionType: 'mixed',
    format: 'inline',
    representation: 'number',
    problemsPerPage: 20,
    pageCount: 1,
    useWordProblems: false,
    operationCount: 1,
    useVisuals: false,
    topic: '',
    autoFit: true,
};

const ArithmeticModule: React.FC = () => {
    const [settings, setSettings] = useState<ArithmeticSettings>(initialSettings);
    
    const { generate } = useProblemGenerator({
        moduleKey: 'arithmetic',
        settings,
        generatorFn: generateArithmeticProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: "Gerçek Hayat Problemleri (Dört İşlem)",
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    const isAdditionOrSubtraction = settings.operation === ArithmeticOperation.Addition || settings.operation === ArithmeticOperation.Subtraction;
    const isDivision = settings.operation === ArithmeticOperation.Division;

    return (
        <div className="space-y-4">
            <Checkbox
                label="Gerçek Hayat Problemleri (AI)"
                id="arithmetic-useWordProblems"
                checked={settings.useWordProblems}
                onChange={e => setSettings({ ...settings, useWordProblems: e.target.checked })}
            />

            {settings.useWordProblems && (
                 <div className="p-2 border rounded-md bg-stone-50 dark:bg-stone-700/50 space-y-2">
                    <TextInput
                        label="Problem Konusu"
                        id="arithmetic-topic"
                        list="topic-suggestions"
                        value={settings.topic}
                        onChange={e => setSettings({ ...settings, topic: e.target.value })}
                        placeholder="Örn: Market Alışverişi"
                    />
                    <datalist id="topic-suggestions">
                        {TOPIC_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                    </datalist>
                    <Checkbox
                        label="Görsel Destek (Emoji)"
                        id="arithmetic-useVisuals"
                        checked={settings.useVisuals}
                        onChange={e => setSettings({ ...settings, useVisuals: e.target.checked })}
                    />
                 </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="İşlem Türü"
                    id="arithmetic-operation"
                    value={settings.operation}
                    onChange={e => setSettings({ ...settings, operation: e.target.value as ArithmeticOperation })}
                    options={[
                        { value: ArithmeticOperation.Addition, label: 'Toplama' },
                        { value: ArithmeticOperation.Subtraction, label: 'Çıkarma' },
                        { value: ArithmeticOperation.Multiplication, label: 'Çarpma' },
                        { value: ArithmeticOperation.Division, label: 'Bölme' },
                        { value: ArithmeticOperation.MixedAdditionSubtraction, label: 'Toplama & Çıkarma Karışık' },
                        { value: ArithmeticOperation.MixedAll, label: 'Dört İşlem Karışık' },
                    ]}
                    containerClassName="col-span-2"
                />
                
                <NumberInput label="1. Sayı Basamak" id="arithmetic-digits1" value={settings.digits1} onChange={e => setSettings({...settings, digits1: parseInt(e.target.value, 10)})} min={1} max={7} />
                <NumberInput label="2. Sayı Basamak" id="arithmetic-digits2" value={settings.digits2} onChange={e => setSettings({...settings, digits2: parseInt(e.target.value, 10)})} min={1} max={7} />
                
                {isAdditionOrSubtraction && (
                    <Checkbox
                        label="Üçüncü Sayı Ekle"
                        id="arithmetic-hasThirdNumber"
                        checked={settings.hasThirdNumber}
                        onChange={e => setSettings({ ...settings, hasThirdNumber: e.target.checked })}
                    />
                )}
                 {settings.hasThirdNumber && isAdditionOrSubtraction && (
                     <NumberInput label="3. Sayı Basamak" id="arithmetic-digits3" value={settings.digits3} onChange={e => setSettings({...settings, digits3: parseInt(e.target.value, 10)})} min={1} max={7} />
                 )}

                {isAdditionOrSubtraction && (
                    <Select
                        label="Eldeli / Onluk Bozma"
                        id="arithmetic-carryBorrow"
                        value={settings.carryBorrow}
                        onChange={e => setSettings({ ...settings, carryBorrow: e.target.value as CarryBorrowPreference })}
                        options={[
                            { value: 'mixed', label: 'Karışık' },
                            { value: 'with', label: 'Gerektiren' },
                            { value: 'without', label: 'Gerektirmeyen' },
                        ]}
                        containerClassName="col-span-2"
                    />
                )}
                
                {isDivision && (
                    <Select
                        label="Bölme Türü"
                        id="arithmetic-divisionType"
                        value={settings.divisionType}
                        onChange={e => setSettings({ ...settings, divisionType: e.target.value as DivisionType })}
                        options={[
                            { value: 'mixed', label: 'Karışık' },
                            { value: 'with-remainder', label: 'Kalanlı' },
                            { value: 'without-remainder', label: 'Kalansız' },
                        ]}
                        containerClassName="col-span-2"
                    />
                )}

                {!settings.useWordProblems && (
                <div className="col-span-2 grid grid-cols-2 gap-4">
                     <Select
                        label="Format"
                        id="arithmetic-format"
                        value={settings.format}
                        onChange={e => setSettings({ ...settings, format: e.target.value as any })}
                        options={[
                            { value: 'inline', label: 'Yan Yana' },
                            { value: 'vertical-html', label: 'Alt Alta' },
                            ...(isDivision ? [{ value: 'long-division-html', label: 'Bölme Çatısı' }] : [])
                        ]}
                    />
                     <Select
                        label="Gösterim"
                        id="arithmetic-representation"
                        value={settings.representation}
                        onChange={e => setSettings({ ...settings, representation: e.target.value as any })}
                        options={[
                            { value: 'number', label: 'Rakamla' },
                            { value: 'word', label: 'Yazıyla' },
                            { value: 'mixed', label: 'Karışık' },
                        ]}
                    />
                </div>
                )}
                
                 <Checkbox
                    label="Otomatik Sığdır"
                    id="arithmetic-autofit"
                    checked={settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>
             {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="arithmetic-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={100}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="arithmetic-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}
            
            <SettingsPresetManager<ArithmeticSettings>
                moduleKey="arithmetic"
                currentSettings={settings}
                onLoadSettings={setSettings}
                initialSettings={initialSettings}
            />

            <Button onClick={handleGenerateClick} className="w-full" enableFlyingLadybug>
                Çalışma Kağıdı Oluştur
            </Button>
        </div>
    );
};

export default ArithmeticModule;
