// FIX: Add .ts extension to import paths
import { Problem, DecimalsOperation, ArithmeticOperation, CarryBorrowPreference, DivisionType, DecimalsSettings, ArithmeticSettings, VisualSupportSettings, MathReadinessTheme } from './types.ts';
import { numberToWords } from './utils.ts';

// --- UTILS ---
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomByDigits = (d: number) => {
    if (d === 1) return getRandomInt(0,9);
    return getRandomInt(Math.pow(10, d-1), Math.pow(10, d) - 1);
};


// --- ARITHMETIC SERVICE ---
const THEME_OBJECTS: { [key: string]: string[] } = {
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔'],
    vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍', '🛺', '🚔', '🚍', '🚘', '🚖', '✈️', '🛫', '🛬', '💺', '🚁', '🚟', '🚠', '🚡', '🛰', '🚀', '🛸', '⛵️', '🛶', '🚤', '🛳', '⛴', '🛥', '🚢'],
    fruits: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕️', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽', '🥣', '🥡', '🥢', '🧂'],
    shapes: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫️', '⚪️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛️', '⬜️', '🔶', '🔷', '🔸', '🔹'],
    measurement: ['✏️', '🔑', '📏', '📎', '🟥', '➖'],
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
    const { operation, maxNumber, theme, emojiSize, numberSize, boxSize } = settings;
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
            const themeKey = theme === 'mixed' ? Object.keys(THEME_OBJECTS)[getRandomInt(0, Object.keys(THEME_OBJECTS).length - 1)] as MathReadinessTheme : theme;
            const emojiList = THEME_OBJECTS[themeKey as keyof typeof THEME_OBJECTS] || ['❔'];
            const selectedEmoji = emojiList[getRandomInt(0, emojiList.length - 1)];

            const operatorStyle = `font-size: calc(var(--visual-number-size) * 1.5); font-weight: bold;`;
            
            const q = `
                <div style="
                    --visual-emoji-size: ${emojiSize}px;
                    --visual-number-size: ${numberSize}px;
                    --visual-box-width: ${boxSize}px;
                    --visual-box-height: ${numberSize * 2}px;
                    --visual-container-min-width: ${Math.max(boxSize, 60)}px;
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 1rem; 
                    flex-wrap: wrap;
                ">
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

// --- OPTIMIZED ARITHMETIC HELPERS ---

const generateOperandsWithCarry = (digits1: number, digits2: number): [number, number] => {
    let s1 = '', s2 = '';
    const dMax = Math.max(digits1, digits2);
    const dMin = Math.min(digits1, digits2);
    const carryColumn = getRandomInt(0, dMin - 1); // A carry will happen here (from right)
    let carry = 0;

    for (let i = 0; i < dMax; i++) {
        let d1 = 0, d2 = 0;
        if (i < dMin) {
            if (i === carryColumn) {
                d1 = getRandomInt(1, 9); // Ensure d1+d2 can be >= 10
                d2 = getRandomInt(10 - d1, 9);
            } else {
                d1 = getRandomInt(0, 9);
                d2 = getRandomInt(0, 8 - d1); // Avoid carry
            }
        } else {
            d1 = getRandomInt(1, 9); // Non-zero for longer number
            d2 = 0;
        }
        s1 = d1 + s1;
        s2 = (i < dMin ? d2 : '') + s2;
    }

    const n1 = parseInt(s1.padEnd(digits1, '0'));
    const n2 = parseInt(s2.padEnd(digits2, '0'));
    return digits1 >= digits2 ? [n1, n2] : [n2, n1];
};

const generateOperandsWithoutCarry = (digits1: number, digits2: number): [number, number] => {
    let s1 = '', s2 = '';
    const dMax = Math.max(digits1, digits2);
    const dMin = Math.min(digits1, digits2);
    for (let i = 0; i < dMax; i++) {
        let d1 = getRandomInt(i === dMax -1 ? 1 : 0, 9);
        let d2 = 0;
        if (i < dMin) {
            d2 = getRandomInt(i === dMin -1 ? 1 : 0, 9 - d1);
        }
        s1 = d1 + s1;
        s2 = d2 + s2;
    }
    const n1 = parseInt(s1.padEnd(digits1, '0'));
    const n2 = parseInt(s2.padEnd(digits2, '0'));
    return digits1 >= digits2 ? [n1, n2] : [n2, n1];
};

const generateOperandsWithBorrow = (digits1: number, digits2: number): [number, number] => {
    let s1 = '', s2 = '';
    const dMax = Math.max(digits1, digits2);
    const borrowColumn = getRandomInt(0, dMax - 1);
    
    for (let i = 0; i < dMax; i++) {
        let d1 = 0, d2 = 0;
        if (i === borrowColumn) {
            d2 = getRandomInt(1, 9);
            d1 = getRandomInt(0, d2 - 1);
        } else {
            d1 = getRandomInt(1, 9);
            d2 = getRandomInt(0, d1);
        }
        s1 = d1 + s1;
        s2 = d2 + s2;
    }

    const n1 = parseInt(s1);
    const n2 = parseInt(s2.padStart(digits1, '0'));
    
    return n1 > n2 ? [n1, n2] : [n2, n1];
};

const generateOperandsWithoutBorrow = (digits1: number, digits2: number): [number, number] => {
    let s1 = '', s2 = '';
    const dMax = Math.max(digits1, digits2);
    for (let i = 0; i < dMax; i++) {
        const d1 = getRandomInt(i === dMax - 1 ? 1: 0, 9);
        const d2 = getRandomInt(0, d1);
        s1 = d1 + s1;
        s2 = d2 + s2;
    }
    const n1 = parseInt(s1);
    const n2 = parseInt(s2.padStart(digits1, '0'));
    return n1 > n2 ? [n1, n2] : [n2, n1];
};

const generateOperandsForDivision = (digits1: number, digits2: number, divisionType: DivisionType): [number, number] => {
    const divisor = getRandomByDigits(digits2);
    if (divisor === 0) return generateOperandsForDivision(digits1, digits2, divisionType);
    
    const dividendMin = Math.pow(10, digits1 - 1);
    const dividendMax = Math.pow(10, digits1) - 1;

    if (divisionType === 'without-remainder') {
        const quotientMin = Math.ceil(dividendMin / divisor);
        const quotientMax = Math.floor(dividendMax / divisor);
        const quotient = getRandomInt(quotientMin > 0 ? quotientMin : 1, quotientMax);
        const dividend = divisor * quotient;
        return [dividend, divisor];
    } 

    const dividend = getRandomByDigits(digits1);
    if (dividend < divisor) return [divisor, dividend];

    if (divisionType === 'with-remainder' && dividend % divisor === 0) {
        if (dividend + 1 <= dividendMax) return [dividend + 1, divisor];
        if (dividend - 1 >= dividendMin) return [dividend - 1, divisor];
    }
    
    return [dividend, divisor];
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
    const { operation, format = 'inline', representation = 'number', n1: n1Override, n2: n2Override, operationOverride } = settings;
    
    const operationNames: { [key in ArithmeticOperation]: string } = {
        [ArithmeticOperation.Addition]: 'Toplama',
        [ArithmeticOperation.Subtraction]: 'Çıkarma',
        [ArithmeticOperation.Multiplication]: 'Çarpma',
        [ArithmeticOperation.Division]: 'Bölme',
        [ArithmeticOperation.MixedAdditionSubtraction]: 'Toplama ve Çıkarma',
        [ArithmeticOperation.MixedAll]: 'Dört İşlem'
    };
    
    let currentOperation = operationOverride || operation;
    if (operation === ArithmeticOperation.MixedAll && !operationOverride) {
        const allOps = [ArithmeticOperation.Addition, ArithmeticOperation.Subtraction, ArithmeticOperation.Multiplication, ArithmeticOperation.Division];
        currentOperation = allOps[getRandomInt(0, 3)];
    } else if (operation === ArithmeticOperation.MixedAdditionSubtraction && !operationOverride) {
        currentOperation = (Math.random() < 0.5 ? ArithmeticOperation.Addition : ArithmeticOperation.Subtraction);
    }

    const title = `Aşağıdaki ${operationNames[currentOperation].toLowerCase()} işlemlerini yapınız.`;
    const problemBase = { category: 'arithmetic', display: format };
    
    let n1=0, n2=0;

    switch(currentOperation) {
        case ArithmeticOperation.Addition:
            [n1, n2] = settings.carryBorrow === 'with' ? generateOperandsWithCarry(settings.digits1, settings.digits2)
                     : settings.carryBorrow === 'without' ? generateOperandsWithoutCarry(settings.digits1, settings.digits2)
                     : [getRandomByDigits(settings.digits1), getRandomByDigits(settings.digits2)];
            break;
        case ArithmeticOperation.Subtraction:
            [n1, n2] = settings.carryBorrow === 'with' ? generateOperandsWithBorrow(settings.digits1, settings.digits2)
                     : settings.carryBorrow === 'without' ? generateOperandsWithoutBorrow(settings.digits1, settings.digits2)
                     : [getRandomByDigits(settings.digits1), getRandomByDigits(settings.digits2)];
            if (n1 < n2) [n1, n2] = [n2, n1];
            break;
        case ArithmeticOperation.Division:
            [n1, n2] = generateOperandsForDivision(settings.digits1, settings.digits2, settings.divisionType);
            break;
        default:
            n1 = getRandomByDigits(settings.digits1);
            n2 = getRandomByDigits(settings.digits2);
    }

    if (n1Override) n1 = n1Override;
    if (n2Override) n2 = n2Override;

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
            const n3 = settings.hasThirdNumber ? getRandomByDigits(settings.digits3) : 0;
            if (settings.hasThirdNumber) {
                 const question = format === 'vertical-html' 
                    ? generateVerticalProblemHTML([formatNumber(n1), formatNumber(n2), formatNumber(n3)], '+')
                    : `${formatNumber(n1)} + ${formatNumber(n2)} + ${formatNumber(n3)} = ?`;
                 return { problem: { ...problemBase, question, answer: n1 + n2 + n3 }, title };
            }

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
            if (n1 === n2 && !n1Override) n1++; // Avoid 0 result unless specified by voice
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
            const remainder = n1 % n2;
            const quotient = Math.floor(n1 / n2);

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
    // This part should be unreachable now
    return { 
        problem: { question: "Hata", answer: "Hata", category: 'arithmetic' }, 
        title: "Hata"
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