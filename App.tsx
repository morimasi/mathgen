import React from 'react';
import SettingsPanel from './components/SettingsPanel.tsx';
import ProblemSheet from './components/ProblemSheet.tsx';
import { WorksheetProvider } from './services/WorksheetContext.tsx';
import { PrintSettingsProvider } from './services/PrintSettingsContext.tsx';
import { ThemeProvider } from './services/ThemeContext.tsx';
import { FontThemeProvider } from './services/FontThemeContext.tsx';
import { ColorThemeProvider } from './services/ColorThemeContext.tsx';
import { UIProvider, useUI } from './services/UIContext.tsx';
import AnimatedLogo from './components/AnimatedLogo.tsx';
import ThemeSwitcher from './components/ThemeSwitcher.tsx';
import { TAB_GROUPS } from './constants.ts';
import Tabs from './components/Tabs.tsx';
import { useWorksheet } from './services/WorksheetContext.tsx';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext.tsx';
import { ToastProvider } from './services/ToastContext.tsx';
import ToastContainer from './components/ToastContainer.tsx';
import { HelpIcon, PrintIcon, FavoriteIcon, ContactIcon, RefreshIcon, SquaresIcon } from './components/icons/Icons.tsx';
import Button from './components/form/Button.tsx';
import PrintSettingsPanel from './components/PrintSettingsPanel.tsx';
import FavoritesPanel from './components/FavoritesPanel.tsx';
import HowToUseModal from './components/HowToUseModal.tsx';
import ContactModal from './components/ContactModal.tsx';
import LoadingDaisy from './components/LoadingDaisy.tsx';
import CustomizationCenterModal from './components/CustomizationCenterModal.tsx';

const AppContent = () => {
    const { activeTab, setActiveTab, isCustomizationCenterVisible, openCustomizationCenter, closeCustomizationCenter } = useUI();
    const { clearWorksheet, isLoading, triggerAutoRefresh } = useWorksheet();
    const [isPrintPanelVisible, setPrintPanelVisible] = React.useState(false);
    const [isFavoritesPanelVisible, setFavoritesPanelVisible] = React.useState(false);
    const [isHowToUseModalVisible, setHowToUseModalVisible] = React.useState(false);
    const [isContactModalVisible, setContactModalVisible] = React.useState(false);

    return (
        <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-200 font-sans">
            <header className="bg-primary text-white p-2 shadow-md print:hidden flex items-center gap-4">
                <AnimatedLogo onReset={clearWorksheet} />
                <Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={setActiveTab} />
                <div className="ml-auto flex items-center gap-2">
                     <Button variant="secondary" size="sm" onClick={openCustomizationCenter}><SquaresIcon className="w-4 h-4" /> Merkez</Button>
                     <Button variant="secondary" size="sm" onClick={() => setFavoritesPanelVisible(true)}><FavoriteIcon className="w-4 h-4" /> Favorilerim</Button>
                     <Button variant="secondary" size="sm" onClick={triggerAutoRefresh} title="Mevcut ayarları koruyarak soruları yenile"><RefreshIcon className="w-4 h-4" /> Yenile</Button>
                    <Button variant="secondary" size="sm" onClick={() => setPrintPanelVisible(true)}><PrintIcon className="w-4 h-4" /> Yazdırma Ayarları</Button>
                    <Button variant="secondary" size="sm" onClick={() => setHowToUseModalVisible(true)}><HelpIcon className="w-4 h-4" /> Nasıl Kullanılır?</Button>
                    <Button variant="secondary" size="sm" onClick={() => setContactModalVisible(true)}><ContactIcon className="w-4 h-4" /> İletişim</Button>
                    <ThemeSwitcher />
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden">
                <aside className="w-full max-w-sm flex-shrink-0 overflow-y-auto p-4 bg-white dark:bg-stone-800 shadow-lg print:hidden">
                    <SettingsPanel />
                </aside>
                <section className="flex-1 flex flex-col bg-stone-200 dark:bg-stone-900/80 p-4 overflow-y-auto relative">
                     {isLoading && (
                        <div className="absolute inset-0 bg-black/30 z-20 flex items-center justify-center">
                            <LoadingDaisy />
                        </div>
                    )}
                    <div className="w-full h-full">
                         <ProblemSheet />
                    </div>
                </section>
            </main>
            
            <CustomizationCenterModal isVisible={isCustomizationCenterVisible} onClose={closeCustomizationCenter} />
            <PrintSettingsPanel isVisible={isPrintPanelVisible} onClose={() => setPrintPanelVisible(false)} />
            <FavoritesPanel isVisible={isFavoritesPanelVisible} onClose={() => setFavoritesPanelVisible(false)} />
            <HowToUseModal isVisible={isHowToUseModalVisible} onClose={() => setHowToUseModalVisible(false)} />
            <ContactModal isVisible={isContactModalVisible} onClose={() => setContactModalVisible(false)} />
        </div>
    );
};

function App() {
  return (
    <ThemeProvider>
      <FontThemeProvider>
        <ColorThemeProvider>
          <ToastProvider>
            <FlyingLadybugProvider>
              <UIProvider>
                <PrintSettingsProvider>
                  <WorksheetProvider>
                    <AppContent />
                    <ToastContainer />
                  </WorksheetProvider>
                </PrintSettingsProvider>
              </UIProvider>
            </FlyingLadybugProvider>
          </ToastProvider>
        </ColorThemeProvider>
      </FontThemeProvider>
    </ThemeProvider>
  );
}

export default App;