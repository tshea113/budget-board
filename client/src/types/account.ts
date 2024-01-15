interface Account {
  id: string;
  name: string;
  institution: string;
  type: Type;
  subtype: SubType;
  userId: string;
  source: string;
  accountId: string;
}

enum Type {
  Depository,
  Credit,
  Loan,
  Investment,
  Other,
}

enum SubType {
  Checking,
  Savings,
  MoneyMarket,
  CD,
  Treasury,
  Sweep,
  CreditCard,
}

export type { Account };
export { Type, SubType };
