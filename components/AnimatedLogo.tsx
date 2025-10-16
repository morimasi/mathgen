import React, { useState, useMemo } from 'react';

const LadybugSVG: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 50 50" width="100%" height="100%" className={className}>
        <defs>
            <radialGradient id="ladybugShine" cx="0.5" cy="0.2" r="0.8">
                <stop offset="0%" stopColor="#ff4444" />
                <stop offset="100%" stopColor="#d90429" />
            </radialGradient>
        </defs>
        <ellipse cx="25" cy="28" rx="17" ry="14" fill="#111" />
        <g>
            <path d="M25,14 C15,14 7,28 7,28 C7,42 15,42 25,42 Z" fill="url(#ladybugShine)" stroke="#111" strokeWidth="1" />
            <path d="M25,14 C35,14 43,28 43,28 C43,42 35,42 25,42 Z" fill="url(#ladybugShine)" stroke="#111" strokeWidth="1" />
        </g>
        <path d="M 25 18 C 18 18 15 10 25 10 C 35 10 32 18 25 18 Z" fill="#2B2D42"/>
        <g>
            <path d="M 19 12 Q 15 5 13 8" stroke="#2B2D42" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 31 12 Q 35 5 37 8" stroke="#2B2D42" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
        <g pointerEvents="none">
          <circle cx="16" cy="25" r="3.5" fill="#2B2D42"/>
          <circle cx="34" cy="25" r="3.5" fill="#2B2D42"/>
          <circle cx="20" cy="35" r="3" fill="#2B2D42"/>
          <circle cx="30" cy="35" r="3" fill="#2B2D42"/>
          <circle cx="25" cy="22" r="2.5" fill="#2B2D42"/>
        </g>
    </svg>
);

interface AnimatedLogoProps {
    onReset: () => void;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ onReset }) => {
    const [isExploded, setIsExploded] = useState(false);

    const petalExplosions = useMemo(() => {
        return Array.from({ length: 12 }, () => ({
            x: (Math.random() - 0.5) * 400, // Scatter up to 200px in each direction
            y: (Math.random() - 0.5) * 400,
            rotate: (Math.random() - 0.5) * 720,
        }));
    }, []);
    
    const handleResetClick = () => {
        onReset();
    };

    const handleMouseEnter = () => setIsExploded(true);
    const handleMouseLeave = () => setIsExploded(false);

    return (
        <button
            onClick={handleResetClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative h-10 w-10 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-full cursor-pointer"
            title="Uygulamayı Sıfırla"
            aria-label="Uygulamayı Sıfırla"
        >
            <svg viewBox="0 0 150 150" className="absolute -top-8 -left-8 w-24 h-24 overflow-visible">
                <g className="daisy-sway" style={{ animationPlayState: isExploded ? 'paused' : 'running' }}>
                    
                    {/* Core parts that fade away */}
                    <g style={{ opacity: isExploded ? 0 : 1, transition: 'opacity 0.3s ease-out' }}>
                        {/* Stem and Leaves */}
                        <path d="M 75 140 C 75 100, 60 90, 60 80" stroke="#4d7c0f" strokeWidth="4" fill="none" strokeLinecap="round" />
                        <path d="M 68 110 C 50 115, 40 100, 63 98" fill="#65a30d" stroke="#4d7c0f" strokeWidth="1.5" />
                        <path d="M 72 125 C 90 120, 95 110, 77 112" fill="#65a30d" stroke="#4d7c0f" strokeWidth="1.5" />
                         {/* Center */}
                        <circle cx="75" cy="75" r="15" fill="#facc15" stroke="#f59e0b" strokeWidth="2" />
                    </g>
                    
                    {/* Petals */}
                    <g transform="translate(75, 75) scale(1.1)">
                       {petalExplosions.map((explosion, i) => (
                           <g
                                key={i}
                                style={{
                                    transform: isExploded
                                        ? `translate(${explosion.x}px, ${explosion.y}px) rotate(${explosion.rotate}deg)`
                                        : 'translate(0, 0) rotate(0)',
                                    transition: 'transform 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6)', // "back" easing
                                }}
                           >
                                <ellipse
                                    cx="0"
                                    cy="-30"
                                    rx="8"
                                    ry="25"
                                    fill="white"
                                    stroke="#d1d5db"
                                    strokeWidth="1"
                                    transform={`rotate(${i * 30})`}
                                />
                           </g>
                       ))}
                    </g>
                </g>
            </svg>
            <div className="absolute -top-[1.6rem] left-[0.1rem] w-20 h-20">
                 <LadybugSVG className="crawling-bug w-6 h-6" />
            </div>
        </button>
    );
};

export default AnimatedLogo;