import React, { useState, useEffect, useCallback } from 'react';
import { generateWordProblems } from '../services/geminiService';
import { Problem, WordProblemSettings } from '../types';
import Select from '../components/form/Select';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import NumberInput from '../components/form/NumberInput';
import TextInput from '../components/form/TextInput';
import { usePrintSettings } from '../services/PrintSettingsContext';
import { calculateMaxProblems } from '../services/layoutService';
import SettingsPresetManager from '../components/SettingsPresetManager';
import { LoadingIcon } from '../components/icons/Icons';
import { TABS, TOPIC_SUGGESTIONS } from '../constants';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const WordProblemsModule: React.FC<ModuleProps> = ({ onGenerate, setIsLoading, contentRef, autoRefreshTrigger, lastGeneratorModule }) => {
    const [settings, setSettings] = useState<WordProblemSettings>({
        topic: 'Market Alışverişi',
        gradeLevel: '3',
        problemsPerPage: 5,
        pageCount: 1,
        operationCount: 1,
        customPrompt: '',
        autoFit: true,
        sourceModule: 'arithmetic',
        useVisuals: false,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [useCustomPrompt, setUseCustomPrompt] = useState(false);
    const { settings: printSettings } = usePrintSettings();

    const handleGenerate = useCallback(async (clearPrevious: boolean) => {
        setIsGenerating(true);
        setIsLoading(true);
        try {
            const problemCount = settings.autoFit
                ? calculateMaxProblems(contentRef, printSettings, { question: 'Bu uzun bir kelime problemidir. Bu uzun bir kelime problemidir. Bu uzun bir kelime problemidir. Bu uzun bir kelime problemidir.' })
                : settings.problemsPerPage * settings.pageCount;
            
            const problems = await generateWordProblems({ ...settings, problemsPerPage: problemCount, pageCount: 1 });
            const title = `${settings.topic} Problemleri`;
            onGenerate(problems, clearPrevious, title, 'word-problems', settings.pageCount);
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        setIsLoading(false);
        setIsGenerating(false);
    }, [settings, onGenerate, setIsLoading, contentRef, printSettings]);

    useEffect(() => {
        if (autoRefreshTrigger > 0 && lastGeneratorModule === 'word-problems') {
            handleGenerate(true);
        }
    }, [autoRefreshTrigger, lastGeneratorModule, handleGenerate]);

    const handleSettingChange = (field: keyof WordProblemSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const moduleOptions = TABS.filter(t => !['word-problems', 'visual-support'].includes(t.id)).map(tab => ({ value: tab.id, label: tab.label }));

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Problemler (AI)</h2>
            <Checkbox label="Özel Talimat Girin" id="use-custom-prompt" checked={useCustomPrompt} onChange={e => setUseCustomPrompt(e.target.checked)} />

            {useCustomPrompt ? (
                <textarea
                    id="custom-prompt"
                    rows={4}
                    value={settings.customPrompt}
                    onChange={e => handleSettingChange('customPrompt', e.target.value)}
                    placeholder="Örn: 3. sınıf için içinde uzaylılar geçen 5 tane çarpma problemi oluştur."
                    className="block w-full text-sm bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600"
                />
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Sınıf Düzeyi"
                            id="grade-level"
                            value={settings.gradeLevel}
                            onChange={e => handleSettingChange('gradeLevel', e.target.value)}
                            options={[
                                { value: '1', label: '1. Sınıf' },
                                { value: '2', label: '2. Sınıf' },
                                { value: '3', label: '3. Sınıf' },
                                { value: '4', label: '4. Sınıf' },
                                { value: '5', label: '5. Sınıf' },
                            ]}
                        />
                        <NumberInput label="İşlem Sayısı" id="operation-count" min={1} max={4} value={settings.operationCount} onChange={e => handleSettingChange('operationCount', parseInt(e.target.value))} />
                    </div>
                    <Select
                        label="Problem Modülü"
                        id="source-module"
                        value={settings.sourceModule}
                        onChange={(e) => handleSettingChange('sourceModule', e.target.value)}
                        options={[{ value: '', label: 'Genel' }, ...moduleOptions]}
                    />
                     <Select
                        label="Problem Konusu"
                        id="word-problem-topic"
                        value={settings.topic}
                        onChange={(e) => handleSettingChange('topic', e.target.value)}
                        options={[{ value: '', label: 'Genel' }, ...TOPIC_SUGGESTIONS.map(s => ({ value: s, label: s }))]}
                    />
                </div>
            )}
            
            <Checkbox label="Görsel Destek (Emoji Ekle)" id="use-visuals-ai" checked={settings.useVisuals} onChange={e => handleSettingChange('useVisuals', e.target.checked)} />

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
                moduleKey="word-problems"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
        </div>
    );
};

export default WordProblemsModule;
