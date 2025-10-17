import React, { useState, useRef, useCallback } from 'react';

// Providers
import { UIProvider, useUI } from './services/UIContext';
import { WorksheetProvider, useWorksheet } from './services/WorksheetContext';
import { PrintSettingsProvider } from './services/PrintSettingsContext';
import { ThemeProvider } from './services/ThemeContext';
import { FontThemeProvider } from './services/FontThemeContext';
import { ColorThemeProvider } from './services/ColorThemeContext';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext';
import { ToastProvider } from './services/ToastContext';

// Components
import AnimatedLogo from './components/AnimatedLogo';
import Tabs from './components/Tabs';
import ThemeSwitcher from './components/ThemeSwitcher';
import SettingsPanel from './components/SettingsPanel';
import ProblemSheet from './components/ProblemSheet';
import PrintSettingsPanel from './components/PrintSettingsPanel';
import HowToUseModal from './components/HowToUseModal';
import ContactModal from './components/ContactModal';
import ToastContainer from './components/ToastContainer';
import { RefreshIcon, PrintIcon, HelpIcon, MailIcon, ScaleIcon, FitToScreenIcon } from './components/icons/Icons';

// Constants
import { TAB_GROUPS } from './constants';

const AppContent: React.FC = () => {
    const { resetWorksheet, triggerAutoRefresh } = useWorksheet();
    const { activeTab, setActiveTab } = useUI();
    const [isPrintSettingsVisible, setIsPrintSettingsVisible] = useState(false);
    const [isHowToUseVisible, setIsHowToUseVisible] = useState(false);
    const [isContactVisible, setIsContactVisible] = useState(false);
    const [viewScale, setViewScale] = useState(1);
    const contentRef = useRef<HTMLDivElement>(null);
    const mainAreaRef = useRef<HTMLDivElement>(null);

    const fitToScreen = useCallback(() => {
        if (!mainAreaRef.current || !contentRef.current) return;
        const mainAreaWidth = mainAreaRef.current.offsetWidth;
        const worksheet = contentRef.current.querySelector('.worksheet-container') as HTMLElement;
        if (!worksheet) return;

        const PADDING = 40;
        const worksheetWidth = worksheet.offsetWidth;
        
        if (worksheetWidth > 0) {
            const scale = (mainAreaWidth - PADDING) / worksheetWidth;
            setViewScale(Math.min(scale, 1.5));
        }
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200">
            <header className="print:hidden flex-shrink-0 bg-orange-700 dark:bg-orange-800/90 text-white shadow-md z-10 p-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <AnimatedLogo onReset={resetWorksheet} />
                    <Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={setActiveTab} />
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={triggerAutoRefresh} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Soruları Yenile">
                        <RefreshIcon />
                    </button>
                    <button onClick={() => setIsPrintSettingsVisible(true)} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Yazdırma Ayarları">
                        <PrintIcon />
                    </button>
                    <ThemeSwitcher />
                    <button onClick={() => setIsHowToUseVisible(true)} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Nasıl Kullanılır?">
                        <HelpIcon />
                    </button>
                    <button onClick={() => setIsContactVisible(true)} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="İletişim">
                        <MailIcon />
                    </button>
                </div>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-[380px_1fr] overflow-hidden">
                <aside className="print:hidden w-full lg:w-[380px] bg-white dark:bg-stone-800/80 shadow-lg lg:shadow-none p-4 overflow-y-auto border-r border-stone-200 dark:border-stone-700/50">
                    <SettingsPanel />
                </aside>

                <div ref={mainAreaRef} className="flex-grow flex flex-col bg-stone-50 dark:bg-stone-900/50 overflow-auto p-4 lg:p-6">
                    <div className="print:hidden worksheet-toolbar">
                         <div className="flex items-center justify-between w-full gap-4">
                            <div className="flex items-center gap-2">
                                <ScaleIcon className="w-5 h-5 text-stone-500 dark:text-stone-400" />
                                <input
                                    type="range"
                                    min="0.5"
                                    max="1.5"
                                    step="0.05"
                                    value={viewScale}
                                    onChange={(e) => setViewScale(parseFloat(e.target.value))}
                                    className="w-24 accent-orange-700"
                                />
                                <span className="text-xs text-stone-600 dark:text-stone-400 w-10 text-center">{Math.round(viewScale * 100)}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={fitToScreen} className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700" title="Ekrana Sığdır">
                                    <FitToScreenIcon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                                </button>
                                <button onClick={handlePrint} className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700" title="Yazdır">
                                    <PrintIcon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="worksheet-preview-area">
                         <ProblemSheet contentRef={contentRef} viewScale={viewScale} />
                    </div>
                </div>
            </main>

            <PrintSettingsPanel isVisible={isPrintSettingsVisible} onClose={() => setIsPrintSettingsVisible(false)} />
            <HowToUseModal isVisible={isHowToUseVisible} onClose={() => setIsHowToUseVisible(false)} />
            <ContactModal isVisible={isContactVisible} onClose={() => setIsContactVisible(false)} />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <ColorThemeProvider>
                <FontThemeProvider>
                    <FlyingLadybugProvider>
                        <ToastProvider>
                            <UIProvider>
                                <WorksheetProvider>
                                    <PrintSettingsProvider>
                                        <AppContent />
                                        <ToastContainer />
                                    </PrintSettingsProvider>
                                </WorksheetProvider>
                            </UIProvider>
                        </ToastProvider>
                    </FlyingLadybugProvider>
                </FontThemeProvider>
            </ColorThemeProvider>
        </ThemeProvider>
    );
};

export default App;