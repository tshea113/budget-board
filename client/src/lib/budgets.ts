import { type AxiosResponse } from 'axios';
import request from './request';

export const getBudgets = async (date: Date): Promise<AxiosResponse> => {
  const dateString = '?date=' + date.toISOString();
  return await request({
    url: '/api/budget' + dateString,
    method: 'GET',
  });
};
