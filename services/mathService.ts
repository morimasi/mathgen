
import { Problem, DecimalsOperation, ArithmeticOperation, CarryBorrowPreference, DivisionType, DecimalsSettings, ArithmeticSettings, VisualSupportSettings } from '../types';
import { numberToWords } from './utils';

// --- UTILS ---
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomByDigits = (d: number) => {
    if (d === 1) return getRandomInt(0,9);
    return getRandomInt(Math.pow(10, d-1), Math.pow(10, d) - 1);
};


// --- ARITHMETIC SERVICE ---
const EMOJI_MAP: { [key in ArithmeticOperation]?: string[] } = {
    [ArithmeticOperation.Addition]: ['🍎', '🍊', '🍓', '🚗', '🧸', '🐶', '🎈', '⭐', '🌸', '💎', '📚', '🎁', '🚀', '⚽', '🍰', '🐟', '🚁', '💡'],
    [ArithmeticOperation.Subtraction]: ['🍪', '🍕', '🍰', '🍬', '🎈', '🪙', '✏️', '🦋', '🍎', '🍓', '🎁', '⭐', '🍇', '🍒', '🐠', '📦'],
    [ArithmeticOperation.Multiplication]: ['⭐', '🌸', '💎', '⚽', '🐞', '🚀', '🎁', '📦', '💐', '🍇', '🍒', '✨', '🎈', '💎'],
    [ArithmeticOperation.Division]: ['⚽', '🍬', '🔵', '🍕', '🍓', '🪙', '📚', '🍪', '🍰', '🍇', '🍒', '🍊', '🍎', '🎁'],
    [ArithmeticOperation.MixedAdditionSubtraction]: ['🔵', '🔴', '🟩', '🔺', '⭐', '🔶', '🔷', '⚫', '⚪', '💜', '🧡', '💚'],
};

// --- NEW VISUAL SUPPORT SERVICE ---
const createVisualUnitHTML = (num: number, emoji: string): string => {
    const MAX_EMOJI_PER_LINE = 5;

    let emojiHtml = '';
    for (let i = 1; i <= num; i++) {
        emojiHtml += emoji;
        if (i % MAX_EMOJI_PER_LINE === 0 && i < num) {
            emojiHtml += '<br>';
        }
    }
    
    const boxHtml = `<div style="border: 1.5px solid #9ca3af; border-radius: 6px; height: var(--visual-box-height); width: var(--visual-box-width); margin-top: 0.5rem; background-color: #f9fafb;"></div>`;
    
    return `
        <div style="display: flex; flex-direction: column; align-items: center; min-width: var(--visual-container-min-width); gap: 0.25rem;">
            <div style="min-height: 3.2em; display: flex; align-items: center; justify-content: center; line-height: 1.4; letter-spacing: 0.1em; text-align: center; font-size: var(--visual-emoji-size);"><div>${emojiHtml}</div></div>
            ${boxHtml}
        </div>
    `;
};


export const generateVisualProblem = (settings: VisualSupportSettings): { problem: Problem, title: string } => {
    const { operation, maxNumber } = settings;
    // FIX: The `display` property was inferred as `string`, which is not assignable to the `Problem` type's `display` property.
    // Using `as const` ensures TypeScript infers the literal type `'inline'`, which is valid.
    const problemBase = { category: 'visual-support', display: 'inline' as const };
    const title = "Aşağıdaki nesneleri sayarak işlemleri yapınız.";

    const currentOperation = operation === ArithmeticOperation.MixedAdditionSubtraction
        ? (Math.random() < 0.5 ? ArithmeticOperation.Addition : ArithmeticOperation.Subtraction)
        : operation;

    let attempts = 0;
    while (attempts < 100) {
        attempts++;
        let n1: number = 0, n2: number = 0;
        let answer: number | string = 0;
        let opSymbol: string = '?';

        switch (currentOperation) {
            case ArithmeticOperation.Addition:
                n1 = getRandomInt(1, maxNumber - 2);
                n2 = getRandomInt(1, maxNumber - n1);
                answer = n1 + n2;
                opSymbol = '+';
                break;
            case ArithmeticOperation.Subtraction:
                n1 = getRandomInt(2, maxNumber);
                n2 = getRandomInt(1, n1 - 1);
                answer = n1 - n2;
                opSymbol = '-';
                break;
            case ArithmeticOperation.Multiplication:
                const maxFactor = Math.floor(Math.sqrt(maxNumber));
                const factor1 = getRandomInt(2, maxFactor);
                const factor2 = getRandomInt(2, Math.floor(maxNumber / factor1));
                n1 = factor1;
                n2 = factor2;
                answer = n1 * n2;
                opSymbol = '×';
                break;
            case ArithmeticOperation.Division:
                const divisor = getRandomInt(2, Math.floor(Math.sqrt(maxNumber)));
                const quotient = getRandomInt(1, Math.floor(maxNumber / divisor));
                n1 = divisor * quotient;
                n2 = divisor;
                answer = quotient;
                opSymbol = '÷';
                break;
        }

        if (n1 > 0 && n2 > 0) {
            const emojiList = EMOJI_MAP[currentOperation] || ['❔'];
            const selectedEmoji = emojiList[getRandomInt(0, emojiList.length - 1)];

            const operatorStyle = `font-size: calc(var(--visual-number-size) * 1.5); font-weight: bold;`;
            
            const q = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                    ${createVisualUnitHTML(n1, selectedEmoji)}
                    <span style="${operatorStyle}">${opSymbol}</span>
                    ${createVisualUnitHTML(n2, selectedEmoji)}
                    <span style="${operatorStyle}">= ?</span>
                </div>`;

            return { problem: { ...problemBase, question: q, answer: String(answer) }, title };
        }
    }
     return { problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, title: "Hata" };
};


// --- OLD ARITHMETIC SERVICE ---
const questionTemplates = {
    [ArithmeticOperation.Addition]: [
        "{n1} {n2} daha kaç eder?",
        "{n1} ile {n2} sayısının toplamı kaçtır?",
        "{n1} sayısına {n2} eklersek sonuç ne olur?",
        "{n1} sayısının {n2} fazlası kaçtır?"
    ],
    [ArithmeticOperation.Subtraction]: [
        "{n1} sayısından {n2} çıkarsa kaç kalır?",
        "{n1} sayısının {n2} eksiği kaçtır?",
        "{n1} ile {n2} arasındaki fark kaçtır?"
    ],
    [ArithmeticOperation.Multiplication]: [
        "{n1} kere {n2} kaç eder?",
        "{n1} ile {n2} sayısının çarpımı kaçtır?",
        "{n1} sayısının {n2} katı kaçtır?"
    ],
    [ArithmeticOperation.Division]: [
        "{n1} sayısını {n2} sayısına bölersek sonuç kaç olur?",
        "{n1} sayısının içinde kaç tane {n2} vardır?",
        "{n1} bölü {n2} kaçtır?"
    ]
};


const hasCarry = (n1: number, n2: number, n3: number = 0): boolean => {
    const s1 = String(n1).padStart(5, '0');
    const s2 = String(n2).padStart(5, '0');
    const s3 = String(n3).padStart(5, '0');
    let carry = 0;
    for (let i = 4; i >= 0; i--) {
        const sum = parseInt(s1[i]) + parseInt(s2[i]) + parseInt(s3[i]) + carry;
        if (sum >= 10) return true;
        carry = Math.floor(sum / 10);
    }
    return false;
};

const hasBorrow = (n1: number, n2: number): boolean => {
    const s1 = String(n1);
    const s2 = String(n2).padStart(s1.length, '0');
    for (let i = s1.length - 1; i >= 0; i--) {
        if (parseInt(s1[i]) < parseInt(s2[i])) return true;
    }
    return false;
};

const generateVerticalProblemHTML = (operands: (number | string)[], operator: string): string => {
    const containerStyle = "display: inline-block; font-family: monospace; line-height: 1.5; font-size: 1.25em;";
    const contentStyle = "white-space: pre; border-bottom: 2px solid black; padding-bottom: 0.3em; text-align: right;";

    const numOperands = operands.map(op => String(op));
    const maxLength = Math.max(...numOperands.map(op => op.length));
    const totalWidth = maxLength + 2; 

    let lines: string[] = [];
    for (let i = 0; i < numOperands.length - 1; i++) {
        lines.push(numOperands[i].padStart(totalWidth, ' '));
    }
    const lastLine = `${operator} ${numOperands[numOperands.length - 1]}`;
    lines.push(lastLine.padStart(totalWidth, ' '));
    
    const content = lines.join('\n');

    let html = `<div style="${containerStyle}">`;
    html += `<div style="${contentStyle}">${content}</div>`;
    html += `</div>`;
    return html;
};

const generateLongDivisionHTML = (dividend: number, divisor: number): string => {
    const quotientPlaceholder = '&nbsp;'.repeat(String(Math.floor(dividend / divisor)).length || 1);
    const html = `
    <div style="display: inline-grid; grid-template-areas: '. quotient' 'divisor dividend'; align-items: center; font-family: monospace; font-size: 1.25em; line-height: 1.5;">
        <div style="grid-area: divisor; padding-right: 0.5em; text-align: right;">${divisor}</div>
        <div style="grid-area: dividend; border-left: 2px solid black; padding-left: 0.5em;">${dividend}</div>
        <div style="grid-area: quotient; border-top: 2px solid black; text-align: left;">${quotientPlaceholder}</div>
    </div>`;
    return html;
}

export const generateArithmeticProblem = (settings: ArithmeticSettings): { problem: Problem, title: string, error?: string } => {
    const { operation, format = 'inline', representation = 'number' } = settings;
    let attempts = 0;
    
    const operationNames: { [key in ArithmeticOperation]: string } = {
        [ArithmeticOperation.Addition]: 'Toplama',
        [ArithmeticOperation.Subtraction]: 'Çıkarma',
        [ArithmeticOperation.Multiplication]: 'Çarpma',
        [ArithmeticOperation.Division]: 'Bölme',
        [ArithmeticOperation.MixedAdditionSubtraction]: 'Toplama ve Çıkarma'
    };
    
    const currentOperation = operation === ArithmeticOperation.MixedAdditionSubtraction
        ? (Math.random() < 0.5 ? ArithmeticOperation.Addition : ArithmeticOperation.Subtraction)
        : operation;

    const title = `Aşağıdaki ${operationNames[operation].toLowerCase()} işlemlerini yapınız.`;
    
    const problemBase = { category: 'arithmetic', display: format };

    // --- STANDARD MODE LOGIC ---
    while(attempts < 100){
        attempts++;
        let n1 = getRandomByDigits(settings.digits1);
        let n2 = getRandomByDigits(settings.digits2);
        let n3 = settings.hasThirdNumber ? getRandomByDigits(settings.digits3) : 0;
        
        const useWords = (representation === 'word' || (representation === 'mixed' && Math.random() < 0.5));
        
        const formatNumber = (num: number) => useWords ? numberToWords(num) : String(num);

        const generateNaturalQuestion = (op: ArithmeticOperation, num1: number, num2: number): string => {
            const templates = questionTemplates[op];
            if (!templates) return `${formatNumber(num1)} ? ${formatNumber(num2)} = ?`; // Fallback
            const template = templates[getRandomInt(0, templates.length - 1)];
            const n1Words = numberToWords(num1);
            const n2Words = numberToWords(num2);
            return template.replace('{n1}', n1Words).replace('{n2}', n2Words);
        };

        switch(currentOperation) {
            case ArithmeticOperation.Addition: {
                if(settings.hasThirdNumber) {
                     const question = format === 'vertical-html' 
                        ? generateVerticalProblemHTML([formatNumber(n1), formatNumber(n2), formatNumber(n3)], '+')
                        : `${formatNumber(n1)} + ${formatNumber(n2)} + ${formatNumber(n3)} = ?`;
                     return { problem: { ...problemBase, question, answer: n1 + n2 + n3 }, title };
                }
                const carry = hasCarry(n1, n2);
                if(settings.carryBorrow === 'with' && !carry) continue;
                if(settings.carryBorrow === 'without' && carry) continue;

                let question: string;
                if (useWords && format === 'inline') {
                    question = generateNaturalQuestion(currentOperation, n1, n2);
                } else {
                     question = format === 'vertical-html'
                        ? generateVerticalProblemHTML([formatNumber(n1), formatNumber(n2)], '+')
                        : `${formatNumber(n1)} + ${formatNumber(n2)} = ?`;
                }
                return { problem: { ...problemBase, question, answer: n1 + n2 }, title };
            }
            case ArithmeticOperation.Subtraction: {
                if (n1 < n2) [n1, n2] = [n2, n1];
                if (n1 === n2) continue;
                if(settings.hasThirdNumber) {
                    if (n1 < n2 + n3) continue;
                    const question = format === 'vertical-html'
                        ? generateVerticalProblemHTML([formatNumber(n1), formatNumber(n2), formatNumber(n3)], '-')
                        : `${formatNumber(n1)} - ${formatNumber(n2)} - ${formatNumber(n3)} = ?`;
                    return { problem: { ...problemBase, question, answer: n1 - n2 - n3 }, title };
                }

                const borrow = hasBorrow(n1, n2);
                if(settings.carryBorrow === 'with' && !borrow) continue;
                if(settings.carryBorrow === 'without' && borrow) continue;
                
                let question: string;
                if (useWords && format === 'inline') {
                    question = generateNaturalQuestion(currentOperation, n1, n2);
                } else {
                    question = format === 'vertical-html'
                        ? generateVerticalProblemHTML([formatNumber(n1), formatNumber(n2)], '-')
                        : `${formatNumber(n1)} - ${formatNumber(n2)} = ?`;
                }
                return { problem: { ...problemBase, question, answer: n1 - n2 }, title };
            }
            case ArithmeticOperation.Multiplication: {
                let question: string;
                 if (useWords && format === 'inline') {
                    question = generateNaturalQuestion(currentOperation, n1, n2);
                } else {
                    question = format === 'vertical-html'
                        ? generateVerticalProblemHTML([formatNumber(n1), formatNumber(n2)], '×')
                        : `${formatNumber(n1)} × ${formatNumber(n2)} = ?`;
                }
                return { problem: { ...problemBase, question, answer: n1 * n2 }, title };
            }
            case ArithmeticOperation.Division: {
                if (n2 === 0 || n2 === 1) continue;
                if (n1 < n2) [n1, n2] = [n2, n1];
                
                const remainder = n1 % n2;
                const quotient = Math.floor(n1 / n2);

                if (settings.divisionType === 'without-remainder' && remainder !== 0) continue;
                if (settings.divisionType === 'with-remainder' && remainder === 0 && n1 !== n2) continue;

                let question: string;
                 if (useWords && format === 'inline') {
                    if(remainder !== 0) {
                         question = `${numberToWords(n1)} sayısını ${numberToWords(n2)} sayısına bölersek bölüm ve kalan kaç olur?`;
                    } else {
                        question = generateNaturalQuestion(currentOperation, n1, n2);
                    }
                } else {
                    question = format === 'long-division-html'
                        ? generateLongDivisionHTML(n1, n2)
                        : `${n1} ÷ ${n2} = ?`;
                }

                const answer = remainder === 0 ? `${quotient}` : `Bölüm: ${quotient}, Kalan: ${remainder}`;

                return { problem: { ...problemBase, question, answer }, title };
            }
        }
    }
    return { 
        problem: { question: "Hata", answer: "Hata", category: 'arithmetic' }, 
        title: "Hata",
        error: "Mevcut ayarlarla uygun bir problem oluşturulamadı. Lütfen basamak sayılarını, eldeli/onluk bozmalı veya kalanlı bölme ayarlarını değiştirip tekrar deneyin." 
    };
}


// --- DECIMALS SERVICE ---
const difficultyLevels = {
    easy: { max: 10, places: 1 },
    medium: { max: 100, places: 2 },
    hard: { max: 200, places: 3 },
};

const getRandomDecimal = (max: number, places: number): number => {
    const num = Math.random() * max;
    return parseFloat(num.toFixed(places));
};

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

export const generateDecimalProblem = (settings: DecimalsSettings): { problem: Problem, title: string } => {
    const { type, operation, difficulty = 'easy', format = 'inline', representation = 'number' } = settings;
    const { max, places } = difficultyLevels[difficulty];
    let problem: Problem;
    let title = '';
    
    const useWords = (representation === 'word' || (representation === 'mixed' && Math.random() < 0.5));
    const problemBase = { category: 'decimals', display: format };

    switch(type) {
        case 'four-operations': {
             const currentOperation = operation === DecimalsOperation.Mixed
                ? [DecimalsOperation.Addition, DecimalsOperation.Subtraction, DecimalsOperation.Multiplication, DecimalsOperation.Division][getRandomInt(0, 3)]
                : operation!;
            
            const operationNames: { [key in DecimalsOperation]: string } = {
                [DecimalsOperation.Addition]: 'Toplama',
                [DecimalsOperation.Subtraction]: 'Çıkarma',
                [DecimalsOperation.Multiplication]: 'Çarpma',
                [DecimalsOperation.Division]: 'Bölme',
                [DecimalsOperation.Mixed]: 'Dört İşlem',
            };
            title = `Aşağıdaki ondalık sayılarla ${operationNames[operation!].toLowerCase()} işlemlerini yapınız.`;

            let num1 = getRandomDecimal(max, places);
            let num2 = getRandomDecimal(max, places);
            let question = '';
            let answer: number;
            const opSymbol = { [DecimalsOperation.Addition]: '+', [DecimalsOperation.Subtraction]: '-', [DecimalsOperation.Multiplication]: '×', [DecimalsOperation.Division]: '÷' }[currentOperation!];


            switch (currentOperation) {
                case DecimalsOperation.Addition:
                    answer = num1 + num2;
                    break;
                case DecimalsOperation.Subtraction:
                    // FIX: Changed `n2` to `num2` to fix a reference error.
                    if (num1 < num2) [num1, num2] = [num2, num1];
                    answer = num1 - num2;
                    break;
                case DecimalsOperation.Multiplication:
                    num1 = getRandomDecimal(10, Math.max(1, places - 1));
                    num2 = getRandomDecimal(10, Math.max(1, places - 1));
                    answer = num1 * num2;
                    break;
                case DecimalsOperation.Division:
                    const divisor = getRandomDecimal(10, Math.max(1, places-1));
                    const quotient = getRandomDecimal(10, Math.max(1, places-1));
                    const dividend = divisor * quotient;
                    num1 = parseFloat(dividend.toFixed(places * 2));
                    num2 = divisor;
                    answer = quotient;
                    break;
                default:
                    answer = 0;
            }

            if (useWords && format === 'inline') {
                const n1Words = numberToWords(num1);
                const n2Words = numberToWords(num2);
                const opNames: {[key in DecimalsOperation]: string} = {
                    [DecimalsOperation.Addition]: 'toplamı',
                    [DecimalsOperation.Subtraction]: 'farkı',
                    [DecimalsOperation.Multiplication]: 'çarpımı',
                    [DecimalsOperation.Division]: 'bölümü',
                    [DecimalsOperation.Mixed]: 'sonucu',
                };
                question = `${n1Words} ile ${n2Words} sayılarının ${opNames[currentOperation!]} kaçtır?`;
            } else if (format === 'vertical-html') {
                const allNums = [num1, num2];
                const decimalPlaces = Math.max(...allNums.map(n => (String(n).split('.')[1] || '').length));
                const formattedNums = allNums.map(n => n.toFixed(decimalPlaces));
                question = generateVerticalProblemHTML(formattedNums, opSymbol);
            } else {
                 question = `<span style="font-size: 1.25em; font-family: monospace;">${num1} ${opSymbol} ${num2} = ?</span>`;
            }
            
            const answerPrecision = (currentOperation === DecimalsOperation.Multiplication) ? places * 2 : places;
            const finalAnswer = parseFloat(answer.toFixed(answerPrecision));
            problem = { ...problemBase, question, answer: finalAnswer };
            break;
        }
        case 'read-write': {
            const num = getRandomDecimal(max, places);
            const isRead = Math.random() < 0.5;
            if (isRead) {
                title = "Verilen ondalık sayıların okunuşlarını yazınız.";
                const question = `${num}`;
                const answer = numberToWords(num);
                problem = { ...problemBase, question, answer };
            } else {
                title = "Okunuşu verilen ondalık sayıları rakamla yazınız.";
                const numAsWords = numberToWords(num);
                const question = `${numAsWords}`;
                const answer = num;
                problem = { ...problemBase, question, answer };
            }
            break;
        }
        case 'to-fraction': {
            title = "Aşağıdaki ondalık sayıları kesre çeviriniz.";
            const num = getRandomDecimal(max, places);
            const denominator = Math.pow(10, places);
            const numerator = Math.round(num * denominator);
            const common = gcd(numerator, denominator);
            const simplifiedNumerator = numerator / common;
            const simplifiedDenominator = denominator / common;

            const question = `${num}`;
            const answer = `${simplifiedNumerator}/${simplifiedDenominator}`;
            problem = { ...problemBase, question, answer };
            break;
        }
        default:
            problem = { ...problemBase, question: 'Hata', answer: 'Hata' };
    }
    return { problem, title };
};
