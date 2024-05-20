interface Goal {
  id: string;
  name: string;
  completeDate: Date;
  amount: number;
  initialAmount: number;
  accountID: string;
  userID: string;
}

interface NewGoal extends Partial<Goal> {}

export type { Goal, NewGoal };
