// services/dysgraphiaService.ts

import { Problem, DysgraphiaSubModuleType } from '../types.ts';
import { generateDysgraphiaAIProblem } from './geminiService.ts';
import { numberToWords } from './utils.ts';

// --- LOCAL GENERATION LOGIC ---

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomByDigits = (d: number): number => {
    if (d === 1) return getRandomInt(0, 9);
    return getRandomInt(Math.pow(10, d - 1), Math.pow(10, d) - 1);
};

// --- SVG Trace Generators ---

const generateTraceSVG = (content: string, isShape: boolean = false): string => {
    const fontFamily = isShape ? 'sans-serif' : "'Comic Neue', cursive";
    const fontSize = isShape ? '80' : '120';
    return `
        <svg viewBox="0 0 200 150" style="width: 100%; height: 120px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <text x="100" y="95"
                  font-family="${fontFamily}"
                  font-size="${fontSize}"
                  font-weight="bold"
                  text-anchor="middle"
                  fill="none" 
                  stroke="#cbd5e1" 
                  stroke-width="3" 
                  stroke-dasharray="3,3"
                  stroke-linejoin="round"
            >
                ${content}
            </text>
        </svg>
    `;
};

const SHAPES = {
    square: '■',
    triangle: '▲',
    circle: '●',
    star: '★',
};

const SYMBOLS = {
    plus: '+',
    minus: '-',
    multiply: '×',
    divide: '÷',
    equals: '=',
};

// --- Local Generator Functions ---

const localGenerators: { [key: string]: (settings: any) => { problem: Problem; title: string; preamble?: string } } = {
    'number-trace': (settings) => {
        const num = getRandomByDigits(settings.digits);
        return {
            problem: { question: generateTraceSVG(String(num)), answer: String(num), category: 'dysgraphia' },
            title: "Sayı Yolları",
            preamble: "Noktalı sayıların üzerinden giderek yazma pratiği yap."
        };
    },
    'geometric-doodling': (settings) => {
        const shapeSymbol = SHAPES[settings.shape as keyof typeof SHAPES];
        return {
            problem: { question: generateTraceSVG(shapeSymbol, true), answer: settings.shape, category: 'dysgraphia' },
            title: "Geometrik Çizimler",
            preamble: "Noktalı şekillerin üzerinden giderek çizim pratiği yap."
        };
    },
    'math-connect-the-dots': (settings) => {
        // This is a simplified representation. A real implementation would generate SVG points.
        const num = getRandomInt(5, 10);
        return {
            problem: { question: `1'den ${num}'e kadar olan noktaları birleştir.`, answer: "Resim", category: 'dysgraphia' },
            title: "Noktadan Noktaya Matematik"
        };
    },
    'digit-calligraphy': (settings) => {
        return {
            problem: { question: generateTraceSVG(String(settings.digit)), answer: String(settings.digit), category: 'dysgraphia' },
            title: "Rakam Kaligrafisi",
            preamble: `<b>${settings.digit}</b> rakamının üzerinden giderek doğru yazılışını öğren.`
        };
    },
    'symbol-studio': (settings) => {
        const symbol = SYMBOLS[settings.symbol as keyof typeof SYMBOLS];
        return {
            problem: { question: generateTraceSVG(symbol), answer: symbol, category: 'dysgraphia' },
            title: "Sembol Stüdyosu",
            preamble: `Matematiksel sembollerin üzerinden giderek yazma pratiği yap.`
        };
    },
    'word-form-writer': (settings) => {
        const num = getRandomByDigits(settings.digits);
        const words = numberToWords(num);
        return {
            problem: {
                question: `<p style="font-size: 1.5rem; font-weight: bold; text-align: center;">${num}</p><p style="margin-top: 1rem;">Yukarıdaki sayının okunuşunu aşağıya yaz:</p><div style="border-bottom: 2px dashed #9ca3af; margin-top: 2rem; min-height: 2rem;"></div>`,
                answer: words,
                category: 'dysgraphia'
            },
            title: "Sayıları Yazıyla Yazma",
        };
    }
};

export const generateDysgraphiaProblem = async (subModuleId: DysgraphiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, preamble?: string, error?: string }> => {
    
    const aiModules: DysgraphiaSubModuleType[] = ['listing-the-givens-ai', 'step-by-step-scribe-ai', 'story-problem-creator-ai'];

    if (aiModules.includes(subModuleId)) {
        return generateDysgraphiaAIProblem(subModuleId, settings, count);
    }
    
    const generator = localGenerators[subModuleId];
    if (!generator) {
        return {
            problems: [],
            title: "Hata",
            error: `Disgrafi alt modülü için üreteç bulunamadı: ${subModuleId}`
        };
    }

    let problems: Problem[] = [];
    let title = 'Disgrafi Alıştırması';
    let preamble: string | undefined = undefined;

    for (let i = 0; i < count; i++) {
        const result = generator(settings);
        problems.push(result.problem);
        if (i === 0) {
            title = result.title;
            preamble = result.preamble;
        }
    }

    return { problems, title, preamble };
};