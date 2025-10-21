import { TutorialStep } from './services/TutorialContext.tsx';
import { TUTORIAL_ELEMENT_IDS } from './constants.ts';

export const TUTORIAL_STEPS: TutorialStep[] = [
    {
        targetId: 'root',
        placement: 'center',
        title: "MathGen'e Hoş Geldiniz!",
        content: "Uygulamanın temel özelliklerini öğrenmek için bu hızlı tura katılın."
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.MODULE_MENU,
        placement: 'bottom',
        title: '1. Adım: Konu Seçimi',
        content: 'İlk olarak, üst menüden bir konu grubu (örn: İşlemler, Sayılar) ve ardından ilgilendiğiniz bir modül seçin.'
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.SETTINGS_PANEL,
        placement: 'right',
        title: '2. Adım: Özelleştirme',
        content: 'Sol taraftaki bu panelde, seçtiğiniz modülün ayarlarını (zorluk, problem türü, sayı vb.) yapabilirsiniz.',
        action: (ui) => ui.setIsSettingsPanelCollapsed(false)
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.GENERATE_BUTTON,
        placement: 'right',
        title: '3. Adım: Oluşturma',
        content: 'Ayarlarınızı yaptıktan sonra, çalışma kağıdınızı oluşturmak için "Oluştur" düğmesine tıklayın.',
        action: (ui) => {
            ui.setIsSettingsPanelCollapsed(false);
            ui.setActiveTab('arithmetic');
        }
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.WORKSHEET_AREA,
        placement: 'top',
        title: '4. Adım: Önizleme Alanı',
        content: 'Oluşturduğunuz problemler burada görünecektir. Fare tekerleği (Ctrl/Cmd tuşu ile) ile yakınlaşıp uzaklaşabilirsiniz.'
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.WORKSHEET_TOOLBAR,
        placement: 'bottom',
        title: '5. Adım: Hızlı Düzenleme Araçları',
        content: 'Bu araç çubuğu ile çalışma kağıdınızın düzenini (sütun sayısı, yazı tipi, kenar boşlukları vb.) anında değiştirebilirsiniz.'
    },
    {
        targetId: TUTORIAL_ELEMENT_IDS.HEADER_ACTIONS,
        placement: 'bottom',
        title: '6. Adım: Yazdırma ve İndirme',
        content: 'Hazır olduğunuzda, bu düğmeleri kullanarak kağıdınızı yazdırabilir veya PDF olarak bilgisayarınıza indirebilirsiniz.'
    },
    {
        targetId: 'root',
        placement: 'center',
        title: 'Tur Tamamlandı!',
        content: 'Artık harika çalışma kağıtları oluşturmaya hazırsınız. İyi eğlenceler!'
    }
];
