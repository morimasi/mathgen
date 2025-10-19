// FIX: Add .ts extension to import path
import { Problem, RhythmicProblemType, RhythmicCountingSettings } from '../types';

const getRandomInt = (min: number, max: number): number => {
  if (min > max) [min, max] = [max, min];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};


const BOX_STYLE = "display: inline-block; border: 1px solid #6b7280; border-radius: 4px; width: 44px; height: 36px; vertical-align: middle; text-align: center; line-height: 36px; font-weight: bold;";
const SEPARATOR = '<span style="margin: 0 2px; font-weight: bold;">-</span>';
const ROW_STYLE = "display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 1.25rem; line-height: 1.75rem;";
const ROWS = 18;

const generatePracticeSheetHTML = (settings: RhythmicCountingSettings, min: number, max: number): string => {
    const { step = 2, direction = 'forward', useMultiplesOnly = false } = settings;
    
    const BOXES_PER_ROW = 6;
    const sequenceLength = 3 + BOXES_PER_ROW;
    let htmlRows = [];

    for(let i = 0; i < ROWS; i++) {
        const currentDirection = direction === 'mixed' ? (getRandomInt(0, 1) === 0 ? 'forward' : 'backward') : direction;
        const currentStep = Math.abs(step);
        
        let start: number;

        if (currentDirection === 'forward') {
            const maxStart = max - (sequenceLength - 1) * currentStep;
            const validMin = min;
            const validMax = maxStart < validMin ? validMin : maxStart;
            
            if (useMultiplesOnly) {
                const minMultiplier = Math.ceil(validMin / currentStep);
                const maxMultiplier = Math.floor(validMax / currentStep);
                start = (maxMultiplier < minMultiplier) ? minMultiplier * currentStep : getRandomInt(minMultiplier, maxMultiplier) * currentStep;
            } else {
                start = getRandomInt(validMin, validMax);
            }
        } else { // backward
            const minStart = min + (sequenceLength - 1) * currentStep;
            const validMax = max;
            const validMin = minStart > validMax ? validMax : minStart;

            if (useMultiplesOnly) {
                const minMultiplier = Math.ceil(validMin / currentStep);
                const maxMultiplier = Math.floor(validMax / currentStep);
                start = (maxMultiplier < minMultiplier) ? maxMultiplier * currentStep : getRandomInt(minMultiplier, maxMultiplier) * currentStep;
            } else {
                start = getRandomInt(validMin, validMax);
            }
        }

        const effectiveStep = currentDirection === 'backward' ? -currentStep : currentStep;
        
        const sequence = [start, start + effectiveStep, start + (2 * effectiveStep)];

        let boxes = sequence.map(num => `<span style="${BOX_STYLE}">${num}</span>`);
        for (let j = 0; j < BOXES_PER_ROW; j++) {
            boxes.push(`<span style="${BOX_STYLE}"></span>`);
        }
        
        htmlRows.push(`<div style="${ROW_STYLE}">${boxes.join(SEPARATOR)}</div>`);
    }

    return `<div class="practice-sheet" style="display: flex; flex-direction: column; gap: 1rem;">${htmlRows.join('')}</div>`;
};

const generateFillBeforeAfterSheetHTML = (settings: RhythmicCountingSettings, min: number, max: number): string => {
    const { step = 1, direction = 'forward', beforeCount = 3, afterCount = 3 } = settings;
    let htmlRows = [];

    for (let i = 0; i < ROWS; i++) {
        const currentDirection = direction === 'mixed' ? (getRandomInt(0, 1) === 0 ? 'forward' : 'backward') : direction;
        const currentStep = Math.abs(step);
        
        const minAnchor = min + (beforeCount * currentStep);
        const maxAnchor = max - (afterCount * currentStep);
        
        if (minAnchor > maxAnchor) continue; // Skip impossible rows

        const anchorNumber = getRandomInt(minAnchor, maxAnchor);

        let boxes = [];
        for (let j = 0; j < beforeCount; j++) boxes.push(`<span style="${BOX_STYLE}"></span>`);
        boxes.push(`<span style="${BOX_STYLE}">${anchorNumber}</span>`);
        for (let j = 0; j < afterCount; j++) boxes.push(`<span style="${BOX_STYLE}"></span>`);
        
        const rowHTML = (currentDirection === 'backward') ? boxes.reverse().join(SEPARATOR) : boxes.join(SEPARATOR);
        htmlRows.push(`<div style="${ROW_STYLE}">${rowHTML}</div>`);
    }

    return `<div class="practice-sheet" style="display: flex; flex-direction: column; gap: 1rem;">${htmlRows.join('')}</div>`;
};


const generateFillBetweenSheetHTML = (settings: RhythmicCountingSettings, min: number, max: number): string => {
    const { step = 1, direction = 'forward', useMultiplesOnly = false, beforeCount = 0, afterCount = 0 } = settings;
    let htmlRows = [];
    const BOXES_PER_ROW = 9;

    for (let i = 0; i < ROWS; i++) {
        const currentDirection = direction === 'mixed' ? (getRandomInt(0, 1) === 0 ? 'forward' : 'backward') : direction;
        const currentStep = Math.abs(step);
        const effectiveStep = currentDirection === 'backward' ? -currentStep : currentStep;

        if (6 < (beforeCount + afterCount)) continue;

        let startNum, p1, p2;
        
        let validStartRangeMin, validStartRangeMax;

        if(currentDirection === 'forward'){
            validStartRangeMin = min;
            validStartRangeMax = max - ((BOXES_PER_ROW - 1) * currentStep);
        } else {
            validStartRangeMin = min + ((BOXES_PER_ROW - 1) * currentStep);
            validStartRangeMax = max;
        }

        if(validStartRangeMin > validStartRangeMax) continue;

        if (useMultiplesOnly) {
            const minMultiplier = Math.ceil(validStartRangeMin / currentStep);
            const maxMultiplier = Math.floor(validStartRangeMax / currentStep);
            if (maxMultiplier < minMultiplier) continue;
            startNum = getRandomInt(minMultiplier, maxMultiplier) * currentStep;
        } else {
            startNum = getRandomInt(validStartRangeMin, validStartRangeMax);
        }
        
        p1 = getRandomInt(beforeCount, BOXES_PER_ROW - 3 - afterCount);
        p2 = getRandomInt(p1 + 2, BOXES_PER_ROW - 1 - afterCount);

        const num1 = startNum + p1 * effectiveStep;
        const num2 = startNum + p2 * effectiveStep;
        
        let boxes = [];
        for (let j = 0; j < BOXES_PER_ROW; j++) {
            if (j === p1) boxes.push(`<span style="${BOX_STYLE}">${num1}</span>`);
            else if (j === p2) boxes.push(`<span style="${BOX_STYLE}">${num2}</span>`);
            else boxes.push(`<span style="${BOX_STYLE}"></span>`);
        }

        htmlRows.push(`<div style="${ROW_STYLE}">${boxes.join(SEPARATOR)}</div>`);
    }

     return `<div class="practice-sheet" style="display: flex; flex-direction: column; gap: 1rem;">${htmlRows.join('')}</div>`;
};


export const generateRhythmicCountingProblem = (settings: RhythmicCountingSettings): { problem: Problem, title: string, error?: string } => {
    const { type, digits = 2 } = settings;
    const min = digits === 1 ? 0 : Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;

    let problem: Problem;
    let title: string;
    const problemBase = { category: 'rhythmic-counting' };

    let currentOrderDirection = settings.orderDirection;
    if (type === RhythmicProblemType.Ordering && settings.orderDirection === 'mixed') {
        currentOrderDirection = Math.random() < 0.5 ? 'ascending' : 'descending';
    }
    const orderText = currentOrderDirection === 'descending' ? 'büyükten küçüğe' : 'küçükten büyüğe';

    const titles: { [key in RhythmicProblemType]?: string } = {
        [RhythmicProblemType.Pattern]: "Örüntülerdeki boşlukları doldurunuz.",
        [RhythmicProblemType.FindRule]: "Aşağıdaki örüntülerin kuralını bulunuz.",
        [RhythmicProblemType.PracticeSheet]: `Verilen sayılardan başlayarak ${settings.step}'er ritmik sayma alıştırması yapınız.`,
        [RhythmicProblemType.FillBeforeAfter]: `Verilen sayıdan önceki ve sonraki sayıları ${settings.step}'er ritmik sayarak bulunuz.`,
        [RhythmicProblemType.FillBetween]: `Verilen sayılar arasındaki boşlukları ${settings.step}'er ritmik sayarak doldurunuz.`,
        [RhythmicProblemType.OddEven]: "Verilen sayıların tek mi çift mi olduğunu belirtiniz.",
        [RhythmicProblemType.Ordering]: `Sayıları ${orderText} doğru sıralayınız.`,
        [RhythmicProblemType.Comparison]: "Sayıların arasına <, > veya = işaretlerinden uygun olanı koyunuz.",
    };
    title = titles[type] || "Ritmik Sayma Alıştırmaları";

    switch (type) {
        case RhythmicProblemType.PracticeSheet:
            problem = { ...problemBase, question: generatePracticeSheetHTML(settings, min, max), answer: 'PRACTICE_SHEET' };
            break;
        
        case RhythmicProblemType.FillBeforeAfter:
            problem = { ...problemBase, question: generateFillBeforeAfterSheetHTML(settings, min, max), answer: 'PRACTICE_SHEET' };
            break;

        case RhythmicProblemType.FillBetween:
            problem = { ...problemBase, question: generateFillBetweenSheetHTML(settings, min, max), answer: 'PRACTICE_SHEET' };
            break;

        case RhythmicProblemType.Pattern:
        case RhythmicProblemType.FindRule: {
            const { step: definedStep = 2, direction = 'forward', useMultiplesOnly = false, patternLength = 5, missingCount = 1 } = settings;
            const currentDirection = direction === 'mixed' ? (getRandomInt(0, 1) === 0 ? 'forward' : 'backward') : direction;
            const step = Math.abs(definedStep);
            const effectiveStep = currentDirection === 'backward' ? -step : effectiveStep;

            let start: number;
            
            let validMin, validMax;
            if (currentDirection === 'forward') {
                validMin = min;
                validMax = max - ((patternLength || 5) - 1) * step;
            } else { // backward
                validMin = min + ((patternLength || 5) - 1) * step;
                validMax = max;
            }
            
            if (validMin > validMax) return { 
                problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, 
                title: "Hata",
                error: "Geçersiz aralık. Min Değer, Max Değer'den büyük olamaz veya örüntü uzunluğu aralığa sığmıyor. Lütfen ayarları kontrol edin."
            };
            
            if (useMultiplesOnly) {
                const minMultiplier = Math.ceil(validMin / step);
                const maxMultiplier = Math.floor(validMax / step);
                if (maxMultiplier < minMultiplier) {
                     return { 
                        problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, 
                        title: "Hata",
                        error: "Bu ayarlarla adımın katı olan bir başlangıç sayısı bulunamadı."
                    };
                }
                start = getRandomInt(minMultiplier, maxMultiplier) * step;
            } else {
                start = getRandomInt(validMin, validMax);
            }

            const sequence: (number | string)[] = Array.from({ length: patternLength }, (_, i) => start + i * effectiveStep);
            let answerParts: string[] = [];
            
            if (type === RhythmicProblemType.FindRule) {
                const rule = currentDirection === 'forward' ? `${step}'er artan` : `${step}'er azalan`;
                problem = {
                    ...problemBase,
                    question: `<div style="font-family: monospace; font-size: 1.25rem;">${sequence.join(' - ')}</div>`,
                    answer: rule
                };
            } else { // Pattern completion
                const missingIndexes = shuffleArray(Array.from({ length: patternLength }, (_, i) => i)).slice(0, missingCount);
                missingIndexes.sort((a,b) => a-b);
                
                missingIndexes.forEach(index => {
                    answerParts.push(String(sequence[index]));
                    sequence[index] = '___';
                });

                problem = {
                    ...problemBase,
                    question: `<div style="font-family: monospace; font-size: 1.25rem;">${sequence.join(' - ')}</div>`,
                    answer: answerParts.join(', ')
                };
            }
            break;
        }

        case RhythmicProblemType.OddEven: {
            const number = getRandomInt(min, max);
            // FIX: Declare question and answer variables.
            const question = `<b>${number}</b> sayısı tek mi çift mi?`;
            const answer = number % 2 === 0 ? "Çift" : "Tek";
            problem = { ...problemBase, question, answer };
            break;
        }

        case RhythmicProblemType.Ordering: {
            const { orderCount = 5 } = settings;
            const numbers: number[] = [];
            while(numbers.length < orderCount) {
                const newNum = getRandomInt(min, max);
                if (!numbers.includes(newNum)) {
                    numbers.push(newNum);
                }
            }
            
            const sorted = [...numbers].sort((a, b) => currentOrderDirection === 'descending' ? b - a : a - b);
            
            // FIX: Declare question and answer variables.
            const question = `Bu sayıları ${orderText} sıralayınız:<br/><div style="font-size: 1.25rem; font-family: monospace; margin-top: 0.5rem;">${numbers.join(', ')}</div>`;
            const answer = sorted.join(', ');
            problem = { ...problemBase, question, answer };
            break;
        }

        case RhythmicProblemType.Comparison: {
            let n1 = getRandomInt(min, max);
            let n2 = getRandomInt(min, max);
            while (n1 === n2) {
                n2 = getRandomInt(min, max);
            }
            // FIX: Declare question and answer variables.
            const question = `<span style="font-size: 1.5rem; font-family: monospace;">${n1} ___ ${n2}</span>`;
            const answer = n1 > n2 ? '>' : '<';
            problem = { ...problemBase, question, answer };
            break;
        }

        default:
            problem = { ...problemBase, question: 'Hata', answer: 'Hata' };
            title = "Hata";
            return {
                problem,
                title,
                error: 'Geçersiz ritmik sayma problemi türü seçildi.'
            };
    }
    
    return { problem, title };
};