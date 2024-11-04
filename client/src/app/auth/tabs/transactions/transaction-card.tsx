import { AuthContext } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { translateAxiosError } from '@/lib/requests';
import { cn } from '@/lib/utils';
import { Transaction } from '@/types/transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import EditableCategoryCell from './cells/editable-category-cell';
import EditableCurrencyCell from './cells/editable-currency-cell';
import EditableMerchantCell from './cells/editable-merchant-cell';
import EditableDateCell from './cells/editable-date-cell';
import LoadingIcon from '@/components/loading-icon';
import { toast } from 'sonner';

export enum TransactionCardType {
  Normal,
  Edit,
  Uncategorized,
}

interface TransactionCardProps {
  className?: string;
  transaction: Transaction;
  type: TransactionCardType;
}

const TransactionCard = (props: TransactionCardProps): JSX.Element => {
  const [isSelected, setIsSelected] = React.useState(false);
  const [selectEffect, setSelectEffect] = React.useState(false);

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
      toast(translateAxiosError(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const toggleIsSelected = (): void => {
    if (props.type === TransactionCardType.Normal) {
      setIsSelected(!isSelected);
      setSelectEffect(true);
    }
  };

  return (
    <Card
      className={cn(
        'flex flex-row p-2 @container',
        props.type === TransactionCardType.Normal ? 'hover:bg-muted' : '',
        isSelected ? 'bg-muted' : 'bg-card',
        selectEffect && 'animate-pop',
        props.className
      )}
      onClick={toggleIsSelected}
      onAnimationEnd={() => setSelectEffect(false)}
    >
      <div className="my-1 flex w-full flex-col flex-wrap gap-2 @xl:flex-row @xl:items-center">
        <span className="@xl:w-[200px]">
          <EditableDateCell
            transaction={props.transaction}
            isSelected={isSelected}
            editCell={doEditTransaction.mutate}
          />
        </span>
        <span className="flex-auto @xl:w-[200px]">
          <EditableMerchantCell
            transaction={props.transaction}
            isSelected={isSelected}
            editCell={doEditTransaction.mutate}
          />
        </span>
        <span className="@xl:w-[190px]">
          <EditableCategoryCell
            transaction={props.transaction}
            isSelected={isSelected || props.type === TransactionCardType.Uncategorized}
            editCell={doEditTransaction.mutate}
          />
        </span>
        <span className="w-[100px]">
          <EditableCurrencyCell
            transaction={props.transaction}
            isSelected={isSelected}
            editCell={doEditTransaction.mutate}
          />
        </span>
      </div>
      <div className="content-center">
        {doEditTransaction.isPending && <LoadingIcon className="mx-4 h-5 w-5" />}
      </div>
    </Card>
  );
};

export default TransactionCard;
