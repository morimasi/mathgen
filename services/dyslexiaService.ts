// services/dyslexiaService.ts

import { Problem, DyslexiaSubModuleType } from '../types.ts';
import { generateDyslexiaAIProblem } from './geminiService.ts';
import { getTurkeyMapSVG } from './map/mapData.ts';

// --- UTILS ---
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// --- LOCAL GENERATOR FUNCTIONS ---

const generateAttentionQuestionsLocal = (settings: any): { problem: Problem; title: string } => {
    const title = "Dikkat Soruları";
    const { questionType, difficulty, numberRange } = settings;
    let question = '', answer = '';

    if (questionType === 'numerical') {
        const [min, max] = numberRange.split('-').map(Number);
        const target = getRandomInt(min, max);
        answer = String(target);
        let clues = [];
        if (target % 2 === 0) clues.push("Ben bir çift sayıyım."); else clues.push("Ben bir tek sayıyım.");
        clues.push(`Rakamlarımın toplamı ${String(target).split('').reduce((a, b) => a + Number(b), 0)}.`);
        if (difficulty !== 'easy') clues.push(`${target - getRandomInt(1, 5)}'den büyüğüm.`);
        if (difficulty === 'hard') clues.push(`Ben ${Math.floor(target/10)}0'dan büyüğüm.`);
        question = `Aşağıdaki ipuçlarını kullanarak beni bul:<br/><ul>${shuffleArray(clues).map(c => `<li>- ${c}</li>`).join('')}</ul>`;
    } else { // verbal
        const words = ['elma', 'armut', 'kalem', 'silgi', 'masa'];
        const target = words[getRandomInt(0, words.length-1)];
        answer = target;
        question = `Ben 5 harfli bir kelimeyim. 'e' harfi ile başlarım. Bir meyveyim. Ben neyim?`;
    }
    return { problem: { question, answer, category: 'dyslexia' }, title };
};

const generateVisualMasterLocal = (settings: any): { problem: Problem; title: string; } => {
    const title = "Görsel Usta";
    const { type, pair } = settings;
    const [char1, char2] = pair.split('-');

    const items = Array.from({ length: 40 }, () => Math.random() < 0.3 ? char1 : char2);
    if (type === 'word') {
        items.forEach((val, i) => {
            if (val === char1) items[i] = 'ev';
            if (val === char2) items[i] = 've';
        });
    }

    const question = `Aşağıdaki ${type === 'letter' ? 'harfler' : 'kelimeler'} arasında <b>'${type === 'letter' ? char1 : 'ev'}'</b> olanları bul ve daire içine al.<br/><div style="font-size: 1.5rem; letter-spacing: 0.5em; text-align: center; line-height: 1.7; margin-top: 0.5rem;">${items.join(' ')}</div>`;
    return { problem: { question, answer: `Daire içine alınmış '${type === 'letter' ? char1 : 'ev'}'`, category: 'dyslexia' }, title };
};

const generateMapReadingLocal = (settings: any): { problem: Problem; title: string; } => {
    const { region, questionCount, difficulty } = settings;
    const title = "Harita Okuma Etkinliği";
    const svg = getTurkeyMapSVG(region);

    const questions = [
        "Ankara'yı kırmızıya boya.",
        "İstanbul'un komşularından birini sarıya boya.",
        "Denize kıyısı olan 3 şehri maviye boya.",
        "İzmir'in güneyindeki şehri yeşile boya.",
        "Erzurum'un batısındaki bir şehri turuncuya boya."
    ].slice(0, questionCount);

    const question = `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${svg}
            <div>
                <h4 style="font-weight: bold;">Yönergeler:</h4>
                <ol style="list-style-type: decimal; list-style-position: inside; font-size: 0.9em;">
                    ${questions.map(q => `<li>${q}</li>`).join('')}
                </ol>
            </div>
        </div>`;
    
    return { problem: { question, answer: "Harita üzerinde yönergeler uygulanır.", category: 'dyslexia' }, title };
};

// ... other local generators can be added here ...

export const generateDyslexiaProblem = async (subModuleId: DyslexiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    
    // Modules that rely on AI generation
    const aiModules: DyslexiaSubModuleType[] = [
        'reading-fluency-coach', 
        'comprehension-explorer', 
        'vocabulary-explorer', 
        'interactive-story',
        'picture-sequencing', // Dysgraphia, but can be used here
        'writing-planning', // Dysgraphia, but can be used here
        'creative-writing' // Dysgraphia, but can be used here
    ];

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
                result = generateAttentionQuestionsLocal(settings);
                break;
            case 'visual-master':
                result = generateVisualMasterLocal(settings);
                break;
            case 'map-reading':
                // Map reading generates one large problem, not multiple small ones.
                result = generateMapReadingLocal(settings);
                problems.push(result.problem);
                return { problems, title: result.title }; // Exit early
            
            // Placeholder for other local modules
            case 'sound-wizard':
            case 'letter-detective':
            case 'word-hunter':
            case 'spelling-champion':
            case 'memory-gamer':
            case 'auditory-writing':
                 result = { 
                    problem: { question: `Bu alıştırma ('${subModuleId}') için yerel üreteç henüz tamamlanmadı.`, answer: "...", category: 'dyslexia' },
                    title: 'Bilinmeyen Modül'
                };
                break;
            default:
                result = { 
                    problem: { question: `Bilinmeyen alıştırma: '${subModuleId}'`, answer: "...", category: 'dyslexia' },
                    title: 'Bilinmeyen Modül'
                };
        }
        problems.push(result.problem);
        if(i === 0) title = result.title;
    }

    return { problems, title };
};
