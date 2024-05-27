import { Account } from './account';

interface Goal {
  id: string;
  name: string;
  completeDate: Date | null;
  amount: number;
  initialAmount: number;
  monthlyContribution: number | null;
  accounts: Account[];
  userID: string;
}

interface NewGoal extends Partial<Goal> {
  accountIds: string[];
}

enum GoalType {
  None = '',
  SaveGoal = 'saveGoal',
  PayGoal = 'payGoal',
}

enum GoalCondition {
  TimedGoal = 'timedGoal',
  MonthlyGoal = 'monthlyGoal',
}

enum GoalTarget {
  TargetBalanceGoal = 'targetBalanceGoal',
  TargetAmountGoal = 'targetAmountGoal',
}

export type { Goal, NewGoal };
export { GoalCondition, GoalTarget, GoalType };
