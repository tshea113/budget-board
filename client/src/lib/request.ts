import axios, { type AxiosResponse } from 'axios';
import { getToken } from './firebase';

// base url is sourced from environment variables
const client = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const request = async ({ ...options }): Promise<AxiosResponse> => {
  const token = await getToken();
  client.defaults.headers.common.Authorization = 'Bearer ' + token;

  const onSuccess = (response: AxiosResponse): AxiosResponse => response;
  const onError = (error: Error): any => {
    // optionaly catch errors and add some additional logging here
    throw error;
  };

  return await client(options).then(onSuccess).catch(onError);
};

export default request;
