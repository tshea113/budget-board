import AccountInput from '@/components/account-input';
import { Card } from '@/components/ui/card';
import { Filters } from '@/types/transaction';

interface FilterCardProps {
  isOpen: boolean;
  filters: Filters;
  setFilters: (newFilters: Filters) => void;
}

const FilterCard = (props: FilterCardProps): JSX.Element => {
  if (!props.isOpen) {
    return <></>;
  }

  return (
    <Card>
      <div className="flex w-full flex-row p-1">
        <div className="flex flex-col gap-1">
          <span>Account</span>
          <AccountInput
            selectedAccountIds={props.filters.accounts}
            setSelectedAccountIds={(newAccountIds: string[]) => {
              props.setFilters({ accounts: newAccountIds });
            }}
          />
        </div>
        <div className="flex flex-col gap-1"></div>
      </div>
    </Card>
  );
};

export default FilterCard;
