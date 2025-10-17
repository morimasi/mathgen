
import React, { useState } from 'react';
import { TimeSettings, TimeProblemType, Difficulty } from '../types';
import { useProblemGenerator } from '../../hooks/useProblemGenerator';
import { generateTimeProblem } from '../../services/timeService';
import { generateContextualWordProblems } from '../../services/geminiService';
import Select from '../../components/form/Select';
import NumberInput from '../../components/form/NumberInput';
import Checkbox from '../../components/form/Checkbox';
import Button from '../../components/form/Button';
import SettingsPresetManager from '../../components/SettingsPresetManager';
import TextInput from '../../components/form/TextInput';
import { TOPIC_SUGGESTIONS } from '../../constants';

const initialSettings: TimeSettings = {
    gradeLevel: 2,
    type: TimeProblemType.ReadClock,
    difficulty: 'medium',
    format: '24h',
    problemsPerPage: 12,
    pageCount: 1,
    showClockNumbers: true,
    showHourHand: true,
    showMinuteHand: true,
    useWordProblems: false,
    showDigitalTime: false,
    showMinuteMarkers: true,
    topic: '',
    autoFit: true,
};

const TimeModule: React.FC = () => {
    const [settings, setSettings] = useState<TimeSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'time',
        settings,
        generatorFn: generateTimeProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: "Zaman Problemleri (AI)",
    });

    const handleGenerateClick = () => {
        generate(true);
    };
    
    const isReadClock = settings.type === TimeProblemType.ReadClock;

    return (
        <div className="space-y-4">
            <Checkbox
                label="Gerçek Hayat Problemleri (AI)"
                id="time-useWordProblems"
                checked={settings.useWordProblems}
                onChange={e => setSettings({ ...settings, useWordProblems: e.target.checked })}
            />

            {settings.useWordProblems && (
                 <div className="p-2 border rounded-md bg-stone-50 dark:bg-stone-700/50 space-y-2">
                    <TextInput
                        label="Problem Konusu"
                        id="time-topic"
                        list="topic-suggestions"
                        value={settings.topic}
                        onChange={e => setSettings({ ...settings, topic: e.target.value })}
                        placeholder="Örn: Okul Günü, Yolculuk"
                    />
                    <datalist id="topic-suggestions">
                        {TOPIC_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                    </datalist>
                 </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                 <Select
                    label="Problem Türü"
                    id="time-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as TimeProblemType })}
                    options={[
                        { value: TimeProblemType.ReadClock, label: 'Saat Okuma (Analog)' },
                        { value: TimeProblemType.CalculateDuration, label: 'Süre Hesaplama' },
                        { value: TimeProblemType.CalculateEndTime, label: 'Bitiş Zamanını Bulma' },
                        { value: TimeProblemType.FindStartTime, label: 'Başlangıç Zamanını Bulma' },
                        { value: TimeProblemType.ConvertUnits, label: 'Birim Dönüştürme' },
                        { value: TimeProblemType.Calendar, label: 'Takvim Problemleri' },
                    ]}
                    containerClassName="col-span-2"
                />
                <Select
                    label="Zorluk"
                    id="time-difficulty"
                    value={settings.difficulty}
                    onChange={e => setSettings({ ...settings, difficulty: e.target.value as Difficulty })}
                    options={[
                        { value: 'easy', label: 'Kolay (Tam Saatler)' },
                        { value: 'medium', label: 'Orta (Çeyrek/Yarım Saatler)' },
                        { value: 'hard', label: 'Zor (Tüm Dakikalar)' },
                        { value: 'mixed', label: 'Karışık' },
                    ]}
                />
                <Select
                    label="Saat Formatı"
                    id="time-format"
                    value={settings.format}
                    onChange={e => setSettings({ ...settings, format: e.target.value as '12h' | '24h' })}
                    options={[
                        { value: '24h', label: '24 Saat' },
                        { value: '12h', label: '12 Saat (ÖÖ/ÖS)' },
                    ]}
                />
            </div>

            {isReadClock && (
                <div className="p-3 border rounded-md bg-stone-50 dark:bg-stone-700/50 space-y-2">
                    <h3 className="text-xs font-semibold mb-1">Analog Saat Özelleştirme</h3>
                    <Checkbox label="Sayıları Göster" id="time-showNumbers" checked={settings.showClockNumbers} onChange={e => setSettings({...settings, showClockNumbers: e.target.checked})} />
                    <Checkbox label="Akrep Göster" id="time-showHourHand" checked={settings.showHourHand} onChange={e => setSettings({...settings, showHourHand: e.target.checked})} />
                    <Checkbox label="Yelkovan Göster" id="time-showMinuteHand" checked={settings.showMinuteHand} onChange={e => setSettings({...settings, showMinuteHand: e.target.checked})} />
                    <Checkbox label="Dakika İşaretlerini Göster" id="time-showMinuteMarkers" checked={settings.showMinuteMarkers} onChange={e => setSettings({...settings, showMinuteMarkers: e.target.checked})} />
                    <Checkbox label="Dijital Saati de Göster" id="time-showDigital" checked={settings.showDigitalTime} onChange={e => setSettings({...settings, showDigitalTime: e.target.checked})} />
                </div>
            )}
            
            <Checkbox
                label="Otomatik Sığdır"
                id="time-autofit"
                checked={!!settings.autoFit}
                onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
            />

            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput label="Sayfa Başına Problem" id="time-problemsPerPage" value={settings.problemsPerPage} onChange={e => setSettings({...settings, problemsPerPage: parseInt(e.target.value,10)})} min={1} max={50} />
                    <NumberInput label="Sayfa Sayısı" id="time-pageCount" value={settings.pageCount} onChange={e => setSettings({...settings, pageCount: parseInt(e.target.value,10)})} min={1} max={20} />
                </div>
            )}

            <SettingsPresetManager<TimeSettings>
                moduleKey="time"
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

export default TimeModule;
