import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Problem, DysgraphiaSubModuleType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generatePrompt = (subModuleId: DysgraphiaSubModuleType, settings: any, count: number): { prompt: string, title: string } => {
    let prompt = "";
    let title = "";

    switch (subModuleId) {
        case 'picture-sequencing':
            title = 'Resim Sıralama (AI)';
            prompt = `"${settings.topic}" konusuyla ilgili, ${settings.storyLength} adımdan oluşan bir olayı anlatan kısa metinler oluştur. Her adımı ayrı bir problem olarak ver.`;
            break;
        case 'writing-planning':
            title = 'Yazı Planlama (AI)';
            prompt = `"${settings.topic}" konusu hakkında bir yazı yazmak için 3 adımlı (Giriş, Gelişme, Sonuç) basit bir taslak oluştur. Her adımı ayrı bir problem olarak ver.`;
            break;
        case 'creative-writing':
            title = 'Yaratıcı Yazarlık (AI)';
            prompt = `"${settings.topic}" konusuyla ilgili, "${settings.promptType}" türünde, yaratıcı yazmayı teşvik eden ${count} tane yönlendirme oluştur.`;
            break;
        case 'interactive-story-dg':
            title = 'Hikaye Macerası (AI)';
            prompt = `${settings.gradeLevel}. sınıf seviyesinde, "${settings.genre}" türünde, öğrencinin kısa bir cümle yazarak devam ettireceği bir hikaye başlangıcı oluştur.`;
            break;
        default:
            // Placeholder for non-AI modules
            break;
    }

    return { prompt, title };
};

export const generateDysgraphiaProblem = async (subModuleId: DysgraphiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    const { prompt, title } = generatePrompt(subModuleId, settings, count);

    if (!prompt) {
        return {
            problems: Array.from({ length: count }, () => ({
                question: `Bu alıştırma için henüz içerik oluşturulmadı. ('${subModuleId}')`,
                answer: "...",
                category: 'dysgraphia'
            })),
            title: title || 'Disgrafi Alıştırması',
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

        const problems: Problem[] = JSON.parse(response.text).map((p: any) => ({ ...p, category: 'dysgraphia' }));
        return { problems, title };

    } catch (error) {
        console.error(`Error generating dysgraphia problem for ${subModuleId}:`, error);
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
