
// services/fractionsService.ts

// FIX: Add .ts extension to import path
import { Problem, FractionsOperation, FractionsSettings, FractionsProblemType } from '../types.ts';
import { drawFractionPie, drawFractionNumberLine } from './svgService.ts';
// FIX: Add .ts extension to import path
import { formatFractionAsWords } from './utils.ts';

interface Fraction {
    num: number;
    den: number;
}

const renderFractionWithVisual = (fStr: string, visualType: 'none' | 'pie' | 'line'): string => {
    if (visualType === 'none') return fStr;

    // Parse fraction
    let whole = 0, num = 0, den = 1;
    const parts = fStr.split(' ');
    if (parts.length > 1) {
        whole = parseInt(parts[0]);
        const fracParts = parts[1].split('/');
        num = parseInt(fracParts[0]);
        den = parseInt(fracParts[1]);
    } else {
        const fracParts = parts[0].split('/');
        num = parseInt(fracParts[0]);
        den = parseInt(fracParts[1]);
    }

    const totalNum = whole * den + num;
    // For visual consistency, pass effective numerator/denominator to drawers
    
    let svg = '';
    if (visualType === 'pie') {
        svg = drawFractionPie(totalNum, den);
    } else if (visualType === 'line') {
        svg = drawFractionNumberLine(totalNum, den);
    }

    return `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
            <span>${fStr}</span>
            ${svg}
        </div>
    `;
}

const generateVerticalFractionHTML = (f1Str: string, f2Str: string, operator: string, visualType: 'none' | 'pie' | 'line' = 'none'): string => {
    const containerStyle = "display: inline-flex; align-items: center; gap: 1em; font-family: monospace; font-size: 1.25em; vertical-align: middle;";
    
    // If visuals are used, individual fraction strings will contain SVGs, so we need to be careful with layout
    const f1Part = renderFractionWithVisual(f1Str, visualType);
    const f2Part = renderFractionWithVisual(f2Str, visualType);

    // If text only, we format nicely
    if (visualType === 'none') {
        const createFractionPart = (str: string): string => {
            let whole = '', num = '', den = '';
            const parts = str.split(' ');
            if (parts.length > 1) {
                whole = parts[0];
                const fracParts = parts[1].split('/');
                num = fracParts[0];
                den = fracParts[1];
            } else {
                const fracParts = parts[0].split('/');
                num = fracParts[0];
                den = fracParts[1];
            }
            const wholePart = whole ? `<div style="font-size: 1.1em;">${whole}</div>` : '';
            const fractionPart = `
                <div style="display: inline-block; text-align: center; line-height: 1.1;">
                    <div style="padding: 0 0.2em;">${num}</div>
                    <div style="border-top: 2px solid black; padding: 0 0.2em;">${den}</div>
                </div>
            `;
            return `<div style="display: inline-flex; align-items: center; gap: 0.2em;">${wholePart}${fractionPart}</div>`;
        };
        return `
            <div style="${containerStyle}">
                ${createFractionPart(f1Str)}
                <span style="margin: 0 0.25em;">${operator}</span>
                ${createFractionPart(f2Str)}
                <span style="margin: 0 0.25em;">= ?</span>
            </div>
        `;
    }

    return `
        <div style="${containerStyle}">
            ${f1Part}
            <span style="font-size: 1.5em; font-weight: bold;">${operator}</span>
            ${f2Part}
            <span style="font-size: 1.5em; font-weight: bold;">= ?</span>
        </div>
    `;
};

const generateVerticalFractionOfSetHTML = (whole: number, fStr: string): string => {
    const fractionContainerStyle = "display: inline-flex; align-items: center; gap: 0.2em;";
    const fractionStyle = "display: inline-block; text-align: center; line-height: 1.1;";
    const numStyle = "padding: 0 0.2em;";
    const denStyle = "border-top: 2px solid black; padding: 0 0.2em;";
    
    const [num, den] = fStr.split('/');

    const fractionPart = `
        <div style="${fractionStyle}">
            <div style="${numStyle}">${num}</div>
            <div style="${denStyle}">${den}</div>
        </div>
    `;

    const containerStyle = "display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-size: 1.2em; font-family: monospace;";

    return `
        <div style="${containerStyle}">
            <span>${whole} sayısının</span>
            <div style="${fractionContainerStyle}">${fractionPart}</div>
            <span>kadarı kaçtır?</span>
        </div>
    `;
};


const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

const simplify = (f: Fraction): Fraction => {
    if (f.num === 0) return { num: 0, den: 1 };
    const common = gcd(f.num, f.den);
    return { num: f.num / common, den: f.den / common };
};

const toMixed = (f: Fraction): string => {
    const simplified = simplify(f);
    const { num, den } = simplified;
    if (den === 1) return `${num}`;
    if (num < den) return `${num}/${den}`;
    const whole = Math.floor(num / den);
    const remNum = num % den;
    return remNum === 0 ? `${whole}` : `${whole} ${remNum}/${den}`;
};

const generateFraction = (difficulty: 'easy' | 'medium' | 'hard' = 'medium', allowImproper: boolean = false): Fraction => {
    let den = getRandomInt(2, 12);
    let num;
    if (allowImproper) {
        num = getRandomInt(1, den * (difficulty === 'hard' ? 3 : 1));
    } else {
        num = getRandomInt(1, den - 1);
    }
    return { num, den };
}


export const generateFractionsProblem = (settings: FractionsSettings): { problem: Problem, title: string, error?: string } => {
    const { type, operation, difficulty, maxSetSize, format = 'inline', representation = 'number', useMixedNumbers = true, visualRepresentation = 'none' } = settings;
    let problem: Problem;
    let title = '';
    const problemBase = { category: 'fractions' };
    const useWords = (representation === 'word' || (representation === 'mixed' && Math.random() < 0.5));

    switch (type) {
        case FractionsProblemType.FourOperations: {
            if (!operation || !difficulty) return { problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, title: 'Hata' };
            
            const currentOperation = operation === FractionsOperation.Mixed
                ? [FractionsOperation.Addition, FractionsOperation.Subtraction, FractionsOperation.Multiplication, FractionsOperation.Division][getRandomInt(0, 3)]
                : operation;
            
            const opNames = { 'addition': 'toplama', 'subtraction': 'çıkarma', 'multiplication': 'çarpma', 'division': 'bölme', 'mixed': 'Dört İşlem' };
            title = `Aşağıdaki kesirlerle ${opNames[operation]} işlemi yapınız.`;

            let f1: Fraction, f2: Fraction;
            let whole1 = 0, whole2 = 0;
            let q1_str: string, q2_str: string;

            if (difficulty === 'hard') {
                if (useMixedNumbers) {
                    whole1 = getRandomInt(1, 5);
                    whole2 = getRandomInt(1, 5);
                    f1 = generateFraction('easy');
                    f2 = generateFraction('medium');
                    q1_str = `${whole1} ${f1.num}/${f1.den}`;
                    q2_str = `${whole2} ${f2.num}/${f2.den}`;
                    f1.num += whole1 * f1.den;
                    f2.num += whole2 * f2.den;
                } else {
                    f1 = generateFraction('medium', true);
                    f2 = generateFraction('medium', true);
                    while(f1.num <= f1.den) f1 = generateFraction('medium', true); // Ensure improper
                    while(f2.num <= f2.den) f2 = generateFraction('medium', true); // Ensure improper
                    q1_str = toMixed(f1);
                    q2_str = toMixed(f2);
                }
            } else if (difficulty === 'medium') {
                f1 = generateFraction('medium');
                f2 = generateFraction('medium');
                while(f1.den === f2.den) { // ensure denominators are different
                    f2 = generateFraction('medium');
                }
                q1_str = `${f1.num}/${f1.den}`;
                q2_str = `${f2.num}/${f2.den}`;
            } else { // easy
                const den = [2,3,4,5,6,8,10,12][getRandomInt(0,7)];
                f1 = { num: getRandomInt(1, den - 1), den };
                f2 = { num: getRandomInt(1, den - 1), den };
                q1_str = `${f1.num}/${f1.den}`;
                q2_str = `${f2.num}/${f2.den}`;
            }

            let result: Fraction;
            let question = "";
            const opSymbol = { 'addition': '+', 'subtraction': '-', 'multiplication': '×', 'division': '÷' }[currentOperation!];
            
            switch (currentOperation) {
                case FractionsOperation.Addition:
                    result = { num: f1.num * f2.den + f2.num * f1.den, den: f1.den * f2.den };
                    break;
                case FractionsOperation.Subtraction:
                    if ((f1.num / f1.den) < (f2.num / f2.den)) {
                        [f1, f2] = [f2, f1];
                        [q1_str, q2_str] = [q2_str, q1_str];
                    }
                    result = { num: f1.num * f2.den - f2.num * f1.den, den: f1.den * f2.den };
                    break;
                case FractionsOperation.Multiplication:
                    result = { num: f1.num * f2.num, den: f1.den * f2.den };
                    break;
                case FractionsOperation.Division:
                    result = { num: f1.num * f2.den, den: f1.den * f2.num };
                    break;
                default:
                    result = { num: 0, den: 1 };
            }
            
            if (visualRepresentation !== 'none') {
                question = generateVerticalFractionHTML(q1_str, q2_str, opSymbol, visualRepresentation);
            } else if(useWords && format === 'inline') {
                const opText = { 'addition': 'toplamı', 'subtraction': 'farkı', 'multiplication': 'çarpımı', 'division': 'bölümü' }[currentOperation!];
                question = `${formatFractionAsWords(q1_str)} ile ${formatFractionAsWords(q2_str)} kesirlerinin ${opText} kaçtır?`;
            } else if (format === 'vertical-html') {
                 question = generateVerticalFractionHTML(q1_str, q2_str, opSymbol, 'none');
            } else {
                 question = `<span style="font-size: 1.25em; font-family: monospace;">${q1_str} ${opSymbol} ${q2_str} = ?</span>`;
            }

            problem = { ...problemBase, display: visualRepresentation !== 'none' ? 'flow' : format, question, answer: toMixed(result) };
            break;
        }

        case FractionsProblemType.Recognition: {
            title = "Şekille gösterilen kesri yazınız.";
            const den = [2,3,4,5,6,8,10][getRandomInt(0,6)];
            const num = getRandomInt(1, den);
            const question = drawFractionPie(num, den);
            const answer = `${num}/${den}`;
            problem = { ...problemBase, display: format, question, answer };
            break;
        }

        case FractionsProblemType.Comparison: {
            title = "Kesirleri karşılaştırıp araya <, > veya = koyunuz.";
            let f1 = generateFraction('medium');
            let f2 = generateFraction('medium');
            while(f1.num/f1.den === f2.num/f2.den) f2 = generateFraction('medium');

            let question = "";
            const f1Str = `${f1.num}/${f1.den}`;
            const f2Str = `${f2.num}/${f2.den}`;

            if (visualRepresentation !== 'none') {
                question = generateVerticalFractionHTML(f1Str, f2Str, '___', visualRepresentation);
            } else if (format === 'vertical-html') {
                question = generateVerticalFractionHTML(f1Str, f2Str, '___', 'none');
            } else {
                question = `<span style="font-size: 1.5em; font-family: monospace;">${f1Str} ___ ${f2Str}</span>`;
            }

            const answer = (f1.num/f1.den) > (f2.num/f2.den) ? '>' : '<';
            problem = { ...problemBase, display: visualRepresentation !== 'none' ? 'flow' : format, question, answer };
            break;
        }

        case FractionsProblemType.Equivalent: {
            title = "Verilen kesre denk olan kesri bulunuz.";
            const f1 = simplify(generateFraction('medium'));
            const multiplier = getRandomInt(2, 5);
            const f2 = { num: f1.num * multiplier, den: f1.den * multiplier };
            
            let question = "";
            const f1Str = `${f1.num}/${f1.den}`;
            const f2StrWithBlank = `${f2.num}/?`;
            const f2StrFull = `${f2.num}/${f2.den}`;

            // Visuals not supported for equivalence blank filling yet, fallback to text
            if (format === 'vertical-html') {
                // Randomly hide numerator or denominator
                if (Math.random() < 0.5) {
                     question = generateVerticalFractionHTML(f1Str, `?/${f2.den}`, '=');
                     problem = { ...problemBase, display: format, question, answer: String(f2.num) };
                } else {
                     question = generateVerticalFractionHTML(f1Str, `${f2.num}/?`, '=');
                     problem = { ...problemBase, display: format, question, answer: String(f2.den) };
                }
            } else {
                 if (Math.random() < 0.5) {
                    question = `<span style="font-size: 1.5em; font-family: monospace;">${f1Str} = ?/${f2.den}</span>`;
                    problem = { ...problemBase, display: format, question, answer: String(f2.num) };
                } else {
                    question = `<span style="font-size: 1.5em; font-family: monospace;">${f1Str} = ${f2.num}/?</span>`;
                    problem = { ...problemBase, display: format, question, answer: String(f2.den) };
                }
            }
            break;
        }

        case FractionsProblemType.FractionOfSet: {
            title = "Bir bütünün istenen kesir kadarını bulunuz.";
            const den = [2,3,4,5,6,8,10][getRandomInt(0,6)];
            const num = getRandomInt(1, den - 1);
            const multiplier = getRandomInt(2, Math.floor(maxSetSize / den));
            const whole = den * multiplier;
            
            let question = "";
            const fStr = `${num}/${den}`;

            if (format === 'vertical-html') {
                question = generateVerticalFractionOfSetHTML(whole, fStr);
            } else {
                question = `<span style="font-size: 1.2em;">${whole} sayısının ${fStr} kadarı kaçtır?</span>`;
            }

            const answer = (whole / den) * num;
            problem = { ...problemBase, display: format, question, answer };
            break;
        }

        default:
            problem = { ...problemBase, question: 'Hata', answer: 'Hata' };
            return { problem, title: 'Hata', error: 'Geçersiz kesir problemi türü' };
    }

    return { problem, title };
};
