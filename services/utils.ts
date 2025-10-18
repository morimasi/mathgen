// --- NUMBER TO WORDS (TURKISH) ---
import { ArithmeticOperation } from '../types';

const ones = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
const tens = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
const thousands = ["", "bin", "milyon", "milyar"];

function numberToWordsTr(num: number): string {
    if (num === 0) return "sıfır";
    
    let words = "";
    let i = 0;
    
    while (num > 0) {
        let chunk = num % 1000;
        if (chunk > 0) {
            let chunkWords = "";
            let hundred = Math.floor(chunk / 100);
            let ten = Math.floor((chunk % 100) / 10);
            let one = chunk % 10;
            
            if (hundred > 0) {
                chunkWords += (hundred === 1 ? "" : ones[hundred]) + " yüz ";
            }
            if (ten > 0) {
                chunkWords += tens[ten] + " ";
            }
            if (one > 0) {
                chunkWords += ones[one] + " ";
            }
            
            let thousandWord = thousands[i];
            // "bir bin" yerine sadece "bin" denir.
            if (thousandWord === "bin" && chunk === 1) {
                 words = thousandWord + " " + words;
            } else {
                 words = chunkWords + thousandWord + " " + words;
            }
        }
        num = Math.floor(num / 1000);
        i++;
    }
    
    return words.trim();
}

export function numberToWords(num: number | string): string {
    const numStr = String(num);
    const parts = numStr.split('.');
    const integerPart = parseInt(parts[0], 10);
    
    let words = numberToWordsTr(integerPart);
    
    if (parts.length > 1 && parseInt(parts[1], 10) > 0) {
        words += " tam";
        const decimalPartStr = parts[1];
        const placeNames = ["onda", "yüzde", "binde"];
        words += " " + placeNames[decimalPartStr.length - 1] + " " + numberToWordsTr(parseInt(decimalPartStr, 10));
    }
    
    return words;
}

// --- WORDS TO NUMBER (TURKISH) ---
// This is a simplified version and may not cover all complex cases.
const valueMap: { [key: string]: number } = {
    'sıfır': 0, 'bir': 1, 'iki': 2, 'üç': 3, 'dört': 4, 'beş': 5, 'altı': 6, 'yedi': 7, 'sekiz': 8, 'dokuz': 9,
    'on': 10, 'yirmi': 20, 'otuz': 30, 'kırk': 40, 'elli': 50, 'altmış': 60, 'yetmiş': 70, 'seksen': 80, 'doksan': 90
};
const multiplierMap: { [key: string]: number } = {
    'yüz': 100, 'bin': 1000, 'milyon': 1000000
};

export function wordsToNumber(text: string): number {
    text = text.toLowerCase().trim();
    const words = text.split(/\s+/);
    let total = 0;
    let current = 0;

    for (const word of words) {
        if (valueMap[word] !== undefined) {
            current += valueMap[word];
        } else if (multiplierMap[word] !== undefined) {
            const multiplier = multiplierMap[word];
            if (multiplier === 100) {
                current = (current === 0 ? 1 : current) * multiplier;
            } else {
                total += (current === 0 ? 1 : current) * multiplier;
                current = 0;
            }
        }
    }
    total += current;
    return total;
}

// --- FRACTION TO WORDS (TURKISH) ---
export function formatFractionAsWords(fractionStr: string): string {
    const parts = fractionStr.split(' ');
    // A simplified heuristic for Turkish vowel/consonant harmony for suffixes 'de' and 'te'
    const getSuffix = (word: string): string => {
        const lastChar = word.slice(-1);
        const hardConsonants = ['f', 's', 't', 'k', 'ç', 'ş', 'h', 'p'];
        if (hardConsonants.includes(lastChar)) {
            return "'te";
        }
        return "'de";
    };

    if (parts.length > 1) { // Mixed number "1 1/2"
        const whole = parseInt(parts[0], 10);
        const fracParts = parts[1].split('/');
        const num = parseInt(fracParts[0], 10);
        const den = parseInt(fracParts[1], 10);
        const denWords = numberToWordsTr(den);
        return `${numberToWordsTr(whole)} tam ${denWords}${getSuffix(denWords)} ${numberToWordsTr(num)}`;
    } else { // Simple fraction "1/2"
        const fracParts = parts[0].split('/');
        const num = parseInt(fracParts[0], 10);
        const den = parseInt(fracParts[1], 10);
        const denWords = numberToWordsTr(den);
        return `${denWords}${getSuffix(denWords)} ${numberToWordsTr(num)}`;
    }
}


// --- SPEECH PARSING ---
export const parseSpokenMath = (text: string): { n1: number; n2: number; operation: ArithmeticOperation } | null => {
    const wordToNumberMap: { [key: string]: number } = {
        'sıfır': 0, 'bir': 1, 'iki': 2, 'üç': 3, 'dört': 4, 'beş': 5,
        'altı': 6, 'yedi': 7, 'sekiz': 8, 'dokuz': 9, 'on': 10,
        'on bir': 11, 'on iki': 12, 'on üç': 13, 'on dört': 14, 'on beş': 15,
        'on altı': 16, 'on yedi': 17, 'on sekiz': 18, 'on dokuz': 19, 'yirmi': 20,
    };
    const wordToOperationMap: { [key: string]: ArithmeticOperation } = {
        'artı': ArithmeticOperation.Addition,
        'topla': ArithmeticOperation.Addition,
        'eksi': ArithmeticOperation.Subtraction,
        'çıkar': ArithmeticOperation.Subtraction,
        'çarpı': ArithmeticOperation.Multiplication,
        'çarp': ArithmeticOperation.Multiplication,
        'kere': ArithmeticOperation.Multiplication,
        'bölü': ArithmeticOperation.Division,
        'böl': ArithmeticOperation.Division,
    };
    
    const cleanText = text.toLowerCase().trim();
    
    // Find operation
    const opWord = Object.keys(wordToOperationMap).find(op => cleanText.includes(` ${op} `));
    if (!opWord) return null;

    const parts = cleanText.split(` ${opWord} `);
    if (parts.length !== 2) return null;

    const n1 = wordToNumberMap[parts[0].trim()];
    const op = wordToOperationMap[opWord];
    const n2 = wordToNumberMap[parts[1].trim()];

    if (n1 === undefined || op === undefined || n2 === undefined) return null;

    return { n1, n2, operation: op };
};