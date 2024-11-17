import { Skeleton } from '@/components/ui/skeleton';
import EmailVerified from '../../../../components/email-verified';
import { AuthContext } from '@/components/auth-provider';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { Filters, Transaction } from '@/types/transaction';
import TransactionCards from './transaction-cards';
import { SortDirection } from './transactions-header/sort-button';
import TransactionsHeader from './transactions-header/transactions.header';
import { Sorts } from './transactions-header/sort-by-menu';
import { areStringsEqual } from '@/lib/utils';

const Transactions = (): JSX.Element => {
  const [sort, setSort] = React.useState(Sorts.Date);
  const [sortDirection, setSortDirection] = React.useState(SortDirection.Decending);
  const [filters, setFilters] = React.useState<Filters>(new Filters());

  const { request } = React.useContext<any>(AuthContext);

  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: async (): Promise<Transaction[]> => {
      const res: AxiosResponse = await request({
        url: '/api/transaction',
        method: 'GET',
      });

      if (res.status == 200) {
        return res.data;
      }

      return [];
    },
  });

  const filteredTransactions = React.useMemo(() => {
    let filteredTransactions = transactionsQuery.data ?? [];

    if (filters.accounts.length > 0) {
      filteredTransactions = filteredTransactions.filter((t) =>
        filters.accounts.some((f) => areStringsEqual(f, t.accountID))
      );
    }

    return filteredTransactions;
  }, [filters, transactionsQuery.data]);

  if (transactionsQuery.isPending) {
    return <Skeleton className="h-[550px] w-full rounded-xl" />;
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <EmailVerified />
      <TransactionsHeader
        transactions={filteredTransactions}
        sort={sort}
        setSort={setSort}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        filters={filters}
        setFilters={setFilters}
      />
      <TransactionCards
        transactions={filteredTransactions}
        sort={sort}
        sortDirection={sortDirection}
      />
    </div>
  );
};

export default Transactions;
