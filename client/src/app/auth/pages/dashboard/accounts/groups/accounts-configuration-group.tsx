import { SortableDragHandle } from '@/components/sortable';
import { Card } from '@/components/ui/card';
import { Account } from '@/types/account';
import { GripVertical } from 'lucide-react';
import AccountsConfigurationCards from '../accounts-configuration/accounts-configuration-cards';

interface AccountsConfigurationGroupProps {
  group: { key: string; value: Account[] };
  isReorder: boolean;
}

const AccountsConfigurationGroup = (props: AccountsConfigurationGroupProps) => {
  return (
    <Card
      className="flex flex-row items-center gap-2 bg-background p-2"
      key={props.group.key}
    >
      {/* TODO: I want this to be full height */}
      {props.isReorder && (
        <SortableDragHandle
          variant="outline"
          size="icon"
          className="h-full min-h-[75px] w-7 shrink-0"
        >
          <GripVertical />
        </SortableDragHandle>
      )}
      <div className="flex w-full flex-col gap-2">
        <span>{props.group.key}</span>
        <AccountsConfigurationCards
          accounts={props.group.value}
          isReorder={props.isReorder}
        />
      </div>
    </Card>
  );
};

export default AccountsConfigurationGroup;
