import { type AxiosResponse } from 'axios';
import request from './request';

export const getUser = async (accessToken: string): Promise<AxiosResponse> =>
  await request(
    {
      url: '/api/user',
      method: 'GET',
    },
    accessToken
  );

export const setAccessToken = async (
  accessToken: string,
  newToken: string
): Promise<AxiosResponse> =>
  await request(
    {
      url: '/api/simplefin/updatetoken',
      method: 'POST',
      params: { newToken },
    },
    accessToken
  );

export const doSync = async (accessToken: string): Promise<AxiosResponse> =>
  await request({ url: '/api/simplefin/sync', method: 'GET' }, accessToken);
