import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
// FIX: Add .ts extension to import path
import { Problem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Bu sistem talimatı, yapay zekanın tüm modüllerde temel bir pedagog ve eğitim materyali uzmanı gibi davranmasını sağlar.
 * Her modül için bu temel talimata ek, uzmanlaşmış yönlendirmeler eklenir.
 */
const systemInstruction = `
Sen, ilkokul öğrencileri için yaratıcı ve pedagojik olarak sağlam eğitim materyalleri hazırlayan uzman bir öğretim tasarımcısısın. Özellikle disleksi, diskalkuli ve disgrafi gibi öğrenme güçlükleri konusunda derin bilgiye sahipsin.
Görevin, her zaman yaşa uygun, anlaşılır, basit bir dil kullanan, ilgi çekici ve somut örnekler içeren problemler üretmektir.
Verdiğin cevaplar SADECE istenen JSON formatında olmalı, başka hiçbir açıklama, selamlama veya metin içermemelidir.

Öğrenme güçlükleri için özel kurallar:
- DİSKALKULİ: Problemler aşırı basit bir dilde olmalı. Sayılar küçük (genellikle 1-20 arası) ve işlemler tek adımlı olmalı. Her zaman elma, araba, top gibi somut ve sayılabilir nesneler kullan. Soyut kavramlardan kaçın.
- DİSGRAFİ: Yazma ile ilgili istemler, 'boş sayfa korkusunu' azaltmak için tasarlanmalıdır. Çok kısa, teşvik edici ve sadece bir sonraki adımı düşündüren yönlendirmeler kullan (örn: "Hikayenin sadece giriş cümlesini yaz."). Yaratıcılığı tetikleyecek, baskı oluşturmayacak şekilde olmalı.
- DİSLEKSİ: Okuma metinleri kısa cümlelerden, sık kullanılan ve fonetik olarak düzenli kelimelerden oluşmalı. Sorular net ve tek bir doğru cevaba yönelik olmalı. Ses-harf ilişkisine odaklanan etkinlikler sun.
`;

const getModuleSpecificInstructions = (sourceModule: string, settings: any): string => {
    let instructions = "";
    const { topic, operationCount, gradeLevel } = settings;

    const modulePrompts: { [key: string]: string } = {
        'arithmetic': `Dört işlem becerilerini (toplama, çıkarma, çarpma, bölme) içeren, ${settings.operation ? `özellikle "${settings.operation}" işlemine odaklanan,` : ''}`,
        'fractions': 'Kesirler (toplama, çıkarma, karşılaştırma vb.) konusunda, pizza dilimi, pasta gibi somut örnekler kullanarak,',
        'decimals': 'Ondalık sayılar konusunda, para (TL), market alışverişi, metre ile ölçüm gibi gerçek hayat senaryoları kullanarak,',
        'place-value': 'Basamak değeri, sayı çözümleme ve yuvarlama becerilerini hedefleyen,',
        'rhythmic-counting': 'Ritmik sayma ve sayı örüntüleri üzerine,',
        'time': 'Zaman ölçme (analog/dijital saat okuma, süre hesaplama vb.) ile ilgili,',
        'geometry': 'Geometrik şekiller, alan ve çevre hesaplamaları gibi konuları içeren,',
        'measurement': 'Ölçü birimleri (uzunluk, ağırlık, hacim) ve aralarındaki dönüşümleri konu alan,',
        'dyslexia': 'Disleksiye özel, fonolojik farkındalık, harf-ses ilişkisi ve okuduğunu anlama odaklı etkinlikler içeren,',
        'dyscalculia': 'Diskalkuliye özel, sayı hissi, miktar karşılaştırma ve temel aritmetik becerilerine odaklanan, görsellerle desteklenmiş basit etkinlikler içeren,',
        'dysgraphia': 'Disgrafiye özel, ince motor becerileri, harf şekillendirme, yazı planlama ve yazma motivasyonunu artırıcı etkinlikler içeren,',
    };
    
    if (gradeLevel) instructions += `${gradeLevel}. sınıf seviyesine uygun,`;
    if (topic) instructions += ` "${topic}" temalı,`;
    if (modulePrompts[sourceModule]) instructions += ` ${modulePrompts[sourceModule]}`;
    if (operationCount) instructions += ` ${operationCount > 1 ? `${operationCount} işlem gerektiren` : 'tek işlem gerektiren'} problemler oluştur.`;
    
    return instructions;
};

export const generateContextualWordProblems = async (sourceModule: string, settings: any): Promise<Problem[]> => {
    try {
        const { problemsPerPage, customPrompt, useVisuals } = settings;
        let userPrompt;

        if (customPrompt) {
            userPrompt = customPrompt;
        } else {
            const baseInstructions = getModuleSpecificInstructions(sourceModule, settings);
            userPrompt = `${baseInstructions} ${problemsPerPage} tane gerçek hayat problemi (kelime problemi) oluştur.`;
        }
        
        const visualInstruction = "Soruları daha ilgi çekici hale getirmek için problem metninin sonuna konuyla ilgili uygun bir emoji ekle.";
        if (useVisuals) {
            userPrompt += ` ${visualInstruction}`;
        }
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [{ text: userPrompt }] },
            config: {
                systemInstruction,
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

        return parsedProblems.map((p: any) => ({
            question: p.question || "Soru alınamadı",
            answer: p.answer || "Cevap alınamadı",
            category: sourceModule || 'word-problems',
            display: 'inline'
        }));
        
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

// Disleksi, Diskalkuli ve Disgrafi için AI çağrıları generateContextualWordProblems'ı kullanacak
// çünkü artık bu fonksiyon sourceModule'e göre uzmanlaşmış talimatlar üretiyor.
export const generateDyslexiaAIProblem = async (subModuleId: string, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    const combinedSettings = { ...settings, problemsPerPage: count, sourceModule: 'dyslexia', subModule: subModuleId };
    const problems = await generateContextualWordProblems('dyslexia', combinedSettings);
    const title = `Disleksi Odaklı Alıştırma: ${subModuleId}`;
    return { problems, title };
};

export const generateDyscalculiaAIProblem = async (subModuleId: string, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    const combinedSettings = { ...settings, problemsPerPage: count, sourceModule: 'dyscalculia', subModule: subModuleId };
    const problems = await generateContextualWordProblems('dyscalculia', combinedSettings);
    const title = `Diskalkuli Odaklı Alıştırma: ${subModuleId}`;
    return { problems, title };
};

export const generateDysgraphiaAIProblem = async (subModuleId: string, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    const combinedSettings = { ...settings, problemsPerPage: count, sourceModule: 'dysgraphia', subModule: subModuleId };
    const problems = await generateContextualWordProblems('dysgraphia', combinedSettings);
    const title = `Disgrafi Odaklı Alıştırma: ${subModuleId}`;
    return { problems, title };
};