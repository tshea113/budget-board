// const DATE = 1;
const HOUR = 12;
const MINUTES = 0;
const SECONDS = 0;
const MILLISECONDS = 0;

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

/**
 * Creates and returns a new Date object, with the time set to specific default values.
 *
 * The function clones the provided Date object, then adjusts its hours, minutes,
 * seconds, and milliseconds to the predefined values: 12:00:00.000.
 *
 * @param {Date} date - The original date object to standardize.
 * @returns {Date} A new date object with standard time set.
 */
export const getStandardDate = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(HOUR);
  newDate.setMinutes(MINUTES);
  newDate.setSeconds(SECONDS);
  newDate.setMilliseconds(MILLISECONDS);
  return newDate;
};
