import { AxiosResponse } from 'axios';
import request from './request';

export const login = async (email: string, password: string): Promise<string> => {
  let errorCode: string = '';
  try {
    await request({
      url: '/login?useCookies=true',
      method: 'POST',
      data: {
        email,
        password,
      },
    });
  } catch (err: any) {
    errorCode = err.code;
  }
  return errorCode;
};

export const logout = async (): Promise<AxiosResponse> =>
  await request({
    url: '/logout',
    method: 'POST',
  });