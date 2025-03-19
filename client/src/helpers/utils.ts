/**
 * Checks if two strings are equal ignoring case.
 *
 * @param {string} string1 - The first string to compare.
 * @param {string} string2 - The second string to compare.
 * @returns {boolean} True if the strings are equal (ignoring case), false otherwise.
 */
export const areStringsEqual = (string1: string, string2: string): boolean =>
  string1.toUpperCase() === string2.toUpperCase();

/**
 * Calculates the progress percentage of an amount towards a total.
 *
 * @param {number} amount - The current amount achieved.
 * @param {number} total - The total goal amount.
 * @returns {number} The progress as a percentage, capped at 100 if exceeded.
 */
export const getProgress = (amount: number, total: number): number => {
  const percentage = (amount / total) * 100;
  return percentage > 100 ? 100 : percentage;
};

/**
 * Returns the full name of a month given its index.
 */
export const months = [...Array(12).keys()].map((key) =>
  new Date(0, key).toLocaleString("en", { month: "long" })
);
