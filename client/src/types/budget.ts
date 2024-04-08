interface Budget {
  id: string;
  date: Date;
  category: string;
  limit: number;
  userId: string;
}

interface NewBudget extends Partial<Budget> {}

export type { Budget, NewBudget };
