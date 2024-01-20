import { type AxiosResponse } from 'axios';
import request from './request';

export const getUser = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/user',
  });
