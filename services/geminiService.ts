// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { Problem, DyslexiaSubModuleType, DyscalculiaSubModuleType, DysgraphiaSubModuleType } from '../types.ts';

// In a real scenario, this would be configured securely.
// For this environment, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "DUMMY_API_KEY" });

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
const dyslexiaPrompts: Record<string, (settings: any, count: number) => string> = {
    'reading-fluency-coach': (settings: any, count: number) => `Act as a special education teacher. Generate ${count} short, simple, and phonetically regular Turkish texts suitable for a grade ${settings.gradeLevel} student with dyslexia to practice reading fluency. The topic should be '${settings.topic}'. The texts should not contain complex sentences or rare words. Format as a JSON array of objects, each with "question" (the text to read) and "answer" (a simple confirmation like "Okuma metni").`,
    'comprehension-explorer': (settings: any, count: number) => `Act as a reading specialist. Generate ${count} Turkish story of '${settings.textLength}' length for a grade ${settings.gradeLevel} student. After each story, create one comprehension question about the '${settings.questionType}'. The language should be clear and direct. Format as a JSON array of objects, each with "question" (the story followed by the question) and "answer" (the correct answer to the question).`,
    'vocabulary-explorer': (settings: any, count: number) => `Act as a lexicographer for children. Generate ${count} Turkish vocabulary words appropriate for a grade ${settings.gradeLevel} student at a '${settings.difficulty}' difficulty level. For each word, provide its simple meaning and an example sentence. Format as a JSON array of objects, each with "question" (the word in bold, followed by its meaning and example sentence) and "answer" (just the word itself).`,
    'word-hunter': (settings: any, count: number) => `Act as a Turkish language teacher. Create ${count} exercises for morphological awareness focusing on '${settings.focus}'. Provide a word and ask the student to identify the specified part. The difficulty should be '${settings.difficulty}'. Format as a JSON array of objects, each with "question" (the instruction and the word) and "answer" (the correct root, prefix, or suffix). Example for suffix: Q: "'kitaplık' kelimesindeki eki bulun." A: "-lık".`,
    'spelling-champion': (settings: any, count: number) => `Create ${count} Turkish spelling exercises of '${settings.difficulty}' difficulty focusing on '${settings.category}'. The task is to identify the correctly spelled word from a pair. Format as a JSON array of objects, each with "question" (e.g., "Hangisi doğru: 'herkez' mi, 'herkes' mi?") and "answer" (the correct word).`,
    'auditory-writing': (settings: any, count: number) => `Generate ${count} Turkish auditory writing (dictation) prompts. The prompt type is '${settings.type}' and difficulty is '${settings.difficulty}'. The AI's role is to provide the text to be dictated. Format as a JSON array of objects, each with "question" (e.g., "Dinle ve yaz: 'kedi'") and "answer" (the word/sentence to be dictated, which is 'kedi'). The user interface will handle the audio part.`,
    'interactive-story': (settings: any, count: number) => `Act as an interactive storyteller. Create the beginning of ${count} 'choose your own adventure' story in Turkish. The genre is '${settings.genre}' and it's for a grade ${settings.gradeLevel} student. The story should end with a choice for the reader. Format as a JSON array of objects, each with "question" (the story segment with choices) and "answer" (a logical continuation for one of the choices).`
};

const dyscalculiaPrompts: Record<string, (settings: any, count: number) => string> = {
    'problem-solving': (settings: any, count: number) => `Act as a special education math teacher. Create ${count} very simple, single-step Turkish math word problems for a grade ${settings.gradeLevel} student with dyscalculia. Use clear, direct language and simple numbers. Avoid distracting information. The topic is '${settings.topic}'. Format as a JSON array of objects, each with "question" and "answer".`,
    'interactive-story-dc': (settings: any, count: number) => `Act as an interactive storyteller for a child with dyscalculia. Create the beginning of ${count} story set in a '${settings.genre}' for a grade ${settings.gradeLevel} student. The story must include a simple, clear mathematical choice (e.g., counting, comparing small numbers). Format as a JSON array of objects, each with "question" (the story segment with choices) and "answer" (a logical continuation for one of the choices).`
};

const dysgraphiaPrompts: Record<string, (settings: any, count: number) => string> = {
    'listing-the-givens-ai': (settings: any, count: number) => `Generate ${count} grade ${settings.gradeLevel} Turkish math word problems. The student's task is NOT to solve it, but to read the problem and list the important numbers and facts ('givens'). The problem should be simple, clear, and contain 2-3 key pieces of numerical information. Format as a JSON array of objects, with "question" being the word problem, and "answer" being the list of 'givens'. Example: Q: 'Bir sepette 5 kırmızı elma ve 3 yeşil elma var. Toplam kaç elma vardır?' A: 'Verilenler: 5 kırmızı elma, 3 yeşil elma'.`,
    'step-by-step-scribe-ai': (settings: any, count: number) => `Create ${count} simple ${settings.difficulty} level ${settings.operation} Turkish math problems that require 2-3 steps to solve. Provide the solution steps as a numbered list, but leave blanks for the student to fill in the numbers and the final answer. The student's task is to copy and complete the solution steps. This helps with organizing written work. Format as a JSON array of objects, each with a "question" (the problem and the fill-in-the-blank steps) and an "answer" (the completed steps). Example for '5 + 3': Q: "Problem: 5 + 3 = ?\n1. __ ile başla.\n2. __ ekle.\n3. Sonuç __.'\nA: '1. 5 ile başla. 2. 3 ekle. 3. Sonuç 8.'`,
    'story-problem-creator-ai': (settings: any, count: number) => `Provide ${count} simple mathematical equations (e.g., '7 - 2 = 5') of '${settings.difficulty}' difficulty. The student's task is to write a short story problem based on this equation, related to the topic: '${settings.topic}'. Provide one simple example in the question to guide the student. Format as a JSON array of objects, where "question" is the instruction and the equation, and "answer" is a sample story problem.`,
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

    const prompt = promptGenerator(settings, count);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
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
    
    let prompt = `You are a creative and helpful primary school teacher in Turkey. Your task is to generate ${settings.problemsPerPage * settings.pageCount} math word problems. `;

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
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
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

export const generateDyslexiaAIProblem = (subModuleId: DyslexiaSubModuleType, settings: any, count: number) => {
    return generateSpecialLearningAIProblem(dyslexiaPrompts, subModuleId, settings, count);
};

export const generateDyscalculiaAIProblem = (subModuleId: DyscalculiaSubModuleType, settings: any, count: number) => {
    return generateSpecialLearningAIProblem(dyscalculiaPrompts, subModuleId, settings, count);
};

export const generateDysgraphiaAIProblem = (subModuleId: DysgraphiaSubModuleType, settings: any, count: number) => {
    return generateSpecialLearningAIProblem(dysgraphiaPrompts, subModuleId, settings, count);
};
