import AccountInput from '@/components/account-input';
import { AuthContext } from '@/components/auth-provider';
import CategoryInput from '@/components/category-input';
import DatePickerWithRange from '@/components/date-range-picker';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ICategoryResponse } from '@/types/category';
import { Filters, defaultTransactionCategories } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { DateRange } from 'react-day-picker';

interface FilterCardProps {
  isOpen: boolean;
  filters: Filters;
  setFilters: (newFilters: Filters) => void;
}

const FilterCard = (props: FilterCardProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const transactionCategoriesQuery = useQuery({
    queryKey: ['transactionCategories'],
    queryFn: async () => {
      const res = await request({
        url: '/api/transactionCategory',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as ICategoryResponse[];
      }

      return undefined;
    },
  });

  if (!props.isOpen) {
    return <></>;
  }

  const transactionCategoriesWithCustom = defaultTransactionCategories.concat(
    transactionCategoriesQuery.data ?? []
  );

  return (
    <Card className="flex flex-col gap-1 p-2">
      <span className="text-lg font-semibold">Filter</span>
      <Separator />
      <div className="flex w-full flex-row flex-wrap gap-4">
        <div className="grow">
          <DatePickerWithRange
            value={props.filters.dateRange}
            onSelect={(dateRange: DateRange) => {
              props.setFilters({
                ...props.filters,
                dateRange: dateRange,
              });
            }}
          />
        </div>
        <div className="grow">
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
        </div>
        <div className="grow">
          {transactionCategoriesQuery.isPending ? (
            <Skeleton className="h-10 w-full min-w-[160px] max-w-full" />
          ) : (
            <CategoryInput
              selectedCategory={props.filters.category}
              categories={transactionCategoriesWithCustom}
              setSelectedCategory={(newCategory: string) => {
                props.setFilters({
                  ...props.filters,
                  category: newCategory,
                });
              }}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default FilterCard;
