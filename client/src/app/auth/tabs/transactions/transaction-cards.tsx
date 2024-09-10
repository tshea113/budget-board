import { Transaction } from '@/types/transaction';
import TransactionCard, { TransactionCardType } from './transaction-card';
import React from 'react';
import PageSizeSelect from '@/components/page-size-select';
import PageSelect from '@/components/page-select';

interface TransactionCardsProps {
  transactions: Transaction[];
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

  return (
    <div>
      {props.transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage)
        .map((transaction: Transaction) => (
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
