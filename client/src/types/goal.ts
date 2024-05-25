import { Account } from './account';

interface Goal {
  id: string;
  name: string;
  completeDate: Date;
  amount: number;
  initialAmount: number;
  monthlyContribution: number;
  accounts: Account[];
  userID: string;
}

interface NewGoal extends Partial<Goal> {
  accountIds: string[];
}

enum GoalType {
  TimedGoal = 'timedGoal',
  MonthlyGoal = 'monthlyGoal',
}

export type { Goal, NewGoal };
export { GoalType };
