
// services/measurementService.ts

import { Problem, MeasurementProblemType, MeasurementSettings, Difficulty, MeasurementDomain } from '../types.ts';
import { drawRuler, drawThermometer, drawBeaker, drawBalanceScale } from './svgService.ts';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

// --- Conversion Data ---
const conversions = {
    length: [
        { from: 'km', to: 'm', factor: 1000 },
        { from: 'm', to: 'cm', factor: 100 },
        { from: 'cm', to: 'mm', factor: 10 },
    ],
    weight: [
        { from: 't', to: 'kg', factor: 1000 },
        { from: 'kg', to: 'g', factor: 1000 },
        { from: 'g', to: 'mg', factor: 1000 },
    ],
    capacity: [ // Changed from 'volume' to match domain
        { from: 'L', to: 'mL', factor: 1000 },
    ]
};

// --- Helper Functions ---

const getConversionPair = (domain: MeasurementDomain) => {
    if (domain === MeasurementDomain.Length) return conversions.length[getRandomInt(0, conversions.length.length - 1)];
    if (domain === MeasurementDomain.Weight) return conversions.weight[getRandomInt(0, conversions.weight.length - 1)];
    if (domain === MeasurementDomain.Capacity) return conversions.capacity[getRandomInt(0, conversions.capacity.length - 1)];
    
    // Mixed
    const all = [...conversions.length, ...conversions.weight, ...conversions.capacity];
    return all[getRandomInt(0, all.length - 1)];
};

const generateConversionProblem = (settings: MeasurementSettings): Problem => {
    const { difficulty, domain } = settings;
    const conversion = getConversionPair(domain === MeasurementDomain.Mixed ? MeasurementDomain.Mixed : domain);
    const { from, to, factor } = conversion;
    
    let question = '', answer = '';
    const toSmaller = Math.random() < 0.5;

    // Adjust difficulty logic
    const level = difficulty === 'mixed' ? (['easy', 'medium', 'hard'] as const)[getRandomInt(0, 2)] : difficulty;

    if (level === 'easy') {
        // Whole numbers
        if (toSmaller) {
            const val = getRandomInt(1, 10);
            question = `${val} ${from} = ... ${to}`;
            answer = `${val * factor} ${to}`;
        } else {
            const val = getRandomInt(1, 10) * factor;
            question = `${val} ${to} = ... ${from}`;
            answer = `${val / factor} ${from}`;
        }
    } else if (level === 'medium') {
        // Simple decimals (0.5, 1.2)
        if (toSmaller) {
            const val = getRandomInt(1, 20) / 2; // .0 or .5
            question = `${val} ${from} = ... ${to}`;
            answer = `${val * factor} ${to}`;
        } else {
            const val = getRandomInt(1, 20) * (factor / 10);
            question = `${val} ${to} = ... ${from}`;
            answer = `${val / factor} ${from}`;
        }
    } else {
        // Hard: Mixed units (3 km 250 m) or complex decimals
        if (toSmaller && Math.random() < 0.6) {
            const big = getRandomInt(1, 9);
            const small = getRandomInt(1, factor - 1);
            question = `${big} ${from} ${small} ${to} = ... ${to}`;
            answer = `${big * factor + small} ${to}`;
        } else {
            const val = getRandomInt(10, factor * 5);
            question = `${val} ${to} = ... ${from}`;
            answer = `${val / factor} ${from}`; // Might result in 1.234
        }
    }

    return {
        question: `<span style="font-size:1.2em; font-family:monospace">${question}</span>`,
        answer,
        category: 'measurement',
        display: 'inline'
    };
};

const generateReadToolProblem = (settings: MeasurementSettings): Problem => {
    const { domain, difficulty } = settings;
    
    // If mixed, pick a random domain supported by tools
    let activeDomain = domain;
    if (activeDomain === MeasurementDomain.Mixed) {
        activeDomain = [MeasurementDomain.Length, MeasurementDomain.Weight, MeasurementDomain.Capacity, MeasurementDomain.Temperature][getRandomInt(0, 3)];
    }

    let question = '', answer = '', svg = '';

    switch(activeDomain) {
        case MeasurementDomain.Length:
            const len = difficulty === 'easy' ? getRandomInt(1, 15) : getRandomInt(10, 100) / 10;
            const start = (settings.rulerDetail === 'broken' || difficulty === 'hard') ? getRandomInt(1, 5) : 0;
            const displayLen = len + start;
            svg = drawRuler(Math.ceil(displayLen + 2), displayLen, 'cm', 0);
            // Add an arrow indicating the measurement
            question = `<div style="display:flex; flex-direction:column; align-items:center;">
                ${svg}
                <p>Ok ile gösterilen uzunluk kaç cm'dir?</p>
            </div>`;
            answer = `${displayLen} cm`;
            
            // Override with specific highlight logic inside SVG service if needed, 
            // but here we are simplifying. Let's use the highlight feature of drawRuler.
            svg = drawRuler(Math.ceil(displayLen + 2), displayLen, 'cm', 0);
            question = `<div>${svg}<p style="text-align:center; margin-top:0.5em">Kırmızı ok hangi değeri gösteriyor?</p></div>`;
            break;

        case MeasurementDomain.Temperature:
            const temp = getRandomInt(-10, 40);
            svg = drawThermometer(temp);
            question = `<div style="display:flex; flex-direction:column; align-items:center; gap:1em">
                ${svg}
                <p>Termometre kaç dereceyi gösteriyor?</p>
            </div>`;
            answer = `${temp} °C`;
            break;

        case MeasurementDomain.Capacity:
            const maxCap = 1000; // mL
            const level = getRandomInt(1, 10) * 100;
            svg = drawBeaker(maxCap, level, 'mL');
            question = `<div style="display:flex; flex-direction:column; align-items:center; gap:1em">
                ${svg}
                <p>Kaptaki sıvı miktarı ne kadardır?</p>
            </div>`;
            answer = `${level} mL`;
            break;
            
        case MeasurementDomain.Weight:
            // Digital scale reading
            const weight = getRandomInt(50, 5000);
            const unit = weight >= 1000 ? 'kg' : 'g';
            const displayWeight = weight >= 1000 ? (weight/1000).toFixed(2) : weight;
            
            // Simple SVG for digital scale
            svg = `<svg viewBox="0 0 150 80" style="height:80px; display:block; margin:auto">
                <rect x="25" y="20" width="100" height="50" rx="5" fill="#e5e7eb" stroke="#374151" stroke-width="2"/>
                <rect x="40" y="30" width="70" height="30" fill="#d1fae5" stroke="#059669"/>
                <text x="75" y="52" text-anchor="middle" font-family="monospace" font-size="20" fill="#065f46">${displayWeight} ${unit}</text>
            </svg>`;
            question = `<div style="display:flex; flex-direction:column; align-items:center; gap:1em">
                ${svg}
                <p>Terazi kaç ${unit === 'kg' ? 'kilogramı' : 'gramı'} gösteriyor?</p>
            </div>`;
            answer = `${displayWeight} ${unit}`;
            break;
    }

    return { question, answer, category: 'measurement', display: 'flow' };
};

const generateComparisonProblem = (settings: MeasurementSettings): Problem => {
    // Mainly for weight (balance scale) or capacity
    const { domain } = settings;
    let activeDomain = domain === MeasurementDomain.Mixed ? MeasurementDomain.Weight : domain;
    
    if (activeDomain === MeasurementDomain.Weight) {
        const w1 = getRandomInt(1, 10);
        const w2 = getRandomInt(1, 10);
        const svg = drawBalanceScale(w1, w2);
        
        let qText = "Terazinin durumu nasıldır?";
        let ansText = "";
        
        if (w1 > w2) {
            ansText = "Sol taraf daha ağır.";
        } else if (w2 > w1) {
            ansText = "Sağ taraf daha ağır.";
        } else {
            ansText = "Dengede.";
        }
        
        // Make it a math problem: how much to add?
        if (w1 !== w2) {
            const diff = Math.abs(w1 - w2);
            const lighterSide = w1 < w2 ? "Sol" : "Sağ";
            qText = `Teraziyi dengelemek için ${lighterSide} kefeye kaç birim eklenmelidir?`;
            ansText = `${diff} birim`;
        }

        return {
            question: `<div style="text-align:center">${svg}<p style="margin-top:10px">${qText}</p></div>`,
            answer: ansText,
            category: 'measurement',
            display: 'flow'
        };
    }
    
    // Fallback to basic comparison text
    return generateConversionProblem({...settings, type: MeasurementProblemType.Conversion});
};

const generateEstimationProblem = (settings: MeasurementSettings): Problem => {
    const items = [
        { name: "Bir elma", val: "150 g", options: ["150 g", "15 kg", "1500 kg"] },
        { name: "Bir fil", val: "5 ton", options: ["5 kg", "50 kg", "5 ton"] },
        { name: "Bir su bardağı", val: "200 mL", options: ["2 L", "200 mL", "20 mL"] },
        { name: "Oda sıcaklığı", val: "22 °C", options: ["2 °C", "22 °C", "80 °C"] },
        { name: "Kapı yüksekliği", val: "2 m", options: ["2 cm", "2 m", "2 km"] },
    ];
    
    const item = items[getRandomInt(0, items.length - 1)];
    const shuffledOptions = items[0].options.length ? item.options.sort(() => Math.random() - 0.5) : []; // Simple shuffle
    
    // Manual shuffle to be safe
    const opts = [...item.options].sort(() => 0.5 - Math.random());
    
    const question = `
        <div style="text-align:center">
            <p style="font-size:1.1em; margin-bottom:10px"><b>${item.name}</b> yaklaşık ne kadardır?</p>
            <div style="display:flex; justify-content:center; gap:15px">
                ${opts.map(o => `<span style="border:1px solid #ccc; padding:5px 10px; border-radius:15px; font-family:sans-serif">${o}</span>`).join('')}
            </div>
        </div>
    `;
    
    return {
        question,
        answer: item.val,
        category: 'measurement',
        display: 'flow'
    };
};


export const generateMeasurementProblem = (settings: MeasurementSettings): { problem: Problem, title: string } => {
    const { type, domain } = settings;
    
    let title = "Ölçme";
    const domainNames = { 
        [MeasurementDomain.Length]: "Uzunluk", 
        [MeasurementDomain.Weight]: "Tartma", 
        [MeasurementDomain.Capacity]: "Sıvı Ölçme", 
        [MeasurementDomain.Temperature]: "Sıcaklık",
        [MeasurementDomain.Mixed]: "Ölçüler Karma"
    };
    title = domainNames[domain] || "Ölçme";

    let result: Problem;

    switch (type) {
        case MeasurementProblemType.ReadTool:
            title += " - Araç Okuma";
            result = generateReadToolProblem(settings);
            break;
        case MeasurementProblemType.Comparison:
            title += " - Karşılaştırma";
            result = generateComparisonProblem(settings);
            break;
        case MeasurementProblemType.Estimation:
            title += " - Tahmin";
            result = generateEstimationProblem(settings);
            break;
        case MeasurementProblemType.Conversion:
        default:
            title += " - Dönüştürme";
            result = generateConversionProblem(settings);
            break;
    }
    
    return { problem: result, title };
};
