import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { translateAxiosError } from '@/lib/requests';
import { accountCategories, type Account } from '@/types/account';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React from 'react';
import DeleteAccount from './delete-account';
import { AuthContext } from '@/components/auth-provider';
import { Label } from '@/components/ui/label';
import CategoryInput from '@/components/category-input';
import { getIsParentCategory, getParentCategory } from '@/lib/category';
import { toast } from 'sonner';

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
  const [accountTypeValue, setAccountTypeValue] = React.useState(props.account.type);
  const [accountSubTypeValue, setAccountSubTypeValue] = React.useState(
    props.account.subtype
  );
  const [valueDirty, setValueDirty] = React.useState(false);

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();

  const doUpdateAccount = useMutation({
    mutationFn: async () => {
      const newAccount: Account = {
        id: props.account.id,
        syncID: props.account.syncID,
        name: accountNameValue,
        institution: props.account.institution,
        type: accountTypeValue,
        subtype: accountSubTypeValue,
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
      toast.error(translateAxiosError(error));
    },
  });

  return (
    <Card className="grid grid-cols-6 grid-rows-3 items-center justify-items-center space-y-1 p-2 md:grid-cols-7 md:grid-rows-1">
      <Input
        className="col-span-6 md:col-span-2"
        value={accountNameValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setAccountNameValue(e.target.value);
          setValueDirty(true);
        }}
      />
      <div className="col-span-6 md:col-span-2">
        <CategoryInput
          initialValue={
            props.account.subtype && props.account.subtype.length > 0
              ? (props.account.subtype ?? '')
              : (props.account.type ?? '')
          }
          onSelectChange={function (type: string): void {
            setAccountTypeValue(getParentCategory(type, accountCategories));
            getIsParentCategory(type, accountCategories)
              ? setAccountSubTypeValue('')
              : setAccountSubTypeValue(type);
            setValueDirty(true);
          }}
          categories={accountCategories}
        />
      </div>
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
                setAccountTypeValue(props.account.type);
                setAccountSubTypeValue(props.account.subtype);
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
