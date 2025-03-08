import { CashFlowValue } from "@models/budget";

/**
 * Determines the cash flow value for a given date based on a monthly totals map.
 *
 * The function retrieves the monthly total (if any) for the specified date from
 * the provided map, then decides whether the result is positive, negative, or
 * neutral, returning the corresponding CashFlowValue enum.
 *
 * @param {Map<number, number>} timeToMonthlyTotalsMap - Map of timestamp to monthly totals.
 * @param {Date} date - The date used to look up the monthly total.
 * @returns {CashFlowValue} Indicates if the cash flow is Positive, Negative, or Neutral.
 */
export const getCashFlowValue = (
  timeToMonthlyTotalsMap: Map<number, number>,
  date: Date
): CashFlowValue => {
  const cashFlow = timeToMonthlyTotalsMap.get(date.getTime()) ?? 0;
  if (cashFlow > 0) {
    return CashFlowValue.Positive;
  } else if (cashFlow < 0) {
    return CashFlowValue.Negative;
  }
  return CashFlowValue.Neutral;
};
