import { Problem, DyscalculiaSubModuleType, DyscalculiaSettings } from '../types';
import { generateSpecialAIProblem } from './geminiService';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// --- SUB-MODULE GENERATORS ---

const generateNumberSenseProblem = (settings: DyscalculiaSettings['numberSense']): { problem: Problem; title: string } => {
    const { type, maxNumber } = settings;
    let problem: Problem = { question: '', answer: '', category: 'dyscalculia-number-sense' };
    const title = 'Sayı Hissi ve Miktar Kavramı';

    if (type === 'number-line') {
        const num = getRandomInt(1, maxNumber - 1);
        const svg = `<svg viewBox="0 0 400 50"><line x1="10" y1="25" x2="390" y2="25" stroke="black" /><line x1="10" y1="20" x2="10" y2="30" stroke="black" /><text x="10" y="45" text-anchor="middle">0</text><line x1="390" y1="20" x2="390" y2="30" stroke="black" /><text x="390" y="45" text-anchor="middle">${maxNumber}</text><circle cx="${10 + (380 * num / maxNumber)}" cy="25" r="5" fill="red" /></svg>`;
        problem.question = `Sayı doğrusunda kırmızı nokta ile gösterilen sayı kaçtır? <br/> ${svg}`;
        problem.answer = num;
    } else { // compare or order
        let nums = new Set<number>();
        while(nums.size < (type === 'compare' ? 2 : 4)) {
            nums.add(getRandomInt(1, maxNumber));
        }
        const numArray = Array.from(nums);
        if (type === 'compare') {
            problem.question = `Hangi sayı daha büyüktür? <br/><br/> <div style="font-size: 2rem; display: flex; justify-content: space-around;"><span>${numArray[0]}</span><span>${numArray[1]}</span></div>`;
            problem.answer = Math.max(...numArray);
        } else {
            problem.question = `Sayıları küçükten büyüğe sıralayınız: <br/><br/> <div style="font-size: 1.5rem;">${shuffleArray(numArray).join(', ')}</div>`;
            problem.answer = numArray.sort((a,b) => a-b).join(', ');
        }
    }
    return { problem, title };
};

const generateVisualArithmeticProblem = (settings: DyscalculiaSettings['visualArithmetic']): { problem: Problem; title: string } => {
    const { operation, maxNumber } = settings;
    const title = 'Görsel Aritmetik';
    let n1 = 0, n2 = 0, answer = 0;
    let opSymbol = '';
    const item = '🍎';

    if (operation === 'addition') {
        n1 = getRandomInt(1, maxNumber - 1);
        n2 = getRandomInt(1, maxNumber - n1);
        answer = n1 + n2;
        opSymbol = '+';
    } else { // subtraction
        n1 = getRandomInt(2, maxNumber);
        n2 = getRandomInt(1, n1 - 1);
        answer = n1 - n2;
        opSymbol = '-';
    }

    const question = `<div style="font-size: 2rem; display: flex; align-items: center; justify-content: center; gap: 1rem;">
        <span>${Array(n1).fill(item).join(' ')}</span> 
        <strong>${opSymbol}</strong> 
        <span>${Array(n2).fill(item).join(' ')}</span> 
        <strong>=</strong> 
        <span>?</span>
    </div>`;

    return { problem: { question, answer, category: 'dyscalculia-visual-arithmetic' }, title };
};

// --- MAIN EXPORTED FUNCTION ---

export const generateDyscalculiaProblem = async (
    subModule: DyscalculiaSubModuleType,
    settings: any,
    count: number
): Promise<{ problems: Problem[]; title: string; error?: string }> => {
    const isAIModule = ['problem-solving', 'interactive-story-dc'].includes(subModule);

    if (isAIModule) {
        try {
            const problems = await generateSpecialAIProblem(subModule, settings, count);
            const title = subModule === 'problem-solving' ? 'Problem Çözme Stratejileri (AI)' : 'Uygulamalı Hikaye Macerası (AI)';
            return { problems, title };
        } catch (e: any) {
            return { problems: [], title: 'Hata', error: e.message };
        }
    } else {
        const generatorMap: { [key: string]: (s: any) => { problem: Problem; title: string } } = {
            'number-sense': generateNumberSenseProblem,
            'visual-arithmetic': generateVisualArithmeticProblem,
            // ... other non-AI generators
        };

        const generator = generatorMap[subModule as keyof typeof generatorMap];
        if (!generator) {
            const placeholder = (title: string) => ({
                problem: { question: 'Bu alıştırma türü henüz tamamlanmadı.', answer: '...', category: `dyscalculia-${subModule}` },
                title
            });
            const results = Array.from({ length: count }, () => placeholder('Geliştiriliyor'));
            return {
                problems: results.map(r => r.problem),
                title: results[0]?.title || 'Diskalkuli Alıştırması',
            };
        }

        try {
            const results = Array.from({ length: count }, () => generator(settings));
            return {
                problems: results.map(r => r.problem),
                title: results[0]?.title || 'Diskalkuli Alıştırması',
            };
        } catch (e: any) {
            return { problems: [], title: 'Hata', error: `Problem oluşturulurken hata: ${e.message}` };
        }
    }
};
