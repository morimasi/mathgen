

// FIX: Import React to resolve the 'React.RefObject' type which caused the "Cannot find namespace 'React'" error.
import React from 'react';
import { PrintSettings, Problem } from '../types';

/**
 * Calculates the maximum number of problems that can fit onto the worksheet.
 * @param worksheetRef A React ref pointing to the main content container of the worksheet.
 * @param printSettings The current printing settings.
 * @param sampleProblem An optional sample problem object to get a more accurate height for certain types like word problems.
 * @returns The total number of problems that can fit on the page.
 */
export const calculateMaxProblems = (
    worksheetRef: React.RefObject<HTMLDivElement>,
    printSettings: PrintSettings,
    sampleProblem?: Partial<Problem>
): number => {
    const container = worksheetRef.current;
    if (!container) {
        return 0; // Cannot calculate if the container is not rendered
    }
    
    const remToPx = (rem: number) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

    // --- 1. Get Available Height ---
    const containerStyle = getComputedStyle(container);
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
    
    const availableHeight = containerHeight - occupiedHeight;

    // --- 2. Get Single Problem Height ---
    // Create a temporary, off-screen element to measure
    const problemList = container.querySelector('.problem-list') as HTMLElement;
    if (!problemList) return 0;

    const tempItem = document.createElement('div');
    tempItem.className = 'problem-item';
    tempItem.style.position = 'absolute';
    tempItem.style.visibility = 'hidden';
    tempItem.style.width = `${(problemList.clientWidth / printSettings.columns) - remToPx(printSettings.problemSpacing)}px`; // Approximate width

    const tempNumber = document.createElement('span');
    tempNumber.className = 'problem-number';
    tempNumber.textContent = '99.';
    
    const tempContent = document.createElement('div');
    tempContent.className = 'problem-content';

    // Use a representative sample content for measurement
    if (sampleProblem) {
        tempContent.innerHTML = sampleProblem.question || 'Örnek Soru';
    } else {
        tempContent.innerHTML = `
            <div style="display: inline-block; font-family: monospace; white-space: pre; text-align: right; line-height: 1.5rem; font-size: 1.25em;">
                <div>9999</div>
                <div>+9999</div>
                <hr style="width: 100%; border-top: 2px solid black; margin: 4px 0;">
            </div>`;
    }

    tempItem.appendChild(tempNumber);
    tempItem.appendChild(tempContent);
    
    // Apply relevant styles from printSettings
    tempItem.style.fontSize = `${printSettings.fontSize}px`;
    tempItem.style.lineHeight = String(printSettings.lineHeight);
    
    document.body.appendChild(tempItem);
    const problemHeight = tempItem.offsetHeight;
    document.body.removeChild(tempItem);

    const problemSpacing = remToPx(printSettings.problemSpacing);
    const totalProblemHeight = problemHeight + problemSpacing;

    if (totalProblemHeight <= 0) return 0;
    
    // --- 3. Calculate Final Count ---
    const problemsPerColumn = Math.floor(availableHeight / totalProblemHeight);
    const totalProblems = problemsPerColumn * printSettings.columns;

    // Return a slightly smaller number to be safe, especially for word problems
    const safetyMargin = (sampleProblem ? 0.95 : 1.0);

    return Math.max(1, Math.floor(totalProblems * safetyMargin));
};