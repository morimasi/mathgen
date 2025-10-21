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

const generateVisualMasterLocal = (settings: any): { problem: Problem, title: string } => {
    const { type, pair } = settings;
    let title = "Görsel Usta";
    let question = "", answer = "";
    if (type === 'letter') {
        const [target, distractor] = pair.split('-');
        let grid = '';
        for (let i = 0; i < 20; i++) {
            grid += Math.random() < 0.3 ? target : distractor;
        }
        question = `Harflerin arasında <b>'${target}'</b> harfini bul ve daire içine al.<br/><div style="font-size: 1.5rem; letter-spacing: 0.5em;">${grid}</div>`;
        answer = `Daire içine alınmış '${target}' harfleri.`;
    }
    return { problem: { question, answer, category: 'dyslexia' }, title };
};

const generateMapReadingLocal = (settings: any): { problem: Problem, title: string, preamble: string } => {
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
    
    const aiModules: DyslexiaSubModuleType[] = ['reading-fluency-coach', 'comprehension-explorer', 'vocabulary-explorer', 'word-hunter', 'spelling-champion', 'auditory-writing', 'interactive-story'];

    if (aiModules.includes(subModuleId)) {
        return generateDyslexiaAIProblem(subModuleId, settings, count);
    }
    
    // For local generation
    let problems: Problem[] = [];
    let title = 'Disleksi Alıştırması';
    let preamble: string | undefined = undefined;

    for(let i=0; i < count; i++) {
        let result: { problem: Problem; title: string; preamble?: string };
        switch(subModuleId) {
             case 'sound-wizard':
                result = generateSoundWizardLocal(settings);
                break;
            case 'visual-master':
                result = generateVisualMasterLocal(settings);
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