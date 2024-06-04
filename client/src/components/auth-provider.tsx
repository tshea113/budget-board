import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import React from 'react';

export const AuthContext = createContext({});

export interface AuthContextValue {
  accessToken: string;
  setAccessToken: (isLoggedIn: string) => void;
  loading: boolean;
}

const AuthProvider = ({ children }: { children: any }): JSX.Element => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {}, []);

  const authValue: AuthContextValue = {
    accessToken,
    setAccessToken,
    loading,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
