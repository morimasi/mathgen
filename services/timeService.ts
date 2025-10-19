// services/timeService.ts

import { Problem, TimeSettings, TimeProblemType } from '../types.ts';
import { drawAnalogClock } from './svgService.ts';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const padZero = (num: number) => String(num).padStart(2, '0');

export const generateTimeProblem = (settings: TimeSettings): { problem: Problem, title: string, error?: string } => {
    const { type, difficulty, clockFace, digitalClockDisplay } = settings;
    let problem: Problem;
    let title = '';
    const problemBase = { category: 'time' };
    let question: string;
    let answer: string | number;

    switch (type) {
        case TimeProblemType.ReadAnalog:
        case TimeProblemType.DrawTime: {
            title = type === TimeProblemType.ReadAnalog ? "Aşağıdaki saatlerin kaçı gösterdiğini yazınız." : "Verilen saatleri analog saat üzerinde çiziniz.";
            
            let hour = getRandomInt(1, 12);
            let minute = 0;
            
            if (difficulty === 'medium') {
                minute = [0, 15, 30, 45][getRandomInt(0, 3)];
            } else if (difficulty === 'hard') {
                minute = getRandomInt(0, 59);
            }

            const timeStr = `${padZero(hour)}:${padZero(minute)}`;
            answer = timeStr;

            if (type === TimeProblemType.ReadAnalog) {
                const svg = drawAnalogClock(hour, minute, clockFace);
                let answerBox = '';
                if(digitalClockDisplay === 'show') {
                    answerBox = `<div style="font-size: 1.5rem; font-family: monospace; text-align: center; letter-spacing: 2px; margin-top: 0.5rem;">${timeStr}</div>`;
                } else if (digitalClockDisplay === 'box') {
                    answerBox = `<div style="font-size: 1.5rem; font-family: monospace; text-align: center; border: 1px solid black; padding: 5px; margin: 0.5rem auto; width: 80px;">__:__</div>`;
                }
                question = `<div style="display: flex; flex-direction: column; align-items: center;">${svg}${answerBox}</div>`;
                problem = { ...problemBase, question, answer };
            } else { // DrawTime
                const svg = drawAnalogClock(0, 0, 'no-hands');
                 question = `<div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="font-size: 1.5rem; font-family: monospace; text-align: center; letter-spacing: 2px; margin-bottom: 0.5rem;">${timeStr}</div>
                    ${svg}
                </div>`;
                problem = { ...problemBase, question, answer: `Akrep ve yelkovan ${timeStr} gösterecek şekilde çizilir.` };
            }
            break;
        }

        case TimeProblemType.Duration:
        case TimeProblemType.FindEndTime:
        case TimeProblemType.FindStartTime: {
            const startHour = getRandomInt(8, 20);
            const startMinute = [0, 15, 30, 45][getRandomInt(0, 3)];
            const durationMinutes = [15, 30, 45, 60, 75, 90, 120][getRandomInt(0, 6)];
            
            const totalStartMinutes = startHour * 60 + startMinute;
            const totalEndMinutes = totalStartMinutes + durationMinutes;

            const endHour = Math.floor(totalEndMinutes / 60) % 24;
            const endMinute = totalEndMinutes % 60;

            const startTime = `${padZero(startHour)}:${padZero(startMinute)}`;
            const endTime = `${padZero(endHour)}:${padZero(endMinute)}`;
            const duration = durationMinutes < 60 ? `${durationMinutes} dakika` : `${Math.floor(durationMinutes / 60)} saat ${durationMinutes % 60 === 0 ? '' : `${durationMinutes % 60} dakika`}`.trim();

            switch(type) {
                case TimeProblemType.Duration:
                    title = "İki zaman arasındaki süreyi bulunuz.";
                    question = `Saat ${startTime} ile ${endTime} arasında ne kadar süre vardır?`;
                    answer = duration;
                    break;
                case TimeProblemType.FindEndTime:
                    title = "Bitiş zamanını bulunuz.";
                    question = `${startTime}'da başlayan bir film, ${duration} sürdüğüne göre saat kaçta biter?`;
                    answer = endTime;
                    break;
                case TimeProblemType.FindStartTime:
                    title = "Başlangıç zamanını bulunuz.";
                    question = `Saat ${endTime}'da biten bir film, ${duration} sürdüğüne göre saat kaçta başlamıştır?`;
                    answer = startTime;
                    break;
            }
            problem = { ...problemBase, question, answer, display: 'inline' };
            break;
        }

        case TimeProblemType.UnitConversion: {
            title = "Zaman birimlerini dönüştürünüz.";
            const conversions = [
                {q: `${getRandomInt(2,5)} saat kaç dakikadır?`, a: (val: number) => `${val * 60} dakika`},
                {q: `${[120, 180, 240][getRandomInt(0,2)]} dakika kaç saattir?`, a: (val: number) => `${val / 60} saat`},
                {q: `${getRandomInt(2,5)} gün kaç saattir?`, a: (val: number) => `${val * 24} saat`},
                {q: `${getRandomInt(2,5)} hafta kaç gündür?`, a: (val: number) => `${val * 7} gün`}
            ];
            const conv = conversions[getRandomInt(0, conversions.length - 1)];
            const num = parseInt(conv.q);
            question = conv.q;
            answer = conv.a(num);
            problem = { ...problemBase, question, answer, display: 'inline' };
            break;
        }

        case TimeProblemType.Calendar: {
            title = "Takvim Problemleri";
            const day = getRandomInt(1, 28);
            const month = "Mayıs";
            question = `Bugün ${day} ${month} ise, 1 hafta sonrası hangi tarihtir?`;
            answer = `${day + 7} ${month}`;
            problem = { ...problemBase, question, answer, display: 'inline' };
            break;
        }
        
        default:
            problem = { ...problemBase, question: 'Hata', answer: 'Hata' };
            title = 'Hata';
            return {
                problem,
                title,
                error: 'Geçersiz zaman problemi türü seçildi.'
            };
    }
    
    return { problem, title };
};