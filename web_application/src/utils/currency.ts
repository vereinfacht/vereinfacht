/**
 * Currency formatting utilities
 */

/**
 * Formats a number as currency in EUR with German formatting
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting (defaults to 'de-DE')
 * @returns Formatted currency string
 */
export function formatCurrency(
    amount: number | undefined,
    locale: string = 'de-DE',
): string {
    if (amount === undefined || amount === null) return '€0,00';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
    }).format(amount);
}
