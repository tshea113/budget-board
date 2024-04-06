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
