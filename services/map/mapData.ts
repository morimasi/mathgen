export interface MapLocation {
    id: string;
    name: string;
    icon: string; // emoji
    x: number; // percentage
    y: number; // percentage
}

export interface MapData {
    id: 'neighborhood' | 'zoo' | 'city';
    name: string;
    locations: MapLocation[];
}

export const maps: MapData[] = [
    {
        id: 'neighborhood',
        name: 'Mahalle Haritası',
        locations: [
            { id: 'school', name: 'Okul', icon: '🏫', x: 20, y: 25 },
            { id: 'park', name: 'Park', icon: '🌳', x: 50, y: 50 },
            { id: 'house', name: 'Ev', icon: '🏠', x: 80, y: 20 },
            { id: 'store', name: 'Market', icon: '🏪', x: 75, y: 80 },
            { id: 'hospital', name: 'Hastane', icon: '🏥', x: 15, y: 75 },
        ],
    },
    {
        id: 'zoo',
        name: 'Hayvanat Bahçesi Haritası',
        locations: [
            { id: 'entrance', name: 'Giriş', icon: '🎟️', x: 50, y: 90 },
            { id: 'lions', name: 'Aslanlar', icon: '🦁', x: 25, y: 70 },
            { id: 'monkeys', name: 'Maymunlar', icon: '🐒', x: 20, y: 30 },
            { id: 'elephants', name: 'Filler', icon: '🐘', x: 70, y: 20 },
            { id: 'cafe', name: 'Kafe', icon: '☕', x: 80, y: 60 },
        ],
    },
    {
        id: 'city',
        name: 'Şehir Merkezi Haritası',
        locations: [
            { id: 'station', name: 'İstasyon', icon: '🚉', x: 10, y: 50 },
            { id: 'museum', name: 'Müze', icon: '🏛️', x: 40, y: 20 },
            { id: 'library', name: 'Kütüphane', icon: '📚', x: 85, y: 30 },
            { id: 'cinema', name: 'Sinema', icon: '🎬', x: 45, y: 80 },
            { id: 'restaurant', name: 'Restoran', icon: '🍽️', x: 70, y: 65 },
        ],
    },
];
