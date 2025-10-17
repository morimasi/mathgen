import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Problem, DyslexiaSubModuleType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generatePrompt = (subModuleId: DyslexiaSubModuleType, settings: any, count: number): { prompt: string, title: string } => {
    let prompt = "";
    let title = "";

    switch (subModuleId) {
        case 'reading-fluency-coach':
            title = 'Sesli Okuma Koçu';
            prompt = `${settings.gradeLevel}. sınıf seviyesinde, "${settings.topic}" konusuyla ilgili, akıcı okuma pratiği yapmak için tasarlanmış ${count} tane kısa ve basit metin oluştur.`;
            break;
        case 'comprehension-explorer':
            title = 'Anlam Kâşifi';
            prompt = `${settings.gradeLevel}. sınıf seviyesinde, ${settings.textLength} uzunluğunda bir metin ve bu metinle ilgili "${settings.questionType}" türünde ${count} tane anlama sorusu oluştur.`;
            break;
        case 'vocabulary-explorer':
            title = 'Kelime Kâşifi';
            prompt = `${settings.gradeLevel}. sınıf için "${settings.difficulty}" zorluk seviyesinde ${count} tane kelime seç. Her kelime için anlamını ve içinde geçtiği basit bir örnek cümleyi belirt.`;
            break;
        case 'interactive-story':
             title = 'Uygulamalı Hikaye Macerası';
             prompt = `${settings.gradeLevel}. sınıf seviyesinde, "${settings.genre}" türünde, okuyucunun seçimler yaparak ilerlediği kısa bir interaktif hikaye başlangıcı oluştur.`;
             break;
        // Non-AI modules will have placeholder content
        default:
            // This case handles non-AI modules for now.
            // A full implementation would have local generation logic here.
            break;
    }

    return { prompt, title };
};

export const generateDyslexiaProblem = async (subModuleId: DyslexiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    const { prompt, title } = generatePrompt(subModuleId, settings, count);
    
    // For this fix, we assume all modules can be handled by AI or a placeholder.
    // A full implementation would have local generators for non-AI modules.
    if (!prompt) {
        return {
            problems: Array.from({ length: count }, () => ({
                question: `Bu alıştırma için henüz içerik oluşturulmadı. ('${subModuleId}')`,
                answer: "...",
                category: 'dyslexia'
            })),
            title: title || 'Disleksi Alıştırması',
        };
    }
    
    const fullPrompt = `${prompt} Cevabı, her biri 'question' ve 'answer' anahtarlarına sahip bir JSON dizisi olarak ver. Başka metin ekleme. Örneğin: [{"question": "...", "answer": "..."}]`;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            answer: { type: Type.STRING }
                        },
                        required: ['question', 'answer']
                    }
                }
            }
        });

        const problems: Problem[] = JSON.parse(response.text).map((p: any) => ({ ...p, category: 'dyslexia' }));
        return { problems, title };

    } catch (error) {
        console.error(`Error generating dyslexia problem for ${subModuleId}:`, error);
        return {
            problems: [{
                question: `Yapay zeka ile '${title}' oluşturulurken bir hata oluştu. Lütfen API anahtarınızı kontrol edin ve tekrar deneyin.`,
                answer: "Hata",
                category: 'error',
            }],
            title,
            error: String(error)
        };
    }
};
