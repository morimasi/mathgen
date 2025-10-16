

import { Problem, FractionsOperation, FractionsSettings, FractionsProblemType } from '../types';
import { drawFractionPie } from './svgService';
import { formatFractionAsWords } from './utils';

interface Fraction {
    num: number;
    den: number;
}

const generateVerticalFractionHTML = (f1Str: string, f2Str: string, operator: string): string => {
    const containerStyle = "display: inline-flex; align-items: center; gap: 0.5em; font-family: monospace; font-size: 1.25em; vertical-align: middle;";
    const fractionContainerStyle = "display: inline-flex; align-items: center; gap: 0.2em;";
    const fractionStyle = "display: inline-block; text-align: center; line-height: 1.1;";
    const numStyle = "padding: 0 0.2em;";
    const denStyle = "border-top: 2px solid black; padding: 0 0.2em;";
    const wholeStyle = "font-size: 1.1em;";

    const parseFractionStr = (str: string): { whole: string, num: string, den: string } => {
        let whole = '';
        let num = '';
        let den = '';
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
        return { whole, num, den };
    };

    const createFractionPart = (str: string): string => {
        const { whole, num, den } = parseFractionStr(str);
        const wholePart = whole ? `<div style="${wholeStyle}">${whole}</div>` : '';
        const fractionPart = `
            <div style="${fractionStyle}">
                <div style="${numStyle}">${num}</div>
                <div style="${denStyle}">${den}</div>
            </div>
        `;
        return `<div style="${fractionContainerStyle}">${wholePart}${fractionPart}</div>`;
    };

    const f1Part = createFractionPart(f1Str);
    const f2Part = createFractionPart(f2Str);

    return `
        <div style="${containerStyle}">
            ${f1Part}
            <span style="margin: 0 0.25em;">${operator}</span>
            ${f2Part}
            <span style="margin: 0 0.25em;">= ?</span>
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
    const { type, operation, difficulty, maxSetSize, format = 'inline', representation = 'number', useMixedNumbers = true } = settings;
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
                f1 = generateFraction('easy');
                f2 = generateFraction('easy');
                f2.den = f1.den; // Common denominator
                q1_str = `${f1.num}/${f1.den}`;
                q2_str = `${f2.num}/${f2.den}`;
            }
            
            let f1_calc = f1;
            let f2_calc = f2;

            if (currentOperation === FractionsOperation.Subtraction && (f1.num / f1.den) < (f2.num / f2.den)) {
                [f1_calc, f2_calc] = [f2, f1];
                [q1_str, q2_str] = [q2_str, q1_str];
            }

            let answerFraction: Fraction;
            const opSymbol = { 'addition': '+', 'subtraction': '-', 'multiplication': '×', 'division': '÷' }[currentOperation];

            switch (currentOperation) {
                case FractionsOperation.Addition:
                    answerFraction = { num: f1_calc.num * f2_calc.den + f2_calc.num * f1_calc.den, den: f1_calc.den * f2_calc.den };
                    break;
                case FractionsOperation.Subtraction:
                    answerFraction = { num: f1_calc.num * f2_calc.den - f2_calc.num * f1_calc.den, den: f1_calc.den * f2_calc.den };
                    break;
                case FractionsOperation.Multiplication:
                    answerFraction = { num: f1_calc.num * f2_calc.num, den: f1_calc.den * f2_calc.den };
                    break;
                case FractionsOperation.Division:
                    answerFraction = { num: f1_calc.num * f2_calc.den, den: f1_calc.den * f2_calc.num };
                    break;
                default:
                    answerFraction = { num: 0, den: 1 };
            }

            const answer = toMixed(answerFraction);
            let question: string;

            if (useWords && format === 'inline') {
                const q1Words = formatFractionAsWords(q1_str);
                const q2Words = formatFractionAsWords(q2_str);
                const opNames: {[key in FractionsOperation]: string} = { 
                    'addition': 'toplamı', 
                    'subtraction': 'farkı', 
                    'multiplication': 'çarpımı', 
                    'division': 'bölümü',
                    'mixed': 'sonucu'
                };
                question = `${q1Words} ile ${q2Words} kesirlerinin ${opNames[currentOperation]} kaçtır?`;
            } else if (format === 'vertical-html') {
                question = generateVerticalFractionHTML(q1_str, q2_str, opSymbol);
            } else {
                question = `<span style="font-size: 1.25em; font-family: monospace;">${q1_str} ${opSymbol} ${q2_str} = ?</span>`;
            }

            problem = { ...problemBase, question, answer, display: format };
            break;
        }
        case FractionsProblemType.Recognition: {
            title = "Aşağıdaki şekillerin ifade ettiği kesirleri yazınız.";
            const f = generateFraction();
            const svg = drawFractionPie(f.num, f.den);
            const question = svg;
            const answer = `${f.num}/${f.den}`;
            problem = { ...problemBase, question, answer };
            break;
        }
        case FractionsProblemType.Comparison: {
            title = "Verilen kesirlerin arasına <, > veya = işaretlerinden uygun olanı koyunuz.";
            let attempts = 0;
            while (attempts < 100) {
                const f1 = generateFraction();
                const f2 = generateFraction();
                const val1 = f1.num / f1.den;
                const val2 = f2.num / f2.den;
                if (val1 !== val2) {
                    const question = `<span style="font-size: 1.25em; font-family: monospace;">${f1.num}/${f1.den} ___ ${f2.num}/${f2.den}</span>`;
                    const answer = val1 > val2 ? '>' : '<';
                    problem = { ...problemBase, question, answer };
                    return { problem, title };
                }
                attempts++;
            }
            return {
                problem: { ...problemBase, question: 'Hata', answer: 'Hata' },
                title: 'Hata',
                error: "Rastgele üretilen kesirler sürekli denk geldiği için problem oluşturulamadı. Lütfen tekrar deneyin."
            };
        }
        case FractionsProblemType.Equivalent: {
            title = "Verilen kesirlere denk olan kesirleri bulunuz.";
            const f = generateFraction('easy');
            const multiplier = getRandomInt(2, 5);
            const newDen = f.den * multiplier;
            const question = `<span style="font-size: 1.25em; font-family: monospace;">${f.num}/${f.den} = ? / ${newDen}</span>`;
            const answer = f.num * multiplier;
            problem = { ...problemBase, question, answer };
            break;
        }
        case FractionsProblemType.FractionOfSet: {
            title = "Verilen sayıların belirtilen kesir kadarını bulunuz.";
            if (!maxSetSize) return { problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, title: "Hata" };
            const f = generateFraction('easy');
            let setSize = getRandomInt(f.den * 2, maxSetSize);
            while (setSize % f.den !== 0) {
                 setSize = getRandomInt(f.den * 2, maxSetSize);
            }
            const question = `<span style="font-size: 1.25em; font-family: monospace;">${setSize} sayısının ${f.num}/${f.den}'i kaçtır?</span>`;
            const answer = (setSize / f.den) * f.num;
            problem = { ...problemBase, question, answer };
            break;
        }
        default:
             return { problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, title: 'Hata' };
    }
    return { problem, title };
};