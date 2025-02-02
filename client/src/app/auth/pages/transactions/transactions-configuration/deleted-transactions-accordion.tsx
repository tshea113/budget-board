import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ITransaction } from '@/types/transaction';
import DeletedTransactionCard from './deleted-transaction-card';
import React from 'react';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { getDeletedTransactions } from '@/lib/transactions';
import { Skeleton } from '@/components/ui/skeleton';

const DeletedTransactionsAccordion = (): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const transactionsQuery = useQuery({
    queryKey: ['transactions', { getHidden: true }],
    queryFn: async (): Promise<ITransaction[]> => {
      const res: AxiosResponse = await request({
        url: '/api/transaction',
        method: 'GET',
        params: { getHidden: true },
      });

      if (res.status === 200) {
        return res.data as ITransaction[];
      }

      return [];
    },
  });

  const deletedTransactions = getDeletedTransactions(
    (transactionsQuery.data ?? []).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );

  if (transactionsQuery.isPending) {
    return <Skeleton className="h-14 w-full" />;
  }

  return (
    <div className="px-3">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="deleted-account"
      >
        <AccordionItem value="deleted-account">
          <AccordionTrigger>
            <span>Deleted Transactions</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {deletedTransactions.length !== 0 ? (
              deletedTransactions.map((deletedTransaction: ITransaction) => (
                <DeletedTransactionCard
                  key={deletedTransaction.id}
                  deletedTransaction={deletedTransaction}
                />
              ))
            ) : (
              <span>No deleted transactions.</span>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DeletedTransactionsAccordion;
