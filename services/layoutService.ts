import React from 'react';
import { PrintSettings, Problem } from '../types';

/**
 * Calculates the maximum number of problems that can fit onto the worksheet.
 * @param pageElementRef A React ref pointing to the main content container of the worksheet.
 * @param printSettings The current printing settings.
 * @param sampleProblem An optional sample problem object to get a more accurate height for certain types like word problems.
 * @returns The total number of problems that can fit on the page.
 */
export const calculateMaxProblems = (
    pageElementRef: React.RefObject<HTMLDivElement>,
    printSettings: PrintSettings,
    sampleProblem?: Partial<Problem>
): number => {
    const container = pageElementRef.current;
    if (!container) {
        return 0; // Cannot calculate if the container is not rendered
    }
    
    const remToPx = (rem: number) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

    // --- 1. Get Available Height ---
    const containerHeight = container.clientHeight;
    
    let occupiedHeight = 0;
    
    // Account for header
    if (printSettings.showHeader) {
        const headerEl = container.querySelector('.worksheet-header') as HTMLElement;
        if (headerEl) {
            const headerStyle = getComputedStyle(headerEl);
            occupiedHeight += headerEl.offsetHeight + parseFloat(headerStyle.marginBottom);
        }
    }
    
    // Account for title
    const titleEl = container.querySelector('h3') as HTMLElement;
    if (titleEl) {
        const titleStyle = getComputedStyle(titleEl);
        occupiedHeight += titleEl.offsetHeight + parseFloat(titleStyle.marginBottom);
    }

    const preambleEl = container.querySelector('.worksheet-preamble') as HTMLElement;
    if (preambleEl) {
        const preambleStyle = getComputedStyle(preambleEl);
        occupiedHeight += preambleEl.offsetHeight + parseFloat(preambleStyle.marginBottom);
    }
    
    const availableHeight = containerHeight - occupiedHeight;

    // --- 2. Get Single Problem Height ---
    // Create a temporary, off-screen element to measure
    const problemList = container.querySelector('.problem-list') as HTMLElement;
    if (!problemList) return 0;

    const tempItem = document.createElement('div');
    tempItem.className = 'problem-item'; // Use the same class as real problems
    // Style it to be invisible but measurable
    tempItem.style.position = 'absolute';
    tempItem.style.visibility = 'hidden';
    tempItem.style.left = '-9999px';
    // The width should be constrained by the number of columns
    tempItem.style.width = `calc((100% - ${remToPx(printSettings.columnGap) * (printSettings.columns - 1)}px) / ${printSettings.columns})`;
    tempItem.innerHTML = sampleProblem?.question || '<div>Test Problem</div><div>Answer line</div>'; // Use sample or a generic placeholder

    problemList.appendChild(tempItem);
    
    const problemStyle = getComputedStyle(tempItem);
    const problemHeight = tempItem.offsetHeight + parseFloat(problemStyle.marginTop) + parseFloat(problemStyle.marginBottom);

    problemList.removeChild(tempItem);

    if (problemHeight <= 0) {
        return 20; // Fallback if measurement fails
    }

    // --- 3. Calculate how many fit ---
    const spacing = remToPx(printSettings.problemSpacing);
    const problemsPerColumn = Math.floor((availableHeight + spacing) / (problemHeight + spacing));
    
    const totalProblems = problemsPerColumn * printSettings.columns;

    // A safety check to avoid infinite loops or ridiculously high numbers
    if (!isFinite(totalProblems) || totalProblems > 200) {
        return 20; 
    }

    return Math.max(1, totalProblems);
};
