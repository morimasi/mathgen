import React from 'react';
import { UIProvider, useUI } from './services/UIContext';
import { WorksheetProvider, useWorksheet } from './services/WorksheetContext';
import { PrintSettingsProvider, usePrintSettings } from './services/PrintSettingsContext';
import { ThemeProvider, useTheme } from './services/ThemeContext';
import { ColorThemeProvider } from './services/ColorThemeContext';
import { FontThemeProvider } from './services/FontThemeContext';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext';
import { ToastProvider } from './services/ToastContext';
import Tabs from './components/Tabs';
import SettingsPanel from './components/SettingsPanel';
import ProblemSheet from './components/ProblemSheet';
import ToastContainer from './components/ToastContainer';
import PrintSettingsPanel from './components/PrintSettingsPanel';
import HowToUseModal from './components/HowToUseModal';
import ContactModal from './components/ContactModal';
import FavoritesPanel from './components/FavoritesPanel';
import AnimatedLogo from './components/AnimatedLogo';
import ThemeSwitcher from './components/ThemeSwitcher';
import { TAB_GROUPS } from './constants';
import { 
    LoadingIcon, 
    DoubleArrowLeftIcon,
    PrintIcon,
    RefreshIcon,
    HelpIcon,
    HeartIcon,
    MailIcon,
    SettingsIcon,
} from './components/icons/Icons';
import Button from './components/form/Button';
import { useFlyingLadybugs } from './services/FlyingLadybugContext';

const Header: React.FC = () => {
    const { activeTab, setActiveTab, openPrintSettings, openHowToUse, openContactModal, openFavoritesPanel } = useUI();
    const { clearWorksheet, triggerAutoRefresh } = useWorksheet();
    const { spawnLadybug } = useFlyingLadybugs();

    const onReset = () => {
        if (window.confirm('Tüm ayarları ve çalışma kağıdını sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            clearWorksheet();
            localStorage.clear();
            window.location.reload();
        }
    };
    
    return (
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
                <div className="flex items-center gap-4">
                    <AnimatedLogo onReset={onReset} />
                    <span className="font-bold text-xl tracking-tight hidden sm:block">MathGen</span>
                </div>
                <div className="flex-1 flex justify-center">
                    <Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={setActiveTab} />
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={triggerAutoRefresh} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Soruları Yenile"><RefreshIcon /></button>
                    <button onClick={openPrintSettings} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Yazdırma Ayarları"><SettingsIcon /></button>
                    <button onClick={openFavoritesPanel} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Favorilerim"><HeartIcon /></button>
                    <ThemeSwitcher />
                    <button onClick={openHowToUse} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Nasıl Kullanılır?"><HelpIcon /></button>
                    <button onClick={openContactModal} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="İletişim & Geri Bildirim"><MailIcon /></button>
                </div>
            </div>
        </div>
    );
};

const WorksheetToolbar: React.FC = () => {
    const { settings, setSettings } = usePrintSettings();
    const { spawnLadybug } = useFlyingLadybugs();

    const handlePrint = (e: React.MouseEvent<HTMLButtonElement>) => {
        spawnLadybug(e.clientX, e.clientY);
        window.print();
    };

    const fitToScreen = () => {
        const area = document.getElementById('worksheet-area');
        if (area) {
            const scale = Math.min(
                area.parentElement!.clientWidth / (area.clientWidth + 50),
                area.parentElement!.clientHeight / (area.clientHeight + 50)
            );
            setSettings(s => ({ ...s, scale: Math.max(0.2, scale) }));
        }
    };

    return (
        <div className="flex-shrink-0 bg-stone-100 dark:bg-stone-800/50 p-2 flex items-center justify-between border-b border-stone-200 dark:border-stone-700 print:hidden">
            <div className="flex items-center gap-2">
                <label htmlFor="zoom-slider" className="text-xs font-medium">Ölçek</label>
                <input
                    id="zoom-slider"
                    type="range"
                    min="20"
                    max="150"
                    value={settings.scale * 100}
                    onChange={(e) => setSettings(s => ({ ...s, scale: parseInt(e.target.value, 10) / 100 }))}
                    className="w-32 accent-orange-700"
                />
                <span className="text-xs w-10 text-center">{Math.round(settings.scale * 100)}%</span>
                <Button onClick={fitToScreen} size="sm" variant="secondary">Ekrana Sığdır</Button>
            </div>
            <Button onClick={handlePrint} size="sm" enableFlyingLadybug>
                <PrintIcon className="w-4 h-4" />
                Yazdır / PDF
            </Button>
        </div>
    );
};

const AppContent: React.FC = () => {
    const { 
        isPrintSettingsVisible, closePrintSettings,
        isHowToUseVisible, closeHowToUse,
        isContactModalVisible, closeContactModal,
        isFavoritesPanelVisible, closeFavoritesPanel,
        isSettingsPanelCollapsed, setIsSettingsPanelCollapsed
    } = useUI();
    const { isLoading } = useWorksheet();

    return (
        <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
            <header className="flex-shrink-0 bg-orange-700 text-white shadow-md z-20 print:hidden">
                <Header />
            </header>

            <div className="flex flex-grow overflow-hidden">
                <aside className={`print:hidden transition-all duration-300 ease-in-out bg-white dark:bg-stone-800 shadow-lg ${isSettingsPanelCollapsed ? 'w-0 -translate-x-full opacity-0 p-0' : 'w-80 p-4'}`}>
                    <div className="overflow-y-auto h-full">
                        <SettingsPanel />
                    </div>
                </aside>

                 <div className="relative flex-shrink-0 print:hidden">
                    <button 
                        onClick={() => setIsSettingsPanelCollapsed(!isSettingsPanelCollapsed)}
                        className="absolute top-1/2 -right-3 z-10 transform -translate-y-1/2 bg-white dark:bg-stone-700 p-1 rounded-full shadow-md hover:bg-stone-100 dark:hover:bg-stone-600 transition"
                        title={isSettingsPanelCollapsed ? "Ayarları Göster" : "Ayarları Gizle"}
                    >
                        <DoubleArrowLeftIcon className={`w-4 h-4 transition-transform duration-300 ${isSettingsPanelCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <main className="flex-1 flex flex-col overflow-hidden bg-stone-200 dark:bg-stone-900/80 relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-30">
                            <LoadingIcon className="w-12 h-12 text-white" />
                        </div>
                    )}
                    <WorksheetToolbar />
                    <div className="flex-grow overflow-auto p-4 md:p-8">
                        <ProblemSheet />
                    </div>
                </main>
            </div>
            
            <PrintSettingsPanel isVisible={isPrintSettingsVisible} onClose={closePrintSettings} />
            <HowToUseModal isVisible={isHowToUseVisible} onClose={closeHowToUse} />
            <ContactModal isVisible={isContactModalVisible} onClose={closeContactModal} />
            <FavoritesPanel isVisible={isFavoritesPanelVisible} onClose={closeFavoritesPanel} />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <UIProvider>
        <ThemeProvider>
        <ColorThemeProvider>
        <FontThemeProvider>
        <PrintSettingsProvider>
        <FlyingLadybugProvider>
        <ToastProvider>
        <WorksheetProvider>
            <AppContent />
            <ToastContainer />
        </WorksheetProvider>
        </ToastProvider>
        </FlyingLadybugProvider>
        </PrintSettingsProvider>
        </FontThemeProvider>
        </ColorThemeProvider>
        </ThemeProvider>
        </UIProvider>
    );
}

export default App;