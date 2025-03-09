import classes from "./AssetsTab.module.css";

import { Stack } from "@mantine/core";
import React from "react";
import { DateValue } from "@mantine/dates";
import { getDateFromMonthsAgo } from "@helpers/datetime";
import AccountsSelectHeader from "@components/AccountsSelectHeader/AccountsSelectHeader";

const AssetsTab = (): React.ReactNode => {
  const [selectedAccountIds, setSelectedAccountIds] = React.useState<string[]>(
    []
  );
  const [dateRange, setDateRange] = React.useState<[DateValue, DateValue]>([
    getDateFromMonthsAgo(1),
    new Date(),
  ]);

  return (
    <Stack className={classes.root}>
      <AccountsSelectHeader
        selectedAccountIds={selectedAccountIds}
        setSelectedAccountIds={setSelectedAccountIds}
        dateRange={dateRange}
        setDateRange={setDateRange}
        filters={["Checking", "Savings", "Investment", "Cash"]}
      />
    </Stack>
  );
};

export default AssetsTab;
