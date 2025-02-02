export interface IBudgetCreateRequest {
  date: Date;
  category: string;
  limit: number;
}

export interface IBudgetUpdateRequest {
  id: string;
  limit: number;
}

export interface IBudget {
  id: string;
  date: Date;
  category: string;
  limit: number;
  userId: string;
}

export enum CashFlowValue {
  Positive,
  Neutral,
  Negative,
}
