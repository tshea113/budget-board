import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const initMonth = (): Date => {
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

export const ConvertNumberToCurrency = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(number);
};
