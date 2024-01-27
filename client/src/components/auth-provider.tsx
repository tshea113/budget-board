import {
  type User,
  type UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { firebaseAuth } from '@/lib/firebase';

export const AuthContext = createContext({});

const AuthProvider = ({ children }: { children: any }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const createUser = (email: string, password: string): any => {
    setLoading(true);
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((res: UserCredential) => {
        return res;
      })
      .catch((err: Error) => {
        console.error(err.message);
        return null;
      });
  };

  const loginUser = async (email: string, password: string): Promise<string> => {
    setLoading(true);
    let errorMessage: string = '';
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      if (userCredential !== null || userCredential !== undefined) {
        console.log(userCredential?.user);
        setUser(userCredential.user);
      }
    } catch (err: any) {
      errorMessage = err.message;
      console.log(err.message);
    }
    setLoading(false);
    return errorMessage;
  };

  const logOut = async (): Promise<void> => {
    setLoading(true);
    await signOut(firebaseAuth);
  };

  const authValue = {
    createUser,
    user,
    setUser,
    loginUser,
    logOut,
    loading,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
