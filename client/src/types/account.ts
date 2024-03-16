interface Account {
  id: string;
  name: string;
  institution: string;
  type: string;
  subtype: string;
  currentBalance: string;
  userId: string;
  source: string;
  accountId: string;
}

interface NewAccount extends Partial<Account> {}

const Type: string[] = ['Depository', 'Credit', 'Loan', 'Investment', 'Other'];

const SubType: string[][] = [
  ['Checking', 'Savings', 'Money Market', 'CD', 'Treasury', 'Sweep'],
  ['Credit Card'],
];

export type { Account, NewAccount };
export { Type, SubType };
