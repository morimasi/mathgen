// constants.ts

export const TAB_GROUPS = [
    {
        title: "Matematiğe Hazırlık",
        tabs: [
            { id: "matching-and-sorting", label: "Eşleştirme ve Gruplama" },
            { id: "comparing-quantities", label: "Miktarları Karşılaştırma" },
            { id: "number-recognition", label: "Rakam Tanıma ve Sayma" },
            { id: "patterns", label: "Örüntüler" },
            { id: "basic-shapes", label: "Temel Geometrik Şekiller" },
            { id: "positional-concepts", label: "Konum ve Yön Kavramları" },
            { id: "intro-to-measurement", label: "Ölçmeye Giriş" },
            { id: "simple-graphs", label: "Basit Grafikler ve Veri" },
        ],
    },
    {
        title: "İşlemler",
        tabs: [
            { id: "arithmetic", label: "Dört İşlem" },
            { id: "visual-support", label: "Görsel Destek (Canlı)" },
            { id: 'visual-addition-subtraction', label: 'Şekillerle Toplama/Çıkarma' },
            { id: 'verbal-arithmetic', label: 'İşlemi Sözel İfade Etme' },
            { id: 'missing-number-puzzles', label: 'Eksik Sayıyı Bulma' },
            { id: 'symbolic-arithmetic', label: 'Simgelerle İşlemler' },
            { id: "word-problems", label: "Problemler (AI)" },
            { id: 'problem-creation', label: 'Problem Kurma' },
        ],
    },
    {
        title: "Sayılar",
        tabs: [
            { id: "fractions", label: "Kesirler" },
            { id: "decimals", label: "Ondalık Sayılar" },
            { id: "place-value", label: "Basamak Değeri" },
            { id: "rhythmic-counting", label: "Ritmik Sayma" },
        ],
    },
    {
        title: "Ölçümler",
        tabs: [
            { id: "time", label: "Zaman Ölçme" },
            { id: "geometry", label: "Geometri" },
            { id: "measurement", label: "Ölçüler" },
        ],
    },
    {
        title: "Özel Öğrenme",
        tabs: [
            { id: "dyscalculia", label: "Diskalkuli" },
            { id: "dysgraphia", label: "Disgrafi" },
        ],
    }
];

export const TABS = TAB_GROUPS.flatMap(group => group.tabs);


export const TOPIC_SUGGESTIONS = [
    "Market Alışverişi",
    "Parkta Bir Gün",
    "Oyuncak Dükkanı",
    "Doğum Günü Partisi",
    "Hayvanat Bahçesi",
    "Uzay Macerası",
    "Mutfakta Yemek",
    "Okul Kantini",
    "Çiftlik Hayvanları",
    "Deniz Kenarında",
    "Spor Müsabakaları",
    "Kütüphane Kitapları",
    "Kamp Gezisi",
    "Meslekler",
    "Mevsimler",
];

export const TUTORIAL_ELEMENT_IDS = {
    MODULE_MENU: 'tutorial-module-menu',
    SETTINGS_PANEL: 'tutorial-settings-panel',
    GENERATE_BUTTON: 'tutorial-generate-button',
    WORKSHEET_AREA: 'worksheet-area', // This one already exists
    WORKSHEET_TOOLBAR: 'tutorial-worksheet-toolbar',
    HEADER_ACTIONS: 'tutorial-header-actions',
};