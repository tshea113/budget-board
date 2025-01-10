import TransactionsConfiguration from '../transactions-configuration/transactions-configuration';
import { Filters, Transaction } from '@/types/transaction';
import { SortDirection } from './sort-button';
import SortByMenu, { Sorts } from './sort-by-menu';
import { Button } from '@/components/ui/button';
import { FilterIcon } from 'lucide-react';
import FilterCard from './filter-card';
import React from 'react';
import { cn } from '@/lib/utils';

interface TransactionsHeaderProps {
  transactions: Transaction[];
  sort: Sorts;
  setSort: (newSort: Sorts) => void;
  sortDirection: SortDirection;
  setSortDirection: (newSortDirection: SortDirection) => void;
  filters: Filters;
  setFilters: (newFilters: Filters) => void;
}

const TransactionsHeader = (props: TransactionsHeaderProps): JSX.Element => {
  const [isFilterCardOpen, setIsFilterCardOpen] = React.useState(false);

  return (
    <div className="flex w-full flex-col gap-2 @container">
      <div className="flex flex-col items-start gap-4 @2xl:flex-row @2xl:items-center @2xl:justify-between">
        <SortByMenu
          currentSort={props.sort}
          setCurrentSort={props.setSort}
          sortDirection={props.sortDirection}
          setSortDirection={props.setSortDirection}
        />
        <div className="flex w-full flex-row items-center justify-end gap-2 @2xl:w-auto">
          <Button
            className={cn(
              'flex flex-row items-center gap-1',
              isFilterCardOpen ? 'border-primary text-primary hover:text-primary' : ''
            )}
            variant="outline"
            onClick={() => {
              if (isFilterCardOpen) {
                // Closing the filter card clears the filters
                props.setFilters(new Filters());
              }
              setIsFilterCardOpen(!isFilterCardOpen);
            }}
          >
            <span>Filter</span>
            <FilterIcon className="h-4 w-4" />
          </Button>
          <TransactionsConfiguration transactions={props.transactions} />
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <FilterCard
          isOpen={isFilterCardOpen}
          filters={props.filters}
          setFilters={props.setFilters}
        />
      </div>
    </div>
  );
};

export default TransactionsHeader;
