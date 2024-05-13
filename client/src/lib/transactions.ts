import { type AxiosResponse } from 'axios';
import request from './request';
import { type Category, categories, type Transaction } from '@/types/transaction';

export const getTransactions = async (): Promise<AxiosResponse> =>
  await request({
    url: '/api/transaction',
    method: 'GET',
  });

export const editTransaction = async (newTransaction: Transaction): Promise<AxiosResponse> =>
  await request({
    url: '/api/transaction',
    method: 'PUT',
    data: newTransaction,
  });

export const deleteTransaction = async (id: string): Promise<AxiosResponse> =>
  await request({
    url: '/api/transaction',
    method: 'DELETE',
    params: { guid: id },
  });

export const restoreTransaction = async (guid: string): Promise<AxiosResponse> => {
  return await request({
    url: '/api/transaction/restore',
    method: 'POST',
    params: { guid },
  });
};

export const filterVisibleTransactions = (transactions: Transaction[]): Transaction[] => {
  return transactions.filter((t: Transaction) => t.deleted === null);
};

export const filterInvisibleTransactions = (transactions: Transaction[]): Transaction[] => {
  return transactions.filter((t: Transaction) => t.deleted !== null);
};

export const getTransactionsForMonth = (
  transactionData: Transaction[],
  date: Date
): Transaction[] => {
  return (
    transactionData.filter(
      (t: Transaction) =>
        new Date(t.date).getMonth() === new Date(date).getMonth() &&
        new Date(t.date).getUTCFullYear() === new Date(date).getUTCFullYear()
    ) ?? []
  );
};

export const getCategoryLabel = (categoryValue: string): string | null => {
  const foundCategory = categories.find((c) => c.value === categoryValue);
  return foundCategory?.label ?? null;
};

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

export const getParentCategory = (categoryValue: string): string => {
  const category = categories.find((c) => c.value === categoryValue);

  if (category == null) return '';

  return category.parent === '' ? category.value : category.parent;
};

export const getIsCategory = (categoryValue: string): boolean => {
  const categories = getCategoriesAsTree();
  return categories.find((c) => c.value === categoryValue) !== undefined;
};

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString([], options);
};
