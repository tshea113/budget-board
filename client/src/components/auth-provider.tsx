import {
  type User,
  type UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { firebaseAuth } from '@/lib/firebase';

export const AuthContext = createContext({});

const AuthProvider = ({ children }: { children: any }): JSX.Element => {
  const [currentUserState, setCurrentUserState] = useState<User | null>(firebaseAuth.currentUser);
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
    let errorCode: string = '';
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      if (userCredential !== null || userCredential !== undefined) {
        setCurrentUserState(userCredential.user);
      }
    } catch (err: any) {
      errorCode = err.code;
      console.log(err.message);
    }
    return errorCode;
  };

  const logOut = async (): Promise<void> => {
    await signOut(firebaseAuth);
  };

  useEffect(() => {
    const unsubscribe = (): void => {
      onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (currentUser !== null) {
          setCurrentUserState(currentUser);
        } else {
          setCurrentUserState(null);
        }
        setLoading(false);
      });
    };

    return () => {
      unsubscribe();
    };
  }, []);

  const authValue = {
    createUser,
    currentUserState,
    setCurrentUserState,
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
