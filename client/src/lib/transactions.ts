import { type AxiosResponse } from 'axios';
import request from './request';
import { type Category, categories } from '@/types/transaction';

export const getTransactions = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/transaction',
  });

export const getCategoriesAsTree = (): Category[] => {
  const map: Record<string, number> = {};
  let node: Category;
  const roots: Category[] = [];

  for (let i = 0; i < categories.length; i++) {
    map[categories[i].value] = i; // initialize the map
    categories[i].subCategories = []; // initialize the children
  }

  for (let i = 0; i < categories.length; i++) {
    node = categories[i];
    if (node.parent !== '') {
      // if you have dangling branches check that map[node.parentId] exists
      categories[map[node.parent]].subCategories?.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
};

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString([], options);
};
