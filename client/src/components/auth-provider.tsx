import { refresh } from '@/lib/auth';
import { AxiosError } from 'axios';
import { createContext, useState } from 'react';
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

  React.useEffect(() => {
    setLoading(true);
    const refreshToken = localStorage.getItem('refresh-token');
    if (refreshToken) {
      console.log(refreshToken);
      refresh(refreshToken)
        .then((res) => {
          localStorage.setItem('refresh-token', res.data.refreshToken);
          setAccessToken(res.data.accessToken);
        })
        .catch((error: AxiosError) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const authValue: AuthContextValue = {
    accessToken,
    setAccessToken,
    loading,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
