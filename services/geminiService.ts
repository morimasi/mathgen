// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { Problem, DyscalculiaSubModuleType, DysgraphiaSubModuleType, DyslexiaSubModuleType } from '../types.ts';

// In a real scenario, this would be configured securely.
// For this environment, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "DUMMY_API_KEY" });

const systemInstruction = `Sen, ilkokul eğitimi için yüksek kaliteli, yaşa uygun eğitici materyaller,işlemler,sorular problemler oluşturma konusunda uzmanlaşmış profesyonel bir problem üreticisisin. Görevin, yalnızca Türkçe içerik üretmektir. Bu içerikleri üretirken tam bir eğitimci gibi sana verilen tüm görevleri profesyonel duzeyde yaparken Sorular, cevaplar, talimatlar ve örnekler dahil olmak üzere tüm çıktılar MUTLAKA Türkçe olmalıdır. Hiçbir İngilizce kelime veya ifade kullanma.`;

const problemSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: 'The math problem question text. This can include HTML for formatting.' },
      answer: { type: Type.STRING, description: 'The answer to the math problem.' },
    },
    required: ['question', 'answer'],
  },
};


// --- PROMPT DEFINITIONS ---
const dyscalculiaPrompts: Record<string, (settings: any, count: number) => string> = {
    'problem-solving': (settings: any, count: number) => `Create ${count} very simple, single-step Turkish math word problems for a grade ${settings.gradeLevel} student with dyscalculia. Use clear, direct language and simple numbers. Avoid distracting information. The topic is '${settings.topic}'. Format as a JSON array of objects, each with "question" and "answer".`,
    'interactive-story-dc': (settings: any, count: number) => `Create the beginning of ${count} story set in a '${settings.genre}' for a grade ${settings.gradeLevel} student. The story must be in Turkish. The story must include a simple, clear mathematical choice (e.g., counting, comparing small numbers). Format as a JSON array of objects, each with "question" (the story segment with choices) and "answer" (a logical continuation for one of the choices).`
};

const dysgraphiaPrompts: Record<string, (settings: any, count: number) => string> = {
    'listing-the-givens-ai': (settings: any, count: number) => `Generate ${count} grade ${settings.gradeLevel} Turkish math word problems. The student's task is NOT to solve it, but to read the problem and list the important numbers and facts ('givens'). The problem should be simple, clear, and contain 2-3 key pieces of numerical information. Format as a JSON array of objects, with "question" being the word problem, and "answer" being the list of 'givens'. Example: Q: 'Bir sepette 5 kırmızı elma ve 3 yeşil elma var. Toplam kaç elma vardır?' A: 'Verilenler: 5 kırmızı elma, 3 yeşil elma'.`,
    'step-by-step-scribe-ai': (settings: any, count: number) => `Create ${count} simple ${settings.difficulty} level ${settings.operation} Turkish math problems that require 2-3 steps to solve. Provide the solution steps as a numbered list, but leave blanks for the student to fill in the numbers and the final answer. The student's task is to copy and complete the solution steps. This helps with organizing written work. Format as a JSON array of objects, each with a "question" (the problem and the fill-in-the-blank steps) and an "answer" (the completed steps). Example for '5 + 3': Q: "Problem: 5 + 3 = ?\n1. __ ile başla.\n2. __ ekle.\n3. Sonuç __.'\nA: '1. 5 ile başla. 2. 3 ekle. 3. Sonuç 8.'`,
    'story-problem-creator-ai': (settings: any, count: number) => `Provide ${count} simple mathematical equations (e.g., '7 - 2 = 5') of '${settings.difficulty}' difficulty. The student's task is to write a short story problem based on this equation, related to the topic: '${settings.topic}'. Provide one simple example in the question to guide the student. The example and sample story must be in Turkish. Format as a JSON array of objects, where "question" is the instruction and the equation, and "answer" is a sample story problem.`,
};

// FIX: Added prompts for the Dyslexia AI modules.
const dyslexiaPrompts: Record<string, (settings: any, count: number) => string> = {
    'reading-fluency-coach': (settings: any, count: number) => `Create ${count} short Turkish reading passage(s) for a grade ${settings.gradeLevel} student. The topic is '${settings.topic}'. The text should be simple, with short sentences and common words, suitable for practicing reading fluency. Format as a JSON array of objects, each with "question" (the passage) and "answer" (a simple comprehension question about the passage).`,
    'comprehension-explorer': (settings: any, count: number) => `Generate ${count} ${settings.textLength} Turkish text passage(s) for a grade ${settings.gradeLevel} student. After the passage, create one multiple-choice question focusing on '${settings.questionType}'. Format as a JSON array of objects, where "question" contains the passage and the question, and "answer" contains the correct choice.`,
    'vocabulary-explorer': (settings: any, count: number) => `Generate ${count} ${settings.difficulty} level Turkish vocabulary words suitable for a grade ${settings.gradeLevel} student. For each word, provide its meaning and an example sentence. Format as a JSON array of objects, where "question" is the word and "answer" is 'Anlamı: [meaning]. Cümle: [example sentence]'.`,
    'word-hunter': (settings: any, count: number) => `Create ${count} ${settings.difficulty} level exercises focusing on the morphological component '${settings.focus}'. Provide a short sentence with a target word. The student's task is to identify the component. Format as a JSON array of objects, where "question" is the sentence (e.g., 'Kediler çok sevimlidir.') and "answer" is the identified component (e.g., 'Son ek: -ler').`,
    'spelling-champion': (settings: any, count: number) => `Generate ${count} ${settings.difficulty} level spelling exercises about '${settings.category}'. Present two options, one correct and one incorrect. The student must choose the correct one. Format as a JSON array of objects, where "question" is 'Hangisi doğru yazılmıştır: [option1] / [option2]?' and "answer" is the correct option.`,
    'auditory-writing': (settings: any, count: number) => `Generate ${count} ${settings.difficulty} level ${settings.type === 'single_words' ? 'Turkish words' : 'short Turkish sentences'} for a dictation (auditory writing) exercise. The teacher will read these aloud. Format as a JSON array of objects, where "question" is a placeholder like 'Dinle ve yaz.' and "answer" is the word/sentence to be read.`,
    'interactive-story': (settings: any, count: number) => `Create the beginning of ${count} interactive story in Turkish. Genre: '${settings.genre}'. Grade level: ${settings.gradeLevel}. The story must present two choices for the reader to continue. Format as a JSON array of objects, where "question" is the story part with the choices, and "answer" is a logical continuation for one of the choices.`,
};


// --- UNIFIED AI GENERATOR ---

const generateSpecialLearningAIProblem = async (
    prompts: Record<string, (settings: any, count: number) => string>,
    subModuleId: string,
    settings: any,
    count: number
): Promise<{ problems: Problem[], title: string, preamble?: string, error?: string }> => {
    
    console.log(`Generating AI problems for Special Learning module ${subModuleId} with settings:`, settings);
    const promptGenerator = prompts[subModuleId];

    if (!promptGenerator) {
        return { problems: [], title: 'Hata', error: `AI prompt for submodule '${subModuleId}' not found.` };
    }

    let prompt = promptGenerator(settings, count);
    
    // Add robustness instructions
    prompt += `\n\nIMPORTANT: Ensure the entire output is a single, valid JSON array of objects, strictly following the schema. Do not include any text before or after the JSON array. The language must be very simple and clear, suitable for a young child with learning difficulties. All content must be in Turkish.`;


    try {
        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: problemSchema
            },
        });

        const parsedProblems = JSON.parse(response.text);
        if (!Array.isArray(parsedProblems)) {
            throw new Error("AI response is not a valid array.");
        }
        
        const problems: Problem[] = parsedProblems.map((p: any) => ({
            question: p.question,
            answer: p.answer,
            category: subModuleId,
            display: 'flow',
        }));
        
        return { problems, title: `AI Alıştırması: ${subModuleId}` };

    } catch (error) {
        console.error(`Error generating AI content for ${subModuleId}:`, error);
        return { problems: [], title: 'Hata', error: `AI content generation failed for ${subModuleId}.` };
    }
};


// --- SERVICE FUNCTIONS ---

export const generateContextualWordProblems = async (module: string, settings: any): Promise<Problem[]> => {
    console.log(`Generating REAL AI problems for ${module} with settings:`, settings);
    
    let prompt = `Generate ${settings.problemsPerPage * settings.pageCount} math word problems. `;

    if (settings.customPrompt) {
        prompt = settings.customPrompt;
    } else {
        const moduleNames: { [key: string]: string } = {
            'arithmetic': 'four operations',
            'fractions': 'fractions',
            'decimals': 'decimals',
            'place-value': 'place value',
            'measurement': 'measurements',
            'geometry': 'geometry'
        };

        const subject = moduleNames[settings.sourceModule] || moduleNames[module] || 'general math';
        
        prompt += `The problems should be for a grade ${settings.gradeLevel} student. `;
        prompt += `They should focus on ${subject}. `;
        if(settings.topic) prompt += `The problems should be about the topic of '${settings.topic}'. `;
        prompt += `Each problem should require ${settings.operationCount} operation(s) to solve. `;
        if(settings.useVisuals) prompt += `Include relevant emojis in the problem text to make it more engaging. `;

        if (settings.layout === 'given-wanted') {
            prompt += `Phrase the problems so they are suitable for a 'Given / Wanted / Solution' format.`;
        } else if (settings.layout === 'with-visual-space') {
            prompt += `Phrase the problems in a way that might encourage the student to draw or visualize the solution.`;
        }
    }

    prompt += ` Format the output as a JSON array of objects, where each object has a "question" key (the problem text) and an "answer" key (the numerical answer with unit, or a short explanation).`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: problemSchema,
            },
        });
        
        const parsedProblems = JSON.parse(response.text);
         if (!Array.isArray(parsedProblems)) {
            throw new Error("AI response is not a valid array.");
        }

        return parsedProblems.map((p: any) => ({
            question: p.question,
            answer: String(p.answer),
            category: module,
            layout: settings.layout || 'default',
        }));

    } catch (error) {
        console.error("Error generating contextual word problems:", error);
        return [{
            question: "Yapay zeka ile problem oluşturulurken bir hata oluştu. Lütfen API anahtarınızı kontrol edin veya daha sonra tekrar deneyin.",
            answer: "Hata",
            category: module,
            layout: 'default'
        }];
    }
};

export const generateDyscalculiaAIProblem = (subModuleId: DyscalculiaSubModuleType, settings: any, count: number) => {
    return generateSpecialLearningAIProblem(dyscalculiaPrompts, subModuleId, settings, count);
};

export const generateDysgraphiaAIProblem = (subModuleId: DysgraphiaSubModuleType, settings: any, count: number) => {
    return generateSpecialLearningAIProblem(dysgraphiaPrompts, subModuleId, settings, count);
};

// FIX: Added the missing export for dyslexia AI problem generation.
export const generateDyslexiaAIProblem = (subModuleId: DyslexiaSubModuleType, settings: any, count: number) => {
    return generateSpecialLearningAIProblem(dyslexiaPrompts, subModuleId, settings, count);
};
