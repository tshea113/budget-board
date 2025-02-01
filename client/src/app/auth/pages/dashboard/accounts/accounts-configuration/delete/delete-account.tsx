import { AuthContext } from '@/components/auth-provider';
import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { translateAxiosError } from '@/lib/requests';
import { TrashIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React from 'react';
import { toast } from 'sonner';

interface DeleteAccountProps {
  accountId: string;
}

const DeleteAccount = (props: DeleteAccountProps): JSX.Element => {
  const [deleteTransactionsValue, setDeleteTransactionsValue] = React.useState(false);

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doDeleteAccount = useMutation({
    mutationFn: async (deleteTransactions: boolean) =>
      await request({
        url: '/api/account',
        method: 'DELETE',
        params: { guid: props.accountId, deleteTransactions },
      }),
    onSuccess: async () => {
      // Refetch the accounts and institutions queries immediatly after the account is deleted
      await queryClient.refetchQueries({ queryKey: ['institutions'] });
      await queryClient.refetchQueries({ queryKey: ['accounts'] });
    },
    onError: (error: AxiosError) => {
      toast.error(translateAxiosError(error));
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 w-8 p-0">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-row items-center space-x-2">
            <Checkbox
              id="deleteTransaction"
              checked={deleteTransactionsValue}
              onCheckedChange={() => {
                setDeleteTransactionsValue(!deleteTransactionsValue);
              }}
            />
            <label
              htmlFor="deleteTransaction"
              className="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Delete transactions for account
            </label>
          </div>

          <ResponsiveButton
            loading={doDeleteAccount.isPending}
            variant="destructive"
            onClick={() => {
              doDeleteAccount.mutate(deleteTransactionsValue);
            }}
          >
            Delete
          </ResponsiveButton>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteAccount;
