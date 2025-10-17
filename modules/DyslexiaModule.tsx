import React from 'react';
import { Problem } from '../types';
import HintButton from '../components/HintButton';

interface ModuleProps {
    onGenerate: (problems: Problem[], clearPrevious: boolean, title: string, generatorModule: string, pageCount: number) => void;
    setIsLoading: (loading: boolean) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    autoRefreshTrigger: number;
    lastGeneratorModule: string | null;
}

const DyslexiaModule: React.FC<ModuleProps> = () => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Disleksi Odaklı Alıştırmalar</h2>
                <HintButton text="Bu modül, disleksiye yönelik okuma, harf tanıma ve fonolojik farkındalık becerilerini destekleyici etkinlikler içerecektir." />
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400 p-4 bg-stone-100 dark:bg-stone-800/80 rounded-md border border-stone-200 dark:border-stone-700">
                <p className="font-semibold mb-2">Çok Yakında!</p>
                <p>
                    Bu bölüm, disleksi dostu yazı tipleri, artırılmış harf aralıkları ve görsel olarak ayrıştırılmış içerikler gibi özelliklerle okuma ve anlama becerilerini güçlendirmeyi hedefleyen etkinlikler sunacaktır.
                </p>
            </div>
        </div>
    );
};

export default DyslexiaModule;