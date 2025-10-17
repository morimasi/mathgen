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
    const title = "Ölçmeye Giriş";
    let question = "Ölçme problemi";
    let answer = "cevap";
    return { problem: { question, answer, category: 'intro-to-measurement' }, title };
};

const generateSimpleGraphProblem = (settings: SimpleGraphsSettings): { problem: Problem, title: string } => {
    const title = "Basit Grafikler";
    let question = "Grafik problemi";
    let answer = "cevap";
    return { problem: { question, answer, category: 'simple-graphs' }, title };
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