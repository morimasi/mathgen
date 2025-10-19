// services/dyscalculiaService.ts

import { Problem, DyscalculiaSubModuleType } from '../types.ts';
import { generateDyscalculiaAIProblem } from './geminiService.ts';
import { drawFractionPie } from './svgService.ts';

// --- UTILS ---
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

// --- LOCAL GENERATOR FUNCTIONS ---

const generateNumberSenseLocal = (settings: any): { problem: Problem; title: string } => {
    const title = "Sayı Hissi";
    const { type, maxNumber } = settings;
    let question = '', answer = '';
    const n1 = getRandomInt(0, maxNumber);
    let n2 = getRandomInt(0, maxNumber);
    while (n1 === n2) n2 = getRandomInt(0, maxNumber);

    switch (type) {
        case 'compare':
            question = `<div class="dyscalculia-compare"><span>${n1}</span> <span>${n2}</span></div>`;
            answer = n1 > n2 ? `${n1} daha büyük` : `${n2} daha büyük`;
            break;
        case 'order':
            const n3 = getRandomInt(0, maxNumber);
            const numbers = [n1, n2, n3].sort(() => Math.random() - 0.5);
            question = `Sayıları küçükten büyüğe sırala: ${numbers.join(', ')}`;
            answer = numbers.sort((a, b) => a - b).join(', ');
            break;
        case 'number-line':
            question = `Sayı doğrusunda ${n1}'i göster.`;
            answer = `Sayı doğrusunda ${n1} işaretlenir.`;
            break;
    }
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateArithmeticFluencyLocal = (settings: any): { problem: Problem; title: string } => {
    const title = "Aritmetik Akıcılığı";
    const { operation, difficulty } = settings;
    const max = difficulty === 'easy' ? 9 : 99;
    let n1 = getRandomInt(1, max);
    let n2 = getRandomInt(1, max);
    let question = '', answer = '';

    let currentOp = operation;
    if (operation === 'mixed') currentOp = Math.random() < 0.5 ? 'addition' : 'subtraction';

    if (currentOp === 'addition') {
        if (n1 + n2 > max * 1.5) { n1 = getRandomInt(1, Math.floor(max/2)); n2 = getRandomInt(1, Math.floor(max/2)); }
        question = `${n1} + ${n2} = ?`;
        answer = String(n1 + n2);
    } else {
        if (n1 < n2) [n1, n2] = [n2, n1];
        question = `${n1} - ${n2} = ?`;
        answer = String(n1 - n2);
    }
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateFractionsDecimalsIntroLocal = (settings: any): { problem: Problem; title: string } => {
    const title = "Kesirlere Giriş";
    const { type } = settings;
    let question = '', answer = '';

    if (type === 'visual-match') {
        const den = [2, 4][getRandomInt(0, 1)];
        const num = getRandomInt(1, den);
        question = drawFractionPie(num, den);
        answer = `${num}/${den}`;
    } else {
        question = `Hangisi daha büyük? 1/2 mi, 1/4 mü?`;
        answer = '1/2';
    }
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};

const generateVisualArithmeticLocal = (settings: any): { problem: Problem; title: string } => {
    const title = "Görsel Aritmetik";
    const { operation, maxNumber } = settings;
    let n1 = getRandomInt(1, maxNumber);
    let n2 = getRandomInt(1, maxNumber);
    const item = ['🍎', '🚗', '⭐', '🎈'][getRandomInt(0, 3)];
    let question = '', answer = '';

    if (operation === 'addition') {
        if (n1 + n2 > maxNumber + 2) { n1 = getRandomInt(1, Math.floor(maxNumber / 2)); n2 = getRandomInt(1, Math.floor(maxNumber / 2)); }
        question = `<div class="visual-op">${item.repeat(n1)}</div> + <div class="visual-op">${item.repeat(n2)}</div> = ?`;
        answer = String(n1 + n2);
    } else {
        if (n1 < n2) [n1, n2] = [n2, n1];
        question = `<div class="visual-op">${item.repeat(n1)}</div> - <div class="visual-op">${item.repeat(n2)}</div> = ?`;
        answer = String(n1 - n2);
    }
    return { problem: { question, answer, category: 'dyscalculia' }, title };
};


export const generateDyscalculiaProblem = async (subModuleId: DyscalculiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    
    // Modules that rely on AI generation
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
            case 'fractions-decimals-intro':
                result = generateFractionsDecimalsIntroLocal(settings);
                break;
            case 'visual-arithmetic':
                result = generateVisualArithmeticLocal(settings);
                break;

            // Placeholders for other local modules
            case 'number-grouping':
            case 'math-language':
            case 'time-measurement-geometry':
            case 'spatial-reasoning':
            case 'estimation-skills':
            case 'visual-number-representation':
                 result = { 
                    problem: { question: `Bu alıştırma ('${subModuleId}') için yerel üreteç henüz tamamlanmadı.`, answer: "...", category: 'dyscalculia' },
                    title: 'Bilinmeyen Modül'
                };
                break;
            default:
                result = { 
                    problem: { question: `Bilinmeyen alıştırma: '${subModuleId}'`, answer: "...", category: 'dyscalculia' },
                    title: 'Bilinmeyen Modül'
                };
        }
        problems.push(result.problem);
        if(i === 0) title = result.title;
    }

    return { problems, title };
};
