
import { Problem, TimeProblemType, TimeSettings } from '../types';
import { drawAnalogClock } from './svgService';

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const formatTime = (h: number, m: number, format: '12h' | '24h'): string => {
    const minutes = String(m).padStart(2, '0');
    if (format === '24h') {
        return `${String(h).padStart(2, '0')}:${minutes}`;
    } else {
        const ampm = h >= 12 && h < 24 ? 'ÖS' : 'ÖÖ'; // Öğleden Sonra / Öğleden Önce
        let hour12 = h % 12;
        if (hour12 === 0) { // Handle midnight (0) and noon (12)
            hour12 = 12;
        }
        return `${String(hour12)}:${minutes} ${ampm}`;
    }
};

const getRandomMinutes = (difficulty: 'easy' | 'medium' | 'hard' | 'mixed'): number => {
    if (difficulty === 'mixed') {
        const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
        const randomDifficulty = difficulties[getRandomInt(0, 2)];
        return getRandomMinutes(randomDifficulty);
    }
    switch (difficulty) {
        case 'easy': return 0; // on the hour
        case 'medium': return [0, 15, 30, 45][getRandomInt(0, 3)]; // on the hour or quarter/half hours
        case 'hard': return getRandomInt(0, 59); // any minute
    }
}

const getRandomDuration = (difficulty: 'easy' | 'medium' | 'hard' | 'mixed'): { hours: number, minutes: number } => {
    if (difficulty === 'mixed') {
        const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
        const randomDifficulty = difficulties[getRandomInt(0, 2)];
        return getRandomDuration(randomDifficulty);
    }
    let hours = 0;
    let minutes = 0;
    switch (difficulty) {
        case 'easy':
            if (Math.random() < 0.5) {
                hours = getRandomInt(1, 3);
            } else {
                minutes = 30;
            }
            break;
        case 'medium':
            hours = getRandomInt(0, 2);
            minutes = [15, 30, 45][getRandomInt(0, 2)];
            break;
        case 'hard':
            hours = getRandomInt(0, 3);
            minutes = getRandomInt(1, 59);
            break;
    }
    // Ensure duration is never zero
    if (hours === 0 && minutes === 0) hours = 1;
    return { hours, minutes };
};


export const generateTimeProblem = (settings: TimeSettings): { problem: Problem, title: string } => {
    const { type, difficulty, format } = settings;
    let problem: Problem;
    let title: string;
    const problemBase = { category: 'time' };
    
    const titles: { [key in TimeProblemType]: string } = {
        [TimeProblemType.ReadClock]: "Aşağıdaki saatlerin kaç olduğunu yazınız.",
        [TimeProblemType.CalculateDuration]: "Verilen başlangıç ve bitiş zamanlarına göre geçen süreyi hesaplayınız.",
        [TimeProblemType.CalculateEndTime]: "Başlangıç zamanı ve süreye göre bitiş zamanını bulunuz.",
        [TimeProblemType.FindStartTime]: "Bitiş zamanı ve süreye göre başlangıç zamanını bulunuz.",
        [TimeProblemType.ConvertUnits]: "Aşağıdaki zaman birimi dönüştürmelerini yapınız.",
        [TimeProblemType.Calendar]: "Aşağıdaki takvim problemlerini çözünüz."
    };
    title = titles[type];

    switch (type) {
        case TimeProblemType.CalculateDuration: {
            const startHour = getRandomInt(8, 18);
            const startMinute = getRandomMinutes(difficulty);
            
            const { hours: durationHours, minutes: durationMinutes } = getRandomDuration(difficulty);

            let endMinute = startMinute + durationMinutes;
            let endHour = startHour + durationHours;
            if(endMinute >= 60) {
                endHour += Math.floor(endMinute / 60);
                endMinute %= 60;
            }

            const question = `<div style="font-family: monospace; font-size: 1.1em; line-height: 1.5;">Başlangıç: ${formatTime(startHour, startMinute, format)}<br/>Bitiş: ${formatTime(endHour, endMinute, format)}</div>`;
            let answer = '';
            if (durationHours > 0) answer += `${durationHours} saat `;
            if (durationMinutes > 0) answer += `${durationMinutes} dakika`;
            problem = { ...problemBase, question, answer: answer.trim() };
            break;
        }

        case TimeProblemType.CalculateEndTime: {
            const startHour = getRandomInt(8, 20);
            const startMinute = getRandomMinutes(difficulty);
            const { hours: durationHours, minutes: durationMinutes } = getRandomDuration(difficulty);

            let endMinute = startMinute + durationMinutes;
            let endHour = startHour + durationHours;
             if(endMinute >= 60) {
                endHour += Math.floor(endMinute / 60);
                endMinute %= 60;
            }

            const durationText = `${durationHours > 0 ? `${durationHours} saat` : ''} ${durationMinutes > 0 ? `${durationMinutes} dakika` : ''}`;
            const question = `<div style="font-family: monospace; font-size: 1.1em; line-height: 1.5;">Başlangıç: ${formatTime(startHour, startMinute, format)}<br/>Süre: ${durationText.trim()}</div>`;
            const answer = formatTime(endHour, endMinute, format);
            problem = { ...problemBase, question, answer };
            break;
        }
        
        case TimeProblemType.FindStartTime: {
            const endHour = getRandomInt(9, 22);
            const endMinute = getRandomMinutes(difficulty);
            const { hours: durationHours, minutes: durationMinutes } = getRandomDuration(difficulty);
            
            let startMinute = endMinute - durationMinutes;
            let startHour = endHour - durationHours;
            if (startMinute < 0) {
                startHour -= Math.ceil(Math.abs(startMinute) / 60);
                startMinute = 60 + (startMinute % 60);
                if (startMinute === 60) startMinute = 0;
            }

            const durationText = `${durationHours > 0 ? `${durationHours} saat` : ''} ${durationMinutes > 0 ? `${durationMinutes} dakika` : ''}`;
            const question = `<div style="font-family: monospace; font-size: 1.1em; line-height: 1.5;">Bitiş: ${formatTime(endHour, endMinute, format)}<br/>Süre: ${durationText.trim()}</div>`;
            const answer = formatTime(startHour, startMinute, format);
            problem = { ...problemBase, question, answer };
            break;
        }

        case TimeProblemType.ReadClock: {
            const hour = getRandomInt(0, 23);
            const minute = getRandomMinutes(difficulty);
            const clockSVG = drawAnalogClock(hour, minute, {
                showNumbers: settings.showClockNumbers,
                showHourHand: settings.showHourHand,
                showMinuteHand: settings.showMinuteHand,
                showMinuteMarkers: settings.showMinuteMarkers,
            });
            const digitalTime = formatTime(hour, minute, format);
            
            const digitalTimeDisplay = settings.showDigitalTime
                ? `<div style="font-family: monospace; font-size: 1.25em; text-align: center; margin-top: 0.25rem;">${digitalTime}</div>`
                : '';

            const question = `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.1rem;">
                    ${clockSVG}
                    ${digitalTimeDisplay}
                </div>
            `;
            
            let answerText = '';
            const hourForReading = hour % 12 || 12;
            const nextHourForReading = hourForReading === 12 ? 1 : hourForReading + 1;

            if (minute === 0) answerText = `Saat tam ${hourForReading}`;
            else if (minute === 15) answerText = `${hourForReading}'i çeyrek geçiyor`;
            else if (minute === 30) answerText = `${hourForReading} buçuk`;
            else if (minute === 45) answerText = `${nextHourForReading}'e çeyrek var`;
            else if (minute < 30) answerText = `${hourForReading}'i ${minute} geçiyor`;
            else answerText = `${nextHourForReading}'e ${60-minute} var`;

            const answer = `${digitalTime} - ${answerText}`;
            problem = { ...problemBase, question, answer };
            break;
        }

        case TimeProblemType.ConvertUnits: {
            const types = ['minToHour', 'hourToMin', 'dayToHour', 'hourToDay', 'weekToDay', 'dayToWeek'];
            const type = types[getRandomInt(0,types.length - 1)];
            let question = '', answer = '';

            switch(type) {
                case 'minToHour': {
                    const totalMinutes = getRandomInt(65, 300);
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    question = `${totalMinutes} dakika`;
                    answer = `${hours} saat ${minutes} dakika`;
                    break;
                }
                case 'hourToMin': {
                    const hours = getRandomInt(1, 5);
                    const minutes = getRandomInt(5, 55);
                    const totalMinutes = hours * 60 + minutes;
                    question = `${hours} saat ${minutes} dakika`;
                    answer = `${totalMinutes} dakika`;
                    break;
                }
                case 'dayToHour': {
                    const days = getRandomInt(1, 4);
                    const hours = getRandomInt(1, 23);
                    const totalHours = days * 24 + hours;
                    question = `${days} gün ${hours} saat`;
                    answer = `${totalHours} saat`;
                    break;
                }
                case 'hourToDay': {
                    const totalHours = getRandomInt(25, 100);
                    const days = Math.floor(totalHours / 24);
                    const hours = totalHours % 24;
                    question = `${totalHours} saat`;
                    answer = `${days} gün ${hours} saat`;
                    break;
                }
                case 'weekToDay': {
                    const weeks = getRandomInt(1, 8);
                    const days = getRandomInt(1, 6);
                    const totalDays = weeks * 7 + days;
                    question = `${weeks} hafta ${days} gün`;
                    answer = `${totalDays} gün`;
                    break;
                }
                case 'dayToWeek': {
                    const totalDays = getRandomInt(8, 50);
                    const weeks = Math.floor(totalDays / 7);
                    const days = totalDays % 7;
                    question = `${totalDays} gün`;
                    answer = `${weeks} hafta ${days} gün`;
                    break;
                }
            }
            problem = { ...problemBase, question: `<span style="font-size: 1.1em;">${question}</span>`, answer };
            break;
        }

        case TimeProblemType.Calendar: {
            const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
            const startDayIndex = getRandomInt(0, 6);
            const daysToAdd = getRandomInt(3, 25);
            const endDayIndex = (startDayIndex + daysToAdd) % 7;
            const question = `<div style="font-size: 1.1em; line-height: 1.5;">Bugün: ${days[startDayIndex]}<br/>İstenen: ${daysToAdd} gün sonra</div>`;
            const answer = days[endDayIndex];
            problem = { ...problemBase, question, answer };
            break;
        }
        
        default:
            problem = { ...problemBase, question: 'Hata', answer: 'Hata' };
    }
    return { problem, title };
};