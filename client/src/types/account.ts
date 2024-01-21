interface Account {
  id: string;
  name: string;
  institution: string;
  type: string;
  subtype: string;
  userId: string;
  source: string;
  accountId: string;
}

interface NewAccount extends Partial<Account> {}

const Type: string[] = ['Depository', 'Credit', 'Loan', 'Investment', 'Other'];

const SubType: string[][] = [
  ['Checking', 'Savings', 'MoneyMarket', 'CD', 'Treasury', 'Sweep', 'CreditCard'],
];

export type { Account, NewAccount };
export { Type, SubType };
