import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { Problem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Bu sistem talimatı, yapay zekanın tüm modüllerde temel bir pedagog ve eğitim materyali uzmanı gibi davranmasını sağlar.
 * Her modül için bu temel talimata ek, uzmanlaşmış yönlendirmeler eklenir.
 */
const systemInstruction = `
Sen, ilkokul seviyesindeki öğrenciler için eğitim materyalleri hazırlayan uzman bir pedagog ve öğretim tasarımcısısın. Özellikle öğrenme güçlüğü (disleksi, diskalkuli, disgrafi) olan öğrencilerin ihtiyaçlarına yönelik materyal üretme konusunda derin bir uzmanlığa sahipsin.
Amacın, kafa karıştırıcı olmayan, pedagojik olarak sağlam, yaşa uygun, motive edici ve mümkün olduğunca somutlaştırılmış problemler ve etkinlikler oluşturmaktır.
Verdiğin cevaplar SADECE istenen formatta (JSON) olmalı, başka hiçbir açıklama, selamlama veya metin içermemelidir.

Öğrenme güçlükleri için özel kurallar:
- DİSKALKULİ: Problemler aşırı basit bir dilde olmalı. Sayılar küçük (genellikle 1-20 arası) ve işlemler tek adımlı olmalı. Her zaman elma, araba, top gibi somut ve sayılabilir nesneler kullan. Soyut kavramlardan kaçın.
- DİSGRAFİ: Yazma ile ilgili istemler, 'boş sayfa korkusunu' azaltmak için tasarlanmalıdır. Çok kısa, teşvik edici ve sadece bir sonraki adımı düşündüren yönlendirmeler kullan (örn: "Hikayenin sadece giriş cümlesini yaz."). Yaratıcılığı tetikleyecek, baskı oluşturmayacak şekilde olmalı.
- DİSLEKSİ: Okuma metinleri kısa cümlelerden, sık kullanılan ve fonetik olarak düzenli kelimelerden oluşmalı. Sorular net ve tek bir doğru cevaba yönelik olmalı. Ses-harf ilişkisine odaklanan etkinlikler sun.
`;

const getModuleSpecificInstructions = (sourceModule: string, settings: any): string => {
    let instructions = "";
    const { topic, operationCount, gradeLevel } = settings;

    const modulePrompts: { [key: string]: string } = {
        'arithmetic': `Dört işlem alıştırması. Özellikle ${settings.operation ? `"${settings.operation}" işlemi` : ''} üzerine odaklan.`,
        'fractions': 'Kesirler. Somut örnekler kullan (pizza dilimi, pasta, elmanın parçaları).',
        'decimals': 'Ondalık sayılar. Gerçek hayattan örnekler kullan (para, market alışverişi, metre ile ölçüm).',
        'place-value': 'Basamak değeri, çözümleme ve yuvarlama.',
        'rhythmic-counting': 'Ritmik sayma ve sayı örüntüleri.',
        'time': 'Zaman ölçme. Analog/dijital saat okuma, süre hesaplama gibi konular.',
        'geometry': 'Geometrik şekiller, alan ve çevre. Şekilleri basit ve net tanımla.',
        'measurement': 'Ölçü birimleri (uzunluk, ağırlık, hacim) ve dönüşümleri.',
        'dyslexia': 'Disleksiye özel, fonolojik farkındalık, harf-ses ilişkisi ve okuduğunu anlama odaklı etkinlikler.',
        'dyscalculia': 'Diskalkuliye özel, sayı hissi, miktar karşılaştırma ve temel aritmetik becerilerine odaklanan, görsellerle desteklenmiş basit etkinlikler.',
        'dysgraphia': 'Disgrafiye özel, ince motor becerileri, harf şekillendirme, yazı planlama ve yazma motivasyonunu artırıcı etkinlikler.',
    };
    
    instructions += `${gradeLevel}. sınıf seviyesine uygun,`;
    if (topic) instructions += ` "${topic}" temalı,`;
    if (modulePrompts[sourceModule]) instructions += ` ${modulePrompts[sourceModule]} konusunda,`;
    instructions += ` ${operationCount > 1 ? `${operationCount} işlem gerektiren` : 'tek işlem gerektiren'} problemler oluştur.`;
    
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
        
        if (useVisuals) {
            userPrompt += " Her bir problem için, problemi anlatan basit, net, çocuk dostu bir çizim veya görsel de oluştur.";
        }
        
        const modelName = useVisuals ? 'gemini-2.5-flash-image' : 'gemini-2.5-flash';
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelName,
            contents: { parts: [{ text: userPrompt }] },
            config: {
                systemInstruction,
                ...(useVisuals 
                    ? { responseModalities: [Modality.IMAGE] }
                    : { 
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
                )
            }
        });
        
        if (useVisuals) {
            const problems: Problem[] = [];
            let currentProblem: Partial<Problem> = {};

            // Yanıt çok modlu (multi-modal) olduğunda, metin ve görselleri birleştirmemiz gerekir.
            // Genellikle bir metin bloğu ve ardından bir görsel bloğu gelir.
            for (const part of response.candidates[0].content.parts) {
                if (part.text) {
                     try {
                        // Bazen AI, metin ve resmi tek bir JSON'da birleştirmeye çalışır.
                        const parsed = JSON.parse(part.text);
                        if (Array.isArray(parsed)) {
                            parsed.forEach(p => problems.push({
                                question: p.question || "Soru alınamadı",
                                answer: p.answer || "Cevap alınamadı",
                                category: sourceModule,
                                display: 'inline'
                            }));
                        } else {
                             // JSON metin değilse, normal metin olarak kabul et
                             currentProblem.question = part.text;
                        }
                    } catch (e) {
                        // JSON parse hatası, bunun normal bir metin olduğunu varsay
                        currentProblem.question = part.text;
                    }
                } else if (part.inlineData) {
                    const base64Image = part.inlineData.data;
                    const imageUrl = `data:${part.inlineData.mimeType};base64,${base64Image}`;
                    const imageHtml = `<img src="${imageUrl}" alt="AI tarafından üretilen görsel" style="max-width: 150px; margin: 10px auto; display: block; border-radius: 8px;" />`;
                    
                    // Görseli mevcut probleme ekle
                    if (currentProblem.question) {
                        currentProblem.question = `${imageHtml}<p>${currentProblem.question}</p>`;
                        // Cevap genellikle metin bloğunda gizlidir, onu çıkarmaya çalışalım
                        const answerMatch = currentProblem.question.match(/Cevap:\s*(.*)/i);
                        currentProblem.answer = answerMatch ? answerMatch[1] : "Cevap belirtilmedi";
                        
                        problems.push({
                            ...currentProblem,
                            category: sourceModule,
                            display: 'inline'
                        } as Problem);
                        currentProblem = {}; // Bir sonraki problem için sıfırla
                    } else {
                        // Eğer metin yoksa, sadece görseli bir problem olarak ekle
                        problems.push({
                            question: imageHtml,
                            answer: "Görseli yorumlayınız.",
                            category: sourceModule,
                            display: 'inline'
                        });
                    }
                }
            }
             // AI, tüm problemleri tek bir metin bloğunda ve ardından tüm görselleri gönderebilir.
             // Bu durumu ele almak için, eğer hala işlenmemiş problemler varsa, onlara birer placeholder atayalım.
            if (problems.length === 0 && currentProblem.question) {
                 const problemTexts = currentProblem.question.split(/\d+\.\s/).filter(p => p.trim());
                 problemTexts.forEach(text => {
                     const parts = text.split(/Cevap:/i);
                     problems.push({
                         question: parts[0].trim(),
                         answer: parts[1] ? parts[1].trim() : "...",
                         category: sourceModule,
                         display: 'inline'
                     });
                 });
            }

            return problems;

        } else {
            // Sadece metin tabanlı JSON yanıtı
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
        }
        
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

// Disleksi, Diskalkuli ve Disgrafi için AI çağrıları da generateContextualWordProblems'ı kullanacak
// çünkü artık bu fonksiyon sourceModule'e göre uzmanlaşmış talimatlar üretiyor.
// Bu, kod tekrarını önler ve tüm AI etkileşimlerini tek bir merkezi yerde yönetir.

export const generateDyslexiaProblem = async (subModuleId: string, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    const combinedSettings = { ...settings, problemsPerPage: count, sourceModule: 'dyslexia', subModule: subModuleId };
    const problems = await generateContextualWordProblems('dyslexia', combinedSettings);
    // Title'ı daha dinamik hale getirebiliriz, şimdilik sabit
    const title = `Disleksi Odaklı Alıştırma: ${subModuleId}`;
    return { problems, title };
};

export const generateDyscalculiaProblem = async (subModuleId: string, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    const combinedSettings = { ...settings, problemsPerPage: count, sourceModule: 'dyscalculia', subModule: subModuleId };
    const problems = await generateContextualWordProblems('dyscalculia', combinedSettings);
    const title = `Diskalkuli Odaklı Alıştırma: ${subModuleId}`;
    return { problems, title };
};

export const generateDysgraphiaProblem = async (subModuleId: string, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    const combinedSettings = { ...settings, problemsPerPage: count, sourceModule: 'dysgraphia', subModule: subModuleId };
    const problems = await generateContextualWordProblems('dysgraphia', combinedSettings);
    const title = `Disgrafi Odaklı Alıştırma: ${subModuleId}`;
    return { problems, title };
};
