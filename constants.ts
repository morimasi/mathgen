// constants.ts

export const TAB_GROUPS = [
    {
        title: 'Matematiğe Hazırlık',
        tabs: [
            { id: 'matching-and-sorting', label: 'Eşleştirme ve Gruplama' },
            { id: 'comparing-quantities', label: 'Miktarları Karşılaştırma' },
            { id: 'number-recognition', label: 'Rakam Tanıma ve Sayma' },
            { id: 'patterns', label: 'Örüntüler' },
            { id: 'basic-shapes', label: 'Temel Geometrik Şekiller' },
            { id: 'positional-concepts', label: 'Konum ve Yön' },
            { id: 'intro-to-measurement', label: 'Ölçmeye Giriş' },
            { id: 'simple-graphs', label: 'Basit Grafikler' },
        ]
    },
    {
        title: 'İşlemler',
        tabs: [
            { id: 'arithmetic', label: 'Dört İşlem' },
            { id: 'visual-support', label: 'Görsel Destek' },
            { id: 'word-problems', label: 'Problemler (AI)' },
        ]
    },
    {
        title: 'Sayılar',
        tabs: [
            { id: 'fractions', label: 'Kesirler' },
            { id: 'decimals', label: 'Ondalık Sayılar' },
            { id: 'place-value', label: 'Basamak Değeri' },
            { id: 'rhythmic-counting', label: 'Ritmik Sayma' },
        ]
    },
    {
        title: 'Ölçümler',
        tabs: [
            { id: 'time', label: 'Zaman Ölçme' },
            { id: 'geometry', label: 'Geometri' },
            { id: 'measurement', label: 'Ölçüler' },
        ]
    }
];

// This is kept for any other part of the app that might need a flat list.
export const TABS = TAB_GROUPS.flatMap(group => group.tabs);

export const TOPIC_SUGGESTIONS = [
    'Market Alışverişi',
    'Okul Eşyaları',
    'Hayvanlar Alemi',
    'Spor Aktiviteleri',
    'Doğa ve Çevre',
    'Yemek Tarifleri',
    'Seyahat ve Ulaşım',
    'Para Hesaplamaları',
    'Zaman Ölçme',
    'Geometrik Şekiller',
    'Bilim Deneyleri',
    'Doğum Günü Partisi',
];