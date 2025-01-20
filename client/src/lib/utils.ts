import { useTheme } from '@/components/theme-provider';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const DATE = 1;
const HOUR = 12;
const MINUTES = 0;
const SECONDS = 0;
const MILLISECONDS = 0;

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

/**
 * Returns the percent progress of the provided amount.
 * @param amount The amount of progress made.
 * @param total The target amount.
 * @returns The percent progress.
 */
export const getProgress = (amount: number, total: number): number => {
  const percentage = (amount / total) * 100;
  if (percentage > 100) return 100;
  else return percentage;
};

/**
 * Checks if the provided date is in the provided array.
 * @param date Date you are checking whether is in the array.
 * @param datesArray Array to search for the provided date.
 * @returns true if the date exists in the array, false otherwise.
 */
export const isInArray = (date: Date, datesArray: Date[]): boolean =>
  !!datesArray.find((item) => item.getTime() == date.getTime());

/**
 * Checks if two strings are equal ignoring case.
 * @param string1 One string you wish to compare.
 * @param string2 Another string you wish to compare.
 * @returns true if the strings are equal, ignoring case, false otherwise.
 */
export const areStringsEqual = (string1: string, string2: string): boolean =>
  string1.toUpperCase() === string2.toUpperCase();

/**
 * Converts a number to a formatted currency string
 * @param number Number to be converted to a currency string
 * @param shouldIncludeCents Boolean to specify whether cents should be included in the currency string
 * @returns A formatted currency string
 */
export const convertNumberToCurrency = (number: number, shouldIncludeCents?: boolean) => {
  // Adding 0 to avoid -0 for the output.
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: shouldIncludeCents ? 2 : 0,
    minimumFractionDigits: shouldIncludeCents ? 2 : 0,
  }).format(number + 0);
};

/**
 * Creates a Date object for the current month.
 * @returns A date object set to noon of the first day of the current month.
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
 * Returns a Date object from a specified number of months ago.
 * @param numberOfMonthsAgo The number of months ago.
 * @param date The starting date (optional)
 * @returns A Date object containing the calculated month and year.
 */
export const getDateFromMonthsAgo = (numberOfMonthsAgo: number, date?: Date): Date => {
  const lastMonth = date ? new Date(date) : initCurrentMonth();

  lastMonth.setMonth(lastMonth.getMonth() - numberOfMonthsAgo);

  return lastMonth;
};

/**
 * Returns the number of months until the provided date.
 * @param date The target date.
 * @returns The number of months.
 */
export const getMonthsUntilDate = (date: Date): number => {
  const today = new Date();
  const target = new Date(date);
  return (
    target.getMonth() -
    today.getMonth() +
    12 * (target.getFullYear() - today.getFullYear())
  );
};

/**
 * Returns the number of days since the provided date.
 * @param date The target date.
 * @returns The number of days.
 */
export const getDaysSinceDate = (date: Date): string => {
  const differenceInMs = new Date().getTime() - new Date(date).getTime();
  const differenceInDays = Math.round(differenceInMs / (1000 * 3600 * 24));
  return differenceInDays.toString();
};

/**
 * Creates a date string containing the month and year.
 * @param date The date for the date string.
 * @returns A string containing the month and year of the provided date.
 */
export const getMonthAndYearDateString = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

/**
 * Gets the number of days in the provided month and year.
 * @param month Number month of the year
 * @param year Full year
 * @returns The number of days in the month.
 */
export const getDaysInMonth = (month: number, year: number): number =>
  new Date(year, month, 0).getDate();

/**
 * Creates a date that has standard values for the time.
 * @param date The date-time you wish to convert to standardized date.
 * @returns The specified date with a time of 12:00:00:00.
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
 * Returns the unqiue dates within the specified range.
 * @param dates Array of dates to filter
 * @param startDate Start date of the range
 * @param endDate End date of the range
 * @returns A list of unqiue dates within the specified range.
 */
export const getUniqueDatesInRange = (
  dates: Date[],
  startDate: Date,
  endDate: Date
): Date[] =>
  dates.filter((date, index, array) => {
    // Check whether the value is unique and within the specified dates.
    return (
      array.findIndex((d) => d.getTime() === date.getTime()) === index &&
      date >= startDate &&
      date <= endDate
    );
  });

/**
 * Returns a list of years from the provided list of dates.
 * @param dates A list of dates
 * @returns The unique years from the list of dates
 */
export const getUniqueYears = (dates: Date[]): number[] =>
  Array.from(new Set(dates.map((date) => date.getFullYear())));

/**
 * Gets whether the current theme is dark mode.
 * @returns A boolean indicating whether the current theme is dark mode.
 */
export const getIsDarkMode = (): boolean => {
  const { theme } = useTheme();
  if (theme === 'dark') return true;
  else if (theme === 'light') return false;
  else return window.matchMedia('(prefers-color-scheme: dark)').matches;
};
