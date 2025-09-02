/**
 * Formats a number to a compact representation with decimal precision
 * Examples: 999 -> "999", 1000 -> "1.00k", 109990 -> "109.99k"
 */
export const formatCompactNumber = (num: number): string => {
  if (num < 1000) {
    return num.toString();
  }

  const units = [
    { value: 1e9, suffix: "b" },
    { value: 1e6, suffix: "m" },
    { value: 1e3, suffix: "k" },
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      const compact = num / unit.value;
      return `${compact.toFixed(2)}${unit.suffix}`;
    }
  }

  return num.toString(); // fallback
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
  const revenue = orders.reduce((sum, order) => {
    const displayPrice = Number(order.ORDERPRICE);
    return sum + displayPrice;
  }, 0);
  console.log({ revenue });
  console.log({ formatted: formatCompactPrice(revenue) });
  return revenue;
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
