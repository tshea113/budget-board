interface User {
  uid: string;
}

interface NewUser extends Partial<User> {}

export type { User, NewUser };
