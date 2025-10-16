

import React from 'react';
import { Problem } from '../types';
import AnswerKey from './AnswerKey';
import { usePrintSettings } from '../services/PrintSettingsContext';

interface ProblemSheetProps {
    problems: Problem[];
    title: string;
    pageCount: number;
}

const ProblemSheet: React.FC<ProblemSheetProps> = ({ problems, title, pageCount }) => {
    const { settings } = usePrintSettings();

    const getProblemsForPage = (pageIndex: number, totalPages: number): Problem[] => {
        if (settings.layoutMode === 'table') {
            // Table mode fits all on one page, so just return all problems for the first page.
            return pageIndex === 0 ? problems : [];
        }
        const problemsPerPage = Math.ceil(problems.length / totalPages);
        if (problemsPerPage === 0 && problems.length > 0) { // Avoid division by zero, show all on one page
             return pageIndex === 0 ? problems : [];
        }
        const start = pageIndex * problemsPerPage;
        const end = start + problemsPerPage;
        return problems.slice(start, end);
    };

    const totalPages = settings.layoutMode === 'table' ? 1 : (pageCount || 1);
    
    if (problems.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-center text-stone-500 dark:text-stone-400 p-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Başlamaya Hazır!</h2>
                    <p>Soldaki menüden bir konu seçip ayarları yaparak çalışma kağıdınızı oluşturun.</p>
                </div>
            </div>
        );
    }

    const renderProblemItem = (problem: Problem, index: number, globalIndex: number) => (
        <div key={globalIndex} className={`problem-item ${problem.display}`}>
            <span className="problem-number">{globalIndex + 1}.</span>
            <div
                className="problem-content"
                dangerouslySetInnerHTML={{ __html: problem.question }}
            />
        </div>
    );

    const problemListStyle: React.CSSProperties = {
        '--table-rows': settings.rows,
        '--table-cols': settings.columns,
        '--column-count': settings.columns,
        '--column-gap': `${settings.columnGap}rem`,
        '--problem-spacing': `${settings.problemSpacing}rem`,
    } as React.CSSProperties;

    return (
        <div className={`
            page-container 
            notebook-style-${settings.notebookStyle}
            border-style-${settings.borderStyle}
            ${settings.colorTheme === 'blue' ? 'text-blue-900' : (settings.colorTheme === 'sepia' ? 'text-stone-800' : 'text-stone-900')}
        `}>
            {Array.from({ length: totalPages }).map((_, pageIndex) => {
                const pageProblems = getProblemsForPage(pageIndex, totalPages);
                const isPracticeSheet = pageProblems[0]?.answer === 'PRACTICE_SHEET';

                return (
                    <div key={pageIndex} className={`worksheet-page break-after-page orientation-${settings.orientation}`}>
                        {settings.showHeader && (
                            <div className="worksheet-header">
                                <div className="header-field">Ad-Soyad:</div>
                                <div className="header-field">Tarih:</div>
                                <div className="header-field">Puan:</div>
                            </div>
                        )}

                        <h3 className="worksheet-title">{title}</h3>

                        <div 
                            className={`problem-list layout-mode-${settings.layoutMode} ${isPracticeSheet ? 'practice-sheet-list' : ''}`}
                            style={problemListStyle}
                        >
                            {pageProblems.map((p, i) => renderProblemItem(p, i, (pageIndex * Math.ceil(problems.length / totalPages)) + i))}
                        </div>
                    </div>
                );
            })}
            <AnswerKey problems={problems} />
        </div>
    );
};

export default ProblemSheet;