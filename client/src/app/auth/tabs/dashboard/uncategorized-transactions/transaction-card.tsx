import { AuthContext } from '@/components/auth-provider';
import CategoryInput from '@/components/category-input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { translateAxiosError } from '@/lib/requests';
import { formatDate, getIsCategory } from '@/lib/transactions';
import { categories } from '@/types/category';
import { Transaction } from '@/types/transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = (props: TransactionCardProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doEditTransaction = useMutation({
    mutationFn: async (newTransaction: Transaction) =>
      await request({
        url: '/api/transaction',
        method: 'PUT',
        data: newTransaction,
      }),
    onMutate: async (variables: Transaction) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });

      const previousTransactions: Transaction[] =
        queryClient.getQueryData(['transactions']) ?? [];

      queryClient.setQueryData(['transactions'], (oldTransactions: Transaction[]) =>
        oldTransactions.map((oldTransaction) =>
          oldTransaction.id === variables.id ? variables : oldTransaction
        )
      );

      return { previousTransactions };
    },
    onError: (error: AxiosError, _variables: Transaction, context) => {
      queryClient.setQueryData(['transactions'], context?.previousTransactions ?? []);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: translateAxiosError(error),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const onCategoryPick = (newValue: string): void => {
    const category = categories.find((c) => c.value === newValue);

    if (category != null) {
      let categoryValue = '';
      let subcategoryValue = '';
      if (getIsCategory(category.value)) {
        categoryValue = category.value;
      } else {
        categoryValue = category.parent;
        subcategoryValue = category.value;
      }

      props.transaction.category = categoryValue;
      props.transaction.subcategory = subcategoryValue;

      doEditTransaction.mutate(props.transaction);
    }
  };

  return (
    <Card className="my-2">
      <div className="my-1 flex flex-col space-y-2 px-2 sm:grid sm:grid-cols-10 sm:grid-rows-1 sm:items-center sm:space-y-0">
        <span className="col-span-2 pr-3 sm:col-span-1">
          {formatDate(props.transaction.date)}
        </span>
        <span className="sm:col-span-5">{props.transaction.merchantName}</span>
        <span className="sm:col-span-3">
          <CategoryInput
            initialValue={props.transaction.category ?? ''}
            onSelectChange={onCategoryPick}
          />
        </span>
        <span className="sm:col-span-1">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(props.transaction.amount)}
        </span>
      </div>
    </Card>
  );
};

export default TransactionCard;
