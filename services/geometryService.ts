// FIX: Add .ts extension to import paths
import { Problem, GeometryProblemType, ShapeType, GeometrySettings } from '../types.ts';
import { draw2DShape, drawAngle, drawSymmetryLine } from './svgService.ts';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateGeometryProblem = (settings: GeometrySettings): { problem: Problem, title: string, error?: string } => {
    const { type, shape } = settings;
    let problem: Problem;
    let title: string;
    const problemBase = { category: 'geometry' };

    switch (type) {
        case GeometryProblemType.Perimeter:
        case GeometryProblemType.Area: {
            if (!shape) {
                return { 
                    problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, 
                    title: "Hata",
                    error: "Problem oluşturmak için bir şekil seçilmelidir. Lütfen 'Şekil' menüsünden bir seçim yapın."
                };
            }
            const isPerimeter = type === GeometryProblemType.Perimeter;
            const shapeNames: {[key in ShapeType]: string} = {
                [ShapeType.Square]: "karenin",
                [ShapeType.Rectangle]: "dikdörtgenin",
                [ShapeType.Triangle]: "üçgenin",
                [ShapeType.Circle]: "dairenin",
                [ShapeType.Parallelogram]: "paralelkenarın",
                [ShapeType.Trapezoid]: "yamuğun",
                [ShapeType.Pentagon]: "düzgün beşgenin",
                [ShapeType.Hexagon]: "düzgün altıgenin",
                [ShapeType.Rhombus]: "eşkenar dörtgenin",
            };

            title = `Aşağıdaki ${shapeNames[shape]} ${isPerimeter ? 'çevresini' : 'alanını'} hesaplayınız.`;
            
            let answer = '';
            let svg = '';
            
            switch (shape) {
                case ShapeType.Rectangle: {
                    const w = getRandomInt(5, 50);
                    const h = getRandomInt(5, 50);
                    svg = draw2DShape({ type: shape, w, h });
                    answer = isPerimeter ? `${2 * (w + h)} birim` : `${w * h} birim²`;
                    break;
                }
                case ShapeType.Square: {
                    const s = getRandomInt(5, 50);
                    svg = draw2DShape({ type: shape, s });
                    answer = isPerimeter ? `${4 * s} birim` : `${s * s} birim²`;
                    break;
                }
                 case ShapeType.Triangle: {
                    const b = getRandomInt(5, 50);
                    const h = getRandomInt(5, 50);
                    if (!isPerimeter) { // Area
                        svg = draw2DShape({ type: shape, b, h });
                        answer = `${(b * h) / 2} birim²`;
                    } else { // Perimeter
                        const s1 = Math.round(Math.sqrt(Math.pow(b/2, 2) + h*h));
                        const s2 = s1; // Isosceles for simplicity
                        svg = draw2DShape({ type: shape, b, h, s1, s2 });
                        answer = `${b + s1 + s2} birim`;
                    }
                    break;
                 }
                case ShapeType.Circle: {
                    const r = getRandomInt(2, 30);
                    svg = draw2DShape({ type: shape, r });
                    title += ' (π=3 alınız)';
                    answer = isPerimeter ? `${2 * 3 * r} birim` : `${3 * r * r} birim²`;
                    break;
                }
                case ShapeType.Parallelogram: {
                     const b = getRandomInt(10, 40);
                     const s = getRandomInt(5, 30);
                     const h = getRandomInt(4, s-1 > 0 ? s-1 : 4);
                     if(isPerimeter) {
                        svg = draw2DShape({ type: shape, b, s});
                        answer = `${2 * (b + s)} birim`;
                     } else {
                        svg = draw2DShape({ type: shape, b, h, isArea: true });
                        answer = `${b * h} birim²`;
                     }
                     break;
                }
                 case ShapeType.Trapezoid: {
                    const a = getRandomInt(5, 20);
                    const b = getRandomInt(21, 40);
                    const h = getRandomInt(4, 30);
                    if (!isPerimeter) { // Area
                        svg = draw2DShape({type: shape, a, b, h, isArea: true });
                        answer = `${((a + b) / 2) * h} birim²`;
                    } else { // Perimeter
                        const c = getRandomInt(h + 1, h + 10);
                        const d = getRandomInt(h + 1, h + 10);
                        svg = draw2DShape({type: shape, a, b, c, d});
                        answer = `${a + b + c + d} birim`;
                    }
                    break;
                }
                case ShapeType.Pentagon:
                case ShapeType.Hexagon:
                case ShapeType.Rhombus: {
                    const s = getRandomInt(5, 50);
                    svg = draw2DShape({ type: shape, s });
                     if (type === GeometryProblemType.Area && (shape === ShapeType.Pentagon || shape === ShapeType.Hexagon || shape === ShapeType.Rhombus)) {
                        answer = "Bu şeklin alanı için daha fazla bilgi gereklidir.";
                    } else if (shape === ShapeType.Rhombus) {
                        answer = `${4 * s} birim`;
                    }
                    else {
                        answer = `${(shape === ShapeType.Pentagon ? 5 : 6) * s} birim`;
                    }
                    break;
                }
            }
            problem = { ...problemBase, question: svg, answer };
            break;
        }

        case GeometryProblemType.ShapeRecognition: {
            title = "Tanımı verilen geometrik şeklin adını yazınız.";
            const shapes = ["kare", "dikdörtgen", "üçgen", "daire", "paralelkenar", "yamuk", "düzgün beşgen", "düzgün altıgen", "eşkenar dörtgen"];
            const props = [
                "4 eşit kenarı ve 4 dik açısı olan şekil",
                "karşılıklı kenarları eşit ve 4 dik açısı olan şekil",
                "3 kenarı ve 3 açısı olan şekil",
                "köşesi olmayan yuvarlak şekil",
                "karşılıklı kenarları paralel olan dörtgen",
                "sadece iki kenarı paralel olan dörtgen",
                "5 eşit kenarı ve 5 eşit açısı olan şekil",
                "6 eşit kenarı ve 6 eşit açısı olan şekil",
                "4 eşit kenarı olan dörtgen"
            ];
            const i = getRandomInt(0, shapes.length - 1);
            const question = `<span style="font-size: 1.1em;">"${props[i]}"</span>`;
            const answer = shapes[i];
            problem = { ...problemBase, question, answer };
            break;
        }

        case GeometryProblemType.AngleInfo: {
            title = "Aşağıdaki açıların türünü belirtiniz (Dar, Dik, Geniş).";
            const types = ['dar', 'dik', 'geniş'];
            const type = types[getRandomInt(0,2)];
            let angle = 0;
            if (type === 'dar') angle = getRandomInt(10, 89);
            else if (type === 'dik') angle = 90;
            else angle = getRandomInt(91, 170);
            
            const svg = drawAngle(angle);
            const question = svg;
            const answer = `${type.charAt(0).toUpperCase() + type.slice(1)} Açı`;
            problem = { ...problemBase, question, answer };
            break;
        }

        case GeometryProblemType.Symmetry: {
            title = "Aşağıdaki şekillerin simetri doğrusu var mıdır?";
            const shapes = ['Kelebek', 'Kalp', 'A Harfi', 'C Harfi'];
            const shape = shapes[getRandomInt(0,3)];
            const svg = drawSymmetryLine(shape);
            const question = svg;
            const answer = 'Evet';
            problem = { ...problemBase, question, answer };
            break;
        }
        
        case GeometryProblemType.SolidRecognition: {
            title = "Tanımı verilen geometrik cismin adını yazınız.";
            const solids = ["küp", "dikdörtgen prizma", "silindir", "koni", "küre", "piramit"];
            const props = [
                "tüm yüzeyleri kare olan 3D cisim",
                "tüm yüzeyleri dikdörtgen olan 3D cisim",
                "iki dairesel tabanı ve bir yanal yüzeyi olan 3D cisim",
                "bir dairesel tabanı ve bir tepe noktası olan 3D cisim",
                "yüzeyi olmayan tamamen yuvarlak 3D cisim",
                "bir tabanı ve bir tepe noktasında birleşen üçgensel yüzeyleri olan 3D cisim"
            ];
            const i = getRandomInt(0, solids.length - 1);
            const question = `<span style="font-size: 1.1em;">"${props[i]}"</span>`;
            const answer = solids[i];
            problem = { ...problemBase, question, answer };
            break;
        }
        
        case GeometryProblemType.SolidElements: {
            title = "Verilen cisimlerin istenen eleman sayısını bulunuz.";
            const solids = [
                { name: 'Küp', v: 8, e: 12, f: 6 },
                { name: 'Dikdörtgen Prizma', v: 8, e: 12, f: 6 },
                { name: 'Üçgen Prizma', v: 6, e: 9, f: 5 },
                { name: 'Piramit (Kare Tabanlı)', v: 5, e: 8, f: 5 },
                { name: 'Silindir', v: 0, e: 2, f: 3 },
                { name: 'Koni', v: 1, e: 1, f: 2 },
            ];
            const solid = solids[getRandomInt(0, solids.length - 1)];
            const element = ['köşe', 'ayrıt', 'yüz'][getRandomInt(0, 2)];
            let answer = '';
            if (element === 'köşe') answer = `${solid.v}`;
            else if (element === 'ayrıt') answer = `${solid.e}`;
            else answer = `${solid.f}`;
            
            const question = `<div style="font-size: 1.1em;"><b>Cisim:</b> ${solid.name}<br/><b>İstenen:</b> ${element} sayısı</div>`;
            problem = { ...problemBase, question, answer };
            break;
        }

        default:
            problem = { ...problemBase, question: 'Hata', answer: 'Hata' };
            title = "Hata";
    }
    return { problem, title };
};
