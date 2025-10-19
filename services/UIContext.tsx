import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

type TabId = string;
type AppMode = 'worksheet' | 'assignmentCreation';

interface UIContextType {
    activeTab: TabId;
    setActiveTab: (tabId: TabId) => void;
    appMode: AppMode;
    setAppMode: (mode: AppMode) => void;
    isPrintSettingsVisible: boolean;
    openPrintSettings: () => void;
    closePrintSettings: () => void;
    isHowToUseVisible: boolean;
    openHowToUse: () => void;
    closeHowToUse: () => void;
    isContactModalVisible: boolean;
    openContactModal: () => void;
    closeContactModal: () => void;
    isFavoritesPanelVisible: boolean;
    openFavoritesPanel: () => void;
    closeFavoritesPanel: () => void;
    isSettingsPanelCollapsed: boolean;
    setIsSettingsPanelCollapsed: (collapsed: boolean) => void;
    isTeacherPanelVisible: boolean;
    openTeacherPanel: () => void;
    closeTeacherPanel: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState('matching-and-sorting');
    const [appMode, setAppMode] = useState<AppMode>('worksheet');
    const [isPrintSettingsVisible, setPrintSettingsVisible] = useState(false);
    const [isHowToUseVisible, setHowToUseVisible] = useState(false);
    const [isContactModalVisible, setContactModalVisible] = useState(false);
    const [isFavoritesPanelVisible, setFavoritesPanelVisible] = useState(false);
    const [isSettingsPanelCollapsed, setIsSettingsPanelCollapsed] = useState(window.innerWidth < 768); // Collapse on mobile by default
    const [isTeacherPanelVisible, setTeacherPanelVisible] = useState(false);

    const openPrintSettings = useCallback(() => setPrintSettingsVisible(true), []);
    const closePrintSettings = useCallback(() => setPrintSettingsVisible(false), []);
    const openHowToUse = useCallback(() => setHowToUseVisible(true), []);
    const closeHowToUse = useCallback(() => setHowToUseVisible(false), []);
    const openContactModal = useCallback(() => setContactModalVisible(true), []);
    const closeContactModal = useCallback(() => setContactModalVisible(false), []);
    const openFavoritesPanel = useCallback(() => setFavoritesPanelVisible(true), []);
    const closeFavoritesPanel = useCallback(() => setFavoritesPanelVisible(false), []);
    const openTeacherPanel = useCallback(() => setTeacherPanelVisible(true), []);
    const closeTeacherPanel = useCallback(() => setTeacherPanelVisible(false), []);

    return (
        <UIContext.Provider value={{
            activeTab, setActiveTab,
            appMode, setAppMode,
            isPrintSettingsVisible, openPrintSettings, closePrintSettings,
            isHowToUseVisible, openHowToUse, closeHowToUse,
            isContactModalVisible, openContactModal, closeContactModal,
            isFavoritesPanelVisible, openFavoritesPanel, closeFavoritesPanel,
            isSettingsPanelCollapsed, setIsSettingsPanelCollapsed,
            isTeacherPanelVisible, openTeacherPanel, closeTeacherPanel
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