// services/dyscalculiaService.ts

import { Problem, DyscalculiaSubModuleType } from '../types';
import { generateDyscalculiaAIProblem } from './geminiService';
import { drawFractionPie, drawAnalogClock } from './svgService';

// --- LOCAL GENERATION LOGIC ---

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// --- Local Generator Functions ---

const generateNumberSenseLocal = (settings: any): { problem: Problem, title: string } => {
    const { type, maxNumber } = settings;
    let question = "", answer: string | number = "", title = "Sayı Hissi";

    switch (type) {
        case 'compare':
            title = "Sayıları Karşılaştır";
            let n1 = getRandomInt(1, maxNumber);
            let n2 = getRandomInt(1, maxNumber);
            while (n1 === n2) n2 = getRandomInt(1, maxNumber);
            question = `<span style="font-size: 2rem; font-weight: bold;">${n1} ___ ${n2}</span>`;
            answer = n1 > n2 ? '>' : '<';
            break;
        case 'order':
            title = "Sayıları Sırala";
            const numbers = Array.from({ length: 4 }, () => getRandomInt(1, maxNumber));
            const sorted = [...numbers].sort((a, b) => a - b);
            question = `Bu sayıları küçükten büyüğe sırala: <br/> <b style="font-size: 1.5rem;">${shuffleArray(numbers).join(', ')}</b>`;
            answer = sorted.join(', ');
            break;
        case 'number-line':
            title = "Sayı Doğrusu";
            const start = getRandomInt(0, maxNumber - 5);
            const missingPos = getRandomInt(1, 4);
            answer = start + missingPos;
            const lineItems = Array.from({ length: 6 }, (_, i) => 
                i === missingPos ? '?' : start + i
            );
            question = `Sayı doğrusunda eksik olan sayıyı bulun: <br/> <div style="font-family: monospace; font-size: 1.5rem; margin-top: 1rem;">${lineItems.join(' - ')}</div>`;
            break;
    }
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateArithmeticFluencyLocal = (settings: any): { problem: Problem, title: string } => {
    const { operation, difficulty } = settings;
    const max = difficulty === 'easy' ? 9 : 99;
    let n1 = getRandomInt(1, max);
    let n2 = getRandomInt(1, max);
    let op = operation;
    if(op === 'mixed') op = Math.random() < 0.5 ? 'addition' : 'subtraction';

    let question = "", answer: number = 0, title = "Aritmetik Akıcılığı";
    if (op === 'addition') {
        if(n1 + n2 > max * 1.5) { // Keep results reasonable
            n1 = getRandomInt(1, max/2);
            n2 = getRandomInt(1, max/2);
        }
        question = `<span style="font-size: 1.5rem; font-family: monospace;">${n1} + ${n2} = ?</span>`;
        answer = n1 + n2;
    } else { // subtraction
        if (n1 < n2) [n1, n2] = [n2, n1];
        question = `<span style="font-size: 1.5rem; font-family: monospace;">${n1} - ${n2} = ?</span>`;
        answer = n1 - n2;
    }
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateVisualArithmeticLocal = (settings: any): { problem: Problem, title: string } => {
    const { operation, maxNumber } = settings;
    const item = '🍎';
    let n1 = getRandomInt(1, maxNumber - 1);
    let n2 = getRandomInt(1, maxNumber - n1);
    let question = "", answer: number = 0, title = "Görsel Aritmetik";

    if (operation === 'addition') {
        question = `<div style="font-size: 2rem;">${item.repeat(n1)} + ${item.repeat(n2)} = ?</div>`;
        answer = n1 + n2;
    } else { // subtraction
        if (n1 < n2) [n1, n2] = [n2, n1];
        question = `<div style="font-size: 2rem;">${item.repeat(n1)} - ${item.repeat(n2)} = ?</div>`;
        answer = n1 - n2;
    }
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateFractionsDecimalsIntroLocal = (settings: any): { problem: Problem, title: string } => {
    const { type } = settings;
    let question = "", answer = "", title = "Kesirlere Giriş";
    
    if (type === 'visual-match') {
        const fractions = [{n: 1, d: 2}, {n: 1, d: 3}, {n: 1, d: 4}];
        const selected = fractions[getRandomInt(0, fractions.length - 1)];
        question = drawFractionPie(selected.n, selected.d);
        answer = `${selected.n}/${selected.d}`;
    } else { // compare
        question = `Hangisi daha büyük? <b style="font-size: 1.5rem;">1/2</b> mi, <b style="font-size: 1.5rem;">1/4</b> mü?`;
        answer = '1/2';
    }
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateNumberGroupingLocal = (settings: any): { problem: Problem; title: string; } => {
    const { maxNumber } = settings;
    const title = "Sayı Gruplama (Onluk Birlik)";
    const number = getRandomInt(11, maxNumber);
    const tens = Math.floor(number / 10);
    const ones = number % 10;
    const question = `<b>${number}</b> sayısında kaç onluk ve kaç birlik vardır?<br/>Onluk: ___ Birlik: ___`;
    const answer = `Onluk: ${tens}, Birlik: ${ones}`;
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateMathLanguageLocal = (settings: any): { problem: Problem; title: string; } => {
    const title = "Matematiksel Dil";
    const map = { '+': 'Artı', '-': 'Eksi', '=': 'Eşittir' };
    const symbol = Object.keys(map)[getRandomInt(0, 2)];
    const word = map[symbol as keyof typeof map];
    const question = `<b>'${word}'</b> kelimesinin matematiksel sembolü nedir?`;
    const answer = symbol;
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateTimeMeasurementGeometryLocal = (settings: any): { problem: Problem; title: string; } => {
    const { category } = settings;
    if (category === 'time') {
        const title = "Saat Okuma";
        const hour = getRandomInt(1, 12);
        const question = drawAnalogClock(hour, 0);
        const answer = `Saat tam ${hour}`;
        return { problem: { question, answer, category: 'dyscalculia' }, title };
    }
    // Add simple measurement and geometry questions
    const title = "Ölçme/Geometri";
    const question = "Hangi çizgi daha uzun?";
    const answer = "Üstteki";
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateSpatialReasoningLocal = (settings: any): { problem: Problem; title: string; } => {
    const title = "Uzamsal Akıl Yürütme";
    const pattern = "🟥🟦🟥";
    const question = `Aşağıdaki deseni kopyalayın:<br/><b style="font-size: 2rem;">${pattern}</b><div style="border: 1px dashed #ccc; height: 3rem; margin-top: 1rem;"></div>`;
    const answer = pattern;
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateEstimationSkillsLocal = (settings: any): { problem: Problem; title: string; } => {
    const title = "Tahmin Becerileri";
    const count = getRandomInt(5, 20);
    const items = '🔵'.repeat(count);
    const question = `Resimde yaklaşık olarak kaç top olduğunu tahmin et.<br/><div style="font-size: 1.5rem; line-height: 1.2;">${items}</div>`;
    const answer = `Yaklaşık ${Math.round(count / 5) * 5}`;
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateVisualNumberRepresentationLocal = (settings: any): { problem: Problem; title: string; } => {
    const { maxNumber, representation } = settings;
    const title = "Sayıların Görsel Temsili";
    const number = getRandomInt(1, maxNumber);
    let representationHtml = '';
    if (representation === 'dots') {
        representationHtml = `<span style="font-size: 2rem; color: #3b82f6;">${'●'.repeat(number)}</span>`;
    } else { // blocks
        const tens = Math.floor(number / 10);
        const ones = number % 10;
        representationHtml = `<span style="font-size: 2rem; color: #ef4444;">${'|'.repeat(tens)}</span><span style="font-size: 2rem; color: #3b82f6; margin-left: 0.5rem;">${'●'.repeat(ones)}</span>`;
    }
    const question = `Aşağıdaki görsel hangi sayıyı temsil ediyor?<br/>${representationHtml}`;
    const answer = String(number);
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

export const generateDyscalculiaProblem = async (subModuleId: DyscalculiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    
    const aiModules: DyscalculiaSubModuleType[] = ['problem-solving', 'interactive-story-dc'];

    if (aiModules.includes(subModuleId)) {
        return generateDyscalculiaAIProblem(subModuleId, settings, count);
    }
    
    // For local generation
    let problems: Problem[] = [];
    let title = 'Diskalkuli Alıştırması';

    for(let i=0; i < count; i++) {
        let result: { problem: Problem; title: string; };
        switch(subModuleId) {
            case 'number-sense':
                result = generateNumberSenseLocal(settings);
                break;
            case 'arithmetic-fluency':
                result = generateArithmeticFluencyLocal(settings);
                break;
            case 'visual-arithmetic':
                result = generateVisualArithmeticLocal(settings);
                break;
            case 'fractions-decimals-intro':
                result = generateFractionsDecimalsIntroLocal(settings);
                break;
            case 'number-grouping':
                result = generateNumberGroupingLocal(settings);
                break;
            case 'math-language':
                result = generateMathLanguageLocal(settings);
                break;
            case 'time-measurement-geometry':
                result = generateTimeMeasurementGeometryLocal(settings);
                break;
            case 'spatial-reasoning':
                result = generateSpatialReasoningLocal(settings);
                break;
            case 'estimation-skills':
                result = generateEstimationSkillsLocal(settings);
                break;
            case 'visual-number-representation':
                result = generateVisualNumberRepresentationLocal(settings);
                break;
            default:
                result = { 
                    problem: { question: `Bu alıştırma ('${subModuleId}') için yerel üreteç henüz tanımlanmadı.`, answer: "...", category: 'dyscalculia' },
                    title: 'Bilinmeyen Modül'
                };
        }
        problems.push(result.problem);
        if(i === 0) title = result.title;
    }

    return { problems, title };
};