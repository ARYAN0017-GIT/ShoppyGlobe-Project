import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing search input
 * @param {string} value - The search value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {string} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
