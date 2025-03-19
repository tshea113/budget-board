/**
 * Converts a number to a formatted USD currency string.
 *
 * This function formats the provided number as a USD currency string using the Intl.NumberFormat API.
 * It allows including cents in the formatted output if specified.
 * Adding 0 to the number ensures that negative zero (-0) is avoided.
 *
 * @param {number} number - The numeric value to convert.
 * @param {boolean} [shouldIncludeCents] - Optional boolean flag to include cents in the output.
 * @returns {string} The number formatted as USD currency.
 */
export const convertNumberToCurrency = (
  number: number,
  shouldIncludeCents?: boolean
) => {
  // Adding 0 to avoid -0 for the output.
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: shouldIncludeCents ? 2 : 0,
    minimumFractionDigits: shouldIncludeCents ? 2 : 0,
  }).format(number + 0);
};
