import { useQuery } from '@tanstack/react-query';
import { ITransaction, TransactionCardType } from '@/types/transaction';
import { AxiosResponse } from 'axios';
import React, { type JSX } from 'react';
import { AuthContext } from '@/components/auth-provider';
import { getTransactionsByCategory, getVisibleTransactions } from '@/lib/transactions';
import { ScrollArea } from '@/components/ui/scroll-area';
import PageIterator from './page-iterator';
import TransactionCard from '../../transactions/transaction-card';

const UncategorizedTransactionsCard = (): JSX.Element => {
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, _setItemsPerPage] = React.useState(50);

  const { request } = React.useContext<any>(AuthContext);

  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: async (): Promise<ITransaction[]> => {
      const res: AxiosResponse = await request({
        url: '/api/transaction',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as ITransaction[];
      }

      return [];
    },
  });

  const filteredTransactions = React.useMemo(
    () =>
      getVisibleTransactions(getTransactionsByCategory(transactionsQuery.data ?? [], '')),
    [transactionsQuery]
  );

  if (filteredTransactions.length !== 0 && transactionsQuery.isSuccess) {
    return (
      <div className="w-full p-2">
        <div className="flex flex-col items-center sm:grid sm:grid-cols-2">
          <span className="text-2xl font-semibold tracking-tight">
            Uncategorized Transactions
          </span>
          <PageIterator
            className="justify-self-end"
            page={page}
            setPage={setPage}
            maxPages={Math.ceil(filteredTransactions.length / itemsPerPage)}
          />
        </div>

        <ScrollArea className="flex h-full max-h-[300px] flex-col py-2 pr-4" type="auto">
          {filteredTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage)
            .map((transaction: ITransaction) => (
              <TransactionCard
                className="my-1"
                key={transaction.id}
                transaction={transaction}
                type={TransactionCardType.Uncategorized}
              />
            ))}
        </ScrollArea>
      </div>
    );
  } else {
    return <></>;
  }
};

export default UncategorizedTransactionsCard;
