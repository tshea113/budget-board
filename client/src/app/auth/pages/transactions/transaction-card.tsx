import { AuthContext } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { translateAxiosError } from '@/lib/requests';
import { cn } from '@/lib/utils';
import {
  ITransaction,
  ITransactionUpdateRequest,
  TransactionCardType,
} from '@/types/transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { type JSX } from 'react';
import EditableCategoryCell from './cells/editable-category-cell';
import EditableCurrencyCell from '@/components/cells/editable-currency-cell';
import EditableMerchantCell from './cells/editable-merchant-cell';
import EditableDateCell from './cells/editable-date-cell';
import LoadingIcon from '@/components/loading-icon';
import { toast } from 'sonner';
import ResponsiveButton from '@/components/responsive-button';
import { TrashIcon } from 'lucide-react';

interface TransactionCardProps {
  className?: string;
  transaction: ITransaction;
  type: TransactionCardType;
}

const TransactionCard = (props: TransactionCardProps): JSX.Element => {
  const [isSelected, setIsSelected] = React.useState(false);
  const [selectEffect, setSelectEffect] = React.useState(false);

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doEditTransaction = useMutation({
    mutationFn: async (newTransaction: ITransactionUpdateRequest) =>
      await request({
        url: '/api/transaction',
        method: 'PUT',
        data: newTransaction,
      }),
    onMutate: async (variables: ITransactionUpdateRequest) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });

      const previousTransactions: ITransaction[] =
        queryClient.getQueryData(['transactions']) ?? [];

      queryClient.setQueryData(['transactions'], (oldTransactions: ITransaction[]) =>
        oldTransactions.map((oldTransaction) =>
          oldTransaction.id === variables.id
            ? {
                ...oldTransaction,
                amount: variables.amount,
                date: variables.date,
                category: variables.category,
                subcategory: variables.subcategory,
                merchantName: variables.merchantName,
                deleted: variables.deleted,
              }
            : oldTransaction
        )
      );

      return { previousTransactions };
    },
    onError: (error: AxiosError, _variables: ITransaction, context) => {
      queryClient.setQueryData(['transactions'], context?.previousTransactions ?? []);
      toast.error(translateAxiosError(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const doDeleteTransaction = useMutation({
    mutationFn: async (id: string) =>
      await request({
        url: '/api/transaction',
        method: 'DELETE',
        params: { guid: id },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
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
        'flex flex-row @container',
        props.type === TransactionCardType.Normal ? 'hover:border-primary' : '',
        isSelected ? 'bg-muted' : 'bg-card',
        selectEffect && 'animate-pop',
        props.className
      )}
      onClick={toggleIsSelected}
      onAnimationEnd={() => setSelectEffect(false)}
    >
      <div className="my-0.5 flex w-full flex-col flex-wrap gap-2 p-2 @xl:flex-row @xl:items-center">
        <span className="@xl:w-[200px]">
          <EditableDateCell
            transaction={props.transaction}
            isSelected={isSelected}
            editCell={doEditTransaction.mutate}
            textClassName="text-sm @xl:text-base"
          />
        </span>
        <span className="flex-auto @xl:w-[200px]">
          <EditableMerchantCell
            transaction={props.transaction}
            isSelected={isSelected}
            editCell={doEditTransaction.mutate}
            textClassName="font-semibold @xl:font-normal"
          />
        </span>
        <span className="@xl:w-[190px]">
          <EditableCategoryCell
            transaction={props.transaction}
            isSelected={isSelected || props.type === TransactionCardType.Uncategorized}
            editCell={doEditTransaction.mutate}
            textClassName="font-medium @xl:font-normal"
          />
        </span>
        <span className="w-[100px]">
          <EditableCurrencyCell
            value={props.transaction.amount}
            isSelected={isSelected}
            editCell={(value: number) =>
              doEditTransaction.mutate({ ...props.transaction, amount: value })
            }
          />
        </span>
        {doEditTransaction.isPending && <LoadingIcon className="h-5 w-5" />}
      </div>
      {isSelected && (
        <div className="items-center justify-center">
          <ResponsiveButton
            variant="destructive"
            className="h-full w-10 p-0"
            onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              doDeleteTransaction.mutate(props.transaction.id);
            }}
            loading={doDeleteTransaction.isPending}
          >
            <TrashIcon className="h-4 w-4" />
          </ResponsiveButton>
        </div>
      )}
    </Card>
  );
};

export default TransactionCard;
