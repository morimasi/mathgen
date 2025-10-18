import React from 'react';

// Providers & Contexts
import { UIProvider, useUI } from './services/UIContext.tsx';
import { WorksheetProvider, useWorksheet } from './services/WorksheetContext.tsx';
import { PrintSettingsProvider } from './services/PrintSettingsContext.tsx';
import { ThemeProvider } from './services/ThemeContext.tsx';
import { ColorThemeProvider } from './services/ColorThemeContext.tsx';
import { FontThemeProvider } from './services/FontThemeContext.tsx';
import { ToastProvider, useToast } from './services/ToastContext.tsx';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext.tsx';

// Main Components
import AnimatedLogo from './components/AnimatedLogo.tsx';
import Tabs from './components/Tabs.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import ProblemSheet from './components/ProblemSheet.tsx';
import PrintSettingsPanel from './components/PrintSettingsPanel.tsx';
import HowToUseModal from './components/HowToUseModal.tsx';
import ContactModal from './components/ContactModal.tsx';
import FavoritesPanel from './components/FavoritesPanel.tsx';
import ToastContainer from './components/ToastContainer.tsx';
import ThemeSwitcher from './components/ThemeSwitcher.tsx';
import Button from './components/form/Button.tsx';

// Constants and Icons
import { TAB_GROUPS } from './constants.ts';
import {
    HelpIcon, MailIcon, FavoriteIcon, SettingsIcon,
    DoubleArrowLeftIcon, PrintIcon, DownloadIcon, RefreshIcon
} from './components/icons/Icons.tsx';

// The main layout component, which is rendered inside all providers
const AppLayout: React.FC = () => {
    const { 
        activeTab, setActiveTab,
        isPrintSettingsVisible, openPrintSettings, closePrintSettings, 
        isHowToUseVisible, openHowToUse, closeHowToUse,
        isContactModalVisible, openContactModal, closeContactModal,
        isFavoritesPanelVisible, openFavoritesPanel, closeFavoritesPanel,
        isSettingsPanelCollapsed, setIsSettingsPanelCollapsed
    } = useUI();

    const { clearWorksheet, triggerAutoRefresh } = useWorksheet();
    const { addToast } = useToast();

    const handlePrint = () => window.print();
    const handleDownload = () => addToast('PDF indirme özelliği yakında eklenecektir.', 'info');

    return (
        <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-sans">
            <header className="flex-shrink-0 bg-primary text-white shadow-md z-20 p-2 flex items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-4">
                    <AnimatedLogo onReset={clearWorksheet} />
                    <Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={setActiveTab} />
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={openHowToUse} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Nasıl Kullanılır?"><HelpIcon /></button>
                    <button onClick={openContactModal} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="İletişim & Geri Bildirim"><MailIcon /></button>
                    <button onClick={openFavoritesPanel} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Favori Ayarlar"><FavoriteIcon /></button>
                    <ThemeSwitcher />
                </div>
            </header>
            
            <main className="flex flex-grow overflow-hidden relative">
                {/* Settings Panel */}
                <aside className={`flex-shrink-0 bg-white dark:bg-stone-800 shadow-lg transition-all duration-300 ease-in-out print:hidden ${isSettingsPanelCollapsed ? 'w-0 -translate-x-full opacity-0' : 'w-full max-w-xs opacity-100'} overflow-hidden`}>
                    <div className="p-4 overflow-y-auto h-full">
                        <SettingsPanel />
                    </div>
                </aside>

                 {/* Collapse/Expand button */}
                <button 
                    onClick={() => setIsSettingsPanelCollapsed(!isSettingsPanelCollapsed)}
                    className={`print:hidden absolute top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-stone-700 p-1 rounded-r-full shadow-lg border-y border-r border-stone-200 dark:border-stone-600 transition-all duration-300 ease-in-out ${isSettingsPanelCollapsed ? 'translate-x-0' : 'translate-x-[20rem]'}`}
                    style={{ left: 0 }}
                    title={isSettingsPanelCollapsed ? "Ayarları Göster" : "Ayarları Gizle"}
                >
                    <DoubleArrowLeftIcon className={`w-5 h-5 transition-transform duration-300 ${isSettingsPanelCollapsed ? 'rotate-180' : 'rotate-0'}`} />
                </button>

                {/* Main Content Area */}
                <div className="flex-grow flex flex-col overflow-hidden bg-stone-200 dark:bg-stone-900">
                    {/* Toolbar for worksheet controls */}
                    <div className="flex-shrink-0 print:hidden p-2 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700 flex items-center justify-end gap-2">
                        <Button onClick={triggerAutoRefresh} variant="secondary" size="sm" title="Soruları Yenile"><RefreshIcon className="w-4 h-4" /></Button>
                        <Button onClick={handleDownload} variant="secondary" size="sm"><DownloadIcon className="w-4 h-4 mr-1"/> PDF İndir</Button>
                        <Button onClick={handlePrint} variant="secondary" size="sm"><PrintIcon className="w-4 h-4 mr-1"/> Yazdır</Button>
                        <Button onClick={openPrintSettings} variant="secondary" size="sm"><SettingsIcon className="w-4 h-4 mr-1"/> Sayfa Ayarları</Button>
                    </div>

                    {/* Problem Sheet Area */}
                    <div id="problem-sheet-scroll-area" className="flex-grow overflow-auto p-4 md:p-8">
                        <ProblemSheet />
                    </div>
                </div>
            </main>

            {/* Modals and Overlays */}
            <PrintSettingsPanel isVisible={isPrintSettingsVisible} onClose={closePrintSettings} />
            <HowToUseModal isVisible={isHowToUseVisible} onClose={closeHowToUse} />
            <ContactModal isVisible={isContactModalVisible} onClose={closeContactModal} />
            <FavoritesPanel isVisible={isFavoritesPanelVisible} onClose={closeFavoritesPanel} />
            <ToastContainer />
        </div>
    );
}

// The main App component with providers
const App: React.FC = () => {
    return (
        <ThemeProvider>
            <ColorThemeProvider>
                <FontThemeProvider>
                    <ToastProvider>
                        <PrintSettingsProvider>
                            <WorksheetProvider>
                                <UIProvider>
                                    <FlyingLadybugProvider>
                                        <AppLayout />
                                    </FlyingLadybugProvider>
                                </UIProvider>
                            </WorksheetProvider>
                        </PrintSettingsProvider>
                    </ToastProvider>
                </FontThemeProvider>
            </ColorThemeProvider>
        </ThemeProvider>
    );
};

export default App;
