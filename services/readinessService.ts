// services/readinessService.ts

import { Problem, MathReadinessTheme, MatchingType, ComparisonType, NumberRecognitionType, PatternType, ShapeRecognitionType, PositionalConceptType, IntroMeasurementType, SimpleGraphType, SimpleGraphTaskType, ShapeType } from '../types.ts';
import { numberToWords } from './utils.ts';
import { draw2DShape } from './svgService.ts';

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

const getThemeItems = (theme: MathReadinessTheme, count: number): string[] => {
    const themeKey = theme === 'mixed' ? Object.keys(THEME_OBJECTS).filter(k => k !== 'mixed' && k !== 'measurement')[getRandomInt(0, 3)] as MathReadinessTheme : theme;
    return shuffleArray(THEME_OBJECTS[themeKey]).slice(0, count);
};


// --- GENERATOR FUNCTIONS ---

const generateMatchingAndSorting = (settings: any): { problem: Problem, title: string } => {
    const { type, theme, itemCount } = settings;
    const title = 'Eşleştirme ve Gruplama';
    const items = getThemeItems(theme, itemCount);
    const shuffledItems = shuffleArray(items);

    let question = '';
    switch(type) {
        case MatchingType.OneToOne:
        case MatchingType.Shadow:
            const leftCol = items.map(item => `<div class="matching-item">${item}</div>`).join('');
            const rightCol = shuffledItems.map(item => `<div class="matching-item ${type === 'shadow' ? 'shadow' : ''}">${item}</div>`).join('');
            question = `<div class="matching-container"><div class="matching-col">${leftCol}</div><div class="matching-col">${rightCol}</div></div>`;
            break;
        case MatchingType.ByProperty:
             const property = "renklerine"; // for simplicity
             question = `Nesneleri ${property} göre gruplandırın.`;
            break;
    }
    return { problem: { question, answer: "Eşleştirme", category: 'matching-and-sorting', display: 'flow' }, title };
};

const generateComparingQuantities = (settings: any): { problem: Problem, title: string } => {
    const { type, theme, maxObjectCount } = settings;
    const title = 'Miktarları Karşılaştırma';
    const items = getThemeItems(theme, 2);
    let question = '';

    switch(type) {
        case ComparisonType.MoreLess:
            const count1 = getRandomInt(1, maxObjectCount);
            let count2 = getRandomInt(1, maxObjectCount);
            while(count1 === count2) count2 = getRandomInt(1, maxObjectCount);
            question = `<div class="comparison-container"><div class="comparison-group">${items[0].repeat(count1)}</div><div class="comparison-group">${items[1].repeat(count2)}</div></div>`;
            break;
        case ComparisonType.BiggerSmaller:
            question = `<div class="comparison-container"><div style="font-size: 3rem;">${items[0]}</div><div style="font-size: 1.5rem;">${items[1]}</div></div>`;
            break;
        case ComparisonType.TallerShorter:
             question = `<div class="comparison-container" style="align-items: flex-end;"><div style="font-size: 3rem;">${items[0]}</div><div style="font-size: 1.5rem;">${items[1]}</div></div>`;
            break;
    }
    return { problem: { question, answer: "Karşılaştırma", category: 'comparing-quantities', display: 'flow' }, title };
}

const generateNumberRecognition = (settings: any): { problem: Problem, title: string } => {
    const { type, theme, numberRange } = settings;
    const title = 'Rakam Tanıma ve Sayma';
    const rangeMap = { '1-5': 5, '1-10': 10, '1-20': 20 };
    const max = rangeMap[numberRange];
    const num = getRandomInt(1, max);
    let question = '';

    switch(type) {
        case NumberRecognitionType.CountAndWrite:
            const items = getThemeItems(theme, num);
            question = `<div class="count-container">${items.map(i => i).join(' ')}</div> <div class="answer-box">___</div>`;
            break;
        case NumberRecognitionType.CountAndColor:
            const totalItems = Math.max(num, 4);
            const displayItems = getThemeItems(theme, totalItems);
            question = `<b>${num}</b> tane nesneyi boya.<br/><div class="count-container">${displayItems.map(i => i).join(' ')}</div>`;
            break;
        case NumberRecognitionType.ConnectTheDots:
            question = `Noktaları birleştirerek resmi tamamla.`; // Placeholder
            break;
    }
    return { problem: { question, answer: String(num), category: 'number-recognition', display: 'flow' }, title };
}

const generatePatterns = (settings: any): { problem: Problem, title: string } => {
    const { type, theme } = settings;
    const title = 'Örüntüler';
    const items = getThemeItems(theme, 3);
    let question = '';
    
    switch(type) {
        case PatternType.RepeatingAB:
            question = `${items[0]} ${items[1]} ${items[0]} ${items[1]} ___`;
            break;
        case PatternType.RepeatingABC:
            question = `${items[0]} ${items[1]} ${items[2]} ${items[0]} ___ ${items[2]}`;
            break;
        case PatternType.Growing:
            question = `1, 2, 3, ___`;
            break;
    }
     return { problem: { question: `<div style="font-size: 2rem;">${question}</div>`, answer: "Örüntü", category: 'patterns', display: 'flow' }, title };
};

const generateBasicShapes = (settings: any): { problem: Problem, title: string } => {
    const { type, shapes } = settings;
    const title = 'Temel Geometrik Şekiller';
    const shapeMap = {
        [ShapeType.Circle]: 'Daire',
        [ShapeType.Square]: 'Kare',
        [ShapeType.Triangle]: 'Üçgen',
        [ShapeType.Rectangle]: 'Dikdörtgen'
    };
    const targetShape = shapes[getRandomInt(0, shapes.length - 1)];
    let question = '';

    switch(type) {
        case ShapeRecognitionType.ColorShape:
            question = `<b>${(shapeMap as any)[targetShape] || 'Şekli'}</b> boya.`;
            break;
        case ShapeRecognitionType.MatchObjectShape:
            question = 'Nesneleri benzedikleri şekillerle eşleştir.';
            break;
        case ShapeRecognitionType.CountShapes:
            question = 'Resimdeki kare, üçgen ve daireleri say.';
            break;
    }
    return { problem: { question, answer: "Şekil", category: 'basic-shapes', display: 'flow' }, title };
};

const generatePositionalConcepts = (settings: any): { problem: Problem, title: string } => {
    const { type } = settings;
    const title = 'Konum ve Yön Kavramları';
    let question = '';

    switch(type) {
        case PositionalConceptType.AboveBelow:
            question = 'Masanın <b>üstündeki</b> nesneyi daire içine al.';
            break;
        case PositionalConceptType.InsideOutside:
            question = 'Kutunun <b>dışındaki</b> nesneyi boya.';
            break;
        case PositionalConceptType.LeftRight:
            question = 'Ağacın <b>solundaki</b> nesneyi işaretle.';
            break;
    }
    return { problem: { question, answer: "Konum", category: 'positional-concepts', display: 'flow' }, title };
}

const generateIntroToMeasurement = (settings: any): { problem: Problem, title: string } => {
    const { type } = settings;
    const title = 'Ölçmeye Giriş';
    let question = '';

    switch(type) {
        case IntroMeasurementType.CompareLength:
            question = '<b>Daha uzun</b> olanı işaretle.';
            break;
        case IntroMeasurementType.CompareWeight:
            question = '<b>Daha ağır</b> olanı işaretle.';
            break;
        case IntroMeasurementType.CompareCapacity:
            question = '<b>Daha çok</b> su alan hangisidir?';
            break;
        case IntroMeasurementType.NonStandardLength:
            question = 'Kalemin boyu kaç ataş uzunluğundadır?';
            break;
    }
    return { problem: { question, answer: "Ölçme", category: 'intro-to-measurement', display: 'flow' }, title };
}

const generateSimpleGraphs = (settings: any): { problem: Problem, title: string } => {
    const { taskType, theme, categoryCount, maxItemCount } = settings;
    const title = 'Basit Grafikler';
    const categories = getThemeItems(theme, categoryCount);
    const data = categories.map(cat => ({ category: cat, value: getRandomInt(1, maxItemCount) }));

    let question = '';
    if (taskType === SimpleGraphTaskType.Create) {
        question = 'Nesneleri say ve grafiği oluştur.';
    } else {
        question = 'Grafiğe göre soruları cevapla.';
    }
    return { problem: { question, answer: "Grafik", category: 'simple-graphs', display: 'flow' }, title };
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
    question = `<div class="visual-math">${item.repeat(n1)} ${op} ${item.repeat(n2)} = ?</div>`;
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
        question = `${n1} + ${n2} = ${n1+n2}`;
        answer = `${numberToWords(n1)} artı ${numberToWords(n2)} eşittir ${numberToWords(n1+n2)}`;
     } else {
        if (n1 < n2) [n1, n2] = [n2, n1];
        question = `${n1} - ${n2} = ${n1-n2}`;
        answer = `${numberToWords(n1)} eksi ${numberToWords(n2)} eşittir ${numberToWords(n1-n2)}`;
     }
    return { problem: { question, answer, category: 'verbal-arithmetic', display: 'flow' }, title };
};

const generateMissingNumberPuzzles = (settings: any): { problem: Problem, title: string } => {
    const { operation, termCount, maxResult } = settings;
    const title = "Eksik Sayıyı Bulma";
    // FIX: Changed const to let to allow reassignment.
    let n1 = getRandomInt(1, maxResult - 1);
    let n2 = getRandomInt(1, maxResult - n1);
    let question = '', answer: number;

    if (operation === 'addition') {
        const missing = getRandomInt(1, termCount === 2 ? 3 : 2); // Don't hide result for 3 terms
        if (termCount === 3) {
            const n3 = getRandomInt(1, maxResult - n1 - n2);
            answer = n2;
            question = `${n1} + <span class="puzzle-box">?</span> + ${n3} = ${n1+n2+n3}`;
        } else {
            if (missing === 1) { answer = n1; question = `<span class="puzzle-box">?</span> + ${n2} = ${n1 + n2}`; }
            else if (missing === 2) { answer = n2; question = `${n1} + <span class="puzzle-box">?</span> = ${n1 + n2}`; }
            else { answer = n1 + n2; question = `${n1} + ${n2} = <span class="puzzle-box">?</span>`; }
        }
    } else { // Subtraction
        const missing = getRandomInt(1, 3);
        if (n1 < n2) [n1, n2] = [n2, n1];
        if (missing === 1) { answer = n1; question = `<span class="puzzle-box">?</span> - ${n2} = ${n1 - n2}`; }
        else if (missing === 2) { answer = n2; question = `${n1} - <span class="puzzle-box">?</span> = ${n1 - n2}`; }
        else { answer = n1 - n2; question = `${n1} - ${n2} = <span class="puzzle-box">?</span>`; }
    }
    return { problem: { question, answer, category: 'missing-number-puzzles', display: 'flow' }, title };
};

const generateSymbolicArithmetic = (settings: any): { problem: Problem, title: string, preamble: string } => {
    const { operation, theme, maxNumber } = settings;
    const title = "Simgelerle İşlemler";
    const symbols = getThemeItems(theme, maxNumber);
    const symbolMap = symbols.reduce((acc, symbol, i) => ({ ...acc, [symbol]: i + 1 }), {} as Record<string, number>);
    const preamble = 'Aşağıdaki anahtarı kullanarak işlemleri yapınız:<br/>' + Object.entries(symbolMap).map(([s, n]) => `${s} = ${n}`).join(', ');

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
    const { operation, difficulty } = settings;
    const title = 'Problem Kurma';
    const maxMap = { easy: 20, medium: 100, hard: 1000 };
    const maxResult = maxMap[difficulty];
    let n1 = getRandomInt(1, maxResult - 1);
    let n2 = getRandomInt(1, maxResult - n1);
    let question = '', answer: string;

    if (operation === 'addition') {
        question = `<div class="problem-creation-box"><b>Verilen İşlem:</b><br/> ${n1} + ${n2} = ${n1+n2} <br/><br/><b>Problem:</b></div>`;
    } else {
        if (n1 < n2) [n1, n2] = [n2, n1];
        question = `<div class="problem-creation-box"><b>Verilen İşlem:</b><br/> ${n1} - ${n2} = ${n1-n2} <br/><br/><b>Problem:</b></div>`;
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
