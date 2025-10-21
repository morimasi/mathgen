import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UIContextType {
    activeTab: string;
    setActiveTab: (tabId: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // FIX: Default active tab changed to 'customization-center' for a better initial user experience.
    const [activeTab, setActiveTab] = useState('customization-center'); 

    return (
        <UIContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = (): UIContextType => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
