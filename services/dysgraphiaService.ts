// services/dysgraphiaService.ts

import { Problem, DysgraphiaSubModuleType } from '../types';
import { generateDysgraphiaAIProblem } from './geminiService';

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

const generateFineMotorSkillsLocal = (settings: any): { problem: Problem, title: string } => {
    const { type } = settings;
    let question = "", answer = "Çizgileri takip et", title = "İnce Motor Becerileri";
    
    const svgStyle = 'stroke: #9ca3af; stroke-width: 10; stroke-dasharray: 2 4; stroke-linecap: round; fill: none;';
    
    switch(type) {
        case 'line-trace':
            const paths = [
                'M 20 50 H 180', // Düz çizgi
                'M 20 50 C 70 20, 130 80, 180 50', // Dalgalı
                'M 20 80 L 50 20 L 80 80 L 110 20 L 140 80 L 170 20', // Zikzak
            ];
            question = `<svg viewBox="0 0 200 100"><path d="${paths[getRandomInt(0, paths.length - 1)]}" style="${svgStyle}" /></svg>`;
            break;
        case 'shape-trace':
            const shapes = [
                'M 50 10 L 90 90 L 10 90 Z', // Üçgen
                'M 50 10 H 150 V 90 H 50 Z', // Kare
                'M 100 50 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0', // Daire
            ];
             question = `<svg viewBox="0 0 200 100"><path d="${shapes[getRandomInt(0, shapes.length - 1)]}" style="${svgStyle}" /></svg>`;
            break;
        case 'maze':
            // Simple maze path
            question = `<svg viewBox="0 0 200 200">
                <path d="M 10 10 H 190 V 190 H 10 V 10 M 10 50 H 150 V 10 M 50 50 V 150 H 190" stroke="black" stroke-width="5" fill="none" />
                <text x="20" y="30" font-size="20">🏁</text>
                <text x="170" y="170" font-size="20">🚩</text>
            </svg>`;
            title = "Labirent";
            answer = "Yolu bul";
            break;
    }
    return { problem: { question, answer, category: 'dysgraphia' }, title };
};

const generateLetterFormationLocal = (settings: any): { problem: Problem, title: string } => {
    const { letter, case: letterCase } = settings;
    const char = letterCase === 'upper' ? letter.toUpperCase() : letter.toLowerCase();
    const title = "Harf Yazma Alıştırması";

    const question = `
        <div style="border-bottom: 2px solid #ccc; border-top: 2px solid #ccc; height: 100px; position: relative;">
            <div style="border-bottom: 2px dashed #ccc; position: absolute; top: 50%; width: 100%;"></div>
            <p style="font-size: 80px; line-height: 100px; color: #d1d5db; font-family: sans-serif; padding-left: 20px;">
                ${char.repeat(4)}
            </p>
        </div>`;
    
    return { problem: { question, answer: `Yazarak tamamla`, category: 'dysgraphia' }, title };
};

const generateSentenceConstructionLocal = (settings: any): { problem: Problem, title: string } => {
    const { wordCount } = settings;
    const title = "Karışık Kelimelerden Cümle Kurma";
    const sentences: {[key: number]: string[]} = {
        3: ["kedi süt içti", "ali topu at"],
        4: ["ayşe okula gidiyor", "köpek hızlı koştu"],
        5: ["küçük çocuk parkta oynadı", "annem lezzetli kek yaptı"],
    };
    const sentence = sentences[wordCount as 3|4|5]?.[getRandomInt(0, 1)] || "cümle bulunamadı";
    const words = sentence.split(' ');
    const shuffled = shuffleArray(words).join(' - ');

    const question = `Bu kelimeleri kullanarak anlamlı bir cümle oluştur: <br/><b style="font-size: 1.5rem;">${shuffled}</b>`;
    const answer = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";

    return { problem: { question, answer, category: 'dysgraphia' }, title };
};


export const generateDysgraphiaProblem = async (subModuleId: DysgraphiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    
    const aiModules: DysgraphiaSubModuleType[] = ['picture-sequencing', 'writing-planning', 'creative-writing', 'interactive-story-dg'];

    if (aiModules.includes(subModuleId)) {
        return generateDysgraphiaAIProblem(subModuleId, settings, count);
    }
    
    // For local generation
    let problems: Problem[] = [];
    let title = 'Disgrafi Alıştırması';

    for(let i=0; i < count; i++) {
        let result: { problem: Problem; title: string; };
        switch(subModuleId) {
            case 'fine-motor-skills':
                result = generateFineMotorSkillsLocal(settings);
                break;
            case 'letter-formation':
                result = generateLetterFormationLocal(settings);
                break;
            case 'sentence-construction':
                result = generateSentenceConstructionLocal(settings);
                break;
            // Add other local generators here
            default:
                result = { 
                    problem: { question: `Bu alıştırma ('${subModuleId}') için yerel üreteç henüz tanımlanmadı.`, answer: "...", category: 'dysgraphia' },
                    title: 'Bilinmeyen Modül'
                };
        }
        problems.push(result.problem);
        if(i === 0) title = result.title;
    }

    return { problems, title };
};
