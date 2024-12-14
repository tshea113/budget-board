import { Account } from './account';

export interface Institution {
  id: string;
  name: string;
  index: number;
  userID: string;
  accounts: Account[];
}

export interface InstitutionIndexRequest {
  id: string;
  index: number;
}
