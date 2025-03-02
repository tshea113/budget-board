import React from "react";
import TransactionCard from "./TransactionCard/TransactionCard";
import {
  defaultTransactionCategories,
  Filters,
  ITransaction,
} from "@models/transaction";
import { Sorts } from "../TransactionsHeader/SortMenu/SortMenuHelpers";
import { SortDirection } from "@components/SortButton";
import {
  getFilteredTransactions,
  sortTransactions,
} from "@helpers/transactions";
import { Stack } from "@mantine/core";
import { AuthContext } from "@components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ICategoryResponse } from "@models/category";

interface TransactionCardsProps {
  filters: Filters;
  sort: Sorts;
  sortDirection: SortDirection;
}

const TransactionCards = (props: TransactionCardsProps): React.ReactNode => {
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(25);

  const { request } = React.useContext<any>(AuthContext);

  const transactionCategoriesQuery = useQuery({
    queryKey: ["transactionCategories"],
    queryFn: async () => {
      const res = await request({
        url: "/api/transactionCategory",
        method: "GET",
      });

      if (res.status === 200) {
        return res.data as ICategoryResponse[];
      }

      return undefined;
    },
  });

  const transactionCategoriesWithCustom = defaultTransactionCategories.concat(
    transactionCategoriesQuery.data ?? []
  );

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: async (): Promise<ITransaction[]> => {
      const res: AxiosResponse = await request({
        url: "/api/transaction",
        method: "GET",
      });

      if (res.status === 200) {
        return res.data as ITransaction[];
      }

      return [];
    },
  });

  const filteredTransactions = getFilteredTransactions(
    transactionsQuery.data ?? [],
    props.filters,
    transactionCategoriesWithCustom
  );

  return (
    <Stack gap={10}>
      {sortTransactions(filteredTransactions, props.sort, props.sortDirection)
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
