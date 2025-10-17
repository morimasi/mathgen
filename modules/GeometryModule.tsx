
import React, { useState } from 'react';
import { GeometrySettings, GeometryProblemType, ShapeType } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generateGeometryProblem } from '../services/geometryService';
import { generateContextualWordProblems } from '../services/geminiService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';
import TextInput from '../components/form/TextInput';
import { TOPIC_SUGGESTIONS } from '../constants';

const initialSettings: GeometrySettings = {
    gradeLevel: 3,
    type: GeometryProblemType.Perimeter,
    shape: ShapeType.Rectangle,
    problemsPerPage: 8,
    pageCount: 1,
    useWordProblems: false,
    topic: '',
    autoFit: true,
};

const GeometryModule: React.FC = () => {
    const [settings, setSettings] = useState<GeometrySettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'geometry',
        settings,
        generatorFn: generateGeometryProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: "Geometri Problemleri (AI)",
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    const needsShapeSelection = [GeometryProblemType.Perimeter, GeometryProblemType.Area].includes(settings.type);
    
    // Perimeter is not available for some shapes in the generator
    const perimeterDisabled = settings.type === GeometryProblemType.Perimeter && 
        [ShapeType.Parallelogram, ShapeType.Trapezoid].includes(settings.shape || '' as ShapeType);
        
    return (
        <div className="space-y-4">
            <Checkbox
                label="Gerçek Hayat Problemleri (AI)"
                id="geometry-useWordProblems"
                checked={settings.useWordProblems}
                onChange={e => setSettings({ ...settings, useWordProblems: e.target.checked })}
            />

            {settings.useWordProblems && (
                 <div className="p-2 border rounded-md bg-stone-50 dark:bg-stone-700/50 space-y-2">
                    <TextInput
                        label="Problem Konusu"
                        id="geometry-topic"
                        list="topic-suggestions"
                        value={settings.topic}
                        onChange={e => setSettings({ ...settings, topic: e.target.value })}
                        placeholder="Örn: Bahçe Düzenleme"
                    />
                    <datalist id="topic-suggestions">
                        {TOPIC_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                    </datalist>
                 </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Problem Türü"
                    id="geometry-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as GeometryProblemType })}
                    options={[
                        { value: GeometryProblemType.Perimeter, label: 'Çevre Hesaplama' },
                        { value: GeometryProblemType.Area, label: 'Alan Hesaplama' },
                        { value: GeometryProblemType.ShapeRecognition, label: 'Şekil Tanıma (Sözel)' },
                        { value: GeometryProblemType.AngleInfo, label: 'Açı Türleri' },
                        { value: GeometryProblemType.Symmetry, label: 'Simetri' },
                        { value: GeometryProblemType.SolidRecognition, label: 'Cisim Tanıma (Sözel)' },
                        { value: GeometryProblemType.SolidElements, label: 'Cisimlerin Elemanları' },
                    ]}
                    containerClassName="col-span-2"
                />

                {needsShapeSelection && (
                    <Select
                        label="Şekil"
                        id="geometry-shape"
                        value={settings.shape}
                        onChange={e => setSettings({ ...settings, shape: e.target.value as ShapeType })}
                        options={[
                            { value: ShapeType.Square, label: 'Kare' },
                            { value: ShapeType.Rectangle, label: 'Dikdörtgen' },
                            { value: ShapeType.Triangle, label: 'Üçgen' },
                            { value: ShapeType.Circle, label: 'Daire' },
                            ...(settings.type === GeometryProblemType.Area ? [{ value: ShapeType.Parallelogram, label: 'Paralelkenar' }] : []),
                            ...(settings.type === GeometryProblemType.Area ? [{ value: ShapeType.Trapezoid, label: 'Yamuk' }] : []),
                            ...(settings.type === GeometryProblemType.Perimeter ? [{ value: ShapeType.Pentagon, label: 'Düzgün Beşgen' }] : []),
                            ...(settings.type === GeometryProblemType.Perimeter ? [{ value: ShapeType.Hexagon, label: 'Düzgün Altıgen' }] : []),
                        ]}
                        containerClassName="col-span-2"
                    />
                )}
                
                <Checkbox
                    label="Otomatik Sığdır"
                    id="geometry-autofit"
                    checked={!!settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>
            {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput label="Sayfa Başına Problem" id="geometry-problemsPerPage" value={settings.problemsPerPage} onChange={e => setSettings({...settings, problemsPerPage: parseInt(e.target.value,10)})} min={1} max={50} />
                    <NumberInput label="Sayfa Sayısı" id="geometry-pageCount" value={settings.pageCount} onChange={e => setSettings({...settings, pageCount: parseInt(e.target.value,10)})} min={1} max={20} />
                </div>
            )}
            
            <SettingsPresetManager<GeometrySettings>
                moduleKey="geometry"
                currentSettings={settings}
                onLoadSettings={setSettings}
                initialSettings={initialSettings}
            />

            <Button onClick={handleGenerateClick} className="w-full" enableFlyingLadybug disabled={perimeterDisabled}>
                {perimeterDisabled ? "Bu şekil için çevre hesaplanamaz" : "Çalışma Kağıdı Oluştur"}
            </Button>
        </div>
    );
};

export default GeometryModule;
