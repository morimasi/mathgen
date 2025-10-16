import React, { useState, useRef, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ThemeProvider } from './services/ThemeContext';
import { FontThemeProvider } from './services/FontThemeContext';
import { PrintSettingsProvider, usePrintSettings } from './services/PrintSettingsContext';
import { FlyingLadybugProvider } from './services/FlyingLadybugContext';
import { ToastProvider, useToast } from './services/ToastContext';
import Tabs from './components/Tabs';
import SettingsPanel from './components/SettingsPanel';
import ProblemSheet from './components/ProblemSheet';
import PrintSettingsPanel from './components/PrintSettingsPanel';
import HowToUseModal from './components/HowToUseModal';
import ContactModal from './components/ContactModal';
import ThemeSwitcher from './components/ThemeSwitcher';
import ToastContainer from './components/ToastContainer';
import { TAB_GROUPS } from './constants';
import { Problem, PrintSettings, VisualSupportSettings, ArithmeticOperation } from './types';
import { LoadingIcon, PrintIcon, PdfIcon, HelpIcon, PrintSettingsIcon, ShuffleIcon, ContactIcon } from './components/icons/Icons';
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
    const { addToast } = useToast();
    const contentRef = useRef<HTMLDivElement>(null);
    const worksheetRef = useRef<HTMLDivElement>(null);

    const handleGenerate = useCallback((
        newProblems: Problem[], 
        clearPrevious: boolean, 
        title: string,
        generatorModule: string
    ) => {
        setProblems(prev => clearPrevious ? newProblems : [...prev, ...newProblems]);
        setWorksheetTitle(title);
        setLastGeneratorModule(generatorModule);
    }, []);

    const handlePrint = async () => {
        const contentElement = contentRef.current;
        if (!contentElement || isPdfLoading) return;
    
        setIsPdfLoading(true);
        addToast('Yazdırma için PDF oluşturuluyor...', 'info');
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
                 addToast('PDF oluşturulamadı.', 'error');
            }
        } catch (error) {
            console.error("Error preparing PDF for printing:", error);
            addToast('PDF yazdırılırken bir hata oluştu.', 'error');
        } finally {
            document.body.classList.remove('pdf-export-mode');
            setIsPdfLoading(false);
        }
    };
    
    const handleSaveAsPdf = async () => {
        const contentElement = contentRef.current;
        if (!contentElement || isPdfLoading) return;

        setIsPdfLoading(true);
        addToast('PDF dosyası oluşturuluyor...', 'info');
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
                addToast('PDF başarıyla oluşturuldu ve indiriliyor.', 'success');
            } else {
                 addToast('PDF dosyası oluşturulamadı.', 'error');
            }

        } catch (error) {
            console.error("Error generating PDF for saving:", error);
            addToast('PDF kaydedilirken bir hata oluştu.', 'error');
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
    };

    return (
        <div className="bg-stone-50 dark:bg-stone-900 min-h-screen text-stone-800 dark:text-stone-200">
            <header className="bg-orange-800 dark:bg-stone-950/70 text-amber-50 shadow-md sticky top-0 z-20 print:hidden">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <aside className="md:col-span-1 print:hidden">
                         <div className="bg-white dark:bg-stone-800/80 p-6 rounded-lg shadow-sm sticky top-[10.5rem]">
                            <SettingsPanel 
                                onGenerate={handleGenerate} 
                                setIsLoading={setIsLoading} 
                                activeTab={activeTab}
                                worksheetRef={worksheetRef}
                                autoRefreshTrigger={autoRefreshTrigger}
                                lastGeneratorModule={lastGeneratorModule}
                                visualSupportSettings={visualSupportSettings}
                                setVisualSupportSettings={setVisualSupportSettings}
                            />
                        </div>
                    </aside>
                    <section className="md:col-span-2" ref={worksheetRef}>
                        <ProblemSheet 
                            problems={problems} 
                            isLoading={isLoading} 
                            title={worksheetTitle}
                            contentRef={contentRef}
                            visualSupportSettings={visualSupportSettings}
                        />
                    </section>
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
            <ToastContainer />
        </div>
    );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
        <FontThemeProvider>
            <PrintSettingsProvider>
                <FlyingLadybugProvider>
                    <ToastProvider>
                        <AppContent />
                    </ToastProvider>
                </FlyingLadybugProvider>
            </PrintSettingsProvider>
        </FontThemeProvider>
    </ThemeProvider>
  );
};

export default App;
