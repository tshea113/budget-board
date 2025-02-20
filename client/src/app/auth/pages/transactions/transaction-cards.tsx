import { ITransaction, TransactionCardType } from '@/types/transaction';
import TransactionCard from './transaction-card';
import React, { type JSX } from 'react';
import PageSizeSelect from '@/components/page-size-select';
import PageSelect from '@/components/page-select';
import { SortDirection } from './transactions-header/sort-button';
import { Sorts } from './transactions-header/sort-by-menu';

interface TransactionCardsProps {
  transactions: ITransaction[];
  sort: Sorts;
  sortDirection: SortDirection;
}

const TransactionCards = (props: TransactionCardsProps): JSX.Element => {
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(25);

  React.useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  const totalPages = React.useMemo(
    () => Math.ceil(props.transactions.length / itemsPerPage),
    [props.transactions, itemsPerPage]
  );

  const sortTransactions = (
    transactions: ITransaction[],
    sortValue: Sorts
  ): ITransaction[] => {
    switch (sortValue) {
      case Sorts.Date:
        return props.sortDirection === SortDirection.Decending
          ? transactions.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
          : transactions.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
      case Sorts.Merchant:
        return props.sortDirection === SortDirection.Decending
          ? transactions.sort((a, b) =>
              (b.merchantName ?? '')
                .toLocaleLowerCase()
                .localeCompare((a.merchantName ?? '').toLocaleLowerCase())
            )
          : transactions.sort((a, b) =>
              (a.merchantName ?? '')
                .toLocaleLowerCase()
                .localeCompare((b.merchantName ?? '').toLocaleLowerCase())
            );
      case Sorts.Category:
        return props.sortDirection === SortDirection.Decending
          ? transactions.sort((a, b) =>
              (b.subcategory === null || b.subcategory === ''
                ? (b.category ?? 'Uncategorized')
                : (b.subcategory ?? 'Uncategorized')
              )
                .toLocaleLowerCase()
                .localeCompare(
                  (a.subcategory === null || a.subcategory === ''
                    ? (a.category ?? 'Uncategorized')
                    : (a.subcategory ?? 'Uncategorized')
                  ).toLocaleLowerCase()
                )
            )
          : transactions.sort((a, b) =>
              (a.subcategory === null || a.subcategory === ''
                ? (a.category ?? 'Uncategorized')
                : (a.subcategory ?? 'Uncategorized')
              )
                .toLocaleLowerCase()
                .localeCompare(
                  (b.subcategory === null || b.subcategory === ''
                    ? (b.category ?? 'Uncategorized')
                    : (b.subcategory ?? 'Uncategorized')
                  ).toLocaleLowerCase()
                )
            );
      case Sorts.Amount:
        return props.sortDirection === SortDirection.Decending
          ? transactions.sort((a, b) => (a.amount < b.amount ? 1 : -1))
          : transactions.sort((a, b) => (a.amount > b.amount ? 1 : -1));
      default:
        return transactions;
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {sortTransactions(props.transactions, props.sort)
        .slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage)
        .map((transaction: ITransaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            type={TransactionCardType.Normal}
          />
        ))}
      <div className="flex flex-row flex-wrap justify-center gap-2">
        <PageSizeSelect
          pageSize={itemsPerPage}
          setPageSize={setItemsPerPage}
          pageSizeOptions={[25, 50, 100]}
        />
        <PageSelect pageNumber={page} setPageNumber={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default TransactionCards;
