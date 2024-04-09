import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { updateAccount } from '@/lib/accounts';
import { type Account } from '@/types/account';
import { CheckIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface AccountsConfigurationCardProps {
  account: Account;
}

const AccountsConfigurationCard = (props: AccountsConfigurationCardProps): JSX.Element => {
  const [hideTransactionsValue, setHideFromTransactionsValue] = React.useState(
    props.account.hideTransactions ?? false
  );
  const [valueDirty, setValueDirty] = React.useState(false);

  const queryClient = useQueryClient();

  const doUpdateAccount = useMutation({
    mutationFn: async () => {
      const account: Account = {
        id: props.account.id,
        syncID: props.account.syncID,
        name: props.account.name,
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
  });

  return (
    <Card className="m-2 p-3">
      <div className="flex h-6 flex-row items-center">
        <div className="flex w-1/4">{props.account.name}</div>
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
          <div>
            <ResponsiveButton
              className="m-0 h-7 w-7 p-0"
              onClick={() => {
                doUpdateAccount.mutate();
              }}
              loading={doUpdateAccount.isPending}
            >
              <CheckIcon className="h-4 w-4" />
            </ResponsiveButton>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AccountsConfigurationCard;
