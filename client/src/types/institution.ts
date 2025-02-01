import { IAccount } from './account';

export interface IInstitution {
  id: string;
  name: string;
  index: number;
  userID: string;
  accounts: IAccount[];
}

export interface InstitutionIndexRequest {
  id: string;
  index: number;
}
