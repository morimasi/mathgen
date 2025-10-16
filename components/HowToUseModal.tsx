import React, { useEffect, useRef, useState } from 'react';
import { TAB_GROUPS } from '../constants';
import {
    HelpIcon,
    ArithmeticIcon,
    FractionsIcon,
    DecimalsIcon,
    PlaceValueIcon,
    RhythmicIcon,
    TimeIcon,
    GeometryIcon,
    MeasurementIcon,
    WordProblemsIcon,
    VisualSupportIcon,
} from './icons/Icons';

interface HowToUseModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    'overview': HelpIcon,
    'arithmetic': ArithmeticIcon,
    'visual-support': VisualSupportIcon,
    'fractions': FractionsIcon,
    'decimals': DecimalsIcon,
    'place-value': PlaceValueIcon,
    'rhythmic-counting': RhythmicIcon,
    'time': TimeIcon,
    'geometry': GeometryIcon,
    'measurement': MeasurementIcon,
    'word-problems': WordProblemsIcon,
};

const moduleContent: { [key: string]: { title: string; content: React.ReactNode } } = {
    overview: {
        title: 'Genel Bakış ve Temel Kullanım',
        content: (
            <>
                <p>MathGen'e hoş geldiniz! Bu uygulama, öğretmenler ve veliler için hızlı ve esnek matematik çalışma kağıtları oluşturmak üzere tasarlanmıştır.</p>
                <h4 className="font-semibold mt-3">Temel Adımlar:</h4>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Üst menüden bir konu grubu (İşlemler, Sayılar, Ölçümler) ve ardından bir alt modül (Dört İşlem, Kesirler vb.) seçin.</li>
                    <li>Sol taraftaki ayarlar panelini kullanarak problem türünü, zorluğu, sayısını ve diğer özellikleri özelleştirin.</li>
                    <li>"Oluştur" butonlarından birine tıklayarak çalışma kağıdınızı anında sağdaki önizleme alanında görün.</li>
                    <li>Sağ üstteki menüden yazdırma ayarlarını yapın, PDF olarak indirin veya doğrudan yazdırın.</li>
                </ol>
                <div className="mt-4 p-3 bg-amber-50 dark:bg-stone-700/50 rounded-lg border border-amber-200 dark:border-stone-600">
                    <p className="font-semibold">💡 İpucu: Sık kullandığınız ayarları "Ayar Setleri" bölümünden kaydedebilir ve daha sonra tek tıkla tekrar yükleyebilirsiniz.</p>
                </div>
            </>
        )
    },
    ...TAB_GROUPS.flatMap(group => group.tabs).reduce((acc, tab) => {
        acc[tab.id] = {
            title: tab.label,
            content: (
                <>
                    {tab.id === 'arithmetic' && 
                        <>
                            <p>Toplama, çıkarma, çarpma ve bölme işlemleri için temel modül.</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><b>Sınıf Düzeyi:</b> Ayarları 1-5. sınıf seviyelerine göre otomatik olarak düzenler.</li>
                                <li><b>Basamak Sayısı:</b> İşlemlerde kullanılacak sayıların basamak sayısını belirleyin.</li>
                                <li><b>Eldeli/Onluk Bozma:</b> Toplama ve çıkarma işlemlerinde eldeli veya onluk bozmalı soruların zorunlu olup olmayacağını seçin.</li>
                                <li><b>Gerçek Hayat Problemleri (AI):</b> Belirttiğiniz ayarlara uygun, günlük yaşam senaryoları içeren metin problemleri oluşturmak için yapay zekayı kullanır.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'visual-support' && 
                        <>
                            <p>Öğrencilerin işlemleri somutlaştırmasına yardımcı olmak için nesneler ve kutular kullanan interaktif bir modüldür. Özellikle küçük yaş grupları için idealdir.</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><b>Canlı Güncelleme:</b> Bu modüldeki ayarlar anında çalışma kağıdına yansır.</li>
                                <li><b>Görsel Boyutu:</b> Emoji, sayı ve kutuların boyutlarını ayarlayarak sayfa düzenini optimize edebilirsiniz.</li>
                                <li><b>Sayfayı Yatay Yap:</b> Görsellerin daha iyi sığması için çalışma kağıdını tek tıkla yatay formata geçirebilirsiniz.</li>
                            </ul>
                        </>
                    }
                     {tab.id === 'word-problems' && 
                        <>
                            <p>Google Gemini yapay zeka modelini kullanarak tamamen özelleştirilebilir metin problemleri oluşturun.</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><b>Problem Modülü:</b> Problemlerin hangi matematik konusuyla (örn: Kesirler, Zaman Ölçme) ilgili olacağını seçin.</li>
                                <li><b>Konu:</b> Problemlerin senaryosunu belirleyin (örn: Market Alışverişi, Spor). "Rastgele Konu" butonu ile ilham alabilirsiniz.</li>
                                <li><b>İşlem Sayısı:</b> Problemlerin tek veya çok adımlı (2 veya 3 işlem gerektiren) olmasını sağlayın.</li>
                                <li><b>Özel Talimat:</b> Yukarıdaki ayarlar yerine doğrudan kendi talimatınızı yazarak tamamen size özel problemler oluşturun.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'fractions' && 
                        <>
                            <p>Kesirler konusunu pekiştirmek için çeşitli problem türleri sunar.</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><b>Problem Türü:</b> Dört işlem, şekille gösterme, karşılaştırma veya bir bütünün kesrini bulma gibi farklı problem tipleri arasından seçim yapın.</li>
                                <li><b>Zorluk:</b> Dört işlem için paydaların eşit, farklı veya tam sayılı kesirler olmasını sağlayarak zorluğu ayarlayın.</li>
                                <li><b>Format:</b> İşlemlerin yan yana veya alt alta (kesir çizgisiyle) gösterilmesini seçin.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'decimals' && 
                        <>
                             <p>Ondalık sayılarla ilgili temel becerileri geliştirmeye yönelik bir modüldür.</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><b>Problem Türü:</b> Dört işlem, okuma/yazma veya ondalık sayıları kesre çevirme alıştırmaları oluşturun.</li>
                                <li><b>Zorluk:</b> Dört işlemde kullanılacak sayıların büyüklüğünü ve ondalık basamak sayısını ayarlar.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'place-value' && 
                        <>
                            <p>Sayıların basamak değerlerini anlama ve kullanma becerilerini hedefler.</p>
                             <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><b>Problem Türü:</b> Basamak değeri bulma, çözümleme, yuvarlama, okunuşunu yazma ve karşılaştırma gibi birçok farklı beceriye yönelik problem oluşturabilirsiniz.</li>
                                <li><b>Basamak Sayısı:</b> Problemlerde kullanılacak sayıların kaç basamaklı olacağını (en fazla 7) belirleyin.</li>
                            </ul>
                        </>
                    }
                     {tab.id === 'rhythmic-counting' && 
                        <>
                            <p>İleri ve geri ritmik sayma, örüntüleri tamamlama ve sayıları sıralama gibi temel beceriler üzerine odaklanır.</p>
                             <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><b>Problem Türü:</b> Örüntü tamamlama, kural bulma, sıralama veya tek/çift sayıları bulma gibi çeşitli alıştırmalar sunar.</li>
                                <li><b>Alıştırma Kağıdı:</b> Tek bir problem yerine, tüm sayfayı kaplayan, öğrencilerin doldurması için tasarlanmış pratik sayfaları oluşturur.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'time' && 
                        <>
                            <p>Analog saat okuma, süre hesaplama ve takvim gibi zamanla ilgili kavramları içerir.</p>
                             <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><b>Saat Okuma (Analog):</b> Etkileşimli bir şekilde analog saatler oluşturun. İsterseniz akrep, yelkovan veya sayıları gizleyerek farklı zorluklarda sorular hazırlayabilirsiniz.</li>
                                <li><b>Süre Hesaplama:</b> Başlangıç ve bitiş zamanları arasındaki süreyi bulma veya bir olayın ne zaman başlayıp biteceğini hesaplama problemleri oluşturun.</li>
                            </ul>
                        </>
                    }
                     {tab.id === 'geometry' && 
                        <>
                            <p>Temel geometrik şekillerin ve cisimlerin özelliklerini, alan ve çevre hesaplamalarını konu alır.</p>
                             <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><b>Alan ve Çevre:</b> Kare, dikdörtgen, üçgen ve daire gibi şekillerin alan ve çevrelerini hesaplamak için görsel destekli problemler oluşturun.</li>
                                <li><b>Şekil/Cisim Tanıma:</b> Özellikleri verilen geometrik şekil veya cisimlerin adlarını bulmaya yönelik sözel problemler hazırlayın.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'measurement' && 
                        <>
                             <p>Uzunluk, ağırlık ve hacim ölçü birimleri arasında dönüşüm yapma becerisini geliştirir.</p>
                             <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><b>Zorluk:</b> Dönüşümlerin tam sayılarla (kolay), ondalıklı sayılarla (orta) veya kesirli/karışık birimlerle (zor) yapılmasını sağlayarak zorluğu ayarlayın.</li>
                                <li><b>Problem Türü:</b> Sadece uzunluk, ağırlık, hacim veya tümünü içeren karışık problemler oluşturun.</li>
                            </ul>
                        </>
                    }
                </>
            )
        };
        return acc;
    }, {} as { [key: string]: { title: string; content: React.ReactNode } })
};


const HowToUseModal: React.FC<HowToUseModalProps> = ({ isVisible, onClose }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (isVisible) panelRef.current?.focus();
    }, [isVisible]);

    const allModules = [{ id: 'overview', label: 'Genel Bakış' }, ...TAB_GROUPS.flatMap(g => g.tabs)];
    const { title, content } = moduleContent[activeSection];

    return (
        <div
            className={`print:hidden fixed inset-0 z-40 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'bg-black/50' : 'bg-transparent pointer-events-none'}`}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={panelRef}
                className={`bg-white dark:bg-stone-800 w-full max-w-4xl h-[80vh] flex flex-col rounded-lg shadow-2xl transition-all duration-300 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <header className="flex justify-between items-center p-4 border-b border-stone-200 dark:border-stone-700 flex-shrink-0">
                    <h2 className="text-2xl font-bold">Nasıl Kullanılır?</h2>
                    <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 text-3xl leading-none" aria-label="Kapat">&times;</button>
                </header>
                
                <div className="flex flex-grow overflow-hidden">
                    <aside className="w-1/3 md:w-1/4 border-r border-stone-200 dark:border-stone-700 p-2 overflow-y-auto">
                        <nav className="flex flex-col gap-1">
                            {allModules.map(module => {
                                const Icon = iconMap[module.id];
                                return (
                                    <button
                                        key={module.id}
                                        onClick={() => setActiveSection(module.id)}
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            activeSection === module.id
                                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                                                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                                        }`}
                                    >
                                        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                                        <span className="flex-grow">{module.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>
                    <main className="w-2/3 md:w-3/4 p-6 overflow-y-auto">
                        <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400 mb-3">{title}</h3>
                        <div className="prose prose-stone dark:prose-invert max-w-none prose-h4:text-base prose-h4:mb-1 prose-ul:text-sm prose-ol:text-sm">
                            {content}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HowToUseModal;
