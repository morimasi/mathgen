// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import { Problem, DyslexiaSubModuleType, DyscalculiaSubModuleType, DysgraphiaSubModuleType } from '../types.ts';

// In a real scenario, this would be configured securely.
// For this environment, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "DUMMY_API_KEY" });


// --- PROMPT DEFINITIONS ---

const dysgraphiaPrompts: Record<string, (settings: any) => string> = {
    'listing-the-givens-ai': (settings: any) => `Generate a grade ${settings.gradeLevel} math word problem. The student's task is NOT to solve it, but to read the problem and list the important numbers and facts ('givens'). The problem should be simple, clear, and contain 2-3 key pieces of numerical information. Example: 'A basket has 5 red apples and 3 green apples. How many apples are there in total?' The student should list '5 red apples' and '3 green apples'.`,
    'step-by-step-scribe-ai': (settings: any) => `Create a simple ${settings.difficulty} level ${settings.operation} math problem that requires 2-3 steps to solve. Provide the solution steps as a numbered list, but leave blanks for the student to fill in the numbers and the final answer. The student's task is to copy and complete the solution steps. This helps with organizing written work. Example for '5 + 3': '1. Start with __. 2. Add __. 3. The answer is __.'`,
    'story-problem-creator-ai': (settings: any) => `Provide a very simple mathematical equation (e.g., '7 - 2 = 5'). The student's task is to write a short story problem based on this equation. The story should be related to the topic: '${settings.topic}'. Provide one simple example to guide the student.`,
};

// ... add prompts for dyslexia and dyscalculia as needed ...


// --- SERVICE FUNCTIONS ---

export const generateContextualWordProblems = async (module: string, settings: any): Promise<Problem[]> => {
    console.log(`Generating AI problems for ${module} with settings:`, settings);
    
    // This is a dummy implementation. In a real scenario, you would construct a prompt
    // based on the module and settings, then call the Gemini API.
    
    const dummyProblem: Problem = {
        question: `Bu, '${module}' modülü için yapay zeka tarafından oluşturulmuş bir deneme problemidir. 
                   Konu: ${settings.topic || 'Genel'}. 
                   Normalde burada, ayarlara uygun bir metin problemi yer alırdı.`,
        answer: "AI Cevabı",
        category: module,
        layout: settings.layout || 'default'
    };

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(Array(settings.problemsPerPage || 5).fill(dummyProblem));
        }, 300);
    });
};

export const generateDyslexiaAIProblem = async (subModuleId: DyslexiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, preamble?: string, error?: string }> => {
    console.log(`Generating AI problems for Dyslexia module ${subModuleId} with settings:`, settings);
     const dummyProblem: Problem = {
        question: `Bu, Disleksi/${subModuleId} için yapay zeka tarafından oluşturulmuş bir deneme problemidir. Normalde burada belirli bir egzersiz bulunurdu.`,
        answer: "AI Cevabı",
        category: 'dyslexia',
    };
     return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                problems: Array(count).fill(dummyProblem),
                title: `AI Alıştırması: ${subModuleId}`,
            });
        }, 300);
    });
};

export const generateDyscalculiaAIProblem = async (subModuleId: DyscalculiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    console.log(`Generating AI problems for Dyscalculia module ${subModuleId} with settings:`, settings);
    const dummyProblem: Problem = {
        question: `Bu, Diskalkuli/${subModuleId} için yapay zeka tarafından oluşturulmuş bir deneme problemidir. Normalde burada belirli bir egzersiz bulunurdu.`,
        answer: "AI Cevabı",
        category: 'dyscalculia',
    };
     return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                problems: Array(count).fill(dummyProblem),
                title: `AI Alıştırması: ${subModuleId}`,
            });
        }, 300);
    });
};

export const generateDysgraphiaAIProblem = async (subModuleId: DysgraphiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, preamble?: string, error?: string }> => {
    console.log(`Generating AI problems for Dysgraphia module ${subModuleId} with settings:`, settings);
    const promptGenerator = dysgraphiaPrompts[subModuleId];
    if (!promptGenerator) {
        return { problems: [], title: 'Hata', error: `Disgrafi alt modülü için AI promptu bulunamadı: ${subModuleId}` };
    }
    
    // This is a dummy implementation
    const dummyProblem: Problem = {
        question: `Bu, Disgrafi/${subModuleId} için yapay zeka tarafından oluşturulmuş bir deneme problemidir. Hedef, yapılandırılmış yazma becerisini desteklemektir.`,
        answer: "AI Cevabı",
        category: 'dysgraphia',
    };

     return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                problems: Array(count).fill(dummyProblem),
                title: `AI Alıştırması: ${subModuleId}`,
            });
        }, 300);
    });
};