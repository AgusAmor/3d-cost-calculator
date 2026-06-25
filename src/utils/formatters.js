/**
 * Format a number as currency (Argentine Peso / Spanish-friendly default).
 * E.g., 18000 -> "$ 18.000,00"
 * 
 * @param {number} value - Numeric value to format.
 */
export function formatCurrency(value) {
  if (value === undefined || value === null || isNaN(value)) {
    return "$ 0,00";
  }
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format minutes into readable hours and minutes duration.
 * E.g., 142 -> "2h 22m"
 * 
 * @param {number} totalMinutes - Total minutes.
 */
export function formatDuration(totalMinutes) {
  if (!totalMinutes || isNaN(totalMinutes) || totalMinutes < 0) {
    return "0h 00m";
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}
