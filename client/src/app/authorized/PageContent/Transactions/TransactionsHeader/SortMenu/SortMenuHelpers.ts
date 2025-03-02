export enum Sorts {
  Date,
  Merchant,
  Category,
  Amount,
}

export interface SortOption {
  value: Sorts;
  label: string;
}

export const SortOptions: SortOption[] = [
  {
    value: Sorts.Date,
    label: "Date",
  },
  {
    value: Sorts.Merchant,
    label: "Merchant",
  },
  {
    value: Sorts.Category,
    label: "Category",
  },
  {
    value: Sorts.Amount,
    label: "Amount",
  },
];
