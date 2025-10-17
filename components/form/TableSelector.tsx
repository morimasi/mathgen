import React, { useState } from 'react';

interface TableSelectorProps {
    rows: number;
    cols: number;
    onSelect: (rows: number, cols: number) => void;
}

const MAX_GRID_SIZE = 10;

const TableSelector: React.FC<TableSelectorProps> = ({ rows, cols, onSelect }) => {
    const [hoveredCell, setHoveredCell] = useState<{ r: number, c: number } | null>(null);

    const handleMouseEnter = (r: number, c: number) => {
        setHoveredCell({ r, c });
    };

    const handleMouseLeave = () => {
        setHoveredCell(null);
    };

    const handleClick = () => {
        if (hoveredCell) {
            onSelect(hoveredCell.r, hoveredCell.c);
        }
    };
    
    const displayRows = hoveredCell ? hoveredCell.r : rows;
    const displayCols = hoveredCell ? hoveredCell.c : cols;

    return (
        <div>
            <div 
                className="table-selector-grid"
                onMouseLeave={handleMouseLeave}
                onClick={handleClick} // Click on the whole grid confirms selection
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
                            />
                        );
                    })
                )}
            </div>
            <div className="text-center text-sm mt-2 text-stone-600 dark:text-stone-400">
                {displayRows > 0 && displayCols > 0 ? `${displayRows} x ${displayCols} Tablo` : "Bir tablo boyutu seçin"}
            </div>
        </div>
    );
};

export default TableSelector;