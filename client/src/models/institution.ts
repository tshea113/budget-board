import { IAccount } from "./account";

export interface IInstitution {
  id: string;
  name: string;
  index: number;
  deleted: Date | null;
  userID: string;
  accounts: IAccount[];
}

export interface InstitutionIndexRequest {
  id: string;
  index: number;
}
