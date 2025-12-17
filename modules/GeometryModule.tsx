import React, { useState, useCallback } from 'react';
import { generateGeometryProblem } from '../services/geometryService.ts';
import { generateContextualWordProblems } from '../services/geminiService.ts';
import { GeometrySettings, GeometryProblemType, ShapeType, SolidShapeType } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import Checkbox from '../components/form/Checkbox.tsx';
import TextInput from '../components/form/TextInput.tsx';
import { ShuffleIcon } from '../components/icons/Icons.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import { TOPIC_SUGGESTIONS } from '../constants.ts';
import HintButton from '../components/form/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

const GeometryModule: React.FC = () => {
    const { settings: printSettings } = usePrintSettings();
    const [settings, setSettings] = useState<GeometrySettings>({
        gradeLevel: 1,
        type: GeometryProblemType.FindShapesInScene,
        shape: ShapeType.Rectangle,
        solidShape: SolidShapeType.Cube,
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
            case 1: newSettings = { ...newSettings, type: GeometryProblemType.FindShapesInScene }; break;
            case 2: newSettings = { ...newSettings, type: GeometryProblemType.ShapeProperties, shape: ShapeType.Square }; break;
            case 3: newSettings = { ...newSettings, type: GeometryProblemType.Perimeter, shape: ShapeType.Rectangle }; break;
            case 4: newSettings = { ...newSettings, type: GeometryProblemType.Area, shape: ShapeType.Square }; break;
            case 5: newSettings = { ...newSettings, type: GeometryProblemType.Volume, solidShape: SolidShapeType.Cube }; break;
        }
        setSettings(prev => ({ ...prev, ...newSettings }));
    };
    
    const problemTypeOptions = [
        // 2D Shapes & Properties
        { value: 'divider1', label: '─ 2D Şekiller ve Özellikleri ─', disabled: true },
        { value: GeometryProblemType.ShapeRecognition, label: 'Şekil Tanıma' },
        { value: GeometryProblemType.FindShapesInScene, label: 'Resimdeki Şekilleri Bul' },
        { value: GeometryProblemType.ShapeProperties, label: 'Şekil Özellikleri (Kenar/Köşe)' },
        { value: GeometryProblemType.TriangleTypes, label: 'Üçgen Çeşitleri' },
        { value: GeometryProblemType.AngleTypes, label: 'Açı Çeşitleri' },
        { value: GeometryProblemType.CountAnglesInShape, label: 'Şekildeki Açıları Say' },
        { value: GeometryProblemType.Symmetry, label: 'Simetri Doğrusu' },
        { value: GeometryProblemType.CompleteSymmetricalShape, label: 'Simetrik Şekli Tamamla' },
        // 2D Measurement
        { value: 'divider2', label: '─ 2D Ölçümler ─', disabled: true },
        { value: GeometryProblemType.Perimeter, label: 'Çevre Hesaplama' },
        { value: GeometryProblemType.Area, label: 'Alan Hesaplama' },
        { value: GeometryProblemType.CircleProperties, label: 'Dairenin Kısımları' },
        // 3D Solids & Properties
        { value: 'divider3', label: '─ 3D Cisimler ve Özellikleri ─', disabled: true },
        { value: GeometryProblemType.SolidRecognition, label: '3D Cisim Tanıma' },
        { value: GeometryProblemType.SolidElements, label: 'Cisimlerin Elemanları' },
        { value: GeometryProblemType.ShapeNets, label: 'Cisim Açınımları (Ağ)' },
        // 3D Measurement
        { value: 'divider4', label: '─ 3D Ölçümler ─', disabled: true },
        { value: GeometryProblemType.Volume, label: 'Hacim Hesaplama' },
        { value: GeometryProblemType.SurfaceArea, label: 'Yüzey Alanı Hesaplama' },
    ];

    const showShapeSelector = [GeometryProblemType.Perimeter, GeometryProblemType.Area, GeometryProblemType.ShapeProperties].includes(settings.type);
    const showSolidShapeSelector = [GeometryProblemType.Volume, GeometryProblemType.SurfaceArea, GeometryProblemType.ShapeNets, GeometryProblemType.SolidElements, GeometryProblemType.SolidRecognition].includes(settings.type);
    
    const shapeTurkishNames: { [key in ShapeType]: string } = {
        [ShapeType.Square]: 'Kare', [ShapeType.Rectangle]: 'Dikdörtgen', [ShapeType.Triangle]: 'Üçgen',
        [ShapeType.Circle]: 'Daire', [ShapeType.Parallelogram]: 'Paralelkenar', [ShapeType.Trapezoid]: 'Yamuk',
        [ShapeType.Pentagon]: 'Beşgen', [ShapeType.Hexagon]: 'Altıgen', [ShapeType.Rhombus]: 'Eşkenar Dörtgen',
        [ShapeType.Star]: 'Yıldız',
    };
    const solidShapeTurkishNames: { [key in SolidShapeType]: string } = {
        [SolidShapeType.Cube]: 'Küp', [SolidShapeType.Cuboid]: 'Dikdörtgen Prizma', [SolidShapeType.Cylinder]: 'Silindir',
        [SolidShapeType.Sphere]: 'Küre', [SolidShapeType.Cone]: 'Koni', [SolidShapeType.Pyramid]: 'Piramit',
    };

    const shapeOptions = Object.entries(shapeTurkishNames)
        .filter(([key]) => [ShapeType.Square, ShapeType.Rectangle, ShapeType.Triangle, ShapeType.Circle, ShapeType.Pentagon, ShapeType.Hexagon].includes(key as ShapeType))
        .map(([value, label]) => ({ value, label }));

    const solidShapeOptions = Object.entries(solidShapeTurkishNames)
        .filter(([key]) => [SolidShapeType.Cube, SolidShapeType.Cuboid, SolidShapeType.Cylinder, SolidShapeType.Pyramid, SolidShapeType.Cone, SolidShapeType.Sphere].includes(key as SolidShapeType))
        .map(([value, label]) => ({ value, label }));


    const isTableLayout = printSettings.layoutMode === 'table';

    const getHintText = () => {
        if (settings.useWordProblems) return "Yapay zeka, seçtiğiniz geometrik şekil veya cisimle ilgili, belirlediğiniz konu etrafında (örn: 'bahçe çitleri', 'oda boyama') gerçek hayat senaryoları oluşturur.";
        switch (settings.type) {
            case 'find-shapes-in-scene': return "Bu eğlenceli etkinlikte, çocuklardan bir robot veya ev gibi karmaşık bir resmin içindeki temel geometrik şekilleri (üçgen, kare vb.) bulup saymaları istenir. Görsel dikkat ve şekil tanıma becerilerini birleştirir.";
            case 'complete-symmetrical-shape': return "Bir kelebek veya kalp gibi simetrik bir şeklin yarısı verilir ve öğrenciden diğer yarısını çizerek şekli tamamlaması istenir. Simetri kavramını uygulamalı olarak öğretir.";
            case 'shape-nets': return "Bir küp veya piramidin 2 boyutlu açınımını gösterir ve bunun hangi 3 boyutlu cisme ait olduğunu sorar. Uzamsal düşünme becerisi için harikadır.";
            case 'solid-elements': return "Bu etkinlik, küp, silindir, piramit gibi üç boyutlu cisimlerin köşe, ayrıt (kenar) ve yüz sayılarını görsel destekli olarak sorarak öğrencilerin uzamsal düşünme becerilerini geliştirir.";
            case 'shape-properties': return "Bu etkinlik, kare veya üçgen gibi 2 boyutlu bir şeklin kenar ya da köşe sayısını sorar. Kavramı pekiştirmek için ilgili özellik (kenarlar veya köşeler) görsel üzerinde vurgulanır.";
            case 'volume':
            case 'surface-area': return "Hacim ve Yüzey Alanı gibi 3D problemler için bir cisim seçin. Problemler, seçilen cisme göre rastgele boyutlarda 3 boyutlu görsellerle oluşturulacaktır.";
            case 'perimeter':
            case 'area': return "Alan ve Çevre hesaplamaları artık daha görsel! Alan problemleri birim karelere bölünmüş ızgaralarla, Çevre problemleri ise vurgulanmış kenarlarla gösterilir. Bu, kavramların somutlaşmasına yardımcı olur.";
            default: return "Geometri modülü, 2D ve 3D şekillerle ilgili çeşitli alıştırmalar sunar. 'Sınıf Düzeyi' seçimi, o seviyeye uygun bir problem türünü otomatik olarak ayarlar.";
        }
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
                                placeholder="Örn: Bahçe, Oda, Kutu, Havuz"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={handleRandomTopic}
                                className="absolute right-2.5 bottom-[5px] text-stone-500 hover:text-primary"
                                title="Rastgele Konu Öner"
                            >
                                <ShuffleIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                 )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5">
                <Select
                    label="Sınıf Düzeyi"
                    id="geometry-grade-level"
                    value={settings.gradeLevel}
                    onChange={handleGradeLevelChange}
                    options={[
                        { value: 1, label: '1. Sınıf' }, { value: 2, label: '2. Sınıf' },
                        { value: 3, label: '3. Sınıf' }, { value: 4, label: '4. Sınıf' },
                        { value: 5, label: '5. Sınıf' },
                    ]}
                />
                <Select
                    label="Etkinlik Türü"
                    id="geo-type"
                    value={settings.type}
                    onChange={e => handleSettingChange('type', e.target.value as GeometryProblemType)}
                    options={problemTypeOptions}
                />
                {showShapeSelector && (
                    <Select label="Şekil Seçimi" id="geo-shape" value={settings.shape}
                        onChange={e => handleSettingChange('shape', e.target.value as ShapeType)} options={shapeOptions} />
                )}
                {showSolidShapeSelector && (
                    <Select label="Cisim Seçimi" id="geo-solid-shape" value={settings.solidShape}
                        onChange={e => handleSettingChange('solidShape', e.target.value as SolidShapeType)} options={solidShapeOptions} />
                )}
                <NumberInput 
                    label="Sayfa Başına Problem Sayısı" id="problems-per-page" min={1} max={100}
                    value={settings.problemsPerPage} onChange={e => handleSettingChange('problemsPerPage', parseInt(e.target.value))}
                    disabled={settings.autoFit || isTableLayout} title={isTableLayout ? "Tablo modunda problem sayısı satır ve sütun sayısına göre belirlenir." : ""}
                    containerClassName="col-span-1"
                />
                 <NumberInput 
                    label="Sayfa Sayısı" id="page-count" min={1} max={20}
                    value={settings.pageCount} onChange={e => handleSettingChange('pageCount', parseInt(e.target.value))}
                    disabled={isTableLayout} title={isTableLayout ? "Tablo modunda sayfa sayısı 1'dir." : ""}
                    containerClassName="col-span-1"
                />
            </div>
             <SettingsPresetManager 
                moduleKey="geometry"
                currentSettings={settings}
                onLoadSettings={setSettings}
            />
            <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => handleGenerate(true)} size="sm">Oluştur</Button>
                <Button onClick={() => handleGenerate(false)} variant="secondary" size="sm">Mevcuta Ekle</Button>
                 <Button onClick={() => handleGenerate(true)} variant="secondary" title="Ayarları koruyarak soruları yenile" size="sm">
                    <ShuffleIcon className="w-4 h-4"/>
                </Button>
            </div>
        </div>
    );
};

export default GeometryModule;
