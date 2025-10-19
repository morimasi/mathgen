// services/dyslexiaService.ts

import { Problem, DyslexiaSubModuleType, MapReadingSettings } from '../types.ts';
import { generateDyslexiaAIProblem } from './geminiService.ts';
import { cityData, getTurkeyMapSVG } from './map/mapData.ts';

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

const wordPools = {
    hayvanlar: ['kedi', 'köpek', 'at', 'kuş', 'balık', 'aslan', 'fil', 'yılan', 'ayı', 'kurt', 'tilki'],
    meyveler: ['elma', 'armut', 'çilek', 'muz', 'kiraz', 'erik', 'üzüm', 'kavun', 'karpuz', 'ayva'],
    eşyalar: ['masa', 'kalem', 'silgi', 'saat', 'top', 'bardak', 'kapı', 'ev', 'okul', 'kitap', 'defter'],
    renkler: ['sarı', 'mavi', 'yeşil', 'pembe', 'siyah', 'beyaz', 'gri', 'mor', 'turuncu'],
};

// --- NEW ATTENTION QUESTION GENERATOR ---

type NumericalClue = {
    text: string;
    test: (num: number, box: number[], allBoxes: number[][]) => boolean;
};

type VerbalClue = {
    text: string;
    test: (word: string, box: string[], allBoxes: string[][]) => boolean;
};

const generateNumericalAttentionQuestion = (settings: any): { problem: Problem, title: string } => {
    const { difficulty, numberRange } = settings;
    const [min, max] = numberRange.split('-').map(Number);
    const clueCount = difficulty === 'easy' ? 2 : 3;
    const title = "Dikkat Soruları (Sayısal)";

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

        const cluesPool: NumericalClue[] = [];

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
    // Fallback...
    return {
        problem: { question: 'Benzersiz bir sayısal dikkat sorusu oluşturulamadı.', answer: 'Hata', category: 'dyslexia' },
        title
    };
};

const generateVerbalAttentionQuestion = (settings: any): { problem: Problem, title: string } => {
    const { difficulty } = settings;
    const clueCount = difficulty === 'easy' ? 2 : 3;
    const title = "Dikkat Soruları (Sözel)";
    const vowels = "aeıioöuü";

    let puzzleGenerated = false;
    let attempts = 0;

    while (!puzzleGenerated && attempts < 200) {
        attempts++;
        const allWordsPool = Object.values(wordPools).flat();
        const box1 = shuffleArray(allWordsPool).slice(0, 5);
        const box2 = shuffleArray(allWordsPool).slice(0, 5);
        const allWords = [...box1, ...box2];

        const answerBoxIndex = getRandomInt(0, 1);
        const answerBox = answerBoxIndex === 0 ? box1 : box2;
        const correctAnswer = answerBox[getRandomInt(0, answerBox.length - 1)];

        const cluesPool: VerbalClue[] = [];

        // Clue 1: Position
        cluesPool.push({
            text: `Aradığımız kelime <b>${answerBoxIndex === 0 ? 'sol' : 'sağ'} kutudadır</b>.`,
            test: (word) => (answerBoxIndex === 0 ? box1.includes(word) : box2.includes(word))
        });
        cluesPool.push({
            text: `Aradığımız kelime <b>${answerBoxIndex === 0 ? 'sağ' : 'sol'} kutuda değildir</b>.`,
            test: (word) => (answerBoxIndex === 0 ? !box2.includes(word) : !box1.includes(word))
        });

        // Clue 2: Length
        const length = correctAnswer.length;
        cluesPool.push({ text: `Aradığımız kelime <b>${length} harflidir</b>.`, test: word => word.length === length });

        const longestInBox = answerBox.reduce((a, b) => a.length > b.length ? a : b);
        const shortestInBox = answerBox.reduce((a, b) => a.length < b.length ? a : b);
        if (correctAnswer.length === longestInBox.length && answerBox.filter(w => w.length === longestInBox.length).length === 1) {
            cluesPool.push({ text: 'Bulunduğu kutudaki <b>en uzun kelimedir</b>.', test: (word, box) => word.length === Math.max(...box.map(w => w.length)) });
        }
        if (correctAnswer.length === shortestInBox.length && answerBox.filter(w => w.length === shortestInBox.length).length === 1) {
            cluesPool.push({ text: 'Bulunduğu kutudaki <b>en kısa kelimedir</b>.', test: (word, box) => word.length === Math.min(...box.map(w => w.length)) });
        }

        // Clue 3: Letter content
        const firstLetter = correctAnswer[0];
        cluesPool.push({ text: `Aradığımız kelime <b>'${firstLetter}' harfi ile başlar</b>.`, test: word => word.startsWith(firstLetter) });
        const lastLetter = correctAnswer[correctAnswer.length - 1];
        cluesPool.push({ text: `Aradığımız kelime <b>'${lastLetter}' harfi ile biter</b>.`, test: word => word.endsWith(lastLetter) });
        
        const randomLetter = correctAnswer[getRandomInt(1, correctAnswer.length - 2)];
        if(randomLetter) {
            cluesPool.push({ text: `Aradığımız kelimenin içinde <b>'${randomLetter}' harfi vardır</b>.`, test: word => word.includes(randomLetter) });
        }

        // Clue 4: Category
        for (const category in wordPools) {
            if ((wordPools as any)[category].includes(correctAnswer)) {
                cluesPool.push({ text: `Aradığımız kelime bir <b>${category} adıdır</b>.`, test: word => (wordPools as any)[category].includes(word) });
            }
        }

        const selectedClues = shuffleArray(cluesPool).slice(0, clueCount);

        // Verify uniqueness
        const possibleAnswers = allWords.filter(word => {
            const wordBox = box1.includes(word) ? box1 : box2;
            return selectedClues.every(clue => clue.test(word, wordBox, [box1, box2]));
        });

        if (possibleAnswers.length === 1 && possibleAnswers[0] === correctAnswer) {
            const distractors = allWords.filter(w => w !== correctAnswer);
            const options = shuffleArray([correctAnswer, ...shuffleArray(distractors).slice(0, 4)]);

            const cluesHTML = selectedClues.map(c => `<p>${c.text}</p>`).join('');
            const boxesHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #ccc; font-family: monospace; text-align: center; margin: 0.5rem 0; font-size: 0.8rem;">
                    <div style="padding: 0.5rem; border-right: 1px solid #ccc;">${box1.join(', ')}</div>
                    <div style="padding: 0.5rem;">${box2.join(', ')}</div>
                </div>
            `;
            const optionsHTML = `<ol type="a" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); list-style-position: inside; padding: 0;">${options.map(o => `<li>${o}</li>`).join('')}</ol>`;

            const question = `<div style="font-size: 0.9rem; line-height: 1.4;">${cluesHTML}${boxesHTML}${optionsHTML}</div>`;
            
            return {
                problem: { question, answer: correctAnswer, category: 'dyslexia' },
                title
            };
        }
    }
     // Fallback...
    return {
        problem: { question: 'Benzersiz bir sözel dikkat sorusu oluşturulamadı.', answer: 'Hata', category: 'dyslexia' },
        title
    };
};

const generateAttentionQuestionLocal = (settings: any): { problem: Problem, title: string } => {
    if (settings.questionType === 'verbal') {
        return generateVerbalAttentionQuestion(settings);
    }
    return generateNumericalAttentionQuestion(settings);
};

// FIX: Corrected the 'blend' case which had invalid syntax and added a missing return statement to resolve a 'must return a value' error.
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
            title = "Ses Birleştirme";
            const blends = Object.keys(wordLists.blend) as Array<keyof typeof wordLists.blend>;
            const blendKey = blends[getRandomInt(0, blends.length - 1)];
            answer = wordLists.blend[blendKey];
            question = `Bu sesleri birleştirerek hangi kelimeyi oluşturursun? <br/> <b style="font-size: 1.5rem;">${blendKey}</b>`;
            break;
    }
    return { problem: { question, answer, category: 'dyslexia' }, title };
};

// FIX: Added placeholder functions for missing local generators to allow the module to compile.
const generateLetterDetectiveLocal = (settings: any): { problem: Problem, title: string } => ({ problem: { question: "Harf dedektifi alıştırması.", answer: "...", category: 'dyslexia' }, title: 'Harf Dedektifi' });
const generateVisualMasterLocal = (settings: any): { problem: Problem, title: string } => ({ problem: { question: "Görsel usta alıştırması.", answer: "...", category: 'dyslexia' }, title: 'Görsel Usta' });
const generateWordHunterLocal = (settings: any): { problem: Problem, title: string } => ({ problem: { question: "Kelime avcısı alıştırması.", answer: "...", category: 'dyslexia' }, title: 'Kelime Avcısı' });
const generateSpellingChampionLocal = (settings: any): { problem: Problem, title: string } => ({ problem: { question: "Yazım şampiyonu alıştırması.", answer: "...", category: 'dyslexia' }, title: 'Yazım Şampiyonu' });
const generateMemoryGamerLocal = (settings: any): { problem: Problem, title: string } => ({ problem: { question: "Hafıza oyuncusu alıştırması.", answer: "...", category: 'dyslexia' }, title: 'Hafıza Oyuncusu' });
const generateAuditoryWritingLocal = (settings: any): { problem: Problem, title: string } => ({ problem: { question: "İşitsel yazma alıştırması.", answer: "...", category: 'dyslexia' }, title: 'İşitsel Yazma' });
const generateMapReadingLocal = (settings: MapReadingSettings): { problem: Problem, title: string } => {
    const { region, questionCount } = settings;
    const title = "Harita Okuma Etkinliği";
    const citiesInRegion = region === 'turkey' ? cityData : cityData.filter(c => c.region.toLowerCase().replace(/ /g, '') === region);

    if (citiesInRegion.length < 5) {
        return { problem: { question: 'Bölgede yeterli şehir yok.', answer: 'Hata', category: 'dyslexia' }, title };
    }

    const questions: string[] = [];
    const answers: string[] = [];
    
    for (let i = 0; i < questionCount; i++) {
        const city = citiesInRegion[getRandomInt(0, citiesInRegion.length - 1)];
        questions.push(`Haritada <b>${city.name}</b> ilini bul ve <b style="color: red;">kırmızıya</b> boya.`);
        answers.push(`${city.name} kırmızıya boyanır.`);
    }

    const question = `<div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>${getTurkeyMapSVG(region)}</div>
        <ol style="list-style-type: decimal; padding-left: 2rem;">
            ${questions.map(q => `<li>${q}</li>`).join('')}
        </ol>
    </div>`;

    return { problem: { question, answer: answers.join(' | '), category: 'dyslexia', display: 'flow' }, title };
};

// FIX: Added the missing 'generateDyslexiaProblem' function. This resolves the import error in DyslexiaModule.tsx.
export const generateDyslexiaProblem = async (subModuleId: DyslexiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    
    const aiModules: DyslexiaSubModuleType[] = ['reading-fluency-coach', 'comprehension-explorer', 'vocabulary-explorer', 'interactive-story'];

    if (aiModules.includes(subModuleId)) {
        return generateDyslexiaAIProblem(subModuleId, settings, count);
    }
    
    let problems: Problem[] = [];
    let title = 'Disleksi Alıştırması';

    if (subModuleId === 'map-reading') {
        const result = generateMapReadingLocal(settings);
        return { problems: [result.problem], title: result.title };
    }

    for(let i=0; i < count; i++) {
        let result: { problem: Problem; title: string; };
        switch(subModuleId) {
            case 'attention-questions':
                result = generateAttentionQuestionLocal(settings);
                break;
            case 'sound-wizard':
                result = generateSoundWizardLocal(settings);
                break;
            case 'letter-detective':
                result = generateLetterDetectiveLocal(settings);
                break;
            case 'visual-master':
                result = generateVisualMasterLocal(settings);
                break;
            case 'word-hunter':
                result = generateWordHunterLocal(settings);
                break;
            case 'spelling-champion':
                result = generateSpellingChampionLocal(settings);
                break;
            case 'memory-gamer':
                result = generateMemoryGamerLocal(settings);
                break;
            case 'auditory-writing':
                result = generateAuditoryWritingLocal(settings);
                break;
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
