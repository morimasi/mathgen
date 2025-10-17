import { GoogleGenAI, Type } from "@google/genai";
import { Problem, DyslexiaSubModuleType, DyscalculiaSubModuleType, DysgraphiaSubModuleType } from '../types';

// Initialize the Gemini AI model
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const parseJsonResponse = (text: string): Problem[] => {
    try {
        const jsonMatch = text.match(/```(json)?([\s\S]*?)```/);
        const jsonString = jsonMatch ? jsonMatch[2].trim() : text.trim();
        const data = JSON.parse(jsonString);

        if (Array.isArray(data)) {
            return data.map(item => ({
                question: item.question || 'Geçersiz soru',
                answer: String(item.answer || 'Geçersiz cevap'),
                category: item.category || 'ai-generated',
            }));
        }
        return [];
    } catch (error) {
        console.error("Gemini yanıtı ayrıştırılamadı:", error);
        console.error("Ham yanıt metni:", text);
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
        console.error("Gemini API çağrılırken hata:", error);
        return [{
            question: "Yapay zeka ile problem oluşturulurken bir hata oluştu. API anahtarınızı kontrol edin veya daha sonra tekrar deneyin.",
            answer: "API Hatası",
            category: 'error'
        }];
    }
};

// FIX: Modified to support the generic WordProblemsModule.
// - Handles 'customPrompt' for user-defined problems.
// - Adds a specific prompt generation logic for when module is 'none'.
export const generateContextualWordProblems = async (module: string, settings: any): Promise<Problem[]> => {
    const { problemsPerPage = 5, useVisuals = false, topic = 'Genel', gradeLevel = '3', customPrompt = '', operationCount = 1 } = settings;

    if (customPrompt) {
        return generateProblems(customPrompt, problemsPerPage);
    }
    
    const visualInstruction = useVisuals ? "Soruların içine konuyla ilgili emoji ekleyerek görsel olarak zenginleştir." : "";

    if (module === 'none') {
        const prompt = `${gradeLevel}. sınıf seviyesinde, '${topic}' konusunda, ${operationCount} işlemli, ${problemsPerPage} tane Türkçe gerçek hayat problemi oluştur. ${visualInstruction}`;
        return generateProblems(prompt, problemsPerPage);
    }
    
    let prompt = `${gradeLevel}. sınıf seviyesine uygun, "${topic}" temalı, ${problemsPerPage} tane Türkçe gerçek hayat problemi oluştur. ${visualInstruction}\n`;

    switch(module) {
        case 'arithmetic':
            prompt += `- Kategori: Dört İşlem\n- İşlem Türü: ${settings.operation}\n- Basamak Sayıları: ${settings.digits1} ve ${settings.digits2}\n- İşlem Sayısı: ${settings.operationCount}`;
            break;
        case 'fractions':
            prompt += `- Kategori: Kesirler\n- Zorluk: ${settings.difficulty}\n- İşlem Türü: ${settings.operation}\n- İşlem Sayısı: ${settings.operationCount}`;
            break;
        // Add more cases for other modules as needed
        default:
             prompt += `- Kategori: ${module}`;
             break;
    }
    
    return generateProblems(prompt, problemsPerPage);
};

type SpecialModuleType = DyslexiaSubModuleType | DyscalculiaSubModuleType | DysgraphiaSubModuleType;

export const generateSpecialAIProblem = async (subModule: SpecialModuleType, settings: any, count: number): Promise<Problem[]> => {
    let prompt = `Aşağıdaki ayarlara göre ${count} tane Türkçe, özel öğrenme güçlüğüne yönelik alıştırma oluştur. Sorular basit, net ve kafa karıştırıcı olmayan bir dilde olsun.\n`;

    switch(subModule) {
        // DYSLEXIA
        case 'comprehension-explorer':
            prompt += `- Alıştırma: Okuduğunu Anlama (Disleksi)\n- Sınıf Seviyesi: ${settings.gradeLevel}\n- Metin Uzunluğu: ${settings.textLength}\n- Soru Türü: ${settings.questionType}\nÖnce metni oluştur, ardından metinle ilgili 2-3 soru ve cevabını ver. 'question' alanında hem metin hem de sorular olmalı.`;
            break;
        case 'vocabulary-explorer':
            prompt += `- Alıştırma: Kelime Bilgisi (Disleksi)\n- Sınıf Seviyesi: ${settings.gradeLevel}\n- Zorluk: ${settings.difficulty}\nHer alıştırma için bir kelime seç. 'question' alanında kelimenin tanımı ve bir örnek cümle olsun. 'answer' alanında ise sadece kelimenin kendisi olsun.`;
            break;
        case 'interactive-story':
             prompt += `- Alıştırma: Etkileşimli Hikaye (Disleksi)\n- Sınıf Seviyesi: ${settings.gradeLevel}\n- Tür: ${settings.genre}\nHikayenin bir bölümünü yaz. Sonunda okuyucunun yapması gereken bir seçim sun (örn: "Mağaraya girmek için [A] de..."). 'question'da hikaye ve seçenekler, 'answer'da seçimin olası bir sonucu olsun.`;
            break;
        
        // DYSCALCULIA
        case 'problem-solving':
            prompt += `- Alıştırma: Problem Çözme (Diskalkuli)\n- Sınıf Seviyesi: ${settings.gradeLevel}\n- Konu: ${settings.topic || 'Günlük Yaşam'}\nSayıların ve adımların net olduğu, basit, tek adımlı kelime problemleri oluştur.`;
            break;
        case 'interactive-story-dc':
             prompt += `- Alıştırma: Etkileşimli Hikaye (Diskalkuli)\n- Sınıf Seviyesi: ${settings.gradeLevel}\n- Tür: ${settings.genre}\nİçinde basit sayma, karşılaştırma veya toplama gibi matematiksel seçimler içeren bir hikaye bölümü oluştur.`;
            break;

        // DYSGRAPHIA
        case 'picture-sequencing':
            prompt += `- Alıştırma: Resim Sıralama Hikayecisi (Disgrafi)\n- Hikaye Uzunluğu: ${settings.storyLength} adım\n- Konu: ${settings.topic || 'Günlük bir aktivite'}\n${settings.storyLength} adımlı basit bir hikaye oluştur. Her adımı 'question' içinde ayrı bir madde olarak açıkla. 'answer' alanına adımların mantıksal sırasını yaz (örn: 2, 1, 3).`;
            break;
        case 'writing-planning':
            prompt += `- Alıştırma: Yazı Planlama (Disgrafi)\n- Konu: ${settings.topic || 'Serbest'}\nVerilen konu hakkında bir yazı yazmak için 3 basit planlama adımı (giriş, gelişme, sonuç için birer cümle) oluştur. 'question' alanında konu, 'answer' alanında 3 adımlı plan olsun.`;
            break;
        case 'creative-writing':
            prompt += `- Alıştırma: Yaratıcı Yazarlık (Disgrafi)\n- Tür: ${settings.promptType}\n- Konu: ${settings.topic || 'Serbest'}\n'question' alanında, seçilen türe göre ilgi çekici bir başlangıç cümlesi veya senaryo oluştur. 'answer' alanına "Öğrencinin yaratıcılığına bırakılmıştır." yaz.`;
            break;
        case 'interactive-story-dg':
            prompt += `- Alıştırma: Etkileşimli Hikaye (Disgrafi)\n- Sınıf Seviyesi: ${settings.gradeLevel}\n- Tür: ${settings.genre}\nÖğrencinin kısa bir cümle ile devam ettirmesi gereken bir hikaye başlangıcı oluştur. 'question' alanında hikaye başlangıcı ve "Şimdi sen devam et:" gibi bir yönlendirme olsun.`;
            break;
        default:
             return [{ question: 'Bu modül için AI desteği henüz mevcut değil.', answer: '', category: 'ai-error' }];
    }

    return generateProblems(prompt, count);
};