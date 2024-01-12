import request from "./request"

export const getTransactions = async () => await request({
  url: '/api/transaction',
});

export const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString([], options);
}
