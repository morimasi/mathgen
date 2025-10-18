import { Problem, DyslexiaSubModuleType, MapReadingSettings } from '../types';
import { generateDyslexiaAIProblem } from './geminiService';
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

const generateMapReadingLocal = (settings: MapReadingSettings): { problem: Problem; title: string } => {
    const { difficulty, questionCount, region } = settings;
    const title = "Harita Okuma Etkinliği";

    const regionNames: { [key: string]: string } = {
        turkey: "Türkiye",
        marmara: "Marmara Bölgesi",
        ege: "Ege Bölgesi",
        akdeniz: "Akdeniz Bölgesi",
        karadeniz: "Karadeniz Bölgesi",
        icanadolu: "İç Anadolu Bölgesi",
        doguanadolu: "Doğu Anadolu Bölgesi",
        guneydoguanadolu: "Güneydoğu Anadolu Bölgesi",
    };
    
    const availableCities = region === 'turkey' 
        ? cityData 
        : cityData.filter(c => c.region.toLowerCase().replace(/ /g, '') === region);

    if (availableCities.length === 0) {
        return { problem: { question: "Seçilen bölge için şehir bulunamadı.", answer: "Hata", category: 'dyslexia' }, title: "Hata" };
    }
    
    const getRandomCity = (filterFn?: (c: typeof cityData[0]) => boolean) => {
        const filtered = filterFn ? availableCities.filter(filterFn) : availableCities;
        return filtered.length > 0 ? filtered[getRandomInt(0, filtered.length - 1)] : availableCities[getRandomInt(0, availableCities.length - 1)];
    };

    const colors = ['kırmızı', 'mavi', 'yeşil', 'sarı', 'pembe', 'turuncu', 'mor', 'kahverengi'];
    const shapes = ['yıldız', 'üçgen', 'kare', 'daire'];

    const templates = {
        easy: [
            () => { const city = getRandomCity(); return `${city.name}'yı ${shuffleArray(colors)[0]} renge boya.` },
            () => { const city = getRandomCity(); return `${city.name}'nın üzerine bir ${shuffleArray(shapes)[0]} çiz.` },
            () => `Başkentimizi ${shuffleArray(colors)[0]} renge boya.`,
            () => { const city = getRandomCity(c => c.name.length > 8); return `Haritadan ${city.name} şehrini bul ve göster.`},
        ],
        medium: [
            () => { const letter = "AEIOU".charAt(getRandomInt(0,4)); return `'${letter}' harfi ile başlayan bir şehri ${shuffleArray(colors)[0]} renge boya.` },
            () => { const city = getRandomCity(c => c.neighbors.length > 0); const neighbor = cityData.find(c2 => c2.id === city.neighbors[0]); return `${city.name}'ya komşu olan ${neighbor?.name} şehrini ${shuffleArray(colors)[0]} renge boya.`},
            () => { const coast = shuffleArray(['Ege', 'Akdeniz', 'Karadeniz', 'Marmara'])[0]; return `${coast} Denizi'ne kıyısı olan bir şehri mavi renge boya.`},
            () => { const city = getRandomCity(); return `${city.name} şehrinin adındaki harf sayısını yaz.`},
            () => { const city = getRandomCity(c => c.neighbors.length >= 2); return `${city.name} şehrine komşu olan iki şehir bul ve sarıya boya.`}
        ],
        hard: [
             () => `Hiçbir denize kıyısı olmayan üç şehri mor renge boya.`,
             () => { const regionName = shuffleArray(Object.values(regionNames).filter(r => r !== 'Türkiye'))[0]; return `${regionName}'nden iki şehir seç ve üzerlerine çarpı (X) işareti koy.`},
             () => { const city1 = getRandomCity(c => c.coast !== null); let city2 = getRandomCity(c => c.coast !== null); while(city1.id === city2.id){ city2 = getRandomCity(c => c.coast !== null); } return `${city1.name}'dan ${city2.name}'a giden bir yol çiz.`; },
             () => { const city = getRandomCity(); const letter = city.name.charAt(1); return `İkinci harfi '${letter}' olan (ama ${city.name} olmayan) başka bir şehir bul ve yeşile boya.`},
             () => `Haritadaki en kalabalık şehri (İstanbul) kırmızıya, en doğudaki şehri (Hakkari) ise maviye boya.`,
        ]
    };

    const selectedTemplates = templates[difficulty];
    const generatedQuestions: string[] = [];
    const usedQuestions = new Set<string>();

    while(generatedQuestions.length < questionCount && generatedQuestions.length < 50) { // Safety break
        const templateFn = selectedTemplates[getRandomInt(0, selectedTemplates.length - 1)];
        const question = templateFn();
        if(!usedQuestions.has(question)) {
            generatedQuestions.push(question);
            usedQuestions.add(question);
        }
    }
    
    const questionListHTML = generatedQuestions.map(q => 
        `<li style="margin-bottom: 0.5em; display: flex; align-items: center; gap: 0.5em;"><input type="checkbox" style="width: 1.2em; height: 1.2em;" /><span>${q}</span></li>`
    ).join('');

    const mapSVG = getTurkeyMapSVG(region);

    const questionHTML = `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${mapSVG}
            <ul style="list-style: none; padding: 0; columns: 2; column-gap: 2rem;">
                ${questionListHTML}
            </ul>
        </div>
    `;

    return { problem: { question: questionHTML, answer: "Harita üzerinde tamamlandı", category: 'dyslexia', display: 'flow'}, title };
};


export const generateDyslexiaProblem = async (subModuleId: DyslexiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    
    const aiModules: DyslexiaSubModuleType[] = ['reading-fluency-coach', 'comprehension-explorer', 'vocabulary-explorer', 'interactive-story'];

    if (aiModules.includes(subModuleId)) {
        return generateDyslexiaAIProblem(subModuleId, settings, count);
    }
    
    // For local generation
    let problems: Problem[] = [];
    let title = 'Disleksi Alıştırması';

    // Practice sheets generate 1 problem per page count
    const iterationCount = ['map-reading'].includes(subModuleId) ? count : count;

    for(let i=0; i < iterationCount; i++) {
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
            case 'map-reading':
                result = generateMapReadingLocal(settings as MapReadingSettings);
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