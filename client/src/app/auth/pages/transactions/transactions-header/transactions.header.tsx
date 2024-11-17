import { filterInvisibleTransactions } from '@/lib/transactions';
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
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-row items-end gap-2">
        <SortByMenu
          currentSort={props.sort}
          setCurrentSort={props.setSort}
          sortDirection={props.sortDirection}
          setSortDirection={props.setSortDirection}
        />
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
        <div className="grow" />
        <TransactionsConfiguration
          transactions={filterInvisibleTransactions(props.transactions)}
        />
      </div>
      <FilterCard
        isOpen={isFilterCardOpen}
        filters={props.filters}
        setFilters={props.setFilters}
      />
    </div>
  );
};

export default TransactionsHeader;
