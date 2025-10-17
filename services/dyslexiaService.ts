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
