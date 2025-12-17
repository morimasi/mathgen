// services/dyslexiaService.ts

import { Problem, DyslexiaSubModuleType } from '../types.ts';
import { generateDyslexiaAIProblem } from './geminiService.ts';
import { maps } from './map/mapData.ts';

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

// --- Local Generator Functions ---

const generateSoundWizardLocal = (settings: any): { problem: Problem; title: string; } => {
    const { type } = settings;
    let question = "", answer = "", title = "Ses Büyücüsü";

    switch(type) {
        case 'rhyme':
            const rhymePairs = [['kedi', 'yedi'], ['bal', 'dal'], ['elma', 'alma']];
            const pair = rhymePairs[getRandomInt(0, 2)];
            question = `<b>'${pair[0]}'</b> kelimesi ile kafiyeli olan kelime hangisidir?`;
            answer = pair[1];
            break;
        case 'syllable':
            const syllableWords = [['kelebek', 3], ['araba', 3], ['top', 1]];
            const [word, count] = syllableWords[getRandomInt(0, 2)];
            question = `<b>'${word}'</b> kelimesi kaç hecelidir?`;
            answer = String(count);
            break;
        case 'blend':
            question = `<b>'s' + 'u'</b> seslerini birleştirirsek ne olur?`;
            answer = 'su';
            break;
    }
    return { problem: { question, answer, category: 'dyslexia' }, title };
};

const generateLetterDetectiveLocal = (settings: any): { problem: Problem; title: string; } => {
    const { letterGroup, difficulty } = settings;
    const title = "Harf Dedektifi";
    let question = "", answer = "";

    const groups = {
        vowels: ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'],
        common_consonants: ['m', 't', 'k', 'l', 'n'],
        tricky_consonants: ['b', 'd', 'p', 'g', 'ğ'],
        mixed: ['r', 's', 'ş', 'c', 'ç', 'f', 'h', 'j', 'v', 'y', 'z']
    };

    const targetLetter = groups[letterGroup as keyof typeof groups][getRandomInt(0, groups[letterGroup as keyof typeof groups].length - 1)];
    const distractors = shuffleArray(groups.mixed.concat(groups.common_consonants)).filter(l => l !== targetLetter);

    if (difficulty === 'easy') {
        const gridLetters = shuffleArray(
            Array(5).fill(targetLetter).concat(Array(15).fill(0).map((_, i) => distractors[i % distractors.length]))
        );
        question = `Harflerin arasında <b>'${targetLetter}'</b> harfini bul ve daire içine al.<br/><div style="font-size: 1.5rem; letter-spacing: 0.5em; font-family: sans-serif; margin-top: 1rem; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; line-height: 1.75;">${gridLetters.join(' ')}</div>`;
        answer = `Daire içine alınmış '${targetLetter}' harfleri.`;
    } else { // medium
        const words: Record<string, string[]> = {
            'a': ['ayva', 'ana', 'ata'], 'e': ['elma', 'etek', 'eski'], 'ı': ['ılık', 'ısı', 'ıslak'], 'i': ['ipek', 'inek', 'iki'], 'o': ['okul', 'oyun', 'oda'], 'ö': ['ördek', 'ödev', 'örtü'], 'u': ['uçak', 'uzun', 'ucuz'], 'ü': ['üzüm', 'üç', 'üst'],
            'm': ['masa', 'mama', 'mor'], 't': ['top', 'terlik', 'tarak'], 'k': ['kedi', 'kapı', 'kale'], 'l': ['limon', 'lale', 'leke'], 'n': ['nar', 'nane', 'nota'],
            'b': ['balon', 'bebek', 'baba'], 'd': ['dede', 'ders', 'deve'], 'p': ['para', 'pil', 'pano'], 'g': ['gemi', 'göz', 'gaz'],
        };
        const targetWords = (words[targetLetter] || ['kelime', 'kalem']);
        const distractorWords = ['su', 'el', 'at', 'ev', 'iş', 'ok'].filter(w => !w.startsWith(targetLetter));
        const wordPool = shuffleArray([targetWords[getRandomInt(0, targetWords.length-1)], distractorWords[0], distractorWords[1], targetWords[getRandomInt(0, targetWords.length-1)], distractorWords[2]]);
        
        question = `<b>'${targetLetter}'</b> harfi ile başlayan kelimeyi bul ve işaretle.<br/><div style="display: flex; gap: 1rem; font-size: 1.25rem; margin-top: 1rem;">${wordPool.map(w => `<span style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">${w}</span>`).join('')}</div>`;
        answer = targetWords.join(', ');
    }

    return { problem: { question, answer, category: 'dyslexia' }, title };
};

const generateMemoryGamerLocal = (settings: any): { problem: Problem; title: string; preamble?: string } => {
    const { type, sequenceLength } = settings;
    const title = "Hafıza Oyuncusu";
    const preamble = "Öğretmen/veli yönergeyi okur, öğrenci dinler ve tekrar eder.";
    let question = "", answer = "";

    switch (type) {
        case 'digit_span':
            const digits = Array.from({ length: sequenceLength }, () => getRandomInt(0, 9));
            question = `Aşağıdaki rakam dizisini dikkatlice dinle ve tekrar et.`;
            answer = digits.join(' - ');
            break;
        case 'word_sequence':
            const wordPool = ['kedi', 'mavi', 'top', 'ev', 'güneş', 'su', 'ağaç', 'kitap', 'elma', 'yol'];
            const words = shuffleArray(wordPool).slice(0, sequenceLength);
            question = `Aşağıdaki kelime dizisini dikkatlice dinle ve aynı sırayla tekrar et.`;
            answer = words.join(' - ');
            break;
        case 'sentence_repeat':
            const sentences = [
                'Kırmızı araba hızlı gider.',
                'Küçük köpek parkta oynuyor.',
                'Bugün hava çok güzel.',
                'Annem lezzetli bir kek yaptı.',
                'Okula gitmeyi seviyorum.',
            ];
            // Select a sentence with roughly the right number of words
            const targetSentence = sentences.find(s => s.split(' ').length >= sequenceLength) || sentences[sentences.length - 1];
            question = `Aşağıdaki cümleyi dikkatlice dinle ve tekrar et.`;
            answer = targetSentence;
            break;
    }

    // The answer is for the teacher, not the student sheet.
    return { problem: { question, answer: `Söylenecek: "${answer}"`, category: 'dyslexia' }, title, preamble };
};

const generateAttentionQuestionLocal = (settings: any): { problem: Problem; title: string; } => {
    const { questionType, difficulty } = settings;
    const title = "Dikkat Soruları";
    let question = "", answer = "";
    
    if (questionType === 'numerical') {
        const num1 = getRandomInt(1, 10);
        const num2 = getRandomInt(1, 10);
        if (difficulty === 'easy') {
            question = `Bir sayıyı <b>${num1}</b> ile topladığımda <b>${num1 + num2}</b> buluyorum. Bu sayı kaçtır?`;
            answer = String(num2);
        } else { // medium/hard
            const num3 = getRandomInt(1, 10);
            question = `Aklımda bir sayı tuttum. Bu sayıdan <b>${num1}</b> çıkarıp <b>${num2}</b> eklediğimde <b>${num3}</b> buluyorum. Aklımdaki sayı kaçtır?`;
            answer = String(num3 - num2 + num1);
        }
    } else { // verbal
         if (difficulty === 'easy') {
            const items = shuffleArray(['elma', 'armut', 'muz']);
            question = `Sana üç kelime söyleyeceğim: <b>${items[0]}, ${items[1]}, ${items[2]}</b>. Sondan ikinci kelime nedir?`;
            answer = items[1];
        } else { // medium/hard
            question = `Bir yarışta ikinci olanı geçersen, kaçıncı olursun?`;
            answer = 'İkinci';
        }
    }

    return { problem: { question, answer, category: 'dyslexia' }, title };
};

const wordPairs: { [key in 'easy' | 'medium' | 'hard']: [string, string][] } = {
    easy: [['ev', 've'], ['yok', 'koy'], ['kar', 'rak'], ['az', 'za'], ['at', 'ta']],
    medium: [['kasa', 'saka'], ['askı', 'sakı'], ['altı', 'atlı'], ['masa', 'sama']],
    hard: [['merdiven', 'merdane'], ['kalabalık', 'kalabalık'], ['denetim', 'denetmen'], ['teşekkür', 'tefekkür']]
};

const generateVisualMasterLocal = (settings: any): { problem: Problem; title: string; } => {
    const { type, task, targetPair, gridDensity, wordComplexity } = settings;
    let title = "Görsel Usta";
    let question = "", answer = "";

    if (task === 'find-all') {
        if (type === 'letter') {
            const pairs: Record<string, [string, string]> = {
                'b-d': ['b', 'd'], 'p-q': ['p', 'q'], 'm-n': ['m', 'n'], 's-z': ['s', 'z'], 'f-v': ['f', 'v'], 'g-ğ': ['g', 'ğ']
            };
            const allPairs = Object.values(pairs);
            const [target, distractor] = targetPair === 'mixed' ? allPairs[getRandomInt(0, allPairs.length - 1)] : pairs[targetPair];
            
            const densityMap = { low: 6, medium: 8, high: 10 };
            const gridSize = densityMap[gridDensity as keyof typeof densityMap];
            const totalCells = gridSize * gridSize;
            const targetCount = Math.floor(totalCells * 0.2);

            const gridItems = shuffleArray([
                ...Array(targetCount).fill(target),
                ...Array(totalCells - targetCount).fill(distractor)
            ]);

            const gridHTML = `
                <div style="display: grid; grid-template-columns: repeat(${gridSize}, 1fr); gap: 0.5rem; font-size: 1.5rem; font-family: sans-serif; line-height: 1; text-align: center; margin-top: 1rem; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
                    ${gridItems.map(letter => `<span>${letter}</span>`).join('')}
                </div>`;
            
            question = `Griddeki tüm <b>'${target}'</b> harflerini bul ve daire içine al.`;
            answer = `${targetCount} tane '${target}' harfi.`;
            question = `<div style="text-align: center;">${question}${gridHTML}</div>`;

        } else { // type === 'word'
            const wordPool = wordPairs[wordComplexity as keyof typeof wordPairs];
            const [target, distractor] = wordPool[getRandomInt(0, wordPool.length - 1)];

            const wordCount = 12;
            const targetCount = 4;

            const words = shuffleArray([
                ...Array(targetCount).fill(target),
                ...Array(wordCount - targetCount).fill(distractor)
            ]);
            
            const wordCloudHTML = `
                <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 1rem; font-size: 1.25rem; margin-top: 1rem; padding: 1rem; border: 1px solid #ccc; border-radius: 4px; line-height: 1.5;">
                    ${words.map(word => `<span>${word}</span>`).join('')}
                </div>
            `;
            question = `Tüm <b>'${target}'</b> kelimelerini bul ve işaretle.`;
            answer = `${targetCount} tane '${target}' kelimesi.`;
            question = `<div style="text-align: center;">${question}${wordCloudHTML}</div>`;
        }
    } 
    else { // task === 'odd-one-out'
        if (type === 'letter') {
            const pairs: Record<string, [string, string]> = {
                'b-d': ['b', 'd'], 'p-q': ['p', 'q'], 'm-n': ['m', 'n'], 's-z': ['s', 'z'], 'f-v': ['f', 'v'], 'g-ğ': ['g', 'ğ']
            };
            const allPairs = Object.values(pairs);
            const [char1, char2] = targetPair === 'mixed' ? allPairs[getRandomInt(0, allPairs.length - 1)] : pairs[targetPair];
            
            const rowLength = 7;
            const oddOneOutIndex = getRandomInt(0, rowLength - 1);
            const rowItems = Array(rowLength).fill(char1).map((char, index) => index === oddOneOutIndex ? char2 : char);

            const rowHTML = `
                <div style="display: flex; justify-content: center; gap: 1rem; font-size: 2rem; font-family: sans-serif; letter-spacing: 0.2em; margin-top: 1rem; padding: 1rem; border: 1px solid #ccc; border-radius: 4px;">
                    ${rowItems.join('')}
                </div>
            `;
            question = `Sıradaki farklı harfi bul ve işaretle.`;
            answer = char2;
            question = `<div style="text-align: center;">${question}${rowHTML}</div>`;

        } else { // type === 'word'
            const wordPool = wordPairs[wordComplexity as keyof typeof wordPairs];
            const [target, distractor] = wordPool[getRandomInt(0, wordPool.length - 1)];

            const rowLength = 5;
            const oddOneOutIndex = getRandomInt(0, rowLength - 1);
            const rowItems = Array(rowLength).fill(target).map((word, index) => index === oddOneOutIndex ? distractor : word);
            
             const rowHTML = `
                <div style="display: flex; justify-content: center; gap: 1rem; font-size: 1.25rem; margin-top: 1rem; padding: 1rem; border: 1px solid #ccc; border-radius: 4px;">
                    ${rowItems.map(word => `<span>${word}</span>`).join('')}
                </div>
            `;
            question = `Sıradaki farklı kelimeyi bul ve işaretle.`;
            answer = distractor;
            question = `<div style="text-align: center;">${question}${rowHTML}</div>`;
        }
    }
    
    return { problem: { question, answer, category: 'dyslexia', display: 'flow' }, title };
};

const generateMapReadingLocal = (settings: any): { problem: Problem; title: string, preamble: string } => {
    const { mapType, task } = settings;
    const map = maps.find(m => m.id === mapType)!;
    const preamble = `${map.name}'nı incele ve soruyu cevapla.`;
    const title = "Harita Okuma";
    let question = "", answer = "";

    const mapSVG = `<div style="position: relative; width: 300px; height: 200px; border: 2px solid #ccc; background: #f0f9ff; border-radius: 8px; margin: auto;">
        ${map.locations.map(loc => `<div style="position: absolute; left: ${loc.x}%; top: ${loc.y}%; transform: translate(-50%, -50%); text-align: center;">
            <span style="font-size: 1.5rem;">${loc.icon}</span>
            <span style="font-size: 0.6rem; display: block;">${loc.name}</span>
        </div>`).join('')}
    </div>`;

    if (task === 'find-place') {
        const target = map.locations[getRandomInt(0, map.locations.length-1)];
        question = `Haritada <b>${target.name}</b>'yı ${target.icon} bul ve işaretle.`;
        answer = target.name;
    } else { // follow-directions
        const [start, end] = shuffleArray(map.locations).slice(0, 2);
        question = `<b>${start.name}</b>'dan <b>${end.name}</b>'a giden yolu çiz.`;
        answer = "Yol çizimi";
    }

    return { problem: { question: `${mapSVG}<br/>${question}`, answer, category: 'dyslexia' }, title, preamble };
};

export const generateDyslexiaProblem = async (subModuleId: DyslexiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, preamble?: string, error?: string }> => {
    
    // FIX: Updated module IDs to match DyslexiaSubModuleType.
    const aiModules: DyslexiaSubModuleType[] = ['sound-wizard', 'reading-fluency-coach', 'comprehension-explorer', 'vocabulary-explorer', 'word-hunter', 'spelling-champion', 'auditory-writing', 'interactive-story'];

    if (aiModules.includes(subModuleId)) {
        return generateDyslexiaAIProblem(subModuleId, settings, count);
    }
    
    // For local generation
    let problems: Problem[] = [];
    let title = 'Disleksi Alıştırması';
    let preamble: string | undefined = undefined;

    for(let i=0; i < count; i++) {
        let result: { problem: Problem; title: string; preamble?: string };
        // FIX: Updated case statements to match DyslexiaSubModuleType.
        switch(subModuleId) {
             case 'sound-wizard':
                result = generateSoundWizardLocal(settings);
                break;
            case 'letter-detective':
                result = generateLetterDetectiveLocal(settings);
                break;
            case 'visual-master':
                result = generateVisualMasterLocal(settings);
                break;
            case 'memory-gamer':
                result = generateMemoryGamerLocal(settings);
                break;
            case 'attention-question':
                result = generateAttentionQuestionLocal(settings);
                break;
            case 'map-reading':
                result = generateMapReadingLocal(settings);
                break;
            // Add other local generators here
            default:
                result = { 
                    problem: { question: `Bu alıştırma ('${subModuleId}') için yerel üreteç henüz tanımlanmadı.`, answer: "...", category: 'dyslexia' },
                    title: 'Bilinmeyen Modül'
                };
        }
        problems.push(result.problem);
        if(i === 0) {
            title = result.title;
            preamble = result.preamble;
        }
    }

    return { problems, title, preamble };
};