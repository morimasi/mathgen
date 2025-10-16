
import { ShapeType } from '../types';

// --- FRACTION PIE ---
export const drawFractionPie = (numerator: number, denominator: number): string => {
    const r = 50;
    const cx = r;
    const cy = r;
    const angleStep = 360 / denominator;
    let paths = '';

    for (let i = 0; i < denominator; i++) {
        const startAngle = i * angleStep;
        const endAngle = (i + 1) * angleStep;
        
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;
        
        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);

        const largeArcFlag = angleStep > 180 ? 1 : 0;

        const path = `
            <path d="M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArcFlag},1 ${x2},${y2} Z"
                  fill="${i < numerator ? '#3b82f6' : '#e5e7eb'}"
                  stroke="#6b7280" stroke-width="1" />
        `;
        paths += path;
    }

    return `<svg viewBox="0 0 ${2*r} ${2*r}" width="100" height="100">${paths}</svg>`;
};

// --- ANALOG CLOCK ---
export const drawAnalogClock = (
    hour: number, 
    minute: number, 
    options?: { 
        showNumbers?: boolean; 
        showHourHand?: boolean; 
        showMinuteHand?: boolean;
        showMinuteMarkers?: boolean;
    }
): string => {
    const { showNumbers = true, showHourHand = true, showMinuteHand = true, showMinuteMarkers = true } = options || {};
    const size = 120;
    const center = size / 2;
    const r = size / 2 - 5;
    const hourHandLen = r * 0.5;
    const minHandLen = r * 0.8;

    const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
    const minAngle = minute * 6 - 90;

    const hourRad = hourAngle * Math.PI / 180;
    const minRad = minAngle * Math.PI / 180;
    
    const hx = center + hourHandLen * Math.cos(hourRad);
    const hy = center + hourHandLen * Math.sin(hourRad);
    const mx = center + minHandLen * Math.cos(minRad);
    const my = center + minHandLen * Math.sin(minRad);
    
    let numbers = '';
    if (showNumbers) {
        for (let i = 1; i <= 12; i++) {
            const angle = i * 30 - 90;
            const rad = angle * Math.PI / 180;
            const nx = center + (r-10) * Math.cos(rad);
            const ny = center + (r-10) * Math.sin(rad);
            numbers += `<text x="${nx}" y="${ny+4}" text-anchor="middle" font-size="10" fill="#333">${i}</text>`;
        }
    }

    let markers = '';
    if (showMinuteMarkers) {
        for (let i = 0; i < 60; i++) {
            const angle = i * 6 - 90;
            const rad = angle * Math.PI / 180;
            const isFiveMin = i % 5 === 0;
            const r1 = isFiveMin ? r - 6 : r - 3;
            const r2 = r;
            const x1 = center + r1 * Math.cos(rad);
            const y1 = center + r1 * Math.sin(rad);
            const x2 = center + r2 * Math.cos(rad);
            const y2 = center + r2 * Math.sin(rad);
            const strokeWidth = isFiveMin ? 1.5 : 0.75;
            markers += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9ca3af" stroke-width="${strokeWidth}" />`;
        }
    }


    const hourHand = showHourHand ? `<line x1="${center}" y1="${center}" x2="${hx}" y2="${hy}" stroke="#333" stroke-width="4" stroke-linecap="round" />` : '';
    const minuteHand = showMinuteHand ? `<line x1="${center}" y1="${center}" x2="${mx}" y2="${my}" stroke="#333" stroke-width="2" stroke-linecap="round" />` : '';

    return `
        <svg viewBox="0 0 ${size} ${size}" width="120" height="120">
            <circle cx="${center}" cy="${center}" r="${r}" fill="#fff" stroke="#333" stroke-width="2" />
            ${markers}
            ${numbers}
            ${hourHand}
            ${minuteHand}
            <circle cx="${center}" cy="${center}" r="3" fill="#333" />
        </svg>
    `;
};


// --- GEOMETRY ---
interface ShapeParams {
    type: ShapeType;
    s?: number; // side
    w?: number; // width
    h?: number; // height
    r?: number; // radius
    b?: number; // base
    s1?: number; // side1
    s2?: number; // side2
    a?: number; // top base for trapezoid
    c?: number; // side c
    d?: number; // side d
    isArea?: boolean; // for parallelogram/trapezoid height
}

export const draw2DShape = (params: ShapeParams): string => {
    const SCALE = 1.4;
    const PADDING = 25;
    const FONT_SIZE = 12;
    
    const textStyle = `font-family: sans-serif; font-size: ${FONT_SIZE}px; fill: #1e293b;`;
    const lineStyle = `stroke: #475569; stroke-width: 2; fill: #f1f5f9;`;
    const heightLineStyle = `stroke: #ef4444; stroke-width: 1.5; stroke-dasharray: 4 2;`;

    switch(params.type) {
        case ShapeType.Square: {
            const s = (params.s || 50) * SCALE;
            const size = s + 2 * PADDING;
            return `
                <svg viewBox="0 0 ${size} ${size}" width="${size * 0.8}" height="${size * 0.8}">
                    <rect x="${PADDING}" y="${PADDING}" width="${s}" height="${s}" style="${lineStyle}" />
                    <text x="${PADDING + s / 2}" y="${PADDING - 8}" text-anchor="middle" style="${textStyle}">${params.s}</text>
                    <text x="${PADDING - 8}" y="${PADDING + s / 2}" dominant-baseline="middle" text-anchor="end" style="${textStyle}">${params.s}</text>
                </svg>
            `;
        }
        case ShapeType.Rectangle: {
            const w = (params.w || 80) * SCALE;
            const h = (params.h || 50) * SCALE;
            const width = w + 2 * PADDING;
            const height = h + 2 * PADDING;
             return `
                <svg viewBox="0 0 ${width} ${height}" width="${width * 0.8}" height="${height * 0.8}">
                    <rect x="${PADDING}" y="${PADDING}" width="${w}" height="${h}" style="${lineStyle}" />
                    <text x="${PADDING + w / 2}" y="${PADDING - 8}" text-anchor="middle" style="${textStyle}">${params.w}</text>
                    <text x="${PADDING - 8}" y="${PADDING + h / 2}" dominant-baseline="middle" text-anchor="end" style="${textStyle}">${params.h}</text>
                </svg>
            `;
        }
        case ShapeType.Triangle: {
            const b = (params.b || 60) * SCALE;
            const h = (params.h || 40) * SCALE;
            const s1 = params.s1;
            const s2 = params.s2;
            const width = b + 2 * PADDING;
            const height = h + 2 * PADDING;
            const p1 = `${PADDING}, ${PADDING + h}`;
            const p2 = `${PADDING + b}, ${PADDING + h}`;
            const p3 = `${PADDING + b/2}, ${PADDING}`;
             return `
                <svg viewBox="0 0 ${width} ${height}" width="${width * 0.8}" height="${height * 0.8}">
                    <polygon points="${p1} ${p2} ${p3}" style="${lineStyle}" />
                    <text x="${PADDING + b / 2}" y="${PADDING + h + 18}" text-anchor="middle" style="${textStyle}">${params.b}</text>
                    ${s1 ? `<text x="${PADDING + b * 0.2}" y="${PADDING + h * 0.6}" style="${textStyle}" transform="rotate(-55 ${PADDING + b * 0.25},${PADDING + h * 0.5})">${s1}</text>` : ''}
                    ${s2 ? `<text x="${PADDING + b * 0.8}" y="${PADDING + h * 0.6}" style="${textStyle}" transform="rotate(55 ${PADDING + b * 0.75},${PADDING + h * 0.5})">${s2}</text>` : ''}
                    ${!s1 && params.h ? `<line x1="${PADDING+b/2}" y1="${PADDING}" x2="${PADDING+b/2}" y2="${PADDING+h}" style="${heightLineStyle}" />
                    <text x="${PADDING + b/2 + 8}" y="${PADDING + h/2}" dominant-baseline="middle" style="${textStyle}">${params.h}</text>` : ''}
                </svg>
            `;
        }
        case ShapeType.Circle: {
            const r = (params.r || 40) * SCALE;
            const size = r * 2 + 2 * PADDING;
            const center = size / 2;
            return `
                <svg viewBox="0 0 ${size} ${size}" width="${size * 0.8}" height="${size * 0.8}">
                    <circle cx="${center}" cy="${center}" r="${r}" style="${lineStyle}" />
                    <line x1="${center}" y1="${center}" x2="${center+r}" y2="${center}" style="${heightLineStyle}" />
                    <text x="${center + r/2}" y="${center - 8}" text-anchor="middle" style="${textStyle}">${params.r}</text>
                </svg>
            `;
        }
        case ShapeType.Parallelogram: {
            const b_dim = params.b || 80;
            const s_dim = params.s || 50;
            const h_dim = params.h || 40;
            
            const b = b_dim * SCALE;
            const s = s_dim * SCALE;
            const h = h_dim * SCALE;

            const offset = (s*s - h*h > 0) ? Math.sqrt(s*s - h*h) : 0;
            const width = b + offset + 2 * PADDING;
            const height = h + 2 * PADDING;
            const p1 = `${PADDING + offset},${PADDING}`;
            const p2 = `${PADDING + offset + b},${PADDING}`;
            const p3 = `${PADDING + b},${PADDING + h}`;
            const p4 = `${PADDING},${PADDING + h}`;
            const angleRad = Math.asin(h/s);
            const angleDeg = angleRad * 180 / Math.PI;

            return `
                 <svg viewBox="0 0 ${width} ${height}" width="${width * 0.8}" height="${height * 0.8}">
                    <polygon points="${p1} ${p2} ${p3} ${p4}" style="${lineStyle}" />
                    <text x="${PADDING + offset + b/2}" y="${PADDING - 8}" text-anchor="middle" style="${textStyle}">${b_dim}</text>
                     <text x="${PADDING + offset/2 - 8}" y="${PADDING+h/2}" style="${textStyle}" dominant-baseline="middle" text-anchor="end" transform="rotate(-${angleDeg} ${PADDING + offset/2},${PADDING+h/2})">${s_dim}</text>
                    ${params.isArea ? `<line x1="${PADDING+offset}" y1="${PADDING}" x2="${PADDING+offset}" y2="${PADDING+h}" style="${heightLineStyle}" /><text x="${PADDING+offset+8}" y="${PADDING+h/2}" style="${textStyle}">${h_dim}</text>` : ''}
                </svg>
            `;
        }
         case ShapeType.Trapezoid: {
            const a_dim = params.a || 40;
            const b_dim = params.b || 80;
            const h_dim = params.h || 50;
            const c_dim = params.c;
            const d_dim = params.d;

            const a = a_dim * SCALE;
            const b = b_dim * SCALE;
            const h = h_dim * SCALE;

            const offset = (b-a)/2 > 0 ? (b-a)/2 : 0;
            const width = b + 2 * PADDING;
            const height = h + 2 * PADDING;
            const p1 = `${PADDING + offset},${PADDING}`;
            const p2 = `${PADDING + offset + a},${PADDING}`;
            const p3 = `${PADDING + b},${PADDING + h}`;
            const p4 = `${PADDING},${PADDING + h}`;
            const sideAngleRad = Math.atan(h/offset);
            const sideAngleDeg = sideAngleRad * 180 / Math.PI;

             return `
                <svg viewBox="0 0 ${width} ${height}" width="${width * 0.8}" height="${height * 0.8}">
                    <polygon points="${p1} ${p2} ${p3} ${p4}" style="${lineStyle}" />
                    <text x="${PADDING+b/2}" y="${PADDING - 8}" text-anchor="middle" style="${textStyle}">${a_dim}</text>
                    <text x="${PADDING+b/2}" y="${PADDING+h + 18}" text-anchor="middle" style="${textStyle}">${b_dim}</text>
                    ${c_dim ? `<text x="${PADDING+offset/2 - 8}" y="${PADDING+h/2}" style="${textStyle}" dominant-baseline="middle" text-anchor="end" transform="rotate(-${sideAngleDeg} ${PADDING+offset/2},${PADDING+h/2})">${c_dim}</text>` : ''}
                    ${d_dim ? `<text x="${PADDING+b-offset/2 + 8}" y="${PADDING+h/2}" style="${textStyle}" dominant-baseline="middle" text-anchor="start" transform="rotate(${sideAngleDeg} ${PADDING+b-offset/2},${PADDING+h/2})">${d_dim}</text>` : ''}
                    ${params.isArea ? `<line x1="${PADDING+offset}" y1="${PADDING}" x2="${PADDING+offset}" y2="${PADDING+h}" style="${heightLineStyle}" /><text x="${PADDING+offset+8}" y="${PADDING+h/2}" style="${textStyle}">${h_dim}</text>` : ''}
                </svg>
             `;
        }
        case ShapeType.Pentagon:
        case ShapeType.Hexagon: {
            const s_dim = params.s || 50;
            const s = s_dim * SCALE;
            const isHex = params.type === ShapeType.Hexagon;
            const n = isHex ? 6 : 5;
            const r = s / (2 * Math.sin(Math.PI / n));
            const size = r * 2 + PADDING * 2;
            const center = size/2;
            let points = '';
            for(let i=0; i<n; i++){
                const angle = (i * 2 * Math.PI / n) - (Math.PI/2);
                points += `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)} `;
            }
             return `
                 <svg viewBox="0 0 ${size} ${size}" width="${size*0.8}" height="${size*0.8}">
                    <polygon points="${points}" style="${lineStyle}" />
                    <text x="${center}" y="${PADDING - 8}" text-anchor="middle" style="${textStyle}">${s_dim}</text>
                </svg>
             `;
        }
        default: return '';
    }
}

export const drawAngle = (angle: number): string => {
    const size = 100;
    const center = 50;
    const r = 40;
    const rad1 = -angle * Math.PI / 180;
    const x1 = center + r * Math.cos(rad1);
    const y1 = center + r * Math.sin(rad1);

    return `
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
            <path d="M ${center},${center} L ${center+r},${center} A ${r},${r} 0 0,0 ${x1},${y1} Z" fill="#e0f2fe" />
            <line x1="${center}" y1="${center}" x2="${center+r}" y2="${center}" stroke="#0c4a6e" stroke-width="2" />
            <line x1="${center}" y1="${center}" x2="${x1}" y2="${y1}" stroke="#0c4a6e" stroke-width="2" />
            <text x="${center+15}" y="${center-5}" font-size="12">${angle}°</text>
        </svg>
    `;
};

export const drawSymmetryLine = (shape: string): string => {
    // Placeholder SVGs for symmetry concept
    if (shape === 'Kalp') {
        return `
            <svg viewBox="0 0 100 100" width="80" height="80">
                <path d="M 50,90 C 10,50 40,20 50,40 C 60,20 90,50 50,90 Z" fill="#f43f5e" />
                <line x1="50" y1="30" x2="50" y2="95" stroke="#333" stroke-width="1.5" stroke-dasharray="4 2" />
            </svg>
        `;
    }
     return `
            <svg viewBox="0 0 100 100" width="80" height="80">
                <text x="50" y="60" text-anchor="middle" font-size="60" font-weight="bold">${shape[0]}</text>
                <line x1="50" y1="10" x2="50" y2="80" stroke="#333" stroke-width="1.5" stroke-dasharray="4 2" />
            </svg>
        `;
}
