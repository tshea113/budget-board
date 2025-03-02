import React from "react";
import TransactionCard from "./TransactionCard/TransactionCard";
import { ITransaction } from "@models/transaction";
import { Sorts } from "../TransactionsHeader/SortMenu/SortMenuHelpers";
import { SortDirection } from "@components/SortButton";
import { sortTransactions } from "@helpers/transactions";
import { Stack } from "@mantine/core";

interface TransactionCardsProps {
  transactions: ITransaction[];
  sort: Sorts;
  sortDirection: SortDirection;
}

const TransactionCards = (props: TransactionCardsProps): React.ReactNode => {
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(25);

  return (
    <Stack gap={10}>
      {sortTransactions(props.transactions, props.sort, props.sortDirection)
        .slice(
          (page - 1) * itemsPerPage,
          (page - 1) * itemsPerPage + itemsPerPage
        )
        .map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
    </Stack>
  );
};

export default TransactionCards;
