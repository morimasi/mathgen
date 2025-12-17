
// services/svgService.ts

import { ShapeType, SolidShapeType } from "../types";

interface ShapeParams {
    type: string;
    w?: number; h?: number; // rectangle
    s?: number; // square
    b?: number; // triangle base
    s1?: number; s2?: number; // triangle sides
    r?: number; // circle
    a?: number; // trapezoid top
    c?: number; d?: number; // trapezoid sides
    isArea?: boolean; // for parallelogram/trapezoid
    showGrid?: boolean;
    highlightPerimeter?: boolean;
    highlight?: 'edges' | 'corners';
}

const commonTextStyle = 'font-family="sans-serif" fill="#1f2937"';

export const draw2DShape = (params: ShapeParams): string => {
    const { type, w, h, s, b, s1, s2, r, a, c, d, isArea, showGrid, highlightPerimeter, highlight } = params;
    let svgContent = '';
    const width = 150, height = 100;
    
    const strokeStyle = (highlightPerimeter || highlight === 'edges')
        ? 'stroke="#fb923c" stroke-width="3.5"'
        : 'stroke="#0ea5e9" stroke-width="2"';
    const commonStyle = `fill="#f0f9ff" ${strokeStyle}`;
    const textStyle = 'font-size="12px" fill="#0c4a6e" font-family="sans-serif"';
    
    let gridLines = '';
    let cornerHighlights = '';

    switch (type) {
        case 'rectangle': {
            const rectW = 100, rectH = 50;
            const rectX = 25, rectY = 25;
            svgContent = `<rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" ${commonStyle} />
                        <text x="75" y="20" text-anchor="middle" ${textStyle}>${w} br</text>
                        <text x="20" y="50" text-anchor="end" dominant-baseline="middle" ${textStyle}>${h} br</text>`;
            if (showGrid && w && h) {
                const cellW = rectW / w;
                const cellH = rectH / h;
                for (let i = 1; i < w; i++) gridLines += `<line x1="${rectX + i*cellW}" y1="${rectY}" x2="${rectX + i*cellW}" y2="${rectY+rectH}" stroke="#a5f3fc" stroke-width="0.5"/>`;
                for (let i = 1; i < h; i++) gridLines += `<line x1="${rectX}" y1="${rectY + i*cellH}" x2="${rectX+rectW}" y2="${rectY + i*cellH}" stroke="#a5f3fc" stroke-width="0.5"/>`;
            }
             if (highlight === 'corners') {
                const corners = [[rectX, rectY], [rectX+rectW, rectY], [rectX+rectW, rectY+rectH], [rectX, rectY+rectH]];
                corners.forEach(([cx,cy]) => cornerHighlights += `<circle cx="${cx}" cy="${cy}" r="4" fill="#ef4444" stroke="#b91c1c"/>`);
            }
            break;
        }
        case 'square': {
            const size = 80;
            const sqX = 35, sqY = 10;
            svgContent = `<rect x="${sqX}" y="${sqY}" width="${size}" height="${size}" ${commonStyle} />
                        <text x="75" y="5" text-anchor="middle" ${textStyle}>${s} br</text>`;
             if (showGrid && s) {
                const cellSize = size / s;
                for (let i = 1; i < s; i++) {
                    gridLines += `<line x1="${sqX + i*cellSize}" y1="${sqY}" x2="${sqX + i*cellSize}" y2="${sqY+size}" stroke="#a5f3fc" stroke-width="0.5"/>`;
                    gridLines += `<line x1="${sqX}" y1="${sqY + i*cellSize}" x2="${sqX+size}" y2="${sqY + i*cellSize}" stroke="#a5f3fc" stroke-width="0.5"/>`;
                }
            }
            if (highlight === 'corners') {
                const corners = [[sqX, sqY], [sqX+size, sqY], [sqX+size, sqY+size], [sqX, sqY+size]];
                corners.forEach(([cx,cy]) => cornerHighlights += `<circle cx="${cx}" cy="${cy}" r="4" fill="#ef4444" stroke="#b91c1c"/>`);
            }
            break;
        }
        case 'triangle': {
            const base = b || 80;
            const heightVal = h || 60;
            const p1 = {x: 75, y: 10}, p2 = {x: 75 - base / 2, y: 10 + heightVal}, p3 = {x: 75 + base / 2, y: 10 + heightVal};
            svgContent = `<polygon points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" ${commonStyle} />
                        <text x="75" y="${15 + heightVal}" text-anchor="middle" ${textStyle}>${base} br</text>`;
            if (isArea) {
                svgContent += `<line x1="75" y1="10" x2="75" y2="${10 + heightVal}" stroke-dasharray="2" stroke="#0c4a6e" />
                             <text x="80" y="50" ${textStyle}>h=${heightVal}</text>`;
            }
            if (s1 && s2) {
                svgContent += `<text x="40" y="50" transform="rotate(-60 40 50)" ${textStyle}>${s1} br</text>`;
            }
            if (highlight === 'corners') {
                [p1, p2, p3].forEach(p => cornerHighlights += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#ef4444" stroke="#b91c1c"/>`);
            }
            break;
        }
        case 'circle':
            svgContent = `<circle cx="75" cy="50" r="${r || 40}" ${commonStyle} />`;
            if (!highlightPerimeter && !highlight) {
                svgContent += `<line x1="75" y1="50" x2="${75 + (r || 40)}" y2="50" stroke="#0c4a6e" stroke-dasharray="2" />
                             <text x="${75 + (r || 40) / 2}" y="45" text-anchor="middle" ${textStyle}>r=${r}</text>`;
            }
            break;
        case 'parallelogram':
             svgContent = `<polygon points="30,80 130,80 110,20 10,20" ${commonStyle} />
                         <text x="70" y="95" text-anchor="middle" ${textStyle}>${b} br</text>`;
             if(isArea) {
                svgContent += `<line x1="30" y1="20" x2="30" y2="80" stroke-dasharray="2" stroke="#0c4a6e" />
                             <text x="35" y="50" ${textStyle}>h=${h}</text>`;
             } else if (!highlight) {
                 svgContent += `<text x="125" y="50" transform="rotate(20 125 50)" ${textStyle}>${params.s} br</text>`;
             }
            if (highlight === 'corners') {
                [[30,80], [130,80], [110,20], [10,20]].forEach(([cx,cy]) => cornerHighlights += `<circle cx="${cx}" cy="${cy}" r="4" fill="#ef4444" stroke="#b91c1c"/>`);
            }
            break;
        case 'trapezoid':
            svgContent = `<polygon points="50,20 100,20 130,80 20,80" ${commonStyle} />
                        <text x="75" y="15" text-anchor="middle" ${textStyle}>${a} br</text>
                        <text x="75" y="95" text-anchor="middle" ${textStyle}>${b} br</text>`;
            if(isArea) {
                 svgContent += `<line x1="50" y1="20" x2="50" y2="80" stroke-dasharray="2" stroke="#0c4a6e" />
                              <text x="55" y="50" ${textStyle}>h=${h}</text>`;
            } else if (!highlight) {
                svgContent += `<text x="30" y="50" transform="rotate(-70 30 50)" ${textStyle}>${c} br</text>
                             <text x="120" y="50" transform="rotate(70 120 50)" ${textStyle}>${d} br</text>`;
            }
            if (highlight === 'corners') {
                [[50,20], [100,20], [130,80], [20,80]].forEach(([cx,cy]) => cornerHighlights += `<circle cx="${cx}" cy="${cy}" r="4" fill="#ef4444" stroke="#b91c1c"/>`);
            }
            break;
        case 'pentagon':
        case 'hexagon':
        case 'rhombus':
        case 'star':
            const sides = type === 'pentagon' ? 5 : (type === 'hexagon' ? 6 : 4);
            const radius = 40;
            let pointsStr = '';
            let pointsArr: {x: number, y: number}[] = [];
            if (type === 'rhombus') {
                pointsArr = [{x:75,y:10}, {x:115,y:50}, {x:75,y:90}, {x:35,y:50}];
            } else if (type === 'star') {
                 pointsArr = [
                    {x:75, y:10}, {x:85, y:45}, {x:120, y:45}, {x:95, y:70}, {x:105, y:105},
                    {x:75, y:85}, {x:45, y:105}, {x:55, y:70}, {x:30, y:45}, {x:65, y:45}
                ];
            } else { // pentagon, hexagon
                pointsArr = Array.from({ length: sides }).map((_, i) => {
                    const angle = (i * 2 * Math.PI / sides) - (Math.PI / 2);
                    const x = 75 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    return {x, y};
                });
            }
            pointsStr = pointsArr.map(p => `${p.x},${p.y}`).join(' ');
            svgContent = `<polygon points="${pointsStr}" ${commonStyle} />`;
            if (s && !highlight) {
                 svgContent += `<text x="100" y="80" ${textStyle}>${s} br</text>`;
            }
            if (highlight === 'corners') {
                pointsArr.forEach(p => cornerHighlights += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#ef4444" stroke="#b91c1c"/>`);
            }
            break;
    }

    return `<svg viewBox="0 0 ${width} ${height}" style="max-width: 150px; display: block; margin: auto;">${gridLines}${svgContent}${cornerHighlights}</svg>`;
};


export const drawFractionPie = (numerator: number, denominator: number): string => {
    const r = 50;
    const cx = 50;
    const cy = 50;
    let svg = `<svg viewBox="0 0 100 100" style="width: 80px; height: 80px; display: block;">`;
    const angleStep = 360 / denominator;

    for (let i = 0; i < denominator; i++) {
        const startAngle = i * angleStep;
        const endAngle = (i + 1) * angleStep;
        
        const startX = cx + r * Math.cos((startAngle - 90) * Math.PI / 180);
        const startY = cy + r * Math.sin((startAngle - 90) * Math.PI / 180);
        const endX = cx + r * Math.cos((endAngle - 90) * Math.PI / 180);
        const endY = cy + r * Math.sin((endAngle - 90) * Math.PI / 180);

        const largeArcFlag = angleStep > 180 ? 1 : 0;
        
        const d = `M ${cx},${cy} L ${startX},${startY} A ${r},${r} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
        
        const fill = i < numerator ? '#60a5fa' : '#e5e7eb';
        svg += `<path d="${d}" fill="${fill}" stroke="#4b5563" stroke-width="1" />`;
    }
    
    svg += `</svg>`;
    return svg;
};

export const drawFractionNumberLine = (numerator: number, denominator: number): string => {
    const width = 200;
    const height = 50;
    const padding = 20;
    const lineY = 35;
    const lineWidth = width - 2 * padding;
    
    const totalValue = numerator / denominator;
    const maxVal = Math.ceil(Math.max(1, totalValue)); // Determine end of line (1 or next whole number)
    
    let svg = `<svg viewBox="0 0 ${width} ${height}" style="width: 150px; height: 40px; display: block;">`;
    
    // Main line
    svg += `<line x1="${padding}" y1="${lineY}" x2="${width - padding}" y2="${lineY}" stroke="#1f2937" stroke-width="2" marker-end="url(#arrow)" marker-start="url(#arrow-rev)" />`;
    
    // Define markers
    svg += `<defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1f2937" /></marker>
        <marker id="arrow-rev" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1f2937" /></marker>
    </defs>`;

    const step = lineWidth / maxVal;
    
    // Draw Ticks for whole numbers
    for (let i = 0; i <= maxVal; i++) {
        const x = padding + i * step;
        svg += `<line x1="${x}" y1="${lineY - 5}" x2="${x}" y2="${lineY + 5}" stroke="#1f2937" stroke-width="2" />`;
        svg += `<text x="${x}" y="${lineY + 15}" font-size="10" text-anchor="middle" font-family="sans-serif">${i}</text>`;
    }

    // Draw Highlight and small ticks
    const subStep = step / denominator;
    
    // Small ticks
    for(let i = 0; i <= maxVal * denominator; i++) {
         const x = padding + i * subStep;
         if (i % denominator !== 0) {
             svg += `<line x1="${x}" y1="${lineY - 3}" x2="${x}" y2="${lineY + 3}" stroke="#9ca3af" stroke-width="1" />`;
         }
    }

    // Highlight arc/line
    const targetX = padding + (numerator / denominator) * step;
    svg += `<path d="M ${padding} ${lineY} L ${targetX} ${lineY}" stroke="#ef4444" stroke-width="4" opacity="0.6" />`;
    svg += `<circle cx="${targetX}" cy="${lineY}" r="4" fill="#ef4444" />`;

    svg += `</svg>`;
    return svg;
};


export const drawAnalogClock = (hour: number, minute: number, faceDetail: string = 'full'): string => {
    const width = 150;
    const height = 150;
    const cx = width / 2;
    const cy = height / 2;
    const r = width / 2 - 10;
    
    let svg = `<svg viewBox="0 0 ${width} ${height}" style="width: 150px; height: 150px; display: block; margin: auto;">`;
    // Clock face
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="black" stroke-width="2" />`;
    
    if (faceDetail === 'full' || faceDetail === 'no-hands') {
        // Hour markers
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x1 = cx + (r - 5) * Math.cos(angle);
            const y1 = cy + (r - 5) * Math.sin(angle);
            const x2 = cx + r * Math.cos(angle);
            const y2 = cy + r * Math.sin(angle);
            svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="2" />`;
            if (faceDetail === 'full') {
                const textX = cx + (r - 15) * Math.cos(angle);
                const textY = cy + (r - 15) * Math.sin(angle);
                svg += `<text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="middle" font-size="12">${i}</text>`;
            }
        }
    }
    
    if (faceDetail !== 'no-hands') {
        // Hour hand
        const hourAngle = ((hour % 12 + minute / 60) * 30 - 90) * Math.PI / 180;
        const hourHandLength = r * 0.5;
        const hx = cx + hourHandLength * Math.cos(hourAngle);
        const hy = cy + hourHandLength * Math.sin(hourAngle);
        svg += `<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="black" stroke-width="4" stroke-linecap="round" />`;

        if (faceDetail !== 'no-minute-hand') {
            // Minute hand
            const minuteAngle = (minute * 6 - 90) * Math.PI / 180;
            const minuteHandLength = r * 0.8;
            const mx = cx + minuteHandLength * Math.cos(minuteAngle);
            const my = cy + minuteHandLength * Math.sin(minuteAngle);
            svg += `<line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="black" stroke-width="2" stroke-linecap="round" />`;
        }
    }
    
    // Center pin
    svg += `<circle cx="${cx}" cy="${cy}" r="3" fill="black" />`;
    svg += `</svg>`;
    return svg;
};

export const drawAngle = (angle: number, showValue: boolean = true): string => {
    const width = 150;
    const height = 100;
    const cx = 20;
    const cy = 80;
    const r = 60;
    
    const x1 = cx + r;
    const y1 = cy;
    
    const angleRad = (180 - angle) * Math.PI / 180;
    const x2 = cx + r * Math.cos(angleRad);
    const y2 = cy - r * Math.sin(angleRad);

    const arcRadius = 20;
    const arcX = cx + arcRadius;
    const arcY = cy;
    const largeArcFlag = angle > 180 ? 1 : 0;
    const arcEndX = cx + arcRadius * Math.cos(angleRad);
    const arcEndY = cy - arcRadius * Math.sin(angleRad);
    
    let svg = `<svg viewBox="0 0 ${width} ${height}" style="width: 150px; height: 100px;">`;
    svg += `<path d="M ${x1} ${y1} L ${cx} ${cy} L ${x2} ${y2}" stroke="#0c4a6e" stroke-width="2" fill="none" />`;
    
    if (angle === 90) {
        svg += `<path d="M ${cx + 15} ${cy} L ${cx + 15} ${cy - 15} L ${cx} ${cy - 15}" stroke="#ef4444" stroke-width="1.5" fill="none" />`;
    } else {
        svg += `<path d="M ${arcX} ${arcY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcEndX} ${arcEndY}" stroke="#ef4444" stroke-width="1.5" fill="none" />`;
    }

    if (showValue) {
        // Position text near arc
        const textAngleRad = (180 - angle / 2) * Math.PI / 180;
        const textX = cx + (arcRadius + 10) * Math.cos(textAngleRad);
        const textY = cy - (arcRadius + 10) * Math.sin(textAngleRad);
        svg += `<text x="${textX}" y="${textY}" font-size="12" fill="#0c4a6e" text-anchor="middle" dominant-baseline="middle">${angle}°</text>`;
    }
    svg += `</svg>`;
    
    return svg;
};


export const drawSymmetryLine = (shape: string, isCorrect: boolean): string => {
    let shapePath = '';
    switch (shape) {
        case 'Kelebek':
            shapePath = `<path d="M 75 10 C 20 20, 20 80, 75 90 L 75 10 M 75 10 C 130 20, 130 80, 75 90" fill="#facc15" stroke="#f59e0b" stroke-width="2" />`;
            break;
        case 'Kalp':
            shapePath = `<path d="M 75 30 C 60 10, 30 20, 30 40 C 30 70, 75 90, 75 90 C 75 90, 120 70, 120 40 C 120 20, 90 10, 75 30 Z" fill="#ef4444" stroke="#b91c1c" />`;
            break;
        case 'A Harfi':
            shapePath = `<polygon points="75,10 50,90 100,90" fill="none" stroke="#1d4ed8" stroke-width="5" /><line x1="60" y1="60" x2="90" y2="60" stroke="#1d4ed8" stroke-width="5" />`;
            break;
        case 'C Harfi':
            shapePath = `<path d="M 90 20 A 40 40 0 1 0 90 80" fill="none" stroke="#15803d" stroke-width="5" />`;
            break;
    }
    
    let symmetryLine;
    const correctVertical = `<line x1="75" y1="5" x2="75" y2="95" stroke="red" stroke-width="1.5" stroke-dasharray="4" />`;
    const incorrectHorizontal = `<line x1="20" y1="50" x2="130" y2="50" stroke="red" stroke-width="1.5" stroke-dasharray="4" />`;
    const correctHorizontal = `<line x1="20" y1="50" x2="130" y2="50" stroke="red" stroke-width="1.5" stroke-dasharray="4" />`;
    const incorrectVertical = `<line x1="75" y1="5" x2="75" y2="95" stroke="red" stroke-width="1.5" stroke-dasharray="4" />`;

    if (shape === 'C Harfi') {
        symmetryLine = isCorrect ? correctHorizontal : incorrectVertical;
    } else {
        symmetryLine = isCorrect ? correctVertical : incorrectHorizontal;
    }
    
    return `<svg viewBox="0 0 150 100" style="width: 150px;">${shapePath}${symmetryLine}</svg>`;
};

export const draw3DShape = (params: { type: SolidShapeType, w?: number, l?: number, h?: number, r?: number, s?: number }): string => {
    const { type, w=10, l=10, h=10, r=10, s=10 } = params;
    let svgContent = '';
    const width = 150, height = 150;
    const textStyle = 'font-size="12px" fill="#1e3a8a" font-family="sans-serif"';
    
    const angle = Math.PI / 6;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    switch (type) {
        case 'cube':
        case 'cuboid':
            const size = (type === 'cube') ? s : l;
            const width3d = (type === 'cube') ? s : w;
            const height3d = (type === 'cube') ? s : h;
            
            const x = 75, y = 85;
            const wx = width3d * dx * 2, wy = width3d * dy * 2;
            const lx = size * dx * 2, ly = size * dy * 2;
            
            const p0 = `${x}, ${y}`;
            const p1 = `${x + wx}, ${y - wy}`;
            const p2 = `${x + wx - lx}, ${y - wy - ly}`;
            const p3 = `${x - lx}, ${y - ly}`;
            const p4 = `${x - lx}, ${y - ly - height3d*1.5}`;
            const p5 = `${x}, ${y - height3d*1.5}`;
            const p6 = `${x + wx}, ${y - wy - height3d*1.5}`;
            const p7 = `${x + wx - lx}, ${y - wy - ly - height3d*1.5}`;

            svgContent = `
                <polygon points="${p0} ${p1} ${p6} ${p5}" fill="#bfdbfe" stroke="#1e40af" stroke-width="1"/>
                <polygon points="${p3} ${p2} ${p7} ${p4}" fill="#93c5fd" stroke="#1e40af" stroke-width="1" />
                <polygon points="${p5} ${p6} ${p7} ${p4}" fill="#60a5fa" stroke="#1e40af" stroke-width="1"/>`;
            if (params.w) svgContent += `<text x="${x + wx/2}" y="${y - wy/2 + 5}" text-anchor="middle" ${textStyle}>${width3d} br</text>`;
            if (params.h) svgContent += `<text x="${x - lx/2}" y="${y - ly/2 - height3d*1.5/2}" transform="rotate(-30, ${x-lx/2}, ${y-ly/2 - height3d*1.5/2})" ${textStyle}>${height3d} br</text>`;
            if (params.l) svgContent += `<text x="${x + wx/2 - lx}" y="${y - wy/2 - ly - height3d*1.5/2}" transform="rotate(30, ${x+wx/2 - lx}, ${y-wy/2 - ly - height3d*1.5/2})" ${textStyle}>${size} br</text>`;
            if (params.s) svgContent += `<text x="${x + wx/2}" y="${y - wy/2 + 5}" text-anchor="middle" ${textStyle}>${s} br</text>`;
            break;
        case 'cylinder':
            svgContent = `
                <ellipse cx="75" cy="40" rx="40" ry="15" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/>
                <path d="M 35 40 V 110 A 40 15 0 0 0 115 110 V 40" fill="#93c5fd" stroke="#1e40af" stroke-width="1.5"/>
                <ellipse cx="75" cy="110" rx="40" ry="15" fill="#60a5fa" stroke="#1e40af" stroke-width="1.5"/>
                <line x1="75" y1="40" x2="75" y2="110" stroke="#1e40af" stroke-dasharray="3"/>
                <line x1="35" y1="110" x2="115" y2="110" stroke="#1e40af" stroke-dasharray="3"/>
                <text x="120" y="75" ${textStyle}>h=${h}</text>
                <text x="75" y="125" text-anchor="middle" ${textStyle}>r=${r}</text>
            `;
            break;
        case 'cone':
            svgContent = `
                <path d="M 35 110 L 75 30 L 115 110" fill="#93c5fd" stroke="none"/>
                <ellipse cx="75" cy="110" rx="40" ry="15" fill="#60a5fa" stroke="#1e40af" stroke-width="1.5"/>
                <line x1="35" y1="110" x2="75" y2="30" stroke="#1e40af" stroke-width="1.5"/>
                <line x1="115" y1="110" x2="75" y2="30" stroke="#1e40af" stroke-width="1.5"/>
                <line x1="75" y1="30" x2="75" y2="110" stroke="#1e40af" stroke-dasharray="3"/>
                <text x="80" y="75" ${textStyle}>h=${h}</text>
                <text x="75" y="125" text-anchor="middle" ${textStyle}>r=${r}</text>
            `;
            break;
        case 'sphere':
             svgContent = `
                <circle cx="75" cy="75" r="40" fill="url(#sphereGradient)"/>
                <ellipse cx="75" cy="75" rx="40" ry="15" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
                <defs>
                    <radialGradient id="sphereGradient" cx="0.4" cy="0.4" r="0.6">
                        <stop offset="0%" stop-color="#dbeafe"/>
                        <stop offset="100%" stop-color="#60a5fa"/>
                    </radialGradient>
                </defs>
                <line x1="75" y1="75" x2="115" y2="75" stroke="#1e40af" stroke-dasharray="3"/>
                <text x="95" y="70" text-anchor="middle" ${textStyle}>r=${r}</text>
            `;
            break;
        case 'pyramid':
             svgContent = `
                <polygon points="40,120 110,120 140,105 70,105" fill="#60a5fa" stroke="#1e40af" stroke-width="1.5"/>
                <polygon points="75,30 140,105 110,120" fill="#93c5fd" stroke="#1e40af" stroke-width="1.5"/>
                <polygon points="75,30 70,105 140,105" fill="none" stroke="#1e40af" stroke-width="1.5"/>
                <line x1="75" y1="30" x2="40" y2="120" stroke="#1e40af" stroke-dasharray="3"/>
                <line x1="75" y1="30" x2="75" y2="112.5" stroke-dasharray="3" stroke="#1e40af"/>
                <text x="80" y="75" ${textStyle}>h=${h}</text>
                <text x="75" y="125" text-anchor="middle" ${textStyle}>s=${s}</text>
            `;
            break;
    }

    return `<svg viewBox="0 0 ${width} ${height}" style="max-width: 150px; display: block; margin: auto;">${svgContent}</svg>`;
};

export const drawCompositeShapeForCounting = (type: 'robot' | 'house'): { svg: string, counts: Record<string, number> } => {
    let svgContent = '';
    let counts: Record<string, number> = { 'Kare': 0, 'Dikdörtgen': 0, 'Daire': 0, 'Üçgen': 0 };

    if (type === 'robot') {
        // Head (Square)
        svgContent += '<rect x="50" y="20" width="50" height="50" fill="#a5f3fc" stroke="#0891b2" stroke-width="2"/>';
        counts['Kare']++;
        // Body (Rectangle)
        svgContent += '<rect x="40" y="70" width="70" height="90" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>';
        counts['Dikdörtgen']++;
        // Eyes (Circles)
        svgContent += '<circle cx="65" cy="45" r="5" fill="white"/><circle cx="85" cy="45" r="5" fill="white"/>';
        counts['Daire'] += 2;
        // Arms (Rectangles)
        svgContent += '<rect x="15" y="80" width="25" height="60" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>';
        svgContent += '<rect x="110" y="80" width="25" height="60" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>';
        counts['Dikdörtgen'] += 2;
        // Legs (Rectangles)
        svgContent += '<rect x="50" y="160" width="25" height="50" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>';
        svgContent += '<rect x="75" y="160" width="25" height="50" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>';
        counts['Dikdörtgen'] += 2;
        // Antenna (Triangle)
        svgContent += '<polygon points="75,20 70,5 80,5" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>';
        counts['Üçgen']++;
    } else { // house
        // Body (Square)
        svgContent += '<rect x="30" y="80" width="90" height="90" fill="#fed7aa" stroke="#f97316" stroke-width="2"/>';
        counts['Kare']++;
        // Roof (Triangle)
        svgContent += '<polygon points="20,80 130,80 75,30" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>';
        counts['Üçgen']++;
        // Door (Rectangle)
        svgContent += '<rect x="65" y="120" width="20" height="50" fill="#d9f99d" stroke="#65a30d" stroke-width="2"/>';
        counts['Dikdörtgen']++;
        // Window (Circle)
        svgContent += '<circle cx="50" cy="100" r="10" fill="#a5f3fc" stroke="#0891b2" stroke-width="2"/>';
        counts['Daire']++;
    }
    
    const svg = `<svg viewBox="0 0 150 220" style="max-width: 180px; display: block; margin: auto;">${svgContent}</svg>`;
    return { svg, counts };
};

export const drawHalfShapeForSymmetry = (shape: 'butterfly' | 'heart' | 'star'): string => {
    let halfPath = '';
    const symmetryLine = '<line x1="75" y1="10" x2="75" y2="140" stroke="black" stroke-dasharray="4" stroke-width="1.5"/>';
    const otherHalf = '<rect x="76" y="10" width="64" height="130" fill="#f3f4f6" stroke-dasharray="4" stroke="#9ca3af" stroke-width="1"/>';

    switch (shape) {
        case 'butterfly':
            halfPath = '<path d="M 75 20 C 30 30, 30 110, 75 130 Z" fill="#fcd34d" stroke="#f59e0b" stroke-width="2"/>';
            break;
        case 'heart':
             halfPath = '<path d="M 75 40 C 40 20, 20 30, 20 60 C 20 100, 75 140, 75 140 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>';
            break;
        case 'star':
             halfPath = '<path d="M 75 20 L 58 60 L 10 60 L 50 85 L 35 125 L 75 100 Z" fill="#fef08a" stroke="#eab308" stroke-width="2" />';
            break;
    }
    return `<svg viewBox="0 0 150 150" style="width: 150px; display: block; margin: auto;">${halfPath}${symmetryLine}${otherHalf}</svg>`;
};

export const drawTriangleWithType = (type: 'right' | 'isosceles' | 'equilateral' | 'scalene', size: number = 80): string => {
    let points = '';
    let extra = '';
    const midX = 5 + size / 2;
    switch (type) {
        case 'right':
            points = `5,5 5,${5+size} ${5+size},${5+size}`;
            extra = `<rect x="5" y="${5+size-10}" width="10" height="10" fill="none" stroke="#ef4444" stroke-width="1.5"/>`;
            break;
        case 'isosceles':
            points = `${midX},5 ${5+size},${5+size} 5,${5+size}`;
            break;
        case 'equilateral':
            const height = size * Math.sqrt(3) / 2;
            points = `${midX},5 ${5+size},${5+height} 5,${5+height}`;
            break;
        case 'scalene':
            points = `15,10 ${5+size},${15+size/2} 5,${5+size}`;
            break;
    }
    return `<svg viewBox="0 0 ${size+10} ${size+10}" style="width: 100px; height: 100px;"><polygon points="${points}" fill="#d9f99d" stroke="#65a30d" stroke-width="2"/>${extra}</svg>`;
};

export const drawCircleWithProperties = (property: 'radius' | 'diameter' | 'circumference', r: number = 40): string => {
    let propSvg = '';
    const cx = 50, cy = 50;
    switch(property) {
        case 'radius':
            propSvg = `<line x1="${cx}" y1="${cy}" x2="${cx+r}" y2="${cy}" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
                       <circle cx="${cx}" cy="${cy}" r="3" fill="#ef4444"/>`;
            break;
        case 'diameter':
            propSvg = `<line x1="${cx-r}" y1="${cy}" x2="${cx+r}" y2="${cy}" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
                       <circle cx="${cx}" cy="${cy}" r="3" fill="#ef4444"/>`;
            break;
        case 'circumference':
            propSvg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="5,5"/>`;
            break;
    }
    return `<svg viewBox="0 0 100 100" style="width: 100px; height: 100px;">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2"/>
        ${propSvg}
    </svg>`;
};

export const drawShapeForAngleCounting = (): { svg: string, right: number, acute: number, obtuse: number } => {
    const points = "10,90 10,40 50,10 90,40 90,90";
    const svg = `<svg viewBox="0 0 100 100" style="width: 100px; height: 100px;">
        <polygon points="${points}" fill="#fed7aa" stroke="#f97316" stroke-width="2"/>
        <rect x="10" y="80" width="10" height="10" fill="none" stroke="#ef4444" stroke-width="1.5" transform="translate(0, 0)"/>
        <rect x="80" y="80" width="10" height="10" fill="none" stroke="#ef4444" stroke-width="1.5" transform="translate(0, 0)"/>
    </svg>`;
    return { svg, right: 2, acute: 2, obtuse: 1 };
};

const shapeNetSVGs: Record<string, string> = {
    [SolidShapeType.Cube]: `
        <g transform="translate(25, 0)" stroke="#1e40af" fill="#93c5fd" stroke-width="1">
            <rect x="50" y="50" width="50" height="50"/>
            <rect x="50" y="0" width="50" height="50"/>
            <rect x="50" y="100" width="50" height="50"/>
            <rect x="50" y="150" width="50" height="50"/>
            <rect x="0" y="50" width="50" height="50"/>
            <rect x="100" y="50" width="50" height="50"/>
        </g>`,
    [SolidShapeType.Pyramid]: `
        <g transform="translate(50, 40)" stroke="#1e40af" fill="#93c5fd" stroke-width="1">
            <rect x="0" y="0" width="50" height="50"/>
            <polygon points="25,-50 0,0 50,0" />
            <polygon points="25,100 0,50 50,50" />
            <polygon points="-50,25 0,0 0,50" />
            <polygon points="100,25 50,0 50,50" />
        </g>`,
     [SolidShapeType.Cuboid]: `
        <g transform="translate(10, 0)" stroke="#1e40af" fill="#93c5fd" stroke-width="1">
            <rect x="40" y="40" width="80" height="40"/>
            <rect x="40" y="0" width="80" height="40"/>
            <rect x="40" y="80" width="80" height="40"/>
            <rect x="0" y="40" width="40" height="40"/>
            <rect x="120" y="40" width="40" height="40"/>
            <rect x="40" y="120" width="80" height="40"/>
        </g>`,
};

export const drawShapeNet = (type: SolidShapeType): string => {
    const svgContent = shapeNetSVGs[type] || '';
    return `<svg viewBox="0 0 200 200" style="max-width: 150px; display: block; margin: auto;">${svgContent}</svg>`;
};

// --- NEW VISUALIZATIONS ---

export const drawDice = (number: number): string => {
    const dots: Record<number, number[][]> = {
        1: [[50, 50]],
        2: [[20, 20], [80, 80]],
        3: [[20, 20], [50, 50], [80, 80]],
        4: [[20, 20], [80, 20], [20, 80], [80, 80]],
        5: [[20, 20], [80, 20], [50, 50], [20, 80], [80, 80]],
        6: [[20, 20], [80, 20], [20, 50], [80, 50], [20, 80], [80, 80]]
    };

    const dotPositions = dots[number] || [];
    const dotsSvg = dotPositions.map(pos => `<circle cx="${pos[0]}" cy="${pos[1]}" r="9" fill="#1f2937" />`).join('');

    return `
        <svg viewBox="0 0 100 100" style="width: 60px; height: 60px; display: inline-block;">
            <rect x="5" y="5" width="90" height="90" rx="15" fill="white" stroke="#1f2937" stroke-width="3" />
            ${dotsSvg}
        </svg>
    `;
};

export const drawDomino = (top: number, bottom: number, horizontal: boolean = false): string => {
    const drawHalf = (num: number, offsetX: number, offsetY: number) => {
        const dotMap: Record<number, number[][]> = {
            0: [],
            1: [[50, 50]],
            2: [[20, 20], [80, 80]],
            3: [[20, 20], [50, 50], [80, 80]],
            4: [[20, 20], [80, 20], [20, 80], [80, 80]],
            5: [[20, 20], [80, 20], [50, 50], [20, 80], [80, 80]],
            6: [[20, 20], [80, 20], [20, 50], [80, 50], [20, 80], [80, 80]]
        };
        const dots = dotMap[num] || [];
        return dots.map(pos => `<circle cx="${offsetX + pos[0]}" cy="${offsetY + pos[1]}" r="8" fill="#1f2937" />`).join('');
    };

    if (horizontal) {
        return `
            <svg viewBox="0 0 200 100" style="width: 100px; height: 50px; display: inline-block;">
                <rect x="5" y="5" width="190" height="90" rx="10" fill="white" stroke="#1f2937" stroke-width="3" />
                <line x1="100" y1="5" x2="100" y2="95" stroke="#1f2937" stroke-width="2" />
                ${drawHalf(top, 0, 0)}
                ${drawHalf(bottom, 100, 0)}
            </svg>
        `;
    } else {
        return `
            <svg viewBox="0 0 100 200" style="width: 50px; height: 100px; display: inline-block;">
                <rect x="5" y="5" width="90" height="190" rx="10" fill="white" stroke="#1f2937" stroke-width="3" />
                <line x1="5" y1="100" x2="95" y2="100" stroke="#1f2937" stroke-width="2" />
                ${drawHalf(top, 0, 0)}
                ${drawHalf(bottom, 0, 100)}
            </svg>
        `;
    }
};

export const drawCalendar = (monthName: string, startDay: number, daysInMonth: number, highlightDay?: number): string => {
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    
    let headerHtml = days.map(d => `<text x="${days.indexOf(d) * 30 + 15}" y="20" text-anchor="middle" font-size="10" font-weight="bold" fill="#4b5563">${d}</text>`).join('');
    
    let daysHtml = '';
    let currentX = startDay;
    let currentY = 0;

    for (let i = 1; i <= daysInMonth; i++) {
        const x = currentX * 30;
        const y = 40 + currentY * 25;
        
        const isHighlight = i === highlightDay;
        const highlightCircle = isHighlight ? `<circle cx="${x+15}" cy="${y-4}" r="10" fill="none" stroke="#ef4444" stroke-width="2" />` : '';

        daysHtml += `
            <text x="${x + 15}" y="${y}" text-anchor="middle" font-size="12" fill="${isHighlight ? '#ef4444' : '#1f2937'}" font-weight="${isHighlight ? 'bold' : 'normal'}">${i}</text>
            ${highlightCircle}
        `;

        currentX++;
        if (currentX > 6) {
            currentX = 0;
            currentY++;
        }
    }

    const totalHeight = 50 + (currentY + (currentX === 0 ? 0 : 1)) * 25;

    return `
        <div style="display: inline-block; border: 2px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: white; margin: 0 auto;">
            <div style="background: #3b82f6; color: white; padding: 4px; text-align: center; font-weight: bold; font-family: sans-serif;">${monthName}</div>
            <svg viewBox="0 0 210 ${totalHeight}" style="width: 210px; display: block;">
                ${headerHtml}
                ${daysHtml}
            </svg>
        </div>
    `;
};

export const drawRuler = (length: number, highlight?: number, unit: 'cm' | 'mm' = 'cm', startVal: number = 0): string => {
    const scale = 30; // pixels per unit (cm)
    const totalUnits = length;
    const width = totalUnits * scale + 40;
    const height = 50;
    
    let marks = '';
    
    // Draw ticks
    for (let i = 0; i <= totalUnits; i++) {
        const x = 20 + i * scale;
        // Main tick
        marks += `<line x1="${x}" y1="${height}" x2="${x}" y2="${height - 15}" stroke="#374151" stroke-width="1.5" />`;
        // Label
        marks += `<text x="${x}" y="${height - 20}" text-anchor="middle" font-size="10" font-family="monospace" fill="#374151">${startVal + i}</text>`;
        
        // Millimeter ticks
        if (i < totalUnits) {
            if (unit === 'cm') {
                const midX = x + scale / 2;
                marks += `<line x1="${midX}" y1="${height}" x2="${midX}" y2="${height - 10}" stroke="#9ca3af" stroke-width="1" />`;
            } else {
                for (let j=1; j<10; j++) {
                    const mmX = x + (scale * j / 10);
                    const h = j === 5 ? 10 : 6;
                    marks += `<line x1="${mmX}" y1="${height}" x2="${mmX}" y2="${height - h}" stroke="#9ca3af" stroke-width="0.5" />`;
                }
            }
        }
    }

    let highlightSvg = '';
    if (highlight !== undefined) {
        const x = 20 + (highlight - startVal) * scale;
        highlightSvg = `<path d="M ${x} ${height-25} L ${x-5} ${height-35} H ${x+5} Z" fill="#ef4444" />`;
    }

    return `
        <svg viewBox="0 0 ${width} ${height}" style="max-width: 100%; height: ${height}px; display: block; margin: auto;">
            <rect x="0" y="0" width="${width}" height="${height}" fill="#fef3c7" stroke="#d97706" stroke-width="1" rx="4" />
            ${marks}
            ${highlightSvg}
        </svg>
    `;
};

export const drawThermometer = (value: number): string => {
    // Value range typical -10 to 40
    const min = -10;
    const max = 40;
    const range = max - min;
    const height = 150;
    const width = 60;
    const bulbRadius = 15;
    const stemWidth = 12;
    const scaleY = (height - bulbRadius * 2 - 20) / range; // Pixels per degree
    
    // Position
    const cx = width / 2;
    const stemTop = 10;
    const zeroY = stemTop + max * scaleY;
    const mercuryY = zeroY - value * scaleY;
    
    // Ticks
    let ticks = '';
    for (let t = min; t <= max; t += 10) {
        const y = zeroY - t * scaleY;
        ticks += `<line x1="${cx + stemWidth/2}" y1="${y}" x2="${cx + stemWidth/2 + 8}" y2="${y}" stroke="black" stroke-width="1"/>`;
        ticks += `<text x="${cx + stemWidth/2 + 12}" y="${y + 3}" font-size="9" font-family="sans-serif">${t}</text>`;
    }
    for (let t = min; t <= max; t += 5) {
        if (t % 10 !== 0) {
            const y = zeroY - t * scaleY;
            ticks += `<line x1="${cx + stemWidth/2}" y1="${y}" x2="${cx + stemWidth/2 + 5}" y2="${y}" stroke="black" stroke-width="0.5"/>`;
        }
    }

    return `
        <svg viewBox="0 0 ${width} ${height + 10}" style="height: 150px; display: block; margin: auto;">
            <!-- Glass stem -->
            <rect x="${cx - stemWidth/2}" y="${stemTop}" width="${stemWidth}" height="${height - bulbRadius}" rx="${stemWidth/2}" fill="white" stroke="#cbd5e1" stroke-width="1"/>
            
            <!-- Bulb -->
            <circle cx="${cx}" cy="${height - bulbRadius}" r="${bulbRadius}" fill="white" stroke="#cbd5e1" stroke-width="1"/>
            
            <!-- Mercury Stem -->
            <rect x="${cx - stemWidth/2 + 2}" y="${mercuryY}" width="${stemWidth - 4}" height="${(height - bulbRadius) - mercuryY}" fill="#ef4444"/>
            
            <!-- Mercury Bulb -->
            <circle cx="${cx}" cy="${height - bulbRadius}" r="${bulbRadius - 2}" fill="#ef4444"/>
            
            <!-- Ticks -->
            ${ticks}
        </svg>
    `;
};

export const drawBeaker = (capacity: number, level: number, unit: string = 'mL'): string => {
    const width = 80;
    const height = 120;
    const padding = 10;
    const beakerHeight = height - padding * 2;
    const beakerWidth = width - padding * 2;
    
    // Simple graduation logic
    const step = capacity / 5;
    let ticks = '';
    const pxPerUnit = beakerHeight / capacity;
    
    for (let v = step; v <= capacity; v += step) {
        const y = (height - padding) - (v * pxPerUnit);
        ticks += `<line x1="${padding + beakerWidth}" y1="${y}" x2="${padding + beakerWidth - 10}" y2="${y}" stroke="black" stroke-width="1"/>`;
        ticks += `<text x="${padding + beakerWidth - 12}" y="${y+3}" text-anchor="end" font-size="9" font-family="sans-serif">${v}</text>`;
    }

    const fluidHeight = level * pxPerUnit;
    const fluidY = (height - padding) - fluidHeight;

    return `
        <svg viewBox="0 0 ${width} ${height}" style="height: 120px; display: block; margin: auto;">
            <!-- Fluid -->
            <rect x="${padding}" y="${fluidY}" width="${beakerWidth}" height="${fluidHeight}" fill="#bfdbfe" fill-opacity="0.6"/>
            
            <!-- Beaker Outline -->
            <path d="M ${padding} ${padding} V ${height - padding - 5} Q ${padding} ${height - padding} ${padding + 5} ${height - padding} H ${width - padding - 5} Q ${width - padding} ${height - padding} ${width - padding} ${height - padding - 5} V ${padding}" fill="none" stroke="#475569" stroke-width="2"/>
            
            <!-- Spout -->
            <path d="M ${width - padding} ${padding} L ${width} ${padding - 5}" stroke="#475569" stroke-width="2"/>
            
            <!-- Ticks -->
            ${ticks}
            <text x="${width/2}" y="${height - padding - 5}" text-anchor="middle" font-size="10" fill="#475569">${unit}</text>
        </svg>
    `;
};

export const drawBalanceScale = (leftWeight: number, rightWeight: number): string => {
    // Simple logic: if left > right, tilt left down.
    // Angle max 15 degrees.
    const diff = rightWeight - leftWeight; // Positive means right heavy (tilts right down, angle positive)
    const maxDiff = Math.max(leftWeight, rightWeight) || 1; // avoid div by zero
    // Normalize tilt
    let angle = (diff / (maxDiff * 1.5)) * 20; 
    angle = Math.max(-20, Math.min(20, angle)); // Clamp

    const width = 150;
    const height = 100;
    const fulcrumX = 75;
    const fulcrumY = 80;
    const beamLength = 120;
    
    return `
        <svg viewBox="0 0 ${width} ${height}" style="height: 100px; display: block; margin: auto;">
            <!-- Base -->
            <path d="M ${fulcrumX} ${fulcrumY} L ${fulcrumX - 10} ${height} H ${fulcrumX + 10} Z" fill="#4b5563"/>
            <line x1="${fulcrumX}" y1="${fulcrumY}" x2="${fulcrumX}" y2="${height}" stroke="#4b5563" stroke-width="2"/>

            <!-- Rotating Group -->
            <g transform="rotate(${angle}, ${fulcrumX}, ${fulcrumY})">
                <!-- Beam -->
                <line x1="${fulcrumX - beamLength/2}" y1="${fulcrumY}" x2="${fulcrumX + beamLength/2}" y2="${fulcrumY}" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
                
                <!-- Left Pan Chain -->
                <line x1="${fulcrumX - beamLength/2}" y1="${fulcrumY}" x2="${fulcrumX - beamLength/2}" y2="${fulcrumY + 30}" stroke="#9ca3af"/>
                <!-- Right Pan Chain -->
                <line x1="${fulcrumX + beamLength/2}" y1="${fulcrumY}" x2="${fulcrumX + beamLength/2}" y2="${fulcrumY + 30}" stroke="#9ca3af"/>
                
                <!-- Pans (keep them horizontal by counter-rotating) -->
                <g transform="translate(${fulcrumX - beamLength/2}, ${fulcrumY + 30}) rotate(${-angle})">
                    <path d="M -15 0 A 15 10 0 0 0 15 0 Z" fill="#d1d5db" stroke="#6b7280"/>
                    ${leftWeight > 0 ? `<rect x="-8" y="-12" width="16" height="12" fill="#ef4444" rx="2"/> <text x="0" y="-4" font-size="8" text-anchor="middle" fill="white">${leftWeight}</text>` : ''}
                </g>
                
                <g transform="translate(${fulcrumX + beamLength/2}, ${fulcrumY + 30}) rotate(${-angle})">
                    <path d="M -15 0 A 15 10 0 0 0 15 0 Z" fill="#d1d5db" stroke="#6b7280"/>
                    ${rightWeight > 0 ? `<rect x="-8" y="-12" width="16" height="12" fill="#3b82f6" rx="2"/> <text x="0" y="-4" font-size="8" text-anchor="middle" fill="white">${rightWeight}</text>` : ''}
                </g>
            </g>
        </svg>
    `;
};
