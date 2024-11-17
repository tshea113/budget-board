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
          <span>From:</span>
          <DatePicker
            value={props.filters.fromDate}
            onDayClick={(date: Date) => {
              props.setFilters({
                accounts: props.filters.accounts,
                category: props.filters.category,
                fromDate: getStandardDate(date),
                toDate: props.filters.toDate,
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span>To:</span>
          <DatePicker
            value={props.filters.toDate}
            onDayClick={(date: Date) => {
              props.setFilters({
                accounts: props.filters.accounts,
                category: props.filters.category,
                fromDate: props.filters.fromDate,
                toDate: getStandardDate(date),
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span>Account:</span>
          <AccountInput
            selectedAccountIds={props.filters.accounts}
            setSelectedAccountIds={(newAccountIds: string[]) => {
              props.setFilters({
                accounts: newAccountIds,
                category: props.filters.category,
                fromDate: props.filters.fromDate,
                toDate: props.filters.toDate,
              });
            }}
            hideHidden={true}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span>Category:</span>
          <CategoryInput
            selectedCategory={props.filters.category}
            categories={transactionCategories}
            setSelectedCategory={(newCategory: string) => {
              props.setFilters({
                accounts: props.filters.accounts,
                category: newCategory,
                fromDate: props.filters.fromDate,
                toDate: props.filters.toDate,
              });
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default FilterCard;
