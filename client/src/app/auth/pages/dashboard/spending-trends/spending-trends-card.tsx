import { Card } from '@/components/ui/card';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { ITransaction } from '@/types/transaction';
import { AxiosResponse } from 'axios';
import {
  convertNumberToCurrency,
  getDateFromMonthsAgo,
  getDaysInMonth,
} from '@/lib/utils';
import {
  filterHiddenTransactions,
  getRollingTotalSpendingForMonth,
} from '@/lib/transactions';
import { Skeleton } from '@/components/ui/skeleton';
import SpendingGraph from '../../trends/spending/spending-graph';

const SpendingTrendsCard = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const thisMonthDate = getDateFromMonthsAgo(0);
  const thisMonthTransactionsQuery = useQuery({
    queryKey: [
      'transactions',
      { month: thisMonthDate.getMonth(), year: thisMonthDate.getFullYear() },
    ],
    queryFn: async (): Promise<ITransaction[]> => {
      const res: AxiosResponse = await request({
        url: '/api/transaction',
        method: 'GET',
        params: {
          month: thisMonthDate.getMonth() + 1,
          year: thisMonthDate.getFullYear(),
        },
      });

      if (res.status === 200) {
        return res.data as ITransaction[];
      }

      return [];
    },
  });
  const lastMonthDate = getDateFromMonthsAgo(1);
  const lastMonthTransactionsQuery = useQuery({
    queryKey: [
      'transactions',
      { month: lastMonthDate.getMonth(), year: lastMonthDate.getFullYear() },
    ],
    queryFn: async (): Promise<ITransaction[]> => {
      const res: AxiosResponse = await request({
        url: '/api/transaction',
        method: 'GET',
        params: {
          month: lastMonthDate.getMonth() + 1,
          year: lastMonthDate.getFullYear(),
        },
      });

      if (res.status === 200) {
        return res.data as ITransaction[];
      }

      return [];
    },
  });

  const getSpendingComparison = (): number => {
    const thisMonthRollingTotal = getRollingTotalSpendingForMonth(
      filterHiddenTransactions(thisMonthTransactionsQuery.data ?? []),
      new Date().getDate()
    );
    const lastMonthRollingTotal = getRollingTotalSpendingForMonth(
      filterHiddenTransactions(lastMonthTransactionsQuery.data ?? []),
      getDaysInMonth(lastMonthDate.getMonth(), lastMonthDate.getFullYear())
    );

    const today = new Date().getDate();

    return (
      (thisMonthRollingTotal.at(today - 1)?.amount ?? 0) -
      (lastMonthRollingTotal.at(today - 1)?.amount ?? 0)
    );
  };

  const getSpendingComparisonString = (): string => {
    // Need to round this number to the nearest cent
    const spendingComparisonNumber =
      Math.round((getSpendingComparison() + Number.EPSILON) * 100) / 100;

    if (spendingComparisonNumber < 0) {
      return (
        convertNumberToCurrency(Math.abs(spendingComparisonNumber), true) + ' less than'
      );
    } else if (spendingComparisonNumber > 0) {
      return (
        convertNumberToCurrency(Math.abs(spendingComparisonNumber), true) + ' more than'
      );
    }

    return 'the same as';
  };

  if (thisMonthTransactionsQuery.isPending || lastMonthTransactionsQuery.isPending) {
    return (
      <Card className="flex flex-col gap-2 p-2">
        <div className="grid w-full grid-cols-2 items-center">
          <Skeleton className="h-10 w-1/2 max-w-[125px] justify-self-start" />
          <Skeleton className="h-6 w-1/2 max-w-[250px] justify-self-end" />
        </div>
        <Skeleton className="aspect-video max-h-[400px] w-full rounded-xl" />
      </Card>
    );
  }

  return (
    <Card className="flex w-full flex-col bg-card text-card-foreground">
      <div className="flex flex-row items-center p-2">
        <span className="w-1/2 text-2xl font-semibold tracking-tight">
          Spending Trends
        </span>
        <span className="w-1/2 text-right font-semibold tracking-tight">
          You have spent {getSpendingComparisonString()} last month.
        </span>
      </div>

      <div className="p-2">
        <SpendingGraph
          months={[getDateFromMonthsAgo(0), getDateFromMonthsAgo(1)]}
          transactions={filterHiddenTransactions(
            thisMonthTransactionsQuery.data ?? []
          ).concat(filterHiddenTransactions(lastMonthTransactionsQuery.data ?? []))}
        />
      </div>
    </Card>
  );
};

export default SpendingTrendsCard;
