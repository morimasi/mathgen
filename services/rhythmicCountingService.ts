// services/rhythmicCountingService.ts

import { Problem, RhythmicProblemType, RhythmicCountingSettings } from '../types.ts';

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
        for(let j=0; j < BOXES_PER_ROW; j++) {
            if (j === p1) boxes.push(`<span style="${BOX_STYLE}">${num1}</span>`);
            else if (j === p2) boxes.push(`<span style="${BOX_STYLE}">${num2}</span>`);
            else boxes.push(`<span style="${BOX_STYLE}"></span>`);
        }
        
        htmlRows.push(`<div style="${ROW_STYLE}">${boxes.join(SEPARATOR)}</div>`);
    }
    return `<div class="practice-sheet" style="display: flex; flex-direction: column; gap: 1rem;">${htmlRows.join('')}</div>`;
};

export const generateRhythmicCountingProblem = (settings: RhythmicCountingSettings): { problem: Problem, title: string, error?: string } => {
    const { type, digits, step, direction, useMultiplesOnly, patternLength, missingCount, orderCount, orderDirection } = settings;
    const problemBase = { category: 'rhythmic-counting', display: 'flow' as const };
    let title = 'Ritmik Sayma';
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;

    switch (type) {
        case RhythmicProblemType.PracticeSheet:
            return { problem: { ...problemBase, question: generatePracticeSheetHTML(settings, min, max), answer: 'Alıştırma' }, title: 'Ritmik Sayma Alıştırma Kağıdı' };
        case RhythmicProblemType.FillBeforeAfter:
            return { problem: { ...problemBase, question: generateFillBeforeAfterSheetHTML(settings, min, max), answer: 'Alıştırma' }, title: 'Öncesini ve Sonrasını Doldur' };
        case RhythmicProblemType.FillBetween:
            return { problem: { ...problemBase, question: generateFillBetweenSheetHTML(settings, min, max), answer: 'Alıştırma' }, title: 'Arasını Doldur' };
        case RhythmicProblemType.Pattern: {
            title = 'Örüntü Tamamlama';
            const currentDirection = direction === 'mixed' ? (getRandomInt(0, 1) === 0 ? 'forward' : 'backward') : direction;
            const currentStep = currentDirection === 'backward' ? -step : step;
            const maxStart = max - ((patternLength - 1) * step);
            const minStart = min + ((patternLength - 1) * (currentDirection === 'backward' ? step : 0));
            let start = useMultiplesOnly 
                ? getRandomInt(Math.ceil(minStart / step), Math.floor(maxStart / step)) * step
                : getRandomInt(minStart, maxStart);

            const sequence = Array.from({ length: patternLength }, (_, i) => start + i * currentStep);
            const missingIndexes = shuffleArray(Array.from({length: patternLength}, (_, i) => i)).slice(0, missingCount);
            const answer = missingIndexes.map(i => sequence[i]).join(', ');
            
            const questionHTML = sequence.map((num, i) => 
                missingIndexes.includes(i) ? `<span style="${BOX_STYLE}"></span>` : `<span style="${BOX_STYLE}">${num}</span>`
            ).join(SEPARATOR);
            
            return { problem: { ...problemBase, question: `<div style="${ROW_STYLE}">${questionHTML}</div>`, answer }, title };
        }
        case RhythmicProblemType.Ordering: {
            title = 'Sayıları Sıralama';
            const numbers = Array.from({ length: orderCount }, () => getRandomInt(min, max));
            const currentOrder = orderDirection === 'mixed' ? (getRandomInt(0,1) === 0 ? 'ascending' : 'descending') : orderDirection;
            const sorted = currentOrder === 'ascending' ? [...numbers].sort((a,b) => a-b) : [...numbers].sort((a,b) => b-a);
            const questionText = currentOrder === 'ascending' ? 'küçükten büyüğe' : 'büyükten küçüğe';
            
            const question = `<p>Sayıları <b>${questionText}</b> sırala.</p><div class="ordering-container">${numbers.map(n => `<div class="ordering-item">${n}</div>`).join('')}</div>`;
            return { problem: { ...problemBase, question, answer: sorted.join(', ') }, title };
        }
         case RhythmicProblemType.OddEven: {
            title = 'Tek ve Çift Sayılar';
            const number = getRandomInt(min, max);
            const isOdd = number % 2 !== 0;
            const question = `<b>${number}</b> sayısı tek mi çift mi?`;
            return { problem: { ...problemBase, question, answer: isOdd ? 'Tek' : 'Çift' }, title };
        }
        default:
            return { problem: { ...problemBase, question: 'Bu alıştırma türü henüz oluşturulmadı.', answer: '...' }, title: 'Bilinmeyen Alıştırma' };
    }
};