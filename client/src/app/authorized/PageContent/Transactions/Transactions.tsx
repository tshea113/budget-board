import classes from "./Transactions.module.css";

import { Stack } from "@mantine/core";
import TransactionsHeader from "./TransactionsHeader/TransactionsHeader";
import React from "react";
import { SortDirection } from "@components/SortButton";
import { Filters } from "@models/transaction";
import { Sorts } from "./TransactionsHeader/SortMenu/SortMenuHelpers";
import TransactionCards from "./TransactionCards.tsx/TransactionCards";

const Transactions = (): React.ReactNode => {
  const [sort, setSort] = React.useState(Sorts.Date);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(
    SortDirection.Decending
  );
  const [filters, setFilters] = React.useState<Filters>(new Filters());

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
        filters={filters}
        sort={sort}
        sortDirection={sortDirection}
      />
    </Stack>
  );
};

export default Transactions;
