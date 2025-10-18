// services/svgService.ts

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
}

export const draw2DShape = (params: ShapeParams): string => {
    const { type, w, h, s, b, s1, s2, r, a, c, d, isArea } = params;
    let svgContent = '';
    const width = 150, height = 100;
    const commonStyle = 'fill="#f0f9ff" stroke="#0ea5e9" stroke-width="2"';
    const textStyle = 'font-size="12px" fill="#0c4a6e" font-family="sans-serif"';

    switch (type) {
        case 'rectangle':
            svgContent = `<rect x="25" y="25" width="100" height="50" ${commonStyle} />
                        <text x="75" y="20" text-anchor="middle" ${textStyle}>${w} br</text>
                        <text x="20" y="50" text-anchor="end" dominant-baseline="middle" ${textStyle}>${h} br</text>`;
            break;
        case 'square':
            svgContent = `<rect x="25" y="10" width="80" height="80" ${commonStyle} />
                        <text x="65" y="5" text-anchor="middle" ${textStyle}>${s} br</text>`;
            break;
        case 'triangle':
            const base = b || 80;
            const heightVal = h || 60;
            svgContent = `<polygon points="75,10 ${75 - base / 2},${10 + heightVal} ${75 + base / 2},${10 + heightVal}" ${commonStyle} />
                        <text x="75" y="${15 + heightVal}" text-anchor="middle" ${textStyle}>${base} br</text>
                        <line x1="75" y1="10" x2="75" y2="${10 + heightVal}" stroke-dasharray="2" stroke="#0c4a6e" />
                        <text x="80" y="50" ${textStyle}>h=${heightVal}</text>`;
            if (s1 && s2) {
                svgContent += `<text x="40" y="50" transform="rotate(-60 40 50)" ${textStyle}>${s1} br</text>`;
            }
            break;
        case 'circle':
            svgContent = `<circle cx="75" cy="50" r="${r || 40}" ${commonStyle} />
                        <line x1="75" y1="50" x2="${75 + (r || 40)}" y2="50" stroke="#0c4a6e" stroke-dasharray="2" />
                        <text x="${75 + (r || 40) / 2}" y="45" text-anchor="middle" ${textStyle}>r=${r}</text>`;
            break;
        case 'parallelogram':
             svgContent = `<polygon points="30,80 130,80 110,20 10,20" ${commonStyle} />
                         <text x="70" y="95" text-anchor="middle" ${textStyle}>${b} br</text>`;
             if(isArea) {
                svgContent += `<line x1="30" y1="20" x2="30" y2="80" stroke-dasharray="2" stroke="#0c4a6e" />
                             <text x="35" y="50" ${textStyle}>h=${h}</text>`;
             } else {
                 svgContent += `<text x="125" y="50" transform="rotate(20 125 50)" ${textStyle}>${params.s} br</text>`;
             }
            break;
        case 'trapezoid':
            svgContent = `<polygon points="50,20 100,20 130,80 20,80" ${commonStyle} />
                        <text x="75" y="15" text-anchor="middle" ${textStyle}>${a} br</text>
                        <text x="75" y="95" text-anchor="middle" ${textStyle}>${b} br</text>`;
            if(isArea) {
                 svgContent += `<line x1="50" y1="20" x2="50" y2="80" stroke-dasharray="2" stroke="#0c4a6e" />
                              <text x="55" y="50" ${textStyle}>h=${h}</text>`;
            } else {
                svgContent += `<text x="30" y="50" transform="rotate(-70 30 50)" ${textStyle}>${c} br</text>
                             <text x="120" y="50" transform="rotate(70 120 50)" ${textStyle}>${d} br</text>`;
            }
            break;
        case 'pentagon':
        case 'hexagon':
        case 'rhombus':
            const sides = type === 'pentagon' ? 5 : (type === 'hexagon' ? 6 : 4);
            const radius = 40;
            let points = '';
            if (type === 'rhombus') {
                points = `75,10 115,50 75,90 35,50`;
            } else {
                points = Array.from({ length: sides }).map((_, i) => {
                    const angle = (i * 2 * Math.PI / sides) - (Math.PI / 2);
                    const x = 75 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    return `${x},${y}`;
                }).join(' ');
            }
            svgContent = `<polygon points="${points}" ${commonStyle} />
                        <text x="100" y="80" ${textStyle}>${s} br</text>`;
            break;
    }

    return `<svg viewBox="0 0 ${width} ${height}" style="max-width: 150px; display: block; margin: auto;">${svgContent}</svg>`;
};


export const drawFractionPie = (numerator: number, denominator: number): string => {
    const r = 50;
    const cx = 50;
    const cy = 50;
    let svg = `<svg viewBox="0 0 100 100" style="width: 100px; height: 100px;">`;
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

export const drawAngle = (angle: number): string => {
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
    svg += `<path d="M ${arcX} ${arcY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcEndX} ${arcEndY}" stroke="#ef4444" stroke-width="1.5" fill="none" />`;
    
    // Position text near arc
    const textAngleRad = (180 - angle / 2) * Math.PI / 180;
    const textX = cx + (arcRadius + 10) * Math.cos(textAngleRad);
    const textY = cy - (arcRadius + 10) * Math.sin(textAngleRad);
    svg += `<text x="${textX}" y="${textY}" font-size="12" fill="#0c4a6e" text-anchor="middle" dominant-baseline="middle">${angle}°</text>`;
    svg += `</svg>`;
    
    return svg;
};

export const drawSymmetryLine = (shape: string): string => {
    let shapePath = '';
    switch (shape) {
        case 'Kelebek':
            shapePath = `<path d="M 50 10 C 20 20, 20 80, 50 90 L 50 10 M 50 10 C 80 20, 80 80, 50 90" fill="#facc15" stroke="#f59e0b" stroke-width="2" />`;
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
    const symmetryLine = shape === 'C Harfi' ? 
        `<line x1="20" y1="50" x2="130" y2="50" stroke="red" stroke-width="1.5" stroke-dasharray="4" />` :
        `<line x1="75" y1="5" x2="75" y2="95" stroke="red" stroke-width="1.5" stroke-dasharray="4" />`;
    
    return `<svg viewBox="0 0 150 100" style="width: 150px;">${shapePath}${symmetryLine}</svg>`;
};
