import React from 'react';
import { useWorksheet } from '../services/WorksheetContext';
import { usePrintSettings } from '../services/PrintSettingsContext';
// FIX: Add .ts extension to import path
import { Problem } from '../types.ts';


const ProblemSheet: React.FC = () => {
    const { problems, title, preamble, pageCount } = useWorksheet();
    const { settings } = usePrintSettings();
    
    const pageMargins = `${settings.pageMargin}rem`;
    const problemSpacing = `${settings.problemSpacing}rem`;
    const columnGap = `${settings.columnGap}rem`;

    const problemSheetStyle: React.CSSProperties = {
        '--font-size': `${settings.fontSize}px`,
        '--line-height': settings.lineHeight,
        '--text-align': settings.textAlign,
        '--color': `var(--theme-color-${settings.colorTheme})`,
        '--scale': settings.scale,
    } as React.CSSProperties;

    const renderProblem = (problem: Problem, index: number) => {
        const problemContent = (
            <>
                {settings.showProblemNumbers && <span className="problem-number">{index + 1}.</span>}
                <div className="problem-content" dangerouslySetInnerHTML={{ __html: problem.question }} />
            </>
        );

        const problemLayoutClass = problem.layout ? `layout-${problem.layout}` : '';

        if (problem.layout === 'given-wanted') {
             return (
                <div key={index} className={`problem-item ${problem.display || ''} ${problemLayoutClass}`} data-border-style={settings.borderStyle}>
                    {problemContent}
                    <div className="given-wanted-container">
                        <div><strong>Verilenler:</strong><div className="solution-box"></div></div>
                        <div><strong>İstenenler:</strong><div className="solution-box"></div></div>
                        <div><strong>Çözüm:</strong><div className="solution-box tall"></div></div>
                    </div>
                </div>
            );
        }

        if (problem.layout === 'with-visual-space') {
             return (
                <div key={index} className={`problem-item ${problem.display || ''} ${problemLayoutClass}`} data-border-style={settings.borderStyle}>
                    {problemContent}
                    <div className="visual-space"></div>
                </div>
            );
        }

        return (
            <div key={index} className={`problem-item ${problem.display || ''} ${problemLayoutClass}`} data-border-style={settings.borderStyle}>
                {problemContent}
            </div>
        );
    };

    const pages = Array.from({ length: pageCount }, (_, pageIndex) => (
        <div 
            key={pageIndex}
            id={`worksheet-container-${pageIndex}`}
            className={`worksheet-page print-page ${settings.orientation}`} 
            style={{ padding: pageMargins }}
            data-notebook-style={settings.notebookStyle}
        >
            <div className="notebook-background"></div>
            {settings.showHeader && (
                <div className="worksheet-header">
                    <div className="header-field">Okul:</div>
                    <div className="header-field">İsim:</div>
                    <div className="header-field">Tarih:</div>
                </div>
            )}
            <h1 className="worksheet-title" style={{ textAlign: settings.textAlign }}>{title}</h1>
            {preamble && <div className="worksheet-preamble" dangerouslySetInnerHTML={{ __html: preamble }} />}
            <div 
                className={`worksheet-body layout-${settings.layoutMode}`}
                style={{ 
                    '--columns': settings.columns, 
                    '--rows': settings.rows,
                    '--problem-spacing': problemSpacing,
                    '--column-gap': columnGap,
                } as React.CSSProperties}
            >
                {problems.map(renderProblem)}
            </div>
        </div>
    ));

    return (
        <div id="worksheet-area" className="worksheet-area" style={problemSheetStyle}>
            {pages}
        </div>
    );
};

export default ProblemSheet;