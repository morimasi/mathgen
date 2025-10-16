// constants.ts

export const TAB_GROUPS = [
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