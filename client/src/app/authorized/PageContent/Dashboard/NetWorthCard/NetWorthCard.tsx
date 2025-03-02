import classes from "./NetWorthCard.module.css";

import { Card, Stack, Title } from "@mantine/core";
import React from "react";
import NetWorthItem from "./NetWorthItem/NetWorthItem";
import { filterVisibleAccounts } from "@helpers/accounts";
import { AuthContext } from "@components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { IAccount } from "@models/account";
import { AxiosResponse } from "axios";

const NetWorthCard = (): React.ReactNode => {
  const { request } = React.useContext<any>(AuthContext);
  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<IAccount[]> => {
      const res: AxiosResponse = await request({
        url: "/api/account",
        method: "GET",
      });

      if (res.status === 200) {
        return res.data as IAccount[];
      }

      return [];
    },
  });

  const validAccounts = filterVisibleAccounts(accountsQuery.data ?? []);

  return (
    <Card
      className={classes.card}
      w="100%"
      padding="xs"
      radius="md"
      shadow="sm"
      withBorder
    >
      <Stack className={classes.content}>
        <Title order={3}>Net Worth</Title>
        <Card className={classes.group} radius="lg">
          <NetWorthItem
            accounts={validAccounts}
            types={["Checking", "Credit Card"]}
            title="Spending"
          />
          <NetWorthItem
            accounts={validAccounts}
            types={["Loan"]}
            title="Loans"
          />
          <NetWorthItem
            accounts={validAccounts}
            types={["Savings"]}
            title="Savings"
          />
        </Card>
        <Card className={classes.group} radius="lg">
          <NetWorthItem
            accounts={validAccounts}
            types={["Checking", "Credit Card", "Loan", "Savings"]}
            title="Liquid"
          />
          <NetWorthItem
            accounts={validAccounts}
            types={["Investment"]}
            title="Investments"
          />
        </Card>
        <Card className={classes.group} radius="lg">
          <NetWorthItem accounts={validAccounts} title="Total" />
        </Card>
      </Stack>
    </Card>
  );
};

export default NetWorthCard;
