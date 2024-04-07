import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const initMonth = (): Date => {
  const date = new Date();
  date.setDate(1);
  return date;
};

export const getProgress = (amount: number, total: number): number => {
  const percentage = (amount / total) * 100;
  if (percentage > 100) return 100;
  else return percentage;
};
