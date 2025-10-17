import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Problem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getModulePrompt = (sourceModule: string, settings: any): string => {
    const { gradeLevel, topic, operationCount, useVisuals } = settings;
    let prompt = `${gradeLevel}. sınıf seviyesinde,`;

    const modulePrompts: { [key: string]: string } = {
        'arithmetic': 'dört işlem',
        'fractions': 'kesirler',
        'decimals': 'ondalık sayılar',
        'place-value': 'basamak değeri',
        'rhythmic-counting': 'ritmik sayma',
        'time': 'zaman ölçme',
        'geometry': 'geometri',
        'measurement': 'ölçüler',
        'basic-shapes': 'temel geometrik şekiller',
        'comparing-quantities': 'miktarları karşılaştırma',
        'matching-and-sorting': 'eşleştirme ve gruplama',
        'number-recognition': 'rakam tanıma ve sayma',
        'patterns': 'örüntüler',
        'positional-concepts': 'konum ve yön kavramları',
        'intro-to-measurement': 'ölçmeye giriş',
        'simple-graphs': 'basit grafikler',
    };

    if (sourceModule !== 'none' && modulePrompts[sourceModule]) {
        prompt += ` ${modulePrompts[sourceModule]} konusunda,`;
    }

    if (topic) {
        prompt += ` "${topic}" temalı,`;
    }

    if (operationCount > 1) {
        prompt += ` ${operationCount} işlem gerektiren,`;
    } else {
        prompt += ` tek işlem gerektiren,`;
    }
    
    if (useVisuals) {
        prompt += ` içinde konuyla ilgili emoji'ler de içeren,`;
    }

    // Module-specific details
    if (sourceModule === 'arithmetic' && settings.operation) {
        const opNames: { [key: string]: string } = { 'addition': 'toplama', 'subtraction': 'çıkarma', 'multiplication': 'çarpma', 'division': 'bölme', 'mixed-add-sub': 'toplama ve çıkarma', 'mixed-all': 'dört işlem' };
        prompt += ` özellikle ${opNames[settings.operation]} işlemi içeren,`;
    }
    
    if (sourceModule === 'fractions' && settings.difficulty) {
        const diffNames: { [key: string]: string } = { 'easy': 'paydaları eşit', 'medium': 'paydaları farklı', 'hard': 'tam sayılı veya bileşik kesirlerle' };
        prompt += ` zorluk seviyesi "${diffNames[settings.difficulty]}" olan,`;
    }

    return prompt;
};

export const generateContextualWordProblems = async (sourceModule: string, settings: any): Promise<Problem[]> => {
    try {
        const { problemsPerPage, customPrompt } = settings;
        let prompt;

        if (customPrompt) {
            prompt = customPrompt;
        } else {
            const basePrompt = getModulePrompt(sourceModule, settings);
            prompt = `${basePrompt} ${problemsPerPage} tane gerçek hayat problemi (kelime problemi) oluştur.`;
        }
        
        const fullPrompt = `${prompt} Problemlerin sadece sorusunu ve cevabını içeren bir JSON dizisi olarak yanıt ver. Her bir problem için 'question' ve 'answer' anahtarlarını kullan. Başka hiçbir metin ekleme. Örneğin: [{"question": "...", "answer": "..."}]`;

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

        const jsonText = response.text.trim();
        const parsedProblems = JSON.parse(jsonText);
        
        if (!Array.isArray(parsedProblems)) {
            throw new Error("AI response is not a JSON array.");
        }

        const problems: Problem[] = parsedProblems.map((p: any) => ({
            question: p.question || "Soru alınamadı",
            answer: p.answer || "Cevap alınamadı",
            category: sourceModule || 'word-problems',
            display: 'inline'
        }));
        
        return problems;
    } catch (error) {
        console.error("Error generating contextual word problems:", error);
        return [{
            question: "Yapay zeka ile problem oluşturulurken bir hata oluştu. Lütfen API anahtarınızı kontrol edin ve tekrar deneyin.",
            answer: "Hata",
            category: 'error',
            display: 'inline',
        }];
    }
};
