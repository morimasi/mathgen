import React from 'react';
import { Problem } from '../types';

interface AnswerKeyProps {
    problems: Problem[];
}

const AnswerKey: React.FC<AnswerKeyProps> = ({ problems }) => {
    if (problems.length === 0 || problems[0]?.answer === 'PRACTICE_SHEET') {
        return null;
    }
    
    return (
        <div className="answer-key print-only mt-12">
            <div className="worksheet-header mb-8 pb-4 border-b-2 border-stone-800">
                <h2 className="text-2xl font-bold text-stone-800">Cevap Anahtarı</h2>
            </div>
            <div className="space-y-4">
                {problems.map((p, index) => (
                    <div key={index} className="text-base border-b border-dashed border-stone-200 pb-2 break-inside-avoid flex items-start gap-2">
                        <span className="font-bold">{index + 1}.</span>
                        <div className="flex-1">
                            {p.display === 'vertical-html' || p.display === 'long-division-html' ? (
                                <div className="flex items-center gap-4">
                                    <div dangerouslySetInnerHTML={{ __html: p.question }} className="scale-75 origin-left" />
                                    <div className="text-green-700 font-bold self-end pb-1">
                                        <span className="font-mono">{p.answer}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="font-mono" dangerouslySetInnerHTML={{ __html: p.question.replace(/<br\s*\/?>/gi, ' ') }} />
                            )}

                            {p.display !== 'vertical-html' && p.display !== 'long-division-html' && (
                                <div className="mt-1 text-green-700 font-bold">
                                    <span className="font-sans">Cevap: </span><span className="font-mono">{p.answer}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnswerKey;