import React, { useState, useEffect } from 'react';

interface FlyingLadybugProps {
    id: number;
    startX: number;
    startY: number;
    onEnded: (id: number) => void;
}

const ShinyLadybugSVG: React.FC = () => (
    <svg viewBox="0 0 60 60" width="100%" height="100%">
        <defs>
            <filter id="ladybug-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <radialGradient id="shiny-body" cx="0.5" cy="0.2" r="0.8">
                <stop offset="0%" stopColor="#ff6666" />
                <stop offset="100%" stopColor="#cc0000" />
            </radialGradient>
        </defs>
        
        {/* Wings */}
        <g className="wings">
            <path className="left-wing" d="M 30 30 C 10 10, 10 50, 30 30 Z" fill="rgba(200, 220, 255, 0.7)" />
            <path className="right-wing" d="M 30 30 C 50 10, 50 50, 30 30 Z" fill="rgba(200, 220, 255, 0.7)" />
        </g>
        
        {/* Body */}
        <g filter="url(#ladybug-glow)">
            <ellipse cx="30" cy="33" rx="19" ry="16" fill="#111" />
            <path d="M30,17 C19,17 10,33 10,33 C10,49 19,49 30,49 Z" fill="url(#shiny-body)" stroke="#111" strokeWidth="1" />
            <path d="M30,17 C41,17 50,33 50,33 C50,49 41,49 30,49 Z" fill="url(#shiny-body)" stroke="#111" strokeWidth="1" />
            
            {/* Spots */}
            <circle cx="20" cy="28" r="4" fill="#111"/>
            <circle cx="40" cy="28" r="4" fill="#111"/>
            <circle cx="25" cy="40" r="3.5" fill="#111"/>
            <circle cx="35" cy="40" r="3.5" fill="#111"/>
            <circle cx="30" cy="24" r="3" fill="#111"/>

            {/* Head */}
            <path d="M 30 21 C 22 21 18 12 30 12 C 42 12 38 21 30 21 Z" fill="#222"/>
            <path d="M 23 15 Q 18 8 16 11" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 37 15 Q 42 8 44 11" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
    </svg>
);


const FlyingLadybug: React.FC<FlyingLadybugProps> = ({ id, startX, startY, onEnded }) => {
    const [style, setStyle] = useState<React.CSSProperties>({
        top: `${startY - 20}px`,
        left: `${startX - 20}px`,
        transform: 'scale(0)',
        opacity: 0,
    });
    const hasEnded = React.useRef(false);

    useEffect(() => {
        // Phase 1: Appear and grow
        const appearTimeout = setTimeout(() => {
            setStyle({
                top: `${startY - 25}px`, // Move up slightly
                left: `${startX - 20}px`,
                transform: 'scale(1)',
                opacity: 1,
                transition: 'transform 0.2s ease-out, opacity 0.2s ease-out, top 0.2s ease-out',
            });
        }, 10);

        // Phase 2: Fly away upwards
        const flyTimeout = setTimeout(() => {
            const driftX = (Math.random() - 0.5) * 80; // Small horizontal drift
            const travelY = 150 + Math.random() * 100; // Fly up 150-250px
            const duration = 1.5 + Math.random() * 1; // 1.5-2.5 seconds
            const rotation = (Math.random() - 0.5) * 30; // Gentle rotation

            setStyle({
                top: `${startY - travelY}px`,
                left: `${startX - 20 + driftX}px`, // Apply drift from center
                transform: `scale(0) rotate(${rotation}deg)`, // Shrink to disappear
                opacity: 0,
                transition: `all ${duration}s ease-out`,
            });
        }, 250); // Wait a bit before flying

        return () => {
            clearTimeout(appearTimeout);
            clearTimeout(flyTimeout);
        };
    }, [startX, startY]);
    
    const handleTransitionEnd = () => {
        if (!hasEnded.current) {
            hasEnded.current = true;
            onEnded(id);
        }
    }

    return (
        <div 
            style={style} 
            className="flying-ladybug-container"
            onTransitionEnd={handleTransitionEnd}
        >
            <ShinyLadybugSVG />
        </div>
    );
};

export default FlyingLadybug;
