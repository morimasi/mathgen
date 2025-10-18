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

// Base64 representation of the user-provided PNG map.
// This string is a placeholder for the actual very long Base64 data of the image.
const turkeyMapBase64 = "data:image/png;base64,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";

/**
 * Returns an HTML string for a static PNG image of the Turkey map.
 * This function is updated to use the user-provided PNG image, represented as a Base64 data URL.
 * The region parameter is now ignored as the image is static and cannot be filtered.
 * @param region - This parameter is no longer used but kept for compatibility.
 */
export const getTurkeyMapSVG = (region: string): string => {
    
    const imageStyle = `
        background-color: #f0f9ff; 
        border: 1px solid #9ca3af; 
        border-radius: 8px; 
        max-height: 400px; 
        width: 100%;
        display: block;
        margin: 0 auto;
    `;
    
    // The complex SVG generation is replaced with a simple img tag pointing to the Base64 data.
    // The region filtering logic is removed as it's not applicable to a static PNG.
    return `<img src="${turkeyMapBase64}" alt="Türkiye Haritası" style="${imageStyle}" />`;
};
