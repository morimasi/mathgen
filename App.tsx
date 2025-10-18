import React, { useState, useRef } from 'react';
import { UIProvider, useUI } from './services/UIContext';
import { WorksheetProvider, useWorksheet } from './services/WorksheetContext';
import { PrintSettingsProvider, usePrintSettings } from './services/PrintSettingsContext';
import { ThemeProvider, useTheme } from './services/ThemeContext';
import { ColorThemeProvider } from './services/ColorThemeContext';
import { FontThemeProvider, useFontTheme, fontThemes } from './services/FontThemeContext';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext';
import { ToastProvider, useToast } from './services/ToastContext';
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
    DownloadIcon
} from './components/icons/Icons';
import Button from './components/form/Button';
import Select from './components/form/Select';
import NumberInput from './components/form/NumberInput';
import { useFlyingLadybugs } from './services/FlyingLadybugContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Header: React.FC = () => {
    const { activeTab, setActiveTab, openPrintSettings, openHowToUse, openContactModal, openFavoritesPanel } = useUI();
    const { clearWorksheet, triggerAutoRefresh, setIsLoading } = useWorksheet();
    const { settings: printSettings } = usePrintSettings();
    const { addToast } = useToast();

    const onReset = () => {
        if (window.confirm('Tüm ayarları ve çalışma kağıdını sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            clearWorksheet();
            localStorage.clear();
            window.location.reload();
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
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
                    scale: 2, // Yüksek çözünürlük için ölçeği artır
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
    );
};

const WorksheetToolbar: React.FC = () => {
    const { settings, setSettings } = usePrintSettings();
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
    
    const Separator: React.FC = () => <div className="border-l border-stone-300 dark:border-stone-600 h-6 mx-2"></div>;

    return (
        <div className="flex-shrink-0 p-2 flex items-center justify-between border-b border-stone-200 dark:border-stone-700 print:hidden">
            <div className="flex items-center gap-3">
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
    const { settings, setSettings } = usePrintSettings();
    const [isWorksheetHovered, setIsWorksheetHovered] = useState(false);
    
    const panAreaRef = useRef<HTMLDivElement>(null);
    const panState = useRef({ isPanning: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0) return; // Only pan with left-click
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

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        const scaleAmount = 0.05;
        const newScale = e.deltaY > 0
            ? Math.max(0.2, settings.scale - scaleAmount)
            : Math.min(2.0, settings.scale + scaleAmount);
        setSettings(s => ({ ...s, scale: newScale }));
    };

    return (
        <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
            
            <div className="constellation-header print:hidden">
                <svg className="constellation-svg" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                    <polyline className="constellation-lines" points="30,80 80,100 140,110 190,100 250,95 310,75 380,60" />
                    <circle className="star" cx="30" cy="80" r="3" style={{ animationDelay: '0.1s' }} />
                    <circle className="star" cx="80" cy="100" r="3.5" style={{ animationDelay: '0.5s' }} />
                    <circle className="star" cx="140" cy="110" r="3" style={{ animationDelay: '0.3s' }} />
                    <circle className="star" cx="190" cy="100" r="2.8" style={{ animationDelay: '0.8s' }} />
                    <circle className="star" cx="250" cy="95" r="3.5" style={{ animationDelay: '0.2s' }} />
                    <circle className="star" cx="310" cy="75" r="3" style={{ animationDelay: '0.6s' }} />
                    <circle className="star" cx="380" cy="60" r="3.2" style={{ animationDelay: '0.4s' }} />
                </svg>
            </div>
            
            <header className="flex-shrink-0 bg-primary text-white shadow-md z-20 print:hidden">
                <Header />
            </header>

            <div className="flex flex-grow overflow-hidden">
                <aside 
                    className={`print:hidden transition-all duration-300 ease-in-out shadow-lg ${
                        isSettingsPanelCollapsed 
                            ? 'w-0 -translate-x-full opacity-0 p-0' 
                            : isWorksheetHovered 
                                ? 'w-40 p-2' 
                                : 'w-80 p-4'
                    }`}
                >
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

                <main 
                    className="flex-1 flex flex-col overflow-hidden relative"
                    onMouseEnter={() => setIsWorksheetHovered(true)}
                    onMouseLeave={() => setIsWorksheetHovered(false)}
                >
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-30">
                            <LoadingIcon className="w-12 h-12 text-white" />
                        </div>
                    )}
                    <WorksheetToolbar />
                    <div 
                        ref={panAreaRef}
                        className="flex-grow overflow-auto p-4 md:p-8 cursor-grab"
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