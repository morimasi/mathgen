import { Problem, DysgraphiaSubModuleType, DysgraphiaSettings } from '../types';
import { generateSpecialAIProblem } from './geminiService';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// --- DATA & HELPERS ---
const TRACE_PATHS: { [key: string]: string } = {
    line: 'M 20 50 H 180',
    wave: 'M 20 50 Q 60 20, 100 50 T 180 50',
    zigzag: 'M 20 50 L 60 20 L 100 50 L 140 20 L 180 50',
    square: 'M 50 20 H 150 V 120 H 50 Z',
    circle: 'M 100 70 A 50 50 0 1 1 100 69.9', // a slightly broken circle to avoid closing path issues
    triangle: 'M 100 20 L 180 120 L 20 120 Z'
};

const LETTER_PATHS: { [key: string]: { path: string, viewBox: string } } = {
    'a': { path: 'M 40 90 A 25 25 0 1 1 40 40 L 40 90', viewBox: '0 0 80 100'},
    'b': { path: 'M 20 10 L 20 90 M 20 50 A 20 20 0 1 1 20 90', viewBox: '0 0 60 100'},
    'c': { path: 'M 60 40 A 25 25 0 1 1 60 90', viewBox: '0 0 80 100'},
    // ... add more letters as needed
};

// --- SUB-MODULE GENERATORS ---

const generateFineMotorProblem = (settings: DysgraphiaSettings['fineMotorSkills']): { problem: Problem; title: string } => {
    const { type } = settings;
    const title = 'İnce Motor Becerileri';
    let pathData = '';
    let viewBox = '0 0 200 100';

    switch(type) {
        case 'line-trace': pathData = TRACE_PATHS.line; break;
        case 'shape-trace': pathData = TRACE_PATHS.circle; break;
        case 'maze': 
            // Maze generation is complex, return a placeholder
            return { problem: { question: 'Bu alıştırma türü henüz tamamlanmadı.', answer: '...', category: 'dysgraphia-fine-motor' }, title };
    }
    
    const question = `
        <p>Aşağıdaki çizgiyi takip ederek çiziniz.</p>
        <svg viewBox="${viewBox}" style="width: 100%; height: 150px;">
            <path d="${pathData}" stroke="#ccc" stroke-width="10" stroke-linecap="round" stroke-dasharray="0.1 14" fill="none" />
            <path d="${pathData}" stroke="black" stroke-width="2" stroke-dasharray="4 4" fill="none" />
        </svg>
    `;

    return { problem: { question, answer: "Çizimi tamamla", category: 'dysgraphia-fine-motor' }, title };
};

const generateLetterFormationProblem = (settings: DysgraphiaSettings['letterFormation']): { problem: Problem; title: string } => {
    const { letter } = settings;
    const title = 'Harf Şekillendirme';
    const letterData = LETTER_PATHS[letter.toLowerCase()];
    if (!letterData) {
        return { problem: { question: 'Seçilen harf için çizim yolu bulunamadı.', answer: '', category: 'dysgraphia-error' }, title };
    }
    
    const question = `
        <p>Aşağıdaki <strong>'${letter}'</strong> harfini takip ederek çiziniz.</p>
        <svg viewBox="${letterData.viewBox}" style="width: 150px; height: 180px;">
            <path d="${letterData.path}" stroke="#ccc" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.1 14" fill="none" />
            <path d="${letterData.path}" stroke="black" stroke-width="2" stroke-dasharray="4 4" fill="none" />
        </svg>
    `;

    return { problem: { question, answer: "Çizimi tamamla", category: 'dysgraphia-letter-formation' }, title };
};

// --- MAIN EXPORTED FUNCTION ---

export const generateDysgraphiaProblem = async (
    subModule: DysgraphiaSubModuleType,
    settings: any,
    count: number
): Promise<{ problems: Problem[]; title: string; error?: string }> => {
    const isAIModule = ['picture-sequencing', 'writing-planning', 'creative-writing', 'interactive-story-dg'].includes(subModule);

    if (isAIModule) {
        try {
            const problems = await generateSpecialAIProblem(subModule, settings, count);
            const titleMap: { [key: string]: string } = {
                'picture-sequencing': 'Resim Sıralama Hikayecisi (AI)',
                'writing-planning': 'Yazı Planlama (AI)',
                'creative-writing': 'Yaratıcı Yazarlık (AI)',
                'interactive-story-dg': 'Uygulamalı Hikaye Macerası (AI)',
            };
            return { problems, title: titleMap[subModule] || 'Yapay Zeka Destekli Alıştırma' };
        } catch (e: any) {
            return { problems: [], title: 'Hata', error: e.message };
        }
    } else {
        const generatorMap: { [key: string]: (s: any) => { problem: Problem; title: string } } = {
            'fine-motor-skills': generateFineMotorProblem,
            'letter-formation': generateLetterFormationProblem,
            // ... other non-AI generators
        };
        
        const generator = generatorMap[subModule as keyof typeof generatorMap];
        if (!generator) {
             const placeholder = (title: string) => ({
                problem: { question: 'Bu alıştırma türü henüz tamamlanmadı.', answer: '...', category: `dysgraphia-${subModule}` },
                title
            });
            const results = Array.from({ length: count }, () => placeholder('Geliştiriliyor'));
            return {
                problems: results.map(r => r.problem),
                title: results[0]?.title || 'Disgrafi Alıştırması',
            };
        }

        try {
            const results = Array.from({ length: count }, () => generator(settings));
            return {
                problems: results.map(r => r.problem),
                title: results[0]?.title || 'Disgrafi Alıştırması',
            };
        } catch (e: any) {
             return { problems: [], title: 'Hata', error: `Problem oluşturulurken hata: ${e.message}` };
        }
    }
};
