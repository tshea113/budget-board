export interface Budget {
  id: string;
  date: Date;
  category: string;
  limit: number;
  userId: string;
}

export interface NewBudgetRequest {
  date: Date;
  category: string;
  limit: number;
}

export enum CashFlowValue {
  Positive,
  Neutral,
  Negative,
}
