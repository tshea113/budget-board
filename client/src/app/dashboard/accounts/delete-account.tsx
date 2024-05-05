import ResponsiveButton from '@/components/responsive-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { deleteAccount } from '@/lib/accounts';
import { translateAxiosError } from '@/lib/request';
import { TrashIcon } from '@radix-ui/react-icons';
import { type AxiosError } from 'axios';
import React from 'react';

interface DeleteAccountProps {
  accountId: string;
}

const DeleteAccount = (props: DeleteAccountProps): JSX.Element => {
  const [deleteTransactionsValue, setDeleteTransactionsValue] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { toast } = useToast();

  const doDeleteAccount = (): void => {
    setIsLoading(true);

    deleteAccount(props.accountId, deleteTransactionsValue)
      .catch((error: AxiosError) => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: translateAxiosError(error),
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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

          <ResponsiveButton loading={isLoading} variant="destructive" onClick={doDeleteAccount}>
            Delete
          </ResponsiveButton>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteAccount;
