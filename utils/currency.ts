
/**
 * Currency formatting utilities for Kenyan Shillings (KES)
 */

/**
 * Format a number as Kenyan Shillings currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatKES = (
  amount: number,
  options: {
    showSymbol?: boolean;
    showDecimals?: boolean;
    compact?: boolean;
  } = {}
): string => {
  const {
    showSymbol = true,
    showDecimals = false,
    compact = false,
  } = options;

  // Handle compact formatting for large numbers
  if (compact && amount >= 1000000) {
    const millions = amount / 1000000;
    const formatted = millions.toFixed(1).replace(/\.0$/, '');
    return showSymbol ? `KES ${formatted}M` : `${formatted}M`;
  }

  if (compact && amount >= 1000) {
    const thousands = amount / 1000;
    const formatted = thousands.toFixed(1).replace(/\.0$/, '');
    return showSymbol ? `KES ${formatted}K` : `${formatted}K`;
  }

  // Standard formatting
  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  if (showSymbol) {
    return formatter.format(amount);
  } else {
    // Return just the number part without currency symbol
    return amount.toLocaleString('en-KE', {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    });
  }
};

/**
 * Format a number as KES with the "KES" prefix (legacy format)
 * @param amount - The amount to format
 * @returns Formatted currency string with KES prefix
 */
export const formatKESLegacy = (amount: number): string => {
  return `KES ${amount.toLocaleString()}`;
};

/**
 * Parse a currency string back to a number
 * @param currencyString - The currency string to parse
 * @returns The numeric value
 */
export const parseKES = (currencyString: string): number => {
  // Remove currency symbols and spaces, then parse
  const cleanString = currencyString
    .replace(/KES|Ksh|,|\s/g, '')
    .replace(/[^\d.-]/g, '');
  
  return parseFloat(cleanString) || 0;
};

/**
 * Calculate discount amount
 * @param originalPrice - Original price
 * @param discountPercent - Discount percentage
 * @returns Discount amount
 */
export const calculateDiscount = (originalPrice: number, discountPercent: number): number => {
  return Math.round(originalPrice * (discountPercent / 100));
};

/**
 * Calculate final price after discount
 * @param originalPrice - Original price
 * @param discountPercent - Discount percentage
 * @returns Final price after discount
 */
export const calculateDiscountedPrice = (originalPrice: number, discountPercent: number): number => {
  const discount = calculateDiscount(originalPrice, discountPercent);
  return originalPrice - discount;
};

/**
 * Calculate tax amount (16% VAT for Kenya)
 * @param amount - Amount to calculate tax on
 * @param taxRate - Tax rate (default 16% for Kenya VAT)
 * @returns Tax amount
 */
export const calculateTax = (amount: number, taxRate: number = 0.16): number => {
  return Math.round(amount * taxRate);
};

/**
 * Calculate shipping cost based on amount
 * @param amount - Order amount
 * @param freeShippingThreshold - Minimum amount for free shipping
 * @param standardShippingCost - Standard shipping cost
 * @returns Shipping cost
 */
export const calculateShipping = (
  amount: number,
  freeShippingThreshold: number = 6500,
  standardShippingCost: number = 500
): number => {
  return amount >= freeShippingThreshold ? 0 : standardShippingCost;
};
