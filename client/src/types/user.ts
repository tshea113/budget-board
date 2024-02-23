interface User {
  uid: string;
  accessToken: string;
}

interface ResponseUser {
  uid: string;
  accessToken: boolean;
}

interface NewUser extends Partial<User> {}

export type { User, NewUser, ResponseUser };
