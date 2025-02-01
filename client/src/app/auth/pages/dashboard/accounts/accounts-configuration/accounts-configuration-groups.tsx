import React from 'react';
import { Sortable, SortableItem } from '@/components/sortable';
import AccountsConfigurationGroup from './accounts-configuration-group';
import { IInstitution } from '@/types/institution';

interface AccountsConfigurationGroupsProps {
  sortedInstitutions: IInstitution[];
  setSortedInstitutions: React.Dispatch<React.SetStateAction<IInstitution[]>>;
  isReorder: boolean;
}

const AccountsConfigurationGroups = (props: AccountsConfigurationGroupsProps) => {
  const updateInstitution = (institution: IInstitution) => {
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
          {props.sortedInstitutions.map((institution: IInstitution) => (
            <SortableItem value={institution.id} key={institution.id}>
              <AccountsConfigurationGroup
                institution={institution}
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
