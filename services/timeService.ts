// FIX: Add .ts extension to import paths
import { Problem, TimeSettings, TimeProblemType } from './types.ts';
import { drawAnalogClock } from './svgService.ts';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const padZero = (num: number) => String(num).padStart(2, '0');

export const generateTimeProblem = (settings: TimeSettings): { problem: Problem, title: string, error?: string } => {
    const { type, difficulty } = settings;
    let problem: Problem;
    let title = '';
    const problemBase = { category: 'time' };

    switch (type) {
        case TimeProblemType.ReadAnalog:
        case TimeProblemType.DrawTime: {
            title = type === TimeProblemType.ReadAnalog ? "Aşağıdaki saatlerin kaçı gösterdiğini yazınız." : "Verilen saatleri analog saat üzerinde çiziniz.";
            
            let hour = getRandomInt(1, 12);
            let minute = 0;
            
            if (difficulty === 'medium') {
                minute = [0, 15, 30, 45][getRandomInt(0