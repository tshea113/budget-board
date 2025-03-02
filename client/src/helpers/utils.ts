/**
 * Checks if two strings are equal ignoring case.
 * @param string1 One string you wish to compare.
 * @param string2 Another string you wish to compare.
 * @returns true if the strings are equal, ignoring case, false otherwise.
 */
export const areStringsEqual = (string1: string, string2: string): boolean =>
  string1.toUpperCase() === string2.toUpperCase();
