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

const DysgraphiaModule: React.FC<ModuleProps> = () => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Disgrafi Odaklı Alıştırmalar</h2>
                <HintButton text="Bu modül, ince motor becerilerini ve harf/rakam yazımını desteklemek için tasarlanmış, kılavuz çizgili ve izlenebilir alıştırmalar içerecektir." />
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400 p-4 bg-stone-100 dark:bg-stone-800/80 rounded-md border border-stone-200 dark:border-stone-700">
                <p className="font-semibold mb-2">Çok Yakında!</p>
                <p>
                    Yazma güçlüğü çeken öğrenciler için harf ve rakamları takip etme (tracing), kılavuz çizgiler arasında yazma ve görsel ipuçları ile doğru formda yazma pratiği gibi etkinlikler bu bölümde sunulacaktır.
                </p>
            </div>
        </div>
    );
};

export default DysgraphiaModule;