import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { UIProvider, useUI } from './services/UIContext.tsx';
import { WorksheetProvider, useWorksheet } from './services/WorksheetContext.tsx';
import { PrintSettingsProvider, usePrintSettings } from './services/PrintSettingsContext.tsx';
import { ThemeProvider, useTheme } from './services/ThemeContext.tsx';
import { ColorThemeProvider } from './services/ColorThemeContext.tsx';
import { FontThemeProvider, useFontTheme, fontThemes } from './services/FontThemeContext.tsx';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext.tsx';
import { ToastProvider, useToast } from './services/ToastContext.tsx';
import Tabs from './components/Tabs.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import ProblemSheet from './components/ProblemSheet.tsx';
import ToastContainer from './components/ToastContainer.tsx';
import PrintSettingsPanel from './components/PrintSettingsPanel.tsx';
import HowToUseModal from './components/HowToUseModal.tsx';
import ContactModal from './components/ContactModal.tsx';
import FavoritesPanel from './components/FavoritesPanel.tsx';
import TeacherPanel from './components/TeacherPanel.tsx';
import AnimatedLogo from './components/AnimatedLogo.tsx';
import ThemeSwitcher from './components/ThemeSwitcher.tsx';
import { TAB_GROUPS } from './constants.ts';
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
    MoreVerticalIcon,
    DashboardIcon,
    ClipboardIcon,
    KeyIcon,
} from './components/icons/Icons.tsx';
import Button from './components/form/Button.tsx';
import Select from './components/form/Select.tsx';
import NumberInput from './components/form/NumberInput.tsx';
import { useFlyingLadybugs } from './services/FlyingLadybugContext.tsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LoadingDaisy from './components/LoadingDaisy.tsx';
import Checkbox from './components/form/Checkbox.tsx';

const Header: React.FC = memo(() => {
    const { activeTab, setActiveTab, openPrintSettings, openHowToUse, openContactModal, openFavoritesPanel, openTeacherPanel } = useUI();
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

    const handleDownloadPDF = async () => {
        setActionMenuOpen(false);
        setIsLoading(true);
        addToast('PDF oluşturuluyor, lütfen bekleyin...', 'info');
        try {
            const pages = document.querySelectorAll<HTMLElement>('.worksheet-page');
            if (pages.length === 0) {
                addToast('İndirilecek içerik bulunamadı.', 'warning');
                return;
            }

            const pdf = new jsPDF({
                orientation: printSettings.orientation,
                unit: 'mm',
                format: 'a4',
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                if (i > 0) {
                    pdf.addPage();
                }
                const canvas = await html2canvas(page, {
                    scale: 2,
                    useCORS: true,
                    width: page.offsetWidth,
                    height: page.offsetHeight,
                    windowWidth: page.scrollWidth,
                    windowHeight: page.scrollHeight
                });
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }

            pdf.save('MathGen_Calisma_Kagidi.pdf');
            addToast('PDF başarıyla indirildi!', 'success');
        } catch (error) {
            console.error("PDF oluşturma hatası:", error);
            addToast('PDF oluşturulurken bir hata oluştu.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const ActionButtons = () => (
        <>
            <button onClick={triggerAutoRefresh} className="action-button" title="Soruları Yenile"><RefreshIcon /><span>Soruları Yenile</span></button>
            <button onClick={() => { openPrintSettings(); setActionMenuOpen(false); }} className="action-button" title="Gelişmiş Yazdırma Ayarları"><SettingsIcon /><span>Yazdırma Ayarları</span></button>
            <button onClick={() => { openFavoritesPanel(); setActionMenuOpen(false); }} className="action-button" title="Favorilerim"><HeartIcon /><span>Favorilerim</span></button>
            <button onClick={() => { openTeacherPanel(); setActionMenuOpen(false); }} className="action-button" title="Öğretmen Paneli"><DashboardIcon /><span>Öğretmen Paneli</span></button>
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
                        <button onClick={() => setActionMenuOpen(p => !p)} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Eylemler"><MoreVerticalIcon /></button>
                        <div className={`transform transition-all duration-150 ease-out origin-top-right absolute right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-30 py-1 ${isActionMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                            <ActionButtons />
                        </div>
                    </div>
                    <div ref={mobileMenuRef} className="relative">
                        <button onClick={() => setMobileMenuOpen(p => !p)} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Modüller"><MenuIcon /></button>
                        <div className={`transform transition-all duration-150 ease-out origin-top-right absolute right-0 mt-2 w-64 bg-white dark:bg-stone-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-30 ${isMobileMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                            <Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={(id) => { setActiveTab(id); setMobileMenuOpen(false); }} />
                        </div>
                    </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex items-center gap-1">
                    <button onClick={triggerAutoRefresh} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Soruları Yenile"><RefreshIcon /></button>
                    <button onClick={openPrintSettings} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Gelişmiş Yazdırma Ayarları"><SettingsIcon /></button>
                    <button onClick={openFavoritesPanel} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Favorilerim"><HeartIcon /></button>
                    <button onClick={openTeacherPanel} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Öğretmen Paneli"><DashboardIcon /></button>
                    <button onClick={handlePrint} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Yazdır"><PrintIcon /></button>
                    <button onClick={handleDownloadPDF} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="PDF Olarak İndir"><DownloadIcon /></button>
                    <ThemeSwitcher />
                    <button onClick={openHowToUse} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="Nasıl Kullanılır?"><HelpIcon /></button>
                    <button onClick={openContactModal} className="p-2 rounded-md hover:bg-white/20 transition-colors" title="İletişim & Geri Bildirim"><MailIcon /></button>
                </div>
            </div>
        </div>
    );
});

const WorksheetToolbar: React.FC = memo(() => {
    const { settings, setSettings } = usePrintSettings();
    const { isAnswerKeyVisible, setIsAnswerKeyVisible } = useUI();
    const { fontTheme, setFontTheme } = useFontTheme();
    const fontThemeOptions = Object.entries(fontThemes).map(([key, value]) => ({ value: key, label: value.name }));

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
    
    const Separator: React.FC = () => <div className="border-l border-stone-300 dark:border-stone-600 h-6 mx-2 hidden md:block"></div>;

    return (
        <div className="flex-shrink-0 p-2 flex items-center justify-between border-b border-stone-200 dark:border-stone-700 print:hidden flex-wrap md:flex-nowrap gap-2 md:gap-0">
            <div className="flex items-center gap-3 flex-wrap">
                {/* --- Scale --- */}
                <div className="flex items-center gap-2">
                    <label htmlFor="zoom-slider" className="text-xs font-medium">Ölçek</label>
                    <input id="zoom-slider" type="range" min="20" max="200" value={settings.scale * 100} onChange={(e) => setSettings(s => ({ ...s, scale: parseInt(e.target.value, 10) / 100 }))} className="w-24 accent-primary"/>
                    <span className="text-xs w-10 text-center">{Math.round(settings.scale * 100)}%</span>
                    <Button onClick={fitToScreen} size="sm" variant="secondary">Sığdır</Button>
                </div>
                <Separator />
                {/* --- Layout --- */}
                 <div className="flex items-center gap-2">
                    <Select label="Düzen" id="layout-mode" value={settings.layoutMode} onChange={e => setSettings(s => ({...s, layoutMode: e.target.value as 'flow' | 'table'}))} options={[{ value: 'flow', label: 'Akış' }, { value: 'table', label: 'Tablo' }]}/>
                    {settings.layoutMode === 'flow' ? (
                        <NumberInput label="Sütun" id="columns" min={1} max={5} value={settings.columns} onChange={e => setSettings(s => ({...s, columns: parseInt(e.target.value,10)}))} className="w-14"/>
                    ) : (
                        <>
                             <NumberInput label="Satır" id="rows" min={1} max={20} value={settings.rows} onChange={e => setSettings(s => ({...s, rows: parseInt(e.target.value,10)}))} className="w-14"/>
                            <NumberInput label="Sütun" id="columns" min={1} max={5} value={settings.columns} onChange={e => setSettings(s => ({...s, columns: parseInt(e.target.value,10)}))} className="w-14"/>
                        </>
                    )}
                </div>
                 <Separator />
                 {/* --- Style --- */}
                <div className="flex items-center gap-3">
                    <Select label="Hizalama" id="text-align" value={settings.textAlign} onChange={e => setSettings(s => ({ ...s, textAlign: e.target.value as 'left' | 'center' | 'right' }))} options={[{value: 'left', label: 'Sol'}, {value: 'center', label: 'Orta'}, {value: 'right', label: 'Sağ'}]} />
                    <Select label="Kenarlık" id="border-style" value={settings.borderStyle} onChange={e => setSettings(s => ({ ...s, borderStyle: e.target.value as any }))} options={[{ value: 'none', label: 'Yok' }, { value: 'card', label: 'Kart' }, { value: 'solid', label: 'Düz Çizgi' }, { value: 'dashed', label: 'Kesik Çizgi' }, { value: 'shadow-lift', label: 'Gölge' }, { value: 'top-bar-color', label: 'Renkli Çizgi' }]}/>
                    <Select label="Defter Stili" id="notebook-style" value={settings.notebookStyle} onChange={e => setSettings(s => ({ ...s, notebookStyle: e.target.value as any }))} options={[{ value: 'none', label: 'Yok' }, { value: 'lines', label: 'Çizgili' }, { value: 'grid', label: 'Kareli' }, { value: 'dotted', label: 'Noktalı' }, { value: 'handwriting', label: 'El Yazısı' }]} />
                    <Select label="Yazı Tipi" id="font-theme" value={fontTheme} onChange={e => setFontTheme(e.target.value as any)} options={fontThemeOptions}/>
                </div>
                 <Separator />
                 {/* --- Spacing --- */}
                 <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                        <label htmlFor="problem-spacing-slider" className="font-medium text-xs text-stone-700 dark:text-stone-300">Problem Aralığı</label>
                        <input id="problem-spacing-slider" type="range" min="0" max="5" step="0.1" value={settings.problemSpacing} onChange={(e) => setSettings(s => ({ ...s, problemSpacing: parseFloat(e.target.value) }))} className="w-20 accent-primary"/>
                    </div>
                     <div className="flex flex-col gap-0.5">
                        <label htmlFor="line-height-slider" className="font-medium text-xs text-stone-700 dark:text-stone-300">Satır Yüksekliği</label>
                        <input id="line-height-slider" type="range" min="1" max="2.5" step="0.1" value={settings.lineHeight} onChange={(e) => setSettings(s => ({ ...s, lineHeight: parseFloat(e.target.value) }))} className="w-20 accent-primary"/>
                    </div>
                     <div className="flex flex-col gap-0.5">
                        <label htmlFor="page-margin-slider" className="font-medium text-xs text-stone-700 dark:text-stone-300">Sayfa Kenar Boşluğu</label>
                        <input id="page-margin-slider" type="range" min={0.5} max={4} step={0.1} value={settings.pageMargin} onChange={(e) => setSettings(s => ({ ...s, pageMargin: parseFloat(e.target.value) }))} className="w-20 accent-primary"/>
                    </div>
                 </div>
            </div>
             <div className="flex items-center gap-2">
                <KeyIcon className="w-4 h-4 text-stone-500" />
                <Checkbox label="Cevapları Göster" id="show-answers" checked={isAnswerKeyVisible} onChange={e => setIsAnswerKeyVisible(e.target.checked)} />
            </div>
        </div>
    );
});

const AppContent: React.FC = () => {
    const { 
        appMode, setAppMode,
        isPrintSettingsVisible, closePrintSettings,
        isHowToUseVisible, closeHowToUse,
        isContactModalVisible, closeContactModal,
        isFavoritesPanelVisible, closeFavoritesPanel,
        isTeacherPanelVisible, closeTeacherPanel,
        isSettingsPanelCollapsed, setIsSettingsPanelCollapsed
    } = useUI();
    const { isLoading } = useWorksheet();
    const { addToast } = useToast();
    const { settings, setSettings } = usePrintSettings();
    
    const [isMouseOverWorksheet, setIsMouseOverWorksheet] = useState(false);
    const panAreaRef = useRef<HTMLDivElement>(null);
    const panState = useRef({ isPanning: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });
    const throttleTimeout = useRef<number | null>(null);

    useEffect(() => {
        const el = panAreaRef.current;
        if (el) {
            el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
        }
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
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
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!panState.current.isPanning) return;
        e.preventDefault();
        const el = panAreaRef.current;
        if (!el) return;
        
        if (throttleTimeout.current) return;
        
        throttleTimeout.current = window.setTimeout(() => {
            throttleTimeout.current = null;
            const x = e.clientX - el.offsetLeft;
            const y = e.clientY - el.offsetTop;
            const walkX = (x - panState.current.startX);
            const walkY = (y - panState.current.startY);
            el.scrollLeft = panState.current.scrollLeft - walkX;
            el.scrollTop = panState.current.scrollTop - walkY;
        }, 16); // Throttle to ~60fps

    }, []);

    const stopPanning = useCallback(() => {
        panState.current.isPanning = false;
        panAreaRef.current?.classList.remove('is-panning');
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        if (e.ctrlKey || e.metaKey) { // Allow pinch-zoom on trackpads
            e.preventDefault();
            
            if (throttleTimeout.current) return;

            throttleTimeout.current = window.setTimeout(() => {
                throttleTimeout.current = null;
                const scaleAmount = 0.05;
                setSettings(s => {
                    const newScale = e.deltaY > 0
                        ? Math.max(0.2, s.scale - scaleAmount)
                        : Math.min(2.0, s.scale + scaleAmount);
                    return { ...s, scale: newScale };
                });
            }, 16); // Throttle to ~60fps
        }
        // If no ctrl/meta key, allow normal vertical scrolling of the pan area
    }, [setSettings]);
    
    const handleSaveAssignment = () => {
        addToast('Ödev başarıyla kaydedildi! (Simülasyon)', 'success');
        setAppMode('worksheet');
    }

    return (
        <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
            
            <header className="flex-shrink-0 bg-primary text-white shadow-md z-20 print:hidden">
                <Header />
            </header>

            <div className="flex flex-grow overflow-hidden">
                <aside 
                    onMouseEnter={() => setIsMouseOverWorksheet(false)}
                    className={`print:hidden transition-all duration-300 ease-in-out shadow-lg bg-white dark:bg-stone-800 relative ${
                        isSettingsPanelCollapsed 
                            ? 'w-0 -translate-x-full opacity-0 p-0' 
                            : isMouseOverWorksheet ? 'w-32' : 'w-80'
                    }`}
                >
                     {appMode === 'assignmentCreation' && (
                        <div className="assignment-creation-banner">
                            <p className="font-bold text-sm">Ödev Oluşturma Modu</p>
                            <p className="text-xs">Ayarları yapıp "Ödevi Kaydet" butonuna basın.</p>
                        </div>
                    )}
                    <div className={`overflow-y-auto h-full transition-opacity duration-200 p-4 ${
                            (isMouseOverWorksheet && !isSettingsPanelCollapsed) ? 'opacity-0 delay-0' : 'opacity-100 delay-200'
                        }`}
                    >
                        <SettingsPanel />
                    </div>
                     {appMode === 'assignmentCreation' && !isSettingsPanelCollapsed && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700">
                           <Button onClick={handleSaveAssignment} className="w-full">
                                <ClipboardIcon className="w-5 h-5" /> Ödevi Kaydet
                           </Button>
                        </div>
                    )}
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

                <main 
                    onMouseEnter={() => setIsMouseOverWorksheet(true)}
                    className="flex-1 flex flex-col overflow-hidden relative"
                >
                    {isLoading && (
                        <div className="absolute inset-0 bg-stone-100/80 dark:bg-stone-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 gap-4">
                            <LoadingDaisy />
                            <p className="text-accent-text text-lg font-semibold animate-pulse">Etkinlik hazırlanıyor...</p>
                        </div>
                    )}
                    <WorksheetToolbar />
                    <div 
                        ref={panAreaRef}
                        className="flex-grow overflow-auto p-4 md:p-8 cursor-grab pan-area"
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
            <TeacherPanel isVisible={isTeacherPanelVisible} onClose={closeTeacherPanel} />
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