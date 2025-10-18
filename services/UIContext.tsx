import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface UIContextType {
    activeTab: string;
    setActiveTab: (tabId: string) => void;
    isHowToUseVisible: boolean;
    showHowToUse: () => void;
    hideHowToUse: () => void;
    isContactVisible: boolean;
    showContact: () => void;
    hideContact: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState('arithmetic');
    const [isHowToUseVisible, setIsHowToUseVisible] = useState(false);
    const [isContactVisible, setIsContactVisible] = useState(false);

    const showHowToUse = useCallback(() => setIsHowToUseVisible(true), []);
    const hideHowToUse = useCallback(() => setIsHowToUseVisible(false), []);
    const showContact = useCallback(() => setIsContactVisible(true), []);
    const hideContact = useCallback(() => setIsContactVisible(false), []);

    return (
        <UIContext.Provider value={{
            activeTab,
            setActiveTab,
            isHowToUseVisible,
            showHowToUse,
            hideHowToUse,
            isContactVisible,
            showContact,
            hideContact,
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
