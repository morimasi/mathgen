import React, { useEffect, useRef, useState } from 'react';
import { TAB_GROUPS } from '../constants.ts';
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
    MatchingIcon,
    ComparingIcon,
    NumberRecognitionIcon,
    PatternsIcon,
    BasicShapesIcon,
    PositionalConceptsIcon,
    IntroToMeasurementIcon,
    SimpleGraphsIcon,
    DyslexiaIcon,
    DyscalculiaIcon,
    DysgraphiaIcon,
    VisualAdditionSubtractionIcon,
    VerbalArithmeticIcon,
    MissingNumberIcon,
    SymbolicArithmeticIcon,
    ProblemCreationIcon
} from './icons/Icons.tsx';
import { useTutorial } from '../services/TutorialContext.tsx';
import { TUTORIAL_STEPS } from '../tutorialSteps.ts';
import Button from './form/Button.tsx';

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
    'matching-and-sorting': MatchingIcon,
    'comparing-quantities': ComparingIcon,
    'number-recognition': NumberRecognitionIcon,
    'patterns': PatternsIcon,
    'basic-shapes': BasicShapesIcon,
    'positional-concepts': PositionalConceptsIcon,
    'intro-to-measurement': IntroToMeasurementIcon,
    'simple-graphs': SimpleGraphsIcon,
    'dyslexia': DyslexiaIcon,
    'dyscalculia': DyscalculiaIcon,
    'dysgraphia': DysgraphiaIcon,
    'visual-addition-subtraction': VisualAdditionSubtractionIcon,
    'verbal-arithmetic': VerbalArithmeticIcon,
    'missing-number-puzzles': MissingNumberIcon,
    'symbolic-arithmetic': SymbolicArithmeticIcon,
    'problem-creation': ProblemCreationIcon,
};

const moduleContent: { [key: string]: { title: string; content: React.ReactNode } } = {
    overview: {
        title: 'Genel Bakış ve Temel Kullanım',
        content: (
            <>
                <p>MathGen'e hoş geldiniz! Bu uygulama, öğretmenler ve veliler için hızlı ve esnek matematik çalışma kağıtları oluşturmak üzere tasarlanmıştır.</p>
                <h4 className="font-semibold mt-4">Temel Akış (3 Adım):</h4>
                <ol className="list-decimal list-inside space-y-1">
                    <li><strong>Modül Seçin:</strong> Üst menüden bir konu grubu (İşlemler, Sayılar, Ölçümler) ve ardından bir alt modül (Dört İşlem, Kesirler vb.) seçin.</li>
                    <li><strong>Özelleştirin:</strong> Sol taraftaki ayarlar panelini kullanarak problem türünü, zorluğu, sayısını ve diğer özellikleri belirleyin.</li>
                    <li><strong>Oluşturun ve Yazdırın:</strong> "Oluştur" butonuna tıklayarak çalışma kağıdınızı sağdaki önizleme alanında anında görün. Ardından sağ üstteki ikonları kullanarak PDF olarak indirin veya doğrudan yazdırın.</li>
                </ol>
                <h4 className="font-semibold mt-4">Arayüz Elemanları:</h4>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Başlık Çubuğu (Üst Menü):</strong>
                        <ul className="list-[circle] list-inside ml-4">
                            <li><strong>Logo (Papatya):</strong> Tıkladığınızda uygulamayı başlangıç durumuna sıfırlar.</li>
                            <li><strong>Tema Ayarları (Palet):</strong> Karanlık/Aydınlık mod, renk temaları ve yazı tipi arasında geçiş yapmanızı sağlar.</li>
                            <li><strong>Yenile (Karışık Oklar):</strong> Mevcut ayarları koruyarak sadece soruları yeniler.</li>
                            <li><strong>Yazdırma Ayarları:</strong> Sayfa düzeni, kenarlık, yazı tipi boyutu gibi tüm çıktı ayarlarını buradan yönetirsiniz.</li>
                        </ul>
                    </li>
                    <li><strong>Çalışma Alanı (Sağ Bölüm):</strong>
                         <ul className="list-[circle] list-inside ml-4">
                            <li><strong>Ölçek Çubuğu:</strong> Çalışma kağıdının ekrandaki görünümünü büyütüp küçültmenizi sağlar. "Ekrana Sığdır" butonu, kağıdı pencerenize en uygun boyuta getirir.</li>
                            <li><strong>Önizleme Alanı:</strong> Oluşturduğunuz çalışma kağıdının canlı önizlemesini gösterir.</li>
                        </ul>
                    </li>
                </ul>
                <div className="mt-4 p-3 bg-amber-50 dark:bg-stone-700/50 rounded-lg border border-amber-200 dark:border-stone-600">
                    <p className="font-semibold">💡 İpucu: Her modülün altındaki "Ayar Setleri" bölümü, sık kullandığınız ayarları kaydetmenize ve daha sonra tek tıkla tekrar yüklemenize olanak tanır. Bu, zaman kazanmak için harika bir yoldur!</p>
                </div>
            </>
        )
    },
    ...TAB_GROUPS.flatMap(group => group.tabs).reduce((acc, tab) => {
        acc[tab.id] = {
            title: tab.label,
            content: (
                <>
                    {tab.id === 'dyslexia' && 
                        <>
                            <p>Disleksiye yönelik okuma, yazma ve anlama güçlüklerini hedef alan, tamamen yapay zeka destekli profesyonel egzersizler sunar. Modül, bir terapistin yaklaşımıyla fonolojik farkındalık, harf-ses ilişkisi, okuma akıcılığı, kelime bilgisi ve anlama gibi temel becerilere odaklanır.</p>
                            <h4 className="font-semibold mt-3">Uzmanlık Alanları (Alt Modüller):</h4>
                            <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>Fonolojik Farkındalık:</strong> Kafiye, heceleme ve ses birleştirme gibi temel ses bilinci egzersizleri içerir.</li>
                                <li><strong>Harf-Ses İlişkisi:</strong> 'b' ve 'd' gibi sık karıştırılan harfleri ayırt etmeye yönelik görsel dikkat alıştırmaları sunar.</li>
                                <li><strong>Okuduğunu Anlama:</strong> Yapay zeka, öğrencinin seviyesine uygun, görsel destekli metinler ve bu metinlerle ilgili "5N1K", çıkarım yapma ve olay sıralama gibi çeşitli anlama soruları oluşturur.</li>
                                <li><strong>Görsel Ayırt Etme:</strong> Kelime şekilleri, harf dizilimleri ve görsel dikkat gerektiren daha karmaşık alıştırmalar içerir.</li>
                                <li><strong>Cümle Kurma:</strong> Kelimeleri doğru sıraya koyma veya basit bir cümleyi genişletme gibi yazılı anlatım becerilerini geliştirir.</li>
                                <li><strong>Yürütücü İşlevler:</strong> Dikkat, odaklanma ve kısa süreli hafıza gibi üst düzey bilişsel becerileri destekleyen alıştırmalar sunar.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'arithmetic' && 
                        <>
                            <p>Toplama, çıkarma, çarpma ve bölme işlemleri için temel modül. Hem basit alıştırmalar hem de yapay zeka destekli metin problemleri oluşturabilirsiniz.</p>
                            <h4 className="font-semibold mt-3">Öne Çıkan Ayarlar:</h4>
                            <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>Gerçek Hayat Problemleri (AI):</strong> Bu seçeneği işaretlediğinizde, belirlediğiniz ayarlara (işlem türü, basamak sayısı vb.) uygun, günlük yaşam senaryoları içeren metin problemleri oluşturmak için yapay zeka kullanılır.
                                    <ul className="list-[circle] list-inside ml-4">
                                        <li><strong>Problem Konusu:</strong> Problemlerin senaryosunu belirleyebilirsiniz (örn: "Okul Eşyaları").</li>
                                        <li><strong>Görsel Destek:</strong> Yapay zekanın, problem metnine konuyla ilgili emojiler eklemesini sağlar.</li>
                                    </ul>
                                </li>
                                <li><strong>Sınıf Düzeyi:</strong> Ayarları 1-5. sınıf seviyelerine göre otomatik olarak düzenleyen bir hızlı başlangıç seçeneğidir.</li>
                                <li><strong>Basamak Sayısı:</strong> İşlemlerde kullanılacak sayıların basamak sayısını (1'den 7'ye kadar) belirleyebilirsiniz. "Üçüncü Sayı Ekle" ile üç terimli işlemler oluşturabilirsiniz.</li>
                                <li><strong>Eldeli/Onluk Bozma & Bölme Türü:</strong> Soruların zorluğunu hassas bir şekilde kontrol etmenizi sağlar. Örneğin, sadece onluk bozma gerektiren çıkarma işlemleri hazırlayabilirsiniz.</li>
                                 <li><strong>Format:</strong> Soruların "Yan Yana", "Alt Alta" veya bölme işlemi için "Bölme Çatısı" formatında gösterilmesini seçin.</li>
                                <li><strong>Gösterim:</strong> Sayıların "Rakamla", "Yazıyla" veya her ikisini de içeren "Karışık" bir formatta sunulmasını sağlar.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'visual-support' && 
                        <>
                            <p>Öğrencilerin işlemleri somutlaştırmasına yardımcı olmak için nesneler ve boş kutular kullanan interaktif bir modüldür. Özellikle okul öncesi ve 1. sınıf için idealdir.</p>
                             <h4 className="font-semibold mt-3">Öne Çıkan Özellikler:</h4>
                            <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>Canlı Güncelleme:</strong> Bu modüldeki ayarlar anında çalışma kağıdına yansır. Herhangi bir "Oluştur" butonuna basmanıza gerek yoktur.</li>
                                <li><strong>Otomatik Sığdır vs. Manuel:</strong> "Otomatik Sığdır" seçeneği, sayfayı mevcut ayarlarla en verimli şekilde doldurur. Bu seçeneği kapattığınızda, "Problem Sayısı" ve "Sayfa Sayısı" alanları aktif olur. Değişiklik yaptıktan sonra bu ayarları yansıtmak için yanda beliren **"Uygula"** butonuna basmanız gerekir.</li>
                                <li><strong>Görsel Ayarları:</strong> Sağdaki kaydırma çubukları ile emoji, sayı ve kutuların boyutlarını ayarlayarak sayfa düzenini tam olarak istediğiniz gibi optimize edebilirsiniz.</li>
                                <li><strong>Sayfayı Yatay Yap:</strong> Görsellerin daha iyi sığması için çalışma kağıdını tek tıkla yatay formata geçirebilirsiniz.</li>
                            </ul>
                        </>
                    }
                     {tab.id === 'word-problems' && 
                        <>
                            <p>Google Gemini yapay zeka modelini kullanarak tamamen özelleştirilebilir, yaratıcı ve bağlamsal metin problemleri oluşturabileceğiniz en esnek modüldür.</p>
                             <h4 className="font-semibold mt-3">Kullanım Senaryoları:</h4>
                            <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>Modül Tabanlı Problemler:</strong> "Problem Modülü" listesinden "Kesirler" seçip, "Konu" alanına "Doğum Günü Partisi" yazarak bir doğum günü partisinde geçen kesir problemleri oluşturun.</li>
                                <li><strong>Çok Adımlı Sorular:</strong> "İşlem Sayısı" ayarını 2 veya 3 yaparak, öğrencilerin çözüme ulaşmak için birden fazla adım atmasını gerektiren kompleks problemler hazırlayın.</li>
                                <li><strong>Tamamen Özgür Yaratıcılık:</strong> "Özel Talimat Girin" alanını kullanarak hayal gücünüzü serbest bırakın. Örneğin: <em>"3. sınıf seviyesinde, içinde uzaylılar ve gezegenler geçen, hem çarpma hem de toplama işlemi gerektiren 5 tane eğlenceli problem oluştur."</em></li>
                                <li><strong>Görsel Destek (Emoji):</strong> Yapay zekanın, problem metnine konuyla ilgili emojiler (🍎, 🚗) ekleyerek soruları daha ilgi çekici hale getirmesini sağlayın.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'problem-creation' && 
                        <>
                            <p>Öğrencilere hazır bir işlem (örn: 5+3=8) ve bir görsel tema verilir. Öğrenciden bu bilgileri kullanarak kendi metin problemini yazması istenir. Yaratıcılığı ve matematiksel düşünceyi birleştirir.</p>
                            <h4 className="font-semibold mt-3">Kullanım:</h4>
                            <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>İşlem Türü & Zorluk:</strong> Oluşturulacak temel işlemi (toplama/çıkarma) ve sayıların büyüklüğünü belirleyin.</li>
                                <li><strong>Görsel Tema:</strong> Problemin kurulacağı görsel bağlamı seçin (Hayvanlar, Taşıtlar vb.). Bu, öğrencinin hayal gücünü harekete geçirir.</li>
                                <li><strong>AI ile Örnek:</strong> "AI ile Örnek Problem Oluştur" seçeneği, öğrencilere nasıl bir problem kurabilecekleri konusunda yapay zeka tarafından üretilmiş bir örnek sunar.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'fractions' && 
                        <>
                            <p>Kesirler konusunu pekiştirmek için dört işlemden görselleştirmeye kadar çeşitli problem türleri sunar.</p>
                            <h4 className="font-semibold mt-3">Problem Türleri:</h4>
                            <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>Dört İşlem:</strong> Kesirlerle toplama, çıkarma, çarpma ve bölme alıştırmaları.
                                    <ul className="list-[circle] list-inside ml-4">
                                        <li><strong>Zorluk Ayarı:</strong> "Kolay" (paydaları eşit), "Orta" (paydaları farklı) ve "Zor" (tam sayılı/bileşik kesirler) seçenekleriyle zorluğu kademeli olarak artırın.</li>
                                    </ul>
                                </li>
                                <li><strong>Şekille Gösterme:</strong> Boyanmış bir daire dilimi gösterir ve öğrencinin bu şeklin ifade ettiği kesri yazmasını ister.</li>
                                <li><strong>Karşılaştırma:</strong> İki kesir arasına &lt;, &gt; veya = sembollerinden uygun olanı yerleştirme alıştırmasıdır.</li>
                                <li><strong>Bir Bütünün Kesrini Bulma:</strong> "30'un 2/3'ü kaçtır?" gibi problemler oluşturur.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'decimals' && 
                        <>
                             <p>Ondalık sayılarla ilgili temel becerileri (dört işlem, okuma-yazma, çevirme) geliştirmeye yönelik bir modüldür.</p>
                            <h4 className="font-semibold mt-3">Problem Türleri:</h4>
                            <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>Dört İşlem:</strong> Ondalık sayılarla temel aritmetik işlemler. "Zorluk" ayarı, sayıların büyüklüğünü ve ondalık basamak sayısını kontrol eder.</li>
                                <li><strong>Okuma / Yazma:</strong> Rakamla verilen ondalık sayının okunuşunu veya okunuşu verilen sayının rakamla yazılmasını ister.</li>
                                <li><strong>Kesre Çevirme:</strong> Verilen bir ondalık sayının en sade kesir haline dönüştürülmesi alıştırmasıdır.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'place-value' && 
                        <>
                            <p>Sayıların basamak ve sayı değerlerini anlama, çözümleme ve yuvarlama gibi temel becerileri hedefler.</p>
                             <h4 className="font-semibold mt-3">Problem Türleri:</h4>
                             <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>Basamak Değeri Bulma:</strong> Bir sayıda altı çizili olan rakamın basamak değerini bulmayı hedefler.</li>
                                <li><strong>Yuvarlama:</strong> Sayıları en yakın onluğa, yüzlüğe veya binliğe yuvarlama alıştırmaları içerir.</li>
                                <li><strong>Çözümleme / Çözümlenmiş Sayıyı Bulma:</strong> Sayıları basamak değerlerinin toplamı şeklinde yazma veya bu şekilde verilen sayıyı bulma pratiği sunar.</li>
                                <li><strong>Yazıyla Yazma / Okunuşu Verilen Sayıyı Yazma:</strong> Sayıların metin ve rakam formatları arasında dönüşümünü sağlar.</li>
                            </ul>
                        </>
                    }
                     {tab.id === 'rhythmic-counting' && 
                        <>
                            <p>İleri ve geri ritmik sayma, sayı örüntüleri ve sıralama gibi temel beceriler üzerine odaklanır.</p>
                            <h4 className="font-semibold mt-3">Öne Çıkan Özellikler:</h4>
                             <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>Problem Türü:</strong> "Örüntü Tamamlama" (boşluk doldurma), "Örüntü Kuralı Bulma" (örn: 3'er artıyor), "Sıralama" (küçükten büyüğe/büyükten küçüğe) ve "Tek/Çift" sayı bulma gibi çeşitli alıştırmalar sunar.</li>
                                <li><strong>Alıştırma Kağıdı:</strong> Bu türler, tek tek sorular yerine tüm sayfayı kaplayan, öğrencilerin doldurması için tasarlanmış pratik sayfaları oluşturur. Hızlıca ödev hazırlamak için mükemmeldir.</li>
                                <li><strong>Ayarlar:</strong> Saymanın kaçar kaçar (`Adım`), hangi yönde (`Yön`) ve hangi aralıkta (`Min/Max Değer`) olacağını detaylıca belirleyebilirsiniz.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'time' && 
                        <>
                            <p>Analog saat okuma, süre hesaplama ve takvim gibi zamanla ilgili soyut kavramları somutlaştıran bir modüldür.</p>
                             <h4 className="font-semibold mt-3">Problem Türleri:</h4>
                             <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>Saat Okuma (Analog):</strong> Etkileşimli bir şekilde analog saatler oluşturun. Soruları zorlaştırmak için "Analog Saat Özelleştirme" bölümünden akrep, yelkovan veya sayıları gizleyebilirsiniz.</li>
                                <li><strong>Süre Hesaplama:</strong> "Başlangıç Zamanını Bulma", "Bitiş Zamanını Bulma" ve "Süre Hesaplama" türleriyle farklı senaryolara uygun problemler hazırlayın.</li>
                                <li><strong>Birim Dönüştürme:</strong> Saat-dakika, gün-hafta gibi zaman birimleri arasında dönüşüm alıştırmaları içerir.</li>
                                <li><strong>Zorluk Ayarı:</strong> "Kolay" (tam saatler), "Orta" (çeyrek/yarım saatler) ve "Zor" (tüm dakikalar) seçenekleriyle hassas kontrol sağlar.</li>
                            </ul>
                        </>
                    }
                     {tab.id === 'geometry' && 
                        <>
                            <p>Temel geometrik şekillerin ve cisimlerin özelliklerini, alan ve çevre hesaplamalarını görsel olarak desteklenmiş bir şekilde öğretir.</p>
                            <h4 className="font-semibold mt-3">Problem Türleri:</h4>
                             <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>Alan ve Çevre Hesaplama:</strong> Seçtiğiniz geometrik şeklin (kare, üçgen, daire vb.) kenar uzunlukları üzerinde gösterilmiş bir görselini oluşturur ve alan veya çevresini sorar.</li>
                                <li><strong>Şekil/Cisim Tanıma:</strong> "4 eşit kenarı ve 4 dik açısı olan şekil hangisidir?" gibi sözel tanımlar üzerinden geometrik kavramları sorgular.</li>
                                <li><strong>Açı Türleri:</strong> Rastgele bir açı çizer ve öğrencinin bu açının "Dar, Dik veya Geniş" olduğunu belirtmesini ister.</li>
                                <li><strong>Cisimlerin Elemanları:</strong> Küp, silindir gibi 3B cisimlerin köşe, ayrıt ve yüz sayılarını sorar.</li>
                            </ul>
                        </>
                    }
                    {tab.id === 'measurement' && 
                        <>
                             <p>Uzunluk (km-m-cm), ağırlık (t-kg-g) ve hacim (L-mL) ölçü birimleri arasında dönüşüm yapma becerisini geliştirir.</p>
                             <h4 className="font-semibold mt-3">Zorluk Seviyeleri:</h4>
                             <ul className="list-disc list-inside mt-2 space-y-2">
                                <li><strong>Kolay:</strong> Sadece tam sayılarla basit dönüşümler içerir (örn: 2 m = ? cm).</li>
                                <li><strong>Orta:</strong> Ondalıklı sayılarla dönüşümler eklenir (örn: 1.5 kg = ? g).</li>
                                <li><strong>Zor:</strong> Kesirli ifadeler ve karışık birimlerle daha karmaşık dönüşümler sunar (örn: 1250 m = ? km ? m).</li>
                                <li><strong>Yapay Zeka Desteği:</strong> "Gerçek Hayat Problemleri (AI)" seçeneği ile bu dönüşümleri içeren metin problemleri oluşturabilirsiniz.</li>
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
    const navRef = useRef<HTMLElement>(null);
    const [activeSection, setActiveSection] = useState('overview');
    const { startTutorial } = useTutorial();

    useEffect(() => {
        if (!isVisible) return;
        const panel = panelRef.current;
        if (!panel) return;

        const focusableElements = Array.from(panel.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // FIX: Use instanceof check to ensure element is an HTMLElement before calling focus.
        if (firstElement instanceof HTMLElement) firstElement.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key !== 'Tab') return;

            if (event.shiftKey) { // Shift+Tab
                if (document.activeElement === firstElement) {
                    // FIX: Use instanceof check to ensure element is an HTMLElement before calling focus.
                    if (lastElement instanceof HTMLElement) lastElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    // FIX: Use instanceof check to ensure element is an HTMLElement before calling focus.
                    if (firstElement instanceof HTMLElement) firstElement.focus();
                    event.preventDefault();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onClose]);

    const handleNavKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        event.preventDefault();
        const focusableButtons = Array.from(navRef.current?.querySelectorAll('button') || []);
        const currentIndex = focusableButtons.findIndex(btn => btn === document.activeElement);
        let nextIndex = -1;
        if (event.key === 'ArrowDown') {
            nextIndex = currentIndex < focusableButtons.length - 1 ? currentIndex + 1 : 0;
        } else { // ArrowUp
            nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableButtons.length - 1;
        }
        if (nextIndex !== -1) {
            // FIX: Use instanceof check to ensure element is an HTMLButtonElement before calling focus.
            const nextButton = focusableButtons[nextIndex];
            if (nextButton instanceof HTMLButtonElement) {
                nextButton.focus();
            }
        }
    };


    const allModules = [{ id: 'overview', label: 'Genel Bakış' }, ...TAB_GROUPS.flatMap(g => g.tabs)];
    const { title, content } = moduleContent[activeSection] || { title: 'Yükleniyor...', content: '' };

    const handleStartTour = () => {
        onClose(); // Close the modal first
        startTutorial(TUTORIAL_STEPS);
    };

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
                    <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 text-3xl leading-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Kapat">&times;</button>
                </header>
                
                <div className="flex flex-grow overflow-hidden">
                    <aside className="w-1/3 md:w-1/4 border-r border-stone-200 dark:border-stone-700 p-2 overflow-y-auto">
                        <nav ref={navRef} onKeyDown={handleNavKeyDown} className="flex flex-col gap-1">
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
                        {activeSection === 'overview' && (
                             <Button onClick={handleStartTour} className="w-full mt-6">
                                Uygulamalı Turu Başlat
                            </Button>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HowToUseModal;