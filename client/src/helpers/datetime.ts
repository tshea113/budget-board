/**
 * Returns the number of days elapsed since the specified date, as a string.
 *
 * The function calculates the difference in milliseconds between the current date/time
 * and the provided date, divides by the number of milliseconds in a day,
 * rounds the result, and returns it as a string.
 *
 * @param {Date} date - The date from which to calculate the elapsed days.
 * @returns {string} The number of days since the provided date, in string format.
 */
export const getDaysSinceDate = (date: Date): string => {
  const differenceInMs = new Date().getTime() - new Date(date).getTime();
  const differenceInDays = Math.round(differenceInMs / (1000 * 3600 * 24));
  return differenceInDays.toString();
};
