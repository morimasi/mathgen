// services/dyscalculiaService.ts

// FIX: Add .ts extension to import paths
import { 
    Problem, DyscalculiaSubModuleType, NumberSenseSettings, ArithmeticFluencySettings, NumberGroupingSettings,
    MathLanguageSettings, TimeMeasurementGeometrySettings, SpatialReasoningSettings, EstimationSkillsSettings,
    FractionsDecimalsIntroSettings, VisualNumberRepresentationSettings, VisualArithmeticSettings
} from '../types.ts';
import { generateDyscalculiaAIProblem } from './geminiService.ts';
import { drawFractionPie, drawAnalogClock } from './svgService.ts';

// --- LOCAL GENERATION LOGIC ---

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// --- Local Generator Functions ---

const generateNumberSenseLocal = (settings: NumberSenseSettings): { problem: Problem, title: string } => {
    const { type, maxNumber } = settings;
    let question = "", answer: string | number = "", title = "Sayı Hissi";

    switch (type) {
        case 'compare':
            title = "Sayıları Karşılaştır";
            let n1 = getRandomInt(1, maxNumber);
            let n2 = getRandomInt(1, maxNumber);
            while (n1 === n2) n2 = getRandomInt(1, maxNumber);
            question = `<p>Hangisi daha çok? İşaretle.</p>
                        <div class="comparison-container">
                            <div class="comparison-group dyscalculia-box">${'●'.repeat(n1)}</div>
                            <div class="comparison-group dyscalculia-box">${'●'.repeat(n2)}</div>
                        </div>`;
            answer = n1 > n2 ? `Soldaki (${n1})` : `Sağdaki (${n2})`;
            break;
        case 'order':
            title = "Sayıları Sırala";
            const numbers = Array.from({ length: 3 }, () => getRandomInt(1, maxNumber));
            const sorted = [...numbers].sort((a, b) => a - b);
            const cards = shuffleArray(numbers).map(n => `<div class="dyscalculia-card"><div>${'●'.repeat(n)}</div><span>${n}</span></div>`).join('');
            question = `<p>Kartları küçükten büyüğe doğru sırala (altlarına 1, 2, 3 yaz).</p><div class="ordering-container">${cards}</div>`;
            answer = sorted.join(', ');
            break;
        case 'number-line':
            title = "Sayı Doğrusu";
            const start = getRandomInt(0, maxNumber - 5);
            const hops = getRandomInt(1, 4);
            answer = start + hops;
            const lineSvg = `
                <svg viewBox="0 0 200 40" class="number-line-svg">
                    <line x1="10" y1="20" x2="190" y2="20" stroke="black" stroke-width="2"/>
                    ${Array.from({ length: 6 }).map((_, i) => `
                        <line x1="${10 + i * 30}" y1="15" x2="${10 + i * 30}" y2="25" stroke="black"/>
                        <text x="${10 + i * 30}" y="35" text-anchor="middle">${start + i}</text>
                    `).join('')}
                    <text x="${10 + start * 0}" y="10" font-size="12">🐸</text>
                    <path d="M ${15 + 0*30} 15 Q ${15 + hops*15} 0, ${15 + hops * 30} 15" stroke="green" stroke-dasharray="3" fill="none" stroke-width="2"/>
                </svg>`;
            question = `<p>Kurbağa ${start} sayısında. ${hops} adım zıplarsa hangi sayıya gelir?</p>${lineSvg}`;
            break;
    }
    return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
};

const generateArithmeticFluencyLocal = (settings: ArithmeticFluencySettings): { problem: Problem, title: string } => {
    const { operation, difficulty } = settings;
    const max = difficulty === 'easy' ? 9 : 20;
    let n1 = getRandomInt(1, max);
    let n2 = getRandomInt(1, max);
    let op = operation;
    if(op === 'mixed') op = Math.random() < 0.5 ? 'addition' : 'subtraction';

    let question = "", answer: number = 0, title = "Aritmetik Akıcılığı";
    if (op === 'addition') {
        if(n1 + n2 > max) {
            n1 = getRandomInt(1, Math.floor(max/2));
            n2 = getRandomInt(1, Math.floor(max/2));
        }
        question = `<div class="visual-arithmetic-container"><div>${'●'.repeat(n1)}</div> + <div>${'●'.repeat(n2)}</div> = ?</div>`;
        answer = n1 + n2;
    } else { // subtraction
        if (n1 < n2) [n1, n2] = [n2, n1];
        question = `<div class="visual-arithmetic-container"><div>${'●'.repeat(n1)}</div> - <div>${'●'.repeat(n2)}</div> = ?</div>`;
        answer = n1 - n2;
    }
    return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
};

const generateVisualArithmeticLocal = (settings: VisualArithmeticSettings): { problem: Problem, title: string } => {
    const { operation, maxNumber } = settings;
    const item = '🍎';
    let n1 = getRandomInt(1, maxNumber - 1);
    let n2 = getRandomInt(1, maxNumber - n1);
    let question = "", answer: number = 0, title = "Görsel Aritmetik";

    if (operation === 'addition') {
        question = `<div class="visual-math-container"><div class="visual-math-group">${item.repeat(n1)}</div> <span class="op">+</span> <div class="visual-math-group">${item.repeat(n2)}</div> <span class="op">=</span> <div class="answer-box-small"></div></div>`;
        answer = n1 + n2;
    } else { // subtraction
        if (n1 < n2) [n1, n2] = [n2, n1];
        const crossedOut = Array.from({length: n1}).map((_, i) => i < n2 ? `<span class="crossed-out">${item}</span>` : item).join('');
        question = `<div class="visual-math-container"><div class="visual-math-group">${crossedOut}</div> <span class="op">=</span> <div class="answer-box-small"></div></div>`;
        answer = n1 - n2;
    }
    return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
};

const generateFractionsDecimalsIntroLocal = (settings: FractionsDecimalsIntroSettings): { problem: Problem, title: string } => {
    const { type } = settings;
    let question = "", answer = "", title = "Kesirlere Giriş";
    
    if (type === 'visual-match') {
        const fractions = [{n: 1, d: 2}, {n: 1, d: 3}, {n: 1, d: 4}];
        const selected = fractions[getRandomInt(0, fractions.length - 1)];
        question = `<p>Bu şekil hangi kesri gösteriyor?</p><div class="dyscalculia-fraction-container">${drawFractionPie(selected.n, selected.d)} <div class="options"><span>1/3</span><span>1/2</span><span>1/4</span></div></div>`;
        answer = `${selected.n}/${selected.d}`;
    } else { // compare
        question = `<p>Hangisi daha büyük? İşaretle.</p><div class="dyscalculia-fraction-container">${drawFractionPie(1, 2)} ${drawFractionPie(1, 4)}</div>`;
        answer = '1/2';
    }
    return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
};

const generateNumberGroupingLocal = (settings: NumberGroupingSettings): { problem: Problem; title: string; } => {
    const { maxNumber } = settings;
    const title = "Onluk Çerçeve ile Gruplama";
    const number = getRandomInt(1, 10);
    const dots = Array.from({length: 10}, (_,i) => `<div class="ten-frame-dot ${i < number ? 'filled' : ''}"></div>`).join('');
    const question = `<p>Çerçevede kaç tane dolu nokta var? 10 olması için kaç tane daha gerekir?</p><div class="ten-frame">${dots}</div>`;
    const answer = `Dolu: ${number}, Boş: ${10-number}`;
    return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
};

const generateMathLanguageLocal = (settings: MathLanguageSettings): { problem: Problem; title: string; } => {
    const title = "Matematiksel Dil";
    const map = { '+': 'topla', '-': 'çıkar', '=': 'eşittir' };
    const symbol = Object.keys(map)[getRandomInt(0, 2)];
    const word = map[symbol as keyof typeof map];
    const question = `<p><b>'${word}'</b> kelimesini sembolle eşleştir.</p><div class="symbol-options"><span>-</span><span>=</span><span>+</span></div>`;
    const answer = symbol;
    return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
};

const generateTimeMeasurementGeometryLocal = (settings: TimeMeasurementGeometrySettings): { problem: Problem; title: string; } => {
    const { category } = settings;
    if (category === 'time') {
        const title = "Saat Okuma";
        const hour = getRandomInt(1, 12);
        const question = `<p>Bu saat kaçı gösteriyor?</p><div class="dyscalculia-clock-container">${drawAnalogClock(hour, 0)} <div class="options vertical"><span>Saat 3</span><span>Saat ${hour}</span><span>Saat 9</span></div></div>`;
        const answer = `Saat tam ${hour}`;
        return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
    } else if (category === 'measurement') {
        const title = "Ölçme";
        const question = `<p>Hangisi daha uzun? İşaretle.</p><div class="dyscalculia-measurement-container"><div class="ruler short"></div><div class="ruler long"></div></div>`;
        const answer = "Alttaki";
        return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
    } else { // geometry
        const title = "Geometri";
        const shapes = ['<circle cx="25" cy="25" r="20" fill="#fecaca"/>', '<rect x="5" y="5" width="40" height="40" fill="#a5f3fc"/>', '<polygon points="25,5 45,45 5,45" fill="#d9f99d"/>'];
        const question = `<p>Daireyi bul ve boya.</p><div class="dyscalculia-shape-container">${shuffleArray(shapes).map(s => `<svg viewBox="0 0 50 50">${s}</svg>`).join('')}</div>`;
        const answer = "Daire";
        return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
    }
};

const generateSpatialReasoningLocal = (settings: SpatialReasoningSettings): { problem: Problem; title: string; } => {
    const title = "Uzamsal Akıl Yürütme";
// FIX: Declare 'question' and 'answer' variables before use.
    let question = "", answer = "";
    const patternColors = ['#ef4444', '#3b82f6', '#22c55e'];
    const pattern = shuffleArray(patternColors).slice(0,3).map(c => `<div class="pattern-block" style="background-color: ${c}"></div>`).join('');
    question = `<p>Aşağıdaki deseni aynısını çizerek kopyala:</p><div class="pattern-container">${pattern}</div><div class="pattern-container empty"><div></div><div></div><div></div></div>`;
    answer = "Desen kopyalanır.";
    return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
};

const generateEstimationSkillsLocal = (settings: EstimationSkillsSettings): { problem: Problem; title: string; } => {
    const title = "Tahmin Becerileri";
// FIX: Declare 'question' and 'answer' variables before use.
    let question = "", answer = "";
    const count = getRandomInt(15, 40);
    const jarItems = Array.from({length: count}).map(() => `<circle cx="${getRandomInt(15,85)}" cy="${getRandomInt(15,95)}" r="3" fill="#8b5cf6"/>`).join('');
    const jarSvg = `<svg viewBox="0 0 100 100"><path d="M 20 95 H 80 V 30 C 80 10, 70 10, 70 10 H 30 C 30 10, 20 10, 20 30 Z" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2"/><rect x="25" y="5" width="50" height="5" fill="#c7d2fe"/>${jarItems}</svg>`;
    const options = shuffleArray([10, 20, 30, 40, 50]).slice(0,3);
    question = `<p>Kavanozda yaklaşık kaç tane bilye var?</p><div class="estimation-container">${jarSvg}<div class="options"><span>${options[0]}</span><span>${options[1]}</span><span>${options[2]}</span></div></div>`;
    answer = `Yaklaşık ${Math.round(count / 10) * 10}`;
    return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
};

const generateVisualNumberRepresentationLocal = (settings: VisualNumberRepresentationSettings): { problem: Problem; title: string; } => {
    const { maxNumber, representation } = settings;
    const title = "Sayıların Görsel Temsili";
    const number = getRandomInt(1, maxNumber);
    let representationHtml = '';
    if (representation === 'dots') {
        representationHtml = `<div class="dyscalculia-dots">${'●'.repeat(number)}</div>`;
    } else if (representation === 'blocks') {
        const tens = Math.floor(number / 10);
        const ones = number % 10;
        representationHtml = `<div class="base-ten-blocks">${'<div class="ten-rod"></div>'.repeat(tens)}${'<div class="one-block"></div>'.repeat(ones)}</div>`;
    } else { // fingers
        representationHtml = `<div class="finger-count">${'🖐️'.repeat(Math.floor(number/5))}${'☝️'.repeat(number%5)}</div>`;
    }
    // FIX: Declare 'question' variable before use.
    const question = `<p>Aşağıdaki görsel hangi sayıyı temsil ediyor?</p>${representationHtml}`;
    const answer = String(number);
    return { problem: { question, answer, category: 'dyscalculia', display: 'flow' }, title };
};

export const generateDyscalculiaProblem = async (subModuleId: DyscalculiaSubModuleType, settings: any, count: number): Promise<{ problems: Problem[], title: string, error?: string }> => {
    
    const aiModules: DyscalculiaSubModuleType[] = ['problem-solving', 'interactive-story-dc'];

    if (aiModules.includes(subModuleId)) {
        return generateDyscalculiaAIProblem(subModuleId, settings, count);
    }
    
    // For local generation
    let problems: Problem[] = [];
    let title = 'Diskalkuli Alıştırması';

    for(let i=0; i < count; i++) {
        let result: { problem: Problem; title: string; };
        switch(subModuleId) {
            case 'number-sense':
                result = generateNumberSenseLocal(settings as NumberSenseSettings);
                break;
            case 'arithmetic-fluency':
                result = generateArithmeticFluencyLocal(settings as ArithmeticFluencySettings);
                break;
            case 'visual-arithmetic':
                result = generateVisualArithmeticLocal(settings as VisualArithmeticSettings);
                break;
            case 'fractions-decimals-intro':
                result = generateFractionsDecimalsIntroLocal(settings as FractionsDecimalsIntroSettings);
                break;
            case 'number-grouping':
                result = generateNumberGroupingLocal(settings as NumberGroupingSettings);
                break;
            case 'math-language':
                result = generateMathLanguageLocal(settings as MathLanguageSettings);
                break;
            case 'time-measurement-geometry':
                result = generateTimeMeasurementGeometryLocal(settings as TimeMeasurementGeometrySettings);
                break;
            case 'spatial-reasoning':
                result = generateSpatialReasoningLocal(settings as SpatialReasoningSettings);
                break;
            case 'estimation-skills':
                result = generateEstimationSkillsLocal(settings as EstimationSkillsSettings);
                break;
            case 'visual-number-representation':
                result = generateVisualNumberRepresentationLocal(settings as VisualNumberRepresentationSettings);
                break;
            default:
                result = { 
                    problem: { question: `Bu alıştırma ('${subModuleId}') için yerel üreteç henüz tanımlanmadı.`, answer: "...", category: 'dyscalculia' },
                    title: 'Bilinmeyen Modül'
                };
        }
        problems.push(result.problem);
        if(i === 0) title = result.title;
    }

    return { problems, title };
};