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
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// --- SVG Trace Generators ---

const generateTraceSVG = (content: string, isShape: boolean = false, isCursive: boolean = false): string => {
    const fontFamily = isCursive ? "'Caveat', cursive" : (isShape ? 'sans-serif' : "'Comic Neue', cursive");
    const fontSize = isShape ? '80' : '120';
    const startDot = `<circle cx="20" cy="80" r="4" fill="#22c55e" />`; // Green start dot
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
            ${!isShape ? startDot : ''}
        </svg>
    `;
};

const SHAPES = {
    square: '■',
    triangle: '▲',
    circle: '●',
    star: '★',
    spiral: '🌀',
    maze: ' labyrinth', // Using a word with a specific font might work
};

const SYMBOLS = {
    plus: '+',
    minus: '-',
    multiply: '×',
    divide: '÷',
    equals: '=',
};

const getDotPattern = (num: number): {x:number, y:number}[] => {
    switch(num) {
        case 3: return [{x:50, y:20}, {x:90, y:90}, {x:10, y:90}]; // Triangle
        case 4: return [{x:20, y:20}, {x:80, y:20}, {x:80, y:80}, {x:20, y:80}]; // Square
        case 5: return [{x:50,y:15}, {x:85,y:40}, {x:70,y:85}, {x:30,y:85}, {x:15,y:40}]; // Pentagon
        default: // Default spiral
            return Array.from({length: num}, (_, i) => {
                const angle = i * 2.5;
                const r = 15 + i * 4;
                return { x: 50 + r * Math.cos(angle), y: 70 + r * Math.sin(angle) };
            });
    }
}


// --- Local Generator Functions ---

const localGenerators: { [key: string]: (settings: any) => { problem: Problem; title: string; preamble?: string } } = {
    'number-trace': (settings) => {
        const { digits, isSequence } = settings;
        let content = '';
        let answer = '';
        if (isSequence) {
            const start = getRandomByDigits(digits);
            content = `${start}, ${start + 1}, ${start + 2}`;
            answer = content;
        } else {
            const num = getRandomByDigits(digits);
            content = String(num);
            answer = String(num);
        }
        return {
            problem: { question: generateTraceSVG(content), answer, category: 'dysgraphia' },
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
        const { countingType } = settings;
        const title = "Noktadan Noktaya Matematik";
        let preamble = "";
        const numPoints = getRandomInt(8, 15);
        const points = getDotPattern(numPoints);
        let labels: string[] = [];
        let answer = "";
        
        switch (countingType) {
            case 'sequential':
                preamble = "Noktaları 1'den başlayarak sırayla birleştir.";
                labels = Array.from({length: numPoints}, (_, i) => String(i + 1));
                answer = "Sıralı birleştirme";
                break;
            case 'by-twos':
                const startTwo = getRandomInt(1, 5) * 2;
                preamble = `Noktaları ${startTwo}'den başlayarak ikişer sayarak birleştir.`;
                labels = Array.from({length: numPoints}, (_, i) => String(startTwo + i * 2));
                answer = "İkişer ritmik sayma";
                break;
            case 'by-fives':
                const startFive = getRandomInt(1, 4) * 5;
                preamble = `Noktaları ${startFive}'den başlayarak beşer sayarak birleştir.`;
                labels = Array.from({length: numPoints}, (_, i) => String(startFive + i * 5));
                answer = "Beşer ritmik sayma";
                break;
        }
    
        const dotsSVG = points.map((p, i) => `
            <circle cx="${p.x}" cy="${p.y}" r="2.5" fill="black" />
            <text x="${p.x}" y="${p.y - 5}" font-size="10" text-anchor="middle">${labels[i]}</text>
        `).join('');
    
        const question = `<svg viewBox="0 0 100 120" style="width: 100%; max-width: 300px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px;">${dotsSVG}</svg>`;
    
        return {
            problem: { question, answer, category: 'dysgraphia' },
            title,
            preamble
        };
    },
    'grid-copy': (settings) => {
        const { gridSize, complexity } = settings;
        const title = "Izgara Kopyalama";
        const preamble = "Soldaki deseni, sağdaki boş ızgaraya aynısını çizerek kopyala.";

        const cellStates = Array(gridSize * gridSize).fill(false);
        const numFilled = complexity === 'easy' ? Math.floor(gridSize * gridSize * 0.3) : Math.floor(gridSize * gridSize * 0.5);
        
        let filledCount = 0;
        while(filledCount < numFilled) {
            const index = getRandomInt(0, cellStates.length - 1);
            if (!cellStates[index]) {
                cellStates[index] = true;
                filledCount++;
            }
        }

        const createGrid = (isFilled: boolean) => `
            <div style="display: grid; grid-template-columns: repeat(${gridSize}, 1fr); gap: 2px; width: 120px; height: 120px; border: 2px solid #9ca3af; padding: 2px; background-color: #f3f4f6;">
                ${Array.from({ length: gridSize * gridSize }).map((_, i) => `
                    <div style="background-color: ${isFilled && cellStates[i] ? '#4f46e5' : '#fff'}; border: 1px solid #d1d5db;"></div>
                `).join('')}
            </div>
        `;

        const question = `
            <div style="display: flex; justify-content: center; align-items: center; gap: 2rem;">
                ${createGrid(true)}
                <span style="font-size: 2rem; color: #9ca3af;">→</span>
                ${createGrid(false)}
            </div>
        `;
        
        return {
            problem: { question, answer: "Desen kopyalanır.", category: 'dysgraphia' },
            title,
            preamble
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
    
    const aiModules: DysgraphiaSubModuleType[] = ['listing-the-givens-ai', 'step-by-step-scribe-ai', 'story-problem-creator-ai', 'cursive-practice-ai', 'sentence-unscramble-ai'];

    if (aiModules.includes(subModuleId)) {
        const aiResult = await generateDysgraphiaAIProblem(subModuleId, settings, count);
        // Special handling for cursive AI to wrap text in SVG
        if (!aiResult.error && subModuleId === 'cursive-practice-ai') {
            aiResult.problems.forEach(p => {
                p.question = generateTraceSVG(p.question, false, true); // isCursive = true
            });
            aiResult.preamble = "Noktalı yazıların üzerinden giderek el yazısı pratiği yap.";
        }
        return aiResult;
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