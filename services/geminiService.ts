import { GoogleGenAI, Type } from "@google/genai";
import { Problem, WordProblemSettings, DyslexiaSubModuleType } from '../types';
import { TABS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateProblemsWithPrompt = async (prompt: string): Promise<Omit<Problem, 'category'>[]> => {
     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        problems: {
                            type: Type.ARRAY,
                            description: "A list of math word problems.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: {
                                        type: Type.STRING,
                                        description: "The math problem question."
                                    },
                                    answer: {
                                        type: Type.STRING,
                                        description: "The answer to the math problem, including a brief explanation."
                                    }
                                },
                                required: ['question', 'answer']
                            }
                        }
                    },
                    required: ['problems']
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result && result.problems && Array.isArray(result.problems)) {
            // The API might return answers as numbers, so let's ensure they are strings.
            return result.problems.map((p: any) => ({
                question: p.question,
                answer: String(p.answer)
            }));
        } else {
            throw new Error("Invalid response format from Gemini API.");
        }

    } catch (error: any) {
        console.error("Error generating word problems with Gemini:", error);
        
        const errorMessage = error.toString();
        if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
            throw new Error("Yapay zeka kullanım limitinize ulaştınız. Lütfen bir dakika bekleyip tekrar deneyin. Bu hata genellikle kısa sürede çok fazla istek gönderildiğinde oluşur.");
        }

        throw new Error("AI ile problem oluşturulurken bir hata oluştu. Lütfen API anahtarınızı kontrol edin veya daha sonra tekrar deneyin.");
    }
};


const generatePrompt = (settings: WordProblemSettings): string => {
    let prompt: string;
    const totalProblems = settings.problemsPerPage * settings.pageCount;
    if (settings.customPrompt) {
        prompt = settings.customPrompt;
    } else {
        let subjectText = '';
        if (settings.sourceModule && settings.sourceModule !== 'none') {
            const moduleName = TABS.find(tab => tab.id === settings.sourceModule)?.label;
            subjectText = moduleName ? `${moduleName} konusuyla ilgili` : 'genel konularda';
            if (settings.topic) {
                subjectText += `, özel olarak '${settings.topic}' temasına odaklanarak,`;
            }
        } else {
            subjectText = `${settings.topic} konusuyla ilgili,`;
        }
        
        prompt = `${settings.gradeLevel}. sınıf seviyesinde, ${subjectText} tam olarak ${settings.operationCount} işlem gerektiren, toplam ${totalProblems} tane matematik problemi oluştur.`;
        if (settings.operationCount > 1) {
            prompt += ` Bu problemler, öğrencilerin çözüme ulaşmak için birden fazla adım atmasını gerektirmelidir. Örneğin, önce toplama sonra çıkarma yapmaları gerekebilir. Problemlerin senaryoları mantıklı bir bütünlük içinde olmalıdır.`;
        }
    }
    
    if (settings.useVisuals) {
        prompt += ` Problemin metnine, geçen nesnelerle ilgili uygun emojileri (örneğin, elma için 🍎, araba için 🚗) problem akıcılığını bozmayacak şekilde ve çok sık tekrar etmeden yerleştir.`;
    }
    
    // Consistent answer format instruction
    prompt += ` Her problem için bir "question" ve bir "answer" alanı olan bir JSON nesnesi döndür. "answer" alanı, önce sayısal sonucu ve birimini (örneğin "15 elma", "120 TL"), ardından parantez içinde kısa bir çözüm açıklaması içermelidir (örneğin "83 (Çözüm: 45 + 38 = 83)"). Cevaplar net, anlaşılır ve Türkçe olmalıdır.`;
    
    return prompt;
};

export const generateWordProblems = async (settings: WordProblemSettings): Promise<Problem[]> => {
    const prompt = generatePrompt(settings);
    const problems = await generateProblemsWithPrompt(prompt);
    return problems.map(p => ({ ...p, category: 'word-problems' }));
};


export const generateContextualWordProblems = async (category: string, settings: any): Promise<Problem[]> => {
    let prompt = '';
    const count = settings.problemsPerPage * settings.pageCount;
    const gradeLevel = `${settings.gradeLevel || 'İlkokul'}. sınıf`;
    const topicText = settings.topic ? `, özel olarak '${settings.topic}' temalı,` : '';
    
    switch(category) {
        case 'arithmetic': {
            const opNames: {[key: string]: string} = { 'addition': 'toplama', 'subtraction': 'çıkarma', 'multiplication': 'çarpma', 'division': 'bölme', 'mixed-add-sub': 'toplama ve çıkarma', 'mixed-all': 'dört işlem' };
            let scenarioHint = 'Alışveriş, paylaşma, oyun gibi günlük yaşam senaryoları kullan.';
            switch(settings.operation) {
                case 'addition': scenarioHint = 'Örneğin, bir şeye yeni öğeler ekleme (bilye, pul koleksiyonu) veya iki grubun toplamını bulma gibi senaryolar kullan.'; break;
                case 'subtraction': scenarioHint = 'Örneğin, bir miktardan harcama yapma (para), bir şeylerin eksilmesi (elmaların yenmesi) veya iki miktar arasındaki farkı bulma gibi senaryolar kullan.'; break;
                case 'multiplication': scenarioHint = 'Örneğin, her birinde eşit sayıda nesne bulunan grupların (kutu, paket) toplamını bulma veya katlarını alma gibi senaryolar kullan.'; break;
                case 'division': scenarioHint = 'Örneğin, bir grup nesneyi eşit olarak paylaştırma (şeker, misket) veya büyük bir miktarın içinde kaç tane küçük grup olduğunu bulma gibi senaryolar kullan.'; break;
            }
            prompt = `${gradeLevel} seviyesi için, ${opNames[settings.operation]} işlemi içeren${topicText} tam olarak ${settings.operationCount || 1} işlem gerektiren, ${count} tane gerçek hayat problemi oluştur. Problemler, ${settings.digits1} basamaklı ve ${settings.digits2} basamaklı sayılar içermelidir. ${scenarioHint}`;
            if (settings.operationCount > 1) {
                prompt += ` Problemler, öğrencilerin çözüme ulaşmak için birden fazla adım atmasını gerektirmelidir.`;
            }
            break;
        }
        case 'fractions': {
            const fracOp: {[key: string]: string} = { 'addition': 'toplama', 'subtraction': 'çıkarma', 'multiplication': 'çarpma', 'division': 'bölme', 'mixed': 'karışık dört işlem' };
            const diff: {[key: string]: string} = { 'easy': 'paydaları eşit basit kesirler', 'medium': 'paydaları farklı basit kesirler', 'hard': 'tam sayılı ve bileşik kesirler' };
            let scenarioHint = 'Pizza dilimleri, yemek tarifleri, ölçüler gibi senaryolar kullan.';
            switch(settings.operation) {
                case 'addition':
                case 'subtraction': 
                    scenarioHint = 'Örneğin, bir bütünün parçalarını birleştirme veya çıkarma üzerine odaklan. Bir pastanın veya pizzanın yenen dilimleri, bir sürahideki suyun bir kısmının kullanılması gibi senaryolar idealdir.'; break;
                case 'multiplication': 
                    scenarioHint = 'Örneğin, bir kesrin başka bir kesir kadarını bulma üzerine odaklan. Bir yemek tarifinin yarısını yapma veya bir arsanın 3/4\'ünün 1/2\'sini satma gibi senaryolar kullan.'; break;
                case 'division': 
                    scenarioHint = 'Örneğin, bir kesri tam sayıya veya başka bir kesre bölme üzerine odaklan. Yarım bir keki 3 kişiye paylaştırma veya 3/4 metrelik bir kurdeleden kaç tane 1/8 metrelik parça çıkacağını bulma gibi senaryolar kullan.'; break;
            }
            prompt = `${gradeLevel} seviyesi için, ${diff[settings.difficulty]} kullanarak kesirlerle ${fracOp[settings.operation]} işlemi gerektiren${topicText} tam olarak ${settings.operationCount || 1} işlem gerektiren, ${count} tane ilgi çekici ve gerçekçi metin problemi oluştur. ${scenarioHint}`;
             if (settings.operationCount > 1) {
                prompt += ` Problemler, öğrencilerin çözüme ulaşmak için birden fazla adım atmasını gerektirmelidir.`;
            }
            break;
        }
        case 'decimals': {
            const decOp: {[key: string]: string} = { 'addition': 'toplama', 'subtraction': 'çıkarma', 'multiplication': 'çarpma', 'division': 'bölme', 'mixed': 'karışık dört işlem' };
            prompt = `${gradeLevel} seviyesinde, ondalık sayılarla ${decOp[settings.operation]} işlemi gerektiren${topicText} tam olarak ${settings.operationCount || 1} işlem gerektiren, ${count} tane gerçek hayat problemi oluştur. Problemler para (TL, kuruş), ölçümler (metre, kg) veya spor istatistikleri gibi konularla ilgili olsun. Zorluk seviyesi: ${settings.difficulty}.`;
             if (settings.operationCount > 1) {
                prompt += ` Problemler, öğrencilerin çözüme ulaşmak için birden fazla adım atmasını gerektirmelidir.`;
            }
            break;
        }
        case 'place-value': {
            const pvType: {[key: string]: string} = { 'identification': 'basamak değeri bulma', 'rounding': 'yuvarlama', 'comparison': 'sayıları karşılaştırma' };
            prompt = `${gradeLevel} seviyesinde, basamak değeriyle ilgili${topicText} ${count} tane gerçek hayat problemi oluştur. Problemler ${settings.digits} basamağa kadar olan sayıları içermeli ve özellikle "${pvType[settings.type]}" üzerine odaklanmalıdır. Örneğin, şehir nüfuslarını karşılaştırma, fiyatları yuvarlama gibi.`;
            break;
        }
        case 'rhythmic-counting': {
            prompt = `${gradeLevel} seviyesinde, ${settings.step}'er ritmik sayma veya sayı örüntüleri içeren${topicText} ${count} tane gerçek hayat problemi oluştur. Problemler, gruplar halinde nesneleri sayma veya bir olay dizisindeki sonraki adımı tahmin etme gibi senaryolar içermelidir. Yön: ${settings.direction}.`;
            break;
        }
        case 'time': {
            const timeType: {[key: string]: string} = { 'calculate-duration': 'süre hesaplama', 'calculate-end-time': 'bitiş zamanı bulma', 'find-start-time': 'başlangıç zamanı bulma'};
            const timeDiff: {[key: string]: string} = { 'easy': 'kolay (sadece tam saatler)', 'medium': 'orta (yarım ve çeyrek saatler)', 'hard': 'zor (belirli dakikalar)'};
            prompt = `${gradeLevel} seviyesi için, zaman ölçme ile ilgili${topicText} ${count} tane gerçek hayat problemi oluştur. Problemler "${timeType[settings.type]}" konusuna odaklanmalı ve zorluk seviyesi ${timeDiff[settings.difficulty]} olmalıdır. Örneğin, bir filmin ne kadar sürdüğünü bulma, bir etkinliğin ne zaman biteceğini hesaplama veya bir yolculuğun başlangıç saatini bulma gibi senaryolar kullan.`;
            break;
        }
        case 'geometry': {
            const geoType: {[key: string]: string} = { 'perimeter': 'çevre', 'area': 'alan', 'solid-elements': 'geometrik cisimlerin elemanları (köşe, yüz, ayrıt)' };
            const shape: {[key: string]: string} = { 'square': 'kare', 'rectangle': 'dikdörtgen', 'triangle': 'üçgen', 'circle': 'daire' };
            const typeString = geoType[settings.type] || 'geometri';
            const shapeString = settings.shape ? `bir ${shape[settings.shape]}'nin` : '';

            prompt = `${gradeLevel} seviyesinde, geometri ile ilgili${topicText} ${count} tane gerçek hayat problemi oluştur. Problemler ${shapeString} ${typeString} hesabını içermelidir. Örneğin, bir bahçenin alanını bulma, bir çitin uzunluğunu hesaplama veya bir kutunun köşe sayısını bulma gibi.`;
            break;
        }
        case 'measurement': {
            const measureType: {[key: string]: string} = { 'length-conversion': 'uzunluk ölçüleri (km, m, cm)', 'weight-conversion': 'ağırlık ölçüleri (kg, g)', 'volume-conversion': 'hacim ölçüleri (L, mL)', 'mixed': 'uzunluk, ağırlık ve hacim ölçüleri'};
            const diff: {[key: string]: string} = { 'easy': 'kolay (tam sayılarla basit dönüşümler)', 'medium': 'orta (ondalıklı sayılarla dönüşümler)', 'hard': 'zor (birden fazla birimi içeren dönüşümler)', 'mixed': 'karışık'};
            prompt = `${gradeLevel} seviyesi için, ${measureType[settings.type]} ile ilgili${topicText} ${count} tane gerçek hayat problemi oluştur. Problemler birim dönüştürme üzerine odaklanmalı ve zorluk seviyesi ${diff[settings.difficulty]} olmalıdır. Örneğin, bir terzinin kumaş ölçmesi, bir manavın meyve tartması veya bir şişedeki suyun hacmi gibi senaryolar kullan.`;
            break;
        }
        default:
            prompt = `İlkokul için ${count} tane genel matematik problemi oluştur.`;
    }

    if (settings.useVisuals) {
        prompt += ` Problemin metnine, geçen nesnelerle ilgili uygun emojileri (örneğin, elma için 🍎, araba için 🚗) problem akıcılığını bozmayacak şekilde ve çok sık tekrar etmeden yerleştir.`;
    }

    prompt += ` Her problem için bir "question" ve bir "answer" alanı olan bir JSON nesnesi döndür. "answer" alanı, önce sayısal sonucu ve birimini (örneğin "15 elma", "120 TL"), ardından parantez içinde kısa bir çözüm açıklaması içermelidir (örneğin "83 (Çözüm: 45 + 38 = 83)"). Cevaplar net, anlaşılır ve Türkçe olmalıdır.`;
    const problems = await generateProblemsWithPrompt(prompt);
    return problems.map(p => ({ ...p, category }));
};


export const generateDyslexiaAIProblem = async (subModule: DyslexiaSubModuleType, settings: any, count: number): Promise<Problem[]> => {
    let prompt = '';
    const category = `dyslexia-${subModule}`;

    switch (subModule) {
        case 'comprehension-explorer': {
            const { gradeLevel, textLength, questionType } = settings;
            const lengthMap = { short: '1-2 paragraflık', medium: '3-4 paragraflık', long: '5-6 paragraflık' };
            const questionMap = { main_idea: 'ana fikrini', inference: 'çıkarım yapılabilecek yönlerini', vocabulary: 'içindeki zor bir kelimeyi', mixed: 'ana fikir, çıkarım ve kelime anlamını' };
            prompt = `Disleksisi olan ${gradeLevel}. sınıf öğrencileri için, okunaklı ve basit bir dil kullanarak ${lengthMap[textLength]} bir metin oluştur. Metnin sonunda, metnin ${questionMap[questionType]} sorgulayan ${count} tane soru hazırla.`;
            break;
        }
        case 'vocabulary-explorer': {
            const { gradeLevel, difficulty } = settings;
            prompt = `${gradeLevel}. sınıf seviyesindeki disleksili bir öğrencinin kelime dağarcığını geliştirmek için, zorluk seviyesi '${difficulty}' olan ${count} tane kelime seç.`;
            break;
        }
        case 'interactive-story': {
            const { gradeLevel, genre } = settings;
            prompt = `Disleksili ${gradeLevel}. sınıf öğrencileri için, ${genre} türünde, okuması kolay ve ilgi çekici bir interaktif hikayenin başlangıcını yaz. Hikayenin sonunda, okuyucunun hikayenin devamı için iki farklı seçenekten birini seçmesini iste.`;
            // For this module, we expect a slightly different format, so we won't use generateProblemsWithPrompt directly.
             try {
                const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
                return [{ question: response.text, answer: "Hikaye devam ediyor...", category }];
            } catch (error) {
                 console.error("Error generating interactive story:", error);
                 return [{ question: "Hikaye oluşturulamadı.", answer: "Hata", category: 'error' }];
            }
        }
        default:
            return [];
    }
    
    // For comprehension and vocabulary, use the standard JSON problem generator.
    prompt += ` Her bir problem için, 'question' alanında metin veya kelime, 'answer' alanında ise sorunun cevabı olacak şekilde bir JSON listesi döndür. Cevaplar disleksili öğrenciler için açık ve anlaşılır olmalıdır.`;

    const problems = await generateProblemsWithPrompt(prompt);
    return problems.map(p => ({ ...p, category }));
};