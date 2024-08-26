import { AuthContext } from '@/components/auth-provider';
import CategoryInput from '@/components/category-input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { getIsParentCategory } from '@/lib/category';
import { translateAxiosError } from '@/lib/requests';
import { formatDate } from '@/lib/transactions';
import { Transaction, transactionCategories } from '@/types/transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { TailSpin } from 'react-loader-spinner';

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
    const category = transactionCategories.find((c) => c.value === newValue);

    if (category != null) {
      let categoryValue = '';
      let subcategoryValue = '';
      if (getIsParentCategory(category.value, transactionCategories)) {
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
        <span className="pr-3 sm:col-span-1">{formatDate(props.transaction.date)}</span>
        <span className="sm:col-span-3 md:col-span-5 lg:col-span-4 xl:col-span-5">
          {props.transaction.merchantName}
        </span>
        <span className="flex flex-row items-center sm:col-span-4 md:col-span-3 lg:col-span-4 xl:col-span-3">
          <CategoryInput
            initialValue={props.transaction.category ?? ''}
            onSelectChange={onCategoryPick}
            categories={transactionCategories}
          />
          {doEditTransaction.isPending && (
            <div className="mx-4">
              <TailSpin height="25" width="25" color="gray" />
            </div>
          )}
        </span>
        <span className="sm:col-span-2 md:col-span-1">
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
