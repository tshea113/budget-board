import classes from "./Transactions.module.css";

import { Stack } from "@mantine/core";
import TransactionsHeader from "./TransactionsHeader/TransactionsHeader";
import React from "react";
import { SortDirection } from "@components/SortButton";
import { Filters, ITransaction } from "@models/transaction";
import { Sorts } from "./TransactionsHeader/SortMenu/SortMenuHelpers";
import TransactionCards from "./TransactionCards.tsx/TransactionCards";
import { AuthContext } from "@components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const Transactions = (): React.ReactNode => {
  const [sort, setSort] = React.useState(Sorts.Date);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(
    SortDirection.Decending
  );
  const [filters, setFilters] = React.useState<Filters>(new Filters());

  const { request } = React.useContext<any>(AuthContext);

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

  return (
    <Stack className={classes.root}>
      <TransactionsHeader
        sort={sort}
        setSort={setSort}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        filters={filters}
        setFilters={setFilters}
      />
      <TransactionCards
        sort={sort}
        sortDirection={sortDirection}
        transactions={transactionsQuery.data ?? []}
      />
    </Stack>
  );
};

export default Transactions;
