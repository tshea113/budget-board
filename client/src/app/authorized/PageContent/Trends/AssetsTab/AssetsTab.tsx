import classes from "./AssetsTab.module.css";

import { Stack } from "@mantine/core";
import React from "react";
import { DateValue } from "@mantine/dates";
import { getDateFromMonthsAgo } from "@helpers/datetime";
import AccountsSelectHeader from "@components/AccountsSelectHeader/AccountsSelectHeader";
import BalanceChart from "@components/Charts/BalanceChart/BalanceChart";
import { AuthContext } from "@components/Auth/AuthProvider";
import { useQueries, useQuery } from "@tanstack/react-query";
import { IBalance } from "@models/balance";
import { AxiosResponse } from "axios";
import { IAccount } from "@models/account";

const AssetsTab = (): React.ReactNode => {
  const [selectedAccountIds, setSelectedAccountIds] = React.useState<string[]>(
    []
  );
  const [dateRange, setDateRange] = React.useState<[DateValue, DateValue]>([
    getDateFromMonthsAgo(1),
    new Date(),
  ]);

  const { request } = React.useContext<any>(AuthContext);
  const balancesQuery = useQueries({
    queries: selectedAccountIds.map((accountId: string) => ({
      queryKey: ["balances", accountId],
      queryFn: async (): Promise<IBalance[]> => {
        const res: AxiosResponse = await request({
          url: "/api/balance",
          method: "GET",
          params: { accountId },
        });

        if (res.status === 200) {
          return res.data as IBalance[];
        }

        return [];
      },
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data ?? []).flat(1),
        isPending: results.some((result) => result.isPending),
      };
    },
  });

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

  return (
    <Stack className={classes.root}>
      <AccountsSelectHeader
        selectedAccountIds={selectedAccountIds}
        setSelectedAccountIds={setSelectedAccountIds}
        dateRange={dateRange}
        setDateRange={setDateRange}
        filters={["Checking", "Savings", "Investment", "Cash"]}
      />
      <BalanceChart
        balances={balancesQuery.data ?? []}
        accounts={(accountsQuery.data ?? []).filter((a) =>
          selectedAccountIds.includes(a.id)
        )}
        dateRange={dateRange}
        isPending={balancesQuery.isPending || accountsQuery.isPending}
      />
    </Stack>
  );
};

export default AssetsTab;
