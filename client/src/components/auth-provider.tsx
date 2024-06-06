import axios, { AxiosError, AxiosResponse } from 'axios';
import { createContext, useState } from 'react';
import React from 'react';

export const AuthContext = createContext({});

export interface AuthContextValue {
  accessToken: string;
  setAccessToken: (isLoggedIn: string) => void;
  loading: boolean;
  request: ({ ...options }) => Promise<AxiosResponse>;
}

const AuthProvider = ({ children }: { children: any }): JSX.Element => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // base url is sourced from environment variables
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });

  const request = async ({ ...options }): Promise<AxiosResponse> => {
    const onSuccess = (response: AxiosResponse): AxiosResponse => response;
    const onError = (error: AxiosError): any => {
      throw error;
    };

    const refreshToken = localStorage.getItem('refresh-token');
    if (refreshToken) {
      const res: AxiosResponse = await client({
        url: '/refresh',
        method: 'POST',
        data: { refreshToken },
      });
      localStorage.setItem('refresh-token', res.data.refreshToken);
      setAccessToken(res.data.accessToken);
      client.defaults.headers.common.Authorization = 'Bearer ' + res.data.accessToken;
    }

    return await client(options).then(onSuccess).catch(onError);
  };

  React.useEffect(() => {
    setLoading(true);
    const refreshToken = localStorage.getItem('refresh-token');
    if (refreshToken) {
      request({
        url: '/refresh',
        method: 'POST',
        data: { refreshToken },
      })
        .then((res) => {
          localStorage.setItem('refresh-token', res.data.refreshToken);
          setAccessToken(res.data.accessToken);
        })
        .catch(() => {
          // do nothing
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
    request,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
