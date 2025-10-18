import { PrintSettings } from '../types';

// A helper function to get computed style with a fallback for Jest/JSDOM environment
const getComputedStyleWithFallback = (element: Element, pseudoElt?: string | null): CSSStyleDeclaration => {
    if (typeof window.getComputedStyle === 'function') {
        return window.getComputedStyle(element, pseudoElt);
    }
    // Fallback for environments without getComputedStyle (like JSDOM in tests)
    return {
        // Provide reasonable defaults or mocks for properties you use
        getPropertyValue: (prop: string) => {
            switch (prop) {
                case 'margin-top': return '16px';
                case 'margin-bottom': return '16px';
                case 'height': return '100px';
                default: return '';
            }
        },
    } as unknown as CSSStyleDeclaration;
};


export const calculateMaxProblems = (
    contentRef: React.RefObject<HTMLDivElement>, 
    printSettings: PrintSettings
): number => {
    if (!contentRef.current) {
        return 20; // Default fallback
    }

    const container = contentRef.current;
    
    // Create a dummy problem to measure
    const dummyProblem = document.createElement('div');
    dummyProblem.className = 'problem-item'; // Assume problems have this class
    dummyProblem.style.visibility = 'hidden';
    dummyProblem.style.position = 'absolute';
    dummyProblem.innerHTML = '<div>Dummy</div>'; // Some content
    container.appendChild(dummyProblem);

    const problemStyle = getComputedStyleWithFallback(dummyProblem);
    const problemHeight = dummyProblem.offsetHeight;
    const marginTop = parseFloat(problemStyle.getPropertyValue('margin-top') || '0');
    const marginBottom = parseFloat(problemStyle.getPropertyValue('margin-bottom') || '0');
    const totalProblemHeight = problemHeight + marginTop + marginBottom;
    
    container.removeChild(dummyProblem);

    if (totalProblemHeight <= 0) {
        return 20; // Another fallback if measurement fails
    }

    const containerHeight = container.clientHeight;
    // FIX: Problem spacing is in `rem`, need to convert to px for calculation.
    // Approximate 1rem = 16px. This is not perfect but better than nothing.
    const problemSpacingPx = printSettings.problemSpacing * 16;
    const problemsPerColumn = Math.floor(containerHeight / (totalProblemHeight + problemSpacingPx));
    
    // Assuming columns are managed by CSS, we calculate based on total available vertical space
    const totalProblems = problemsPerColumn * printSettings.columns;

    // Return a sane number, not Infinity or 0
    return Math.max(1, totalProblems || 20);
};
