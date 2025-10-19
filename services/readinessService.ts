// services/readinessService.ts

import {
    Problem,
    MatchingAndSortingSettings,
    ComparingQuantitiesSettings,
    NumberRecognitionSettings,
    PatternsSettings,
    BasicShapesSettings,
    PositionalConceptsSettings,
    IntroToMeasurementSettings,
    SimpleGraphsSettings,
    VisualAdditionSubtractionSettings,
    VerbalArithmeticSettings,
    MissingNumberPuzzlesSettings,
    SymbolicArithmeticSettings,
    ProblemCreationSettings
} from '../types.ts';
import { numberToWords } from './utils.ts';

// --- UTILS ---
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// --- DATA ---
const themes = {
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
    vehicles: ['🚗', '🚕', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒'],
    fruits: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓'],
    shapes: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫'],
    measurement: ['📏', '⚖️', '🌡️', '⏰', '📅', '📐', '🧭', '⏳']
};

// --- GENERATOR FUNCTIONS ---

const generateMatchingAndSorting = (settings: MatchingAndSortingSettings): { problem: Problem, title: string } => {
    const { type, theme, itemCount } = settings;
    const title = type === 'by-property' ? "Özelliklerine Göre Gruplama" : "Eşleştirme";
    const selectedTheme = theme === 'mixed' ? Object.values(themes).flat() : themes[theme];
    const items = shuffleArray(selectedTheme).slice(0, itemCount);
    let question = '';

    switch (type) {
        case 'one-to-one':
            question = `<div class="matching-grid"><div>${items.join('<br>')}</div><div>${shuffleArray(items).join('<br>')}</div></div>`;
            break;
        case 'shadow':
            question = `<div class="matching-grid"><div>${items.map(i => `<span style="font-size: 2em;">${i}</span>`).join('<br>')}</div><div>${shuffleArray(items).map(i => `<span style="font-size: 2em; filter: brightness(0) opacity(0.5);">${i}</span>`).join('<br>')}</div></div>`;
            break;
        case 'by-property':
            // Simplified grouping, needs more complex logic for real use
            const group1 = items.slice(0, Math.floor(itemCount / 2));
            const group2 = items.slice(Math.floor(itemCount / 2));
            question = `Aşağıdaki nesneleri iki gruba ayırın: <br> ${shuffleArray([...group1, ...group2]).join(' ')}`;
            break;
    }
    return { problem: { question, answer: "Eşleştirme yapınız.", category: 'matching-and-sorting' }, title };
};

const generateComparingQuantities = (settings: ComparingQuantitiesSettings): { problem: Problem, title: string } => {
    const { type, theme, maxObjectCount } = settings;
    const title = "Miktarları Karşılaştırma";
    const selectedTheme = theme === 'mixed' ? Object.values(themes).flat() : themes[theme];
    const item = selectedTheme[getRandomInt(0, selectedTheme.length - 1)];

    let n1 = getRandomInt(1, maxObjectCount);
    let n2 = getRandomInt(1, maxObjectCount);
    while (n1 === n2) n2 = getRandomInt(1, maxObjectCount);

    const question = `<div class="comparing-grid"><div>${item.repeat(n1)}</div><div>${item.repeat(n2)}</div></div>`;
    let answer = '';
    if (type === 'more-less') answer = n1 > n2 ? "Soldaki daha fazla" : "Sağdaki daha fazla";
    else answer = "Büyük/küçük olanı işaretle";

    return { problem: { question, answer, category: 'comparing-quantities' }, title };
};

const generateNumberRecognition = (settings: NumberRecognitionSettings): { problem: Problem, title: string } => {
    const { type, theme, numberRange } = settings;
    const title = "Rakam Tanıma ve Sayma";
    const [min, max] = numberRange.split('-').map(Number);
    const num = getRandomInt(min, max);
    const selectedTheme = theme === 'mixed' ? Object.values(themes).flat() : themes[theme];
    const item = selectedTheme[getRandomInt(0, selectedTheme.length - 1)];

    let question = '';
    if (type === 'count-and-write') {
        question = `<div style="font-size: 2rem;">${item.repeat(num)}</div> <br> Sayı: ___`;
    } else if (type === 'count-and-color') {
        question = `<div style="font-size: 2rem;">${item.repeat(max)}</div> <br> ${num} tane boya.`;
    } else { // connect-the-dots
        question = `Noktaları birleştirerek ${num} rakamını oluştur.`;
    }
    return { problem: { question, answer: String(num), category: 'number-recognition' }, title };
};

const generatePatterns = (settings: PatternsSettings): { problem: Problem, title: string } => {
    const { type, theme } = settings;
    const title = "Örüntüler";
    const selectedTheme = theme === 'mixed' ? Object.values(themes).flat() : themes[theme];
    const item1 = selectedTheme[0];
    const item2 = selectedTheme[1];
    const item3 = selectedTheme[2];
    
    let pattern = '';
    if (type === 'repeating-ab') pattern = `${item1} ${item2} ${item1} ${item2} ${item1} ___`;
    else if (type === 'repeating-abc') pattern = `${item1} ${item2} ${item3} ${item1} ${item2} ___`;
    else pattern = '1 2 3 4 ___';

    return { problem: { question: `<div style="font-size: 2rem;">${pattern}</div>`, answer: "Örüntüyü tamamla", category: 'patterns' }, title };
};

const generateBasicShapes = (settings: BasicShapesSettings): { problem: Problem, title: string } => {
    // This is a simplified version. Full implementation would require more complex SVG generation.
    const { type } = settings;
    const title = "Temel Geometrik Şekiller";
    const shapes = ['🔴', '🟦', '🔺'];
    let question = '';
    if (type === 'color-shape') question = `Üçgeni 🔺 boya: ${shuffleArray(shapes).join(' ')}`;
    else if (type === 'count-shapes') question = `Kaç tane kare 🟦 var? ${'🟦🔺🔴🟦🟦'.split('').join(' ')}`;
    else question = `Eşleştir: 🏠 ➡️ 🔺`;
    
    return { problem: { question, answer: "...", category: 'basic-shapes' }, title };
};

const generatePositionalConcepts = (settings: PositionalConceptsSettings): { problem: Problem, title: string } => {
    const { type } = settings;
    const title = "Konum ve Yön";
    let question = '';
    if (type === 'above-below') question = 'Masanın üstündeki elmayı 🍎 boya.';
    else if (type === 'inside-outside') question = 'Kutunun içindeki topu ⚽ boya.';
    else question = 'Ağacın 🌳 solundaki kuşu 🐦 boya.';
    return { problem: { question, answer: "Boyama etkinliği", category: 'positional-concepts' }, title };
};

const generateIntroToMeasurement = (settings: IntroToMeasurementSettings): { problem: Problem, title: string } => {
    const { type } = settings;
    const title = "Ölçmeye Giriş";
    let question = '';
    if (type === 'compare-length') question = 'Daha uzun olan kalemi işaretle: ✏️ ✏️';
    else if (type === 'compare-weight') question = 'Daha ağır olan hayvanı işaretle: 🐘 🐁';
    else if (type === 'compare-capacity') question = 'Daha çok su alan bardağı işaretle:  gिलास 🥃';
    else question = 'Silginin boyu kaç ataçtır?';
    return { problem: { question, answer: "İşaretleme", category: 'intro-to-measurement' }, title };
};

const generateSimpleGraphs = (settings: SimpleGraphsSettings): { problem: Problem, title: string } => {
    const { graphType, taskType } = settings;
    const title = "Basit Grafikler";
    let question = '';
    if (taskType === 'read') question = 'Grafiğe göre en çok sevilen meyve hangisidir?';
    else question = 'Verilen meyveleri say ve grafiğe işle.';
    return { problem: { question, answer: "...", category: 'simple-graphs' }, title };
};

const generateVisualAdditionSubtraction = (settings: VisualAdditionSubtractionSettings): { problem: Problem, title: string } => {
    const { operation, theme, maxNumber } = settings;
    const title = "Şekillerle Toplama ve Çıkarma";
    const selectedTheme = theme === 'mixed' ? Object.values(themes).flat() : themes[theme];
    const item = selectedTheme[getRandomInt(0, selectedTheme.length - 1)];

    let n1 = getRandomInt(1, maxNumber);
    let n2 = getRandomInt(1, maxNumber);
    let currentOp = operation;
    if (operation === 'mixed') currentOp = Math.random() < 0.5 ? 'addition' : 'subtraction';

    let question = '';
    let answer = 0;

    if (currentOp === 'addition') {
        answer = n1 + n2;
        question = `<div class="visual-op">${item.repeat(n1)}</div> + <div class="visual-op">${item.repeat(n2)}</div> = ?`;
    } else {
        if (n1 < n2) [n1, n2] = [n2, n1];
        answer = n1 - n2;
        question = `<div class="visual-op">${item.repeat(n1)}</div> - <div class="visual-op">${item.repeat(n2)}</div> = ?`;
    }

    return { problem: { question, answer: String(answer), category: 'visual-addition-subtraction' }, title };
};

const generateVerbalArithmetic = (settings: VerbalArithmeticSettings): { problem: Problem, title: string } => {
    const { operation, maxResult } = settings;
    const title = "İşlemi Sözel İfade Etme";

    let n1=0, n2=0, answer=0;
    let op = '+';
    let currentOp = operation;
    if (operation === 'mixed') currentOp = Math.random() < 0.5 ? 'addition' : 'subtraction';

    if (currentOp === 'addition') {
        answer = getRandomInt(2, maxResult);
        n1 = getRandomInt(1, answer - 1);
        n2 = answer - n1;
        op = '+';
    } else {
        n1 = getRandomInt(2, maxResult);
        n2 = getRandomInt(1, n1 - 1);
        answer = n1 - n2;
        op = '-';
    }
    
    const question = `<div style="font-size: 1.5rem; font-family: monospace;">${n1} ${op} ${n2} = ${answer}</div>`;
    const opWord = op === '+' ? 'artı' : 'eksi';
    const textAnswer = `${numberToWords(n1)} ${opWord} ${numberToWords(n2)} eşittir ${numberToWords(answer)}`;

    return { problem: { question, answer: textAnswer, category: 'verbal-arithmetic' }, title };
};

const generateMissingNumberPuzzles = (settings: MissingNumberPuzzlesSettings): { problem: Problem, title: string } => {
    const { operation, maxResult } = settings;
    const title = "Eksik Sayıyı Bulma";
    const n1 = getRandomInt(1, maxResult - 1);
    const n2 = getRandomInt(1, maxResult - n1);
    const result = n1 + n2;

    let question = '';
    // FIX: Initialize 'answer' to prevent it from being potentially unassigned, which can cause type errors.
    let answer: string | number = '';
    const missingPart = getRandomInt(1, 3);

    if (operation === 'addition') {
        if (missingPart === 1) { question = `? + ${n2} = ${result}`; answer = n1; }
        else if (missingPart === 2) { question = `${n1} + ? = ${result}`; answer = n2; }
        else { question = `${n1} + ${n2} = ?`; answer = result; }
    } else { // subtraction
        if (missingPart === 1) { question = `? - ${n1} = ${n2}`; answer = result; }
        else if (missingPart === 2) { question = `${result} - ? = ${n2}`; answer = n1; }
        else { question = `${result} - ${n1} = ?`; answer = n2; }
    }

    return { problem: { question: `<div style="font-size: 1.5rem;">${question}</div>`, answer, category: 'missing-number-puzzles' }, title };
};


const generateSymbolicArithmetic = (settings: SymbolicArithmeticSettings): { problem: Problem, title: string, preamble?: string } => {
    const { operation, theme, maxNumber } = settings;
    const title = "Simgelerle İşlemler";
    const selectedTheme = themes[theme] || themes.animals;
    const symbols = shuffleArray(selectedTheme).slice(0, maxNumber + 1);
    
    const preamble = `<b>Simge Anahtarı:</b><br/>${symbols.map((s, i) => `${s} = ${i}`).join(', ')}`;

    let n1 = getRandomInt(1, maxNumber);
    let n2 = getRandomInt(1, maxNumber);
    let currentOp = operation;
    if (operation === 'mixed') currentOp = Math.random() < 0.5 ? 'addition' : 'subtraction';

    let question = '', answer = 0;

    if (currentOp === 'addition') {
        if (n1 + n2 > maxNumber) { n1 = getRandomInt(1, Math.floor(maxNumber / 2)); n2 = getRandomInt(1, maxNumber - n1); }
        answer = n1 + n2;
        question = `${symbols[n1]} + ${symbols[n2]} = ?`;
    } else { // subtraction
        if (n1 < n2) [n1, n2] = [n2, n1];
        answer = n1 - n2;
        question = `${symbols[n1]} - ${symbols[n2]} = ?`;
    }

    return { problem: { question: `<div style="font-size: 2rem;">${question}</div>`, answer: symbols[answer], category: 'symbolic-arithmetic' }, title, preamble };
};

const generateProblemCreation = (settings: ProblemCreationSettings): { problem: Problem, title: string } => {
    const { operation, difficulty, theme } = settings;
    const title = "Problem Kurma";

    const maxByDifficulty = { easy: 20, medium: 100, hard: 1000 };
    const maxResult = maxByDifficulty[difficulty];
    const n1 = getRandomInt(1, maxResult -1);
    const n2 = getRandomInt(1, maxResult - n1);

    let op = '+', result = n1 + n2;
    if (operation === 'subtraction') {
        op = '-';
        result = n1 > n2 ? n1 - n2 : n2 - n1;
    }
    
    const selectedTheme = theme === 'mixed' ? Object.values(themes).flat() : themes[theme];
    const item1 = selectedTheme[getRandomInt(0, selectedTheme.length - 1)];

    const question = `
        <div class="problem-creation-box">
            <div class="pc-left">
                <div class="pc-equation">${n1} ${op} ${n2} = ${result}</div>
                <div class="pc-theme-icon">${item1}</div>
            </div>
            <div class="pc-right">
                <p><strong>Problem:</strong></p>
                <div class="pc-lines"></div>
            </div>
        </div>
    `;

    return { problem: { question, answer: "Öğrenci problemi yazar.", category: 'problem-creation' }, title };
};


export const generateReadinessProblem = (moduleKey: string, settings: any): { problem: Problem, title: string, error?: string, preamble?: string } => {
    switch (moduleKey) {
        case 'matching-and-sorting': return generateMatchingAndSorting(settings);
        case 'comparing-quantities': return generateComparingQuantities(settings);
        case 'number-recognition': return generateNumberRecognition(settings);
        case 'patterns': return generatePatterns(settings);
        case 'basic-shapes': return generateBasicShapes(settings);
        case 'positional-concepts': return generatePositionalConcepts(settings);
        case 'intro-to-measurement': return generateIntroToMeasurement(settings);
        case 'simple-graphs': return generateSimpleGraphs(settings);
        case 'visual-addition-subtraction': return generateVisualAdditionSubtraction(settings);
        case 'verbal-arithmetic': return generateVerbalArithmetic(settings);
        case 'missing-number-puzzles': return generateMissingNumberPuzzles(settings);
        case 'symbolic-arithmetic': return generateSymbolicArithmetic(settings);
        case 'problem-creation': return generateProblemCreation(settings);
        default:
            return {
                problem: { question: 'Bilinmeyen modül', answer: 'Hata', category: 'error' },
                title: 'Hata',
                error: `Modül bulunamadı: ${moduleKey}`
            };
    }
};
