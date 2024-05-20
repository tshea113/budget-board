import { AxiosResponse } from 'axios';
import request from './request';

export const getGoals = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/goal',
    method: 'GET',
  });
