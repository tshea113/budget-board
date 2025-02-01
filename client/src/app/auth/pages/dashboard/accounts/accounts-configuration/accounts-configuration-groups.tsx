import React from 'react';
import { Sortable, SortableItem } from '@/components/sortable';
import AccountsConfigurationGroup from './accounts-configuration-group';
import { Institution } from '@/types/institution';
import { IAccount } from '@/types/account';

interface AccountsConfigurationGroupsProps {
  sortedInstitutions: Institution[];
  accounts: IAccount[];
  setSortedInstitutions: React.Dispatch<React.SetStateAction<Institution[]>>;
  isReorder: boolean;
}

const AccountsConfigurationGroups = (props: AccountsConfigurationGroupsProps) => {
  const updateInstitution = (institution: Institution) => {
    const newInstitutions = props.sortedInstitutions.map((i) =>
      i.id === institution.id ? institution : i
    );
    props.setSortedInstitutions(newInstitutions);
  };

  return (
    <div>
      <Sortable
        value={props.sortedInstitutions}
        onMove={({ activeIndex: from, overIndex: to }) => {
          const newInstitutions = [...props.sortedInstitutions];
          const [movedInstitution] = newInstitutions.splice(from, 1);
          newInstitutions.splice(to, 0, movedInstitution);
          props.setSortedInstitutions(newInstitutions);
        }}
      >
        <div className="flex flex-col gap-2">
          {props.sortedInstitutions.map((institution: Institution) => (
            <SortableItem value={institution.id} key={institution.id}>
              <AccountsConfigurationGroup
                institution={institution}
                accounts={props.accounts.filter(
                  (a) => a.institutionID === institution.id
                )}
                updateInstitution={updateInstitution}
                isReorder={props.isReorder}
              />
            </SortableItem>
          ))}
        </div>
      </Sortable>
    </div>
  );
};

export default AccountsConfigurationGroups;
