// services/placeValueService.ts

// FIX: Add .ts extension to import path
import { Problem, PlaceValueSettings, PlaceValueProblemType } from '../types.ts';
// FIX: Add .ts extension to import path
import { numberToWords } from './utils.ts';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomByDigits = (d: number): number => {
    if (d === 1) return getRandomInt(0, 9);
    return getRandomInt(Math.pow(10, d - 1), Math.pow(10, d) - 1);
};
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};


export const generatePlaceValueProblem = (settings: PlaceValueSettings): { problem: Problem, title: string, error?: string } => {
    const { type, digits, roundingPlace, fromWordsOrder, fromWordsFormat } = settings;
    const problemBase = { category: 'place-value' };
    let title = 'Basamak Değeri Alıştırmaları';
    let problem: Problem;
    
    const number = getRandomByDigits(digits);

    switch (type) {
        case PlaceValueProblemType.Identification: {
            title = "Basamak Değeri Bulma";
            const numStr = String(number);
            const index = getRandomInt(0, numStr.length - 1);
            const digit = numStr[index];
            const placeValue = parseInt(digit) * Math.pow(10, numStr.length - 1 - index);
            
            const highlightedNumber = numStr.split('').map((d, i) => i === index ? `<u style="font-weight: bold;">${d}</u>` : d).join('');
            const question = `<b>${highlightedNumber}</b> sayısında altı çizili rakamın basamak değeri kaçtır?`;
            problem = { ...problemBase, question, answer: placeValue };
            break;
        }
        case PlaceValueProblemType.Rounding: {
            title = "Sayı Yuvarlama";
            let place: 'tens' | 'hundreds' | 'thousands' = 'tens';
            let divisor = 10;
            const availablePlaces: ('tens' | 'hundreds' | 'thousands')[] = [];
            if (digits >= 2) availablePlaces.push('tens');
            if (digits >= 3) availablePlaces.push('hundreds');
            if (digits >= 4) availablePlaces.push('thousands');

            if (roundingPlace === 'auto') {
                place = availablePlaces[getRandomInt(0, availablePlaces.length - 1)];
            } else {
                place = roundingPlace as 'tens' | 'hundreds' | 'thousands';
            }

            let placeName = '';
            switch (place) {
                case 'tens': divisor = 10; placeName = 'onluğa'; break;
                case 'hundreds': divisor = 100; placeName = 'yüzlüğe'; break;
                case 'thousands': divisor = 1000; placeName = 'binliğe'; break;
            }

            const answer = Math.round(number / divisor) * divisor;
            const question = `<b>${number}</b> sayısını en yakın ${placeName} yuvarlayınız.`;
            problem = { ...problemBase, question, answer };
            break;
        }
        case PlaceValueProblemType.ExpandedForm: {
            title = "Sayı Çözümleme";
            const numStr = String(number);
            const parts: string[] = [];
            for (let i = 0; i < numStr.length; i++) {
                const digit = parseInt(numStr[i]);
                if (digit > 0) {
                    const placeValue = digit * Math.pow(10, numStr.length - 1 - i);
                    parts.push(String(placeValue));
                }
            }
            const question = `<b>${number}</b> sayısını çözümleyiniz.`;
            const answer = parts.join(' + ');
            problem = { ...problemBase, question, answer };
            break;
        }
        case PlaceValueProblemType.FromExpanded: {
            title = "Çözümlenmiş Sayıyı Bulma";
             const numStr = String(number);
            const parts: string[] = [];
            for (let i = 0; i < numStr.length; i++) {
                const digit = parseInt(numStr[i]);
                if (digit > 0) {
                    const placeValue = digit * Math.pow(10, numStr.length - 1 - i);
                    parts.push(String(placeValue));
                }
            }
            const question = `Çözümlenmiş hali <b>${shuffleArray(parts).join(' + ')}</b> olan sayı kaçtır?`;
            problem = { ...problemBase, question, answer: number };
            break;
        }
        case PlaceValueProblemType.FromWords: {
            title = "Basamak Değerinden Sayı Oluşturma";
            const numStr = String(number);
            const placeNames = ['birlik', 'onluk', 'yüzlük', 'binlik', 'on binlik', 'yüz binlik', 'milyonluk'];
            const parts: string[] = [];
            for (let i = 0; i < numStr.length; i++) {
                const digit = parseInt(numStr[i]);
                const placeIndex = numStr.length - 1 - i;
                if (digit > 0) {
                    parts.push(`${digit} ${placeNames[placeIndex]}`);
                }
            }
            const displayParts = fromWordsOrder === 'mixed' ? shuffleArray(parts) : parts.reverse();
            
            const questionText = fromWordsFormat === 'vertical'
                ? `<div style="text-align: left; display: inline-block;">${displayParts.join('<br>')}</div>`
                : displayParts.join(' + ');

            const question = `Aşağıdaki basamak değerlerinden oluşan sayı kaçtır?<br/><b>${questionText}</b>`;
            problem = { ...problemBase, question, answer: number };
            break;
        }
        case PlaceValueProblemType.WriteInWords: {
            title = "Sayıları Yazıyla Yazma";
            const question = `<b>${number}</b> sayısının okunuşunu yazınız.`;
            const answer = numberToWords(number);
            problem = { ...problemBase, question, answer };
            break;
        }
         case PlaceValueProblemType.WordsToNumber: {
            title = "Okunuşu Verilen Sayıyı Yazma";
            const words = numberToWords(number);
            const question = `Okunuşu <b>"${words}"</b> olan sayıyı yazınız.`;
            problem = { ...problemBase, question, answer: number };
            break;
        }
        case PlaceValueProblemType.Comparison: {
            title = "Sayıları Karşılaştırma";
            let num2 = getRandomByDigits(digits);
            while (num2 === number) {
                num2 = getRandomByDigits(digits);
            }
            const question = `Aşağıdaki sayıların arasına <b>&lt;, &gt;, =</b> işaretlerinden uygun olanı koyunuz.<br/><div style="font-size: 1.5rem; font-family: monospace; margin-top: 0.5rem;">${number} ___ ${num2}</div>`;
            const answer = number > num2 ? '>' : '<';
            problem = { ...problemBase, question, answer };
            break;
        }
        case PlaceValueProblemType.NumberFromClues: {
             title = "Sayı Bulmaca";
             const numStr = String(number);
             const clues: string[] = [];
             const usedIndexes: number[] = [];

             for (let i = 0; i < Math.min(numStr.length, 3); i++) {
                 let index = getRandomInt(0, numStr.length - 1);
                 while(usedIndexes.includes(index)) {
                     index = getRandomInt(0, numStr.length - 1);
                 }
                 usedIndexes.push(index);

                 const placeNames = ['Birler', 'Onlar', 'Yüzler', 'Binler', 'On Binler', 'Yüz Binler', 'Milyonlar'];
                 const placeIndex = numStr.length - 1 - index;
                 clues.push(`${placeNames[placeIndex]} basamağım <b>${numStr[index]}</b>.`);
             }
             const question = `Ben kimim?<ul style="list-style-type: '❓'; padding-left: 2rem; margin-top: 0.5rem;">${clues.map(c => `<li>${c}</li>`).join('')}</ul>`;
             problem = { ...problemBase, question, answer: number };
             break;
        }
        case PlaceValueProblemType.ResultAsWords: {
            title = "İşlem Sonucunu Yazıyla Yazma";
            const n1 = getRandomInt(10, 500);
            const n2 = getRandomInt(10, 500);
            const question = `<b>${n1} + ${n2}</b> işleminin sonucunu yazıyla yazınız.`;
            const answer = numberToWords(n1 + n2);
             problem = { ...problemBase, question, answer };
            break;
        }
        default:
            problem = { ...problemBase, question: 'Hata', answer: 'Hata' };
            return { problem, title: 'Hata', error: 'Geçersiz basamak değeri problemi türü' };
    }
    return { problem, title };
};