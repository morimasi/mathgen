import React, { useState, useRef, useCallback, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ThemeProvider } from './services/ThemeContext';
import { ColorThemeProvider } from './services/ColorThemeContext';
import { FontThemeProvider } from './services/FontThemeContext';
import { PrintSettingsProvider, usePrintSettings } from './services/PrintSettingsContext';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext';
import Tabs from './components/Tabs';
import SettingsPanel from './components/SettingsPanel';
import ProblemSheet from './components/ProblemSheet';
import PrintSettingsPanel from './components/PrintSettingsPanel';
import HowToUseModal from './components/HowToUseModal';
import ContactModal from './components/ContactModal';
import ThemeSwitcher from './components/ThemeSwitcher';
import { TAB_GROUPS } from './constants';
import { Problem, PrintSettings, VisualSupportSettings, ArithmeticOperation } from './types';
import { LoadingIcon, PrintIcon, PdfIcon, HelpIcon, PrintSettingsIcon, ShuffleIcon, ContactIcon, FitToScreenIcon } from './components/icons/Icons';
import AnimatedLogo from './components/AnimatedLogo';

/**
 * Generates a jsPDF document instance from the provided HTML element.
 */
const generatePdfDocument = async (
    contentElement: HTMLElement,
    printSettings: PrintSettings
): Promise<jsPDF | null> => {
    try {
        const canvas = await html2canvas(contentElement, {
            scale: 2, // Use fixed high scale for PDF quality, independent of the content scale setting.
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

// --- NEW COMPONENT: WorksheetToolbar ---
interface WorksheetToolbarProps {
    scale: number;
    setScale: (scale: number) => void;
    worksheetParentRef: React.RefObject<HTMLElement>;
    orientation: 'portrait' | 'landscape';
}

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const WorksheetToolbar: React.FC<WorksheetToolbarProps> = ({ scale, setScale, worksheetParentRef, orientation }) => {

    const handleFitToPage = () => {
        if (!worksheetParentRef.current) return;

        const containerWidth = worksheetParentRef.current.clientWidth;
        const worksheetWidth = orientation === 'portrait' ? A4_WIDTH_PX : A4_HEIGHT_PX;
        
        // Subtract some padding (e.g., 2rem) for better visual fit
        const newScale = (containerWidth - 32) / worksheetWidth;
        
        setScale(Math.min(1.5, Math.max(0.1, newScale))); // Clamp the scale to reasonable values
    };

    return (
        <div className="worksheet-toolbar">
            <div className="flex items-center gap-4">
                <label htmlFor="scale-slider" className="text-sm font-medium">Ölçek:</label>
                <input
                    type="range"
                    id="scale-slider"
                    min="0.2"
                    max="1.5"
                    step="0.01"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-32 sm:w-48 h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer accent-orange-700"
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
    );
};


const AppContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState('arithmetic');
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [worksheetTitle, setWorksheetTitle] = useState('');
    const [isPrintSettingsVisible, setPrintSettingsVisible] = useState(false);
    const [isHowToUseVisible, setHowToUseVisible] = useState(false);
    const [isContactModalVisible, setContactModalVisible] = useState(false);
    const [autoRefreshTrigger, setAutoRefreshTrigger] = useState(0);
    const [lastGeneratorModule, setLastGeneratorModule] = useState<string | null>(null);
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const [worksheetScale, setWorksheetScale] = useState(0.5);
    const [isSettingsPanelCollapsed, setIsSettingsPanelCollapsed] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [visualSupportSettings, setVisualSupportSettings] = useState<VisualSupportSettings>({
        operation: ArithmeticOperation.Addition,
        maxNumber: 20,
        problemsPerPage: 10,
        pageCount: 1,
        autoFit: true,
        emojiSize: 22,
        numberSize: 24,
        boxSize: 60,
    });

    const { settings: printSettings } = usePrintSettings();
    const contentRef = useRef<HTMLDivElement>(null);
    const worksheetParentRef = useRef<HTMLDivElement>(null);

    const handleGenerate = useCallback((
        newProblems: Problem[], 
        clearPrevious: boolean, 
        title: string,
        generatorModule: string,
        pageCount: number
    ) => {
        setProblems(prev => clearPrevious ? newProblems : [...prev, ...newProblems]);
        setWorksheetTitle(title);
        setLastGeneratorModule(generatorModule);
        setPageCount(pageCount);
    }, []);

    const handlePrint = async () => {
        const contentElement = contentRef.current;
        if (!contentElement || isPdfLoading) return;
    
        setIsPdfLoading(true);
        console.info('Yazdırma için PDF oluşturuluyor...');
        document.body.classList.add('pdf-export-mode');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 50));
            const pdf = await generatePdfDocument(contentElement, printSettings);
            
            if (pdf) {
                pdf.autoPrint();
                const blob = pdf.output('blob');
                const pdfUrl = URL.createObjectURL(blob);
                window.open(pdfUrl);
            } else {
                 console.error('PDF oluşturulamadı.');
            }
        } catch (error) {
            console.error("Error preparing PDF for printing:", error);
        } finally {
            document.body.classList.remove('pdf-export-mode');
            setIsPdfLoading(false);
        }
    };
    
    const handleSaveAsPdf = async () => {
        const contentElement = contentRef.current;
        if (!contentElement || isPdfLoading) return;

        setIsPdfLoading(true);
        console.info('PDF dosyası oluşturuluyor...');
        document.body.classList.add('pdf-export-mode');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 50));
            const pdf = await generatePdfDocument(contentElement, printSettings);

            if (pdf) {
                const blob = pdf.output('blob');
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const safeTitle = worksheetTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                a.download = `${safeTitle || 'MathGen_Worksheet'}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                 console.error('PDF oluşturulamadı.');
            }

        } catch (error) {
            console.error("Error generating PDF for saving:", error);
        } finally {
            document.body.classList.remove('pdf-export-mode');
            setIsPdfLoading(false);
        }
    };

    const triggerAutoRefresh = () => {
        if (problems.length > 0 && lastGeneratorModule) {
            setAutoRefreshTrigger(c => c + 1);
        }
    };

    const handleResetApp = () => {
        setActiveTab('arithmetic');
        setProblems([]);
        setIsLoading(false);
        setWorksheetTitle('');
        setAutoRefreshTrigger(0);
        setLastGeneratorModule(null);
        setWorksheetScale(0.5); // Reset scale on app reset
        setPageCount(1);
    };

    return (
        <div className="bg-stone-50 dark:bg-stone-900 min-h-screen text-stone-800 dark:text-stone-200">
            <header className="bg-orange-800 dark:bg-stone-950/70 text-amber-50 shadow-md sticky top-0 z-20 print:hidden">
                <div className="header-constellation" aria-hidden="true">
                    <svg viewBox="0 0 200 80" className="w-full h-full">
                        <g>
                            {/* Handle */}
                            <polyline points="190,20 160,30 130,40 100,50" className="constellation-line" />
                            {/* Bowl */}
                            <polyline points="100,50 105,70 60,75 50,55 100,50" className="constellation-line" />
                            
                            {/* Stars */}
                            <circle cx="190" cy="20" r="2" className="star" style={{ animationDelay: '0.1s' }} />
                            <circle cx="160" cy="30" r="2.5" className="star" style={{ animationDelay: '0.8s' }} />
                            <circle cx="130" cy="40" r="2" className="star" style={{ animationDelay: '0.3s' }} />
                            <circle cx="100" cy="50" r="1.5" className="star" style={{ animationDelay: '1.2s' }} />
                            <circle cx="105" cy="70" r="2" className="star" style={{ animationDelay: '1.5s' }} />
                            <circle cx="60" cy="75" r="2.5" className="star" style={{ animationDelay: '0.5s' }} />
                            <circle cx="50" cy="55" r="2" className="star" style={{ animationDelay: '0.2s' }} />
                        </g>
                    </svg>
                </div>
                <div className="px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <AnimatedLogo onReset={handleResetApp} />
                            <h1 className="text-xl font-bold tracking-tight header-interactive-item">MathGen</h1>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={() => setHowToUseVisible(true)} className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item" title="Nasıl Kullanılır?">
                                <HelpIcon />
                            </button>
                            <button onClick={() => setContactModalVisible(true)} className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item" title="İletişim">
                                <ContactIcon />
                            </button>
                            <div className="header-interactive-item">
                                <ThemeSwitcher />
                            </div>
                            <div className="h-6 w-px bg-white/20 mx-1"></div>
                            <button 
                                onClick={triggerAutoRefresh} 
                                disabled={!lastGeneratorModule || problems.length === 0}
                                className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="Yenile"
                            >
                                <ShuffleIcon />
                            </button>
                            <button onClick={() => setPrintSettingsVisible(true)} className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item" title="Yazdırma Ayarları">
                                <PrintSettingsIcon />
                            </button>
                            <button 
                                onClick={handleSaveAsPdf} 
                                disabled={isPdfLoading || problems.length === 0}
                                className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="PDF olarak indir"
                            >
                                {isPdfLoading ? <LoadingIcon className="w-6 h-6" /> : <PdfIcon />}
                            </button>
                            <button 
                                onClick={handlePrint} 
                                disabled={isPdfLoading || problems.length === 0}
                                className="p-2 rounded-md hover:bg-white/20 transition-colors header-interactive-item disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="Yazdır"
                            >
                                {isPdfLoading ? <LoadingIcon className="w-6 h-6" /> : <PrintIcon />}
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <Tabs tabGroups={TAB_GROUPS} activeTab={activeTab} onTabClick={setActiveTab} />
                    </div>
                </div>
            </header>

            <main className="p-4 sm:p-6 lg:p-8">
                <div className={`main-layout-grid ${isSettingsPanelCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <aside 
                        className="print:hidden settings-panel"
                        onMouseEnter={() => setIsSettingsPanelCollapsed(false)}
                    >
                         <div className="settings-panel-content bg-white dark:bg-stone-800/80 p-6 rounded-lg shadow-sm sticky top-[10.5rem]">
                            <SettingsPanel 
                                onGenerate={handleGenerate} 
                                setIsLoading={setIsLoading} 
                                activeTab={activeTab}
                                contentRef={contentRef}
                                autoRefreshTrigger={autoRefreshTrigger}
                                lastGeneratorModule={lastGeneratorModule}
                                visualSupportSettings={visualSupportSettings}
                                setVisualSupportSettings={setVisualSupportSettings}
                            />
                        </div>
                    </aside>
                    <div 
                        className="worksheet-area" 
                        ref={worksheetParentRef}
                        onMouseEnter={() => setIsSettingsPanelCollapsed(true)}
                    >
                        <WorksheetToolbar
                            scale={worksheetScale}
                            setScale={setWorksheetScale}
                            worksheetParentRef={worksheetParentRef}
                            orientation={printSettings.orientation}
                        />
                        <div className="worksheet-viewport">
                            <ProblemSheet 
                                problems={problems} 
                                isLoading={isLoading} 
                                title={worksheetTitle}
                                contentRef={contentRef}
                                visualSupportSettings={visualSupportSettings}
                                viewScale={worksheetScale}
                                pageCount={pageCount}
                            />
                        </div>
                    </div>
                </div>
            </main>
            
            <PrintSettingsPanel 
                isVisible={isPrintSettingsVisible}
                onClose={() => setPrintSettingsVisible(false)}
            />
            <HowToUseModal 
                isVisible={isHowToUseVisible}
                onClose={() => setHowToUseVisible(false)}
            />
            <ContactModal
                isVisible={isContactModalVisible}
                onClose={() => setContactModalVisible(false)}
            />
        </div>
    );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
        <ColorThemeProvider>
            <FontThemeProvider>
                <PrintSettingsProvider>
                    <FlyingLadybugProvider>
                        <AppContent />
                    </FlyingLadybugProvider>
                </PrintSettingsProvider>
            </FontThemeProvider>
        </ColorThemeProvider>
    </ThemeProvider>
  );
};

export default App;