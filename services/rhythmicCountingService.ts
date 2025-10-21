// services/rhythmicCountingService.ts

// FIX: Add .ts extension to import path
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
        const num2 = startNum + p2 * effective