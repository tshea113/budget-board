import { Transaction } from '@/types/transaction';
import TransactionCard, {
  TransactionCardType,
} from '../dashboard/uncategorized-transactions/transaction-card';
import React from 'react';

interface TransactionCardsProps {
  transactions: Transaction[];
}

const TransactionCards = (props: TransactionCardsProps): JSX.Element => {
  const [page, _setPage] = React.useState(1);
  const [itemsPerPage, _setItemsPerPage] = React.useState(25);

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
    </div>
  );
};

export default TransactionCards;
