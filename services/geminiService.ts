
// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { Problem, DyscalculiaSubModuleType, DysgraphiaSubModuleType, DyslexiaSubModuleType, WordProblemSettings } from '../types.ts';
import { drawRuler, drawThermometer, drawBeaker } from './svgService.ts';

// In a real scenario, this would be configured securely.
// For this environment, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "DUMMY_API_KEY" });

const systemInstruction = `Sen, ilkokul çocukları için eğitici materyaller hazırlayan uzman bir eğitimci ve pedagog yapay zekasın. Temel görevin, sana verilen yönergeler doğrultusunda, yaşa uygun, ilgi çekici ve pedagojik açıdan sağlam matematik problemleri ve alıştırmaları oluşturmaktır.

**KRİTİK TALİMAT:** Herhangi bir içerik üretmeden ÖNCE, kendi kendine şu kontrolleri yapmalısın:
1.  **Yaşa Uygunluk:** "Bu problem, belirtilen sınıf seviyesindeki bir çocuğun anlayabileceği dilde mi? Kullanılan sayılar ve senaryo, onların bilişsel düzeyine uygun mu?"
2.  **Pedagojik Değer:** "Bu soru, hedeflenen matematiksel beceriyi etkili bir şekilde öğretiyor veya pekiştiriyor mu? Dikkat dağıtıcı veya kafa karıştırıcı unsurlar içeriyor mu?"
3.  **Açıklık ve Netlik:** "Sorunun ifadesi son derece açık ve anlaşılır mı? Herhangi bir belirsizlik var mı?"
4.  **Olumlu ve Teşvik Edici Dil:** "Kullanılan dil olumlu mu? Öğrenciyi korkutacak veya cesaretini kıracak ifadelerden arındırılmış mı?"

Bu iç denetim sürecinden geçirdiğin ve %100 onayladığın içeriği nihai çıktı olarak sun. Eğer bir talep bu kriterlere uymuyorsa, talebi bu kriterlere uyacak şekilde revize et ve en uygun eğitici materyali oluştur.

Tüm çıktılar (sorular, cevaplar, talimatlar, örnekler) **MUTLAKA Türkçe olmalıdır.** Hiçbir İngilizce kelime veya ifade kullanma, ancak resim oluşturma talimatları (\`visualPrompt\`) istenirse, bu talimatlar **İngilizce** olmalıdır.`;

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

const visualProblemSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: 'The math problem question text in Turkish.' },
        answer: { type: Type.STRING, description: 'The answer to the math problem in Turkish.' },
        visualPrompt: { 
            type: Type.STRING, 
            description: 'A detailed, descriptive prompt in ENGLISH for an image generation model. This prompt MUST describe the scene visually without mentioning any specific numbers or quantities from the problem. It should set the scene and atmosphere in a children\'s book illustration style. Example: "A child standing in front of a colorful fruit stand at a market, looking at red apples, cartoon style".' 
        },
      },
      required: ['question', 'answer', 'visualPrompt'],
    },
};

const technicalProblemSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: 'The math problem question text in Turkish. Refer to "the image" or "the figure below".' },
        answer: { type: Type.STRING, description: 'The answer to the math problem.' },
        technicalValue: { type: Type.NUMBER, description: 'The specific numerical value that should be displayed on the technical tool (e.g., 5 for 5cm, 20 for 20 degrees).' }
      },
      required: ['question', 'answer', 'technicalValue'],
    },
};

// Helper function for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to call Gemini API with retry logic
async function generateContentWithRetry(model: string, params: any, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            return await ai.models.generateContent({
                model: model,
                ...params
            });
        } catch (error: any) {
            // Check for rate limit (429) or service unavailable (503)
            const isRateLimit = error.status === 429 || (error.message && error.message.includes('429'));
            const isServerBusy = error.status === 503;

            if (isRateLimit || isServerBusy) {
                if (i === retries - 1) throw error; // Max retries reached

                // Exponential backoff: 2s, 4s, 8s
                const waitTime = 2000 * Math.pow(2, i);
                console.warn(`Gemini API rate limit/busy (Attempt ${i + 1}/${retries}). Retrying in ${waitTime}ms...`);
                await delay(waitTime);
                continue;
            }
            throw error; // Throw other errors immediately
        }
    }
}

const processVisualPrompts = async (problems: any[]): Promise<any[]> => {
    const imagePromises = problems.map(async (p: any) => {
        if (p.visualPrompt) {
            try {
                // Use gemini-2.5-flash-image for faster generation and to align with "flash" tier
                const imageResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                        parts: [{ text: `award-winning children's book illustration, simple, colorful, ${p.visualPrompt}` }]
                    },
                    config: {
                        imageConfig: {
                            aspectRatio: "1:1"
                        }
                    }
                });

                // Find the image part in the response
                let foundImage = false;
                const parts = imageResponse.candidates?.[0]?.content?.parts || [];
                for (const part of parts) {
                    if (part.inlineData) {
                        const base64ImageBytes = part.inlineData.data;
                        const mimeType = part.inlineData.mimeType || 'image/png';
                        const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
                        p.question = `<img src="${imageUrl}" alt="Problem görseli" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 1rem;" />${p.question}`;
                        foundImage = true;
                        break;
                    }
                }
                
                if (!foundImage) {
                    console.warn("No image found in gemini-2.5-flash-image response");
                }

            } catch (imgError) {
                console.error("Image generation failed, proceeding without image:", imgError);
            }
        }
        return p;
    });
    return Promise.all(imagePromises);
};

const processTechnicalSVGs = (problems: any[], domain: string): any[] => {
    return problems.map(p => {
        if (typeof p.technicalValue === 'number') {
            let svg = '';
            // Basic mapping based on domain
            if (domain === 'length') {
                // Draw a ruler showing the value
                svg = drawRuler(Math.ceil(p.technicalValue + 2), p.technicalValue, 'cm', 0);
                p.question = `<div style="margin-bottom:1em; display:flex; justify-content:center;">${svg}</div>` + p.question;
            } else if (domain === 'temperature') {
                svg = drawThermometer(p.technicalValue);
                p.question = `<div style="margin-bottom:1em; display:flex; justify-content:center;">${svg}</div>` + p.question;
            } else if (domain === 'capacity') {
                svg = drawBeaker(1000, p.technicalValue * 100); // Assume val is 1-10 scale mapped to 100-1000ml or similar
                p.question = `<div style="margin-bottom:1em; display:flex; justify-content:center;">${svg}</div>` + p.question;
            } else {
                // Default fallback for weight or unknown: just show the value in a box
                p.question = `<div style="border:2px solid #ccc; padding:10px; text-align:center; font-weight:bold; margin-bottom:10px;">Değer: ${p.technicalValue}</div>` + p.question;
            }
        }
        return p;
    });
};


// --- PROMPT DEFINITIONS ---
const dyscalculiaPrompts: Record<string, (settings: any, count: number) => string> = {
    'problem-solving': (settings: any, count: number) => `Create ${count} very simple, single-step Turkish math word problems for a grade ${settings.gradeLevel} student with dyscalculia. Use clear, direct language and simple numbers. Avoid distracting information. The topic is '${settings.topic}'. Format as a JSON array of objects, each with "question" and "answer".`,
    'interactive-story-dc': (settings: any, count: number) => {
        let prompt = `Create the beginning of ${count} story set in a '${settings.genre}' for a grade ${settings.gradeLevel} student. The story must be in Turkish. The story must include a simple, clear mathematical choice (e.g., counting, comparing small numbers).`;
        if (settings.generateImage) {
            prompt += ` For each story, also provide a "visualPrompt" field. This field must contain a detailed, descriptive prompt IN ENGLISH suitable for an image generation model. The visual prompt MUST NOT contain any numbers or clues to the mathematical answer. It should only describe the scene visually in a simple, colorful, cartoon style. For example, if the story is about 3 apples, the visual prompt could be "A child standing in front of a colorful fruit stand at a market, looking at red apples, cartoon style", NOT "A child looking at three apples".`;
        }
        return prompt;
    }
};

const dysgraphiaPrompts: Record<string, (settings: any, count: number) => string> = {
    'listing-the-givens-ai': (settings: any, count: number) => `Generate ${count} grade ${settings.gradeLevel} Turkish math word problems. The student's task is NOT to solve it, but to read the problem and list the important numbers and facts ('givens'). The problem should be simple, clear, and contain 2-3 key pieces of numerical information. Format as a JSON array of objects, with "question" being the word problem, and "answer" being the list of 'givens'. Example: Q: 'Bir sepette 5 kırmızı elma ve 3 yeşil elma var. Toplam kaç elma vardır?' A: 'Verilenler: 5 kırmızı elma, 3 yeşil elma'.`,
    'step-by-step-scribe-ai': (settings: any, count: number) => `Create ${count} simple ${settings.difficulty} level ${settings.operation} Turkish math problems that require 2-3 steps to solve. Provide the solution steps as a numbered list, but leave blanks for the student to fill in the numbers and the final answer. The student's task is to copy and complete the solution steps. This helps with organizing written work. Format as a JSON array of objects, each with a "question" (the problem and the fill-in-the-blank steps) and an "answer" (the completed steps). Example for '5 + 3': Q: "Problem: 5 + 3 = ?\n1. __ ile başla.\n2. __ ekle.\n3. Sonuç __.'\nA: '1. 5 ile başla. 2. 3 ekle. 3. Sonuç 8.'`,
    'story-problem-creator-ai': (settings: any, count: number) => `Provide ${count} simple mathematical equations (e.g., '7 - 2 = 5') of '${settings.difficulty}' difficulty. The student's task is to write a short story problem based on this equation, related to the topic: '${settings.topic}'. Provide one simple example in the question to guide the student. The example and sample story must be in Turkish. Format as a JSON array of objects, where "question" is the instruction and the equation, and "answer" is a sample story problem.`,
    'cursive-practice-ai': (settings: any, count: number) => `Generate ${count} simple Turkish ${settings.contentType} for cursive handwriting practice, suitable for a grade ${settings.difficulty === 'easy' ? 2 : 3} student. The words/sentences should be common and easy to write. Format as a JSON array of objects, where "question" and "answer" are both the plain text word/sentence to be practiced. Example for "elma": Q: 'elma', A: 'elma'.`,
    'sentence-unscramble-ai': (settings: any, count: number) => `Generate ${count} jumbled Turkish sentences for a grade ${settings.gradeLevel} student. The sentence length should be ${settings.sentenceLength === 'short' ? '3-4 words' : '5-6 words'}. The student's task is to write the words in the correct order. Format as a JSON array of objects, with "question" being the jumbled words (e.g., 'kırmızı severim ben elmayı') and "answer" being the correct sentence (e.g., 'Ben kırmızı elmayı severim.').`
};

const dyslexiaPrompts: Record<string, (settings: any, count: number) => string> = {
    'sound-wizard': (settings: any, count: number) => `Create ${count} simple Turkish phonological awareness exercises for a '${settings.type}' task with '${settings.difficulty}' difficulty, suitable for a grade 1-2 student. Task types are 'rhyme', 'syllable', 'blend', 'isolation'. ${settings.generateImage ? 'For each exercise, if it involves a concrete noun, provide a "visualPrompt" in ENGLISH for a simple, colorful, cartoon-style illustration of that noun (e.g., a "cat" for a rhyme with "hat"). Do not provide a visualPrompt for abstract tasks.' : ''}`,
    'reading-fluency-coach': (settings: any, count: number) => `Create ${count} short Turkish reading passage(s) for a grade ${settings.gradeLevel} student. The topic is '${settings.topic}'. The text should be simple, with short sentences and common words, suitable for practicing reading fluency. Format as a JSON array of objects, each with "question" (the passage) and "answer" (a simple comprehension question about the passage).`,
    'comprehension-explorer': (settings: any, count: number) => `Generate ${count} ${settings.textLength} Turkish text passage(s) for a grade ${settings.gradeLevel} student. After the passage, create one multiple-choice question focusing on '${settings.questionType}'. ${settings.generateImage ? 'For each passage, provide a "visualPrompt" in ENGLISH to generate a relevant, simple, cartoon-style illustration. The prompt must not contain text or numbers.' : ''}`,
    'vocabulary-explorer': (settings: any, count: number) => `Generate ${count} ${settings.difficulty} level Turkish vocabulary words suitable for a grade ${settings.gradeLevel} student. For each word, provide its meaning and an example sentence. Format as a JSON array of objects, where "question" is the word and "answer" is 'Anlamı: [meaning]. Cümle: [example sentence]'.`,
    'word-hunter': (settings: any, count: number) => `Create ${count} ${settings.difficulty} level exercises focusing on the morphological component '${settings.focus}'. Provide a short sentence with a target word. The student's task is to identify the component. Format as a JSON array of objects, where "question" is the sentence (e.g., 'Kediler çok sevimlidir.') and "answer" is the identified component (e.g., 'Son ek: -ler').`,
    'spelling-champion': (settings: any, count: number) => `Generate ${count} ${settings.difficulty} level spelling exercises about '${settings.category}'. Present two options, one correct and one incorrect. The student must choose the correct one. Format as a JSON array of objects, where "question" is 'Hangisi doğru yazılmıştır: [option1] / [option2]?' and "answer" is the correct option.`,
    'auditory-writing': (settings: any, count: number) => `Generate ${count} ${settings.difficulty} level ${settings.type === 'single_words' ? 'Turkish words' : 'short Turkish sentences'} for a dictation (auditory writing) exercise. The teacher will read these aloud. Format as a JSON array of objects, where "question" is a placeholder like 'Dinle ve yaz.' and "answer" is the word/sentence to be read.`,
    'interactive-story': (settings: any, count: number) => {
        let prompt = `Create the beginning of ${count} interactive story in Turkish. Genre: '${settings.genre}'. Grade level: ${settings.gradeLevel}. The story must present two choices for the reader to continue.`;
        if (settings.generateImage) {
            prompt += ` For each story, also provide a "visualPrompt" field. This field must contain a detailed, descriptive prompt IN ENGLISH suitable for an image generation model. The visual prompt MUST NOT contain any numbers or clues to the mathematical answer. It should only describe the scene visually in a simple, colorful, cartoon style.`;
        }
        return prompt;
    },
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
    const useVisualSchema = settings.generateImage;

    prompt += `\n\nIMPORTANT: Ensure the entire output is a single, valid JSON array of objects, strictly following the schema. Do not include any text before or after the JSON array. The language must be very simple and clear, suitable for a young child with learning difficulties. All content must be in Turkish.`;

    try {
        // Switch to gemini-2.5-flash for faster response and higher limits
        const response = await generateContentWithRetry('gemini-2.5-flash', {
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: useVisualSchema ? visualProblemSchema : problemSchema,
            },
        });

        let parsedProblems = JSON.parse(response.text);
        if (!Array.isArray(parsedProblems)) {
            throw new Error("AI response is not a valid array.");
        }

        if (useVisualSchema) {
            parsedProblems = await processVisualPrompts(parsedProblems);
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
        return { problems: [], title: 'Hata', error: `AI content generation failed for ${subModuleId}. API kotası dolmuş olabilir, lütfen biraz bekleyip tekrar deneyin.` };
    }
};


// --- SERVICE FUNCTIONS ---

export const generateContextualWordProblems = async (module: string, settings: WordProblemSettings): Promise<Problem[]> => {
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
        if (settings.digits && settings.digits !== 'any') {
            prompt += ` The numbers in the problems must have ${settings.digits} digits. `;
        }
        prompt += `Each problem should require ${settings.operationCount} operation(s) to solve. `;
        
        const isTechnicalSVG = settings.visualStyle === 'technical-svg';
        const isAIIllustration = settings.visualStyle === 'ai-illustration' || (settings.useVisuals && !settings.uploadedImage && settings.visualStyle !== 'none');

        if (isTechnicalSVG) {
            prompt += ` Important: The problem will be accompanied by a technical diagram (like a ruler or scale). Please include a "technicalValue" field in the JSON (a number) representing the value shown in the diagram (e.g., the length in cm, or temperature in degrees). The question text should refer to "the figure" or "the image".`;
        } else if (isAIIllustration) {
            prompt += ` For each problem, also provide a "visualPrompt" key. The "visualPrompt" must be a detailed, descriptive prompt IN ENGLISH for an image generation model, describing the scene of the problem visually in a simple, colorful, children's book illustration style, without including any numbers or direct clues to the answer. Do not include emojis in the question text when generating a visual prompt.`;
        } else {
            prompt += ` If relevant, include emojis in the problem text to make it more engaging.`;
        }

        if (settings.layout === 'given-wanted') {
            prompt += `Phrase the problems so they are suitable for a 'Given / Wanted / Solution' format.`;
        } else if (settings.layout === 'with-visual-space') {
            prompt += `Phrase the problems in a way that might encourage the student to draw or visualize the solution.`;
        }
    }

    prompt += ` Format the output as a JSON array of objects.`;

    try {
        let response;
        const isAIIllustration = settings.visualStyle === 'ai-illustration' || (settings.useVisuals && !settings.uploadedImage && settings.visualStyle !== 'none');
        const isTechnicalSVG = settings.visualStyle === 'technical-svg';

        let schema = problemSchema;
        if (isAIIllustration) schema = visualProblemSchema;
        if (isTechnicalSVG) schema = technicalProblemSchema;

        if (settings.uploadedImage) {
            const match = settings.uploadedImage.match(/^data:(.+);base64,(.+)$/);
            if (!match) {
                throw new Error("Geçersiz resim verisi.");
            }
            const [, mimeType, base64Data] = match;

            const imagePart = {
                inlineData: { mimeType, data: base64Data },
            };
            const textPart = { text: prompt };

            // Switch to gemini-2.5-flash for faster response and higher limits
            response = await generateContentWithRetry('gemini-2.5-flash', {
                contents: { parts: [imagePart, textPart] },
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });
        } else {
            // Switch to gemini-2.5-flash for faster response and higher limits
            response = await generateContentWithRetry('gemini-2.5-flash', {
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });
        }
        
        let parsedProblems = JSON.parse(response.text);
         if (!Array.isArray(parsedProblems)) {
            throw new Error("AI response is not a valid array.");
        }
        
        if (isAIIllustration) {
            parsedProblems = await processVisualPrompts(parsedProblems);
        } else if (isTechnicalSVG && settings.domain) {
            parsedProblems = processTechnicalSVGs(parsedProblems, settings.domain);
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
            question: "Yapay zeka ile problem oluşturulurken bir hata oluştu. API kotası dolmuş olabilir (429), lütfen biraz bekleyip tekrar deneyin.",
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

export const generateDyslexiaAIProblem = (subModuleId: DyslexiaSubModuleType, settings: any, count: number) => {
    return generateSpecialLearningAIProblem(dyslexiaPrompts, subModuleId, settings, count);
};
