import { ICategory } from './category';
import { Transaction } from './transaction';

export interface Account {
  id: string;
  syncID: string;
  name: string;
  institution: string;
  type: string;
  subtype: string;
  currentBalance: number;
  balanceDate: Date;
  hideTransactions: boolean;
  hideAccount: boolean;
  deleted: Date;
  transactions?: Transaction[];
  userID: string;
}

export interface NewAccount extends Partial<Account> {}

export const accountCategories: ICategory[] = [
  {
    value: 'Checking',
    parent: '',
  },
  {
    value: 'Savings',
    parent: '',
  },
  {
    value: 'Money Market',
    parent: 'Savings',
  },
  {
    value: 'Certificate of Deposit',
    parent: 'Savings',
  },
  {
    value: 'Loan',
    parent: '',
  },
  {
    value: 'Auto',
    parent: 'Loan',
  },
  {
    value: 'Student',
    parent: 'Loan',
  },
  {
    value: 'Personal',
    parent: 'Loan',
  },
  {
    value: 'Home Equity',
    parent: 'Loan',
  },
  {
    value: 'Credit Card',
    parent: '',
  },
  {
    value: 'Investment',
    parent: '',
  },
  {
    value: '401k',
    parent: 'Investment',
  },
  {
    value: 'Roth IRA',
    parent: 'Investment',
  },
  {
    value: 'Rollover IRA',
    parent: 'Investment',
  },
  {
    value: 'ESPP',
    parent: 'Investment',
  },
  {
    value: 'Trust',
    parent: 'Investment',
  },
  {
    value: 'Taxable',
    parent: 'Investment',
  },
  {
    value: 'Mortgage',
    parent: '',
  },
  {
    value: 'Cash',
    parent: '',
  },
  {
    value: 'Other',
    parent: '',
  },
];
