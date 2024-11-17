import AccountInput from '@/components/account-input';
import CategoryInput from '@/components/category-input';
import DatePicker from '@/components/date-picker';
import { Card } from '@/components/ui/card';
import { getStandardDate } from '@/lib/utils';
import { Filters, transactionCategories } from '@/types/transaction';

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
      <div className="flex w-full flex-row gap-4 p-1">
        <div className="flex flex-col gap-1">
          <span>Start Date</span>
          <DatePicker
            value={props.filters.startDate}
            onDayClick={(date: Date) => {
              props.setFilters({
                accounts: props.filters.accounts,
                category: props.filters.category,
                startDate: getStandardDate(date),
                endDate: props.filters.endDate,
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span>End Date</span>
          <DatePicker
            value={props.filters.endDate}
            onDayClick={(date: Date) => {
              props.setFilters({
                accounts: props.filters.accounts,
                category: props.filters.category,
                startDate: props.filters.startDate,
                endDate: getStandardDate(date),
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span>Account</span>
          <AccountInput
            selectedAccountIds={props.filters.accounts}
            setSelectedAccountIds={(newAccountIds: string[]) => {
              props.setFilters({
                accounts: newAccountIds,
                category: props.filters.category,
                startDate: props.filters.startDate,
                endDate: props.filters.endDate,
              });
            }}
            hideHidden={true}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span>Category</span>
          <CategoryInput
            selectedCategory={props.filters.category}
            categories={transactionCategories}
            setSelectedCategory={(newCategory: string) => {
              props.setFilters({
                accounts: props.filters.accounts,
                category: newCategory,
                startDate: props.filters.startDate,
                endDate: props.filters.endDate,
              });
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default FilterCard;
