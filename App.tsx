import React, { useState, useRef, useEffect, memo, useCallback, Suspense } from 'react';
import { UIProvider, useUI } from './services/UIContext.tsx';
import { WorksheetProvider, useWorksheet } from './services/WorksheetContext.tsx';
import { PrintSettingsProvider, usePrintSettings } from './services/PrintSettingsContext.tsx';
import { ThemeProvider, useTheme } from './services/ThemeContext.tsx';
import { ColorThemeProvider } from './services/ColorThemeContext.tsx';
import { FontThemeProvider, useFontTheme, fontThemes } from './services/FontThemeContext.tsx';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext.tsx';
import { ToastProvider, useToast } from './services/ToastContext.tsx';
import Tabs from './components/Tabs.tsx';
import ProblemSheet from './components/ProblemSheet.tsx';
import ToastContainer from './components/ToastContainer.tsx';
import PrintSettingsPanel from './components/PrintSettingsPanel.tsx';
import HowToUseModal from './components/HowToUseModal.tsx';
import ContactModal from './components/ContactModal.tsx';
import FavoritesPanel from './components/FavoritesPanel.tsx';
import AnimatedLogo from './components/AnimatedLogo.tsx';
import ThemeSwitcher from './components/ThemeSwitcher.tsx';
import { TAB_GROUPS } from './constants.ts';
import { 
    PrintIcon,
    RefreshIcon,
    HelpIcon,
    HeartIcon,
    MailIcon,
    SettingsIcon,
    DownloadIcon,
    MenuIcon,
    MoreVerticalIcon,
    LoadingIcon,
    DoubleArrowLeftIcon
} from './components/icons/Icons.tsx';
import Button from './components/form/Button.tsx';
import Select from './components/form/Select.tsx';
import NumberInput from './components/form/NumberInput.tsx';
import { useFlyingLadybugs } from './services/FlyingLadybugContext.tsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LoadingDaisy from './components/LoadingDaisy.tsx';
import { PrintSettings } from './types.ts';
import SettingsPanel from './components/SettingsPanel.tsx';


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
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: A) => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

const Header: React.FC = memo(() => {
    const { activeTab, setActiveTab, openPrintSettings, openHowToUse, openContactModal, openFavoritesPanel } = useUI();
    const { clearWorksheet, triggerAutoRefresh, setIsLoading } = useWorksheet();
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isActionMenuOpen, setActionMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
            }
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActionMenuOpen(false);
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
                    <ThemeSwitcher />
                    <div ref={actionMenuRef} className="relative">
                        <button onClick={() => setActionMenuOpen(p => !p)} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Eylemler"><MoreVerticalIcon className="w-6 h-6"/></button>
                         {isActionMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-30 py-1">
                                <ActionButtons />
                            </div>
                         )}
                    </div>
                    <div ref={mobileMenuRef} className="relative">
                        <button onClick={() => setMobileMenuOpen(p => !p)} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Modüller"><MenuIcon className="w-6 h-6"/></button>
                        {isMobileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-30">
                                <Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={(id) => { setActiveTab(id); setMobileMenuOpen(false); }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex items-center gap-2">
                    <button onClick={triggerAutoRefresh} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Soruları Yenile"><RefreshIcon className="w-6 h-6"/></button>
                    <button onClick={openPrintSettings} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Gelişmiş Yazdırma Ayarları"><SettingsIcon className="w-6 h-6"/></button>
                    <button onClick={openFavoritesPanel} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Favorilerim"><HeartIcon className="w-6 h-6"/></button>
                    <button onClick={handlePrint} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Yazdır"><PrintIcon className="w-6 h-6"/></button>
                    <button onClick={handleDownloadPDF} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="PDF Olarak İndir"><DownloadIcon className="w-6 h-6"/></button>
                    <ThemeSwitcher />
                    <button onClick={openHowToUse} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Nasıl Kullanılır?"><HelpIcon className="w-6 h-6"/></button>
                    <button onClick={openContactModal} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="İletişim & Geri Bildirim"><MailIcon className="w-6 h-6"/></button>
                </div>
            </div>
        </div>
    );
});

const AppContent: React.FC = () => {
    const { 
        activeTab, isSettingsPanelCollapsed, toggleSettingsPanel,
        isPrintSettingsVisible, closePrintSettings,
        isHowToUseVisible, closeHowToUse,
        isContactModalVisible, closeContactModal,
        isFavoritesPanelVisible, closeFavoritesPanel
    } = useUI();
    const { isLoading } = useWorksheet();
    const { settings, setSettings } = usePrintSettings();
    
    // --- Panel Width & Visibility Logic ---
    const isCustomizationCenter = activeTab === 'customization-center';
    const panelDefaultWidth = '384px';
    const panelExpandedWidth = '50%';
    
    const panelWidth = isCustomizationCenter ? panelExpandedWidth : panelDefaultWidth;
    const isPanelVisible = isCustomizationCenter || !isSettingsPanelCollapsed;
    const containerWidth = isPanelVisible ? panelWidth : '0px';
    // --- End Panel Logic ---

    const panAreaRef = useRef<HTMLDivElement>(null);
    const panState = useRef({ isPanning: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });
    const lastSyncedScale = useRef(settings.scale);

    useEffect(() => {
        const el = panAreaRef.current;
        if (el) {
            el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
        }
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0 || (e.target as HTMLElement).closest('.problem-item')) return;
        e.preventDefault();
        const el = panAreaRef.current;
        if (!el) return;
        panState.current = {
            isPanning: true,
            startX: e.clientX - el.offsetLeft,
            startY: e.clientY - el.offsetTop,
            scrollLeft: el.scrollLeft,
            scrollTop: el.scrollTop,
        };
        el.classList.add('is-panning');
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!panState.current.isPanning) return;
        e.preventDefault();
        const el = panAreaRef.current;
        if (!el) return;
        const x = e.clientX - el.offsetLeft;
        const y = e.clientY - el.offsetTop;
        const walkX = (x - panState.current.startX);
        const walkY = (y - panState.current.startY);
        el.scrollLeft = panState.current.scrollLeft - walkX;
        el.scrollTop = panState.current.scrollTop - walkY;
    };

    const stopPanning = () => {
        panState.current.isPanning = false;
        panAreaRef.current?.classList.remove('is-panning');
    };

    useEffect(() => {
        if (settings.scale !== lastSyncedScale.current) {
            const worksheetArea = panAreaRef.current?.querySelector<HTMLElement>('#worksheet-area');
            if (worksheetArea) {
                worksheetArea.style.transform = '';
            }
            lastSyncedScale.current = settings.scale;
        }
    }, [settings.scale]);

    const debouncedSetScale = useDebouncedCallback((newScale: number) => {
        lastSyncedScale.current = newScale;
        setSettings(s => ({ ...s, scale: newScale }));
    }, 200);

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const worksheetArea = panAreaRef.current?.querySelector<HTMLElement>('#worksheet-area');
            if (!worksheetArea) return;

            const transformMatch = worksheetArea.style.transform.match(/scale\(([^)]+)\)/);
            const currentScale = transformMatch ? parseFloat(transformMatch[1]) : settings.scale;

            const scaleAmount = 0.05;
            const newScale = e.deltaY > 0
                ? Math.max(0.2, currentScale - scaleAmount)
                : Math.min(2.0, currentScale + scaleAmount);

            worksheetArea.style.transform = `scale(${newScale})`;
            worksheetArea.style.transformOrigin = 'top center';

            debouncedSetScale(newScale);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
            
            <header className="flex-shrink-0 bg-primary text-white shadow-md z-20 print:hidden">
                <Header />
            </header>

            <div className="flex flex-grow overflow-hidden">
                <div 
                    className="relative flex-shrink-0 print:hidden transition-all duration-300 ease-in-out" 
                    style={{ width: containerWidth }}
                >
                    <aside 
                        className="h-full bg-white dark:bg-stone-800 border-r border-stone-200 dark:border-stone-700 flex flex-col w-full overflow-hidden"
                    >
                        <div className="p-4 overflow-y-auto">
                            <SettingsPanel />
                        </div>
                    </aside>

                    {!isCustomizationCenter && (
                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                            <button
                                onClick={toggleSettingsPanel}
                                className="p-1.5 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus dark:focus:ring-offset-stone-800"
                                title={isSettingsPanelCollapsed ? "Ayarları Göster" : "Ayarları Gizle"}
                                aria-expanded={!isSettingsPanelCollapsed}
                            >
                                <DoubleArrowLeftIcon className={`w-5 h-5 transition-transform duration-300 ${isSettingsPanelCollapsed ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    )}
                </div>

                <main 
                    className="flex-grow flex flex-col overflow-hidden relative"
                >
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/40 dark:bg-stone-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-30 gap-4">
                            <LoadingDaisy />
                            <p className="text-white text-lg font-semibold animate-pulse">Etkinlik hazırlanıyor...</p>
                        </div>
                    )}
                    
                    <div 
                        ref={panAreaRef}
                        className="flex-grow overflow-auto p-4 md:p-8 cursor-grab pan-area bg-stone-100 dark:bg-stone-900"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={stopPanning}
                        onMouseLeave={stopPanning}
                        onWheel={handleWheel}
                    >
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