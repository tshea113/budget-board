import { Account } from './account';

export interface GoalResponse {
  id: string;
  name: string;
  completeDate: Date | null;
  amount: number;
  initialAmount: number;
  monthlyContribution: number | null;
  accounts: Account[];
  userID: string;
}

export interface INewGoalRequest {
  name: string;
  completeDate: Date | null;
  amount: number;
  initialAmount: number | null;
  monthlyContribution: number | null;
  accountIds: string[];
}

export class NewGoalRequest implements INewGoalRequest {
  name: string;
  completeDate: Date | null;
  amount: number;
  initialAmount: number | null;
  monthlyContribution: number | null;
  accountIds: string[];

  constructor(
    name?: string,
    accountIds?: string[],
    completeDate?: Date | null,
    amount?: number,
    initialAmount?: number | null,
    monthlyContribution?: number | null
  ) {
    this.name = name ?? '';
    this.accountIds = accountIds ?? [];
    this.completeDate = completeDate ?? null;
    this.amount = amount ?? 0;
    this.initialAmount = initialAmount ?? null;
    this.monthlyContribution = monthlyContribution ?? null;
  }
}

export enum GoalType {
  None = '',
  SaveGoal = 'saveGoal',
  PayGoal = 'payGoal',
}

export enum GoalCondition {
  TimedGoal = 'timedGoal',
  MonthlyGoal = 'monthlyGoal',
}

export enum GoalTarget {
  TargetBalanceGoal = 'targetBalanceGoal',
  TargetAmountGoal = 'targetAmountGoal',
}
