
import { TutorialStep } from './services/TutorialContext.tsx';
import { TUTORIAL_ELEMENT_IDS } from './constants.ts';

export const TUTORIAL_STEPS: TutorialStep[] = [
    {
        targetId: 'root',
        placement: 'center',
        title: "MathGen'e Hoş Geldiniz! 🐞",
        content: "Merhaba! Ben Uğur Böceği. Öğrencileriniz veya çocuklarınız için harika çalışma kağıtları hazırlamanıza yardım edeceğim. Hazırsanız başlayalım mı?"
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.MODULE_MENU,
        placement: 'bottom',
        title: '1. Adım: Konuyu Seçin',
        content: 'Burası kontrol merkeziniz. Matematik, Okuma, Yazma veya Özel Öğrenme Güçlüğü (Disleksi vb.) gibi ana kategorilerden birini ve altındaki modülü buradan seçebilirsiniz.',
        action: (ui) => {
            ui.setIsSettingsPanelCollapsed(false);
            // Reset to a neutral state if needed
        }
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.SETTINGS_PANEL,
        placement: 'right',
        title: '2. Adım: Detayları Ayarlayın',
        content: 'Seçtiğiniz konuya göre sol panel değişir. Zorluk seviyesi, soru sayısı ve diğer özel ayarları buradan yapabilirsiniz. Her modülün kendine has "Sihirli Ayarları" vardır!',
        action: (ui) => {
            ui.setIsSettingsPanelCollapsed(false);
            ui.setActiveTab('arithmetic'); // Show arithmetic as example
        }
    },
    {
        targetId: 'use-word-problems', // Specifically targeting the AI checkbox inside Arithmetic
        placement: 'right',
        title: ' ✨ Yapay Zeka Gücü',
        content: '"Gerçek Hayat Problemleri" kutucuğunu işaretlerseniz, Google Gemini AI devreye girer ve size özel, hikayeleştirilmiş problemler yazar. Konuyu bile siz seçebilirsiniz!',
        action: (ui) => {
            ui.setActiveTab('arithmetic');
        }
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.GENERATE_BUTTON,
        placement: 'right',
        title: '3. Adım: Oluşturun',
        content: 'Ayarlar içinize sindiyse bu butona tıklayın. Saniyeler içinde yepyeni, eşsiz sorular üretilecek. Beğenmezseniz tekrar tıklayarak yenilerini üretebilirsiniz.',
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.WORKSHEET_AREA,
        placement: 'left',
        title: '4. Adım: Canlı Önizleme',
        content: 'Kağıdınızın tam olarak nasıl görüneceğini buradan inceleyin. Yakınlaşmak için fare tekerleğini, kaydırmak için basılı tutup sürüklemeyi kullanabilirsiniz.',
        action: (ui) => {
             // Ensure sidebar is closed on mobile to see content
             if(window.innerWidth < 768) ui.setIsSettingsPanelCollapsed(true);
        }
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.WORKSHEET_TOOLBAR,
        placement: 'top',
        title: '5. Adım: Tasarımcı Sizsiniz',
        content: 'Sayfa düzenini beğenmediniz mi? Buradan sütun sayısını artırın, yazı tipini değiştirin veya "Tablo" moduna geçin. Her şey sizin kontrolünüzde.',
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.HEADER_ACTIONS,
        placement: 'bottom',
        title: '6. Adım: Çıktı Alın',
        content: 'Mükemmel çalışma kağıdınız hazır! Şimdi yazdırabilir veya PDF olarak indirip daha sonra kullanmak üzere saklayabilirsiniz.',
    },
    {
        targetId: 'root',
        placement: 'center',
        title: 'Yolculuk Başlıyor! 🚀',
        content: 'Artık MathGen uzmanısınız. Farklı modülleri keşfetmeyi ve "Favorilerim" özelliğini kullanarak ayarlarınızı kaydetmeyi unutmayın. İyi dersler!',
        action: (ui) => {
             ui.setIsSettingsPanelCollapsed(false);
        }
    }
];
