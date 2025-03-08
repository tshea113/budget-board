const DATE = 1;
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

/**
 * Initializes the current month by setting the date to 1, and time to 12:00:00.000.
 *
 * The function creates a new Date object for the current time, then standardizes
 * it to maintain consistency for month-based calculations.
 *
 * @returns {Date} A standardized Date object set to the first day of the current month.
 */
export const initCurrentMonth = (): Date => {
  const date = new Date();

  // We only really care about the month and year here, so we need to set
  // a consistent time for the rest.
  date.setDate(DATE);
  date.setHours(HOUR);
  date.setMinutes(MINUTES);
  date.setSeconds(SECONDS);
  date.setMilliseconds(MILLISECONDS);

  return date;
};

/**
 * Returns a standardized Date object from a specified number of months ago.
 *
 * The function calculates a Date object by subtracting the desired number of
 * months from the supplied date, or from the current month's standardized
 * date if no date is provided. It retains the same day and ensures consistent
 * time fields (12:00:00.000).
 *
 * @param {number} numberOfMonthsAgo - How many months in the past to go.
 * @param {Date} [date] - Optional starting date. If not provided, uses initCurrentMonth().
 * @returns {Date} A new Date object, shifted the specified number of months in the past.
 */
export const getDateFromMonthsAgo = (
  numberOfMonthsAgo: number,
  date?: Date
): Date => {
  const lastMonth = date ? new Date(date) : initCurrentMonth();

  lastMonth.setMonth(lastMonth.getMonth() - numberOfMonthsAgo);

  return lastMonth;
};

/**
 * Returns an array of unique years from an array of Date objects.
 *
 * The function maps the years from the provided dates array, then creates a new
 * Set to remove duplicates. Finally, it converts the Set back to an array.
 *
 * @param {Date[]} dates - Array of Date objects from which to extract years.
 * @returns {number[]} An array containing the unique years from the provided dates.
 */
export const getUniqueYears = (dates: Date[]): number[] =>
  Array.from(new Set(dates.map((date) => date.getFullYear())));

/**
 * Returns the total number of days in a specified month and year.
 *
 * @param {number} month - The month (1-12).
 * @param {number} year - The full year (e.g., 2023).
 * @returns {number} The number of days in the given month of that year.
 */
export const getDaysInMonth = (month: number, year: number): number =>
  new Date(year, month, 0).getDate();

/**
 * Returns a localized month and year string for the provided date.
 *
 * @param {Date} date - The date to format.
 * @returns {string} The formatted month and year string.
 */
export const getMonthAndYearDateString = (date: Date): string => {
  return date.toLocaleString("default", { month: "long", year: "numeric" });
};
