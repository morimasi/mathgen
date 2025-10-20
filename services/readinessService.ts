// services/readinessService.ts

import { Problem, MatchingAndSortingSettings, ComparingQuantitiesSettings, NumberRecognitionSettings, PatternsSettings, BasicShapesSettings, ShapeType, PositionalConceptsSettings, IntroToMeasurementSettings, SimpleGraphsSettings, PositionalConceptType, IntroMeasurementType, SimpleGraphType, VisualAdditionSubtractionSettings, VerbalArithmeticSettings, MissingNumberPuzzlesSettings, SymbolicArithmeticSettings, ProblemCreationSettings, SimpleGraphTaskType, PatternType, ShapeRecognitionType, NumberRecognitionType } from '../types.ts';
import { numberToWords } from './utils.ts';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const THEME_OBJECTS: { [key: string]: string[] } = {
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔'],
    vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍', '🛺', '🚔', '🚍', '🚘', '🚖', '✈️', '🛫', '🛬', '💺', '🚁', '🚟', '🚠', '🚡', '🛰', '🚀', '🛸', '⛵️', '🛶', '🚤', '🛳', '⛴', '🛥', '🚢'],
    fruits: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕️', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽', '🥣', '🥡', '🥢', '🧂'],
    shapes: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫️', '⚪️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛️', '⬜️', '🔶', '🔷', '🔸', '🔹'],
    measurement: ['✏️', '🔑', '📏', '📎', '🟥', '➖'],
};

const getRandomItems = (theme: string, count: number): string[] => {
    const themeKey = theme === 'mixed' ? Object.keys(THEME_OBJECTS)[getRandomInt(0, Object.keys(THEME_OBJECTS).length - 1)] : theme;
    const items = THEME_OBJECTS[themeKey];
    return shuffleArray(items).slice(0, count);
};

// --- GENERATOR FUNCTIONS ---

const generateMatchingProblem = (settings: MatchingAndSortingSettings): { problem: Problem, title: string } => {
    const { type, theme, itemCount } = settings;
    const title = type === 'by-property' ? 'Nesneleri Özelliklerine Göre Gruplayınız' : 'Aynı Olan Nesneleri Eşleştiriniz';
    
    const items = getRandomItems(theme, itemCount);
    const shuffledItems = shuffleArray(items);

    const width = 300;
    const itemHeight = 60;
    const height = itemHeight * itemCount;
    const FONT_SIZE = 30;

    let svgContent = '';
    for(let i = 0; i < itemCount; i++) {
        const y = (i * itemHeight) + FONT_SIZE + 10;
        
        // Column 1
        svgContent += `<text x="50" y="${y}" font-size="${FONT_SIZE}" text-anchor="middle" dominant-baseline="middle" fill="currentColor">${items[i]}</text>`;
        svgContent += `<circle cx="80" cy="${y}" r="5" fill="#d1d5db" />`;

        // Column 2
        const itemToDraw = type === 'shadow' ? 
            `<text x="250" y="${y}" font-size="${FONT_SIZE}" text-anchor="middle" dominant-baseline="middle" fill="black" opacity="0.6">${shuffledItems[i]}</text>` :
            `<text x="250" y="${y}" font-size="${FONT_SIZE}" text-anchor="middle" dominant-baseline="middle" fill="currentColor">${shuffledItems[i]}</text>`;
        svgContent += itemToDraw;
        svgContent += `<circle cx="220" cy="${y}" r="5" fill="#d1d5db" />`;
    }
    
    const question = `<svg viewBox="0 0 ${width} ${height}" style="max-height: 400px; width: auto;">${svgContent}</svg>`;

    return { 
        problem: { question, answer: "Görseldeki gibi", category: 'matching-and-sorting' }, 
        title 
    };
};

const generateComparingProblem = (settings: ComparingQuantitiesSettings): { problem: Problem, title: string } => {
    const { type, theme, maxObjectCount } = settings;
    const title = 'İstenen Grubu İşaretleyiniz';
    
    const item = getRandomItems(theme, 1)[0];
    
    let question = '';

    if (type === 'more-less') {
        let count1 = getRandomInt(1, maxObjectCount - 1);
        let count2 = getRandomInt(1, maxObjectCount - 1);
        while (count1 === count2) count2 = getRandomInt(1, maxObjectCount - 1);
        
        const instruction = Math.random() < 0.5 ? "Hangisi Daha Az?" : "Hangisi Daha Çok?";
        const answer = (instruction === "Hangisi Daha Az?") ? (count1 < count2 ? 'Grup 1' : 'Grup 2') : (count1 > count2 ? 'Grup 1' : 'Grup 2');

        const createGroup = (count: number, item: string) => {
            const items = Array(count).fill(item).join(' ');
            return `<div style="border: 2px solid #ccc; border-radius: 8px; padding: 1rem; text-align: center; font-size: 2rem; line-height: 1.5;">${items}</div>`;
        };
        
        question = `<div style="text-align: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${instruction}</div>
                    <div style="display: flex; justify-content: space-around; align-items: center; gap: 2rem;">
                        ${createGroup(count1, item)}
                        ${createGroup(count2, item)}
                    </div>`;
        return { problem: { question, answer, category: 'comparing-quantities' }, title };
    } else { // bigger-smaller or taller-shorter
         const instruction = Math.random() < 0.5 ? "En Büyüğü" : "En Küçüğü";
         const scales = shuffleArray([0.6, 1.0, 1.5]);
         const answer = (instruction === "En Büyüğü") ? "3. Nesne" : "1. Nesne"; // Based on sorted scales
         
         const itemsSVG = scales.map((scale, i) => 
            `<text x="${50 + i * 80}" y="50" font-size="${30 * scale}" text-anchor="middle" dominant-baseline="middle" fill="currentColor">${item}</text>`
         ).join('');

         question = `<div style="text-align: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${instruction}</div>
                    <svg viewBox="0 0 300 100">${itemsSVG}</svg>`;
         return { problem: { question, answer, category: 'comparing-quantities' }, title };
    }
};

const generateNumberRecProblem = (settings: NumberRecognitionSettings): { problem: Problem, title: string } => {
    const {type, theme, numberRange} = settings;
    const [min, max] = numberRange.split('-').map(Number);
    
    let title = "Sayıları Tanıma ve Sayma";
    let question = '', answer: string|number = '';
    
    switch(type) {
        case NumberRecognitionType.CountAndWrite: {
            title = "Nesneleri Say ve Sayısını Yaz";
            const count = getRandomInt(min, max);
            const item = getRandomItems(theme, 1)[0];
            const items = Array(count).fill(item).join(' ');
            
            question = `<div style="display: flex; align-items: center; justify-content: center; gap: 1rem; font-size: 2rem;">
                                <div style="border: 1px solid #999; padding: 0.5rem; border-radius: 4px; min-width: 150px; text-align: center;">${items}</div>
                                <span>=</span>
                                <div style="border: 2px solid #6b7280; width: 60px; height: 60px; display:inline-flex; align-items:center; justify-content:center; border-radius: 8px;"></div>
                              </div>`;
            answer = count;
            break;
        }
        case NumberRecognitionType.CountAndColor: {
            title = "İstenen Sayıda Nesneyi Boya";
            const count = getRandomInt(min, max);
            const totalItems = Math.max(count + 2, Math.floor(max * 1.2));
            const item = getRandomItems(theme, 1)[0];
            const items = Array(totalItems).fill(`<span style="font-size: 2rem; opacity: 0.3;">${item}</span>`).join(' ');
            
            question = `<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                            <div style="font-size: 3rem; font-weight: bold;">${count}</div>
                            <div style="border: 1px solid #999; padding: 1rem; border-radius: 8px; line-height: 1.5;">${items}</div>
                        </div>`;
            answer = `${count} nesne boyanır.`;
            break;
        }
        case NumberRecognitionType.ConnectTheDots: {
            title = "Noktaları Birleştirerek Resmi Tamamla";
            const numPoints = max;
            // This is a simplified representation. A real one would need path data.
            const points = Array.from({length: numPoints}, (_, i) => {
                const angle = (i / numPoints) * 2 * Math.PI;
                const r = 100 + getRandomInt(-10, 10);
                const x = 150 + r * Math.cos(angle);
                const y = 150 + r * Math.sin(angle);
                return {x, y, num: i + 1};
            });
            
            const pointsSVG = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="2" fill="black" /><text x="${p.x+5}" y="${p.y+5}" font-size="10">${p.num}</text>`).join('');
            question = `<svg viewBox="0 0 300 300">${pointsSVG}</svg>`;
            answer = `Noktalar birleştirilir.`;
            break;
        }
    }
                      
    return { problem: { question, answer, category: 'number-recognition' }, title };
};

const generatePatternsProblem = (settings: PatternsSettings): { problem: Problem, title: string } => {
    const {type, theme} = settings;
    let title = "Örüntüyü Tamamlayınız";
    
    const items = getRandomItems(theme, 3);
    let sequence: string[] = [];
    let answer = '';
    
    if(type === PatternType.Growing) {
        const start = getRandomInt(1, 5);
        sequence = [items[0].repeat(start), items[0].repeat(start + 1), ''];
        answer = items[0].repeat(start + 2);
        title = "Büyüyen Örüntüyü Tamamla";
    } else { // Repeating
        const pattern = (type === PatternType.RepeatingAB) ? [items[0], items[1]] : [items[0], items[1], items[2]];
        sequence = [...pattern, ...pattern];
        answer = sequence.shift()!; // The next item is the first one
        sequence.push('');
    }
    
    const sequenceHTML = sequence.map(item => 
        item === '' ? `<div style="width: 50px; height: 50px; border: 2px dashed #999; border-radius: 8px; display:inline-block; vertical-align: middle;"></div>`
                    : `<span style="font-size: 3rem; display:inline-block; vertical-align: middle; width: 50px; text-align: center;">${item}</span>`
    ).join('<span style="font-size: 2rem; margin: 0 0.5rem; display:inline-block; vertical-align: middle;">→</span>');

    const question = `<div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">${sequenceHTML}</div>`;
    return { problem: { question, answer, category: 'patterns' }, title };
};

const generateBasicShapesProblem = (settings: BasicShapesSettings): { problem: Problem, title: string } => {
    const { type, shapes } = settings;

    const shapeSVGMap: {[key: string]: string} = {
        [ShapeType.Circle]: `<circle cx="0" cy="0" r="20" fill="#a7f3d0" stroke="#047857" stroke-width="2" />`,
        [ShapeType.Square]: `<rect x="-20" y="-20" width="40" height="40" fill="#bae6fd" stroke="#0369a1" stroke-width="2" />`,
        [ShapeType.Triangle]: `<polygon points="0,-20 -23,20 23,20" fill="#fecaca" stroke="#b91c1c" stroke-width="2" />`,
        [ShapeType.Rectangle]: `<rect x="-25" y="-15" width="50" height="30" fill="#e9d5ff" stroke="#6b21a8" stroke-width="2" />`,
    };
    const shapeNames: {[key: string]: string} = {
        [ShapeType.Circle]: 'daire',
        [ShapeType.Square]: 'kare',
        [ShapeType.Triangle]: 'üçgen',
        [ShapeType.Rectangle]: 'dikdörtgen',
    };
    const availableShapes = [ShapeType.Circle, ShapeType.Square, ShapeType.Triangle, ShapeType.Rectangle];

    switch(type) {
        case ShapeRecognitionType.ColorShape: {
            const title = "İstenen Şekilleri Boyama";
            const targetShape = shapes[getRandomInt(0, shapes.length - 1)];
            const targetName = shapeNames[targetShape] || 'şekli';
            const instruction = `<p style="font-size: 1.2rem; text-align: center;">Tüm <b>${targetName}</b> şekillerini boya.</p>`;

            const shapePool = shuffleArray([...shapes, ...shapes, ...availableShapes, ...availableShapes]);
            let svgContent = '';
            for(let i=0; i<12; i++) {
                const shapeToDraw = shapePool[i % shapePool.length];
                const x = 50 + (i % 4) * 80 + getRandomInt(-10, 10);
                const y = 50 + Math.floor(i / 4) * 80 + getRandomInt(-10, 10);
                const scale = 0.6 + Math.random() * 0.4;
                const rotation = getRandomInt(0, 45);
                const shapeSvg = (shapeSVGMap[shapeToDraw] || shapeSVGMap[ShapeType.Circle]).replace(/fill="#[a-f0-9]+"/, 'fill="white"');
                svgContent += `<g transform="translate(${x}, ${y}) scale(${scale}) rotate(${rotation})">${shapeSvg}</g>`;
            }
            const question = `${instruction}<svg viewBox="0 0 400 300">${svgContent}</svg>`;
            const answer = `Tüm ${targetName}ler boyanır.`;
            return { problem: { question, answer, category: 'basic-shapes' }, title };
        }
        case ShapeRecognitionType.MatchObjectShape: {
            const title = "Nesne-Şekil Eşleştirme";
            const objectShapeMap: {[key: string]: ShapeType} = {
                '🍕': ShapeType.Triangle, '🏀': ShapeType.Circle, '🎁': ShapeType.Square, '📺': ShapeType.Rectangle,
                '🍉': ShapeType.Circle, '🥪': ShapeType.Triangle, '🖼️': ShapeType.Square, '✉️': ShapeType.Rectangle
            };
            const objects = Object.keys(objectShapeMap);
            const targetObject = objects[getRandomInt(0, objects.length-1)];
            const correctShape = objectShapeMap[targetObject];
            
            const distractors = availableShapes.filter(s => s !== correctShape);
            const options = shuffleArray([correctShape, ...shuffleArray(distractors).slice(0,2)]);
            
            let optionsSVG = '';
            options.forEach((shape, i) => {
                const x = 200 + i * 80;
                const y = 75;
                optionsSVG += `<g transform="translate(${x}, ${y}) scale(1.2)">${shapeSVGMap[shape]}</g>`;
            });

            const question = `<div style="display:flex; align-items: center; justify-content: center; gap: 2rem;">
                <span style="font-size: 4rem;">${targetObject}</span>
                <svg viewBox="150 0 300 150">${optionsSVG}</svg>
            </div>`;
            const answer = `Doğru şekil: ${shapeNames[correctShape]}`;
            return { problem: { question, answer, category: 'basic-shapes' }, title };
        }
        case ShapeRecognitionType.CountShapes: {
            const title = "Şekil Sayma";
            const targetShape = availableShapes[getRandomInt(0, availableShapes.length - 1)];
            const targetName = shapeNames[targetShape];
            const instruction = `<p style="font-size: 1.2rem; text-align: center;">Resimde kaç tane <b>${targetName}</b> var?</p>`;
            
            let svgContent = '';
            let count = 0;
            for(let i=0; i<15; i++) {
                const shapeToDraw = availableShapes[getRandomInt(0, availableShapes.length - 1)];
                if (shapeToDraw === targetShape) count++;
                const x = 30 + Math.random() * 340;
                const y = 30 + Math.random() * 240;
                const scale = 0.5 + Math.random() * 0.4;
                const rotation = getRandomInt(0, 90);
                svgContent += `<g transform="translate(${x}, ${y}) scale(${scale}) rotate(${rotation})">${shapeSVGMap[shapeToDraw]}</g>`;
            }
            if (count === 0 && Math.random() < 0.5) { 
                 const x = 30 + Math.random() * 340;
                 const y = 30 + Math.random() * 240;
                 svgContent += `<g transform="translate(${x}, ${y})">${shapeSVGMap[targetShape]}</g>`;
                 count = 1;
            }
            const question = `${instruction}<svg viewBox="0 0 400 300" style="border: 1px solid #ccc; border-radius: 8px;">${svgContent}</svg>`;
            const answer = String(count);
             return { problem: { question, answer, category: 'basic-shapes' }, title };
        }
        default:
            return { problem: { question: 'Bilinmeyen şekil etkinliği', answer: "Hata", category: 'basic-shapes' }, title: "Hata" };
    }
};

const generatePositionalProblem = (settings: PositionalConceptsSettings): { problem: Problem, title: string } => {
    const { type, theme, itemCount } = settings;
    const title = "Konum ve Yön Kavramları";
    const items = getRandomItems(theme, itemCount);
    const targetItem = items[0];
    
    let question = '';
    let answer = '';
    let instruction = '';

    const FONT_SIZE = 30;

    switch(type) {
        case PositionalConceptType.AboveBelow: {
            const isAbove = Math.random() < 0.5;
            instruction = isAbove ? `Masanın üstündeki ${targetItem} nesnesini daire içine al.` : `Masanın altındaki ${targetItem} nesnesini daire içine al.`;
            answer = isAbove ? 'Üstteki' : 'Alttaki';

            let itemsSVG = `<rect x="50" y="150" width="300" height="20" fill="#a16207" /><rect x="80" y="170" width="10" height="60" fill="#a16207" /><rect x="280" y="170" width="10" height="60" fill="#a16207" />`; // table
            
            const targetY = isAbove ? 130 : 210;
            itemsSVG += `<text x="${getRandomInt(80, 280)}" y="${targetY}" font-size="${FONT_SIZE}" text-anchor="middle" fill="currentColor">${targetItem}</text>`;
            
            for(let i = 1; i < itemCount; i++) {
                 const otherY = !isAbove ? 130 : 210;
                 itemsSVG += `<text x="${getRandomInt(80, 280)}" y="${otherY}" font-size="${FONT_SIZE}" text-anchor="middle" fill="currentColor">${items[i]}</text>`;
            }

            question = `<div><p style="font-size: 1.2rem; text-align: center;">${instruction}</p><svg viewBox="0 0 400 250">${itemsSVG}</svg></div>`;
            break;
        }
        // ... other cases
        default:
             question = "Hata";
             answer = "Hata";
    }

    return { problem: { question, answer, category: 'positional-concepts' }, title };
};

const generateMeasurementIntroProblem = (settings: IntroToMeasurementSettings): { problem: Problem, title: string } => {
    const { type, theme } = settings;
    let question = '';
    let answer = '';
    let instruction = '';
    let title = "Ölçmeye Giriş";

    const FONT_SIZE = 30;

    switch (type) {
        case IntroMeasurementType.CompareLength:
        case IntroMeasurementType.CompareWeight:
        case IntroMeasurementType.CompareCapacity: {
            const item = getRandomItems(theme, 1)[0];
            const [scale1, scale2] = shuffleArray([0.8, 1.5]);
            let svg1: string, svg2: string;

            if (type === IntroMeasurementType.CompareLength) {
                title = "Uzun/Kısa Karşılaştırması";
                instruction = "Hangisi daha uzun?";
                svg1 = `<rect x="10" y="${60 - (20 * scale1) / 2}" width="${100 * scale1}" height="20" fill="#3b82f6" />`;
                svg2 = `<rect x="10" y="${140 - (20 * scale2) / 2}" width="${100 * scale2}" height="20" fill="#3b82f6" />`;
                answer = scale1 > scale2 ? "1. Nesne" : "2. Nesne";
            } else if (type === IntroMeasurementType.CompareWeight) {
                title = "Ağır/Hafif Karşılaştırması";
                instruction = "Hangisi daha ağır?";
                const tilt = scale1 > scale2 ? -5 : 5;
                svg1 = `<g transform="rotate(${-tilt} 150 150)"><text x="50" y="120" font-size="${FONT_SIZE * scale1}" text-anchor="middle" fill="currentColor">${item}</text></g>`;
                svg2 = `<g transform="rotate(${-tilt} 150 150)"><text x="250" y="120" font-size="${FONT_SIZE * scale2}" text-anchor="middle" fill="currentColor">${item}</text></g>`;
                // Balance Scale SVG
                const balance = `<path d="M 150 180 L 150 50 M 100 50 L 200 50 M 100 50 L 50 150 M 200 50 L 250 150" stroke="#854d0e" stroke-width="4" fill="none" transform-origin="150 50" transform="rotate(${tilt})" />`;
                svg1 = balance + svg1 + svg2;
                svg2 = ''; // Combined into svg1
                answer = scale1 > scale2 ? "Soldaki" : "Sağdaki";
            } else { // CompareCapacity
                title = "Dolu/Boş Karşılaştırması";
                instruction = "Hangisi daha dolu?";
                const createGlass = (x: number, fill: number) => `
                    <path d="M ${x} 80 L ${x+10} 180 L ${x+70} 180 L ${x+80} 80 Z" stroke="#4b5563" fill="#e5e7eb" stroke-width="2" />
                    <rect x="${x+11}" y="${180 - 100 * fill}" width="58" height="${100 * fill}" fill="#60a5fa" />
                `;
                svg1 = createGlass(50, scale1 / 2);
                svg2 = createGlass(200, scale2 / 2);
                answer = scale1 > scale2 ? "1. Kap" : "2. Kap";
            }
            question = `<div><p style="font-size: 1.2rem; text-align: center;">${instruction}</p><svg viewBox="0 0 350 200">${svg1}${svg2}</svg></div>`;
            break;
        }
        case IntroMeasurementType.NonStandardLength: {
            title = "Standart Olmayan Birimlerle Ölçme";
            const [target, unit] = getRandomItems('measurement', 2);
            const count = getRandomInt(3, 8);
            answer = String(count);
            instruction = `${target} kaç ${unit} uzunluğundadır?`;

            const unitWidth = 25;
            const targetWidth = count * unitWidth;

            let unitsSVG = '';
            for(let i = 0; i < count; i++) {
                unitsSVG += `<text x="${50 + i * unitWidth + unitWidth/2}" y="100" font-size="20" text-anchor="middle" fill="currentColor">${unit}</text>`;
            }

            const questionSVG = `
                <text x="${50 + targetWidth/2}" y="50" font-size="30" text-anchor="middle" fill="currentColor">${target}</text>
                <line x1="50" y1="70" x2="${50 + targetWidth}" y2="70" stroke="black" stroke-dasharray="4 2" />
                <line x1="50" y1="70" x2="50" y2="30" stroke="black" stroke-dasharray="4 2" />
                <line x1="${50 + targetWidth}" y1="70" x2="${50 + targetWidth}" y2="30" stroke="black" stroke-dasharray="4 2" />
                ${unitsSVG}
            `;
            question = `<div><p style="font-size: 1.2rem; text-align: center;">${instruction}</p><svg viewBox="0 0 ${100 + targetWidth} 140">${questionSVG}</svg></div>`;
            break;
        }
    }

    return { problem: { question, answer, category: 'intro-to-measurement' }, title };
};

const generateSimpleGraphProblem = (settings: SimpleGraphsSettings): { problem: Problem, title: string, preamble?: string } => {
    const { graphType, taskType, theme, categoryCount, maxItemCount } = settings;

    // --- DATA GENERATION (common for both tasks) ---
    const categories = getRandomItems(theme, categoryCount);
    const data: {[key: string]: number} = {};
    let allObjects: string[] = [];
    
    categories.forEach(cat => {
        const count = getRandomInt(1, maxItemCount);
        data[cat] = count;
        allObjects.push(...Array(count).fill(cat));
    });
    
    allObjects = shuffleArray(allObjects);

    // --- SVG & QUESTION GENERATION ---
    const graphWidth = 400;
    const graphHeight = 250;
    const padding = 50;
    let question = '';
    let answer: string | number = '';
    let title = '';
    let preamble: string | undefined = undefined;

    if (taskType === SimpleGraphTaskType.Create) {
        // --- CREATE GRAPH TASK ---
        title = "Nesneleri Say ve Grafiği Doldur";
        preamble = "Aşağıdaki nesneleri sayın ve grafikte uygun yerleri boyayın veya işaretleyin.";
        answer = "Grafiği doldurunuz.";

        const dataSVG = `<div style="font-size: 2.5rem; text-align: center; line-height: 1.5; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 8px; margin-bottom: 1.5rem; background-color: #f9fafb;">${allObjects.join(' ')}</div>`;
        let graphSVG = '';

        if (graphType === SimpleGraphType.Pictograph) {
            const rowHeight = (graphHeight - padding) / categoryCount;
            graphSVG += `<g>`;
            for(let i = 0; i < categoryCount; i++) {
                const y = rowHeight * i + rowHeight / 2 + padding / 2;
                graphSVG += `<text x="${padding - 15}" y="${y}" font-size="30" text-anchor="end" dominant-baseline="middle" fill="currentColor">${categories[i]}</text>`;
                for (let j = 0; j < maxItemCount; j++) {
                    graphSVG += `<rect x="${padding + 10 + j * 40}" y="${y - 18}" width="36" height="36" fill="#f9fafb" stroke="#d1d5db" stroke-width="1.5" rx="4" />`;
                }
            }
            graphSVG += `</g>`;
        } else { // BarChart
            const barWidth = (graphWidth - padding * 2) / categoryCount;
            // Y Axis
            graphSVG += `<g font-size="12px" fill="#4b5563">`;
            for (let i = 0; i <= maxItemCount; i++) {
                const y = graphHeight - padding - (i * (graphHeight - padding * 1.5) / maxItemCount);
                graphSVG += `<text x="${padding - 10}" y="${y}" text-anchor="end" dominant-baseline="middle">${i}</text>`;
                graphSVG += `<line x1="${padding - 5}" y1="${y}" x2="${graphWidth - padding}" y2="${y}" stroke="#e5e7eb" stroke-width="1" />`;
            }
            graphSVG += `</g>`;
            // X Axis
            graphSVG += `<g font-size="24px">`;
            for (let i = 0; i < categoryCount; i++) {
                const x = padding + i * barWidth + barWidth / 2;
                graphSVG += `<text x="${x}" y="${graphHeight - padding + 25}" text-anchor="middle" fill="currentColor">${categories[i]}</text>`;
            }
            graphSVG += `</g>`;
            // Axis Lines
            graphSVG += `<path d="M ${padding} ${padding/2} L ${padding} ${graphHeight - padding} L ${graphWidth - padding} ${graphHeight - padding}" stroke="#4b5563" stroke-width="2" fill="none" />`;
        }
        
        question = `${dataSVG}<svg viewBox="0 0 ${graphWidth} ${graphHeight}" width="100%">${graphSVG}</svg>`;
    
    } else { // taskType === SimpleGraphTaskType.Read
        // --- READ GRAPH TASK ---
        title = "Grafiği Oku ve Soruyu Cevapla";
        let graphSVG = '';
        
        // Draw FILLED graph
        if (graphType === SimpleGraphType.Pictograph) {
            const rowHeight = (graphHeight - padding) / categoryCount;
            graphSVG += `<g>`;
            for(let i = 0; i < categoryCount; i++) {
                const y = rowHeight * i + rowHeight / 2 + padding / 2;
                const category = categories[i];
                const count = data[category];
                graphSVG += `<text x="${padding - 15}" y="${y}" font-size="30" text-anchor="end" dominant-baseline="middle" fill="currentColor">${category}</text>`;
                for (let j = 0; j < count; j++) {
                     graphSVG += `<text x="${padding + 10 + j * 40 + 18}" y="${y}" font-size="30" text-anchor="middle" dominant-baseline="middle" fill="currentColor">${category}</text>`;
                }
            }
            graphSVG += `</g>`;
        } else { // BarChart
            const barWidth = (graphWidth - padding * 2) / categoryCount;
            const barSpacing = barWidth * 0.2;
            const actualBarWidth = barWidth - barSpacing;

            // Y Axis (same as create)
            graphSVG += `<g font-size="12px" fill="#4b5563">`;
            for (let i = 0; i <= maxItemCount; i++) {
                const y = graphHeight - padding - (i * (graphHeight - padding * 1.5) / maxItemCount);
                graphSVG += `<text x="${padding - 10}" y="${y}" text-anchor="end" dominant-baseline="middle">${i}</text>`;
                graphSVG += `<line x1="${padding - 5}" y1="${y}" x2="${graphWidth - padding}" y2="${y}" stroke="#e5e7eb" stroke-width="1" />`;
            }
            graphSVG += `</g>`;

            // Draw Bars
            for (let i = 0; i < categoryCount; i++) {
                const category = categories[i];
                const count = data[category];
                const barHeight = (count / maxItemCount) * (graphHeight - padding * 1.5);
                const x = padding + i * barWidth + barSpacing / 2;
                const y = graphHeight - padding - barHeight;
                graphSVG += `<rect x="${x}" y="${y}" width="${actualBarWidth}" height="${barHeight}" fill="#60a5fa" rx="2" />`;
            }

            // X Axis (same as create, but drawn after bars to be on top if needed)
            graphSVG += `<g font-size="24px">`;
            for (let i = 0; i < categoryCount; i++) {
                const x = padding + i * barWidth + barWidth / 2;
                graphSVG += `<text x="${x}" y="${graphHeight - padding + 25}" text-anchor="middle" fill="currentColor">${categories[i]}</text>`;
            }
            graphSVG += `</g>`;
            graphSVG += `<path d="M ${padding} ${padding/2} L ${padding} ${graphHeight - padding} L ${graphWidth - padding} ${graphHeight - padding}" stroke="#4b5563" stroke-width="2" fill="none" />`;
        }
        
        // Generate question about the graph
        const maxValue = Math.max(...Object.values(data));
        const maxItems = Object.keys(data).filter(key => data[key] === maxValue);
        const minValue = Math.min(...Object.values(data));
        const minItems = Object.keys(data).filter(key => data[key] === minValue);

        const questionPool = [];
        if (maxItems.length === 1) {
            questionPool.push({ q: `Grafiğe göre <b>en çok</b> hangi nesneden vardır?`, a: maxItems[0] });
        }
        if (minItems.length === 1 && maxValue !== minValue) {
            questionPool.push({ q: `Grafiğe göre <b>en az</b> hangi nesneden vardır?`, a: minItems[0] });
        }
        const randomCat = categories[getRandomInt(0, categories.length - 1)];
        questionPool.push({ q: `Grafikte toplam kaç tane <b>${randomCat}</b> vardır?`, a: data[randomCat] });
        
        const twoCats = shuffleArray(categories).slice(0, 2);
        if (twoCats.length === 2 && data[twoCats[0]] !== data[twoCats[1]]) {
            const more = data[twoCats[0]] > data[twoCats[1]] ? twoCats[0] : twoCats[1];
            questionPool.push({ q: `<b>${twoCats[0]}</b> mı daha çok, yoksa <b>${twoCats[1]}</b> mi?`, a: more });
        }
        
        const selectedQuestion = questionPool[getRandomInt(0, questionPool.length - 1)];
        const graphQuestionText = `<p style="font-size: 1.2rem; text-align: center; margin-top: 1.5rem;">${selectedQuestion.q}</p>`;

        question = `<svg viewBox="0 0 ${graphWidth} ${graphHeight}" width="100%">${graphSVG}</svg>${graphQuestionText}`;
        answer = selectedQuestion.a;
    }
    
    return { problem: { question, answer, category: 'simple-graphs' }, title, preamble };
};


const generateVisualAdditionSubtractionProblem = (settings: VisualAdditionSubtractionSettings): { problem: Problem, title: string } => {
    const { operation, theme, maxNumber } = settings;
    const title = "Şekillerle Toplama ve Çıkarma";
    const currentOp = operation === 'mixed' ? (Math.random() < 0.5 ? 'addition' : 'subtraction') : operation;
    const item = getRandomItems(theme, 1)[0];

    let n1 = getRandomInt(1, maxNumber);
    let n2 = getRandomInt(1, maxNumber);
    let question = '', answer: number | string = 0;

    if (currentOp === 'addition') {
        if (n1 + n2 > maxNumber * 1.5) { // Keep result from being too large
            n1 = getRandomInt(1, Math.floor(maxNumber / 1.5));
            n2 = getRandomInt(1, Math.floor(maxNumber / 1.5));
        }
        answer = n1 + n2;
        question = `<div style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 1rem;"><span>${item.repeat(n1)}</span> <span>+</span> <span>${item.repeat(n2)}</span> <span>=</span> <span style="border: 2px solid #6b7280; width: 80px; height: 60px; display: inline-block; border-radius: 8px;"></span></div>`;
    } else { // subtraction
        if (n1 < n2) [n1, n2] = [n2, n1];
        if (n1 === n2) n1 += 1;
        answer = n1 - n2;
        question = `<div style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 1rem;"><span>${item.repeat(n1)}</span> <span>-</span> <span>${item.repeat(n2)}</span> <span>=</span> <span style="border: 2px solid #6b7280; width: 80px; height: 60px; display: inline-block; border-radius: 8px;"></span></div>`;
    }

    return { problem: { question, answer, category: 'visual-addition-subtraction' }, title };
};

const generateVerbalArithmeticProblem = (settings: VerbalArithmeticSettings): { problem: Problem, title: string } => {
    const { operation, maxResult } = settings;
    const title = "Aşağıdaki İşlemleri Yazıyla İfade Ediniz";
    let n1 = getRandomInt(1, maxResult - 1);
    let n2 = getRandomInt(1, maxResult - n1);
    let verbalAnswer = '';
    let equation = '';
    let result = 0;

    const currentOp = operation === 'mixed' ? (Math.random() < 0.5 ? 'addition' : 'subtraction') : operation;

    if (currentOp === 'addition') {
        result = n1 + n2;
        equation = `${n1} + ${n2} = ${result}`;
        verbalAnswer = `${numberToWords(n1)} artı ${numberToWords(n2)} eşittir ${numberToWords(result)}`;
    } else { // subtraction
        if (n1 < n2) [n1, n2] = [n2, n1];
        if (n1 === n2) n1 += 1;
        result = n1 - n2;
        equation = `${n1} - ${n2} = ${result}`;
        verbalAnswer = `${numberToWords(n1)} eksi ${numberToWords(n2)} eşittir ${numberToWords(result)}`;
    }

    const writingSpace = `<div style="border-bottom: 1.5px dotted #9ca3af; height: 1.5em; margin-top: 0.75rem; margin-bottom: 0.5rem;"></div>`;

    const question = `
        <div style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 1.2rem; width: 100%;">
            <span style="font-family: monospace; font-weight: bold;">${equation}</span>
            ${writingSpace}
        </div>`;

    return { problem: { question, answer: verbalAnswer, category: 'verbal-arithmetic' }, title };
};

const generateMissingNumberPuzzlesProblem = (settings: MissingNumberPuzzlesSettings): { problem: Problem, title: string } => {
    const { operation, termCount, maxResult } = settings;
    const title = "Eksik Sayıyı Bulma";
    const dot = '●';
    const box = `<span style="display: inline-block; border: 2px solid #6b7280; width: 40px; height: 40px; border-radius: 8px; vertical-align: middle;"></span>`;
    const termDiv = (num: number) => `<div>${num}<br/><span style="font-size: 1rem; color: #6b7280; line-height: 1;">${dot.repeat(num)}</span></div>`;

    let question = '', answer = 0;
    const containerStyle = `font-size: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-align: center;`;

    if (operation === 'addition') {
        if (termCount === 2) {
            const result = getRandomInt(2, maxResult);
            const n1 = getRandomInt(1, result - 1);
            const n2 = result - n1;
            const missingPart = getRandomInt(1, 3);
            if (missingPart === 1) {
                question = `<div style="${containerStyle}">${box} + ${termDiv(n2)} = ${termDiv(result)}</div>`;
                answer = n1;
            } else if (missingPart === 2) {
                question = `<div style="${containerStyle}">${termDiv(n1)} + ${box} = ${termDiv(result)}</div>`;
                answer = n2;
            } else {
                question = `<div style="${containerStyle}">${termDiv(n1)} + ${termDiv(n2)} = ${box}</div>`;
                answer = result;
            }
        } else { // 3 terms
            const result = getRandomInt(3, maxResult);
            const n1 = getRandomInt(1, result - 2);
            const n2 = getRandomInt(1, result - n1 - 1);
            const n3 = result - n1 - n2;
            answer = n3; // for simplicity, always miss n3
            question = `<div style="${containerStyle}">${termDiv(n1)} + ${termDiv(n2)} + ${box} = ${termDiv(result)}</div>`;
        }
    } else { // subtraction
        const n1 = getRandomInt(2, maxResult);
        const n2 = getRandomInt(1, n1 - 1);
        const result = n1 - n2;
        const missingPart = getRandomInt(1, 3);
        if (missingPart === 1) {
             question = `<div style="${containerStyle}">${box} - ${termDiv(n2)} = ${termDiv(result)}</div>`;
             answer = n1;
        } else if (missingPart === 2) {
             question = `<div style="${containerStyle}">${termDiv(n1)} - ${box} = ${termDiv(result)}</div>`;
             answer = n2;
        } else {
             question = `<div style="${containerStyle}">${termDiv(n1)} - ${termDiv(n2)} = ${box}</div>`;
             answer = result;
        }
    }

    return { problem: { question, answer, category: 'missing-number-puzzles' }, title };
};

const generateSymbolicArithmeticProblem = (settings: SymbolicArithmeticSettings): { problem: Problem, title: string, preamble?: string } => {
    const { operation, theme, maxNumber } = settings;
    const title = "Simgelerle İşlemler";
    const items = getRandomItems(theme, maxNumber);
    
    const symbolMap = new Map<string, number>();
    const keyParts: string[] = [];
    items.forEach((item, index) => {
        const value = index + 1;
        symbolMap.set(item, value);
        keyParts.push(`<span style="font-size: 1.5rem; margin-right: 1rem;">${item} = ${value}</span>`);
    });
    
    const preamble = `<div style="text-align: center; margin-bottom: 1.5rem; padding: 0.5rem; border: 1px solid #ccc; border-radius: 8px;"><b>Simge Anahtarı:</b><br/>${keyParts.join(' ')}</div>`;

    const currentOp = operation === 'mixed' ? (Math.random() < 0.5 ? 'addition' : 'subtraction') : operation;
    
    let s1 = items[getRandomInt(0, items.length - 1)];
    let s2 = items[getRandomInt(0, items.length - 1)];
    let v1 = symbolMap.get(s1)!;
    let v2 = symbolMap.get(s2)!;
    
    let question = '', answer = 0;
    
    if (currentOp === 'addition') {
        question = `<div style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; gap: 1rem;"><span>${s1}</span> <span>+</span> <span>${s2}</span> <span>=</span> <span style="border: 2px solid #6b7280; width: 80px; height: 60px; display: inline-block; border-radius: 8px;"></span></div>`;
        answer = v1 + v2;
    } else { // subtraction
        if (v1 < v2) {
            [v1, v2] = [v2, v1];
            [s1, s2] = [s2, s1];
        }
        question = `<div style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; gap: 1rem;"><span>${s1}</span> <span>-</span> <span>${s2}</span> <span>=</span> <span style="border: 2px solid #6b7280; width: 80px; height: 60px; display: inline-block; border-radius: 8px;"></span></div>`;
        answer = v1 - v2;
    }

    return { problem: { question, answer, category: 'symbolic-arithmetic' }, title, preamble };
};

const generateProblemCreationProblem = (settings: ProblemCreationSettings): { problem: Problem, title: string } => {
    const { operation, difficulty, theme } = settings;
    const title = "Problem Kurma";

    const maxResult = difficulty === 'easy' ? 20 : (difficulty === 'medium' ? 100 : 1000);
    const item = getRandomItems(theme, 1)[0];
    
    let equation = '';
    
    if (operation === 'addition') {
        const n1 = getRandomInt(1, maxResult - 1);
        const n2 = getRandomInt(1, maxResult - n1);
        equation = `${n1} + ${n2} = ${n1 + n2}`;
    } else { // subtraction
        const n1 = getRandomInt(2, maxResult);
        const n2 = getRandomInt(1, n1 - 1);
        equation = `${n1} - ${n2} = ${n1 - n2}`;
    }

    const question = `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <p>Aşağıdaki işlemi ve görseli kullanarak bir problem yazınız.</p>
            <div style="display: flex; align-items: center; gap: 2rem; background-color: #f3f4f6; padding: 1rem; border-radius: 8px;">
                <span style="font-size: 2.5rem;">${item}</span>
                <span style="font-size: 1.5rem; font-family: monospace; font-weight: bold;">${equation}</span>
            </div>
            <div style="border: 1px dashed #9ca3af; height: 120px; border-radius: 8px; margin-top: 0.5rem; padding: 0.5rem;">
                <p style="color: #9ca3af; font-size: 0.9rem;">Probleminizi buraya yazın...</p>
            </div>
        </div>
    `;

    return { problem: { question, answer: "Öğrenci yanıtı", category: 'problem-creation' }, title };
};


export const generateReadinessProblem = (
    module: string,
    settings: any
): { problem: Problem, title: string, error?: string, preamble?: string } => {
    switch (module) {
        case 'matching-and-sorting':
            return generateMatchingProblem(settings as MatchingAndSortingSettings);
        case 'comparing-quantities':
            return generateComparingProblem(settings as ComparingQuantitiesSettings);
        case 'number-recognition':
            return generateNumberRecProblem(settings as NumberRecognitionSettings);
        case 'patterns':
            return generatePatternsProblem(settings as PatternsSettings);
        case 'basic-shapes':
            return generateBasicShapesProblem(settings as BasicShapesSettings);
        case 'positional-concepts':
            return generatePositionalProblem(settings as PositionalConceptsSettings);
        case 'intro-to-measurement':
            return generateMeasurementIntroProblem(settings as IntroToMeasurementSettings);
        case 'simple-graphs':
            return generateSimpleGraphProblem(settings as SimpleGraphsSettings);
        case 'visual-addition-subtraction':
            return generateVisualAdditionSubtractionProblem(settings as VisualAdditionSubtractionSettings);
        case 'verbal-arithmetic':
            return generateVerbalArithmeticProblem(settings as VerbalArithmeticSettings);
        case 'missing-number-puzzles':
            return generateMissingNumberPuzzlesProblem(settings as MissingNumberPuzzlesSettings);
        case 'symbolic-arithmetic':
            return generateSymbolicArithmeticProblem(settings as SymbolicArithmeticSettings);
        case 'problem-creation':
            return generateProblemCreationProblem(settings as ProblemCreationSettings);
        default:
            return {
                problem: { question: "Hata", answer: "Hata", category: 'error' },
                title: "Geçersiz Modül",
                error: "Bilinmeyen bir hazırlık modülü seçildi."
            };
    }
};