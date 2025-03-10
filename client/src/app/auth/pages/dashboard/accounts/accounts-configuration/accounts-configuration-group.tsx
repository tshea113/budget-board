import { SortableDragHandle } from '@/components/sortable';
import { Card } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';
import AccountsConfigurationCards from './accounts-configuration-cards';
import { Separator } from '@/components/ui/separator';
import { IInstitution } from '@/types/institution';
import { IAccount, IAccountIndexRequest } from '@/types/account';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/components/auth-provider';
import { AxiosError } from 'axios';
import { translateAxiosError } from '@/lib/requests';
import { toast } from 'sonner';
import LoadingIcon from '@/components/loading-icon';

interface AccountsConfigurationGroupProps {
  institution: IInstitution;
  updateInstitution: (institution: IInstitution) => void;
  isReorder: boolean;
}

const AccountsConfigurationGroup = (props: AccountsConfigurationGroupProps) => {
  const [sortedAccounts, setSortedAccounts] = React.useState<IAccount[]>(
    props.institution.accounts
      .filter((a) => a.deleted === null)
      .sort((a, b) => a.index - b.index)
  );

  const { request } = React.useContext<any>(AuthContext);
  const queryClient = useQueryClient();
  const doIndexAccounts = useMutation({
    mutationFn: async (accounts: IAccountIndexRequest[]) =>
      await request({
        url: '/api/account/order',
        method: 'PUT',
        data: accounts,
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: ['accounts'],
      }),
    onError: (error: AxiosError) => toast.error(translateAxiosError(error)),
  });

  React.useEffect(() => {
    if (!props.isReorder) {
      const indexedAccounts: IAccountIndexRequest[] = sortedAccounts.map(
        (acc, index) => ({
          id: acc.id,
          index,
        })
      );
      doIndexAccounts.mutate(indexedAccounts);
    }
  }, [props.isReorder]);

  React.useEffect(() => {
    setSortedAccounts(
      props.institution.accounts
        .filter((a) => a.deleted === null)
        .sort((a, b) => a.index - b.index)
    );
  }, [props.institution.accounts]);

  return (
    <Card className="flex flex-row items-center gap-2 border-2 bg-background p-2">
      <div className="shrink-0 self-stretch">
        {props.isReorder && (
          <SortableDragHandle variant="outline" size="icon" className="h-full w-7">
            <GripVertical />
          </SortableDragHandle>
        )}
      </div>
      <div className="flex h-full w-full flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">
            {props.institution.name}
          </span>
          {doIndexAccounts.isPending && <LoadingIcon className="size-5" />}
        </div>
        <Separator />
        <AccountsConfigurationCards
          accounts={sortedAccounts}
          updateAccounts={setSortedAccounts}
          isReorder={props.isReorder}
        />
      </div>
    </Card>
  );
};

export default AccountsConfigurationGroup;
