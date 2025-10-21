import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UIContextType {
    activeTab: string;
    setActiveTab: (tabId: string) => void;
    isCustomizationCenterVisible: boolean;
    openCustomizationCenter: () => void;
    closeCustomizationCenter: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState('matching-and-sorting'); 
    const [isCustomizationCenterVisible, setCustomizationCenterVisible] = useState(false);

    const openCustomizationCenter = () => setCustomizationCenterVisible(true);
    const closeCustomizationCenter = () => setCustomizationCenterVisible(false);

    return (
        <UIContext.Provider value={{ 
            activeTab, 
            setActiveTab, 
            isCustomizationCenterVisible, 
            openCustomizationCenter, 
            closeCustomizationCenter 
        }}>
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