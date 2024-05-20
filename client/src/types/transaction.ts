interface Transaction {
  id: string;
  amount: number;
  date: Date;
  category: string;
  subcategory: string;
  merchantName: string;
  pending: boolean;
  deleted: Date;
  source: string;
  accountID: string;
}

interface NewTransaction extends Partial<Transaction> {}

export type { Transaction, NewTransaction };
