// constants.ts

import {
    VisualAdditionSubtractionIcon,
    VerbalArithmeticIcon,
    MissingNumberIcon,
    SymbolicArithmeticIcon,
    ProblemCreationIcon
} from './components/icons/Icons';


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
            { id: 'visual-addition-subtraction', label: 'Şekillerle Toplama/Çıkarma' },
            { id: 'verbal-arithmetic', label: 'İşlemi Sözel İfade Etme' },
            { id: 'missing-number-puzzles', label: 'Eksik Sayıyı Bulma' },
            { id: 'symbolic-arithmetic', label: 'Simgelerle İşlemler' },
            { id: 'problem-creation', label: 'Problem Kurma' },
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
        title: 'İşlemler',
        tabs: [
            { id: 'arithmetic', label: 'Dört İşlem' },
            { id: 'visual-support', label: 'Görsel Destek' },
            { id: 'word-problems', label: 'Problemler (AI)' },
        ]
    },
    {
        title: 'Ölçümler',
        tabs: [
            { id: 'time', label: 'Zaman Ölçme' },
            { id: 'geometry', label: 'Geometri' },
            { id: 'measurement', label: 'Ölçüler' },
        ]
    },
    {
        title: 'Özel Öğrenme',
        tabs: [
            { id: 'dyslexia', label: 'Disleksi Odaklı' },
            { id: 'dyscalculia', label: 'Diskalkuli Odaklı' },
            { id: 'dysgraphia', label: 'Disgrafi Odaklı' },
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