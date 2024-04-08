interface User {
  uid: string;
  accessToken: string;
}

interface ResponseUser {
  uid: string;
  accessToken: boolean;
}

const defaultGuid: string = '00000000-0000-0000-0000-000000000000';

interface NewUser extends Partial<User> {}

export type { User, NewUser, ResponseUser };
export { defaultGuid };
