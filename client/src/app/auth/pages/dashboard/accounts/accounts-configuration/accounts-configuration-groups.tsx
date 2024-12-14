import React from 'react';
import { Sortable, SortableItem } from '@/components/sortable';
import AccountsConfigurationGroup from './accounts-configuration-group';
import { Institution } from '@/types/institution';

interface AccountsConfigurationGroupsProps {
  sortedInstitutions: Institution[];
  setSortedInstitutions: React.Dispatch<React.SetStateAction<Institution[]>>;
  isReorder: boolean;
}

const AccountsConfigurationGroups = (props: AccountsConfigurationGroupsProps) => {
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
                group={institution}
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
