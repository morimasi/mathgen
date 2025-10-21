// constants.ts
export const TOPIC_SUGGESTIONS = [
    'Market Alışverişi', 'Parkta Bir Gün', 'Okul Eşyaları', 'Hayvanat Bahçesi',
    'Doğum Günü Partisi', 'Yemek Tarifi', 'Uzay Macerası', 'Çiftlik Hayvanları',
    'Oyuncaklar', 'Meslekler', 'Taşıtlar', 'Mevsimler', 'Sporlar'
];

export const TABS = [
    { id: 'customization-center', label: 'Özelleştirme Merkezi' },
    { id: 'visual-support', label: 'Görsel Destek' },
    { id: 'arithmetic', label: 'Dört İşlem' },
    { id: 'fractions', label: 'Kesirler' },
    { id: 'decimals', label: 'Ondalık Sayılar' },
    { id: 'place-value', label: 'Basamak Değeri' },
    { id: 'rhythmic-counting', label: 'Ritmik Sayma' },
    { id: 'time', label: 'Zaman Ölçme' },
    { id: 'geometry', label: 'Geometri' },
    { id: 'measurement', label: 'Ölçüler' },
    { id: 'word-problems', label: 'Problemler (AI)' },
    { id: 'matching-and-sorting', label: 'Eşleştirme ve Gruplama' },
    { id: 'comparing-quantities', label: 'Miktarları Karşılaştırma' },
    { id: 'number-recognition', label: 'Rakam Tanıma ve Sayma' },
    { id: 'patterns', label: 'Örüntüler' },
    { id: 'basic-shapes', label: 'Temel Şekiller' },
    { id: 'positional-concepts', label: 'Konum ve Yön Kavramları' },
    { id: 'intro-to-measurement', label: 'Ölçmeye Giriş' },
    { id: 'simple-graphs', label: 'Basit Grafikler' },
    { id: 'visual-addition-subtraction', label: 'Şekillerle Toplama/Çıkarma' },
    { id: 'verbal-arithmetic', label: 'İşlemi Sözel İfade Etme' },
    { id: 'missing-number-puzzles', label: 'Eksik Sayıyı Bulma' },
    { id: 'symbolic-arithmetic', label: 'Simgelerle İşlemler' },
    { id: 'problem-creation', label: 'Problem Kurma' },
    { id: 'dyslexia', label: 'Disleksi' },
    { id: 'dyscalculia', label: 'Diskalkuli' },
    { id: 'dysgraphia', label: 'Disgrafi' },
];

export const TAB_GROUPS = [
    {
        title: 'Özelleştirme',
        tabs: [
             { id: 'customization-center', label: 'Özelleştirme Merkezi' },
        ]
    },
    {
        title: 'Matematiğe Hazırlık',
        tabs: [
            { id: 'visual-support', label: 'Görsel Destek' },
            { id: 'matching-and-sorting', label: 'Eşleştirme ve Gruplama' },
            { id: 'comparing-quantities', label: 'Miktarları Karşılaştırma' },
            { id: 'number-recognition', label: 'Rakam Tanıma ve Sayma' },
            { id: 'patterns', label: 'Örüntüler' },
            { id: 'basic-shapes', label: 'Temel Şekiller' },
            { id: 'positional-concepts', label: 'Konum ve Yön Kavramları' },
            { id: 'intro-to-measurement', label: 'Ölçmeye Giriş' },
            { id: 'simple-graphs', label: 'Basit Grafikler' },
        ],
    },
    {
        title: 'İşlemler',
        tabs: [
            { id: 'arithmetic', label: 'Dört İşlem' },
            { id: 'visual-addition-subtraction', label: 'Şekillerle Toplama/Çıkarma' },
            { id: 'verbal-arithmetic', label: 'İşlemi Sözel İfade Etme' },
            { id: 'missing-number-puzzles', label: 'Eksik Sayıyı Bulma' },
            { id: 'symbolic-arithmetic', label: 'Simgelerle İşlemler' },
            { id: 'problem-creation', label: 'Problem Kurma' },
        ],
    },
    {
        title: 'Sayılar',
        tabs: [
            { id: 'place-value', label: 'Basamak Değeri' },
            { id: 'rhythmic-counting', label: 'Ritmik Sayma' },
            { id: 'fractions', label: 'Kesirler' },
            { id: 'decimals', label: 'Ondalık Sayılar' },
        ],
    },
    {
        title: 'Ölçümler',
        tabs: [
            { id: 'time', label: 'Zaman Ölçme' },
            { id: 'geometry', label: 'Geometri' },
            { id: 'measurement', label: 'Ölçüler' },
        ],
    },
    {
        title: 'Özel Öğrenme',
        tabs: [
            { id: 'word-problems', label: 'Yapay Zeka Problemleri' },
            { id: 'dyslexia', label: 'Disleksi Etkinlikleri' },
            { id: 'dyscalculia', label: 'Diskalkuli Etkinlikleri' },
            { id: 'dysgraphia', label: 'Disgrafi Etkinlikleri' },
        ],
    }
];
