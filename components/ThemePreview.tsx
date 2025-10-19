import React from 'react';

interface ThemePreviewProps {
    colorClass: string;
    fontClass: string;
    onClick: () => void;
    isSelected: boolean;
    label: string;
}

const ThemePreview: React.FC<ThemePreviewProps> = React.memo(({ colorClass, fontClass, onClick, isSelected, label }) => {
    return (
        <button 
            onClick={onClick} 
            className={`theme-preview-button ${isSelected ? 'selected' : ''}`}
            title={label}
        >
            <div className={`theme-preview ${colorClass} ${fontClass}`}>
                <div className="preview-title"></div>
                <div className="preview-line"></div>
                <div className="preview-line short"></div>
                <div className="preview-line"></div>
                <div className="preview-line short"></div>
            </div>
            <span className="preview-label">{label}</span>
        </button>
    );
});

export default ThemePreview;
