import { IAccount } from './account';

export interface IGoalCreateRequest {
  name: string;
  completeDate: Date | null;
  amount: number;
  initialAmount: number | null;
  monthlyContribution: number | null;
  accountIds: string[];
}

export interface IGoalUpdateRequest {
  id: string;
  name: string;
  completeDate: Date | null;
  isCompleteDateEditable: boolean;
  amount: number;
  initialAmount: number | null;
  monthlyContribution: number | null;
  isMonthlyContributionEditable: boolean;
  accountIds: string[];
}

export interface IGoalResponse {
  id: string;
  name: string;
  completeDate: Date;
  isCompleteDateEditable: boolean;
  amount: number;
  initialAmount: number;
  monthlyContribution: number;
  isMonthlyContributionEditable: boolean;
  estimatedInterestRate: number | null;
  accounts: IAccount[];
  userID: string;
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
