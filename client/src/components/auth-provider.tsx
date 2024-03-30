import { type User, onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { firebaseAuth } from '@/lib/firebase';

export const AuthContext = createContext({});

const AuthProvider = ({ children }: { children: any }): JSX.Element => {
  const [currentUserState, setCurrentUserState] = useState<User | null>(firebaseAuth.currentUser);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = (): void => {
      onAuthStateChanged(firebaseAuth, (currentUser) => {
        setCurrentUserState(currentUser);
        setLoading(false);
      });
    };

    return () => {
      unsubscribe();
    };
  }, [firebaseAuth.currentUser]);

  const authValue = {
    currentUserState,
    setCurrentUserState,
    loading,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
