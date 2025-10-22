// services/readinessService.ts

import { Problem, MathReadinessTheme, MatchingType, ComparisonType, NumberRecognitionType, PatternType, ShapeRecognitionType, PositionalConceptType, IntroMeasurementType, SimpleGraphType, SimpleGraphTaskType, ShapeType } from '../types.ts';
import { numberToWords } from './utils.ts';
import { draw2DShape, drawSymmetryLine } from './svgService.ts';

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

    switch(type) {
        case MatchingType.OneToOne:
            title = 'Bire Bir Eşleştirme';
            const items = getThemeItems(theme, itemCount);
            const shuffledItems = shuffleArray(items);
            const leftCol = items.map(item => `<div class="matching-item">${item}</div>`).join('');
            const rightCol = shuffledItems.map(item => `<div class="matching-item">${item}</div>`).join('');
            question = `<p>Soldaki nesneleri sağdaki aynı nesnelerle eşleştir.</p><div class="matching-container"><div class="matching-col">${leftCol}</div><div class="matching-col">${rightCol}</div></div>`;
            break;

        case MatchingType.Shadow:
             title = 'Gölge Eşleştirme';
             const shadowItems = getThemeItems(theme, itemCount);
             const shuffledShadows = shuffleArray(shadowItems);
             const leftColItems = shadowItems.map(item => `<div class="matching-item">${item}</div>`).join('');
             const rightColShadows = shuffledShadows.map(item => `<div class="matching-item shadow">${item}</div>`).join('');
             question = `<p>Soldaki nesneleri sağdaki gölgeleriyle eşleştir.</p><div class="matching-container"><div class="matching-col">${leftColItems}</div><div class="matching-col">${rightColShadows}</div></div>`;
            break;
            
        case MatchingType.ByProperty:
            title = 'Özelliğe Göre Gruplama';
            const category1Items = getThemeItems('animals', 3, true);
            const category2Items = getThemeItems('vehicles', 3, true);
            const allItems = shuffleArray([...category1Items, ...category2Items]);
            question = `<p>Nesneleri doğru gruplara ayır.</p>
                        <div class="grouping-container">${allItems.map(i => `<span>${i}</span>`).join('')}</div>
                        <div class="matching-container">
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
            const colStyle = `display: flex; flex-direction: column; gap: ${letterSpacing ?? 2}rem;`;
            const finalLeftColLetters = letters.map(letter => `<div class="matching-item" style="${finalLetterStyle}">${letter}</div>`).join('');
            const finalRightColLetters = shuffledLetters.map(letter => `<div class="matching-item" style="${finalLetterStyle}">${letter}</div>`).join('');
            
            // Invert the slider value to control padding. Max slider value is 15.
            // When slider is at max (15), we want minimum padding (0).
            // When slider is at min (0), we want maximum padding (15).
            const MAX_SLIDER_VALUE = 15;
            const horizontalPadding = MAX_SLIDER_VALUE - (letterHorizontalSpacing ?? 4);

            const containerWrapperStyle = `padding: 0 ${horizontalPadding}rem; max-width: 100%; box-sizing: border-box;`;
            const finalContainerStyle = `display: flex; justify-content: space-between; width: 100%;`;

            question = `<p>Soldaki harfleri sağdaki aynı harflerle eşleştir.</p>
                        <div style="${containerWrapperStyle}">
                            <div style="${finalContainerStyle}">
                                <div class="matching-col" style="${colStyle}">${finalLeftColLetters}</div>
                                <div class="matching-col" style="${colStyle}">${finalRightColLetters}</div>
                            </div>
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
    
    switch(type) {
        case PatternType.RepeatingAB:
            const itemsAB = getThemeItems(theme, 2);
            question = [itemsAB[0], itemsAB[1], itemsAB[0], itemsAB[1], '___'].map(i => `<div class="pattern-item">${i}</div>`).join('');
            answer = itemsAB[0];
            break;
        case PatternType.RepeatingABC:
            const itemsABC = getThemeItems(theme, 3);
            question = [itemsABC[0], itemsABC[1], itemsABC[2], itemsABC[0], '___', itemsABC[2]].map(i => `<div class="pattern-item">${i}</div>`).join('');
            answer = itemsABC[1];
            break;
        case PatternType.Growing:
            const item = getThemeItems(theme, 1)[0];
            const start = getRandomInt(1, 3);
            const sequence = [item.repeat(start), item.repeat(start + 1), item.repeat(start + 2), '___'];
            question = sequence.map(i => `<div class="pattern-item">${i}</div>`).join('');
            answer = item.repeat(start + 3);
            break;
    }
     return { problem: { question: `<p>Örüntüyü tamamla.</p><div class="pattern-container">${question}</div>`, answer, category: 'patterns', display: 'flow' }, title };
};

const generateBasicShapes = (settings: any): { problem: Problem, title: string } => {
    const { type, shapes: availableShapes } = settings;
    let title = 'Temel Geometrik Şekiller';
    const allShapes = [ShapeType.Circle, ShapeType.Square, ShapeType.Triangle, ShapeType.Rectangle, ShapeType.Star];
    const targetShape = availableShapes[getRandomInt(0, availableShapes.length - 1)];
    const shapeMap: Record<string, string> = { ...shapeSVGs };
    const shapeNameMap: Record<string, string> = { [ShapeType.Circle]: 'Daire', [ShapeType.Square]: 'Kare', [ShapeType.Triangle]: 'Üçgen', [ShapeType.Rectangle]: 'Dikdörtgen', [ShapeType.Star]: 'Yıldız' };

    let question = '', answer = '';

    switch(type) {
        case ShapeRecognitionType.ColorShape:
            title = 'Şekil Boyama';
            const shapePool = shuffleArray(allShapes.concat(allShapes)).slice(0, 8);
            question = `<p>Tüm <b>${(shapeNameMap as any)[targetShape] || 'şekilleri'}</b> boya.</p><div class="shape-scene">${shapePool.map(s => `<div class="shape-item">${(shapeMap as any)[s]}</div>`).join('')}</div>`;
            answer = `Tüm ${(shapeNameMap as any)[targetShape]} boyanır.`;
            break;
        case ShapeRecognitionType.MatchObjectShape:
            title = 'Nesne-Şekil Eşleştirme';
            const objectMap: Record<string, ShapeType> = {'🍕': ShapeType.Triangle, '🏠': ShapeType.Square, '☀️': ShapeType.Circle, '✉️': ShapeType.Rectangle, '⭐': ShapeType.Star, '🍉': ShapeType.Circle};
            const targetObject = Object.keys(objectMap)[getRandomInt(0, Object.keys(objectMap).length - 1)];
            const correctShape = (objectMap as any)[targetObject];
            question = `<p>Bu nesne hangi şekle benziyor? Eşleştir.</p><div class="matching-container"><div class="matching-col"><div class="matching-item">${targetObject}</div></div><div class="matching-col">${allShapes.map(s => `<div class="matching-item">${(shapeMap as any)[s]}</div>`).join('')}</div></div>`;
            answer = (shapeNameMap as any)[correctShape];
            break;
        case ShapeRecognitionType.CountShapes:
            title = 'Şekil Sayma';
            const sceneShapes = shuffleArray([...allShapes, ...allShapes, ...allShapes, ...allShapes]).slice(0, 10);
            const targetCountShape = allShapes[getRandomInt(0, allShapes.length - 1)];
            const count = sceneShapes.filter(s => s === targetCountShape).length;
            question = `<p>Resimde kaç tane <b>${(shapeNameMap as any)[targetCountShape]}</b> var? Say ve yaz.</p><div class="shape-scene">${sceneShapes.map(s => `<div class="shape-item">${(shapeMap as any)[s]}</div>`).join('')}</div><div class="answer-box-large"></div>`;
            answer = String(count);
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

    switch(type) {
        case IntroMeasurementType.CompareLength:
            question = `<p><b>Daha uzun</b> olanı işaretle.</p><div class="side-by-side-container vertical"><div style="font-size: 4rem;">✏️</div><div style="font-size: 2rem;">✏️</div></div>`;
            answer = 'Soldaki';
            break;
        case IntroMeasurementType.CompareWeight:
            question = `<p><b>Daha ağır</b> olanı işaretle.</p><div class="side-by-side-container"><span style="font-size: 3rem">🐘</span><span style="font-size: 1.5rem"> 🐁</span></div>`;
            answer = '🐘';
            break;
        case IntroMeasurementType.CompareCapacity:
            question = `<p><b>Daha çok</b> su alan hangisidir?</p><div class="side-by-side-container vertical"><span style="font-size: 4rem">🪣</span><span style="font-size: 2rem">🥛</span></div>`;
            answer = 'Soldaki';
            break;
        case IntroMeasurementType.NonStandardLength:
            const itemCount = getRandomInt(3, 6);
            question = `<p>Kalem kaç ataş uzunluğundadır?</p><div class="non-standard-measure"><span class="object-to-measure">✏️</span><div class="measuring-units">${'📎'.repeat(itemCount)}</div></div><div class="answer-box-large"></div>`;
            answer = `${itemCount}`;
            break;
    }
    return { problem: { question, answer, category: 'intro-to-measurement', display: 'flow' }, title };
}

const generateSimpleGraphs = (settings: any): { problem: Problem, title: string } => {
    const { taskType, theme, categoryCount, maxItemCount } = settings;
    let title = 'Basit Grafikler';
    const categories = getThemeItems(theme, categoryCount);
    const data = categories.map(cat => ({ category: cat, value: getRandomInt(1, maxItemCount) }));

    let question = '', answer = '';
    if (taskType === SimpleGraphTaskType.Create) {
        title = 'Grafik Oluşturma';
        const itemsList = shuffleArray(data.flatMap(d => Array(d.value).fill(d.category)));
        question = `<p>Aşağıdaki nesneleri say ve çetele tablosunu doldur.</p><div class="item-pool">${itemsList.join(' ')}</div><div class="tally-chart">${data.map(d => `<div class="tally-row"><span>${d.category}</span><div class="tally-box"></div></div>`).join('')}</div>`;
        answer = data.map(d => `${d.category}: ${d.value}`).join(', ');
    } else {
        title = 'Grafik Okuma';
        const graphHTML = `<div class="bar-chart">${data.map(d => `<div class="bar-row"><span class="bar-label">${d.category}</span><div class="bar" style="width: ${d.value * 20}px;">${d.value}</div></div>`).join('')}</div>`;
        const qType = getRandomInt(1, 3);
        if (qType === 1) { // How many
            const targetCategory = data[getRandomInt(0, data.length - 1)];
            question = `<p>Grafiğe göre, kaç tane ${targetCategory.category} vardır?</p>${graphHTML}`;
            answer = String(targetCategory.value);
        } else if (qType === 2) { // Most
            const most = data.reduce((max, d) => d.value > max.value ? d : max);
            question = `<p>Grafiğe göre, en çok hangisinden vardır?</p>${graphHTML}`;
            answer = most.category;
        } else { // Least
             const least = data.reduce((min, d) => d.value < min.value ? d : min);
            question = `<p>Grafiğe göre, en az hangisinden vardır?</p>${graphHTML}`;
            answer = least.category;
        }
    }
    return { problem: { question, answer, category: 'simple-graphs', display: 'flow' }, title };
};

const generateVisualAdditionSubtraction = (settings: any): { problem: Problem, title: string } => {
    const { operation, theme, maxNumber } = settings;
    const title = 'Şekillerle Toplama/Çıkarma';
    const item = getThemeItems(theme, 1)[0];
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
    question = `<div class="visual-math-container"><div class="visual-math-group">${item.repeat(n1)}</div> <span class="op">${op}</span> <div class="visual-math-group">${item.repeat(n2)}</div> <span class="op">=</span> <div class="answer-box-small"></div></div>`;
    return { problem: { question, answer, category: 'visual-addition-subtraction', display: 'flow' }, title };
};

const generateVerbalArithmetic = (settings: any): { problem: Problem, title: string } => {
    const { operation, maxResult } = settings;
    const title = "İşlemi Sözel İfade Etme";
    let n1 = getRandomInt(1, maxResult-1);
    let n2 = getRandomInt(1, maxResult-n1);
    let question = '', answer: string;

     const currentOp = operation === 'mixed' ? (Math.random() > 0.5 ? 'addition' : 'subtraction') : operation;
     if (currentOp === 'addition') {
        question = `<p>Bu işlemin okunuşunu yaz.</p><div class="verbal-math-box">${n1} + ${n2} = ${n1+n2}</div>`;
        answer = `${numberToWords(n1)} artı ${numberToWords(n2)} eşittir ${numberToWords(n1+n2)}`;
     } else {
        if (n1 < n2) [n1, n2] = [n2, n1];
        question = `<p>Bu işlemin okunuşunu yaz.</p><div class="verbal-math-box">${n1} - ${n2} = ${n1-n2}</div>`;
        answer = `${numberToWords(n1)} eksi ${numberToWords(n2)} eşittir ${numberToWords(n1-n2)}`;
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