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
    LoadingIcon
} from './components/icons/Icons.tsx';
import Button from './components/form/Button.tsx';
import Select from './components/form/Select.tsx';
import NumberInput from './components/form/NumberInput.tsx';
import { useFlyingLadybugs } from './services/FlyingLadybugContext.tsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LoadingDaisy from './components/LoadingDaisy.tsx';
import { PrintSettings } from './types.ts';

// --- LAZY LOADED MODULES ---
const CustomizationCenterModule = React.lazy(() => import('./modules/CustomizationCenterModule.tsx'));
const ArithmeticModule = React.lazy(() => import('./modules/ArithmeticModule.tsx'));
const FractionsModule = React.lazy(() => import('./modules/FractionsModule.tsx'));
const DecimalsModule = React.lazy(() => import('./modules/DecimalsModule.tsx'));
const PlaceValueModule = React.lazy(() => import('./modules/PlaceValueModule.tsx'));
const RhythmicCountingModule = React.lazy(() => import('./modules/RhythmicCountingModule.tsx').then(module => ({ default: module.RhythmicCountingModule })));
const TimeModule = React.lazy(() => import('./modules/TimeModule.tsx'));
const GeometryModule = React.lazy(() => import('./modules/GeometryModule.tsx'));
const MeasurementModule = React.lazy(() => import('./modules/MeasurementModule.tsx'));
const WordProblemsModule = React.lazy(() => import('./modules/WordProblemsModule.tsx'));
const VisualSupportModule = React.lazy(() => import('./modules/VisualSupportModule.tsx'));
const MatchingAndSortingModule = React.lazy(() => import('./modules/MatchingAndSortingModule.tsx'));
const ComparingQuantitiesModule = React.lazy(() => import('./modules/ComparingQuantitiesModule.tsx'));
const NumberRecognitionModule = React.lazy(() => import('./modules/NumberRecognitionModule.tsx'));
const PatternsModule = React.lazy(() => import('./modules/PatternsModule.tsx'));
const BasicShapesModule = React.lazy(() => import('./modules/BasicShapesModule.tsx'));
const PositionalConceptsModule = React.lazy(() => import('./modules/PositionalConceptsModule.tsx'));
const IntroToMeasurementModule = React.lazy(() => import('./modules/IntroToMeasurementModule.tsx').then(module => ({ default: module.IntroToMeasurementModule })));
const SimpleGraphsModule = React.lazy(() => import('./modules/SimpleGraphsModule.tsx'));
const DyslexiaModule = React.lazy(() => import('./modules/DyslexiaModule.tsx'));
const DyscalculiaModule = React.lazy(() => import('./modules/DyscalculiaModule.tsx'));
const DysgraphiaModule = React.lazy(() => import('./modules/DysgraphiaModule.tsx').then(module => ({ default: module.default })));
const VisualAdditionSubtractionModule = React.lazy(() => import('./modules/VisualAdditionSubtractionModule.tsx'));
const VerbalArithmeticModule = React.lazy(() => import('./modules/VerbalArithmeticModule.tsx'));
const MissingNumberPuzzlesModule = React.lazy(() => import('./modules/MissingNumberPuzzlesModule.tsx'));
const SymbolicArithmeticModule = React.lazy(() => import('./modules/SymbolicArithmeticModule.tsx'));
const ProblemCreationModule = React.lazy(() => import('./modules/ProblemCreationModule.tsx').then(module => ({ default: module.default })));


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
    
    const handleLocalChange = (field: keyof PrintSettings, value: any) => {
        setLocalSettings(prev => ({ ...prev, [field]: value }));
    };
    // --- End of debounce implementation ---

    const fitToScreen = () => {
        const area = document.getElementById('worksheet-area');
        if (area) {
            const scale = Math.min(
                area.parentElement!.clientWidth / (area.clientWidth + 50),
                area.parentElement!.clientHeight / (area.clientHeight + 50)
            );
            // Update global state directly for instant feedback from a button click
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
                    <input id="zoom-slider" type="range" min="20" max="200" value={localSettings.scale * 100} onChange={(e) => handleLocalChange('scale', parseInt(e.target.value, 10) / 100)} className="w-24 accent-primary"/>
                    <span className="text-xs w-10 text-center">{Math.round(localSettings.scale * 100)}%</span>
                    <Button onClick={fitToScreen} size="sm" variant="secondary">Sığdır</Button>
                </div>
                <Separator />
                {/* --- Layout --- */}
                 <div className="flex items-center gap-2">
                    <Select label="Düzen" id="layout-mode" value={localSettings.layoutMode} onChange={e => handleLocalChange('layoutMode', e.target.value as 'flow' | 'table')} options={[{ value: 'flow', label: 'Akış' }, { value: 'table', label: 'Tablo' }]}/>
                    {localSettings.layoutMode === 'flow' ? (
                        <NumberInput label="Sütun" id="columns" min={1} max={5} value={localSettings.columns} onChange={e => handleLocalChange('columns', parseInt(e.target.value,10))} className="w-14"/>
                    ) : (
                        <>
                             <NumberInput label="Satır" id="rows" min={1} max={20} value={localSettings.rows} onChange={e => handleLocalChange('rows', parseInt(e.target.value,10))} className="w-14"/>
                            <NumberInput label="Sütun" id="columns" min={1} max={5} value={localSettings.columns} onChange={e => handleLocalChange('columns', parseInt(e.target.value,10))} className="w-14"/>
                        </>
                    )}
                </div>
                 <Separator />
                 {/* --- Style --- */}
                <div className="flex items-center gap-3">
                    <Select label="Hizalama" id="text-align" value={localSettings.textAlign} onChange={e => handleLocalChange('textAlign', e.target.value as 'left' | 'center' | 'right' )} options={[{value: 'left', label: 'Sol'}, {value: 'center', label: 'Orta'}, {value: 'right', label: 'Sağ'}]} />
                    <Select label="Kenarlık" id="border-style" value={localSettings.borderStyle} onChange={e => handleLocalChange('borderStyle', e.target.value as any)} options={[{ value: 'none', label: 'Yok' }, { value: 'card', label: 'Kart' }, { value: 'solid', label: 'Düz Çizgi' }, { value: 'dashed', label: 'Kesik Çizgi' }, { value: 'shadow-lift', label: 'Gölge' }, { value: 'top-bar-color', label: 'Renkli Çizgi' }]}/>
                    <Select label="Defter Stili" id="notebook-style" value={localSettings.notebookStyle} onChange={e => handleLocalChange('notebookStyle', e.target.value as any)} options={[{ value: 'none', label: 'Yok' }, { value: 'lines', label: 'Çizgili' }, { value: 'grid', label: 'Kareli' }, { value: 'dotted', label: 'Noktalı' }, { value: 'handwriting', label: 'El Yazısı' }]} />
                    <Select label="Yazı Tipi" id="font-theme" value={fontTheme} onChange={e => setFontTheme(e.target.value as any)} options={fontThemeOptions}/>
                </div>
                 <Separator />
                 {/* --- Spacing --- */}
                 <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                        <label htmlFor="problem-spacing-slider" className="font-medium text-xs text-stone-700 dark:text-stone-300">Problem Aralığı</label>
                        <input id="problem-spacing-slider" type="range" min="0" max="5" step="0.1" value={localSettings.problemSpacing} onChange={(e) => handleLocalChange('problemSpacing', parseFloat(e.target.value))} className="w-20 accent-primary"/>
                    </div>
                     <div className="flex flex-col gap-0.5">
                        <label htmlFor="line-height-slider" className="font-medium text-xs text-stone-700 dark:text-stone-300">Satır Yüksekliği</label>
                        <input id="line-height-slider" type="range" min="1" max="2.5" step="0.1" value={localSettings.lineHeight} onChange={(e) => handleLocalChange('lineHeight', parseFloat(e.target.value))} className="w-20 accent-primary"/>
                    </div>
                     <div className="flex flex-col gap-0.5">
                        <label htmlFor="page-margin-slider" className="font-medium text-xs text-stone-700 dark:text-stone-300">Sayfa Kenar Boşluğu</label>
                        <input id="page-margin-slider" type="range" min={0.5} max={4} step={0.1} value={localSettings.pageMargin} onChange={(e) => handleLocalChange('pageMargin', parseFloat(e.target.value))} className="w-20 accent-primary"/>
                    </div>
                 </div>
            </div>
        </div>
    );
});

const SettingsRouter: React.FC = () => {
    const { activeTab } = useUI();

    switch (activeTab) {
        case 'customization-center': return <CustomizationCenterModule />;
        case 'worksheet': return null; // Worksheet is handled outside
        case 'arithmetic': return <ArithmeticModule />;
        case 'visual-support': return <VisualSupportModule />;
        case 'word-problems': return <WordProblemsModule />;
        case 'problem-creation': return <ProblemCreationModule />;
        case 'fractions': return <FractionsModule />;
        case 'decimals': return <DecimalsModule />;
        case 'place-value': return <PlaceValueModule />;
        case 'rhythmic-counting': return <RhythmicCountingModule />;
        case 'time': return <TimeModule />;
        case 'geometry': return <GeometryModule />;
        case 'measurement': return <MeasurementModule />;
        case 'matching-and-sorting': return <MatchingAndSortingModule />;
        case 'comparing-quantities': return <ComparingQuantitiesModule />;
        case 'number-recognition': return <NumberRecognitionModule />;
        case 'patterns': return <PatternsModule />;
        case 'basic-shapes': return <BasicShapesModule />;
        case 'positional-concepts': return <PositionalConceptsModule />;
        case 'intro-to-measurement': return <IntroToMeasurementModule />;
        case 'simple-graphs': return <SimpleGraphsModule />;
        case 'dyslexia': return <DyslexiaModule />;
        case 'dyscalculia': return <DyscalculiaModule />;
        case 'dysgraphia': return <DysgraphiaModule />;
        case 'visual-addition-subtraction': return <VisualAdditionSubtractionModule />;
        case 'verbal-arithmetic': return <VerbalArithmeticModule />;
        case 'missing-number-puzzles': return <MissingNumberPuzzlesModule />;
        case 'symbolic-arithmetic': return <SymbolicArithmeticModule />;
        default: return <CustomizationCenterModule />;
    }
};


const AppContent: React.FC = () => {
    const { 
        activeTab,
        isPrintSettingsVisible, closePrintSettings,
        isHowToUseVisible, closeHowToUse,
        isContactModalVisible, closeContactModal,
        isFavoritesPanelVisible, closeFavoritesPanel
    } = useUI();
    const { isLoading } = useWorksheet();
    const { settings, setSettings } = usePrintSettings();
    
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

    // --- Start of performance optimization for wheel zoom ---
    useEffect(() => {
        // If the global scale changes from an external source (like the slider),
        // reset the inline transform to let the CSS variable take over again.
        if (settings.scale !== lastSyncedScale.current) {
            const worksheetArea = panAreaRef.current?.querySelector<HTMLElement>('#worksheet-area');
            if (worksheetArea) {
                worksheetArea.style.transform = '';
            }
            lastSyncedScale.current = settings.scale;
        }
    }, [settings.scale]);

    const debouncedSetScale = useDebouncedCallback((newScale: number) => {
        lastSyncedScale.current = newScale; // Update our ref when we sync the global state
        setSettings(s => ({ ...s, scale: newScale }));
    }, 200);

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (e.ctrlKey || e.metaKey) { // Allow pinch-zoom on trackpads
            e.preventDefault();
            const worksheetArea = panAreaRef.current?.querySelector<HTMLElement>('#worksheet-area');
            if (!worksheetArea) return;

            // Get the current scale. If an inline transform is set, use that, otherwise use global state.
            const transformMatch = worksheetArea.style.transform.match(/scale\(([^)]+)\)/);
            const currentScale = transformMatch ? parseFloat(transformMatch[1]) : settings.scale;

            const scaleAmount = 0.05;
            const newScale = e.deltaY > 0
                ? Math.max(0.2, currentScale - scaleAmount)
                : Math.min(2.0, currentScale + scaleAmount);

            // Update DOM directly for immediate visual feedback
            worksheetArea.style.transform = `scale(${newScale})`;
            worksheetArea.style.transformOrigin = 'top center'; // Ensure origin is consistent

            // Schedule an update to the global React state
            debouncedSetScale(newScale);
        }
        // If no ctrl/meta key, allow normal vertical scrolling of the pan area
    };
     // --- End of performance optimization ---

    return (
        <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
            
            <header className="flex-shrink-0 bg-primary text-white shadow-md z-20 print:hidden">
                <Header />
            </header>

            <div className="flex flex-grow overflow-hidden">
                <main 
                    className="flex-grow flex flex-col overflow-hidden relative"
                >
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/40 dark:bg-stone-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-30 gap-4">
                            <LoadingDaisy />
                            <p className="text-white text-lg font-semibold animate-pulse">Etkinlik hazırlanıyor...</p>
                        </div>
                    )}
                    
                   {activeTab === 'worksheet' ? (
                        <>
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
                        </>
                    ) : (
                        <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-white dark:bg-stone-800">
                             <Suspense fallback={
                                <div className="flex items-center justify-center h-full">
                                    <LoadingIcon className="w-8 h-8" />
                                </div>
                            }>
                                <div className="max-w-4xl mx-auto">
                                    <SettingsRouter />
                                </div>
                            </Suspense>
                        </div>
                    )}
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