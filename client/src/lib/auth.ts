import { AxiosResponse } from 'axios';
import request from './request';

export const login = async (email: string, password: string): Promise<AxiosResponse> =>
  await request({
    url: '/login',
    method: 'POST',
    data: {
      email,
      password,
    },
  });

export const register = async (email: string, password: string): Promise<AxiosResponse> =>
  await request({
    url: '/register',
    method: 'POST',
    data: {
      email,
      password,
    },
  });

export const logout = async (accessToken: string): Promise<AxiosResponse> =>
  await request(
    {
      url: '/logout',
      method: 'POST',
      data: {},
    },
    accessToken
  );

export const getUserInfo = async (accessToken: string): Promise<AxiosResponse> =>
  await request(
    {
      url: '/manage/info',
      method: 'GET',
    },
    accessToken
  );
