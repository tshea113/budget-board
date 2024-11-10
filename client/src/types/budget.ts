export interface Budget {
  id: string;
  date: Date;
  category: string;
  limit: number;
  userId: string;
}

export interface NewBudget extends Partial<Budget> {}

export enum CashFlowValue {
  Positive,
  Neutral,
  Negative,
}
