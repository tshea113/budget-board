import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { updateAccount } from '@/lib/accounts';
import { translateAxiosError } from '@/lib/request';
import { type Account } from '@/types/account';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React from 'react';

interface AccountsConfigurationCardProps {
  account: Account;
}

const AccountsConfigurationCard = (props: AccountsConfigurationCardProps): JSX.Element => {
  const [hideTransactionsValue, setHideFromTransactionsValue] = React.useState(
    props.account.hideTransactions ?? false
  );
  const [accountNameValue, setAccountNameValue] = React.useState(props.account.name);
  const [valueDirty, setValueDirty] = React.useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const doUpdateAccount = useMutation({
    mutationFn: async () => {
      const account: Account = {
        id: props.account.id,
        syncID: props.account.syncID,
        name: accountNameValue,
        institution: props.account.institution,
        type: props.account.type,
        subtype: props.account.subtype,
        currentBalance: props.account.currentBalance,
        hideTransactions: hideTransactionsValue,
        userID: props.account.userID,
      };

      return await updateAccount(account);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setValueDirty(false);
    },
    onError: (error: AxiosError) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: translateAxiosError(error),
      });
    },
  });

  return (
    <Card className="m-2 p-3">
      <div className="flex h-6 flex-row items-center">
        <div className="flex w-1/4">
          <Input
            value={accountNameValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAccountNameValue(e.target.value);
              setValueDirty(true);
            }}
          />
        </div>
        <div className="flex w-1/4 justify-center">
          <Checkbox
            id="hidden"
            checked={hideTransactionsValue}
            onCheckedChange={() => {
              setHideFromTransactionsValue(!hideTransactionsValue);
              setValueDirty(true);
            }}
          />
        </div>
        {valueDirty && (
          <div className="flex flex-row items-center space-x-2">
            <ResponsiveButton
              className="m-0 h-7 w-10 p-0"
              onClick={() => {
                doUpdateAccount.mutate();
              }}
              loading={doUpdateAccount.isPending}
            >
              <CheckIcon className="h-4 w-4" />
            </ResponsiveButton>
            <ResponsiveButton
              className="m-0 h-7 w-10 p-0"
              onClick={() => {
                setAccountNameValue(props.account.name);
                setHideFromTransactionsValue(props.account.hideTransactions);
                setValueDirty(false);
              }}
              loading={false}
            >
              <Cross2Icon className="h-4 w-4" />
            </ResponsiveButton>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AccountsConfigurationCard;
