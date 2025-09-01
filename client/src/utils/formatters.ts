/**
 * Formats a number to a compact representation
 * Examples: 1, 10, 100, 1k, 10k, 100k, 1m, 1.5m, etc.
 */
export const formatCompactNumber = (num: number): string => {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 1000000) {
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}k` : `${thousands.toFixed(1)}k`;
  }

  if (num < 1000000000) {
    const millions = num / 1000000;
    return millions % 1 === 0 ? `${millions}m` : `${millions.toFixed(1)}m`;
  }

  const billions = num / 1000000000;
  return billions % 1 === 0 ? `${billions}b` : `${billions.toFixed(1)}b`;
};

/**
 * Converts price from database format (stored as integer with 2 decimal places)
 * to display format (decimal number)
 * Example: 10099 -> 100.99
 */
export const convertDbPriceToDisplay = (dbPrice: number | string): number => {
  const numPrice = typeof dbPrice === "string" ? parseFloat(dbPrice) : dbPrice;
  return numPrice / 100;
};

/**
 * Converts price from display format (decimal number) to database format
 * (integer with 2 decimal places)
 * Example: 100.99 -> 10099
 */
export const convertDisplayPriceToDb = (
  displayPrice: number | string,
): number => {
  const numPrice =
    typeof displayPrice === "string" ? parseFloat(displayPrice) : displayPrice;
  return Math.round(numPrice * 100);
};

/**
 * Formats a price for display with proper decimal places
 * Example: 100.99 -> "$100.99"
 */
export const formatPrice = (
  price: number | string,
  showCurrency: boolean = true,
): string => {
  const displayPrice = convertDbPriceToDisplay(price);
  const formatted = displayPrice.toFixed(2);
  return showCurrency ? `$${formatted}` : formatted;
};

/**
 * Formats a compact price for display
 * Example: 10099 -> "$101k" (if the number is large enough)
 */
export const formatCompactPrice = (
  price: number | string,
  showCurrency: boolean = true,
): string => {
  const displayPrice = convertDbPriceToDisplay(price);
  const compact = formatCompactNumber(displayPrice);
  return showCurrency ? `$${compact}` : compact;
};

/**
 * Calculates total revenue from orders with proper price conversion
 */
export const calculateTotalRevenue = (
  orders: Array<{ ORDERPRICE: number | string }>,
): number => {
  return orders.reduce((sum, order) => {
    const displayPrice = convertDbPriceToDisplay(order.ORDERPRICE);
    return sum + displayPrice;
  }, 0);
};

/**
 * Calculates average order value
 */
export const calculateAverageOrderValue = (
  orders: Array<{ ORDERPRICE: number | string }>,
): number => {
  if (orders.length === 0) return 0;
  return calculateTotalRevenue(orders) / orders.length;
};
