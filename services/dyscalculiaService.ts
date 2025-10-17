import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Problem, DyscalculiaSubModuleType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generatePrompt = (subModuleId: DyscalculiaSubModuleType, settings: any, count: number): { prompt: string, title: string } => {
    let prompt = "";
    let title = "";

    switch (subModuleId) {
        case 'problem-solving':
            title = 'Problem Çözme (AI)';
            prompt = `${settings.gradeLevel}. sınıf seviyesinde, "${settings.topic}" konusuyla ilgili, diskalkuli dostu (basit dil, tek adım) ${count} tane problem oluştur.`;
            break;
        case 'interactive-story-dc':
            title = 'Hikaye Macerası (AI)';
            prompt = `${settings.gradeLevel}. sınıf seviyesinde, "${settings.genre}" temasında, içinde basit matematiksel seçimler (sayma, karşılaştırma gibi) barındıran kısa bir interaktif hikaye başlangıcı oluştur.`;
            break;
        default:
            // Placeholder for non-AI modules
            break;
    }

    return { prompt, title };
};

export const generateDyscalculiaProblem = async (subModuleId: DyscalculiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    const { prompt, title } = generatePrompt(subModuleId, settings, count);

    if (!prompt) {
        return {
            problems: Array.from({ length: count }, () => ({
                question: `Bu alıştırma için henüz içerik oluşturulmadı. ('${subModuleId}')`,
                answer: "...",
                category: 'dyscalculia'
            })),
            title: title || 'Diskalkuli Alıştırması',
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

        const problems: Problem[] = JSON.parse(response.text).map((p: any) => ({ ...p, category: 'dyscalculia' }));
        return { problems, title };

    } catch (error) {
        console.error(`Error generating dyscalculia problem for ${subModuleId}:`, error);
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
