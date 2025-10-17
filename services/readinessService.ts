import { Problem, MatchingAndSortingSettings, ComparingQuantitiesSettings, NumberRecognitionSettings, PatternsSettings, BasicShapesSettings, ShapeType, PositionalConceptsSettings, IntroToMeasurementSettings, SimpleGraphsSettings, PositionalConceptType, IntroMeasurementType, SimpleGraphType } from '../types';

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
    const height = 50 * itemCount;
    const FONT_SIZE = 30;

    let col1SVG = '';
    let col2SVG = '';
    for(let i = 0; i < itemCount; i++) {
        const y = (i * 50) + FONT_SIZE;
        col1SVG += `<text x="50" y="${y}" font-size="${FONT_SIZE}" text-anchor="middle" dominant-baseline="middle">${items[i]}</text>`;
        
        const itemToDraw = type === 'shadow' ? 
            `<text x="250" y="${y}" font-size="${FONT_SIZE}" text-anchor="middle" dominant-baseline="middle" fill="black" opacity="0.6">${shuffledItems[i]}</text>` :
            `<text x="250" y="${y}" font-size="${FONT_SIZE}" text-anchor="middle" dominant-baseline="middle">${shuffledItems[i]}</text>`;
        col2SVG += itemToDraw;
    }
    
    const question = `<svg viewBox="0 0 ${width} ${height}" style="max-height: 400px; width: auto;">${col1SVG}${col2SVG}</svg>`;

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
            `<text x="${50 + i * 80}" y="50" font-size="${30 * scale}" text-anchor="middle" dominant-baseline="middle">${item}</text>`
         ).join('');

         question = `<div style="text-align: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${instruction}</div>
                    <svg viewBox="0 0 300 100">${itemsSVG}</svg>`;
         return { problem: { question, answer, category: 'comparing-quantities' }, title };
    }
};

const generateNumberRecProblem = (settings: NumberRecognitionSettings): { problem: Problem, title: string } => {
    // This is a placeholder as this module requires more complex logic.
    const {type, theme, numberRange} = settings;
    const title = "Sayıları Tanıma ve Sayma";
    const [min, max] = numberRange.split('-').map(Number);
    
    const count = getRandomInt(min, max);
    const item = getRandomItems(theme, 1)[0];
    const items = Array(count).fill(item).join(' ');
    
    const question = `<div style="display: flex; align-items: center; gap: 1rem; font-size: 2rem;">
                        <div style="border: 1px solid #999; padding: 0.5rem; border-radius: 4px; min-width: 150px; text-align: center;">${items}</div>
                        <span>=</span>
                        <div style="border: 1px solid #999; padding: 0.5rem; width: 60px; height: 60px; border-radius: 4px;"></div>
                      </div>`;
                      
    return { problem: { question, answer: count, category: 'number-recognition' }, title };
};

const generatePatternsProblem = (settings: PatternsSettings): { problem: Problem, title: string } => {
    // This is a placeholder
    const {type, theme} = settings;
    const title = "Örüntüyü Tamamlayınız";
    
    const items = getRandomItems(theme, 3);
    let sequence: string[] = [];
    let answer = '';
    
    if(type === 'repeating-ab') {
        sequence = [items[0], items[1], items[0], items[1], ''];
        answer = items[0];
    } else if (type === 'repeating-abc') {
        sequence = [items[0], items[1], items[2], items[0], items[1], ''];
        answer = items[2];
    } else { // growing
        const start = getRandomInt(1, 5);
        sequence = [String(start), String(start + 1), String(start + 2), ''];
        answer = String(start + 3);
    }
    
    const sequenceHTML = sequence.map(item => 
        item === '' ? `<div style="width: 50px; height: 50px; border: 2px dashed #999; border-radius: 8px;"></div>`
                    : `<span style="font-size: 3rem;">${item}</span>`
    ).join('<span style="font-size: 2rem; margin: 0 0.5rem;">→</span>');

    const question = `<div style="display: flex; align-items: center; gap: 0.5rem;">${sequenceHTML}</div>`;
    return { problem: { question, answer, category: 'patterns' }, title };
};

const generateBasicShapesProblem = (settings: BasicShapesSettings): { problem: Problem, title: string } => {
    // This is a placeholder
    const title = "Şekilleri Tanıma";
    const question = `<div style="font-size: 3rem;">🔺 🔵 🟥 🔵 🟥</div>`;
    return { problem: { question, answer: "Görsel", category: 'basic-shapes' }, title };
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
            itemsSVG += `<text x="${getRandomInt(80, 280)}" y="${targetY}" font-size="${FONT_SIZE}" text-anchor="middle">${targetItem}</text>`;
            
            for(let i = 1; i < itemCount; i++) {
                 const otherY = !isAbove ? 130 : 210;
                 itemsSVG += `<text x="${getRandomInt(80, 280)}" y="${otherY}" font-size="${FONT_SIZE}" text-anchor="middle">${items[i]}</text>`;
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
                svg1 = `<g transform="rotate(${-tilt} 150 150)"><text x="50" y="120" font-size="${FONT_SIZE * scale1}" text-anchor="middle">${item}</text></g>`;
                svg2 = `<g transform="rotate(${-tilt} 150 150)"><text x="250" y="120" font-size="${FONT_SIZE * scale2}" text-anchor="middle">${item}</text></g>`;
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
                unitsSVG += `<text x="${50 + i * unitWidth + unitWidth/2}" y="100" font-size="20" text-anchor="middle">${unit}</text>`;
            }

            const questionSVG = `
                <text x="${50 + targetWidth/2}" y="50" font-size="30" text-anchor="middle">${target}</text>
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

const generateSimpleGraphProblem = (settings: SimpleGraphsSettings): { problem: Problem, title: string } => {
    const { graphType, theme, categoryCount, maxItemCount } = settings;
    const title = "Nesneleri Say ve Grafiği Doldur";
    const instruction = "Yukarıdaki nesneleri sayın ve grafikte uygun yerleri boyayın/işaretleyin.";
    
    const categories = getRandomItems(theme, categoryCount);
    const data: {[key: string]: number} = {};
    let allObjects: string[] = [];
    
    categories.forEach(cat => {
        const count = getRandomInt(1, maxItemCount);
        data[cat] = count;
        allObjects.push(...Array(count).fill(cat));
    });
    
    allObjects = shuffleArray(allObjects);

    const dataSVG = `<div style="font-size: 2.5rem; text-align: center; line-height: 1.5; padding: 1rem; border: 2px solid #ccc; border-radius: 8px; margin-bottom: 1.5rem;">${allObjects.join(' ')}</div>`;

    let graphSVG = '';
    const graphWidth = 400;
    const graphHeight = 250;
    const padding = 50;

    if (graphType === SimpleGraphType.Pictograph) {
        const rowHeight = (graphHeight - padding) / categoryCount;
        graphSVG += `<g>`;
        for(let i = 0; i < categoryCount; i++) {
            const y = rowHeight * i + rowHeight / 2 + padding / 2;
            graphSVG += `<text x="${padding - 10}" y="${y}" font-size="30" text-anchor="end" dominant-baseline="middle">${categories[i]}</text>`;
            for (let j = 0; j < maxItemCount; j++) {
                graphSVG += `<rect x="${padding + 10 + j * 40}" y="${y - 18}" width="36" height="36" fill="#f3f4f6" stroke="#d1d5db" />`;
            }
        }
        graphSVG += `</g>`;
    } else { // BarChart
        const barWidth = (graphWidth - padding * 2) / categoryCount;
        // Y Axis
        for (let i = 0; i <= maxItemCount; i++) {
            const y = graphHeight - padding - (i * (graphHeight - padding * 1.5) / maxItemCount);
            graphSVG += `<text x="${padding - 10}" y="${y}" text-anchor="end" dominant-baseline="middle">${i}</text>`;
            graphSVG += `<line x1="${padding - 5}" y1="${y}" x2="${graphWidth - padding}" y2="${y}" stroke="#e5e7eb" />`;
        }
        // X Axis
        for (let i = 0; i < categoryCount; i++) {
            const x = padding + i * barWidth + barWidth / 2;
            graphSVG += `<text x="${x}" y="${graphHeight - padding + 20}" text-anchor="middle" font-size="24">${categories[i]}</text>`;
        }
        graphSVG += `<line x1="${padding}" y1="${graphHeight - padding}" x2="${graphWidth - padding}" y2="${graphHeight - padding}" stroke="black" />`;
        graphSVG += `<line x1="${padding}" y1="${padding/2}" x2="${padding}" y2="${graphHeight - padding}" stroke="black" />`;
    }

    const question = `
        <div>
            <p style="font-size: 1.2rem; text-align: center; margin-bottom: 0.5rem;">${instruction}</p>
            ${dataSVG}
            <svg viewBox="0 0 ${graphWidth} ${graphHeight}">${graphSVG}</svg>
        </div>
    `;

    return { problem: { question, answer: "Grafiği doldurunuz.", category: 'simple-graphs' }, title };
};

export const generateReadinessProblem = (
    module: string,
    settings: any
): { problem: Problem, title: string, error?: string } => {
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
        default:
            return {
                problem: { question: "Hata", answer: "Hata", category: 'error' },
                title: "Geçersiz Modül",
                error: "Bilinmeyen bir hazırlık modülü seçildi."
            };
    }
};