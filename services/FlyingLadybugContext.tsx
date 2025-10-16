import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import FlyingLadybug from '../components/FlyingLadybug';

interface Ladybug {
    id: number;
    startX: number;
    startY: number;
}

interface FlyingLadybugContextType {
    spawnLadybug: (x: number, y: number) => void;
}

const FlyingLadybugContext = createContext<FlyingLadybugContextType | undefined>(undefined);

export const FlyingLadybugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ladybugs, setLadybugs] = useState<Ladybug[]>([]);
    
    const spawnLadybug = useCallback((x: number, y: number) => {
        const newLadybug = { id: Date.now() + Math.random(), startX: x, startY: y };
        setLadybugs(prev => [...prev, newLadybug]);
    }, []);

    const removeLadybug = useCallback((id: number) => {
        setLadybugs(prev => prev.filter(bug => bug.id !== id));
    }, []);

    return (
        <FlyingLadybugContext.Provider value={{ spawnLadybug }}>
            {children}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
                {ladybugs.map(bug => (
                    <FlyingLadybug
                        key={bug.id}
                        id={bug.id}
                        startX={bug.startX}
                        startY={bug.startY}
                        onEnded={removeLadybug}
                    />
                ))}
            </div>
        </FlyingLadybugContext.Provider>
    );
};

export const useFlyingLadybugs = (): FlyingLadybugContextType => {
    const context = useContext(FlyingLadybugContext);
    if (!context) {
        // This can be a silent-fail for components that don't need it.
        return { spawnLadybug: () => {} };
    }
    return context;
};
