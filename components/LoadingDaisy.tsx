import React from 'react';

const LoadingDaisy: React.FC = () => {
    return (
        <div className="relative w-24 h-24">
            <svg viewBox="0 0 150 150" className="w-full h-full overflow-visible">
                <g>
                    {/* Center of the daisy */}
                    <circle cx="75" cy="75" r="15" fill="#facc15" stroke="#f59e0b" strokeWidth="2" />
                    
                    {/* Spinning Petals Group */}
                    <g transform="translate(75, 75) scale(1.1)" className="spinning-petals">
                       {/* Petals (12 of them) */}
                       {Array.from({ length: 12 }).map((_, i) => (
                            <ellipse
                                key={i}
                                cx="0"
                                cy="-30"
                                rx="8"
                                ry="25"
                                fill="white"
                                stroke="#d1d5db"
                                strokeWidth="1"
                                transform={`rotate(${i * 30})`}
                            />
                       ))}
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default LoadingDaisy;
