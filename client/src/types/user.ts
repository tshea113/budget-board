export interface User {
  uid: string;
  accessToken: string;
}

export interface ResponseUser {
  uid: string;
  accessToken: boolean;
}

export interface InfoResponse {
  email: string;
  isEmailConfirmed: boolean;
}

export const defaultGuid: string = '00000000-0000-0000-0000-000000000000';

export interface NewUser extends Partial<User> {}
