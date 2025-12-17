// services/measurementService.ts

import { Problem, MeasurementProblemType, MeasurementSettings, Difficulty } from '../types.ts';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

const conversions = {
    length: [
        { from: 'km', to: 'm', factor: 1000 },
        { from: 'm', to: 'cm', factor: 100 },
        { from: 'cm', to: 'mm', factor: 10 },
    ],
    weight: [
        { from: 't', to: 'kg', factor: 1000 },
        { from: 'kg', to: 'g', factor: 1000 },
        { from: 'g', to: 'mg', factor: 1000 },
    ],
    volume: [
        { from: 'L', to: 'mL', factor: 1000 },
    ]
};

const getConversionPair = (type: MeasurementProblemType) => {
    let pool: any[] = [];
    if (type === MeasurementProblemType.LengthConversion || type === MeasurementProblemType.Mixed) {
        pool = pool.concat(conversions.length);
    }
    if (type === MeasurementProblemType.WeightConversion || type === MeasurementProblemType.Mixed) {
        pool = pool.concat(conversions.weight);
    }
    if (type === MeasurementProblemType.VolumeConversion || type === MeasurementProblemType.Mixed) {
        pool = pool.concat(conversions.volume);
    }
    return pool[getRandomInt(0, pool.length - 1)];
};

export const generateMeasurementProblem = (settings: MeasurementSettings): { problem: Problem, title: string } => {
    const { type, difficulty } = settings;
    
    const problemBase = { category: 'measurement' };
    const titles: { [key in MeasurementProblemType]: string } = {
        [MeasurementProblemType.LengthConversion]: "Uzunluk Ölçüleri Dönüştürme",
        [MeasurementProblemType.WeightConversion]: "Ağırlık Ölçüleri Dönüştürme",
        [MeasurementProblemType.VolumeConversion]: "Hacim Ölçüleri Dönüştürme",
        [MeasurementProblemType.Mixed]: "Ölçü Birimleri Dönüştürme",
    };
    const title = titles[type];

    const conversion = getConversionPair(type);
    const { from, to, factor } = conversion;
    
    let question = '';
    let answer = '';

    const toSmaller = Math.random() < 0.5; // 50% chance to convert from bigger unit to smaller

    const effectiveDifficulty = difficulty === 'mixed'
        ? (['easy', 'medium', 'hard'] as const)[getRandomInt(0, 2)]
        : difficulty;

    switch (effectiveDifficulty) {
        case 'easy':
            if (toSmaller) {
                const val = getRandomInt(1, 10);
                question = `${val} ${from} = ? ${to}`;
                answer = `${val * factor} ${to}`;
            } else {
                const val = getRandomInt(1, 10) * factor;
                question = `${val} ${to} = ? ${from}`;
                answer = `${val / factor} ${from}`;
            }
            break;
        case 'medium':
            if (toSmaller) {
                const val = parseFloat((getRandomInt(1, 20) + Math.random()).toFixed(1));
                question = `${val} ${from} = ? ${to}`;
                answer = `${parseFloat((val * factor).toFixed(2))} ${to}`;
            } else {
                const val = getRandomInt(factor, factor * 10);
                question = `${val} ${to} = ? ${from}`;
                answer = `${parseFloat((val / factor).toFixed(2))}`.replace(/\.0+$/, '') + ` ${from}`;
            }
            break;
        case 'hard':
            if (toSmaller) { // bigger to smaller, e.g., km -> m
                if (Math.random() < 0.5) {
                    // Fractional input, e.g., 2 1/4 kg = ? g
                    const whole = getRandomInt(1, 5);
                    const denominators = [2, 4, 5, 8, 10];
                    const den = denominators[getRandomInt(0, denominators.length - 1)];
                    const num = getRandomInt(1, den - 1);
                    
                    question = `${whole} ${num}/${den} ${from} = ? ${to}`;
                    const totalValue = whole + (num / den);
                    answer = `${parseFloat((totalValue * factor).toFixed(3)).toString().replace(/\.0+$/, '')} ${to}`;
                } else {
                    // Mixed unit input, e.g., 3 km 250 m = ? m
                    const mainVal = getRandomInt(1, 10);
                    let subVal: number;
                    if (factor === 1000) {
                        subVal = [10, 25, 50, 100, 200, 250, 500, 750][getRandomInt(0, 7)];
                    } else if (factor === 100) {
                        subVal = getRandomInt(1, 9) * 10;
                    } else {
                        subVal = getRandomInt(1, factor - 1);
                    }
                    question = `${mainVal} ${from} ${subVal} ${to} = ? ${to}`;
                    answer = `${mainVal * factor + subVal} ${to}`;
                }
            } else { // smaller to bigger, e.g., 1250 m = ? km
                const val = getRandomInt(factor + 1, factor * 5 - 1);
                
                const mainPart = Math.floor(val / factor);
                const subPart = val % factor;

                if (subPart === 0) {
                    // This is a simple conversion, handle it separately to avoid weird formats.
                    question = `${val} ${to} = ? ${from}`;
                    answer = `${mainPart} ${from}`;
                } else {
                    const common = gcd(subPart, factor);
                    const simplifiedNum = subPart / common;
                    const simplifiedDen = factor / common;
    
                    const possibleFormats = ['mixedUnit'];
                    if ([2, 4, 5, 8, 10].includes(simplifiedDen)) possibleFormats.push('fraction');
                    if ([10, 100, 1000].includes(factor)) possibleFormats.push('decimal');
                    
                    const answerFormat = possibleFormats[getRandomInt(0, possibleFormats.length - 1)];
    
                    switch(answerFormat) {
                        case 'fraction':
                            question = `${val} ${to} = ? ${from}`;
                            answer = mainPart > 0 ? `${mainPart} ${simplifiedNum}/${simplifiedDen} ${from}` : `${simplifiedNum}/${simplifiedDen} ${from}`;
                            break;
                        case 'decimal':
                            question = `${val} ${to} = ? ${from}`;
                            answer = `${parseFloat((val / factor).toFixed(3)).toString().replace(/\.0+$/, '')} ${from}`;
                            break;
                        case 'mixedUnit':
                        default:
                            question = `${val} ${to} = ? ${from} ? ${to}`;
                            answer = `${mainPart} ${from} ${subPart} ${to}`;
                            break;
                    }
                }
            }
            break;
    }
    
    const problem: Problem = { ...problemBase, question: `<span style="font-size: 1.1em; font-family: monospace;">${question}</span>`, answer };
    return { problem, title };
};