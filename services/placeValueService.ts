

import { Problem, PlaceValueProblemType, PlaceValueSettings } from '../types';
import { numberToWords } from './utils';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomByDigits = (digits: number): number => {
    if (digits === 1) return getRandomInt(0, 9);
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return getRandomInt(min, max);
}

export const generatePlaceValueProblem = (settings: PlaceValueSettings): { problem: Problem, title: string, error?: string } => {
    const { type, digits } = settings;
    const effectiveDigits = (type === PlaceValueProblemType.Rounding && digits < 2) ? 2 : digits;
    const num = getRandomByDigits(effectiveDigits);

    let problem: Problem;
    let title = '';
    const problemBase = { category: 'place-value' };
    
    const problemTypeTitles: { [key in PlaceValueProblemType]: string } = {
        [PlaceValueProblemType.Identification]: "Verilen sayılarda altı çizili rakamın basamak değerini bulunuz.",
        [PlaceValueProblemType.Rounding]: "Sayıları belirtilen en yakın basamağa yuvarlayınız.",
        [PlaceValueProblemType.ExpandedForm]: "Verilen sayıları çözümlenmiş (açınım) halleriyle yazınız.",
        [PlaceValueProblemType.FromExpanded]: "Çözümlenmiş hali verilen sayıları bulunuz.",
        [PlaceValueProblemType.WriteInWords]: "Verilen sayıların okunuşlarını yazınız.",
        [PlaceValueProblemType.WordsToNumber]: "Okunuşu verilen sayıları rakamla yazınız.",
        [PlaceValueProblemType.Comparison]: "Sayıların arasına <, > veya = işaretlerinden uygun olanı koyunuz.",
        [PlaceValueProblemType.ResultAsWords]: "Aşağıdaki işlemlerin sonucunu yazıyla yazınız."
    };
    title = problemTypeTitles[type];


    switch (type) {
        case PlaceValueProblemType.Identification: {
            const numStr = String(num);
            const digitIndex = getRandomInt(0, numStr.length - 1);
            const placeNames = ["birler", "onlar", "yüzler", "binler", "on binler", "yüz binler", "milyonlar"];
            const placeName = placeNames[numStr.length - 1 - digitIndex];

            const questionHtml = numStr.split('').map((char, index) => 
                index === digitIndex ? `<span style="text-decoration: underline; font-weight: bold;">${char}</span>` : char
            ).join('');

            const question = `<div style="font-size: 1.25em; font-family: monospace;">${questionHtml}</div>`;
            const answer = parseInt(numStr[digitIndex]) * Math.pow(10, numStr.length - 1 - digitIndex);
            problem = { ...problemBase, question, answer };
            break;
        }
        
        case PlaceValueProblemType.Rounding: {
            if (num < 10) {
                return { 
                    problem: { ...problemBase, question: 'Hata', answer: 'Hata' }, 
                    title: "Hata",
                    error: "Yuvarlama işlemi için en az 2 basamaklı sayılar gerekir. Lütfen 'Basamak Sayısı' ayarını artırın."
                };
            }
            const { roundingPlace = 'auto' } = settings;
            const numStr = String(num);
            
            let roundToIndex: number;

            switch(roundingPlace) {
                case 'tens':
                    roundToIndex = 1;
                    break;
                case 'hundreds':
                    roundToIndex = 2;
                    break;
                case 'thousands':
                    roundToIndex = 3;
                    break;
                case 'auto':
                default:
                    roundToIndex = getRandomInt(1, numStr.length - 1);
                    break;
            }

            // Safety check for invalid rounding place vs digits
            if (roundToIndex >= numStr.length) {
                roundToIndex = numStr.length - 1;
            }

            const placeNames = ["onluğa", "yüzlüğe", "binliğe", "on binliğe", "yüz binliğe", "milyonluğa"];
            const placeName = placeNames[roundToIndex - 1];
            
            const question = `<div style="font-size: 1.25em; font-family: monospace;">${num} ➞ En yakın ${placeName}</div>`;
            const roundToPlace = Math.pow(10, roundToIndex);
            const answer = Math.round(num / roundToPlace) * roundToPlace;
            problem = { ...problemBase, question, answer };
            break;
        }

        case PlaceValueProblemType.ExpandedForm: {
             const numStr = String(num);
             let parts = [];
             for(let i = 0; i < numStr.length; i++){
                const digit = parseInt(numStr[i]);
                if (digit > 0) {
                    const placeValue = Math.pow(10, numStr.length - 1 - i);
                    parts.push(digit * placeValue);
                }
             }
             const question = `<span style="font-size: 1.25em; font-family: monospace;">${num}</span>`;
             const answer = parts.join(' + ');
             problem = { ...problemBase, question, answer };
             break;
        }

        case PlaceValueProblemType.FromExpanded: {
            const numStr = String(num);
            let parts = [];
            for(let i = 0; i < numStr.length; i++){
               const digit = parseInt(numStr[i]);
               if (digit > 0) {
                   const placeValue = Math.pow(10, numStr.length - 1 - i);
                   parts.push(`${digit * placeValue}`);
               }
            }
            parts.sort(() => Math.random() - 0.5); // shuffle parts
            const question = `<span style="font-size: 1.25em; font-family: monospace;">${parts.join(' + ')}</span>`;
            problem = { ...problemBase, question, answer: num };
            break;
        }

        case PlaceValueProblemType.WriteInWords: {
            const question = `<span style="font-size: 1.25em; font-family: monospace;">${num}</span>`;
            const answer = numberToWords(num);
            problem = { ...problemBase, question, answer };
            break;
        }

        case PlaceValueProblemType.WordsToNumber: {
            const words = numberToWords(num);
            const question = `<span style="font-size: 1.1em;">${words}</span>`;
            problem = { ...problemBase, question, answer: num };
            break;
        }

        case PlaceValueProblemType.Comparison: {
            let attempts = 0;
            while (attempts < 100) {
                const num2 = getRandomByDigits(digits);
                if (num !== num2) {
                    const question = `<span style="font-size: 1.25em; font-family: monospace;">${num} ___ ${num2}</span>`;
                    const answer = num > num2 ? '>' : '<';
                    problem = { ...problemBase, question, answer };
                    return { problem, title };
                }
                attempts++;
            }
             return {
                problem: { ...problemBase, question: 'Hata', answer: 'Hata' },
                title: "Hata",
                error: "Rastgele üretilen sayılar sürekli aynı geldiği için problem oluşturulamadı. Lütfen tekrar deneyin."
            };
        }
        
        case PlaceValueProblemType.ResultAsWords: {
            const num1 = getRandomByDigits(digits);
            const num2 = getRandomByDigits(digits);
            const operation = Math.random() < 0.5 ? 'addition' : 'subtraction';

            let question: string;
            let result: number;

            if (operation === 'addition') {
                question = `<span style="font-size: 1.25em; font-family: monospace;">${num1} + ${num2} = ?</span>`;
                result = num1 + num2;
            } else { // subtraction
                if (num1 < num2) {
                    question = `<span style="font-size: 1.25em; font-family: monospace;">${num2} - ${num1} = ?</span>`;
                    result = num2 - num1;
                } else {
                    question = `<span style="font-size: 1.25em; font-family: monospace;">${num1} - ${num2} = ?</span>`;
                    result = num1 - num2;
                }
            }

            const answer = numberToWords(result);
            problem = { ...problemBase, question, answer };
            break;
        }
        
        default:
            problem = { ...problemBase, question: 'Hata', answer: 'Hata' };
    }
    return { problem, title };
};