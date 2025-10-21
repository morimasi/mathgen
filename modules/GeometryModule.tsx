import React, { useState, useCallback } from 'react';
import { generateGeometryProblem } from '../services/geometryService.ts';
import { generateContextualWordProblems } from '../services/geminiService.ts';
import { GeometrySettings, GeometryProblemType, ShapeType } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import Checkbox from '../components/form/Checkbox.tsx';
import TextInput from '../components/form/TextInput.tsx';
import { ShuffleIcon } from '../components/icons/Icons.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import { TOPIC_SUGGESTIONS } from '../constants.ts';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

const GeometryModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<GeometrySettings>({
        gradeLevel: 1,
        type: GeometryProblemType.ShapeRecognition,
        shape: ShapeType.Rectangle,
        problemsPerPage: 12,
        pageCount: 1,
        useWordProblems: false,
        autoFit: false,
        topic: '',
    });

    const { generate } = useProblemGenerator({
        moduleKey: 'geometry',
        settings,
        generatorFn: generateGeometryProblem,
        aiGeneratorFn: generateContextualWordProblems,
        aiGeneratorTitle: 'Gerçek Hayat Problemleri - Geometri'
    });

    const handleSettingChange = (field: keyof GeometrySettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleRandomTopic = () => {
        const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
        handleSettingChange('topic', randomTopic);
    };

    const handleGradeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grade = parseInt(e.target.value, 10);
        let newSettings: Partial<GeometrySettings> = { gradeLevel: grade };

        switch (grade) {
            case 1:
                newSettings = { ...newSettings, type: GeometryProblemType.ShapeRecognition };
                break;
            case 2:
                newSettings = { ...newSettings, type: GeometryProblemType.Perimeter, shape: ShapeType.Rectangle };
                break;
            case 3:
                newSettings = { ...newSettings, type: GeometryProblemType.Area, shape: ShapeType.Square };
                break;
            case 4:
                newSettings = { ...newSettings, type: GeometryProblemType.AngleInfo };
                break;
            case 5:
                newSettings = { ...newSettings, type: GeometryProblemType.SolidRecognition };
                break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const showShapeSelector = [GeometryProblemType.Perimeter, GeometryProblemType.Area].includes(settings.type);
    
    const areaShapes = [
        ShapeType.Square, ShapeType.Rectangle, ShapeType.Triangle, ShapeType.Circle, ShapeType.Parallelogram, ShapeType.Trapezoid
    ];
    const perimeterShapes = Object.values(ShapeType);
    
    const shapeTurkishNames: { [key in ShapeType]: string } = {
        [ShapeType.Square]: 'Kare',
        [ShapeType.Rectangle]: 'Dikdörtgen',
        [ShapeType.Triangle]: 'Üçgen',
        [ShapeType.Circle]: 'Daire',
        [ShapeType.Parallelogram]: 'Paralelkenar',
        [ShapeType.Trapezoid]: 'Yamuk',
        [ShapeType.Pentagon]: 'Beşgen',
        [ShapeType.Hexagon]: 'Altıgen',
        [ShapeType.Rhombus]: 'Eşkenar Dörtgen',
        // FIX: Add 'Star' to the shapeTurkishNames object to match the ShapeType enum.
        [ShapeType.Star]: 'Yıldız',
    };
    
    const shapeOptions = (settings.type === GeometryProblemType.Area ? areaShapes : perimeterShapes).map(s => ({value: s, label: shapeTurkishNames[s]}));
    const isTableLayout = printSettings.layoutMode === 'table';

    const getHintText = () => {
        if (showShapeSelector) {
            return "Alan ve çevre hesaplamaları için, problemde kullanılacak geometrik şekli buradan seçebilirsiniz. Seçilen şekle göre rastgele boyutlarda görseller oluşturulacaktır. Daire problemleri için π=3 alınır.";
        }
        if (settings.type === GeometryProblemType.SolidElements) {
            return "Bu etkinlik, küp, silindir, piramit gibi üç boyutlu cisimlerin köşe, ayrıt (kenar) ve yüz sayılarını sorarak öğrencilerin uzamsal düşünme becerilerini geliştirir.";
        }
        if (settings.type === GeometryProblemType.ShapeRecognition || settings.type === GeometryProblemType.SolidRecognition) {
            return "Bu etkinlikler, şekillerin veya cisimlerin görselini değil, sözel tanımını verir (örn: '4 eşit kenarı ve 4 dik açısı olan şekil'). Bu, öğrencilerin geometrik terimleri ve özellikleri öğrenmesini sağlar.";
        }
        return "Geometri modülü, 2D ve 3D şekillerle ilgili çeşitli alıştırmalar sunar. 'Sınıf Düzeyi' seçimi, o seviyeye uygun bir problem türünü otomatik olarak ayarlar.";
    };
    
    const handleGenerate = useCallback((clearPrevious: boolean) => {
        generate(clearPrevious);
    }, [generate]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Geometri Ayarları</h2>
                <HintButton text={getHintText()} />
            </div>

            <div className="grid grid-cols-1 gap-2">
                {showShapeSelector && (
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Checkbox
                            label="Gerçek Hayat Problemleri (AI)"
                            id="use-word-problems-geometry"
                            checked={settings.useWordProblems}
                            onChange={e => handleSettingChange('useWordProblems', e.target.checked)}
                        />
                         {settings.useWordProblems && (
                            <div className="mt-1.5 pl-6">
                                <div className="relative">
                                     <TextInput
                                        label="Problem Konusu (İsteğe bağlı)"
                                        id="geometry-topic"
                                        value={settings.topic || ''}
                                        onChange={e => handleSettingChange('topic', e.target.value)}
                                        placeholder="Örn: Bahçe, Oda, Çit"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRandomTopic}
                                        className="absolute right-2.5 bottom-[5px] text-stone-500 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors"
                                        title="Rastgele Konu Öner"
                                    >
                                        <ShuffleIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                         )}
                    </div>
                )}
                 <div className="p-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Checkbox
                        label="Otomatik Sığdır"
                        id="auto-fit-geometry"
                        checked={settings.autoFit}
                        onChange={e => handleSettingChange('autoFit', e.target.checked)}
                        disabled={isTableLayout}
                        title={isTableLayout ? "Tablo modunda bu ayar devre dışıdır." : ""}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5">
                <Select
                    label="Sınıf Düzeyi"
                    id="geometry-grade-level"
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
                    label="Problem Türü"
                    id="geo-type"
                    value={settings.type}
                    onChange={e => {
                        const newType = e.target.value as GeometryProblemType;
                        // Reset shape if it's not applicable to the new type
                        if (newType === GeometryProblemType.Area && !areaShapes.includes(settings.shape!)) {
                            handleSettingChange('shape', ShapeType.Rectangle);
                        }
                        handleSettingChange('type', newType);
                    }}
                    options={[
                        { value: GeometryProblemType.Perimeter, label: 'Çevre Hesaplama' },
                        { value: GeometryProblemType.Area, label: 'Alan Hesaplama' },
                        { value: GeometryProblemType.ShapeRecognition, label: 'Şekil Tanıma (Tanımdan)' },
                        { value: GeometryProblemType.AngleInfo, label: 'Açı Türleri' },
                        { value: GeometryProblemType.Symmetry, label: 'Simetri' },
                        { value: GeometryProblemType.SolidRecognition, label: 'Cisim Tanıma (Tanımdan)' },
                        { value: GeometryProblemType.SolidElements, label: 'Cisimlerin Elemanları' },
                    ]}
                />
                {showShapeSelector && (
                    <Select
                        label="Şekil"
                        id="geo-shape"
                        value={settings.shape}
                        onChange={e => handleSettingChange('shape', e.target.value as ShapeType)}
                        options={shapeOptions}
                    />
                )}
                <NumberInput 
                    label="Sayfa Başına Problem Sayısı"
                    id="problems-per-page"
                    min={1} max={100}
                    value={settings.problemsPerPage}
                    onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                    disabled={settings.autoFit || isTableLayout}
                    title={isTableLayout ? "Tablo modunda problem sayısı satır ve sütun sayısına göre belirlenir." : ""}
                />
                 <NumberInput 
                    label="Sayfa Sayısı"
                    id="page-count"
                    min={1} max={20}
                    value={settings.pageCount}
                    onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                    disabled={isTableLayout}
                    title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}
                />
            </div>
             <SettingsPresetManager 
                moduleKey="geometry"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => handleGenerate(true)} size="sm">Oluştur (Temizle)</Button>
                <Button onClick={() => handleGenerate(true)} variant="secondary" title="Ayarları koruyarak soruları yenile" size="sm">
                    <ShuffleIcon className="w-4 h-4" />
                    Yenile
                </Button>
                <Button onClick={() => handleGenerate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
            </div>
        </div>
    );
};

export default GeometryModule;