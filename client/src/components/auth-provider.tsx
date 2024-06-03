import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import React from 'react';
import request from '@/lib/request';
import { AxiosError } from 'axios';

export const AuthContext = createContext({});

export interface AuthContextValue {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  loading: boolean;
}

const AuthProvider = ({ children }: { children: any }): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    request({
      url: '/api/user/isSignedIn',
      method: 'GET',
    })
      .then((res) => {
        setIsLoggedIn(res.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        if (error.code === 'ERR_BAD_REQUEST') {
          setIsLoggedIn(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const authValue: AuthContextValue = {
    isLoggedIn,
    setIsLoggedIn,
    loading,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
