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
        answer: { type: Type.STRING, description: 'Sorunun kısa ve net cevabı. Sadece sonucu içermeli, çözüm adımlarını değil.' },
    },
    required: ['question', 'answer'],
};

const generateProblems = async (prompt: string, count: number): Promise<Problem[]> => {
    try {
        const fullPrompt = `${prompt}\n\nLütfen ${count} adet problem oluştur ve yanıtını, her biri 'question' ve 'answer' anahtarlarına sahip nesneler içeren bir JSON dizisi olarak formatla.`;
        
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                systemInstruction: "Sen ilkokul öğrencileri için ilgi çekici ve öğretici materyaller hazırlayan uzman bir eğitimcisin. Cevapların her zaman istenen formatta ve belirtilen kurallara uygun olmalı.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    description: `Oluşturulacak problem sayısı: ${count}.`,
                    items: problemSchema,
                },
                temperature: 0.9,
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

const getModulePromptSnippets: { [key: string]: string } = {
    'arithmetic': "Dört işlem becerilerini ölçen, gerçekçi senaryolar oluştur. Toplama için bir araya getirme, çıkarma için eksilme, çarpma için gruplama ve bölme için paylaştırma temalarını kullan.",
    'fractions': "Kesirlerle ilgili olarak pizza dilimleri, pasta paylaşımı, tarif malzemeleri gibi somut ve anlaşılır senaryolar kullan.",
    'decimals': "Ondalık sayılar için para (TL, kuruş), uzunluk (metre, santimetre) veya ağırlık (kilogram, gram) gibi günlük hayattan ölçüm senaryoları oluştur.",
    'place-value': "Basamak değeri için nüfus, şehirler arası mesafe gibi büyük sayıların geçtiği bağlamlar kullan. Sorular, bir rakamın bulunduğu yere göre değerini sorgulamalıdır.",
    'rhythmic-counting': "Ritmik sayma için nesne koleksiyonları, adım sayma veya takvim gibi düzenli artış gösteren durumlar hakkında senaryolar oluştur.",
    'geometry': "Geometri için bir bahçenin, odanın veya nesnenin çevresini/alanını hesaplamayı gerektiren, betimleyici ve görsel düşünmeyi teşvik eden problemler oluştur.",
    'measurement': "Ölçü birimleri için yemek tarifi, yolculuk planı veya alışveriş gibi birimler arası dönüşüm (örn: kg'dan g'a, m'den cm'ye) gerektiren pratik problemler oluştur.",
    'none': "Genel yetenekleri ölçen, mantıksal düşünme gerektiren matematik problemleri oluştur.",
};


export const generateContextualWordProblems = async (module: string, settings: any): Promise<Problem[]> => {
    const { problemsPerPage = 5, useVisuals = false, topic = 'Genel', gradeLevel = '3', customPrompt = '', operationCount = 1 } = settings;

    if (customPrompt) {
        return generateProblems(customPrompt, problemsPerPage);
    }
    
    const visualInstruction = useVisuals ? "Soruların içine, konuyla ilgili anlamlı bir emoji ekleyerek metni görsel olarak zenginleştir." : "";
    const moduleInstruction = getModulePromptSnippets[module] || getModulePromptSnippets['none'];

    const prompt = `
        Rol: İlkokul ${gradeLevel}. sınıf seviyesine uygun, yaratıcı ve eğitici metin problemleri hazırlayan bir matematik öğretmenisin.
        Görev: Aşağıdaki kurallara göre Türkçe matematik problemleri oluştur.
        
        Kurallar:
        1.  **Konu:** Problemler '${topic}' teması etrafında şekillenmelidir.
        2.  **Modül Uzmanlığı:** ${moduleInstruction}
        3.  **İşlem Sayısı:** Her problem ${operationCount} adet mantıksal adım veya işlem içermelidir.
        4.  **Görsel Destek:** ${visualInstruction}
        5.  **Dil:** Cümleler net, anlaşılır ve belirtilen sınıf seviyesine uygun olmalıdır.
    `;
    
    return generateProblems(prompt, problemsPerPage);
};

type SpecialModuleType = DyslexiaSubModuleType | DyscalculiaSubModuleType | DysgraphiaSubModuleType;

export const generateSpecialAIProblem = async (subModule: SpecialModuleType, settings: any, count: number): Promise<Problem[]> => {
    
    const systemInstruction = "Sen; disleksi, diskalkuli ve disgrafi gibi özel öğrenme güçlükleri konusunda uzman bir eğitimci ve materyal geliştiricisisin. Hazırladığın tüm içerikler, bu çocukların ihtiyaçlarına yönelik olarak aşırı derecede basit, net, teşvik edici ve kafa karıştırıcı unsurlardan arındırılmış olmalıdır.";

    let prompt = `
        Rol: ${systemInstruction}
        Görev: Aşağıda belirtilen alt modül ve ayarlara göre ${count} tane Türkçe alıştırma oluştur.
    `;

    switch(subModule) {
        // DYSLEXIA
        case 'comprehension-explorer':
            prompt += `
                - **Alıştırma:** Okuduğunu Anlama (Disleksi Odaklı)
                - **Ayarlar:** Sınıf Seviyesi: ${settings.gradeLevel}, Metin Uzunluğu: ${settings.textLength}, Soru Türü: ${settings.questionType}.
                - **Kurallar:**
                  1. Çok basit, kısa ve net cümleler kullan.
                  2. Olay örgüsü kronolojik ve takip etmesi kolay olsun.
                  3. Sadece sık kullanılan, temel kelimeleri tercih et.
                  4. 'question' alanına önce metni, sonra metinle ilgili 2-3 adet doğrudan ve net soru ekle.
                  5. 'answer' alanına sadece kısa ve net cevapları yaz.`;
            break;
        case 'vocabulary-explorer':
            prompt += `
                - **Alıştırma:** Kelime Bilgisi (Disleksi Odaklı)
                - **Ayarlar:** Sınıf Seviyesi: ${settings.gradeLevel}, Zorluk: ${settings.difficulty}.
                - **Kurallar:**
                  1. Sınıf seviyesine uygun, fonetik olarak düzenli (okunduğu gibi yazılan) kelimeler seç.
                  2. 'question' alanına kelimenin çok basit bir tanımını ve içinde o kelimenin geçtiği kısa bir örnek cümle yaz.
                  3. 'answer' alanına SADECE hedeflenen kelimeyi yaz.`;
            break;
        case 'interactive-story':
             prompt += `
                - **Alıştırma:** Etkileşimli Hikaye (Disleksi Odaklı)
                - **Ayarlar:** Sınıf Seviyesi: ${settings.gradeLevel}, Tür: ${settings.genre}.
                - **Kurallar:**
                  1. Hikayenin 2-3 kısa cümleden oluşan bir bölümünü yaz.
                  2. Sonunda okuyucunun yapması gereken net bir seçim sun (Örn: "A yolunu seç" veya "B kutusunu aç").
                  3. 'question' alanında hikaye ve seçenekler bulunsun.
                  4. 'answer' alanına seçimin olası bir sonucu hakkında kısa bir cümle yaz.`;
            break;
        
        // DYSCALCULIA
        case 'problem-solving':
            prompt += `
                - **Alıştırma:** Problem Çözme (Diskalkuli Odaklı)
                - **Ayarlar:** Sınıf Seviyesi: ${settings.gradeLevel}, Konu: ${settings.topic || 'Günlük Yaşam'}.
                - **ÇOK ÖNEMLİ KURALLAR:**
                  1. **Tek Adım:** Problem SADECE tek bir toplama veya çıkarma işlemi gerektirmelidir.
                  2. **Küçük Sayılar:** Sonuç dahil TÜM sayılar 10'u geçmemelidir (1. sınıf için) veya 20'yi geçmemelidir (2. ve 3. sınıflar için).
                  3. **Somut Nesneler:** Elma, araba, top gibi somut, sayılabilir nesneler kullan.
                  4. **Net Soru:** Soru cümlesi "Toplam kaç tane ... oldu?" veya "Kaç tane ... kaldı?" gibi çok net ve doğrudan olmalıdır.
                  5. **Sıfır Gereksiz Bilgi:** Hikayede sadece işlem için zorunlu olan bilgiler bulunsun. Renk, boyut gibi dikkat dağıtıcı detaylardan kaçın.
                  6. **Örnek:** 'Ayşe'nin 3 kalemi vardı. Ali ona 2 kalem daha verdi. Ayşe'nin toplam kaç kalemi oldu?'`;
            break;
        case 'interactive-story-dc':
             prompt += `
                - **Alıştırma:** Etkileşimli Hikaye (Diskalkuli Odaklı)
                - **Ayarlar:** Sınıf Seviyesi: ${settings.gradeLevel}, Tür: ${settings.genre}.
                - **Kurallar:**
                  1. Hikaye, basit bir matematiksel karar vermeyi gerektirmelidir (örn: 2 elma mı, 3 elma mı almalı?).
                  2. Sayılar çok küçük (genellikle 5'in altında) ve sayma işlemi basit olmalıdır.
                  3. Problem, hikayenin doğal bir parçası gibi sunulmalıdır.`;
            break;

        // DYSGRAPHIA
        case 'picture-sequencing':
            prompt += `
                - **Alıştırma:** Resim Sıralama Hikayecisi (Disgrafi Odaklı)
                - **Ayarlar:** Hikaye Uzunluğu: ${settings.storyLength} adım, Konu: ${settings.topic || 'Günlük bir aktivite'}.
                - **Kurallar:**
                  1. Belirtilen konu hakkında ${settings.storyLength} adımlı, çok basit ve kronolojik bir olay dizisi oluştur.
                  2. Her adım, tek bir kısa cümleden oluşmalı ve net bir eylemi tanımlamalıdır (Örn: "1. Tohumu ekti.", "2. Tohuma su verdi.", "3. Çiçek büyüdü.").
                  3. 'question' alanına bu adımları karışık sırada yaz.
                  4. 'answer' alanına doğru sıralamayı sayılarla yaz (örn: "2, 1, 3").`;
            break;
        case 'writing-planning':
            prompt += `
                - **Alıştırma:** Yazı Planlama (Disgrafi Odaklı)
                - **Ayarlar:** Konu: ${settings.topic || 'Serbest'}.
                - **Kurallar:**
                  1. Verilen konu hakkında bir metin yazmak için 3 adımlı basit bir taslak oluştur.
                  2. Taslak "Giriş:", "Gelişme:", "Sonuç:" başlıklarını içermelidir.
                  3. Her başlığın altına, o bölümde ne yazılacağını anlatan SADECE BİRER TANE kısa ve yol gösterici cümle yaz.
                  4. 'question' alanında sadece konu belirtilsin.
                  5. 'answer' alanında 3 adımlı taslak olsun.`;
            break;
        case 'creative-writing':
            prompt += `
                - **Alıştırma:** Yaratıcı Yazarlık (Disgrafi Odaklı)
                - **Ayarlar:** Tür: ${settings.promptType}, Konu: ${settings.topic || 'Serbest'}.
                - **Kurallar:**
                  1. Öğrencinin hayal gücünü tetikleyecek, çok kısa (en fazla iki cümle) ve ilgi çekici bir başlangıç oluştur.
                  2. Başlangıç, öğrenciyi hemen "sonra ne oldu?" diye düşünmeye teşvik etmelidir. Boş sayfa kaygısını azaltmayı hedefle.
                  3. 'question' alanında oluşturduğun başlangıç cümlesi/senaryosu yer alsın.
                  4. 'answer' alanına "Öğrencinin yaratıcılığına bırakılmıştır." yaz.`;
            break;
        case 'interactive-story-dg':
            prompt += `
                - **Alıştırma:** Hikaye Macerası (Disgrafi Odaklı)
                - **Ayarlar:** Sınıf Seviyesi: ${settings.gradeLevel}, Tür: ${settings.genre}.
                - **Kurallar:**
                  1. Öğrencinin SADECE BİR CÜMLE ile devam ettirebileceği, merak uyandıran bir hikaye başlangıcı (1-2 cümle) oluştur.
                  2. 'question' alanında hikaye başlangıcı ve "Şimdi sen devam et:" gibi bir yönlendirme olsun.
                  3. 'answer' alanına "Öğrencinin hayal gücüne göre değişir." yaz.`;
            break;
        default:
             return [{ question: 'Bu modül için AI desteği henüz mevcut değil.', answer: '', category: 'ai-error' }];
    }

    // Since this function now has its own system instruction, we call generateContent directly.
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: { type: Type.ARRAY, items: problemSchema },
                temperature: 0.9,
            }
        });
        if (response.text) return parseJsonResponse(response.text);
        throw new Error("Gemini API'den boş yanıt alındı.");
    } catch (error) {
        console.error("Gemini API (Special) çağrılırken hata:", error);
        return [{ question: "Yapay zeka ile özel alıştırma oluşturulurken bir hata oluştu.", answer: "API Hatası", category: 'error' }];
    }
};