// services/map/mapData.ts

// This data is a simplified representation for the application.
// In a real-world scenario, this would come from a more robust source like a GeoJSON file.

interface City {
    id: number;
    name: string;
    region: string;
    neighbors: number[];
    coast: 'Marmara' | 'Ege' | 'Akdeniz' | 'Karadeniz' | null;
}

export const cityData: City[] = [
  { id: 1, name: 'Adana', region: 'Akdeniz', neighbors: [33, 51, 38, 46, 80, 27], coast: 'Akdeniz' },
  { id: 2, name: 'Adıyaman', region: 'Güneydoğu Anadolu', neighbors: [27, 63, 21, 44, 46], coast: null },
  { id: 3, name: 'Afyonkarahisar', region: 'Ege', neighbors: [26, 43, 64, 20, 32, 15, 42], coast: null },
  { id: 4, name: 'Ağrı', region: 'Doğu Anadolu', neighbors: [76, 25, 49, 13, 65, 36], coast: null },
  { id: 5, name: 'Amasya', region: 'Karadeniz', neighbors: [55, 60, 19, 71], coast: null },
  { id: 6, name: 'Ankara', region: 'İç Anadolu', neighbors: [14, 67, 18, 71, 66, 40, 68, 42, 26], coast: null },
  { id: 7, name: 'Antalya', region: 'Akdeniz', neighbors: [48, 15, 32, 42, 70, 33], coast: 'Akdeniz' },
  { id: 8, name: 'Artvin', region: 'Karadeniz', neighbors: [53, 25, 75], coast: 'Karadeniz' },
  { id: 9, name: 'Aydın', region: 'Ege', neighbors: [35, 45, 64, 20, 48], coast: 'Ege' },
  { id: 10, name: 'Balıkesir', region: 'Marmara', neighbors: [17, 16, 43, 45, 35], coast: 'Marmara' },
  { id: 11, name: 'Bilecik', region: 'Marmara', neighbors: [16, 43, 26, 54], coast: null },
  { id: 12, name: 'Bingöl', region: 'Doğu Anadolu', neighbors: [62, 24, 21, 49, 25], coast: null },
  { id: 13, name: 'Bitlis', region: 'Doğu Anadolu', neighbors: [49, 21, 56, 65, 4], coast: null },
  { id: 14, name: 'Bolu', region: 'Karadeniz', neighbors: [74, 67, 81, 54, 11, 26, 6], coast: null },
  { id: 15, name: 'Burdur', region: 'Akdeniz', neighbors: [48, 20, 3, 32, 7], coast: null },
  { id: 16, name: 'Bursa', region: 'Marmara', neighbors: [77, 41, 11, 43, 10], coast: 'Marmara' },
  { id: 17, name: 'Çanakkale', region: 'Marmara', neighbors: [59, 10, 22], coast: 'Ege' },
  { id: 18, name: 'Çankırı', region: 'İç Anadolu', neighbors: [74, 37, 19, 71, 6, 14], coast: null },
  { id: 19, name: 'Çorum', region: 'Karadeniz', neighbors: [55, 5, 60, 66, 71, 18, 37, 57], coast: null },
  { id: 20, name: 'Denizli', region: 'Ege', neighbors: [64, 3, 15, 48, 9], coast: null },
  { id: 21, name: 'Diyarbakır', region: 'Güneydoğu Anadolu', neighbors: [44, 24, 12, 49, 13, 56, 72, 63, 2], coast: null },
  { id: 22, name: 'Edirne', region: 'Marmara', neighbors: [39, 59, 17], coast: null },
  { id: 23, name: 'Elazığ', region: 'Doğu Anadolu', neighbors: [62, 44, 21, 12, 24], coast: null },
  { id: 24, name: 'Erzincan', region: 'Doğu Anadolu', neighbors: [28, 69, 58, 62, 12, 23, 44, 25], coast: null },
  { id: 25, name: 'Erzurum', region: 'Doğu Anadolu', neighbors: [53, 8, 75, 36, 4, 49, 12, 24, 69, 28], coast: null },
  { id: 26, name: 'Eskişehir', region: 'İç Anadolu', neighbors: [11, 16, 43, 3, 42, 6, 14], coast: null },
  { id: 27, name: 'Gaziantep', region: 'Güneydoğu Anadolu', neighbors: [46, 2, 63, 79, 80, 1], coast: null },
  { id: 28, name: 'Giresun', region: 'Karadeniz', neighbors: [52, 58, 24, 69, 61], coast: 'Karadeniz' },
  { id: 29, name: 'Gümüşhane', region: 'Karadeniz', neighbors: [61, 69, 24], coast: null },
  { id: 30, name: 'Hakkari', region: 'Doğu Anadolu', neighbors: [73, 65], coast: null },
  { id: 31, name: 'Hatay', region: 'Akdeniz', neighbors: [80, 27, 79], coast: 'Akdeniz' },
  { id: 32, name: 'Isparta', region: 'Akdeniz', neighbors: [3, 42, 15, 7], coast: null },
  { id: 33, name: 'Mersin', region: 'Akdeniz', neighbors: [7, 70, 42, 51, 1], coast: 'Akdeniz' },
  { id: 34, name: 'İstanbul', region: 'Marmara', neighbors: [59, 41, 39], coast: 'Marmara' },
  { id: 35, name: 'İzmir', region: 'Ege', neighbors: [10, 45, 9], coast: 'Ege' },
  { id: 36, name: 'Kars', region: 'Doğu Anadolu', neighbors: [75, 25, 4, 76], coast: null },
  { id: 37, name: 'Kastamonu', region: 'Karadeniz', neighbors: [74, 57, 18, 19, 78], coast: 'Karadeniz' },
  { id: 38, name: 'Kayseri', region: 'İç Anadolu', neighbors: [58, 50, 40, 51, 1, 46, 66], coast: null },
  { id: 39, name: 'Kırklareli', region: 'Marmara', neighbors: [22, 59, 34], coast: 'Karadeniz' },
  { id: 40, name: 'Kırşehir', region: 'İç Anadolu', neighbors: [6, 71, 66, 50, 51, 68], coast: null },
  { id: 41, name: 'Kocaeli', region: 'Marmara', neighbors: [34, 77, 16, 54], coast: 'Marmara' },
  { id: 42, name: 'Konya', region: 'İç Anadolu', neighbors: [6, 26, 3, 32, 7, 70, 33, 51, 68], coast: null },
  { id: 43, name: 'Kütahya', region: 'Ege', neighbors: [16, 11, 26, 3, 64, 45, 10], coast: null },
  { id: 44, name: 'Malatya', region: 'Doğu Anadolu', neighbors: [58, 24, 23, 21, 2, 46], coast: null },
  { id: 45, name: 'Manisa', region: 'Ege', neighbors: [10, 43, 64, 9, 35], coast: null },
  { id: 46, name: 'Kahramanmaraş', region: 'Akdeniz', neighbors: [38, 58, 44, 2, 27, 80, 1], coast: null },
  { id: 47, name: 'Mardin', region: 'Güneydoğu Anadolu', neighbors: [72, 21, 63, 73], coast: null },
  { id: 48, name: 'Muğla', region: 'Ege', neighbors: [9, 20, 15, 7], coast: 'Ege' },
  { id: 49, name: 'Muş', region: 'Doğu Anadolu', neighbors: [25, 4, 12, 21, 13], coast: null },
  { id: 50, name: 'Nevşehir', region: 'İç Anadolu', neighbors: [66, 38, 51, 68, 40], coast: null },
  { id: 51, name: 'Niğde', region: 'İç Anadolu', neighbors: [68, 50, 38, 1, 33, 42], coast: null },
  { id: 52, name: 'Ordu', region: 'Karadeniz', neighbors: [55, 60, 58, 28], coast: 'Karadeniz' },
  { id: 53, name: 'Rize', region: 'Karadeniz', neighbors: [61, 8, 25], coast: 'Karadeniz' },
  { id: 54, name: 'Sakarya', region: 'Marmara', neighbors: [41, 11, 81, 14], coast: 'Karadeniz' },
  { id: 55, name: 'Samsun', region: 'Karadeniz', neighbors: [57, 19, 5, 60, 52], coast: 'Karadeniz' },
  { id: 56, name: 'Siirt', region: 'Güneydoğu Anadolu', neighbors: [13, 21, 72, 73, 65], coast: null },
  { id: 57, name: 'Sinop', region: 'Karadeniz', neighbors: [37, 19, 55], coast: 'Karadeniz' },
  { id: 58, name: 'Sivas', region: 'İç Anadolu', neighbors: [52, 28, 24, 44, 46, 38, 66, 60], coast: null },
  { id: 59, name: 'Tekirdağ', region: 'Marmara', neighbors: [39, 34, 17, 22], coast: 'Marmara' },
  { id: 60, name: 'Tokat', region: 'Karadeniz', neighbors: [55, 5, 19, 66, 58, 52], coast: null },
  { id: 61, name: 'Trabzon', region: 'Karadeniz', neighbors: [53, 29, 28], coast: 'Karadeniz' },
  { id: 62, name: 'Tunceli', region: 'Doğu Anadolu', neighbors: [24, 12, 23], coast: null },
  { id: 63, name: 'Şanlıurfa', region: 'Güneydoğu Anadolu', neighbors: [27, 2, 21, 47], coast: null },
  { id: 64, name: 'Uşak', region: 'Ege', neighbors: [43, 3, 20, 45], coast: null },
  { id: 65, name: 'Van', region: 'Doğu Anadolu', neighbors: [4, 13, 56, 73, 30], coast: null },
  { id: 66, name: 'Yozgat', region: 'İç Anadolu', neighbors: [19, 60, 58, 38, 50, 40, 71], coast: null },
  { id: 67, name: 'Zonguldak', region: 'Karadeniz', neighbors: [81, 14, 74, 78], coast: 'Karadeniz' },
  { id: 68, name: 'Aksaray', region: 'İç Anadolu', neighbors: [6, 40, 50, 51, 42], coast: null },
  { id: 69, name: 'Bayburt', region: 'Karadeniz', neighbors: [61, 25, 24, 29], coast: null },
  { id: 70, name: 'Karaman', region: 'İç Anadolu', neighbors: [42, 33, 7], coast: null },
  { id: 71, name: 'Kırıkkale', region: 'İç Anadolu', neighbors: [6, 18, 19, 66, 40], coast: null },
  { id: 72, name: 'Batman', region: 'Güneydoğu Anadolu', neighbors: [49, 21, 47, 56], coast: null },
  { id: 73, name: 'Şırnak', region: 'Güneydoğu Anadolu', neighbors: [56, 47, 30, 65], coast: null },
  { id: 74, name: 'Bartın', region: 'Karadeniz', neighbors: [67, 14, 37, 78], coast: 'Karadeniz' },
  { id: 75, name: 'Ardahan', region: 'Doğu Anadolu', neighbors: [8, 25, 36], coast: null },
  { id: 76, name: 'Iğdır', region: 'Doğu Anadolu', neighbors: [36, 4], coast: null },
  { id: 77, name: 'Yalova', region: 'Marmara', neighbors: [41, 16], coast: 'Marmara' },
  { id: 78, name: 'Karabük', region: 'Karadeniz', neighbors: [74, 37, 18, 14, 67], coast: null },
  { id: 79, name: 'Kilis', region: 'Güneydoğu Anadolu', neighbors: [27, 31], coast: null },
  { id: 80, name: 'Osmaniye', region: 'Akdeniz', neighbors: [46, 27, 31, 1], coast: null },
  { id: 81, name: 'Düzce', region: 'Karadeniz', neighbors: [67, 14, 54], coast: 'Karadeniz' },
];

/**
 * Returns a simplified SVG of the Turkey map. 
 * It contains CSS rules to show/hide cities based on the region parameter.
 * @param region - The region to highlight (e.g., 'marmara', 'ege', or 'turkey' for all).
 */
export const getTurkeyMapSVG = (region: string): string => {
    // A simplified but functional SVG map. Path data is illustrative.
    const regionClasses: {[key: string]: string} = {
      'marmara': 'marmara', 'ege': 'ege', 'akdeniz': 'akdeniz', 'karadeniz': 'karadeniz', 
      'icanadolu': 'icanadolu', 'doguanadolu': 'doguanadolu', 'guneydoguanadolu': 'guneydoguanadolu'
    };
    const cssClass = regionClasses[region] || 'turkey';
    
    return `
    <svg version="1.1" id="turkey-map" class="show-${cssClass}" xmlns="http://www.w3.org/2000/svg"
        xml:space="preserve" viewBox="150 70 800 400" style="background-color: #aadaff; border: 1px solid #9ca3af; border-radius: 8px; max-height: 400px;">
        <style>
            .city {
                fill: #f3f4f6; stroke: #4b5563; stroke-width: 0.7; transition: fill 0.2s; cursor: pointer;
                display: none; /* Hide all by default */
            }
            .city:hover { fill: #fef08a; }
            .city-name {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 8px; fill: #1f2937; pointer-events: none; text-anchor: middle;
            }
            .show-turkey .city,
            .show-marmara .marmara,
            .show-ege .ege,
            .show-akdeniz .akdeniz,
            .show-karadeniz .karadeniz,
            .show-icanadolu .icanadolu,
            .show-doguanadolu .doguanadolu,
            .show-guneydoguanadolu .guneydoguanadolu {
                display: block; /* Show only relevant cities */
            }
        </style>
        <g id="cities-group">
            <!-- Marmara -->
            <g class="city marmara" id="pl-34"><path d="M340,130 l15,2 l5,10 l-12,8 l-8,-20 z"/><text x="345" y="138" class="city-name">İstanbul</text></g>
            <g class="city marmara" id="pl-16"><path d="M328,150 l18,5 l-2,15 l-20,-5 z"/><text x="330" y="162" class="city-name">Bursa</text></g>
            <g class="city marmara" id="pl-17"><path d="M250,140 l20,5 l10,25 l-25,-5 z"/><text x="260" y="158" class="city-name">Çanakkale</text></g>
            <!-- Ege -->
            <g class="city ege" id="pl-35"><path d="M240,240 l30,-15 l10,20 l-25,15 z"/><text x="260" y="245" class="city-name">İzmir</text></g>
            <g class="city ege" id="pl-9"><path d="M280,250 l20,5 l-5,15 l-20,-8 z"/><text x="282" y="260" class="city-name">Aydın</text></g>
            <g class="city ege" id="pl-48"><path d="M295,270 l25,10 l-5,20 l-30,-10 z"/><text x="300" y="285" class="city-name">Muğla</text></g>
             <!-- Akdeniz -->
            <g class="city akdeniz" id="pl-7"><path d="M350,330 l40,-5 l10,20 l-45,2 z"/><text x="370" y="338" class="city-name">Antalya</text></g>
            <g class="city akdeniz" id="pl-1"><path d="M550,340 l30,5 l5,15 l-38,-2 z"/><text x="565" y="352" class="city-name">Adana</text></g>
            <g class="city akdeniz" id="pl-31"><path d="M580,380 l20,10 l-5,15 l-25,-8 z"/><text x="585" y="395" class="city-name">Hatay</text></g>
            <!-- Karadeniz -->
            <g class="city karadeniz" id="pl-55"><path d="M580,110 l40,5 l5,20 l-42,-3 z"/><text x="600" y="125" class="city-name">Samsun</text></g>
            <g class="city karadeniz" id="pl-61"><path d="M700,120 l30,2 l10,15 l-35,0 z"/><text x="715" y="130" class="city-name">Trabzon</text></g>
            <g class="city karadeniz" id="pl-53"><path d="M740,125 l20,5 l2,12 l-25,-3 z"/><text x="745" y="135" class="city-name">Rize</text></g>
            <!-- İç Anadolu -->
            <g class="city icanadolu" id="pl-6"><path d="M430,220 l40,-5 l15,20 l-45,10 z"/><text x="450" y="235" class="city-name">Ankara</text></g>
            <g class="city icanadolu" id="pl-42"><path d="M420,280 l60,-10 l10,30 l-65,5 z"/><text x="450" y="295" class="city-name">Konya</text></g>
            <g class="city icanadolu" id="pl-38"><path d="M540,230 l30,10 l5,20 l-38,-5 z"/><text x="555" y="248" class="city-name">Kayseri</text></g>
            <!-- Doğu Anadolu -->
            <g class="city doguanadolu" id="pl-25"><path d="M780,180 l40,15 l-10,30 l-40,-20 z"/><text x="790" y="205" class="city-name">Erzurum</text></g>
            <g class="city doguanadolu" id="pl-65"><path d="M850,250 l30,20 l-5,25 l-35,-15 z"/><text x="860" y="270" class="city-name">Van</text></g>
            <g class="city doguanadolu" id="pl-44"><path d="M650,270 l30,-5 l10,25 l-35,2 z"/><text x="665" y="282" class="city-name">Malatya</text></g>
            <!-- Güneydoğu Anadolu -->
            <g class="city guneydoguanadolu" id="pl-27"><path d="M630,330 l30,5 l5,20 l-38,0 z"/><text x="645" y="345" class="city-name">Gaziantep</text></g>
            <g class="city guneydoguanadolu" id="pl-21"><path d="M730,300 l40,10 l-5,25 l-42,-10 z"/><text x="745" y="320" class="city-name">Diyarbakır</text></g>
            <g class="city guneydoguanadolu" id="pl-47"><path d="M720,350 l35,5 l-5,20 l-38,-8 z"/><text x="730" y="360" class="city-name">Mardin</text></g>
        </g>
    </svg>
    `;
};
