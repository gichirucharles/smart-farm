/**
 * Currency utility for Kenyan Shilling (KSH) formatting
 * Used throughout the ShuleVerse system for consistent currency display
 */

export const CURRENCY_CODE = 'KES'
export const CURRENCY_SYMBOL = 'KSh'
export const CURRENCY_NAME = 'Kenyan Shilling'

/**
 * Format amount to KSH currency string
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the KSh symbol (default: true)
 * @param decimals - Number of decimal places (default: 0 for KSH)
 * @returns Formatted currency string
 */
export function formatKSH(amount: number, showSymbol = true, decimals = 0): string {
  if (!amount && amount !== 0) return showSymbol ? `${CURRENCY_SYMBOL} 0` : '0'

  const formatted = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: CURRENCY_CODE,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)

  if (!showSymbol) {
    // Remove the currency symbol from the formatted string
    return formatted.replace(/^KES\s/, '').replace(/^Ksh\s/, '')
  }

  // Replace KES with KSh for consistency
  return formatted.replace('KES', CURRENCY_SYMBOL)
}

/**
 * Parse KSH string to number
 * @param value - The currency string to parse
 * @returns The numeric value
 */
export function parseKSH(value: string): number {
  if (!value) return 0
  // Remove currency symbol and commas
  const cleaned = value.replace(/[^0-9.-]/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Format amount for display in financial tables
 * @param amount - The amount to format
 * @returns Formatted string
 */
export function formatFinancial(amount: number): string {
  return formatKSH(amount, true, 2)
}

/**
 * Format amount for budget display
 * @param amount - The amount to format
 * @returns Formatted string without decimals
 */
export function formatBudget(amount: number): string {
  return formatKSH(amount, true, 0)
}

/**
 * Convert KSH to other currencies (for reference only)
 * Note: Use actual exchange rates from a service for real conversions
 */
export const EXCHANGE_RATES = {
  USD: 0.0078, // 1 KSH = 0.0078 USD (example rate)
  EUR: 0.0072, // 1 KSH = 0.0072 EUR (example rate)
  GBP: 0.0062, // 1 KSH = 0.0062 GBP (example rate)
}

/**
 * Calculate percentage of an amount
 * @param amount - Base amount
 * @param percentage - Percentage to calculate
 * @returns The calculated amount
 */
export function calculatePercentage(amount: number, percentage: number): number {
  return (amount * percentage) / 100
}

/**
 * Add KSH amounts safely
 */
export function addKSH(...amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + (amount || 0), 0)
}

/**
 * Subtract KSH amounts
 */
export function subtractKSH(from: number, ...amounts: number[]): number {
  return from - amounts.reduce((sum, amount) => sum + (amount || 0), 0)
}

/**
 * Calculate average of KSH amounts
 */
export function averageKSH(...amounts: number[]): number {
  if (amounts.length === 0) return 0
  return addKSH(...amounts) / amounts.length
}
