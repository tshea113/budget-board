import { AxiosResponse } from 'axios';
import request from './request';
import { NewGoal } from '@/types/goal';

export const getGoals = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/goal',
    method: 'GET',
  });

export const addGoal = async (newGoal: NewGoal): Promise<AxiosResponse> =>
  await request({
    url: '/api/goal',
    method: 'GET',
    data: newGoal,
  });
