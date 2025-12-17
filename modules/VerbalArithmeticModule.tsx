
import React, { useState, useCallback } from 'react';
// FIX: Add .ts extension to import path
import { generateReadinessProblem } from '../services/readinessService.ts';
import { VerbalArithmeticSettings, VerbalArithmeticActivityType, Difficulty } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import Checkbox from '../components/form/Checkbox.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

const VerbalArithmeticModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<VerbalArithmeticSettings>({
        activityType: VerbalArithmeticActivityType.WriteAsWords,
        operation: 'mixed',
        difficulty: 'medium',
        maxResult: 20,
        problemsPerPage: 10,
        pageCount: 1,
        autoFit: false,
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'verbal-arithmetic',
        settings,
        generatorFn: (s) => generateReadinessProblem('verbal-arithmetic', s),
    });

    const handleSettingChange = (field: keyof VerbalArithmeticSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const isTableLayout = printSettings.layoutMode === 'table';

    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    const getHintText = () => {
        switch (settings.activityType) {
            case VerbalArithmeticActivityType.WriteAsWords:
                return "Klasik mod: '5 + 3 = ?' işlemini verir, öğrenciden 'Beş ile üçün toplamı...' gibi bir ifade yazması istenir.";
            case VerbalArithmeticActivityType.WriteAsMath:
                return "Tersine mod: '3'ün 5 fazlası kaçtır?' ifadesini verir, öğrenciden '3 + 5' işlemini yazıp çözmesi istenir.";
            case VerbalArithmeticActivityType.Matching:
                return "Sol sütunda matematiksel işlemler (örn: 3 + 2), sağ sütunda sözel ifadeler yer alır. Öğrenci bunları eşleştirir.";
            case VerbalArithmeticActivityType.FillInTheBlank:
                return "Cümledeki eksik matematiksel terimi buldurur. Örn: '5 ..... 3 = 8' (artı/eksi/çarpı).";
            default:
                return "Bu modül, matematiksel semboller ile sözel ifadeler arasındaki ilişkiyi güçlendirir.";
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">İşlemi Sözel İfade Etme</h2>
                <HintButton text={getHintText()} />
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <Select
                    label="Etkinlik Türü"
                    id="va-activity-type"
                    value={settings.activityType}
                    onChange={e => handleSettingChange('activityType', e.target.value as VerbalArithmeticActivityType)}
                    options={[
                        { value: VerbalArithmeticActivityType.WriteAsWords, label: 'İşlemi Yazıya Dökme' },
                        { value: VerbalArithmeticActivityType.WriteAsMath, label: 'İfadeyi İşleme Dökme' },
                        { value: VerbalArithmeticActivityType.Matching, label: 'Eşleştirme' },
                        { value: VerbalArithmeticActivityType.FillInTheBlank, label: 'Boşluk Doldurma' },
                    ]}
                    containerClassName="col-span-2"
                />
                
                <Select
                    label="İşlem"
                    id="va-operation"
                    value={settings.operation}
                    onChange={e => handleSettingChange('operation', e.target.value as any)}
                    options={[
                        { value: 'addition', label: 'Toplama' },
                        { value: 'subtraction', label: 'Çıkarma' },
                        { value: 'multiplication', label: 'Çarpma' },
                        { value: 'division', label: 'Bölme' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />

                <Select
                    label="Zorluk (İfade Biçimi)"
                    id="va-difficulty"
                    value={settings.difficulty}
                    onChange={e => handleSettingChange('difficulty', e.target.value as Difficulty)}
                    options={[
                        { value: 'easy', label: 'Kolay (Artı/Eksi)' },
                        { value: 'medium', label: 'Orta (Toplam/Fark)' },
                        { value: 'hard', label: 'Zor (Fazlası/Eksiği)' },
                    ]}
                />

                 <NumberInput 
                    label="En Büyük Sonuç"
                    id="va-max-result"
                    min={5} max={1000}
                    value={settings.maxResult}
                    onChange={e => handleSettingChange('maxResult', parseInt(e.target.value))}
                />
            </div>

            <details className="p-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg" open>
                <summary className="text-xs font-semibold cursor-pointer select-none">Sayfa Düzeni</summary>
                <div className="mt-2 space-y-2">
                    <Checkbox label="Otomatik Sığdır" id="autoFit-va" checked={settings.autoFit} onChange={e => handleSettingChange('autoFit', e.target.checked)} disabled={isTableLayout} />
                    <div className="grid grid-cols-2 gap-2">
                        <NumberInput 
                            label="Sayfa Başına Problem"
                            id="problems-per-page"
                            min={1} max={20}
                            value={settings.problemsPerPage}
                            onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                            disabled={settings.autoFit || isTableLayout}
                        />
                        <NumberInput 
                            label="Sayfa Sayısı"
                            id="page-count"
                            min={1} max={20}
                            value={settings.pageCount}
                            onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                            disabled={isTableLayout}
                        />
                    </div>
                </div>
            </details>

            <SettingsPresetManager 
                moduleKey="verbal-arithmetic"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => handleGenerate(true)} size="sm">Oluştur (Temizle)</Button>
                <Button onClick={() => handleGenerate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default VerbalArithmeticModule;
