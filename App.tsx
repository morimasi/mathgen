
import React, 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
    PrintIcon,
    ShuffleIcon,
    SettingsIcon,
    HelpIcon,
    ContactIcon,
    LoadingIcon
} from './components/icons/Icons';
import { Problem, VisualSupportSettings, ArithmeticOperation, PrintSettings } from './types';
import { TAB_GROUPS } from './constants';
import { ThemeProvider, useTheme } from './services/ThemeContext';
import { FontThemeProvider } from './services/FontThemeContext';
import { PrintSettingsProvider, usePrintSettings } from './services/PrintSettingsContext';
import { ToastProvider } from './services/ToastContext';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext';
import Tabs from './components/Tabs';
import SettingsPanel from './components/SettingsPanel';
import ProblemSheet from './components/ProblemSheet';
import PrintSettingsPanel from './components/PrintSettingsPanel';
import ToastContainer from './components/ToastContainer';
import HowToUseModal from './components/HowToUseModal';
import ContactModal from './components/ContactModal';
import AnimatedLogo from './components/AnimatedLogo';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
    const [activeTab, setActiveTab] = useState('arithmetic');
    const [problems, setProblems] = useState<Problem[]>([]);
    const [worksheetTitle, setWorksheetTitle] = useState('Çalışma Kağıdı');
    const [pageCount, setPageCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeSidebarTab, setActiveSidebarTab] = useState('problems'); // 'problems' or 'print'
    const [isHowToUseVisible, setIsHowToUseVisible] = useState(false);
    const [isContactVisible, setIsContactVisible] = useState(false);
    const [autoRefreshTrigger, setAutoRefreshTrigger] = useState(0);
    const [lastGeneratorModule, setLastGeneratorModule] = useState<string | null>('arithmetic');

    const contentRef = useRef<HTMLDivElement>(null);
    const { settings: printSettings } = usePrintSettings();
    const { mode } = useTheme();
    
    // This state is managed here because the Visual Support module is "live" and its visual settings
    // need to be applied as CSS variables at the top level.
    const [visualSupportSettings, setVisualSupportSettings] = useState<VisualSupportSettings>({
        operation: ArithmeticOperation.Addition,
        maxNumber: 10,
        problemsPerPage: 6,
        pageCount: 1,
        autoFit: true,
        emojiSize: 32,
        numberSize: 18,
        boxSize: 50,
    });

    // Apply styles dynamically as CSS variables
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--font-size', `${printSettings.fontSize}px`);
        root.style.setProperty('--line-height', String(printSettings.lineHeight));
        root.style.setProperty('--problem-spacing', `${printSettings.problemSpacing}rem`);
        root.style.setProperty('--page-margin', `${printSettings.pageMargin}in`);
        root.style.setProperty('--scale', String(printSettings.scale));
        root.style.setProperty('--text-align', printSettings.textAlign);
        root.style.setProperty('--color-theme', printSettings.colorTheme === 'black' ? '#111827' : (printSettings.colorTheme === 'blue' ? '#1e40af' : '#57534e'));
        root.style.setProperty('--column-count', String(printSettings.columns));
        root.style.setProperty('--column-gap', `${printSettings.columnGap}rem`);
        
        // For Visual Support Module
        root.style.setProperty('--visual-emoji-size', `${visualSupportSettings.emojiSize}px`);
        root.style.setProperty('--visual-number-size', `${visualSupportSettings.numberSize}px`);
        root.style.setProperty('--visual-box-width', `${visualSupportSettings.boxSize}px`);
        root.style.setProperty('--visual-box-height', `${visualSupportSettings.boxSize}px`);
        root.style.setProperty('--visual-container-min-width', `${visualSupportSettings.boxSize + 10}px`);

    }, [printSettings, visualSupportSettings, mode]);


    const handleGenerate = useCallback((newProblems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, newPageCount: number) => {
        setProblems(prev => clearPrevious ? newProblems : [...prev, ...newProblems]);
        setWorksheetTitle(title);
        setLastGeneratorModule(generatorModule);
        setPageCount(newPageCount > 0 ? newPageCount : 1);
    }, []);

    const handlePrint = () => window.print();

    const handleRefresh = () => {
        if (lastGeneratorModule) {
            setAutoRefreshTrigger(val => val + 1);
        }
    };
    
    const handleReset = () => {
        if (window.confirm("Bu işlem mevcut çalışma kağıdını ve tüm ayarları sıfırlayacaktır. Devam etmek istiyor musunuz?")) {
            localStorage.clear();
            window.location.reload();
        }
    };
    
    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        setActiveSidebarTab('problems');
    };

    return (
        <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <header className="app-header print:hidden">
                <div className="flex items-center gap-4">
                    <AnimatedLogo onReset={handleReset} />
                    <h1 className="text-xl font-bold text-white tracking-tight">MathGen</h1>
                    <div className="hidden md:block">
                        <Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={handleTabClick} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handlePrint} className="header-button" title="Yazdır"><PrintIcon /></button>
                    <button onClick={handleRefresh} className="header-button" title="Yenile"><ShuffleIcon /></button>
                    <button onClick={() => setIsSidebarOpen(s => !s)} className="header-button" title="Ayarları Aç/Kapat"><SettingsIcon /></button>
                    <button onClick={() => setIsHowToUseVisible(true)} className="header-button" title="Nasıl Kullanılır?"><HelpIcon /></button>
                    <button onClick={() => setIsContactVisible(true)} className="header-button" title="İletişim"><ContactIcon /></button>
                    <ThemeSwitcher />
                </div>
            </header>
            
            <main className="app-main">
                <aside className={`sidebar print:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="sidebar-header">
                        <div className="flex border-b border-stone-200 dark:border-stone-700">
                             <button 
                                className={`sidebar-tab ${activeSidebarTab === 'problems' ? 'active' : ''}`}
                                onClick={() => setActiveSidebarTab('problems')}>
                                Problem Ayarları
                             </button>
                             <button 
                                className={`sidebar-tab ${activeSidebarTab === 'print' ? 'active' : ''}`}
                                onClick={() => setActiveSidebarTab('print')}>
                                Yazdırma Ayarları
                            </button>
                        </div>
                    </div>
                    <div className="sidebar-content">
                        {activeSidebarTab === 'problems' ? (
                            <SettingsPanel 
                                onGenerate={handleGenerate} 
                                setIsLoading={setIsLoading} 
                                activeTab={activeTab} 
                                contentRef={contentRef}
                                autoRefreshTrigger={autoRefreshTrigger}
                                lastGeneratorModule={lastGeneratorModule}
                                visualSupportSettings={visualSupportSettings}
                                setVisualSupportSettings={setVisualSupportSettings}
                            />
                        ) : (
                            <PrintSettingsPanel />
                        )}
                    </div>
                </aside>

                <div className="main-content">
                    {isLoading && (
                        <div className="loading-overlay">
                            <LoadingIcon className="w-24 h-24" />
                            <p className="mt-4 text-lg font-semibold text-orange-800 dark:text-orange-300">Problemler oluşturuluyor...</p>
                        </div>
                    )}
                    <div ref={contentRef} className="worksheet-container">
                        <ProblemSheet 
                            problems={problems} 
                            title={worksheetTitle}
                            pageCount={pageCount}
                        />
                    </div>
                </div>
            </main>

            <ToastContainer />
            <HowToUseModal isVisible={isHowToUseVisible} onClose={() => setIsHowToUseVisible(false)} />
            <ContactModal isVisible={isContactVisible} onClose={() => setIsContactVisible(false)} />
        </div>
    );
}

const AppWrapper = () => (
    <ThemeProvider>
        <FontThemeProvider>
            <PrintSettingsProvider>
                <ToastProvider>
                    <FlyingLadybugProvider>
                        <App />
                    </FlyingLadybugProvider>
                </ToastProvider>
            </PrintSettingsProvider>
        </FontThemeProvider>
    </ThemeProvider>
);

export default AppWrapper;
