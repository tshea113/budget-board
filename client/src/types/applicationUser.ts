export interface IApplicationUserUpdateRequest {
  accessToken: string;
}

export interface IApplicationUser {
  id: string;
  accessToken: boolean;
  lastSync: Date;
}

export interface IUserInfoResponse {
  email: string;
  isEmailConfirmed: boolean;
}

export const defaultGuid: string = '00000000-0000-0000-0000-000000000000';
