// services/dysgraphiaService.ts

import { Problem, DysgraphiaSubModuleType } from './types.ts';
import { generateDysgraphiaAIProblem } from './geminiService.ts';

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

const generateFineMotorSkillsLocal = (settings: any): { problem: Problem, title: string } => {
    const { type } = settings;
    let title = "İnce Motor Becerileri";
    let question = "", answer = "Çizgileri takip et.";

    switch(type) {
        case 'line-trace':
            const paths = [
                "M 10 20 C 50 0, 100 40, 140 20", // Wavy
                "M 10 20 L 40 20 L 40 50 L 70 50 L 70 20 L 100 20 L 100 50 L 130 50", // Square wave
                "M 10 50 L 30 20 L 50 50 L 70 20 L 90 50 L 110 20 L 130 50", // Zig-zag
            ];
            question = `<p>Kalemini kaldırmadan kesik çizgileri birleştir.</p>
                        <svg viewBox="0 0 150 60" class="trace-svg">
                            <path d="${paths[getRandomInt(0, paths.length-1)]}" stroke-dasharray="4" stroke="#aaa" stroke-width="2" fill="none"/>
                        </svg>`;
            break;
        case 'shape-trace':
            const shapes = ['circle', 'rect', 'polygon'];
            const shape = shapes[getRandomInt(0, shapes.length-1)];
            let shapeSvg = '';
            if (shape === 'circle') shapeSvg = `<circle cx="75" cy="30" r="25"`;
            else if (shape === 'rect') shapeSvg = `<rect x="50" y="5" width="50" height="50"`;
            else shapeSvg = `<polygon points="75,5 100,55 50,55"`;

            question = `<p>Şeklin üzerinden kalemle git.</p>
                        <svg viewBox="0 0 150 60" class="trace-svg">
                           ${shapeSvg} stroke-dasharray="4" stroke="#aaa" stroke-width="2" fill="none"/>
                        </svg>`;
            break;
        case 'maze':
            question = `<p>Farenin peynire ulaşmasına yardım et.</p>
                        <svg viewBox="0 0 100 100" class="maze-svg">
                            <text x="5" y="15">🐭</text><text x="80" y="90">🧀</text>
                            <path d="M 10 10 H 90 V 90 H 10 Z M 10 10 V 30 M 10 50 H 30 V 70 H 50 V 50 H 70 V 30 H 50 V 10 M 30 30 H 70 M 30 70 V 90 M 50 90 H 90" 
                            stroke="black" stroke-width="3" fill="none"/>
                        </svg>`;
            break;
    }
    return { problem: { question, answer, category: 'dysgraphia' }, title };
};


export const generateDysgraphiaProblem = async (subModuleId: DysgraphiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, preamble?: string, error?: string }> => {
    
    const aiModules: DysgraphiaSubModuleType[] = ['picture-sequencing', 'writing-planning', 'creative-writing', 'interactive-story-dg'];

    if (aiModules.includes(subModuleId)) {
        return generateDysgraphiaAIProblem(subModuleId, settings, count);
    }
    
    let problems: Problem[] = [];
    let title = 'Disgrafi Alıştırması';
    let preamble: string | undefined = undefined;

    for(let i=0; i < count; i++) {
        let result: { problem: Problem; title: string; preamble?: string };
        switch(subModuleId) {
             case 'fine-motor-skills':
                result = generateFineMotorSkillsLocal(settings);
                break;
            // Add other local generators here
            default:
                result = { 
                    problem: { question: `Bu alıştırma ('${subModuleId}') için yerel üreteç henüz tanımlanmadı.`, answer: "...", category: 'dysgraphia' },
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