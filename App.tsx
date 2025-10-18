import React, { useState } from 'react';
import { UIProvider, useUI } from './services/UIContext.tsx';
import { WorksheetProvider, useWorksheet } from './services/WorksheetContext.tsx';
import { PrintSettingsProvider } from './services/PrintSettingsContext.tsx';
import { ThemeProvider } from './services/ThemeContext.tsx';
import { FontThemeProvider } from './services/FontThemeContext.tsx';
import { ColorThemeProvider } from './services/ColorThemeContext.tsx';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext.tsx';
import { ToastProvider } from './services/ToastContext.tsx';
import Tabs from './components/Tabs.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import ProblemSheet from './components/ProblemSheet.tsx';
import ThemeSwitcher from './components/ThemeSwitcher.tsx';
import AnimatedLogo from './components/AnimatedLogo.tsx';
import PrintSettingsPanel from './components/PrintSettingsPanel.tsx';
import { HelpIcon, MailIcon, ShuffleIcon, PrintIcon, SettingsIcon, FavoriteIcon } from './components/icons/Icons.tsx';
import HowToUseModal from './components/HowToUseModal.tsx';
import ContactModal from './components/ContactModal.tsx';
import ToastContainer from './components/ToastContainer.tsx';
import FavoritesPanel from './components/FavoritesPanel.tsx';
import { TAB_GROUPS } from './constants.ts';


const AppHeader: React.FC<{
    onShowHowToUse: () => void;
    onShowContact: () => void;
    onShowFavorites: () => void;
}> = ({ onShowHowToUse, onShowContact, onShowFavorites }) => {
    const { clearWorksheet } = useWorksheet();
    const { activeTab, setActiveTab } = useUI();

    return (
        <header className="flex-shrink-0 bg-primary shadow-md print:hidden flex items-center justify-between px-3 py-1.5">
            <div className="flex items-center gap-4">
                <AnimatedLogo onReset={clearWorksheet} />
                <Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={setActiveTab} />
            </div>
            <div className="flex items-center gap-1">
                 <button onClick={onShowFavorites} title="Favorilerim" className="p-2 rounded-full hover:bg-white/10 text-amber-100/80 hover:text-white transition-colors">
                    <FavoriteIcon className="w-5 h-5" />
                </button>
                 <button onClick={onShowHowToUse} title="Nasıl Kullanılır?" className="p-2 rounded-full hover:bg-white/10 text-amber-100/80 hover:text-white transition-colors">
                    <HelpIcon className="w-5 h-5" />
                </button>
                 <button onClick={onShowContact} title="İletişim & Geri Bildirim" className="p-2 rounded-full hover:bg-white/10 text-amber-100/80 hover:text-white transition-colors">
                    <MailIcon className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-white/20 mx-1"></div>
                <ThemeSwitcher />
            </div>
        </header>
    );
};


const WorksheetToolbar: React.FC<{
    onShowPrintSettings: () => void;
}> = ({ onShowPrintSettings }) => {
    const { triggerAutoRefresh } = useWorksheet();
    
    return (
        <div className="flex-shrink-0 p-1.5 bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 print:hidden flex items-center justify-end gap-2 pr-4">
            <button onClick={triggerAutoRefresh} title="Ayarları koruyarak soruları yenile" className="p-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                <ShuffleIcon className="w-5 h-5 text-stone-600 dark:text-stone-300" />
            </button>
            <button onClick={() => window.print()} title="Yazdır" className="p-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                 <PrintIcon className="w-5 h-5 text-stone-600 dark:text-stone-300" />
            </button>
            <button onClick={onShowPrintSettings} title="Gelişmiş Yazdırma Ayarları" className="p-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                <SettingsIcon className="w-5 h-5 text-stone-600 dark:text-stone-300" />
            </button>
        </div>
    );
}

const AppContent: React.FC = () => {
    const { isHowToUseVisible, hideHowToUse, showHowToUse, isContactVisible, hideContact, showContact } = useUI();
    const [isPrintSettingsVisible, setIsPrintSettingsVisible] = useState(false);
    const [isFavoritesVisible, setIsFavoritesVisible] = useState(false);
    
    return (
        <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-sans">
            <AppHeader onShowHowToUse={showHowToUse} onShowContact={showContact} onShowFavorites={() => setIsFavoritesVisible(true)} />

            <main className="flex-grow flex overflow-hidden">
                <aside className="w-[22rem] p-3 overflow-y-auto bg-white dark:bg-stone-800/50 shadow-md print:hidden">
                    <SettingsPanel />
                </aside>
                <div className="flex-grow flex flex-col bg-stone-200 dark:bg-stone-900 overflow-hidden">
                    <WorksheetToolbar onShowPrintSettings={() => setIsPrintSettingsVisible(true)} />
                    <div id="worksheet-wrapper" className="flex-grow overflow-auto p-4">
                        <ProblemSheet />
                    </div>
                </div>
            </main>

            <HowToUseModal isVisible={isHowToUseVisible} onClose={hideHowToUse} />
            <ContactModal isVisible={isContactVisible} onClose={hideContact} />
            <PrintSettingsPanel isVisible={isPrintSettingsVisible} onClose={() => setIsPrintSettingsVisible(false)} />
            <FavoritesPanel isVisible={isFavoritesVisible} onClose={() => setIsFavoritesVisible(false)} />
            <ToastContainer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <FontThemeProvider>
                <ColorThemeProvider>
                    <ToastProvider>
                        <FlyingLadybugProvider>
                            <WorksheetProvider>
                                <PrintSettingsProvider>
                                    <UIProvider>
                                        <AppContent />
                                    </UIProvider>
                                </PrintSettingsProvider>
                            </WorksheetProvider>
                        </FlyingLadybugProvider>
                    </ToastProvider>
                </ColorThemeProvider>
            </FontThemeProvider>
        </ThemeProvider>
    );
};

export default App;
