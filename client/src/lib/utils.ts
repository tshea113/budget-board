import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const getProgress = (amount: number, total: number): number => {
  const percentage = (amount / total) * 100;
  if (percentage > 100) return 100;
  else return percentage;
};

export const getDaysSinceDeleted = (date: Date): string => {
  const differenceInMs = new Date().getTime() - new Date(date).getTime();
  const differenceInDays = Math.round(differenceInMs / (1000 * 3600 * 24));
  return differenceInDays.toString();
};

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
 * Converts a number to a formatted currency string
 * @param number Number to be converted to a currency string
 * @param shouldIncludeCents Boolean to specify whether cents should be included in the currency string
 * @returns A formatted currency string
 */
export const convertNumberToCurrency = (number: number, shouldIncludeCents?: boolean) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: shouldIncludeCents ? 2 : 0,
    minimumFractionDigits: shouldIncludeCents ? 2 : 0,
  }).format(number);
};

/**
 * Creates a Date object for the current month.
 * @returns A date object set to noon of the first day of the current month.
 */
export const initCurrentMonth = (): Date => {
  const date = new Date();

  // We only really care about the month and year here, so we need to set
  // a consistent time for the rest.
  date.setDate(1);
  date.setHours(12);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

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
 * Checks if two strings are equal ignoring case.
 * @param string1 One string you wish to compare.
 * @param string2 Another string you wish to compare.
 * @returns true if the strings are equal, ignoring case,  false otherwise.
 */
export const areStringsEqual = (string1: string, string2: string): boolean =>
  string1.localeCompare(string2, undefined, { sensitivity: 'base' }) === 0;
