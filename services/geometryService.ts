// services/geometryService.ts

import { Problem, GeometryProblemType, ShapeType, GeometrySettings, SolidShapeType } from '../types.ts';
import { draw2DShape, drawAngle, drawSymmetryLine, draw3DShape, drawCompositeShapeForCounting, drawHalfShapeForSymmetry, drawTriangleWithType, drawShapeForAngleCounting, drawCircleWithProperties, drawShapeNet } from './svgService.ts';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
const PI = 3; // For simplicity in calculations

const shapePropertiesData = {
    [ShapeType.Square]: { sides: 4, corners: 4 },
    [ShapeType.Rectangle]: { sides: 4, corners: 4 },
    [ShapeType.Triangle]: { sides: 3, corners: 3 },
    [ShapeType.Circle]: { sides: 0, corners: 0 },
    [ShapeType.Pentagon]: { sides: 5, corners: 5 },
    [ShapeType.Hexagon]: { sides: 6, corners: 6 },
    [ShapeType.Rhombus]: { sides: 4, corners: 4 },
    [ShapeType.Parallelogram]: { sides: 4, corners: 4 },
    [ShapeType.Trapezoid]: { sides: 4, corners: 4 },
    [ShapeType.Star]: { sides: 10, corners: 10 },
};

export const generateGeometryProblem = (settings: GeometrySettings): { problem: Problem, title: string, error?: string } => {
    const { type, shape, solidShape } = settings;
    let problem: Problem;
    let title: string;
    const problemBase = { category: 'geometry' };

    const shapeNames: {[key in ShapeType]: string} = {
        [ShapeType.Square]: "Kare", [ShapeType.Rectangle]: "Dikdörtgen", [ShapeType.Triangle]: "Üçgen",
        [ShapeType.Circle]: "Daire", [ShapeType.Parallelogram]: "Paralelkenar", [ShapeType.Trapezoid]: "Yamuk",
        [ShapeType.Pentagon]: "Beşgen", [ShapeType.Hexagon]: "Altıgen", [ShapeType.Rhombus]: "Eşkenar Dörtgen",
        [ShapeType.Star]: "Yıldız",
    };
    const solidNames: {[key in SolidShapeType]: string} = {
        [SolidShapeType.Cube]: "Küp", [SolidShapeType.Cuboid]: "Dikdörtgen Prizma", [SolidShapeType.Cylinder]: "Silindir",
        [SolidShapeType.Sphere]: "Küre", [SolidShapeType.Cone]: "Koni", [SolidShapeType.Pyramid]: "Piramit",
    };


    switch (type) {
        // --- 2D SHAPE IDENTIFICATION & PROPERTIES ---
        case GeometryProblemType.ShapeRecognition: {
            title = "Şekil Tanıma";
            const availableShapes = shape ? [shape] : [ShapeType.Square, ShapeType.Rectangle, ShapeType.Triangle, ShapeType.Circle, ShapeType.Star, ShapeType.Pentagon, ShapeType.Hexagon];
            const selectedShape = availableShapes[getRandomInt(0, availableShapes.length-1)];
            const question = `<p>Bu şeklin adı nedir?</p>${draw2DShape({type: selectedShape, s: 40})}`;
            const answer = shapeNames[selectedShape];
            problem = { ...problemBase, question, answer };
            break;
        }

        case GeometryProblemType.FindShapesInScene: {
            title = "Resimdeki Şekilleri Bul";
            const sceneType = (['robot', 'house'] as const)[getRandomInt(0,1)];
            const { svg, counts } = drawCompositeShapeForCounting(sceneType);
            const shapesWithCount = Object.entries(counts).filter(([,count]) => count > 0);
            if (shapesWithCount.length === 0) {
                 return { problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, title: "Hata", error: `Resimde sayılacak şekil bulunamadı.` };
            }
            const [shapeToFind, count] = shapesWithCount[getRandomInt(0, shapesWithCount.length-1)];

            const shapeTurkishNames: Record<string, string> = { 'Kare': 'kare', 'Dikdörtgen': 'dikdörtgen', 'Daire': 'daire', 'Üçgen': 'üçgen' };
            const question = `<p>Yukarıdaki ${sceneType === 'robot' ? 'robot' : 'ev'} resminde kaç tane <b>${shapeTurkishNames[shapeToFind] || shapeToFind}</b> vardır?</p>${svg}`;
            problem = { ...problemBase, question, answer: String(count) };
            break;
        }
        
        case GeometryProblemType.ShapeProperties: {
            title = "Şekil Özellikleri";
            const availableShapes = shape ? [shape] : [ShapeType.Square, ShapeType.Rectangle, ShapeType.Triangle, ShapeType.Pentagon, ShapeType.Hexagon];
            const selectedShape = availableShapes[getRandomInt(0, availableShapes.length - 1)];
            const propertyToAsk = Math.random() < 0.5 ? 'sides' : 'corners';
            const propertyName = propertyToAsk === 'sides' ? 'kenarı' : 'köşesi';

            const { sides, corners } = shapePropertiesData[selectedShape];
            const answer = propertyToAsk === 'sides' ? sides : corners;
            let question: string;
            
            if (selectedShape === ShapeType.Circle) {
                 question = `<p>Bu şeklin köşe veya kenarı var mıdır?</p>${draw2DShape({ type: selectedShape, r: 40, highlight: propertyToAsk === 'sides' ? 'edges' : 'corners' })}`;
                 problem = { ...problemBase, question, answer: "Yoktur" };
            } else {
                question = `<p>Bu şeklin kaç tane <b>${propertyName}</b> vardır?</p>${draw2DShape({ type: selectedShape, s: 80, highlight: propertyToAsk === 'sides' ? 'edges' : 'corners' })}`;
                problem = { ...problemBase, question, answer: String(answer) };
            }
            break;
        }

        case GeometryProblemType.TriangleTypes: {
            title = "Üçgen Çeşitleri";
            const types = ['right', 'isosceles', 'equilateral'] as const;
            const targetType = types[getRandomInt(0, types.length - 1)];
            const otherTypes = types.filter(t => t !== targetType);
            const shapes = shuffleArray([
                { type: targetType, svg: drawTriangleWithType(targetType) },
                { type: otherTypes[0], svg: drawTriangleWithType(otherTypes[0]) },
                { type: otherTypes[1], svg: drawTriangleWithType(otherTypes[1]) }
            ]);
            const typeNames = { right: 'dik', isosceles: 'ikizkenar', equilateral: 'eşkenar' };

            const question = `<p>Aşağıdaki üçgenlerden hangisi <b>${typeNames[targetType]}</b> üçgendir?</p>
            <div style="display: flex; justify-content: space-around; align-items: center; margin-top: 1rem;">
                ${shapes.map((s, i) => `<div><p style="text-align: center;"><b>${String.fromCharCode(65 + i)}</b></p>${s.svg}</div>`).join('')}
            </div>`;
            const correctIndex = shapes.findIndex(s => s.type === targetType);
            const answer = String.fromCharCode(65 + correctIndex);
            problem = { ...problemBase, question, answer };
            break;
        }

        case GeometryProblemType.AngleTypes: {
            title = "Açı Çeşitleri";
            const types = ['dar', 'dik', 'geniş'] as const;
            const type = types[getRandomInt(0, 2)];
            let angle: number;

            switch (type) {
                case 'dar':
                    angle = getRandomInt(10, 89);
                    break;
                case 'dik':
                    angle = 90;
                    break;
                case 'geniş':
                    angle = getRandomInt(91, 170);
                    break;
            }

            const question = `<p>Bu açının türü nedir? (Dar, Dik, Geniş)</p>${drawAngle(angle, false)}`;
            problem = { ...problemBase, question, answer: `${type.charAt(0).toUpperCase() + type.slice(1)} Açı` };
            break;
        }

        case GeometryProblemType.CountAnglesInShape: {
            title = "Şekildeki Açıları Say";
            const { svg, right, acute, obtuse } = drawShapeForAngleCounting();
            const types = [{name: 'dik', count: right}, {name: 'dar', count: acute}, {name: 'geniş', count: obtuse}].filter(t => t.count > 0);
            const targetType = types[getRandomInt(0, types.length - 1)];
            
            const question = `<p>Şekilde kaç tane <b>${targetType.name}</b> açı vardır?</p>${svg}`;
            problem = { ...problemBase, question, answer: String(targetType.count) };
            break;
        }
        
        case GeometryProblemType.Symmetry: {
            title = "Simetri Doğrusu";
            const shape = (['Kelebek', 'Kalp', 'A Harfi', 'C Harfi'] as const)[getRandomInt(0,3)];
            const isCorrect = Math.random() < 0.7; // 70% chance of being correct
            const question = `<p>Bu şeklin simetri doğrusu <b>doğru</b> çizilmiş mi?</p>${drawSymmetryLine(shape, isCorrect)}`;
            problem = { ...problemBase, question: question, answer: isCorrect ? 'Evet' : 'Hayır' };
            break;
        }

        case GeometryProblemType.CompleteSymmetricalShape: {
            title = "Simetrik Şekli Tamamla";
            const shape = (['butterfly', 'heart', 'star'] as const)[getRandomInt(0,2)];
            const question = `<p>Şeklin diğer yarısını çizerek simetriyi tamamla.</p>${drawHalfShapeForSymmetry(shape)}`;
            problem = { ...problemBase, question, answer: "Şekil tamamlanır." };
            break;
        }
        
        // --- 2D MEASUREMENT ---
        case GeometryProblemType.Perimeter:
        case GeometryProblemType.Area: {
            if (!shape) return { problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, title: "Hata", error: "Problem oluşturmak için bir şekil seçilmelidir." };
            
            const isPerimeter = type === GeometryProblemType.Perimeter;
            const shapeGenitiveNames: {[key in ShapeType]: string} = {
                [ShapeType.Square]: "karenin", [ShapeType.Rectangle]: "dikdörtgenin", [ShapeType.Triangle]: "üçgenin", [ShapeType.Circle]: "dairenin",
                [ShapeType.Parallelogram]: "paralelkenarın", [ShapeType.Trapezoid]: "yamuğun", [ShapeType.Pentagon]: "beşgenin",
                [ShapeType.Hexagon]: "altıgenin", [ShapeType.Rhombus]: "eşkenar dörtgenin", [ShapeType.Star]: "yıldızın"
            };
            
            if (!isPerimeter && (shape === ShapeType.Square || shape === ShapeType.Rectangle)) {
                title = `Aşağıdaki şekil kaç birim kareden oluşmaktadır?`;
            } else {
                title = `Aşağıdaki ${shapeGenitiveNames[shape] || "şeklin"} ${isPerimeter ? 'çevresini' : 'alanını'} hesaplayınız.`;
            }

            let answer = '', svg = '';
            
            switch (shape) {
                case ShapeType.Rectangle:
                    const w = getRandomInt(3, 8); const h = getRandomInt(3, 8);
                    svg = draw2DShape({ type: shape, w, h, showGrid: !isPerimeter, highlightPerimeter: isPerimeter });
                    answer = isPerimeter ? `${2 * (w + h)} birim` : `${w * h} birim²`;
                    break;
                case ShapeType.Square:
                    const s = getRandomInt(3, 8);
                    svg = draw2DShape({ type: shape, s, showGrid: !isPerimeter, highlightPerimeter: isPerimeter });
                    answer = isPerimeter ? `${4 * s} birim` : `${s * s} birim²`;
                    break;
                case ShapeType.Triangle:
                    const b = getRandomInt(5, 50); const h_tri = getRandomInt(5, 50);
                     svg = draw2DShape({ type: shape, b, h: h_tri, highlightPerimeter: isPerimeter });
                    if (!isPerimeter) {
                        answer = `${(b * h_tri) / 2} birim²`;
                    } else {
                        const s1 = Math.round(Math.sqrt(Math.pow(b/2, 2) + h_tri*h_tri));
                        answer = `${b + 2 * s1} birim`;
                    }
                    break;
                case ShapeType.Circle:
                    const r = getRandomInt(2, 30);
                    svg = draw2DShape({ type: shape, r, highlightPerimeter: isPerimeter });
                    title += ' (π=3 alınız)';
                    answer = isPerimeter ? `${2 * PI * r} birim` : `${PI * r * r} birim²`;
                    break;
                default:
                     return { problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, title: "Hata", error: "Bu şekil için hesaplama desteklenmiyor." };
            }
            problem = { ...problemBase, question: svg, answer };
            break;
        }

        case GeometryProblemType.CircleProperties: {
            title = "Dairenin Kısımları";
            const properties = ['radius', 'diameter', 'circumference'] as const;
            const targetProp = properties[getRandomInt(0, properties.length - 1)];
            const names = { radius: 'Yarıçap', diameter: 'Çap', circumference: 'Çevre' };
            const svg = drawCircleWithProperties(targetProp);
            const question = `<p>Dairenin kırmızıyla işaretlenmiş kısmının adı nedir?</p>${svg}`;
            problem = { ...problemBase, question, answer: names[targetProp] };
            break;
        }
        
        // --- 3D SOLIDS ---
        case GeometryProblemType.Volume:
        case GeometryProblemType.SurfaceArea: {
            if (!solidShape) return { problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, title: "Hata", error: "Problem oluşturmak için bir cisim seçilmelidir." };
            
            const isVolume = type === GeometryProblemType.Volume;
             const solidGenitiveNames: {[key in SolidShapeType]: string} = {
                [SolidShapeType.Cube]: "küpün", [SolidShapeType.Cuboid]: "dikdörtgen prizmanın", [SolidShapeType.Cylinder]: "silindirin",
                [SolidShapeType.Sphere]: "kürenin", [SolidShapeType.Cone]: "koninin", [SolidShapeType.Pyramid]: "piramidin",
            };
            title = `Aşağıdaki ${solidGenitiveNames[solidShape]} ${isVolume ? 'hacmini' : 'yüzey alanını'} hesaplayınız.`;
            
            let answer = '', svg = '', s = getRandomInt(3, 10), w = getRandomInt(3, 10), l = getRandomInt(3, 10), h = getRandomInt(3, 15), r = getRandomInt(3, 10);

            switch (solidShape) {
                case SolidShapeType.Cube:
                    svg = draw3DShape({ type: solidShape, s });
                    answer = isVolume ? `${s*s*s} br³` : `${6*s*s} br²`;
                    break;
                case SolidShapeType.Cuboid:
                     svg = draw3DShape({ type: solidShape, w, l, h });
                     answer = isVolume ? `${w*l*h} br³` : `${2*(w*l + w*h + l*h)} br²`;
                    break;
                case SolidShapeType.Cylinder:
                    svg = draw3DShape({ type: solidShape, r, h });
                    title += ' (π=3 alınız)';
                    answer = isVolume ? `${PI*r*r*h} br³` : `${2*PI*r*h + 2*PI*r*r} br²`;
                    break;
                default:
                    return { problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, title: "Hata", error: "Bu cisim için hesaplama desteklenmiyor." };
            }
            problem = { ...problemBase, question: svg, answer };
            break;
        }
        
        case GeometryProblemType.SolidRecognition: {
            title = "3 Boyutlu Cisimler";
            const availableSolids = solidShape ? [solidShape] : [SolidShapeType.Cube, SolidShapeType.Cuboid, SolidShapeType.Cylinder, SolidShapeType.Sphere, SolidShapeType.Cone, SolidShapeType.Pyramid];
            const selectedSolid = availableSolids[getRandomInt(0, availableSolids.length-1)];
            const question = `<p>Bu cismin adı nedir?</p>${draw3DShape({type: selectedSolid})}`;
            const answer = solidNames[selectedSolid];
            problem = { ...problemBase, question, answer };
            break;
        }
        
        case GeometryProblemType.SolidElements: {
            title = "Cisimlerin Elemanları";
            const solids = [
                { name: 'Küp', type: SolidShapeType.Cube, v: 8, e: 12, f: 6 },
                { name: 'Dikdörtgen Prizma', type: SolidShapeType.Cuboid, v: 8, e: 12, f: 6 },
                { name: 'Piramit', type: SolidShapeType.Pyramid, v: 5, e: 8, f: 5 },
                { name: 'Silindir', type: SolidShapeType.Cylinder, v: 0, e: 2, f: 3 },
                 { name: 'Koni', type: SolidShapeType.Cone, v: 1, e: 1, f: 2 },
            ];
            const solid = solidShape ? solids.find(s => s.type === solidShape) || solids[0] : solids[getRandomInt(0, solids.length - 1)];
            const element = ['köşe', 'ayrıt', 'yüz'][getRandomInt(0, 2)];
            let answerVal = (element === 'köşe') ? solid.v : (element === 'ayrıt' ? solid.e : solid.f);
            const question = `<div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                ${draw3DShape({ type: solid.type })}
                <span><b>${solid.name}</b> cisminin kaç <b>${element} sayısı</b> vardır?</span>
            </div>`;
            problem = { ...problemBase, question, answer: String(answerVal) };
            break;
        }

        case GeometryProblemType.ShapeNets: {
            title = "Cisim Açınımları";
            const availableNets = solidShape ? [solidShape] : [SolidShapeType.Cube, SolidShapeType.Pyramid, SolidShapeType.Cuboid];
            const targetSolid = availableNets[getRandomInt(0, availableNets.length-1)];

            const otherOptions = [SolidShapeType.Cylinder, SolidShapeType.Cone, SolidShapeType.Sphere].filter(s => s !== targetSolid);
            const options = shuffleArray([
                solidNames[targetSolid], 
                solidNames[Object.values(SolidShapeType).find(n => n !== targetSolid && n !== SolidShapeType.Sphere)!],
                solidNames[otherOptions[0]]
            ]);

            const question = `<p>Bu açınım aşağıdaki cisimlerden hangisine aittir?</p>
                            ${drawShapeNet(targetSolid)}
                            <div style="display: flex; justify-content: space-around; margin-top: 1rem; font-weight: bold;">
                                ${options.map(opt => `<span>${opt}</span>`).join('')}
                            </div>`;
            const answer = solidNames[targetSolid];
            problem = { ...problemBase, question, answer };
            break;
        }

        default:
            return { problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, title: "Hata", error: `Problem türü ('${type}') için içerik üretici bulunamadı.` };
    }
    return { problem, title };
};
