/**
 * Currency utilities for handling USD formatting
 */

/**
 * Format price in USD
 * @param {number} amount - Amount in USD
 * @returns {string} Formatted amount in USD currency format (e.g., $123.45)
 */
export const formatPrice = (amount) => {
    // Handle null, undefined, or NaN
    if (!amount && amount !== 0) return '$0.00';
    
    // Ensure amount is a number
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return '$0.00';
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numAmount);
};
