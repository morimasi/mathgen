import React, { useEffect, useRef } from 'react';

interface HowToUseModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const HowToUseModal: React.FC<HowToUseModalProps> = ({ isVisible, onClose }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // Handle closing on Escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Handle focus trapping
    useEffect(() => {
        if (isVisible) {
            panelRef.current?.focus();
        }
    }, [isVisible]);

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="mb-4">
            <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-400 mb-2">{title}</h3>
            <div className="space-y-2 text-stone-600 dark:text-stone-300">
                {children}
            </div>
        </div>
    );

    return (
        <div
            className={`print:hidden fixed inset-0 z-40 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'bg-black/50' : 'bg-transparent pointer-events-none'}`}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={panelRef}
                className={`bg-white dark:bg-stone-800 w-full max-w-2xl rounded-lg shadow-2xl p-6 transition-all duration-300 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">Nasıl Kullanılır?</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 -mt-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 text-3xl leading-none"
                        aria-label="Kapat"
                    >
                        &times;
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <Section title="1. Konu Seçimi">
                        <p>Üst menüden "Dört İşlem", "Kesirler", "Problemler (AI)" gibi çalışmak istediğiniz matematik konusunu seçin.</p>
                    </Section>

                    <Section title="2. Ayarları Özelleştirme">
                        <p>Sol taraftaki ayarlar panelinden seçtiğiniz konuyla ilgili detayları (zorluk, işlem türü, basamak sayısı vb.) özelleştirin.</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong className="font-semibold">Gerçek Hayat Problemleri (AI):</strong> Bu seçeneği işaretleyerek, yapay zeka tarafından oluşturulmuş, günlük yaşam senaryoları içeren özgün problemler hazırlatabilirsiniz.</li>
                            <li><strong className="font-semibold">Otomatik Sığdır:</strong> Bu seçenek, ayarlarınıza göre bir sayfaya sığabilecek en fazla sayıda problemi otomatik olarak hesaplar ve oluşturur.</li>
                        </ul>
                    </Section>

                    <Section title="3. Çalışma Kağıdını Oluşturma">
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong className="font-semibold">Oluştur (Temizle):</strong> Mevcut çalışma kağıdını temizler ve yeni ayarlarla yepyeni bir kağıt oluşturur.</li>
                            <li><strong className="font-semibold">Yenile:</strong> Ayarları değiştirmeden, mevcut kağıttaki soruları yenileriyle değiştirir.</li>
                            <li><strong className="font-semibold">Mevcuta Ekle:</strong> Mevcut çalışma kağıdının sonuna, yeni ayarlarla oluşturulan soruları ekler.</li>
                        </ul>
                    </Section>

                    <Section title="4. Yazdırma ve Kaydetme">
                        <p>Sağ üst köşedeki simgeleri kullanarak yazdırma ayarlarını yapabilir, çalışma kağıdınızı PDF olarak kaydedebilir veya doğrudan yazdırabilirsiniz.</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong>Yazdırma Ayarları:</strong> Sütun sayısı, yazı tipi boyutu, kenarlıklar gibi ayarları yapın.</li>
                            <li><strong>PDF olarak indir / Yazdır:</strong> Hazırladığınız kağıdı tarayıcınızın yazdırma menüsü üzerinden kaydedin veya yazdırın.</li>
                        </ul>
                    </Section>
                     <Section title="5. Geri Bildirim ve İletişim">
                        <p>Uygulamayı geliştirmemize yardımcı olmak için her türlü fikrinizi, önerinizi veya karşılaştığınız bir hatayı "İletişim" sekmesindeki formu kullanarak bize gönderebilirsiniz. Geri bildirimleriniz bizim için çok değerli!</p>
                    </Section>

                    <div className="mt-6 p-3 bg-amber-50 dark:bg-stone-700/50 rounded-lg border border-amber-200 dark:border-stone-600">
                        <p className="font-semibold">💡 İpucu: Sık kullandığınız ayarları "Ayar Setleri" bölümünden kaydedebilir ve daha sonra tek tıkla tekrar yükleyebilirsiniz.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowToUseModal;