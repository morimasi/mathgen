import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { UIProvider, useUI } from './services/UIContext.tsx';
import { WorksheetProvider, useWorksheet } from './services/WorksheetContext.tsx';
import { PrintSettingsProvider, usePrintSettings } from './services/PrintSettingsContext.tsx';
import { ThemeProvider, useTheme } from './services/ThemeContext.tsx';
import { ColorThemeProvider } from './services/ColorThemeContext.tsx';
// FIX: Added FontTheme type for use in WorksheetToolbar
import { FontThemeProvider, useFontTheme, fontThemes, FontTheme } from './services/FontThemeContext.tsx';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext.tsx';
import { ToastProvider, useToast } from './services/ToastContext.tsx';
import { TutorialProvider } from './services/TutorialContext.tsx';
import Tabs from './components/Tabs.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import ProblemSheet from './components/ProblemSheet.tsx';
import ToastContainer from './components/ToastContainer.tsx';
import PrintSettingsPanel from './components/PrintSettingsPanel.tsx';
import HowToUseModal from './components/HowToUseModal.tsx';
import ContactModal from './components/ContactModal.tsx';
import FavoritesPanel from './components/FavoritesPanel.tsx';
import AnimatedLogo from './components/AnimatedLogo.tsx';
import ThemeSwitcher from './components/ThemeSwitcher.tsx';
import TutorialGuide from './components/TutorialGuide.tsx';
import FirstTimeUserBanner from './components/FirstTimeUserBanner.tsx';
import { TAB_GROUPS, TUTORIAL_ELEMENT_IDS } from './constants.ts';
import { 
    DoubleArrowLeftIcon,
    PrintIcon,
    RefreshIcon,
    HelpIcon,
    HeartIcon,
    MailIcon,
    SettingsIcon,
    DownloadIcon,
    MenuIcon,
    MoreVerticalIcon
} from './components/icons/Icons.tsx';
import Button from './components/form/Button.tsx';
import Select from './components/form/Select.tsx';
import NumberInput from './components/form/NumberInput.tsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LoadingDaisy from './components/LoadingDaisy.tsx';
import { PrintSettings } from './types.ts';
import Search from './components/Search.tsx';

// Debounce hook for performance optimization
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Debounced callback hook for performance optimization
function useDebouncedCallback<A extends any[]>(
  callback: (...args: A) => void,
  delay: number
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // On component unmount, clear any pending timeout to prevent memory leaks.
    return () => {
      // FIX: clearTimeout must be called with a timeout ID to clear the correct timeout.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: A) => {
      // Clear any existing timeout before setting a new one.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

const TopBanner: React.FC = memo(() => {
    const { openPrintSettings, openHowToUse, openContactModal, openFavoritesPanel } = useUI();
    const { triggerAutoRefresh, setIsLoading } = useWorksheet();
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
    const [isActionMenuOpen, setActionMenuOpen] = useState(false);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // FIX: Corrected typo from `actionMenu-ref` to `actionMenuRef` to fix reference and arithmetic operation errors.
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActionMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePrint = () => {
        window.print();
        setActionMenuOpen(false);
    };

    const handleDownloadPDF = () => {
        setActionMenuOpen(false);
        setIsLoading(true);
        addToast('PDF oluşturma işlemi başlatılıyor...', 'info');

        const pages = Array.from(document.querySelectorAll<HTMLElement>('.worksheet-page'));
        if (pages.length === 0) {
            addToast('İndirilecek içerik bulunamadı.', 'warning');
            setIsLoading(false);
            return;
        }

        const pdf = new jsPDF({
            orientation: printSettings.orientation,
            unit: 'mm',
            format: 'a4',
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const processPage = async (pageIndex: number) => {
            if (pageIndex >= pages.length) {
                addToast('PDF dosyası oluşturuluyor...', 'info');
                pdf.save('MathGen_Calisma_Kagidi.pdf');
                addToast('PDF başarıyla indirildi!', 'success');
                setIsLoading(false);
                return;
            }

            const page = pages[pageIndex];
            addToast(`Sayfa ${pageIndex + 1}/${pages.length} işleniyor...`, 'info');

            await new Promise(resolve => setTimeout(resolve, 50));
            
            try {
                const canvas = await html2canvas(page, {
                    scale: 1.5,
                    useCORS: true,
                    logging: false,
                    width: page.offsetWidth,
                    height: page.offsetHeight,
                    windowWidth: page.scrollWidth,
                    windowHeight: page.scrollHeight
                });

                if (pageIndex > 0) {
                    pdf.addPage();
                }

                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

                await processPage(pageIndex + 1);

            } catch (error) {
                console.error(`PDF oluşturma hatası - Sayfa ${pageIndex + 1}:`, error);
                addToast(`Sayfa ${pageIndex + 1} işlenirken bir hata oluştu.`, 'error');
                setIsLoading(false);
            }
        };

        processPage(0).catch(error => {
            console.error("PDF oluşturma işlemi başarısız oldu:", error);
            addToast('PDF oluşturulurken genel bir hata oluştu.', 'error');
            setIsLoading(false);
        });
    };

    const ActionButtons = () => (
        <>
            <button onClick={triggerAutoRefresh} className="action-button" title="Soruları Yenile"><RefreshIcon /><span>Soruları Yenile</span></button>
            <button onClick={() => { openPrintSettings(); setActionMenuOpen(false); }} className="action-button" title="Gelişmiş Yazdırma Ayarları"><SettingsIcon /><span>Yazdırma Ayarları</span></button>
            <button onClick={() => { openFavoritesPanel(); setActionMenuOpen(false); }} className="action-button" title="Favorilerim"><HeartIcon /><span>Favorilerim</span></button>
            <button onClick={handlePrint} className="action-button" title="Yazdır"><PrintIcon /><span>Yazdır</span></button>
            <button onClick={handleDownloadPDF} className="action-button" title="PDF Olarak İndir"><DownloadIcon /><span>PDF İndir</span></button>
            <button onClick={() => { openHowToUse(); setActionMenuOpen(false); }} className="action-button" title="Nasıl Kullanılır?"><HelpIcon /><span>Nasıl Kullanılır?</span></button>
            <button onClick={() => { openContactModal(); setActionMenuOpen(false); }} className="action-button" title="İletişim & Geri Bildirim"><MailIcon /><span>İletişim</span></button>
        </>
    );

    return (
        <div className="top-banner print:hidden">
            <div className="shooting-stars">
                <div className="shooting-star shooting-star-1"></div>
                <div className="shooting-star shooting-star-2"></div>
                <div className="shooting-star shooting-star-3"></div>
            </div>
            <div className="constellation">
                {Array.from({ length: 7 }).map((_, i) => <div key={i} className="star"></div>)}
            </div>

            <div className="relative container mx-auto px-4 z-10 h-full">
                <div className="flex items-start justify-end h-full pt-4">
                    {/* Mobile Action Menu */}
                    <div className="md:hidden flex items-start gap-1 text-white">
                        <ThemeSwitcher />
                        <div ref={actionMenuRef} className="relative">
                            <button onClick={() => setActionMenuOpen(p => !p)} className="p-3 rounded-md hover:bg-white/20 transition-colors" title="Eylemler"><MoreVerticalIcon /></button>
                             {isActionMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-30 py-1">
                                    <ActionButtons />
                                </div>
                             )}
                        </div>
                    </div>

                    {/* Desktop Action Buttons */}
                    <div id={TUTORIAL_ELEMENT_IDS.HEADER_ACTIONS} className="hidden md:flex items-start gap-2 text-white">
                        <Search />
                        <button onClick={triggerAutoRefresh} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Soruları Yenile"><RefreshIcon /></button>
                        <button onClick={openPrintSettings} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Gelişmiş Yazdırma Ayarları"><SettingsIcon /></button>
                        <button onClick={openFavoritesPanel} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Favorilerim"><HeartIcon /></button>
                        <button onClick={handlePrint} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Yazdır"><PrintIcon /></button>
                        <button onClick={handleDownloadPDF} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="PDF Olarak İndir"><DownloadIcon /></button>
                        <ThemeSwitcher />
                        <button onClick={openHowToUse} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Nasıl Kullanılır?"><HelpIcon /></button>
                        <button onClick={openContactModal} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="İletişim & Geri Bildirim"><MailIcon /></button>
                    </div>
                </div>
            </div>
        </div>
    );
});

const Header: React.FC = memo(() => {
    const { activeTab, setActiveTab, isSettingsPanelCollapsed, setIsSettingsPanelCollapsed } = useUI();
    const { clearWorksheet } = useWorksheet();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


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

                {/* Desktop Tabs */}
                <div className="hidden md:flex flex-1 justify-center">
                    <Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={setActiveTab} />
                </div>

                {/* Mobile Menu Buttons */}
                <div className="md:hidden flex items-center gap-1">
                    <button 
                        onClick={() => setIsSettingsPanelCollapsed(!isSettingsPanelCollapsed)} 
                        className="p-3 rounded-md hover:bg-white/10 text-white transition-colors" 
                        title="Ayarları Göster/Gizle"
                    >
                        <SettingsIcon />
                    </button>
                    <div ref={mobileMenuRef} className="relative">
                        <button onClick={() => setMobileMenuOpen(p => !p)} className="p-3 rounded-md hover:bg-white/10 text-white transition-colors" title="Modüller"><MenuIcon /></button>
                        {isMobileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-30">
                                <Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={(id) => { setActiveTab(id); setMobileMenuOpen(false); }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

const WorksheetToolbar: React.FC = memo(() => {
    const { settings, setSettings } = usePrintSettings();
    const { fontTheme, setFontTheme } = useFontTheme();
    const fontThemeOptions = Object.entries(fontThemes).map(([key, value]) => ({ value: key, label: value.name }));
    
    // --- Start of debounce implementation for performance ---
    const [localSettings, setLocalSettings] = useState(settings);
    const debouncedSettings = useDebounce(localSettings, 200);

    useEffect(() => {
        if (JSON.stringify(settings) !== JSON.stringify(debouncedSettings)) {
            setSettings(debouncedSettings);
        }
    }, [debouncedSettings, setSettings]);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);
    
    // FIX: Completed the truncated `handleLocalChange` function.
    const handleLocalChange = (field: keyof PrintSettings, value: any) => {
        setLocalSettings(prev => ({ ...prev, [field]: value }));
    };

    const isTableLayout = settings.layoutMode === 'table';

    // FIX: Added the return statement and JSX for the component, which was missing.
    return (
        <div id={TUTORIAL_ELEMENT_IDS.WORKSHEET_TOOLBAR} className="worksheet-toolbar print:hidden mb-4 p-2 bg-white dark:bg-stone-800/50 rounded-md shadow-sm border border-stone-200 dark:border-stone-700/50 flex flex-wrap items-end gap-4">
            <Select
                label="Yazı Tipi"
                id="toolbar-font-theme"
                options={fontThemeOptions}
                value={fontTheme}
                onChange={(e) => setFontTheme(e.target.value as FontTheme)}
                containerClassName="w-32"
            />
            <NumberInput
                label="Yazı Boyutu"
                id="toolbar-font-size"
                value={localSettings.fontSize}
                onChange={e => handleLocalChange('fontSize', Number(e.target.value))}
                min={8}
                max={48}
                containerClassName="w-20"
            />
            <div className="flex flex-col gap-0.5 w-32">
                 <label htmlFor="toolbar-line-height" className="font-medium text-xs text-stone-700 dark:text-stone-300 flex justify-between">
                    Satır Yüksekliği <span>{localSettings.lineHeight.toFixed(2)}</span>
                </label>
                <input
                    type="range"
                    id="toolbar-line-height"
                    value={localSettings.lineHeight}
                    onChange={e => handleLocalChange('lineHeight', Number(e.target.value))}
                    min={1} max={3} step={0.05}
                    className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
                />
            </div>
             <NumberInput
                label="Sütun Sayısı"
                id="toolbar-columns"
                value={localSettings.columns}
                onChange={e => handleLocalChange('columns', Number(e.target.value))}
                min={1} max={8}
                disabled={isTableLayout}
                containerClassName="w-20"
            />
        </div>
    );
});

// FIX: Added AppLayout and App components to provide a main app structure and a default export.
const AppLayout: React.FC = () => {
    const {
        isPrintSettingsVisible, closePrintSettings,
        isHowToUseVisible, closeHowToUse,
        isContactModalVisible, closeContactModal,
        isFavoritesPanelVisible, closeFavoritesPanel,
        isSettingsPanelCollapsed, setIsSettingsPanelCollapsed
    } = useUI();
    const { isLoading } = useWorksheet();

    return (
        <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
            <TopBanner />
            <header className="sticky top-0 z-20 bg-primary shadow-md print:hidden">
                <Header />
            </header>
            <div className="container mx-auto px-4 py-4 flex-grow w-full">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative md:w-80 lg:w-96 print:hidden">
                        <button onClick={() => setIsSettingsPanelCollapsed(!isSettingsPanelCollapsed)} className="absolute -right-3 top-2 p-1.5 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-full shadow-md hidden md:flex items-center justify-center z-10" title={isSettingsPanelCollapsed ? 'Ayarları Göster' : 'Ayarları Gizle'}>
                            <DoubleArrowLeftIcon className={`w-4 h-4 transition-transform ${isSettingsPanelCollapsed ? 'rotate-180' : ''}`} />
                        </button>
                        <aside 
                            id={TUTORIAL_ELEMENT_IDS.SETTINGS_PANEL} 
                            className={`bg-white dark:bg-stone-800/50 p-4 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700/50 transition-all duration-300 ${isSettingsPanelCollapsed 
                                ? 'hidden md:block md:w-0 md:p-0 md:opacity-0 md:invisible' 
                                : 'w-full mb-4 md:mb-0'
                            }`}
                        >
                            <div className={`${isSettingsPanelCollapsed ? 'hidden' : ''}`}>
                                <SettingsPanel />
                            </div>
                        </aside>
                    </div>
                    
                    <main className="flex-1 min-w-0">
                        <WorksheetToolbar />
                        <ProblemSheet />
                    </main>
                </div>
            </div>
            
            {isLoading && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                    <LoadingDaisy />
                </div>
            )}

            <PrintSettingsPanel isVisible={isPrintSettingsVisible} onClose={closePrintSettings} />
            <HowToUseModal isVisible={isHowToUseVisible} onClose={closeHowToUse} />
            <ContactModal isVisible={isContactModalVisible} onClose={closeContactModal} />
            <FavoritesPanel isVisible={isFavoritesPanelVisible} onClose={closeFavoritesPanel} />
            <ToastContainer />
            <TutorialGuide />
            <FirstTimeUserBanner />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
        <ColorThemeProvider>
        <FontThemeProvider>
        <ToastProvider>
        <UIProvider>
        <WorksheetProvider>
        <PrintSettingsProvider>
        <FlyingLadybugProvider>
        <TutorialProvider>
            <AppLayout />
        </TutorialProvider>
        </FlyingLadybugProvider>
        </PrintSettingsProvider>
        </WorksheetProvider>
        </UIProvider>
        </ToastProvider>
        </FontThemeProvider>
        </ColorThemeProvider>
        </ThemeProvider>
    );
};

export default App;