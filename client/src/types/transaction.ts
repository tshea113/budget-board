interface Transaction {
  id: string;
  amount: number;
  date: Date;
  category: string;
  merchantName: string;
  pending: boolean;
  source: string;
  accountId: string;
}

interface NewTransaction extends Partial<Transaction> {}

export type { Transaction, NewTransaction };
