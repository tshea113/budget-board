/**
 * Sums the values of a given tooltip object.
 * @param tooltipValues The tooltip payload object
 * @returns The sum of the tooltip values
 */
export const sumTooltipValues = (tooltipPayload: any): number => {
  let total = 0;

  Object.values(tooltipPayload).forEach((property) => {
    // We want to exclude any other values that are not numbers (like the date).
    if (typeof property === 'number') {
      total += property;
    }
  });

  return total;
};
