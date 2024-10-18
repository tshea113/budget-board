import { Card } from '@/components/ui/card';
import TransactionCard, {
  TransactionCardType,
} from '../../transactions/transaction-card';
import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@/types/transaction';
import { AxiosResponse } from 'axios';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { filterTransactionsByCategory } from '@/lib/transactions';
import { ScrollArea } from '@/components/ui/scroll-area';
import PageIterator from './page-iterator';

const UncategorizedTransactionsCard = (): JSX.Element => {
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, _setItemsPerPage] = React.useState(50);

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

  const filteredTransactions = React.useMemo(
    () => filterTransactionsByCategory(transactionsQuery.data ?? [], ''),
    [transactionsQuery]
  );

  if (filteredTransactions.length !== 0 && transactionsQuery.isSuccess) {
    return (
      <Card className="w-full bg-card p-2 text-card-foreground">
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

        <ScrollArea className="flex h-full max-h-[300px] flex-col py-2">
          {filteredTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage)
            .map((transaction: Transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                type={TransactionCardType.Uncategorized}
              />
            ))}
        </ScrollArea>
      </Card>
    );
  } else {
    return <></>;
  }
};

export default UncategorizedTransactionsCard;
