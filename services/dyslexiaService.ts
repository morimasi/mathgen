import { Problem, DyslexiaSubModuleType } from '../types';
import { generateDyslexiaAIProblem } from './geminiService';

// --- LOCAL GENERATION LOGIC ---

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Placeholder data for local generation
const wordLists = {
    rhyme: {
        'at': ['at', 'yat', 'sat', 'kat'],
        'el': ['el', 'gel', 'sel', 'yel'],
        'al': ['al', 'kal', 'sal', 'dal'],
        'ok': ['ok', 'yok', 'çok', 'tok'],
    },
    syllable: {
        1: ['top', 'at', 'el', 'gel'],
        2: ['ka-lem', 'si-mit', 'o-kul', 'e-rik'],
        3: ['ke-le-bek', 'a-ra-ba', 'pa-pa-tya', 'sa-ba-hı'],
    },
    blend: {
        'b-a-l': 'bal', 's-u': 'su', 'e-l-m-a': 'elma', 'k-i-t-a-p': 'kitap'
    }
};

// --- NEW ATTENTION QUESTION GENERATOR ---

type Clue = {
    text: string;
    test: (num: number, box: number[], allBoxes: number[][]) => boolean;
};

const generateAttentionQuestionLocal = (settings: any): { problem: Problem, title: string } => {
    const { difficulty, numberRange } = settings;
    const [min, max] = numberRange.split('-').map(Number);
    const clueCount = difficulty === 'easy' ? 2 : 3;
    const title = "Dikkat Soruları";

    let puzzleGenerated = false;
    let attempts = 0;

    while (!puzzleGenerated && attempts < 200) {
        attempts++;

        const box1 = Array.from({ length: 4 }, () => getRandomInt(min, max));
        const box2 = Array.from({ length: 4 }, () => getRandomInt(min, max));
        const allNumbers = [...box1, ...box2];

        const answerBoxIndex = getRandomInt(0, 1);
        const answerBox = answerBoxIndex === 0 ? box1 : box2;
        const correctAnswer = answerBox[getRandomInt(0, answerBox.length - 1)];

        const cluesPool: Clue[] = [];

        // Clue 1: Position
        cluesPool.push({
            text: `Aradığımız sayı <b>${answerBoxIndex === 0 ? 'sol' : 'sağ'} kutudadır</b>.`,
            test: (num, box) => (answerBoxIndex === 0 ? box1.includes(num) : box2.includes(num))
        });
        cluesPool.push({
            text: `Aradığımız sayı <b>${answerBoxIndex === 0 ? 'sağ' : 'sol'} kutuda değildir</b>.`,
            test: (num, box) => (answerBoxIndex === 0 ? !box2.includes(num) : !box1.includes(num))
        });
        
        // Clue 2: Parity
        if (correctAnswer % 2 === 0) {
            cluesPool.push({ text: 'Aradığımız sayı bir <b>çift sayıdır</b>.', test: num => num % 2 === 0 });
        } else {
            cluesPool.push({ text: 'Aradığımız sayı bir <b>tek sayıdır</b>.', test: num => num % 2 !== 0 });
        }

        // Clue 3: Magnitude in box
        const maxInBox = Math.max(...answerBox);
        const minInBox = Math.min(...answerBox);
        if (correctAnswer === maxInBox && answerBox.filter(n => n === maxInBox).length === 1) {
            cluesPool.push({ text: 'Bulunduğu kutudaki <b>en büyük sayıdır</b>.', test: (num, box) => num === Math.max(...box) });
        }
        if (correctAnswer === minInBox && answerBox.filter(n => n === minInBox).length === 1) {
            cluesPool.push({ text: 'Bulunduğu kutudaki <b>en küçük sayıdır</b>.', test: (num, box) => num === Math.min(...box) });
        }

        // Clue 4: Digits
        const digits = String(correctAnswer).length;
        cluesPool.push({ text: `Aradığımız sayı <b>${digits} basamaklıdır</b>.`, test: num => String(num).length === digits });

        // Clue 5: Comparison
        const comparisonOffset = Math.ceil(max * 0.1);
        const greaterThan = correctAnswer - getRandomInt(1, comparisonOffset);
        cluesPool.push({ text: `Aradığımız sayı <b>${greaterThan}'den büyüktür</b>.`, test: num => num > greaterThan });
        const lessThan = correctAnswer + getRandomInt(1, comparisonOffset);
        cluesPool.push({ text: `Aradığımız sayı <b>${lessThan}'den küçüktür</b>.`, test: num => num < lessThan });
        
        // Clue 6: Multiples
        if (difficulty !== 'easy') {
            const divisors = [2, 3, 5, 10].filter(d => correctAnswer > d && correctAnswer % d === 0);
            if (divisors.length > 0) {
                const divisor = divisors[getRandomInt(0, divisors.length - 1)];
                cluesPool.push({ text: `Aradığımız sayı <b>${divisor}'in katlarından birisidir</b>.`, test: num => num % divisor === 0 });
            }
        }
        
        const selectedClues = shuffleArray(cluesPool).slice(0, clueCount);

        // Verify uniqueness
        const possibleAnswers = allNumbers.filter(num => {
            const numBox = box1.includes(num) ? box1 : box2;
            return selectedClues.every(clue => clue.test(num, numBox, [box1, box2]));
        });

        if (possibleAnswers.length === 1 && possibleAnswers[0] === correctAnswer) {
            // Generate distractors
            const distractors = allNumbers.filter(n => n !== correctAnswer);
            const options = shuffleArray([correctAnswer, ...shuffleArray(distractors).slice(0, 4)]);

            const cluesHTML = selectedClues.map(c => `<p>${c.text}</p>`).join('');
            const boxesHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #ccc; font-family: monospace; text-align: center; margin: 0.5rem 0;">
                    <div style="padding: 0.5rem; border-right: 1px solid #ccc;">${box1.join(', ')}</div>
                    <div style="padding: 0.5rem;">${box2.join(', ')}</div>
                </div>
            `;
            const optionsHTML = `<ol type="a" style="display: grid; grid-template-columns: repeat(5, 1fr); list-style-position: inside; padding: 0;">${options.map(o => `<li>${o}</li>`).join('')}</ol>`;

            const question = `<div style="font-size: 0.9rem; line-height: 1.4;">${cluesHTML}${boxesHTML}${optionsHTML}</div>`;
            
            return {
                problem: { question, answer: correctAnswer, category: 'dyslexia' },
                title
            };
        }
    }

    // Fallback if no unique puzzle could be generated
    return {
        problem: { question: 'Benzersiz bir dikkat sorusu oluşturulamadı. Lütfen ayarları değiştirip tekrar deneyin.', answer: 'Hata', category: 'dyslexia' },
        title
    };
};


const generateSoundWizardLocal = (settings: any): { problem: Problem, title: string } => {
    const { type } = settings;
    let question = "", answer = "", title = "Ses Büyücüsü";

    switch(type) {
        case 'rhyme':
            title = "Kafiyeli Kelimeyi Bul";
            const rhymeGroups = Object.keys(wordLists.rhyme);
            const groupKey = rhymeGroups[getRandomInt(0, rhymeGroups.length - 1)];
            const words = [...wordLists.rhyme[groupKey as keyof typeof wordLists.rhyme]];
            const targetWord = words.shift()!;
            answer = words[0];
            const options = shuffleArray([answer, 'git', 'koş', 'yaz']);
            question = `<b>${targetWord}</b> kelimesi ile kafiyeli olan hangisidir? <br/> ${options.join(' - ')}`;
            break;
        case 'syllable':
            title = "Hece Sayısı";
            const syllableCounts = Object.keys(wordLists.syllable);
            const countKey = syllableCounts[getRandomInt(0, syllableCounts.length - 1)];
            const wordWithSyllables = wordLists.syllable[countKey as "1" | "2" | "3"][getRandomInt(0, 3)];
            const word = wordWithSyllables.replace(/-/g, '');
            answer = countKey;
            question = `<b>${word}</b> kelimesi kaç hecelidir?`;
            break;
        case 'blend':
            title = "Sesleri Birleştir";
            const blends = Object.keys(wordLists.blend);
            const blendKey = blends[getRandomInt(0, blends.length - 1)];
            answer = wordLists.blend[blendKey as keyof typeof wordLists.blend];
            question = `<b>${blendKey}</b> seslerini birleştirirsek hangi kelime oluşur?`;
            break;
    }
    return { problem: { question, answer, category: 'dyslexia' }, title };
};

const generateVisualMasterLocal = (settings: any): { problem: Problem, title: string } => {
    const { type, pair } = settings;
    const pairs: {[key: string]: string[]} = {
        'b-d': ['b', 'd'], 'p-q': ['p', 'q'], 'm-n': ['m', 'n'],
        'ev-ve': ['ev', 've'], 'yok-koy': ['yok', 'koy'], 'kar-rak': ['kar', 'rak']
    };
    const [target, distractor] = pairs[pair] || ['b', 'd'];
    const title = "Görsel Ayırt Etme";
    
    let items = [];
    let targetCount = 0;
    for(let i = 0; i < 20; i++) {
        if(Math.random() < 0.4) {
            items.push(target);
            targetCount++;
        } else {
            items.push(distractor);
        }
    }
    const question = `Aşağıdaki dizide <b>'${target}'</b> ${type==='letter' ? 'harfini' : 'kelimesini'} bulunuz:<br/><div style="font-size: 1.5rem; letter-spacing: 0.5em; text-align: center; margin-top: 0.5rem;">${items.join('')}</div>`;
    const answer = String(targetCount);

    return { problem: { question, answer, category: 'dyslexia' }, title };
};


export const generateDyslexiaProblem = async (subModuleId: DyslexiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    
    const aiModules: DyslexiaSubModuleType[] = ['reading-fluency-coach', 'comprehension-explorer', 'vocabulary-explorer', 'interactive-story'];

    if (aiModules.includes(subModuleId)) {
        return generateDyslexiaAIProblem(subModuleId, settings, count);
    }
    
    // For local generation
    let problems: Problem[] = [];
    let title = 'Disleksi Alıştırması';

    for(let i=0; i < count; i++) {
        let result: { problem: Problem; title: string; };
        switch(subModuleId) {
            case 'attention-questions':
                result = generateAttentionQuestionLocal(settings);
                break;
            case 'sound-wizard':
                result = generateSoundWizardLocal(settings);
                break;
            case 'visual-master':
                result = generateVisualMasterLocal(settings);
                break;
            // Add other local generators here
            default:
                result = { 
                    problem: { question: `Bu alıştırma ('${subModuleId}') için yerel üreteç henüz tanımlanmadı.`, answer: "...", category: 'dyslexia' },
                    title: 'Bilinmeyen Modül'
                };
        }
        problems.push(result.problem);
        if(i === 0) title = result.title;
    }

    return { problems, title };
};