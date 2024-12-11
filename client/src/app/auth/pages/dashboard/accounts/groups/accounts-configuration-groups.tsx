import { Sortable, SortableItem } from '@/components/sortable';
import { groupAccountsByInstitution } from '@/lib/accounts';
import { Account } from '@/types/account';
import React from 'react';
import AccountsConfigurationGroup from './accounts-configuration-group';

interface AccountsConfigurationGroupsProps {
  accounts: Account[];
  isReorder: boolean;
}

const AccountsConfigurationGroups = (props: AccountsConfigurationGroupsProps) => {
  const groupedAccounts = React.useMemo(
    () =>
      groupAccountsByInstitution(
        props.accounts.filter((a: Account) => a.deleted === null)
      ),
    [props.accounts]
  );

  const getCardsForMap = (map: Map<string, Account[]>): JSX.Element[] => {
    const comps: JSX.Element[] = [];
    map.forEach((value, key) =>
      comps.push(
        <SortableItem value={key}>
          <AccountsConfigurationGroup
            group={{ key, value }}
            isReorder={props.isReorder}
          />
        </SortableItem>
      )
    );
    return comps;
  };
  return (
    <div>
      <Sortable
        value={Array.from(groupedAccounts, ([key, value]) => ({ id: key, value }))}
      >
        <div className="flex flex-col gap-2">{getCardsForMap(groupedAccounts)}</div>
      </Sortable>
    </div>
  );
};

export default AccountsConfigurationGroups;
