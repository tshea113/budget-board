import { Account } from './account';

interface Goal {
  id: string;
  name: string;
  completeDate: Date;
  amount: number;
  initialAmount: number;
  accounts: Account[];
  userID: string;
}

interface NewGoal extends Partial<Goal> {}

export type { Goal, NewGoal };
