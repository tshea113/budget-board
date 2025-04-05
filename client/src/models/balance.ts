export interface IBalance {
  id: string;
  amount: number;
  dateTime: Date;
  accountID: string;
}

export interface IBalanceCreateRequest {
  amount: number;
  dateTime: Date;
  accountID: string;
}
