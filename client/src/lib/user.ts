import { type AxiosResponse } from 'axios';
import request from './request';

export const getUser = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/user',
    method: 'GET',
  });

export const setAccessToken = async (newToken: string): Promise<AxiosResponse> =>
  await request({
    url: '/api/simplefin/updatetoken',
    method: 'POST',
    params: { newToken },
  });
