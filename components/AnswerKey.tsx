import React from 'react';
import { useWorksheet } from '../services/WorksheetContext.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';

const AnswerKey: React.FC = () => {
    const { problems, title } = useWorksheet();
    const { settings } = usePrintSettings();

    if (problems.length === 0) {
        return null;
    }

    return (
        <div 
            className={`worksheet-page answer-key-page ${settings.orientation}`} 
            style={{ 
                padding: `${settings.pageMargin}rem`,
                '--columns': settings.columns 
            } as React.CSSProperties}
        >
            <h1 className="worksheet-title">{title} - CEVAP ANAHTARI</h1>
            <div className="answer-key-grid">
                {problems.map((problem, index) => (
                    <div key={index} className="answer-key-item">
                        <span className="answer-key-item-number">{index + 1}.</span>
                        <span>{problem.answer}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnswerKey;