import React from 'react';
import { Problem, VisualSupportSettings } from '../types';
import { usePrintSettings } from '../services/PrintSettingsContext';

const LadybugSVGLoader: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 50 50" width="100%" height="100%" className={className}>
        <defs>
            <radialGradient id="ladybugLoaderShine" cx="0.5" cy="0.2" r="0.8">
                <stop offset="0%" stopColor="#ff4444" />
                <stop offset="100%" stopColor="#d90429" />
            </radialGradient>
        </defs>
        <ellipse cx="25" cy="28" rx="17" ry="14" fill="#111" />
        <g>
            <path d="M25,14 C15,14 7,28 7,28 C7,42 15,42 25,42 Z" fill="url(#ladybugLoaderShine)" stroke="#111" strokeWidth="1" />
            <path d="M25,14 C35,14 43,28 43,28 C43,42 35,42 25,42 Z" fill="url(#ladybugLoaderShine)" stroke="#111" strokeWidth="1" />
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

const LadybugLoader: React.FC = () => {
    return (
        <div className="ladybug-loader-container">
            <div className="ladybug-loader-animation">
                <svg width="200" height="2" className="absolute bottom-1/2 translate-y-1/2">
                    <line x1="0" y1="1" x2="200" y2="1" className="ladybug-loader-track"/>
                </svg>
                <LadybugSVGLoader className="ladybug-loader-bug" />
            </div>
            <p className="text-lg">Problemler oluşturuluyor...</p>
        </div>
    );
};


interface ProblemSheetProps {
    problems: Problem[];
    isLoading: boolean;
    title: string;
    contentRef: React.RefObject<HTMLDivElement>;
    visualSupportSettings?: VisualSupportSettings;
    viewScale: number;
    pageCount: number;
}

const ProblemSheet: React.FC<ProblemSheetProps> = ({ problems, isLoading, title, contentRef, visualSupportSettings, viewScale, pageCount }) => {
    const { settings } = usePrintSettings();
    
    if (isLoading) {
        return <LadybugLoader />;
    }

    if (problems.length === 0) {
        return (
            <div className="mt-12 p-8 text-center bg-white dark:bg-stone-800/80 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-stone-700 dark:text-stone-300">Başlamak için ayarları seçin ve "Oluştur" düğmesine tıklayın.</h2>
                <p className="mt-2 text-stone-500 dark:text-stone-400">Matematik çalışma kağıtları oluşturmak hiç bu kadar kolay olmamıştı!</p>
            </div>
        );
    }

    const problemSheetStyle: React.CSSProperties = {
        '--table-cols': settings.columns,
        '--table-rows': settings.layoutMode === 'table' ? settings.rows : 'auto-fill',
        '--font-size': `${settings.fontSize}px`,
        '--problem-spacing': `${settings.problemSpacing}rem`,
        '--column-gap': `${settings.columnGap}rem`,
        '--line-height': settings.lineHeight,
        '--view-scale': viewScale,
        '--print-scale': settings.scale,
        '--page-margin': `${settings.pageMargin}rem`,
        '--notebook-color': settings.colorTheme === 'blue' ? 'rgba(0, 0, 255, 0.35)' : (settings.colorTheme === 'sepia' ? 'rgba(112, 66, 20, 0.35)' : 'rgba(0, 0, 0, 0.35)'),
        '--text-color': settings.colorTheme === 'blue' ? '#0000AA' : (settings.colorTheme === 'sepia' ? '#5a380a' : '#1e293b'),
        '--problem-text-align': settings.textAlign || 'left',
        '--problem-justify-content': settings.textAlign === 'right' ? 'flex-end' : settings.textAlign === 'center' ? 'center' : 'flex-start',
    } as React.CSSProperties;

    const isVisual = problems[0]?.category === 'visual-support';
    if (isVisual && visualSupportSettings) {
        problemSheetStyle['--visual-emoji-size'] = `${visualSupportSettings.emojiSize}px`;
        problemSheetStyle['--visual-number-size'] = `${visualSupportSettings.numberSize}px`;
        problemSheetStyle['--visual-box-width'] = `${visualSupportSettings.boxSize}px`;
        problemSheetStyle['--visual-box-height'] = `${visualSupportSettings.boxSize * 0.7}px`;
        problemSheetStyle['--visual-container-min-width'] = `${visualSupportSettings.boxSize + 20}px`;
    }

    const worksheetContentClasses = ['worksheet-content'];
    if (settings.notebookStyle !== 'none') {
        worksheetContentClasses.push(`notebook-${settings.notebookStyle}`);
    }

    const pages = [];
    if (pageCount > 1 && problems.length > 0) {
        const problemsPerPage = Math.ceil(problems.length / pageCount);
        for (let i = 0; i < problems.length; i += problemsPerPage) {
            pages.push(problems.slice(i, i + problemsPerPage));
        }
    } else {
        pages.push(problems);
    }


    return (
        <div ref={contentRef}>
            {pages.map((pageProblems, pageIndex) => (
                <div 
                    key={pageIndex}
                    id={`worksheet-container-${pageIndex}`} 
                    className="worksheet-container" 
                    style={problemSheetStyle}
                    data-orientation={settings.orientation}
                >
                    <div className={worksheetContentClasses.join(' ')}>
                        {settings.showHeader && (
                            <header className="worksheet-header">
                                <div className="worksheet-title" />
                                <div className="worksheet-info">
                                    <span className="whitespace-nowrap">Okul: ..........................</span>
                                    <span className="whitespace-nowrap">İsim: ..........................</span>
                                    <span className="whitespace-nowrap">Tarih: ..........................</span>
                                </div>
                            </header>
                        )}
                        
                        {title && pageIndex === 0 && <h3 className="text-xl font-semibold mb-6 text-center">{title}</h3>}

                        <div className="problem-list">
                            {pageProblems.map((p, index) => {
                                const isVisualProblem = p.display === 'long-division-html' || p.display === 'vertical-html' || p.question.includes('<svg') || p.category === 'visual-support';
                                
                                let itemClassName = `problem-item ${isVisualProblem ? 'items-center' : ''}`;
                                if (settings.layoutMode === 'table') {
                                    itemClassName += ' problem-item-table';
                                }

                                const isArithmetic = p.category === 'arithmetic';

                                if (settings.borderStyle === 'card') {
                                    itemClassName += ` problem-item-card`;
                                } else if (settings.borderStyle !== 'none') {
                                    itemClassName += ` problem-item-bordered border-${settings.borderStyle}`;
                                }

                                return (
                                    <div key={index} className={itemClassName}>
                                        {!isArithmetic && <span className="problem-number">{index + 1 + (pageIndex * Math.ceil(problems.length / pageCount))}.</span>}
                                        <div 
                                            className={(isArithmetic || isVisual) ? 'w-full' : 'problem-content'}
                                            dangerouslySetInnerHTML={{ __html: p.question }}
                                         />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProblemSheet;