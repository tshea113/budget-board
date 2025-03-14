import classes from "./UncategorizedTransactionsCard.module.css";

import { AuthContext } from "@components/Auth/AuthProvider";
import {
  getTransactionsByCategory,
  getVisibleTransactions,
} from "@helpers/transactions";
import { Card, Group, ScrollArea, Skeleton, Stack, Title } from "@mantine/core";
import {
  defaultTransactionCategories,
  ITransaction,
} from "@models/transaction";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import React from "react";
import UncategorizedTransaction from "./UncategorizedTransaction/UncategorizedTransaction";
import { ICategoryResponse } from "@models/category";

const UncategorizedTransactionsCard = (): React.ReactNode => {
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

  const sortedFilteredTransactions = React.useMemo(
    () =>
      getVisibleTransactions(
        getTransactionsByCategory(transactionsQuery.data ?? [], "")
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactionsQuery.data]
  );

  if (sortedFilteredTransactions.length === 0) {
    return null;
  }

  return (
    <Card className={classes.root} withBorder radius="md">
      <Group justify="center">
        <Title order={2}>Uncategorized Transactions</Title>
      </Group>
      {transactionsQuery.isPending ? (
        <Skeleton height={350} radius="lg" />
      ) : (
        <ScrollArea.Autosize
          className={classes.scrollArea}
          mah={350}
          type="auto"
          offsetScrollbars
        >
          <Stack className={classes.transactionList}>
            {sortedFilteredTransactions.map((transaction: ITransaction) => (
              <UncategorizedTransaction
                key={transaction.id}
                transaction={transaction}
                categories={transactionCategoriesWithCustom}
              />
            ))}
          </Stack>
        </ScrollArea.Autosize>
      )}
    </Card>
  );
};

export default UncategorizedTransactionsCard;
