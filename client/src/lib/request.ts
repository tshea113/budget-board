import axios, { type AxiosError, type AxiosResponse } from 'axios';

// base url is sourced from environment variables
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const request = async (
  { ...options },
  accessToken: string = ''
): Promise<AxiosResponse> => {
  if (accessToken.length > 0) {
    client.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
  }

  const onSuccess = (response: AxiosResponse): AxiosResponse => response;
  const onError = (error: Error): any => {
    // optionaly catch errors and add some additional logging here
    throw error;
  };

  return await client(options).then(onSuccess).catch(onError);
};

const getErrorString = (error: AxiosResponse | undefined): string => {
  if (typeof error?.data === 'string') {
    return error.data;
  } else {
    return 'There was an error with your request.';
  }
};

export const translateAxiosError = (error: AxiosError): string => {
  if (error.code === 'ERR_BAD_REQUEST') {
    return getErrorString(error.response);
  } else if (error.code === 'ERR_NETWORK') {
    return getErrorString(error.response);
  } else {
    return 'Internal server error';
  }
};

export default request;
