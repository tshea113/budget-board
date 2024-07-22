import { Card } from '@/components/ui/card';
import TransactionCard from './transaction-card';
import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@/types/transaction';
import { AxiosResponse } from 'axios';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { filterTransactionsByCategory } from '@/lib/transactions';
import { ScrollArea } from '@/components/ui/scroll-area';

const UncategorizedTransactionsCard = (): JSX.Element => {
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

  if (filterTransactionsByCategory(transactionsQuery.data ?? [], null).length !== 0) {
    return (
      <Card className="w-full bg-background p-2">
        <span className="w-1/2 text-2xl font-semibold tracking-tight">
          Uncategorized Transactions
        </span>
        <ScrollArea className="flex h-full max-h-[300px] flex-col py-2 pr-3">
          {filterTransactionsByCategory(transactionsQuery.data ?? [], null).map(
            (transaction: Transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            )
          )}
        </ScrollArea>
      </Card>
    );
  } else {
    return <></>;
  }
};

export default UncategorizedTransactionsCard;
