import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Problem } from '../types';

export interface ArchivedWorksheet {
    id: string;
    title: string;
    date: string; // ISO string
    moduleType: string | null; // e.g., 'arithmetic', 'dyslexia'
    problems: Problem[];
    preamble: string | null;
    pageCount: number;
}

interface ArchiveContextType {
    archives: ArchivedWorksheet[];
    saveToArchive: (worksheet: Omit<ArchivedWorksheet, 'id' | 'date'>) => void;
    deleteFromArchive: (id: string) => void;
    loadFromArchive: (id: string) => ArchivedWorksheet | undefined;
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export const ArchiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [archives, setArchives] = useState<ArchivedWorksheet[]>(() => {
        const stored = localStorage.getItem('mathgen_archives');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse archives from localStorage", e);
            }
        }
        return [];
    });

    // Save to localStorage whenever archives change
    useEffect(() => {
        localStorage.setItem('mathgen_archives', JSON.stringify(archives));
    }, [archives]);

    const saveToArchive = useCallback((worksheet: Omit<ArchivedWorksheet, 'id' | 'date'>) => {
        const newArchive: ArchivedWorksheet = {
            ...worksheet,
            id: crypto.randomUUID(),
            date: new Date().toISOString()
        };
        setArchives(prev => [newArchive, ...prev]);
    }, []);

    const deleteFromArchive = useCallback((id: string) => {
        setArchives(prev => prev.filter(a => a.id !== id));
    }, []);

    const loadFromArchive = useCallback((id: string) => {
        return archives.find(a => a.id === id);
    }, [archives]);

    return (
        <ArchiveContext.Provider value={{ archives, saveToArchive, deleteFromArchive, loadFromArchive }}>
            {children}
        </ArchiveContext.Provider>
    );
};

export const useArchive = (): ArchiveContextType => {
    const context = useContext(ArchiveContext);
    if (!context) {
        throw new Error('useArchive must be used within an ArchiveProvider');
    }
    return context;
};
