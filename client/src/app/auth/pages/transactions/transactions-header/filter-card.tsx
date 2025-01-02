import AccountInput from '@/components/account-input';
import CategoryInput from '@/components/category-input';
import DatePickerWithRange from '@/components/date-range-picker';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Filters, transactionCategories } from '@/types/transaction';
import { DateRange } from 'react-day-picker';

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
    <Card className="flex flex-col gap-1 p-2">
      <span className="text-lg font-semibold">Filter</span>
      <Separator />
      <div className="flex w-full flex-row flex-wrap gap-4">
        <span className="grow">
          <DatePickerWithRange
            value={props.filters.dateRange}
            onSelect={(dateRange: DateRange) => {
              props.setFilters({
                ...props.filters,
                dateRange: dateRange,
              });
            }}
          />
        </span>
        <span className="grow">
          <AccountInput
            selectedAccountIds={props.filters.accounts}
            setSelectedAccountIds={(newAccountIds: string[]) => {
              props.setFilters({
                ...props.filters,
                accounts: newAccountIds,
              });
            }}
            hideHidden={true}
          />
        </span>
        <span className="grow">
          <CategoryInput
            selectedCategory={props.filters.category}
            categories={transactionCategories}
            setSelectedCategory={(newCategory: string) => {
              props.setFilters({
                ...props.filters,
                category: newCategory,
              });
            }}
          />
        </span>
      </div>
    </Card>
  );
};

export default FilterCard;
