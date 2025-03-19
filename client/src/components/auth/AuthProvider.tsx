import { getProjectEnvVariables } from "$/shared/projectEnvVariables";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { createContext, useState } from "react";

export const AuthContext = createContext({});

export interface AuthContextValue {
  accessToken: string;
  setAccessToken: (isLoggedIn: string) => void;
  loading: boolean;
  request: ({ ...options }) => Promise<AxiosResponse>;
}

const AuthProvider = ({ children }: { children: any }): React.ReactNode => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [accessTokenExpirationDate, setAccessTokenExpirationDate] = useState(
    new Date(0)
  );
  const [loading, setLoading] = useState<boolean>(false);

  const { envVariables } = getProjectEnvVariables();

  // The access token will refresh when there are less than this amount of seconds left before it expires.
  const accessTokenRefreshTime = 30;

  const getDateXSecondsFromNow = (seconds: number): Date => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + seconds);
    return now;
  };

  // base url is sourced from environment variables
  const client = axios.create({
    baseURL: envVariables.VITE_API_URL,
    withCredentials: true,
  });

  const request = async ({ ...options }): Promise<AxiosResponse> => {
    const onSuccess = (response: AxiosResponse): AxiosResponse => response;
    const onError = (error: AxiosError): any => {
      throw error;
    };

    // If the access token is expiring soon, refresh before the request
    if (
      (accessTokenExpirationDate.getTime() - new Date().getTime()) / 1000 <
      accessTokenRefreshTime
    ) {
      const refreshToken = localStorage.getItem("refresh-token");
      if (refreshToken) {
        const res: AxiosResponse = await client({
          url: "/api/refresh",
          method: "POST",
          data: { refreshToken },
        });
        localStorage.setItem("refresh-token", res.data.refreshToken);
        setAccessToken(res.data.accessToken);
        setAccessTokenExpirationDate(
          getDateXSecondsFromNow(res.data.expiresIn)
        );
      }
    }

    client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    return await client(options).then(onSuccess).catch(onError);
  };

  React.useEffect(() => {
    setLoading(true);
    const refreshToken = localStorage.getItem("refresh-token");
    if (refreshToken) {
      request({
        url: "/api/refresh",
        method: "POST",
        data: { refreshToken },
      })
        .then((res) => {
          localStorage.setItem("refresh-token", res.data.refreshToken);
          setAccessToken(res.data.accessToken);
          setAccessTokenExpirationDate(
            getDateXSecondsFromNow(res.data.expiresIn)
          );
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 401) {
            // refresh-token is invalid, logout.
            localStorage.removeItem("refresh-token");
          }
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

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
