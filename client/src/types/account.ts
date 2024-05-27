import { Transaction } from './transaction';

interface Account {
  id: string;
  syncID: string;
  name: string;
  institution: string;
  type: string;
  subtype: string;
  currentBalance: number;
  hideTransactions: boolean;
  hideAccount: boolean;
  deleted: Date;
  transactions?: Transaction[];
  userID: string;
}

interface NewAccount extends Partial<Account> {}

const Type: string[] = ['Depository', 'Credit', 'Loan', 'Investment', 'Other'];

const SubType: string[][] = [
  ['Checking', 'Savings', 'Money Market', 'CD', 'Treasury', 'Sweep'],
  ['Credit Card'],
];

export type { Account, NewAccount };
export { Type, SubType };
