import React, { useState } from 'react';

interface TableSelectorProps {
    rows: number;
    cols: number;
    onSelect: (rows: number, cols: number) => void;
}

const MAX_GRID_SIZE = 10;

const TableSelector: React.FC<TableSelectorProps> = ({ rows, cols, onSelect }) => {
    const [hoverState, setHoverState] = useState({ rows: 0, cols: 0 });

    const handleSelect = (r: number, c: number) => {
        onSelect(r, c);
    };

    const displayRows = hoverState.rows > 0 ? hoverState.rows : rows;
    const displayCols = hoverState.cols > 0 ? hoverState.cols : cols;

    return (
        <div>
            <div 
                className="table-selector-grid"
                onMouseLeave={() => setHoverState({ rows: 0, cols: 0 })}
            >
                {Array.from({ length: MAX_GRID_SIZE }).map((_, r) =>
                    Array.from({ length: MAX_GRID_SIZE }).map((_, c) => {
                        const rowIndex = r + 1;
                        const colIndex = c + 1;
                        let cellClass = 'table-selector-cell';
                        if (rowIndex <= displayRows && colIndex <= displayCols) {
                            cellClass += ' hovered';
                        }
                         if (rowIndex <= rows && colIndex <= cols) {
                             cellClass += ' selected';
                        }

                        return (
                            <div
                                key={`${r}-${c}`}
                                className={cellClass}
                                onMouseEnter={() => setHoverState({ rows: rowIndex, cols: colIndex })}
                                onClick={() => handleSelect(rowIndex, colIndex)}
                            />
                        );
                    })
                )}
            </div>
            <div className="text-center text-sm mt-2 text-stone-600 dark:text-stone-400">
                {displayRows > 0 ? `${displayRows} x ${displayCols} Tablo` : "Bir tablo boyutu seçin"}
            </div>
        </div>
    );
};

export default TableSelector;