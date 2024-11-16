import { filterInvisibleTransactions } from '@/lib/transactions';
import TransactionsConfiguration from '../transactions-configuration/transactions-configuration';
import { Transaction } from '@/types/transaction';
import { SortDirection } from './sort-button';
import SortByMenu, { Sorts } from './sort-by-menu';

interface TransactionsHeaderProps {
  transactions: Transaction[];
  sort: Sorts;
  setSort: (newSort: Sorts) => void;
  sortDirection: SortDirection;
  setSortDirection: (newSortDirection: SortDirection) => void;
}

const TransactionsHeader = (props: TransactionsHeaderProps): JSX.Element => {
  return (
    <div className="flex w-full flex-row items-end">
      <SortByMenu
        currentSort={props.sort}
        setCurrentSort={props.setSort}
        sortDirection={props.sortDirection}
        setSortDirection={props.setSortDirection}
      />
      <div className="grow" />
      <TransactionsConfiguration
        transactions={filterInvisibleTransactions(props.transactions)}
      />
    </div>
  );
};

export default TransactionsHeader;
