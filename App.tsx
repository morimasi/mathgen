import React, { useState, useRef, useCallback, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ThemeProvider } from './services/ThemeContext';
import { ColorThemeProvider } from './services/ColorThemeContext';
import { FontThemeProvider } from './services/FontThemeContext';
import { PrintSettingsProvider, usePrintSettings } from './services/PrintSettingsContext';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext';
import { UIProvider, useUI } from './services/UIContext';
import { WorksheetProvider, useWorksheet } from './services/WorksheetContext';
import { ToastProvider } from './services/ToastContext';
import Tabs from './components/Tabs';
import SettingsPanel from './components/SettingsPanel';
import ProblemSheet from './components/ProblemSheet';
import PrintSettingsPanel from './components/PrintSettingsPanel';
import HowToUseModal from './components/HowToUseModal';
import ContactModal from './components/ContactModal';
import ToastContainer from './components/ToastContainer';
import ThemeSwitcher from './components/ThemeSwitcher';
import { TAB_GROUPS } from './constants';
import { PrintSettings } from './types';
import { LoadingIcon, PrintIcon, PdfIcon, HelpIcon, PrintSettingsIcon, ShuffleIcon, ContactIcon, FitToScreenIcon, FontSizeIcon, PaletteIcon, GridIcon, BorderStyleIcon, ColumnsIcon, TextAlignLeftIcon } from './components/icons/Icons';
import AnimatedLogo from './components/AnimatedLogo';
import Select from './components/form/Select';


const generatePdfDocument = async (
    contentElement: HTMLElement,
    printSettings: PrintSettings
): Promise<jsPDF | null> => {
    try {
        const canvas = await html2canvas(contentElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
        });

        const orientation = printSettings.orientation === 'landscape' ? 'l' : 'p';
        const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        
        return pdf;

    } catch (error) {
        console.error("Error generating PDF document:", error);
        return null;
    }
};

interface WorksheetToolbarProps {
    scale: number;
    setScale: (scale: number) => void;
    worksheetParentRef: React.RefObject<HTMLElement>;
}

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const WorksheetToolbar: React.FC<WorksheetToolbarProps> = ({ scale, setScale, worksheetParentRef }) => {
    const { settings: printSettings, setSettings: setPrintSettings } = usePrintSettings();

    const handleFitToPage = () => {
        if (!worksheetParentRef.current) return;

        const containerWidth = worksheetParentRef.current.clientWidth;
        const worksheetWidth = printSettings.orientation === 'portrait' ? A4_WIDTH_PX : A4_HEIGHT_PX;
        
        const newScale = (containerWidth - 32) / worksheetWidth;
        
        setScale(Math.min(1.5, Math.max(0.1, newScale)));
    };

    const handleSettingChange = (field: keyof PrintSettings, value: any) => {
        setPrintSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="worksheet-toolbar">
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <label htmlFor="scale-slider" className="text-xs font-medium text-stone-600 dark:text-stone-400">Ölçek:</label>
                    <input
                        type="range"
                        id="scale-slider"
                        min="0.2"
                        max="1.5"
                        step="0.01"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-24 sm:w-32 h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
                    />
                    <span className="text-sm font-semibold w-12 text-center">{Math.round(scale * 100)}%</span>
                </div>
                <button 
                    onClick={handleFitToPage} 
                    className="p-2 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors" 
                    title="Ekrana Sığdır"
                >
                    <FitToScreenIcon className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex items-center gap-x-4 gap-y-2 flex-wrap justify-end">
                <div className="flex items-center gap-1.5" title="Sütun Sayısı">
                    <ColumnsIcon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                    <input 
                        type="range"
                        id="toolbar-columns"
                        min="1" max="7" step="1"
                        value={printSettings.columns}
                        onChange={(e) => handleSettingChange('columns', parseInt(e.target.value))}
                        className="w-20 h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
                        disabled={printSettings.layoutMode === 'table'}
                    />
                    <span className="text-sm font-semibold w-6 text-center">{printSettings.columns}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Problem Hizalama">
                    <TextAlignLeftIcon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                    <Select
                        id="toolbar-text-align" value={printSettings.textAlign}
                        onChange={e => handleSettingChange('textAlign', e.target.value as 'left' | 'center' | 'right')}
                        options={[{ value: 'left', label: 'Sol' }, { value: 'center', label: 'Orta' }, { value: 'right', label: 'Sağ' }]}
                        className="w-24"
                    />
                </div>
                 <div className="flex items-center gap-1.5" title="Yazı Tipi Boyutu">
                    <FontSizeIcon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                    <Select 
                        id="toolbar-font-size"
                        value={printSettings.fontSize}
                        onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                        options={[
                            { value: 12, label: 'Çok Küçük' },
                            { value: 14, label: 'Küçük' },
                            { value: 16, label: 'Normal' },
                            { value: 20, label: 'Büyük' },
                            { value: 26, label: 'Çok Büyük' }
                        ]}
                        className="w-28"
                    />
                </div>
                <div className="flex items-center gap-1.5" title="Renk Teması">
                    <PaletteIcon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                    <Select
                        id="toolbar-color-theme" value={printSettings.colorTheme}
                        onChange={e => handleSettingChange('colorTheme', e.target.value as 'black' | 'blue' | 'sepia')}
                        options={[{ value: 'black', label: 'Siyah' }, { value: 'blue', label: 'Mavi' }, { value: 'sepia', label: 'Kahverengi' }]}
                        className="w-28"
                    />
                </div>
                 <div className="flex items-center gap-1.5" title="Defter Stili">
                    <GridIcon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                     <Select
                        id="toolbar-notebook-style" value={printSettings.notebookStyle}
                        onChange={e => handleSettingChange('notebookStyle', e.target.value as 'none' | 'lines' | 'grid' | 'dotted')}
                        options={[{ value: 'none', label: 'Yok' }, { value: 'lines', label: 'Çizgili' }, { value: 'grid', label: 'Kareli' }, { value: 'dotted', label: 'Noktalı' }]}
                        className="w-28"
                    />
                </div>
                <div className="flex items-center gap-1.5" title="Problem Kenarlığı">
                    <BorderStyleIcon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                     <Select
                        id="toolbar-border-style" value={printSettings.borderStyle} onChange={e => handleSettingChange('borderStyle', e.target.value)}
                        options={[
                            { value: 'none', label: 'Yok' },
                            { value: 'card', label: 'Kart Görünümü' },
                            { value: 'solid', label: 'Düz Çizgi' },
                            { value: 'dashed', label: 'Kesik Çizgili' },
                            { value: 'shadow-lift', label: 'Gölge Efekti' },
                            { value: 'top-bar-color', label: 'Renkli Üst Çizgi' },
                        ]}
                         className="w-32"
                    />
                </div>
            </div>
        </div>
    );
};


const AppContent: React.FC = () => {
    const { 
        activeTab, setActiveTab, isPrintSettingsVisible, openPrintSettings, closePrintSettings,
        isHowToUseVisible, openHowToUse, closeHowToUse, isContactModalVisible, openContactModal,
        closeContactModal, isSettingsPanelCollapsed, setIsSettingsPanelCollapsed
    } = useUI();

    const { problems, lastGeneratorModule, worksheetTitle, triggerAutoRefresh, resetWorksheet } = useWorksheet();
    const { settings: printSettings } = usePrintSettings();
    
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const [worksheetScale, setWorksheetScale] = useState(0.5);
    
    const contentRef = useRef<HTMLDivElement>(null);
    const worksheetParentRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const collapseTimerRef = useRef<number | null>(null);
    const [isPanning, setIsPanning] = useState(false);
    const panState = useRef({ isGrabbing: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
                return;
            }
            if (e.code === 'Space' && !e.repeat) {
                e.preventDefault();
                setIsPanning(true);
                document.body.classList.add('is-panning');
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setIsPanning(false);
                panState.current.isGrabbing = false;
                document.body.classList.remove('is-panning', 'is-grabbing');
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            document.body.classList.remove('is-panning', 'is-grabbing');
        };
    }, []);

    const handleViewportMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isPanning && viewportRef.current) {
            e.preventDefault();
            panState.current = {
                isGrabbing: true,
                startX: e.pageX - viewportRef.current.offsetLeft,
                startY: e.pageY - viewportRef.current.offsetTop,
                scrollLeft: viewportRef.current.scrollLeft,
                scrollTop: viewportRef.current.scrollTop,
            };
            document.body.classList.add('is-grabbing');
        }
    };

    const handleViewportMouseUpAndLeave = () => {
        panState.current.isGrabbing = false;
        document.body.classList.remove('is-grabbing');
    };

    const handleViewportMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!panState.current.isGrabbing || !viewportRef.current) return;
        e.preventDefault();
        const x = e.pageX - viewportRef.current.offsetLeft;
        const y = e.pageY - viewportRef.current.offsetTop;
        const walkX = (x - panState.current.startX);
        const walkY = (y - panState.current.startY);
        viewportRef.current.scrollLeft = panState.current.scrollLeft - walkX;
        viewportRef.current.scrollTop = panState.current.scrollTop - walkY;
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (e.ctrlKey) { // Allow default browser zoom with Ctrl
            return;
        }
        e.preventDefault();
        const newScale = worksheetScale - e.deltaY * 0.001;
        setWorksheetScale(Math.min(1.5, Math.max(0.1, newScale)));
    };

    const handlePdfAction = useCallback(async (action: 'print' | 'save') => {
        const contentElement = contentRef.current;
        if (!contentElement || isPdfLoading) return;

        setIsPdfLoading(true);
        document.body.classList.add('pdf-export-mode');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 50)); // Allow UI to update
            const pdf = await generatePdfDocument(contentElement, printSettings);
            
            if (pdf) {
                if (action === 'print') {
                    pdf.autoPrint();
                    const blob = pdf.output('blob');
                    const pdfUrl = URL.createObjectURL(blob);
                    window.open(pdfUrl);
                } else { // save
                    const safeTitle = worksheetTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                    pdf.save(`${safeTitle || 'MathGen_Worksheet'}.pdf`);
                }
            } else {
                 console.error('PDF oluşturulamadı.');
            }
        } catch (error) {
            console.error(`Error during PDF ${action}:`, error);
        } finally {
            document.body.classList.remove('pdf-export-mode');
            setIsPdfLoading(false);
        }
    }, [isPdfLoading, printSettings, worksheetTitle]);

    const handleResetApp = () => {
        resetWorksheet();
        setActiveTab('matching-and-sorting');
        setWorksheetScale(0.5);
    };

    const handleSettingsPanelEnter = () => {
        if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
        setIsSettingsPanelCollapsed(false);
    };

    const handleWorksheetAreaEnter = () => {
        if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
        collapseTimerRef.current = window.setTimeout(() => setIsSettingsPanelCollapsed(true), 250); 
    };

    const handleWorksheetAreaLeave = () => {
        if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
        handleViewportMouseUpAndLeave(); // Also stop panning if mouse leaves area
    };

    return (
        <div className="bg-stone-50 dark:bg-stone-900 min-h-screen text-stone-800 dark:text-stone-200">
            <header className="bg-orange-800 dark:bg-stone-950/70 text-amber-50 shadow-md sticky top-0 z-20 print:hidden">
                <div className="header-constellation" aria-hidden="true"><svg viewBox="0 0 200 80" className="w-full h-full"><g><polyline points="190,20 160,30 130,40 100,50" className="constellation-line" /><polyline points="100,50 105,70 60,75 50,55 100,50" className="constellation-line" /><circle cx="190" cy="20" r="2" className="star" style={{ animationDelay: '0.1s' }} /><circle cx="160" cy="30" r="2.5" className="star" style={{ animationDelay: '0.8s' }} /><circle cx="130" cy="40" r="2" className="star" style={{ animationDelay: '0.3s' }} /><circle cx="100" cy="50" r="1.5" className="star" style={{ animationDelay: '1.2s' }} /><circle cx="105" cy="70" r="2" className="star" style={{ animationDelay: '1.5s' }} /><circle cx="60" cy="75" r="2.5" className="star" style={{ animationDelay: '0.5s' }} /><circle cx="50" cy="55" r="2" className="star" style={{ animationDelay: '0.2s' }} /></g></svg></div>
                <div className="px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <AnimatedLogo onReset={handleResetApp} />
                            <h1 className="text-xl font-bold tracking-tight header-interactive-item">MathGen</h1>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={openHowToUse} className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item" title="Nasıl Kullanılır?"><HelpIcon /></button>
                            <button onClick={openContactModal} className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item" title="İletişim"><ContactIcon /></button>
                            <div className="header-interactive-item"><ThemeSwitcher /></div>
                            <div className="h-6 w-px bg-white/20 mx-1"></div>
                            <button onClick={triggerAutoRefresh} disabled={!lastGeneratorModule || problems.length === 0} className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item disabled:opacity-50 disabled:cursor-not-allowed" title="Yenile"><ShuffleIcon /></button>
                            <button onClick={openPrintSettings} className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item" title="Yazdırma Ayarları"><PrintSettingsIcon /></button>
                            <button onClick={() => handlePdfAction('save')} disabled={isPdfLoading || problems.length === 0} className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item disabled:opacity-50 disabled:cursor-not-allowed" title="PDF olarak indir">{isPdfLoading ? <LoadingIcon className="w-6 h-6" /> : <PdfIcon />}</button>
                            <button onClick={() => handlePdfAction('print')} disabled={isPdfLoading || problems.length === 0} className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item disabled:opacity-50 disabled:cursor-not-allowed" title="Yazdır">{isPdfLoading ? <LoadingIcon className="w-6 h-6" /> : <PrintIcon />}</button>
                        </div>
                    </div>
                    <div className="relative"><Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={setActiveTab} /></div>
                </div>
            </header>

            <main className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                <div className={`main-layout-grid ${isSettingsPanelCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <aside className="print:hidden settings-panel" onMouseEnter={handleSettingsPanelEnter}>
                         <div className="settings-panel-content bg-white dark:bg-stone-800/80 p-4 rounded-lg shadow-sm sticky top-[7rem]">
                            <SettingsPanel />
                        </div>
                    </aside>
                    <div className="worksheet-area" ref={worksheetParentRef} onMouseEnter={handleWorksheetAreaEnter} onMouseLeave={handleWorksheetAreaLeave}>
                        <WorksheetToolbar scale={worksheetScale} setScale={setWorksheetScale} worksheetParentRef={worksheetParentRef} />
                        <div 
                            className="worksheet-viewport" 
                            ref={viewportRef}
                            onWheel={handleWheel}
                            onMouseDown={handleViewportMouseDown}
                            onMouseUp={handleViewportMouseUpAndLeave}
                            onMouseMove={handleViewportMouseMove}
                        >
                            <ProblemSheet contentRef={contentRef} viewScale={worksheetScale} />
                        </div>
                    </div>
                </div>
            </main>
            
            {isPdfLoading && (
                <div className="pdf-loading-overlay">
                    <LoadingIcon className="w-12 h-12" />
                    <p className="text-xl mt-4">PDF oluşturuluyor, lütfen bekleyin...</p>
                    <p className="text-sm text-stone-400 mt-2">Bu işlem sayfa sayısına göre biraz zaman alabilir.</p>
                </div>
            )}
            
            <PrintSettingsPanel isVisible={isPrintSettingsVisible} onClose={closePrintSettings} />
            <HowToUseModal isVisible={isHowToUseVisible} onClose={closeHowToUse} />
            <ContactModal isVisible={isContactModalVisible} onClose={closeContactModal} />
            <ToastContainer />
        </div>
    );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ColorThemeProvider>
        <FontThemeProvider>
          <PrintSettingsProvider>
            <ToastProvider>
              <FlyingLadybugProvider>
                <UIProvider>
                  <WorksheetProvider>
                    <AppContent />
                  </WorksheetProvider>
                </UIProvider>
              </FlyingLadybugProvider>
            </ToastProvider>
          </PrintSettingsProvider>
        </FontThemeProvider>
      </ColorThemeProvider>
    </ThemeProvider>
  );
};

export default App;