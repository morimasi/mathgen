import { GoogleGenAI, Type } from "@google/genai";
import { Problem, WordProblemSettings, ArithmeticSettings, FractionsSettings, DecimalsSettings, TimeSettings, PlaceValueSettings, RhythmicCountingSettings, GeometrySettings, MeasurementSettings, DyslexiaSubModuleType } from '../types';

// Initialize the Gemini AI model
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const parseJsonResponse = (text: string): Problem[] => {
    try {
        // The API might return a markdown block with JSON inside.
        const jsonMatch = text.match(/```(json)?([\s\S]*?)```/);
        const jsonString = jsonMatch ? jsonMatch[2].trim() : text.trim();
        const data = JSON.parse(jsonString);

        if (Array.isArray(data)) {
            return data.map(item => ({
                question: item.question || 'Invalid question',
                answer: String(item.answer || 'Invalid answer'),
                category: item.category || 'ai-generated',
            }));
        }
        return [];
    } catch (error) {
        console.error("Failed to parse Gemini response:", error);
        console.error("Raw response text:", text);
        // Return a single problem with the error message for debugging
        return [{
            question: "Yapay zeka yanıtı ayrıştırılamadı. Lütfen tekrar deneyin veya ayarları değiştirin.",
            answer: "Hata",
            category: 'error'
        }];
    }
};

const problemSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING, description: 'Sorunun metni. Matematiksel ifadeler için HTML kullanma (örn: kesirler için <sup> ve <sub>). Görsel destek istendiğinde, konuyla ilgili emoji ekle.' },
        answer: { type: Type.STRING, description: 'Sorunun kısa ve net cevabı.' },
    },
    required: ['question', 'answer'],
};

const generateProblems = async (prompt: string, count: number): Promise<Problem[]> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    description: `Oluşturulacak problem sayısı: ${count}.`,
                    items: problemSchema,
                },
                temperature: 0.8,
            }
        });

        if (response.text) {
            return parseJsonResponse(response.text);
        } else {
             throw new Error("Gemini API'den boş yanıt alındı.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return [{
            question: "Yapay zeka ile problem oluşturulurken bir hata oluştu. API anahtarınızı kontrol edin veya daha sonra tekrar deneyin.",
            answer: "API Hatası",
            category: 'error'
        }];
    }
};

export const generateWordProblems = async (settings: WordProblemSettings): Promise<Problem[]> => {
    const { gradeLevel, topic, customPrompt, problemsPerPage, operationCount, sourceModule, useVisuals } = settings;

    if (customPrompt) {
        // If a custom prompt is provided, use it directly.
        return generateProblems(customPrompt, problemsPerPage);
    }

    const moduleNameMap: { [key: string]: string } = {
        'arithmetic': 'dört işlem',
        'fractions': 'kesirler',
        'decimals': 'ondalık sayılar',
        'place-value': 'basamak değeri',
        'rhythmic-counting': 'ritmik sayma',
        'time': 'zaman ölçme',
        'geometry': 'geometri',
        'measurement': 'ölçüler',
        'none': ''
    };
    
    const subject = sourceModule !== 'none' ? moduleNameMap[sourceModule] || '' : '';
    const visualInstruction = useVisuals ? "Soruların içine konuyla ilgili emojiler ekleyerek görsel olarak zenginleştir." : "";

    const prompt = `
        ${gradeLevel}. sınıf seviyesine uygun, ${subject} konusunda, "${topic}" temalı, ${operationCount} işlem gerektiren, ${problemsPerPage} tane gerçek hayat matematik problemi oluştur. 
        Her problem için cevap anahtarını da hazırla. ${visualInstruction}
        Cevapları kısa ve net olsun. Sorular Türkçe olsun.
    `;
    
    return generateProblems(prompt, problemsPerPage);
};


export const generateContextualWordProblems = async (module: string, settings: any): Promise<Problem[]> => {
    const { problemsPerPage, useVisuals, topic } = settings;
    const visualInstruction = useVisuals ? "Soruların içine konuyla ilgili emojiler ekleyerek görsel olarak zenginleştir." : "";
    let prompt = `Aşağıdaki ayarlara göre ${problemsPerPage} tane Türkçe gerçek hayat problemi oluştur:
    - Kategori: ${module}
    - Konu: ${topic || 'Genel'}
    - ${visualInstruction}
    `;

    switch(module) {
        case 'arithmetic':
            prompt += `- Sınıf Seviyesi: ${settings.gradeLevel}\n- İşlem Türü: ${settings.operation}\n- Basamak Sayıları: ${settings.digits1} ve ${settings.digits2}\n- İşlem Sayısı: ${settings.operationCount}`;
            break;
        case 'fractions':
            prompt += `- Sınıf Seviyesi: ${settings.gradeLevel}\n- Zorluk: ${settings.difficulty}\n- İşlem Türü: ${settings.operation}\n- İşlem Sayısı: ${settings.operationCount}`;
            break;
        // Add more cases for other modules
        default:
             prompt += `- Sınıf Seviyesi: ${settings.gradeLevel || 2}`;
             break;
    }
    
    return generateProblems(prompt, problemsPerPage);
};

export const generateDyslexiaAIProblem = async (subModule: DyslexiaSubModuleType, settings: any, count: number): Promise<Problem[]> => {
    let prompt = `Disleksiye yönelik, aşağıdaki ayarlara göre ${count} tane Türkçe alıştırma oluştur. Sorular basit, net ve kafa karıştırıcı olmayan bir dilde olsun.`;

    switch(subModule) {
        case 'comprehension-explorer':
            prompt += `
            - Alıştırma: Okuduğunu Anlama
            - Sınıf Seviyesi: ${settings.gradeLevel}
            - Metin Uzunluğu: ${settings.textLength}
            - Soru Türü: ${settings.questionType}
            
            Önce metni oluştur, ardından metinle ilgili 2-3 tane soru ve cevabını ver. Question alanında hem metin hem de sorular olmalı. Answer alanında sadece cevaplar olmalı.
            `;
            break;
        case 'vocabulary-explorer':
            prompt += `
            - Alıştırma: Kelime Bilgisi
            - Sınıf Seviyesi: ${settings.gradeLevel}
            - Zorluk: ${settings.difficulty}

            Her alıştırma için bir kelime seç. Question alanında kelimenin tanımı ve bir örnek cümle olsun. Answer alanında ise sadece kelimenin kendisi olsun.
            `;
            break;
        case 'interactive-story':
             prompt += `
            - Alıştırma: Etkileşimli Hikaye
            - Sınıf Seviyesi: ${settings.gradeLevel}
            - Tür: ${settings.genre}

            Hikayenin bir bölümünü yaz. Sonunda okuyucunun yapması gereken bir seçim sun (örn: "Mağaraya girmek için [A] de, ormanda devam etmek için [B] de."). Question alanında hikaye bölümü ve seçenekler, Answer alanında ise seçimin olası bir sonucu olsun.
            `;
            break;
        default:
             return [{ question: 'Bu modül için AI desteği henüz mevcut değil.', answer: '', category: 'dyslexia-error' }];
    }

    return generateProblems(prompt, count);
};
