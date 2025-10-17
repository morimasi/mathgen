// services/dyslexiaService.ts
import { Problem, DyslexiaSubModuleType, DyslexiaSettings } from '../types';
// FIX: The imported function 'generateDyslexiaAIProblem' does not exist.
// The error hint suggests 'generateSpecialAIProblem', which is correct.
import { generateSpecialAIProblem } from './geminiService';

// --- HELPER FUNCTIONS & DATA ---
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
const getRandomElement = <T,>(arr: T[]): T => arr[getRandomInt(0, arr.length - 1)];


// --- WORD/DATA LISTS for NON-AI Modules ---
const wordData = {
    rhymes: { at: ['yat', 'kat', 'sat', 'bat'], el: ['gel', 'sel', 'yel', 'bel'], al: ['kal', 'sal', 'dal', 'çal'], on: ['son', 'ton', 'don'] },
    distractors: ['koş', 'git', 'top', 'su', 'taş', 'ye', 'mor', 'ev', 'yol'],
    syllables: ['araba', 'kelebek', 'okul', 'ev', 'öğretmen', 'kitaplık', 'matematik', 'türkiye'],
    blends: { 's-es': 'ses', 'b-al': 'bal', 'k-ol': 'kol', 'g-el': 'gel', 't-op': 'top' },
    letterGroups: {
        vowels: ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'],
        common_consonants: ['m', 't', 'k', 'l', 'n', 'r'],
        tricky_consonants: ['b', 'd', 'p', 'g', 'ğ', 'c', 'ç'],
    },
    wordsByLetter: {
        a: ['ayva', 'ana', 'ata'], b: ['balon', 'baba', 'bebek'], d: ['dede', 'ders', 'davul'], e: ['elma', 'etek', 'ev'], k: ['kedi', 'kale', 'kapı'],
    },
    visualPairs: {
        'b-d': { target: 'd', distractors: 'bbdbdbbdbdbdbbddbbd' },
        'p-q': { target: 'q', distractors: 'pqpqppqpqqppqpqqpqp' },
        'm-n': { target: 'n', distractors: 'mnmmnnmnmnmnnnmmnnm' },
        'ev-ve': { target: 've', distractors: ['ev', 've', 'ev', 'ev', 've', 'ev', 've', 've'] },
        'yok-koy': { target: 'koy', distractors: ['yok', 'yok', 'koy', 'yok', 'koy', 'koy', 'yok'] },
        'kar-rak': { target: 'rak', distractors: ['kar', 'rak', 'kar', 'rak', 'rak', 'kar', 'kar'] },
    },
    rootsAndSuffixes: {
        'gözlük': { root: 'göz', suffix: '-lük' }, 'simitçi': { root: 'simit', suffix: '-çi' }, 'tuzluk': { root: 'tuz', suffix: '-luk' },
        'koşucu': { root: 'koş', suffix: '-ucu' }, 'evsiz': { root: 'ev', suffix: '-siz' }, 'yolcu': { root: 'yol', suffix: '-cu' },
    },
    commonErrors: { 'herkes': 'herkez', 'yalnız': 'yanlız', 'yanlış': 'yanlış', 'şoför': 'şöför', 'sürpriz': 'sürypriz' },
    sentences: ['Ali topu at.', 'Ayşe ip atla.', 'Okul çok güzel.'],
};


// --- SUB-MODULE GENERATORS ---

const generateSoundWizardProblem = (settings: DyslexiaSettings['soundWizard']): { problem: Problem; title: string } => {
    let problem: Problem = { question: '', answer: '', category: 'dyslexia-sound-wizard' };
    let title = 'Ses Büyücüsü';

    switch (settings.type) {
        case 'rhyme':
            title = 'Kafiyeli Kelimeleri Bulma';
            const rhymeKeys = Object.keys(wordData.rhymes);
            const key = getRandomElement(rhymeKeys);
            const targetWord = getRandomElement(wordData.rhymes[key as keyof typeof wordData.rhymes]);
            const options = shuffleArray([...wordData.rhymes[key as keyof typeof wordData.rhymes].filter(w => w !== targetWord), ...shuffleArray(wordData.distractors).slice(0, 2)]);
            problem.question = `Aşağıdakilerden hangisi <strong>${targetWord}</strong> ile kafiyelidir?<br/><br/>${options.map(o => `[ ] ${o}`).join('<br/>')}`;
            problem.answer = `"${key}" ile biten kelime.`;
            break;
        case 'syllable':
            title = 'Hece Sayma';
            const word = getRandomElement(wordData.syllables);
            const vowelCount = (word.match(/[aeıioöuü]/gi) || []).length;
            problem.question = `<strong>${word}</strong> kelimesi kaç heceden oluşur?`;
            problem.answer = String(vowelCount);
            break;
        case 'blend':
            title = 'Sesleri Birleştirme';
            const blendKeys = Object.keys(wordData.blends);
            const blendKey = getRandomElement(blendKeys);
            problem.question = `<strong>${blendKey}</strong> sesleri birleşince hangi kelime oluşur?`;
            problem.answer = wordData.blends[blendKey as keyof typeof wordData.blends];
            break;
    }
    return { problem, title };
};

const generateVisualMasterProblem = (settings: DyslexiaSettings['visualMaster']): { problem: Problem; title: string } => {
    const { type, pair } = settings;
    let problem: Problem = { question: '', answer: '', category: 'dyslexia-visual-master' };
    let title = 'Görsel Usta';

    // FIX: When 'pair' is 'mixed', the random selection must be constrained to the correct 'type' (letter or word).
    // The original code could pick a word-pair for a letter exercise, causing type errors.
    let pairKey: keyof typeof wordData.visualPairs;
    if (pair === 'mixed') {
        const letterPairs: (keyof typeof wordData.visualPairs)[] = ['b-d', 'p-q', 'm-n'];
        const wordPairs: (keyof typeof wordData.visualPairs)[] = ['ev-ve', 'yok-koy', 'kar-rak'];
        if (type === 'letter') {
            pairKey = getRandomElement(letterPairs);
        } else { // type === 'word'
            pairKey = getRandomElement(wordPairs);
        }
    } else {
        pairKey = pair as keyof typeof wordData.visualPairs;
    }

    const { target, distractors } = wordData.visualPairs[pairKey];

    if (type === 'letter') {
        title = 'Harfleri Ayırt Etme';
        // FIX on line 92 & 94: Cast 'distractors' to string, which is now guaranteed by the logic above.
        const grid = shuffleArray((distractors as string).split('')).join(' ');
        problem.question = `Aşağıdaki harfler arasından tüm <strong>'${target}'</strong> harflerini bulup daire içine al.<br/><br/><div style="font-size: 1.5rem; letter-spacing: 0.5em; line-height: 1.5; border: 1px solid; padding: 1rem; border-radius: 4px;">${grid}</div>`;
        problem.answer = `Toplam ${((distractors as string).match(new RegExp(target, 'g')) || []).length} tane.`;
    } else { // word
        title = 'Kelimeleri Ayırt Etme';
        // FIX on line 97 & 99: Cast 'distractors' to string[], which is now guaranteed by the logic above.
        const wordGrid = shuffleArray(distractors as string[]).join(' &nbsp; &nbsp; ');
        problem.question = `Aşağıdaki kelimeler arasından tüm <strong>'${target}'</strong> kelimelerini bulup daire içine al.<br/><br/><div style="font-size: 1.5rem; line-height: 1.75;">${wordGrid}</div>`;
        problem.answer = `Toplam ${(distractors as string[]).filter(w => w === target).length} tane.`;
    }
    return { problem, title };
};

const generateSpellingChampionProblem = (settings: DyslexiaSettings['spellingChampion']): { problem: Problem; title: string } => {
    let title = 'Yazım Şampiyonu';
    const correct = getRandomElement(Object.keys(wordData.commonErrors)) as keyof typeof wordData.commonErrors;
    const incorrect = wordData.commonErrors[correct];
    const options = shuffleArray([correct, incorrect]);
    const question = `Doğru yazılmış kelimeyi daire içine al.<br/><br/><div style="font-size: 1.5rem;">${options.join(' &nbsp; / &nbsp; ')}</div>`;
    const answer = correct;
    return { problem: { question, answer, category: 'dyslexia-spelling-champion' }, title };
};

const generateMemoryGamerProblem = (settings: DyslexiaSettings['memoryGamer']): { problem: Problem; title: string } => {
    const { type, sequenceLength } = settings;
    let title = 'Hafıza Oyuncusu';
    let sequence: (string | number)[] = [];
    let instruction = '';

    switch (type) {
        case 'digit_span':
            title = 'Rakam Dizisi Tekrarlama';
            instruction = 'Duyduğun rakamları sırasıyla yaz.';
            for (let i = 0; i < sequenceLength; i++) sequence.push(getRandomInt(0, 9));
            break;
        case 'word_sequence':
            title = 'Kelime Sırası Tekrarlama';
            instruction = 'Duyduğun kelimeleri sırasıyla yaz.';
            sequence = shuffleArray(wordData.distractors).slice(0, sequenceLength);
            break;
        case 'sentence_repeat':
            title = 'Cümle Tekrarlama';
            instruction = 'Duyduğun cümleyi yaz.';
            sequence = [getRandomElement(wordData.sentences)];
            break;
    }
    const question = `<p>${instruction}</p><div style="font-size: 2rem; margin-top: 1rem;">🗣️</div>`;
    const answer = sequence.join(' ');
    return { problem: { question, answer, category: 'dyslexia-memory-gamer' }, title };
};

const generateAuditoryWritingProblem = (settings: DyslexiaSettings['auditoryWriting']): { problem: Problem; title: string } => {
    const { type } = settings;
    const title = 'İşitsel Yazma (Dikte)';
    const instruction = 'Duyduğun kelimeyi/cümleyi yaz.';
    let answer = '';
    if (type === 'single_words') {
        answer = getRandomElement(wordData.syllables);
    } else {
        answer = getRandomElement(wordData.sentences);
    }
    const question = `<p>${instruction}</p><div style="font-size: 2rem; margin-top: 1rem;">🗣️</div>`;
    return { problem: { question, answer, category: 'dyslexia-auditory-writing' }, title };
};

// --- MAIN EXPORTED FUNCTION ---

export const generateDyslexiaProblem = async (
    subModule: DyslexiaSubModuleType,
    settings: any,
    count: number
): Promise<{ problems: Problem[]; title: string; error?: string }> => {
    const isAIModule = ['comprehension-explorer', 'vocabulary-explorer', 'interactive-story', 'reading-fluency-coach'].includes(subModule);

    if (isAIModule) {
        if (subModule === 'reading-fluency-coach') {
            return {
                problems: [{ question: 'Bu özellik geliştirme aşamasındadır.', answer: '...', category: 'dyslexia-reading-fluency-coach' }],
                title: 'Sesli Okuma Koçu',
            };
        }
        try {
            // FIX: The function call was incorrect. Changed to use the correctly imported 'generateSpecialAIProblem'.
            const problems = await generateSpecialAIProblem(subModule, settings, count);
            const titleMap: { [key: string]: string } = {
                'comprehension-explorer': 'Anlam Kâşifi (AI)',
                'vocabulary-explorer': 'Kelime Kâşifi (AI)',
                'interactive-story': 'Uygulamalı Hikaye Macerası (AI)',
            };
            return {
                problems,
                title: titleMap[subModule] || 'Yapay Zeka Destekli Alıştırma',
            };
        } catch (e: any) {
            return { problems: [], title: 'Hata', error: e.message };
        }
    } else {
        // Placeholder for other non-AI generators that are not fully implemented yet
        const notImplemented = (title: string) => ({ 
            problem: { question: 'Bu alıştırma türü henüz tamamlanmadı.', answer: '...', category: `dyslexia-${subModule}` },
            title
        });

        const generatorMap: { [key: string]: (s: any) => { problem: Problem; title: string } } = {
            'sound-wizard': generateSoundWizardProblem,
            'visual-master': generateVisualMasterProblem,
            'spelling-champion': generateSpellingChampionProblem,
            'memory-gamer': generateMemoryGamerProblem,
            'auditory-writing': generateAuditoryWritingProblem,
            // These are placeholders until fully implemented
            'letter-detective': () => notImplemented('Harf Dedektifi'),
            'word-hunter': () => notImplemented('Kelime Avcısı'),
        };
        
        const generator = generatorMap[subModule as keyof typeof generatorMap];
        if (!generator) {
            return { problems: [], title: 'Hata', error: `Bilinmeyen modül: ${subModule}` };
        }

        try {
            const results = Array.from({ length: count }, () => generator(settings));
            return {
                problems: results.map(r => r.problem),
                title: results[0]?.title || 'Disleksi Alıştırması',
            };
        } catch (e: any) {
             return { problems: [], title: 'Hata', error: `Problem oluşturulurken hata: ${e.message}` };
        }
    }
};