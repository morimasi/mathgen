
import React, { useState } from 'react';
import { RhythmicCountingSettings, RhythmicProblemType } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateRhythmicCountingProblem } from '../../services/rhythmicCountingService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';
import { TOPIC_SUGGESTIONS } from '../../constants';

const initialSettings: RhythmicCountingSettings = {
    gradeLevel: 1,
    type: RhythmicProblemType.Pattern,
    step: 2,
    direction: 'forward',
    useMultiplesOnly: false,
    min: 1,
    max: 100,
    patternLength: 5,
    missingCount: 1,
    orderCount: 5,
    orderDigits: 2,
    beforeCount: 3,
    afterCount: 3,
    problemsPerPage: 20,
    pageCount: 1,
    useWordProblems: false,
    topic: '',
    orderDirection: 'ascending',
    autoFit: true,
};

export const RhythmicCountingModule: React.FC = () => {
    const [settings, setSettings] = useState<RhythmicCountingSettings>(initialSettings);

    const isPracticeSheet = [
        RhythmicProblemType.PracticeSheet,
        RhythmicProblemType.FillBeforeAfter,
        RhythmicProblemType.FillBetween
    ].includes(settings.type);
    
    const { generate } = useProblemGenerator({
        moduleKey: 'rhythmic-counting',
        settings,
        generatorFn: generateRhythmicCountingProblem,
        isPracticeSheet,
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    const isOrdering = settings.type === RhythmicProblemType.Ordering;
    const isPattern = settings.type === RhythmicProblemType.Pattern;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Problem Türü"
                    id="rc-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as RhythmicProblemType })}
                    options={[
                        { value: RhythmicProblemType.Pattern, label: 'Örüntü Tamamlama' },
                        { value: RhythmicProblemType.FindRule, label: 'Örüntü Kuralı Bulma' },
                        { value: RhythmicProblemType.PracticeSheet, label: 'Alıştırma Kağıdı' },
                        { value: RhythmicProblemType.FillBeforeAfter, label: 'Önceki/Sonraki Sayılar' },
                        { value: RhythmicProblemType.FillBetween, label: 'Aradaki Sayılar' },
                        { value: RhythmicProblemType.OddEven, label: 'Tek/Çift Sayılar' },
                        { value: RhythmicProblemType.Ordering, label: 'Sıralama' },
                        { value: RhythmicProblemType.Comparison, label: 'Karşılaştırma' },
                    ]}
                    containerClassName="col-span-2"
                />
                
                {!isOrdering && (
                    <>
                        <NumberInput
                            label="Adım (Kaçar kaçar?)"
                            id="rc-step"
                            value={settings.step}
                            onChange={e => setSettings({ ...settings, step: parseInt(e.target.value, 10) })}
                            min={1}
                            max={100}
                        />
                         <Select
                            label="Yön"
                            id="rc-direction"
                            value={settings.direction}
                            onChange={e => setSettings({ ...settings, direction: e.target.value as any })}
                            options={[
                                { value: 'forward', label: 'İleri' },
                                { value: 'backward', label: 'Geri' },
                                { value: 'mixed', label: 'Karışık' },
                            ]}
                        />
                    </>
                )}

                <NumberInput
                    label="Min Değer"
                    id="rc-min"
                    value={settings.min}
                    onChange={e => setSettings({ ...settings, min: parseInt(e.target.value, 10) })}
                />
                 <NumberInput
                    label="Max Değer"
                    id="rc-max"
                    value={settings.max}
                    onChange={e => setSettings({ ...settings, max: parseInt(e.target.value, 10) })}
                />
                
                {isPattern && (
                     <>
                        <NumberInput
                            label="Örüntü Uzunluğu"
                            id="rc-patternLength"
                            value={settings.patternLength}
                            onChange={e => setSettings({ ...settings, patternLength: parseInt(e.target.value, 10) })}
                             min={3} max={10}
                        />
                         <NumberInput
                            label="Eksik Sayısı"
                            id="rc-missingCount"
                            value={settings.missingCount}
                            onChange={e => setSettings({ ...settings, missingCount: parseInt(e.target.value, 10) })}
                             min={1} max={5}
                        />
                    </>
                )}
                
                {isOrdering && (
                     <>
                        <NumberInput
                            label="Sıralanacak Sayı Adedi"
                            id="rc-orderCount"
                            value={settings.orderCount}
                            onChange={e => setSettings({ ...settings, orderCount: parseInt(e.target.value, 10) })}
                             min={3} max={10}
                        />
                        <NumberInput
                            label="Basamak Sayısı"
                            id="rc-orderDigits"
                            value={settings.orderDigits}
                            onChange={e => setSettings({ ...settings, orderDigits: parseInt(e.target.value, 10) })}
                             min={1} max={7}
                        />
                         <Select
                            label="Sıralama Yönü"
                            id="rc-orderDirection"
                            value={settings.orderDirection}
                            onChange={e => setSettings({ ...settings, orderDirection: e.target.value as any })}
                            options={[
                                { value: 'ascending', label: 'Küçükten Büyüğe' },
                                { value: 'descending', label: 'Büyükten Küçüğe' },
                                { value: 'mixed', label: 'Karışık' },
                            ]}
                            containerClassName="col-span-2"
                        />
                    </>
                )}
                
                <Checkbox
                    label="Sadece katları kullan"
                    id="rc-useMultiples"
                    checked={settings.useMultiplesOnly}
                    onChange={e => setSettings({ ...settings, useMultiplesOnly: e.target.checked })}
                    containerClassName="col-span-2"
                />
                 {!isPracticeSheet && (
                     <Checkbox
                        label="Otomatik Sığdır"
                        id="rc-autofit"
                        checked={settings.autoFit}
                        onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                        containerClassName="col-span-2"
                    />
                 )}
            </div>

            {!settings.autoFit && !isPracticeSheet && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="rc-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1}
                        max={100}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="rc-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1}
                        max={20}
                    />
                </div>
            )}
            
            <SettingsPresetManager<RhythmicCountingSettings>
                moduleKey="rhythmicCounting"
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
