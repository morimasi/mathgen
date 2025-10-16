import React, { useState, useEffect } from 'react';

interface TableSelectorProps {
    rows: number;
    cols: number;
    onSelect: (rows: number, cols: number) => void;
    isVisible: boolean;
}

const MAX_GRID_SIZE = 10;

const TableSelector: React.FC<TableSelectorProps> = ({ rows, cols, onSelect, isVisible }) => {
    const [isSelectionLocked, setIsSelectionLocked] = useState(false);
    const [hoveredCell, setHoveredCell] = useState<{ r: number, c: number } | null>(null);

    // Canlı önizleme kilidini, panel yeniden görünür olduğunda sıfırla
    useEffect(() => {
        if (isVisible) {
            setIsSelectionLocked(false);
        }
    }, [isVisible]);

    const handleMouseEnter = (r: number, c: number) => {
        setHoveredCell({ r, c });
        if (!isSelectionLocked) {
            onSelect(r, c);
        }
    };

    const handleMouseLeave = () => {
        setHoveredCell(null);
    };

    const handleClick = (r: number, c: number) => {
        // Kilitli değilse, son bir kez seçimi güncelle (dokunmatik cihazlar için önemli)
        if (!isSelectionLocked) {
            onSelect(r, c);
        }
        // Seçimi kilitle
        setIsSelectionLocked(true);
    };
    
    // Vurgulama için hangi boyutların kullanılacağını belirle:
    // Eğer fare ızgara üzerindeyse, `hoveredCell` durumunu kullan.
    // Değilse, prop'lardan gelen resmi (kilitlenmiş) durumu kullan.
    const displayRows = hoveredCell ? hoveredCell.r : rows;
    const displayCols = hoveredCell ? hoveredCell.c : cols;

    return (
        <div>
            <div 
                className="table-selector-grid"
                onMouseLeave={handleMouseLeave}
            >
                {Array.from({ length: MAX_GRID_SIZE }).map((_, r) =>
                    Array.from({ length: MAX_GRID_SIZE }).map((_, c) => {
                        const rowIndex = r + 1;
                        const colIndex = c + 1;
                        
                        let cellClass = 'table-selector-cell';
                        if (rowIndex <= displayRows && colIndex <= displayCols) {
                            cellClass += ' selected';
                        }

                        return (
                            <div
                                key={`${r}-${c}`}
                                className={cellClass}
                                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                onClick={() => handleClick(rowIndex, colIndex)}
                            />
                        );
                    })
                )}
            </div>
            <div className="text-center text-sm mt-2 text-stone-600 dark:text-stone-400">
                {rows > 0 && cols > 0 ? `${rows} x ${cols} Tablo` : "Bir tablo boyutu seçin"}
            </div>
        </div>
    );
};

export default TableSelector;