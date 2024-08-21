import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { translateAxiosError } from '@/lib/requests';
import { type Account } from '@/types/account';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React from 'react';
import DeleteAccount from './delete-account';
import { AuthContext } from '@/components/auth-provider';
import { Label } from '@/components/ui/label';

interface AccountsConfigurationCardProps {
  account: Account;
}

const AccountsConfigurationCard = (
  props: AccountsConfigurationCardProps
): JSX.Element => {
  const [hideTransactionsValue, setHideTransactionsValue] = React.useState(
    props.account.hideTransactions ?? false
  );
  const [hideAccountValue, setHideAccountValue] = React.useState(
    props.account.hideAccount ?? false
  );
  const [accountNameValue, setAccountNameValue] = React.useState(props.account.name);
  const [valueDirty, setValueDirty] = React.useState(false);

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const doUpdateAccount = useMutation({
    mutationFn: async () => {
      const newAccount: Account = {
        id: props.account.id,
        syncID: props.account.syncID,
        name: accountNameValue,
        institution: props.account.institution,
        type: props.account.type,
        subtype: props.account.subtype,
        currentBalance: props.account.currentBalance,
        balanceDate: props.account.balanceDate,
        hideTransactions: hideTransactionsValue,
        hideAccount: hideAccountValue,
        deleted: props.account.deleted,
        userID: props.account.userID,
      };

      return await request({
        url: '/api/account',
        method: 'PUT',
        data: newAccount,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
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
    <Card className="grid grid-cols-6 grid-rows-2 items-center justify-items-center space-x-2 p-2 md:grid-cols-4 md:grid-rows-1">
      <Input
        className="col-span-6 md:col-span-1"
        value={accountNameValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setAccountNameValue(e.target.value);
          setValueDirty(true);
        }}
      />
      <div className="col-span-2 flex flex-row space-x-2 md:col-span-1">
        <Checkbox
          id="hidden"
          checked={hideAccountValue}
          onCheckedChange={() => {
            setHideAccountValue(!hideAccountValue);
            setValueDirty(true);
          }}
        />
        <Label className="md:hidden">Hide Account?</Label>
      </div>
      <div className="col-span-2 flex flex-row space-x-2 md:col-span-1">
        <Checkbox
          id="hidden"
          checked={hideTransactionsValue}
          onCheckedChange={() => {
            setHideTransactionsValue(!hideTransactionsValue);
            setValueDirty(true);
          }}
        />
        <Label className="md:hidden">Hide Transactions?</Label>
      </div>
      <div className="col-span-2 md:col-span-1">
        {valueDirty ? (
          <div className="flex flex-row items-center space-x-2">
            <ResponsiveButton
              className="m-0 h-7 w-7 p-0"
              onClick={() => {
                doUpdateAccount.mutate();
              }}
              loading={doUpdateAccount.isPending}
            >
              <CheckIcon className="h-4 w-4" />
            </ResponsiveButton>
            <ResponsiveButton
              className="m-0 h-7 w-7 p-0"
              onClick={() => {
                setAccountNameValue(props.account.name);
                setHideTransactionsValue(props.account.hideTransactions);
                setHideAccountValue(props.account.hideAccount);
                setValueDirty(false);
              }}
              loading={false}
            >
              <Cross2Icon className="h-4 w-4" />
            </ResponsiveButton>
          </div>
        ) : (
          <DeleteAccount accountId={props.account.id} />
        )}
      </div>
    </Card>
  );
};

export default AccountsConfigurationCard;
