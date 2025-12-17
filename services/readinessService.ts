// services/readinessService.ts

import { Problem, MathReadinessTheme, MatchingType, ComparisonType, NumberRecognitionType, PatternType, ShapeRecognitionType, PositionalConceptType, IntroMeasurementType, SimpleGraphActivityType, ShapeType, SimpleGraphsSettings, VerbalArithmeticSettings, VerbalArithmeticActivityType } from '../types.ts';
import { numberToWords } from './utils.ts';
import { draw2DShape, drawSymmetryLine, drawDice, drawDomino, drawRuler } from './svgService.ts';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const THEME_OBJECTS: { [key in MathReadinessTheme | 'measurement']: string[] } = {
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
    vehicles: ['🚗', '🚕', '🚙', '🚌', '🏎', '🚓', '🚑', '🚒', '🚚', '🚜', '🚲', '🛵', '🏍', '✈️', '🚀', '⛵️'],
    fruits: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝', '🥥'],
    shapes: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫️', '⚪️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛️', '⬜️', '🔶', '🔷', '🔸', '🔹'],
    measurement: ['📏', '📐', '⚖️', '🌡️', '⏰'],
    mixed: [],
};
THEME_OBJECTS.mixed = [...THEME_OBJECTS.animals, ...THEME_OBJECTS.vehicles, ...THEME_OBJECTS.fruits, ...THEME_OBJECTS.shapes];

const getThemeItems = (theme: MathReadinessTheme, count: number, allowDuplicates = false): string[] => {
    const validThemes = Object.keys(THEME_OBJECTS).filter(k => k !== 'mixed' && k !== 'measurement') as MathReadinessTheme[];
    const themeKey = theme === 'mixed' ? validThemes[getRandomInt(0, validThemes.length - 1)] : theme;
    const source = THEME_OBJECTS[themeKey];
    if(allowDuplicates) {
        return Array.from({ length: count }, () => source[getRandomInt(0, source.length - 1)]);
    }
    return shuffleArray(source).slice(0, count);
};

const shapeSVGs: Record<ShapeType, string> = {
    [ShapeType.Square]: `<rect x="10" y="10" width="80" height="80" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>`,
    [ShapeType.Rectangle]: `<rect x="10" y="25" width="80" height="50" fill="#a5f3fc" stroke="#0891b2" stroke-width="2"/>`,
    [ShapeType.Triangle]: `<polygon points="50,10 90,90 10,90" fill="#d9f99d" stroke="#65a30d" stroke-width="2"/>`,
    [ShapeType.Circle]: `<circle cx="50" cy="50" r="40" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>`,
    [ShapeType.Parallelogram]: `<polygon points="30,80 100,80 80,20 10,20" fill="#e9d5ff" stroke="#9333ea" stroke-width="2"/>`,
    [ShapeType.Trapezoid]: `<polygon points="40,20 80,20 100,80 20,80" fill="#fed7aa" stroke="#f97316" stroke-width="2"/>`,
    [ShapeType.Pentagon]: `<polygon points="50,10 95,40 75,90 25,90 5,40" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>`,
    [ShapeType.Hexagon]: `<polygon points="30,25 70,25 90,50 70,75 30,75 10,50" fill="#fbcfe8" stroke="#db2777" stroke-width="2"/>`,
    [ShapeType.Rhombus]: `<polygon points="50,10 90,50 50,90 10,50" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/>`,
    [ShapeType.Star]: `<polygon points="50,10 60,40 95,40 65,60 75,95 50,75 25,95 35,60 5,40 40,40" fill="#fef08a" stroke="#eab308" stroke-width="2"/>`,
};


// --- GENERATOR FUNCTIONS ---

const generateMatchingAndSorting = (settings: any): { problem: Problem, title: string } => {
    const { type, theme, itemCount, letterSpacing, letterHorizontalSpacing } = settings;
    let title = 'Eşleştirme ve Gruplama';
    let question = '';

    const verticalGap = letterSpacing ?? 2;
    const horizontalGap = letterHorizontalSpacing ?? 4;
    
    const matchingContainerStyle = `style="gap: ${horizontalGap}rem;"`;
    const matchingColStyle = `style="gap: ${verticalGap}rem;"`;

    switch(type) {
        case MatchingType.OneToOne:
            title = 'Bire Bir Eşleştirme';
            const items = getThemeItems(theme, itemCount);
            const shuffledItems = shuffleArray(items);
            const leftCol = items.map(item => `<div class="matching-item">${item}</div>`).join('');
            const rightCol = shuffledItems.map(item => `<div class="matching-item">${item}</div>`).join('');
            question = `<p>Soldaki nesneleri sağdaki aynı nesnelerle eşleştir.</p><div class="matching-container" ${matchingContainerStyle}><div class="matching-col" ${matchingColStyle}>${leftCol}</div><div class="matching-col" ${matchingColStyle}>${rightCol}</div></div>`;
            break;

        case MatchingType.Shadow:
             title = 'Gölge Eşleştirme';
             const shadowItems = getThemeItems(theme, itemCount);
             const shuffledShadows = shuffleArray(shadowItems);
             const leftColItems = shadowItems.map(item => `<div class="matching-item">${item}</div>`).join('');
             const rightColShadows = shuffledShadows.map(item => `<div class="matching-item shadow">${item}</div>`).join('');
             question = `<p>Soldaki nesneleri sağdaki gölgeleriyle eşleştir.</p><div class="matching-container" ${matchingContainerStyle}><div class="matching-col" ${matchingColStyle}>${leftColItems}</div><div class="matching-col" ${matchingColStyle}>${rightColShadows}</div></div>`;
            break;
            
        case MatchingType.ByProperty:
            title = 'Özelliğe Göre Gruplama';
            const groupingGapStyle = `style="gap: ${verticalGap}rem;"`;
            const category1Items = getThemeItems('animals', 3, true);
            const category2Items = getThemeItems('vehicles', 3, true);
            const allItems = shuffleArray([...category1Items, ...category2Items]);
            question = `<p>Nesneleri doğru gruplara ayır.</p>
                        <div class="grouping-container" ${groupingGapStyle}>${allItems.map(i => `<span>${i}</span>`).join('')}</div>
                        <div class="matching-container" ${matchingContainerStyle}>
                            <div class="grouping-box"><b>Hayvanlar</b></div>
                            <div class="grouping-box"><b>Taşıtlar</b></div>
                        </div>`;
            break;
        
        case MatchingType.LetterMatching:
            title = 'Harf Eşleştirme';
            const alphabet = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');
            const letters = shuffleArray(alphabet).slice(0, itemCount);
            const shuffledLetters = shuffleArray(letters);
            const finalLetterStyle = `font-size: 4rem; font-weight: bold; font-family: sans-serif; padding: 0.5rem;`;
            const finalLeftColLetters = letters.map(letter => `<div class="matching-item" style="${finalLetterStyle}">${letter}</div>`).join('');
            const finalRightColLetters = shuffledLetters.map(letter => `<div class="matching-item" style="${finalLetterStyle}">${letter}</div>`).join('');
            
            question = `<p>Soldaki harfleri sağdaki aynı harflerle eşleştir.</p>
                        <div class="matching-container" ${matchingContainerStyle}>
                            <div class="matching-col" ${matchingColStyle}>${finalLeftColLetters}</div>
                            <div class="matching-col" ${matchingColStyle}>${finalRightColLetters}</div>
                        </div>`;
            break;
    }
    return { problem: { question, answer: "Eşleştirme", category: 'matching-and-sorting', display: 'flow' }, title };
};

const generateComparingQuantities = (settings: any): { problem: Problem, title: string } => {
    const { type, theme, maxObjectCount } = settings;
    let title = 'Miktarları Karşılaştırma';
    const items = getThemeItems(theme, 2);
    let question = '';

    switch(type) {
        case ComparisonType.MoreLess:
            title = 'Az - Çok';
            const count1 = getRandomInt(1, maxObjectCount);
            let count2 = getRandomInt(1, maxObjectCount);
            while(count1 === count2) count2 = getRandomInt(1, maxObjectCount);
            const moreIsLeft = count1 > count2;
            question = `<p>Hangi kutuda <b>daha ${moreIsLeft ? 'az' : 'çok'}</b> nesne var? İşaretle.</p><div class="comparison-container"><div class="comparison-group">${items[0].repeat(count1)}</div><div class="comparison-group">${items[1].repeat(count2)}</div></div>`;
            break;
        case ComparisonType.BiggerSmaller:
            title = 'Büyük - Küçük';
            const isBiggerLeft = Math.random() < 0.5;
            question = `<p><b>Daha ${isBiggerLeft ? 'küçük' : 'büyük'}</b> olanı işaretle.</p><div class="comparison-container"><div class="comparison-item" style="transform: scale(1.5);">${items[0]}</div><div class="comparison-item">${items[1]}</div></div>`;
            break;
        case ComparisonType.TallerShorter:
             title = 'Uzun - Kısa';
             const isTallerLeft = Math.random() < 0.5;
             const tallItem = '🦒';
             const shortItem = '🐈';
             question = `<p><b>Daha ${isTallerLeft ? 'kısa' : 'uzun'}</b> olanı işaretle.</p><div class="comparison-container" style="align-items: flex-end; font-size: 3rem;"><div class="comparison-item">${isTallerLeft ? tallItem : shortItem}</div><div class="comparison-item">${isTallerLeft ? shortItem : tallItem}</div></div>`;
            break;
    }
    return { problem: { question, answer: "Karşılaştırma", category: 'comparing-quantities', display: 'flow' }, title };
}

const getDotPattern = (num: number): {x:number, y:number}[] => {
    switch(num) {
        case 3: return [{x:50, y:10}, {x:90, y:80}, {x:10, y:80}]; // Triangle
        case 4: return [{x:10, y:10}, {x:90, y:10}, {x:90, y:90}, {x:10, y:90}]; // Square
        case 5: return [{x:50,y:10}, {x:95,y:40}, {x:75,y:90}, {x:25,y:90}, {x:5,y:40}]; // Star/Pentagon
        default: // Default spiral
            return Array.from({length: num}, (_, i) => {
                const angle = i * 2.5;
                const r = 10 + i * 3;
                return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
            });
    }
}

const generateNumberRecognition = (settings: any): { problem: Problem, title: string } => {
    const { type, theme, numberRange } = settings;
    let title = 'Rakam Tanıma ve Sayma';
    const rangeMap = { '1-5': 5, '1-10': 10, '1-20': 20 };
    const max = rangeMap[numberRange];
    const num = getRandomInt(1, max);
    let question = '';

    switch(type) {
        case NumberRecognitionType.CountAndWrite:
            title = "Nesneleri Say ve Yaz";
            const items = getThemeItems(theme, num, true);
            question = `<p>Resimdeki nesneleri say ve kutuya yaz.</p><div class="count-container">${items.map(i => `<span>${i}</span>`).join(' ')}</div> <div class="answer-box-large"></div>`;
            break;
        case NumberRecognitionType.CountAndColor:
            title = "İstenen Kadar Boya";
            const totalItems = Math.min(10, Math.max(num + 2, 5));
            const displayItems = getThemeItems(theme, totalItems, true).map(item => `<div class="coloring-item">${item}</div>`).join('');
            question = `<p>Aşağıdaki nesnelerden <b>${num}</b> tanesini boya.</p><div class="count-container">${displayItems}</div>`;
            break;
        case NumberRecognitionType.ConnectTheDots:
            title = "Noktaları Birleştir";
            const points = getDotPattern(num);
            const dots = points.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="2" fill="black" /><text x="${p.x+2}" y="${p.y-2}" font-size="8" text-anchor="middle">${i+1}</text>`).join('');
            question = `<p>Sayıları sırayla birleştirerek resmi tamamla.</p><svg viewBox="0 0 100 100" class="connect-the-dots-svg">${dots}</svg>`;
            break;
    }
    return { problem: { question, answer: String(num), category: 'number-recognition', display: 'flow' }, title };
}

const generatePatterns = (settings: any): { problem: Problem, title: string } => {
    const { type, theme } = settings;
    let title = 'Örüntüler';
    let question = '', answer = '';
    
    // Helper to get pattern item (SVG or Emoji)
    const getPatternItem = (index: number, useShapes: boolean): string => {
        if (useShapes) {
            const shapeTypes = [ShapeType.Circle, ShapeType.Square, ShapeType.Triangle, ShapeType.Star];
            return `<div class="pattern-item" style="border: none;">${draw2DShape({ type: shapeTypes[index % shapeTypes.length], s: 40, r: 20, w: 40, h: 40, b: 40 })}</div>`;
        }
        const items = getThemeItems(theme, 4);
        return `<div class="pattern-item">${items[index % items.length]}</div>`;
    };

    const useShapes = theme === 'shapes';

    switch(type) {
        case PatternType.RepeatingAB:
            const itemA = getPatternItem(0, useShapes);
            const itemB = getPatternItem(1, useShapes);
            question = [itemA, itemB, itemA, itemB, '<div class="pattern-item">___</div>'].join('');
            answer = "A-B Örüntüsü";
            break;
        case PatternType.RepeatingABC:
            const item1 = getPatternItem(0, useShapes);
            const item2 = getPatternItem(1, useShapes);
            const item3 = getPatternItem(2, useShapes);
            question = [item1, item2, item3, item1, '<div class="pattern-item">___</div>', item3].join('');
            answer = "A-B-C Örüntüsü";
            break;
        case PatternType.Growing:
            // For growing patterns, standard emojis usually work best or numbers
            const item = getThemeItems('mixed', 1)[0];
            const start = getRandomInt(1, 3);
            const sequence = [item.repeat(start), item.repeat(start + 1), item.repeat(start + 2), '___'];
            question = sequence.map(i => `<div class="pattern-item" style="font-size: 1.5rem;">${i}</div>`).join('');
            answer = item.repeat(start + 3);
            break;
    }
     return { problem: { question: `<p>Örüntüyü tamamla.</p><div class="pattern-container" style="flex-wrap: wrap;">${question}</div>`, answer, category: 'patterns', display: 'flow' }, title };
};

const shapeTurkishNames: Record<string, string> = {
    [ShapeType.Square]: 'Kare',
    [ShapeType.Rectangle]: 'Dikdörtgen',
    [ShapeType.Triangle]: 'Üçgen',
    [ShapeType.Circle]: 'Daire',
    [ShapeType.Parallelogram]: 'Paralelkenar',
    [ShapeType.Trapezoid]: 'Yamuk',
    [ShapeType.Pentagon]: 'Beşgen',
    [ShapeType.Hexagon]: 'Altıgen',
    [ShapeType.Rhombus]: 'Eşkenar Dörtgen',
    [ShapeType.Star]: 'Yıldız',
};

const generateBasicShapes = (settings: any): { problem: Problem, title: string } => {
    const { type, shapes } = settings;
    let title = 'Temel Geometrik Şekiller';
    let question = '', answer = '';
    
    // Ensure shapes array is not empty
    const availableShapes = (shapes && shapes.length > 0) ? shapes : [ShapeType.Circle, ShapeType.Square, ShapeType.Triangle];
    const selectedShape = availableShapes[getRandomInt(0, availableShapes.length - 1)];

    switch (type) {
        case ShapeRecognitionType.ColorShape:
            title = 'Şekil Boyama';
            // Generate a row of random shapes, one of them is the target
            const distractorShapes = [ShapeType.Circle, ShapeType.Square, ShapeType.Triangle, ShapeType.Star, ShapeType.Rectangle].filter(s => s !== selectedShape);
            const shapesToDraw = shuffleArray([
                selectedShape,
                distractorShapes[0],
                distractorShapes[1]
            ]);
            
            const shapesHTML = shapesToDraw.map(s => 
                `<div class="shape-item">${draw2DShape({type: s, s: 50, r: 25, w: 60, h: 40, b: 50})}</div>`
            ).join('');

            question = `<p>Aşağıdaki şekillerden <b>${shapeTurkishNames[selectedShape]}</b> olanı boya.</p>
                        <div class="shapes-container" style="display: flex; gap: 2rem; justify-content: center; align-items: center;">${shapesHTML}</div>`;
            answer = shapeTurkishNames[selectedShape];
            break;

        case ShapeRecognitionType.MatchObjectShape:
            title = 'Nesne-Şekil Eşleştirme';
            const objectEmojiMap: Record<string, string> = {
                [ShapeType.Circle]: '⚽',
                [ShapeType.Square]: '📦',
                [ShapeType.Triangle]: '🍕',
                [ShapeType.Rectangle]: '🚪',
                [ShapeType.Star]: '⭐'
            };
            const obj = objectEmojiMap[selectedShape] || '❓';
            // Distractor
            const otherShape = selectedShape === ShapeType.Circle ? ShapeType.Square : ShapeType.Circle;
            
            const matchOptions = shuffleArray([selectedShape, otherShape]);
            
            question = `<p>Bu nesne hangi şekle benziyor? Eşleştir.</p>
                        <div class="match-shape-container" style="display: flex; gap: 3rem; justify-content: center; align-items: center; font-size: 3rem;">
                            <div class="object-item">${obj}</div>
                            <div class="shape-options" style="display: flex; flex-direction: column; gap: 1rem;">
                                ${matchOptions.map(s => `<div>${draw2DShape({type: s, s: 40, r: 20, w: 40, h: 25, b: 40})}</div>`).join('')}
                            </div>
                        </div>`;
            answer = shapeTurkishNames[selectedShape];
            break;

        case ShapeRecognitionType.CountShapes:
            title = 'Şekil Sayma';
            const count = getRandomInt(3, 7);
            const total = 10;
            const othersCount = total - count;
            const otherShape2 = selectedShape === ShapeType.Circle ? ShapeType.Square : ShapeType.Circle;
            
            const shapeList = shuffleArray([
                ...Array(count).fill(selectedShape),
                ...Array(othersCount).fill(otherShape2)
            ]);
            
            question = `<p>Kaç tane <b>${shapeTurkishNames[selectedShape]}</b> var?</p>
                        <div class="count-shapes-container" style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; max-width: 300px;">
                            ${shapeList.map(s => `<div style="transform: scale(0.6);">${draw2DShape({type: s, s: 40, r: 20, w: 40, h: 30, b: 40})}</div>`).join('')}
                        </div>
                        <div class="answer-box-small"></div>`;
            answer = String(count);
            break;

        case ShapeRecognitionType.TraceShape:
            title = 'Şeklin Üzerinden Git';
            question = `<p>Şeklin üzerinden kalemle git.</p>
                        <div style="opacity: 0.3; border: 2px dashed #000; display: inline-block; padding: 10px;">
                            ${draw2DShape({type: selectedShape, s: 80, r: 40, w: 100, h: 60, b: 80})}
                        </div>`;
            answer = shapeTurkishNames[selectedShape];
            break;

        case ShapeRecognitionType.ShapeProperties:
            title = 'Şekil Özellikleri';
            const props: any = {
                [ShapeType.Square]: { sides: 4, corners: 4 },
                [ShapeType.Rectangle]: { sides: 4, corners: 4 },
                [ShapeType.Triangle]: { sides: 3, corners: 3 },
                [ShapeType.Circle]: { sides: 0, corners: 0 },
                [ShapeType.Pentagon]: { sides: 5, corners: 5 },
                [ShapeType.Hexagon]: { sides: 6, corners: 6 },
            };
            const askSide = Math.random() < 0.5;
            const propName = askSide ? 'kenarı' : 'köşesi';
            const propVal = props[selectedShape] ? (askSide ? props[selectedShape].sides : props[selectedShape].corners) : '?';
            
            question = `<p>Bu şeklin kaç <b>${propName}</b> vardır?</p>
                        ${draw2DShape({type: selectedShape, s: 60, r: 30, w: 80, h: 50, b: 60})}
                        <div class="answer-box-small"></div>`;
            answer = String(propVal);
            break;
    }

    return { problem: { question, answer, category: 'basic-shapes', display: 'flow' }, title };
};

const generatePositionalConcepts = (settings: any): { problem: Problem, title: string } => {
    const { type } = settings;
    let title = 'Konum ve Yön Kavramları';
    let question = '', answer = '';
    const tableSvg = `<rect x="10" y="70" width="80" height="20" fill="#a16207" /><rect x="20" y="90" width="10" height="50" fill="#a16207" /><rect x="70" y="90" width="10" height="50" fill="#a16207" />`;

    switch(type) {
        case PositionalConceptType.AboveBelow:
            question = `<p>Masanın <b>üstündeki</b> nesneyi daire içine al.</p><svg viewBox="0 0 100 150">${tableSvg}<text x="45" y="60" font-size="20">🍎</text><text x="45" y="120" font-size="20">👟</text></svg>`;
            answer = '🍎';
            break;
        case PositionalConceptType.InsideOutside:
            question = `<p>Kutunun <b>dışındaki</b> nesneyi boya.</p><svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="none" stroke="#a16207" stroke-width="3" /><text x="45" y="55" font-size="20">🧸</text><text x="80" y="30" font-size="20">🎈</text></svg>`;
            answer = '🎈';
            break;
        case PositionalConceptType.LeftRight:
            question = `<p>Ağacın <b>solundaki</b> nesneyi işaretle.</p><div class="side-by-side-container"><span style="font-size: 2rem">⚽️</span><span style="font-size: 3rem">🌳</span><span style="font-size: 2rem">🦋</span></div>`;
            answer = '⚽️';
            break;
    }
    return { problem: { question, answer, category: 'positional-concepts', display: 'flow' }, title };
}

const generateIntroToMeasurement = (settings: any): { problem: Problem, title: string } => {
    const { type } = settings;
    let title = 'Ölçmeye Giriş';
    let question = '', answer = '';

    // Data pools for variety
    const lengthPairs = [
        { long: '🦒', short: '🐈', q: ['uzun', 'kısa'] },
        { long: '🚆', short: '🚗', q: ['uzun', 'kısa'] },
        { long: '📏', short: '✏️', q: ['uzun', 'kısa'] },
        { long: '🐍', short: '🐛', q: ['uzun', 'kısa'] },
    ];
    const weightPairs = [
        { heavy: '🐘', light: '🐜', q: ['ağır', 'hafif'] },
        { heavy: '🍉', light: '🍓', q: ['ağır', 'hafif'] },
        { heavy: '🧱', light: '🎈', q: ['ağır', 'hafif'] },
        { heavy: '🐳', light: '🐠', q: ['ağır', 'hafif'] },
    ];
    const capacityPairs = [
        { more: '🪣', less: '🥛', q: ['çok', 'az'] },
        { more: '🛁', less: '🥤', q: ['çok', 'az'] },
        { more: '🏺', less: '🍵', q: ['çok', 'az'] },
        { more: '🥣', less: '🥄', q: ['çok', 'az'] },
    ];
    const nonStandardObjects = ['🔑', '🍌', '🐟', '🥕', '🥖'];
    const nonStandardUnits = ['🟥', '●', '➖', '📎'];

    switch(type) {
        case IntroMeasurementType.CompareLength: {
            const pair = lengthPairs[getRandomInt(0, lengthPairs.length - 1)];
            const askForLong = Math.random() < 0.5;
            const longIsLeft = Math.random() < 0.5;
            const questionText = askForLong ? pair.q[0] : pair.q[1];
            
            const leftItem = longIsLeft ? pair.long : pair.short;
            const rightItem = longIsLeft ? pair.short : pair.long;

            question = `<p><b>Daha ${questionText}</b> olanı işaretle.</p>
                        <div class="side-by-side-container vertical" style="font-size: 3rem; align-items: flex-end;">
                            <div>${leftItem}</div>
                            <div>${rightItem}</div>
                        </div>`;
            answer = askForLong ? (longIsLeft ? 'Soldaki' : 'Sağdaki') : (longIsLeft ? 'Sağdaki' : 'Soldaki');
            break;
        }
        case IntroMeasurementType.CompareWeight: {
            const pair = weightPairs[getRandomInt(0, weightPairs.length - 1)];
            const askForHeavy = Math.random() < 0.5;
            const heavyIsLeft = Math.random() < 0.5;
            const questionText = askForHeavy ? pair.q[0] : pair.q[1];

            const leftItem = heavyIsLeft ? pair.heavy : pair.light;
            const rightItem = heavyIsLeft ? pair.light : pair.heavy;

            question = `<p><b>Daha ${questionText}</b> olanı işaretle.</p>
                        <div class="side-by-side-container" style="font-size: 3rem;">
                           <div style="transform: scale(${heavyIsLeft ? 1.5 : 1});">${leftItem}</div>
                           <div style="transform: scale(${!heavyIsLeft ? 1.5 : 1});">${rightItem}</div>
                        </div>`;
            answer = askForHeavy ? (heavyIsLeft ? 'Soldaki' : 'Sağdaki') : (heavyIsLeft ? 'Sağdaki' : 'Soldaki');
            break;
        }
        case IntroMeasurementType.CompareCapacity: {
             const pair = capacityPairs[getRandomInt(0, capacityPairs.length - 1)];
            const askForMore = Math.random() < 0.5;
            const moreIsLeft = Math.random() < 0.5;
            const questionText = askForMore ? pair.q[0] : pair.q[1];

            const leftItem = moreIsLeft ? pair.more : pair.less;
            const rightItem = moreIsLeft ? pair.less : pair.more;

            question = `<p><b>Daha ${questionText}</b> su alan hangisidir?</p>
                        <div class="side-by-side-container vertical" style="font-size: 3rem; align-items: flex-end;">
                           <div style="transform: scale(${moreIsLeft ? 1.5 : 1});">${leftItem}</div>
                           <div style="transform: scale(${!moreIsLeft ? 1.5 : 1});">${rightItem}</div>
                        </div>`;
            answer = askForMore ? (moreIsLeft ? 'Soldaki' : 'Sağdaki') : (moreIsLeft ? 'Sağdaki' : 'Soldaki');
            break;
        }
        case IntroMeasurementType.NonStandardLength: {
            if (Math.random() < 0.5) {
                // Use Ruler SVG
                const length = getRandomInt(3, 10);
                question = `<p>Aşağıdaki çizginin uzunluğu kaç birimdir?</p>
                            ${drawRuler(length)}
                            <div style="width: ${length * 20}px; height: 4px; background: #3b82f6; margin: 5px auto;"></div>`;
                answer = `${length} birim`;
            } else {
                // Non-standard units
                const objectToMeasure = nonStandardObjects[getRandomInt(0, nonStandardObjects.length - 1)];
                const measuringUnit = nonStandardUnits[getRandomInt(0, nonStandardUnits.length - 1)];
                const unitName = {'🟥': 'kare', '●': 'yuvarlak', '➖': 'çizgi', '📎': 'ataş'}[measuringUnit as '🟥' | '●' | '➖' | '📎'] || 'birim';
                const itemCount = getRandomInt(3, 8);
                
                question = `<p>${objectToMeasure} kaç ${unitName} uzunluğundadır?</p>
                            <div class="non-standard-measure">
                                <span class="object-to-measure">${objectToMeasure}</span>
                                <div class="measuring-units">${measuringUnit.repeat(itemCount)}</div>
                            </div>
                            <div class="answer-box-large"></div>`;
                answer = `${itemCount}`;
            }
            break;
        }
    }
    return { problem: { question, answer, category: 'intro-to-measurement', display: 'flow' }, title };
}

// --- NEW IMPLEMENTATION for SimpleGraphs ---
const generateSimpleGraphs = (settings: SimpleGraphsSettings): { problem: Problem, title: string, preamble?: string } => {
    const { activityType, theme, categoryCount, maxItemCount, scale } = settings;
    
    interface GraphDataItem {
        name: string;
        icon: string;
        value: number;
    }

    // 1. Data Generation
    const GRAPH_THEMES: Record<string, {name: string, icon: string}[]> = {
        fruits: [{name: 'Elma', icon: '🍎'}, {name: 'Armut', icon: '🍐'}, {name: 'Çilek', icon: '🍓'}, {name: 'Muz', icon: '🍌'}, {name: 'Karpuz', icon: '🍉'}, {name: 'Kiraz', icon: '🍒'}],
        animals: [{name: 'Koyun', icon: '🐑'}, {name: 'İnek', icon: '🐄'}, {name: 'Tavuk', icon: '🐔'}, {name: 'At', icon: '🐎'}, {name: 'Köpek', icon: '🐕'}, {name: 'Kedi', icon: '🐈'}],
        vehicles: [{name: 'Araba', icon: '🚗'}, {name: 'Otobüs', icon: '🚌'}, {name: 'Uçak', icon: '✈️'}, {name: 'Gemi', icon: '🚢'}, {name: 'Bisiklet', icon: '🚲'}, {name: 'Tren', icon: '🚆'}],
        shapes: [{name: 'Daire', icon: '🟢'}, {name: 'Kare', icon: '🟧'}, {name: 'Üçgen', icon: '🔺'}, {name: 'Yıldız', icon: '⭐'}, {name: 'Kalp', icon: '❤️'}, {name: 'Dikdörtgen', icon: '🟦'}],
        toys: [{name: 'Ayıcık', icon: '🧸'}, {name: 'Bebek', icon: '🪆'}, {name: 'Robot', icon: '🤖'}, {name: 'Uçak', icon: '✈️'}, {name: 'Top', icon: '⚽'}, {name: 'Lego', icon: '🧱'}],
    };

    const themeKey = theme === 'custom' ? Object.keys(GRAPH_THEMES)[getRandomInt(0, Object.keys(GRAPH_THEMES).length - 1)] : theme;
    const dataPool = GRAPH_THEMES[themeKey];
    const data: GraphDataItem[] = shuffleArray(dataPool).slice(0, categoryCount).map(item => ({
        ...item,
        value: getRandomInt(1, Math.floor(maxItemCount / (scale > 1 ? scale : 1))) * (scale > 1 ? scale : 1)
    }));
    
    // 2. Question Generation
    const generateQuestions = (graphData: GraphDataItem[]) => {
        const questions: {q: string, a: string}[] = [];
        const sorted = [...graphData].sort((a,b) => b.value - a.value);
        const most = sorted[0];
        const least = sorted[sorted.length-1];

        // Q1: Most/Least
        if (Math.random() < 0.5) {
            questions.push({ q: `En çok sevilen ${themeKey === 'animals' ? 'hayvan' : 'meyve'} hangisidir?`, a: most.name });
        } else {
            questions.push({ q: `En az sevilen ${themeKey === 'animals' ? 'hayvan' : 'meyve'} hangisidir?`, a: least.name });
        }
        
        // Q2: Total
        questions.push({ q: `Toplam kaç öğrenciye soru sorulmuştur?`, a: String(graphData.reduce((sum, item) => sum + item.value, 0)) });
        
        // Q3: Difference
        questions.push({ q: `En çok sevilen ile en az sevilen arasındaki fark kaçtır?`, a: String(most.value - least.value) });

        // Q4: Sum of two
        const [item1, item2] = shuffleArray(graphData).slice(0,2);
        questions.push({ q: `${item1.name} ve ${item2.name} sevenlerin toplamı kaçtır?`, a: String(item1.value + item2.value) });

        // Q5: Comparison
        const [item3, item4] = shuffleArray(graphData).slice(0,2);
        if (item3.value > item4.value) {
            questions.push({ q: `${item3.name} sevenler, ${item4.name} sevenlerden kaç fazladır?`, a: String(item3.value - item4.value) });
        } else {
             questions.push({ q: `${item4.name} sevenler, ${item3.name} sevenlerden kaç fazladır?`, a: String(item4.value - item3.value) });
        }
        
        return shuffleArray(questions).slice(0,5);
    };

    const valueToTally = (n: number) => {
        const fives = '<s>||||</s>'.repeat(Math.floor(n / 5));
        const ones = '|'.repeat(n % 5);
        return `<span style="letter-spacing: 2px; color: #3b82f6; font-weight: bold;">${fives} ${ones}</span>`;
    };

    let question = '', answer = 'Cevaplar', title = 'Basit Grafikler', preamble = '';
    const questions = generateQuestions(data);
    const questionListHTML = `<ol style="margin-top: 1rem; list-style-position: inside; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1rem;">${questions.map(q => `<li>${q.q}</li>`).join('')}</ol>`;
    
    // 3. HTML Generation
    switch(activityType) {
        case SimpleGraphActivityType.ReadTallyChart:
        case SimpleGraphActivityType.ReadFrequencyTable: {
            const isTally = activityType === SimpleGraphActivityType.ReadTallyChart;
            title = isTally ? 'Çetele Tablosu' : 'Sıklık Tablosu';
            preamble = `Aşağıdaki ${isTally ? 'çetele' : 'sıklık'} tablosuna göre soruları cevaplayınız.`;
            
            const tableHeader = `<th>${data[0].name === 'Daire' ? 'Şekil' : 'Kategori'}</th><th>Sayı</th>`;
            const tableRows = data.map(item => `<tr><td>${item.name}</td><td>${isTally ? valueToTally(item.value) : item.value}</td></tr>`).join('');
            const table = `<table class="simple-table"><thead><tr>${tableHeader}</tr></thead><tbody>${tableRows}</tbody></table>`;
            
            question = `${table}${questionListHTML}`;
            break;
        }
        case SimpleGraphActivityType.ReadObjectGraph:
        case SimpleGraphActivityType.ReadColumnGraph: {
            const isColumn = activityType === SimpleGraphActivityType.ReadColumnGraph;
            title = isColumn ? 'Sütun Grafiği' : 'Nesne Grafiği';
            preamble = `Aşağıdaki ${isColumn ? 'sütun' : 'nesne'} grafiğine göre soruları cevaplayınız.`;
            
            let graphHTML = '';
            if (isColumn) {
                const maxVal = Math.max(...data.map(d => d.value));
                const yAxisSteps = Math.min(maxVal/scale, 10);
                const stepValue = Math.ceil(maxVal / yAxisSteps / scale) * scale;

                graphHTML = `<div class="column-chart-container">
                    <div class="y-axis">${Array.from({length: yAxisSteps + 1}).map((_, i) => `<span>${(yAxisSteps - i) * stepValue}</span>`).join('')}</div>
                    <div class="x-axis">
                        ${data.map(item => `<div class="bar-group">
                            <div class="bar" style="height: ${item.value / maxVal * 100}%">${item.icon}</div>
                            <div class="label">${item.name}</div>
                        </div>`).join('')}
                    </div>
                </div>`;
            } else {
                 const tableHeader = `<th>Kategori</th><th>Sayı</th>`;
                 const tableRows = data.map(item => `<tr><td>${item.name}</td><td style="font-size: 1.5rem; letter-spacing: 2px;">${item.icon.repeat(item.value / scale)}</td></tr>`).join('');
                 graphHTML = `<table class="simple-table object-graph"><thead><tr>${tableHeader}</tr></thead><tbody>${tableRows}</tbody></table>`;
            }
            const note = scale > 1 ? `<p style="margin-top: 0.5rem; font-style: italic; font-size: 0.9em;"><b>Not:</b> Her ${data[0].icon} ${scale} adet belirtmektedir.</p>` : '';
            question = `${graphHTML}${note}${questionListHTML}`;
            break;
        }
        case SimpleGraphActivityType.CountAndFill: {
            title = 'Say, Doldur ve Cevapla';
            preamble = 'Aşağıdaki nesneleri sayıp çetele ve sıklık tablolarını doldurunuz. Ardından soruları cevaplayınız.';
            const itemPool = shuffleArray(data.flatMap(item => Array(item.value).fill(item.icon)));

            const tableHeader = `<th>Şekil</th><th>Sayı</th>`;
            const tallyRows = data.map(item => `<tr><td>${item.name}</td><td></td></tr>`).join('');
            const freqRows = data.map(item => `<tr><td>${item.name}</td><td></td></tr>`).join('');
            
            question = `<div class="item-pool">${itemPool.join(' ')}</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">
                            <div><b>Çetele Tablosu</b><table class="simple-table"><thead><tr>${tableHeader}</tr></thead><tbody>${tallyRows}</tbody></table></div>
                            <div><b>Sıklık Tablosu</b><table class="simple-table"><thead><tr>${tableHeader}</tr></thead><tbody>${freqRows}</tbody></table></div>
                        </div>
                        ${questionListHTML}`;
            break;
        }
        case SimpleGraphActivityType.ConvertGraph: {
            title = 'Grafik Dönüştürme';
            preamble = 'Nesne grafiğindeki bilgileri kullanarak sütun grafiğini tamamlayınız.';

            const objGraphRows = data.map(item => `<tr><td>${item.name}</td><td style="font-size: 1.5rem; letter-spacing: 2px;">${item.icon.repeat(item.value / scale)}</td></tr>`).join('');
            const objGraphHTML = `<table class="simple-table object-graph"><thead><tr><th>Kategori</th><th>Sayı</th></tr></thead><tbody>${objGraphRows}</tbody></table>`;
            const note = scale > 1 ? `<p style="margin-top: 0.5rem; font-style: italic; font-size: 0.9em;"><b>Not:</b> Her ${data[0].icon} ${scale} adet belirtmektedir.</p>` : '';

            const maxVal = Math.max(...data.map(d => d.value));
            const yAxisSteps = 10;
            const stepValue = Math.ceil(maxVal / yAxisSteps);

             const emptyBarChartHTML = `<div class="column-chart-container empty">
                    <div class="y-axis">${Array.from({length: yAxisSteps + 1}).map((_, i) => `<span>${(yAxisSteps - i) * stepValue}</span>`).join('')}</div>
                    <div class="x-axis">
                        ${data.map(item => `<div class="bar-group">
                            <div class="bar-bg"></div>
                            <div class="label">${item.name}</div>
                        </div>`).join('')}
                    </div>
                </div>`;
            
            question = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: flex-start;">
                            <div>${objGraphHTML}${note}</div>
                            <div>${emptyBarChartHTML}</div>
                        </div>`;
            break;
        }

    }
    return { problem: { question, answer, category: 'simple-graphs', display: 'flow' }, title, preamble };
};

const generateVisualAdditionSubtraction = (settings: any): { problem: Problem, title: string } => {
    const { operation, theme, maxNumber } = settings;
    const title = 'Şekillerle Toplama/Çıkarma';
    
    let n1 = getRandomInt(1, maxNumber);
    let n2 = getRandomInt(1, maxNumber);
    let question = '', answer: number, op: '+' | '-';

    const currentOp = operation === 'mixed' ? (Math.random() > 0.5 ? 'addition' : 'subtraction') : operation;

    if (currentOp === 'addition') {
        op = '+';
        answer = n1 + n2;
    } else {
        op = '-';
        if (n1 < n2) [n1, n2] = [n2, n1];
        answer = n1 - n2;
    }

    // Standard items
    let item1HTML = '', item2HTML = '';
    const shouldUseSpecial = (theme === 'mixed' && Math.random() < 0.4) || theme === 'shapes'; // Use special visuals 40% of time for mixed, or always for shapes

    if (shouldUseSpecial) {
        // Use Dice or Dominoes
        const visualType = Math.random() < 0.5 ? 'dice' : 'domino';
        if (visualType === 'dice' && n1 <= 6 && n2 <= 6) {
            item1HTML = drawDice(n1);
            item2HTML = drawDice(n2);
        } else if (visualType === 'domino' && n1 <= 12 && n2 <= 12) {
            // Split number into two halves for domino
            const split = (num: number) => {
                if(num === 0) return [0,0];
                const a = getRandomInt(0, Math.min(6, num));
                const b = num - a;
                if (b > 6) return [Math.ceil(num/2), Math.floor(num/2)]; // fallback if random split fails
                return [a, b];
            }
            const [d1a, d1b] = split(n1);
            const [d2a, d2b] = split(n2);
            item1HTML = drawDomino(d1a, d1b);
            item2HTML = drawDomino(d2a, d2b);
        } else {
             // Fallback to standard items if numbers are too big
             const item = getThemeItems(theme === 'mixed' ? 'fruits' : theme, 1)[0];
             item1HTML = `<div class="visual-math-group">${item.repeat(n1)}</div>`;
             item2HTML = `<div class="visual-math-group">${item.repeat(n2)}</div>`;
        }
    } else {
        const item = getThemeItems(theme, 1)[0];
        item1HTML = `<div class="visual-math-group">${item.repeat(n1)}</div>`;
        item2HTML = `<div class="visual-math-group">${item.repeat(n2)}</div>`;
    }

    question = `<div class="visual-math-container">${item1HTML} <span class="op">${op}</span> ${item2HTML} <span class="op">=</span> <div class="answer-box-small"></div></div>`;
    return { problem: { question, answer, category: 'visual-addition-subtraction', display: 'flow' }, title };
};

// New Helper for Verbal Arithmetic Phrase Generation
const getOperationPhrases = (op: string, difficulty: string, n1: number, n2: number): string => {
    const isHard = difficulty === 'hard';
    const isMedium = difficulty === 'medium';

    switch (op) {
        case 'addition':
            if (isHard) return `${n1} sayısının ${n2} fazlası kaçtır?`;
            if (isMedium) return `${n1} ile ${n2} sayılarının toplamı kaçtır?`;
            return `${n1} artı ${n2} eşittir kaç eder?`;
        case 'subtraction':
            if (isHard) return `${n1} sayısının ${n2} eksiği kaçtır?`;
            if (isMedium) return `${n1} ile ${n2} sayılarının farkı kaçtır?`;
            return `${n1} eksi ${n2} eşittir kaç eder?`;
        case 'multiplication':
            if (isHard) return `${n1} sayısının ${n2} katı kaçtır?`;
            if (isMedium) return `${n1} tane ${n2} kaç eder?`;
            return `${n1} kere ${n2} eşittir kaç eder?`;
        case 'division':
            if (isMedium || isHard) return `${n1} sayısının ${n2} ile bölümü kaçtır?`;
            return `${n1} bölü ${n2} eşittir kaç eder?`;
        default:
            return '';
    }
};

const getOperationSymbol = (op: string): string => {
    switch(op) {
        case 'addition': return '+';
        case 'subtraction': return '-';
        case 'multiplication': return '×';
        case 'division': return '÷';
        default: return '?';
    }
};

const generateVerbalArithmetic = (settings: VerbalArithmeticSettings): { problem: Problem, title: string } => {
    const { activityType, operation, maxResult, difficulty } = settings;
    const title = "İşlemi Sözel İfade Etme";
    
    let currentOp = operation;
    if (currentOp === 'mixed') {
        const ops: ('addition' | 'subtraction' | 'multiplication')[] = ['addition', 'subtraction', 'multiplication']; // Division only if deliberate
        currentOp = ops[getRandomInt(0, 2)];
    }

    let n1 = getRandomInt(1, maxResult);
    let n2 = getRandomInt(1, maxResult);
    
    // Ensure valid operations
    if (currentOp === 'subtraction') {
        if (n1 < n2) [n1, n2] = [n2, n1];
    } else if (currentOp === 'multiplication') {
        n1 = getRandomInt(1, 10);
        n2 = getRandomInt(1, 10);
    } else if (currentOp === 'division') {
        n2 = getRandomInt(1, 10);
        n1 = n2 * getRandomInt(1, 10);
    }

    let question = '', answer = '';
    const phrase = getOperationPhrases(currentOp, difficulty, n1, n2);
    const symbol = getOperationSymbol(currentOp);
    const resultVal = currentOp === 'addition' ? n1 + n2 : currentOp === 'subtraction' ? n1 - n2 : currentOp === 'multiplication' ? n1 * n2 : n1 / n2;

    switch (activityType) {
        case VerbalArithmeticActivityType.WriteAsWords:
            question = `<div class="verbal-math-box">${n1} ${symbol} ${n2} = ?</div><p style="margin-top:0.5rem; text-align:center;">Yukarıdaki işlemi yazı ile ifade ediniz:</p><div style="border-bottom: 1px solid #ccc; height: 1.5rem; margin-top: 0.5rem;"></div>`;
            answer = phrase;
            break;
        case VerbalArithmeticActivityType.WriteAsMath:
            question = `<p class="text-xl text-center">"${phrase}"</p><p style="margin-top:0.5rem; text-align:center;">Yukarıdaki ifadeyi işlem olarak yazıp çözünüz:</p><div style="border: 2px dashed #ccc; padding: 1rem; margin-top: 0.5rem; text-align:center;"> ... ${symbol} ... = ... </div>`;
            answer = `${n1} ${symbol} ${n2} = ${resultVal}`;
            break;
        case VerbalArithmeticActivityType.Matching:
            // Generate a small matching set (3 items)
            const pairs = [];
            for (let i = 0; i < 3; i++) {
                let m1 = getRandomInt(1, 10);
                let m2 = getRandomInt(1, 10);
                if (currentOp === 'subtraction' && m1 < m2) [m1, m2] = [m2, m1];
                pairs.push({
                    math: `${m1} ${symbol} ${m2}`,
                    text: getOperationPhrases(currentOp, difficulty, m1, m2)
                });
            }
            const leftCol = pairs.map(p => `<div class="matching-item" style="font-family:monospace; font-size: 1.5rem;">${p.math}</div>`).join('');
            const rightCol = shuffleArray(pairs).map(p => `<div class="matching-item" style="font-size: 1rem;">${p.text}</div>`).join('');
            question = `<p>İşlemleri uygun ifadelerle eşleştir.</p><div class="matching-container" style="gap: 4rem;"><div class="matching-col">${leftCol}</div><div class="matching-col">${rightCol}</div></div>`;
            answer = "Eşleştirme";
            break;
        case VerbalArithmeticActivityType.FillInTheBlank:
            const opNameMap: Record<string, string> = { '+': 'artı', '-': 'eksi', '×': 'çarpı', '÷': 'bölü' };
            const opName = opNameMap[symbol];
            question = `<p class="text-2xl text-center">${numberToWords(n1)} ...... ${numberToWords(n2)} eşittir ${numberToWords(resultVal)}</p>`;
            answer = opName;
            break;
    }

    return { problem: { question, answer, category: 'verbal-arithmetic', display: 'flow' }, title };
};

const generateMissingNumberPuzzles = (settings: any): { problem: Problem, title: string } => {
    const { operation, termCount, maxResult } = settings;
    const title = "Eksik Sayıyı Bulma";
    let n1 = getRandomInt(1, maxResult - 1);
    let n2 = getRandomInt(1, maxResult - n1);
    let question = '', answer: number;

    const renderTerm = (term: number | string) => {
        const dots = typeof term === 'number' ? '●'.repeat(term) : '';
        return `<div class="puzzle-term">${term === '?' ? '<div class="answer-box-small"></div>' : term}<div class="dots">${dots}</div></div>`;
    };

    if (operation === 'addition') {
        const missing = getRandomInt(1, termCount === 2 ? 3 : 2); // Don't hide result for 3 terms
        if (termCount === 3) {
            const n3 = getRandomInt(1, maxResult - n1 - n2);
            answer = n2;
            question = `${renderTerm(n1)} + ${renderTerm('?')} + ${renderTerm(n3)} = ${renderTerm(n1+n2+n3)}`;
        } else {
            if (missing === 1) { answer = n1; question = `${renderTerm('?')} + ${renderTerm(n2)} = ${renderTerm(n1 + n2)}`; }
            else if (missing === 2) { answer = n2; question = `${renderTerm(n1)} + ${renderTerm('?')} = ${renderTerm(n1 + n2)}`; }
            else { answer = n1 + n2; question = `${renderTerm(n1)} + ${renderTerm(n2)} = ${renderTerm('?')}`; }
        }
    } else { // Subtraction
        const missing = getRandomInt(1, 3);
        if (n1 < n2) [n1, n2] = [n2, n1];
        if (missing === 1) { answer = n1; question = `${renderTerm('?')} - ${renderTerm(n2)} = ${renderTerm(n1 - n2)}`; }
        else if (missing === 2) { answer = n2; question = `${renderTerm(n1)} - ${renderTerm('?')} = ${renderTerm(n1 - n2)}`; }
        else { answer = n1 - n2; question = `${renderTerm(n1)} - ${renderTerm(n2)} = ${renderTerm('?')}`; }
    }
    return { problem: { question: `<div class="puzzle-container">${question}</div>`, answer, category: 'missing-number-puzzles', display: 'flow' }, title };
};

const generateSymbolicArithmetic = (settings: any): { problem: Problem, title: string, preamble: string } => {
    const { operation, theme, maxNumber } = settings;
    const title = "Simgelerle İşlemler";
    const symbols = getThemeItems(theme, maxNumber);
    const symbolMap = symbols.reduce((acc, symbol, i) => ({ ...acc, [symbol]: i + 1 }), {} as Record<string, number>);
    const preamble = 'Aşağıdaki anahtarı kullanarak işlemleri yapınız:<br/>' + Object.entries(symbolMap).map(([s, n]) => `<span class="symbol-key">${s} = ${n}</span>`).join('');

    const s1 = symbols[getRandomInt(0, symbols.length / 2 -1)];
    const s2 = symbols[getRandomInt(0, symbols.length / 2 -1)];
    const n1 = symbolMap[s1];
    const n2 = symbolMap[s2];

    let question = '', answer: number;
    const op = operation === 'mixed' ? (Math.random() < 0.5 ? '+' : '-') : (operation === 'addition' ? '+' : '-');

    if (op === '+') {
        question = `${s1} + ${s2} = ?`;
        answer = n1 + n2;
    } else {
        if (n1 < n2) {
             question = `${s2} - ${s1} = ?`;
             answer = n2 - n1;
        } else {
             question = `${s1} - ${s2} = ?`;
             answer = n1 - n2;
        }
    }
    return { problem: { question: `<div class="symbolic-math">${question}</div>`, answer, category: 'symbolic-arithmetic', display: 'flow' }, title, preamble };
};

const generateProblemCreation = (settings: any): { problem: Problem, title: string } => {
    const { operation, difficulty, theme } = settings;
    const title = 'Problem Kurma';
    const maxMap = { easy: 20, medium: 100, hard: 1000 };
    const maxResult = maxMap[difficulty as 'easy' | 'medium' | 'hard'];
    let n1 = getRandomInt(1, maxResult - 1);
    let n2 = getRandomInt(1, maxResult - n1);
    let item = getThemeItems(theme, 1)[0];
    let question = '', answer: string;

    if (operation === 'addition') {
        question = `<div class="problem-creation-container">
            <div class="pc-visuals">${item.repeat(n1)} + ${item.repeat(n2)}</div>
            <div class="pc-equation">${n1} + ${n2} = ${n1+n2}</div>
            <div class="pc-story-box">Bu işleme uygun bir problem yaz.</div>
        </div>`;
    } else {
        if (n1 < n2) [n1, n2] = [n2, n1];
        question = `<div class="problem-creation-container">
             <div class="pc-visuals">${item.repeat(n1)} → ${item.repeat(n2)}</div>
             <div class="pc-equation">${n1} - ${n2} = ${n1-n2}</div>
             <div class="pc-story-box">Bu işleme uygun bir problem yaz.</div>
        </div>`;
    }
    answer = "Öğrenci yanıtı";
    return { problem: { question, answer, category: 'problem-creation', display: 'flow' }, title };
};


export const generateReadinessProblem = (moduleKey: string, settings: any): { problem: Problem, title: string, preamble?: string, error?: string } => {
    switch (moduleKey) {
        case 'matching-and-sorting':
            return generateMatchingAndSorting(settings);
        case 'comparing-quantities':
            return generateComparingQuantities(settings);
        case 'number-recognition':
            return generateNumberRecognition(settings);
        case 'patterns':
            return generatePatterns(settings);
        case 'basic-shapes':
            return generateBasicShapes(settings);
        case 'positional-concepts':
            return generatePositionalConcepts(settings);
        case 'intro-to-measurement':
            return generateIntroToMeasurement(settings);
        case 'simple-graphs':
            return generateSimpleGraphs(settings);
        case 'visual-addition-subtraction':
            return generateVisualAdditionSubtraction(settings);
        case 'verbal-arithmetic':
            return generateVerbalArithmetic(settings);
        case 'missing-number-puzzles':
            return generateMissingNumberPuzzles(settings);
        case 'symbolic-arithmetic':
            return generateSymbolicArithmetic(settings);
        case 'problem-creation':
            return generateProblemCreation(settings);
        default:
            return { problem: { question: 'Bilinmeyen hazırlık modülü', answer: 'Hata', category: 'error' }, title: 'Hata', error: `Modül bulunamadı: ${moduleKey}` };
    }
};