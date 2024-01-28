import {
  type User,
  type UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { firebaseAuth } from '@/lib/firebase';

export const AuthContext = createContext({});

const AuthProvider = ({ children }: { children: any }): JSX.Element => {
  const [currentUserState, setCurrentUserState] = useState<User | null>(firebaseAuth.currentUser);
  const [emailVerified, setEmailVerified] = useState<boolean>(
    firebaseAuth.currentUser?.emailVerified ?? false
  );
  const [loading, setLoading] = useState<boolean>(true);

  const createUser = async (email: string, password: string): Promise<string> => {
    let errorCode: string = '';
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      if (!userCredential.user.emailVerified && firebaseAuth.currentUser != null) {
        await sendEmailVerification(firebaseAuth.currentUser);
      }
    } catch (err: any) {
      errorCode = err.code;
    }
    return errorCode;
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
          setEmailVerified(currentUser.emailVerified);
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
    emailVerified,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
