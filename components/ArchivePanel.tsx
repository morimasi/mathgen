import React, { useMemo } from 'react';
import { useArchive } from '../services/ArchiveContext';
import { useUI } from '../services/UIContext';
import { useWorksheet } from '../services/WorksheetContext';
import { useToast } from '../services/ToastContext';
import { XIcon, DeleteIcon, LoadIcon, ArchiveIcon } from './icons/Icons';
import Button from './form/Button';

const ArchivePanel: React.FC = () => {
    const { isArchivePanelVisible, closeArchivePanel } = useUI();
    const { archives, deleteFromArchive, loadFromArchive } = useArchive();
    const { updateWorksheet } = useWorksheet();
    const { addToast } = useToast();

    const groupedArchives = useMemo(() => {
        const groups: Record<string, typeof archives> = {};
        archives.forEach(archive => {
            const cat = archive.moduleType || 'Diğer';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(archive);
        });
        return groups;
    }, [archives]);

    if (!isArchivePanelVisible) return null;

    const handleLoad = (id: string) => {
        const archive = loadFromArchive(id);
        if (archive) {
            updateWorksheet({
                newProblems: archive.problems,
                clearPrevious: true,
                title: archive.title,
                preamble: archive.preamble || undefined,
                generatorModule: archive.moduleType || undefined,
                pageCount: archive.pageCount
            });
            addToast('Arşiv başarıyla yüklendi.', 'success');
            closeArchivePanel();
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Bu arşivi silmek istediğinizden emin misiniz?')) {
            deleteFromArchive(id);
            addToast('Arşiv silindi.', 'info');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-md h-full bg-white dark:bg-stone-900 shadow-2xl flex flex-col animate-in slide-in-from-right">
                <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
                    <div className="flex items-center gap-2">
                        <ArchiveIcon className="text-primary" />
                        <h2 className="text-lg font-bold">Arşivim</h2>
                    </div>
                    <button
                        onClick={closeArchivePanel}
                        className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                        <XIcon />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {archives.length === 0 ? (
                        <div className="text-center text-stone-500 dark:text-stone-400 mt-10">
                            <ArchiveIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Henüz kaydedilmiş bir çalışma kağıdı yok.</p>
                            <p className="text-sm mt-2">Çalışma kağıtlarını oluşturduktan sonra "Arşive Kaydet" butonunu kullanabilirsiniz.</p>
                        </div>
                    ) : (
                        Object.entries(groupedArchives).map(([category, items]) => (
                            <div key={category} className="space-y-3">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 pb-1">
                                    {category}
                                </h3>
                                <div className="space-y-2">
                                    {items.map(item => (
                                        <div key={item.id} className="bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg border border-stone-200 dark:border-stone-800 flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-stone-900 dark:text-stone-100">{item.title}</h4>
                                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                                                        {new Date(item.date).toLocaleDateString('tr-TR', {
                                                            year: 'numeric', month: 'long', day: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </p>
                                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                                        {item.problems.length} Soru
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="primary" size="sm" className="flex-1 text-xs" onClick={() => handleLoad(item.id)}>
                                                    <LoadIcon className="w-4 h-4 mr-1" /> Yükle
                                                </Button>
                                                <Button variant="danger" size="sm" className="px-2" onClick={() => handleDelete(item.id)} title="Sil">
                                                    <DeleteIcon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArchivePanel;
