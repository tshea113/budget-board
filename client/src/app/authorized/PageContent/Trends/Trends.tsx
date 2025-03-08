import classes from "./Trends.module.css";

import { Stack, Tabs } from "@mantine/core";
import React from "react";
import SpendingTab from "./SpendingTab/SpendingTab";
import NetCashFlowTab from "./NetCashFlowTab/NetCashFlowTab";

const Trends = (): React.ReactNode => {
  return (
    <Stack className={classes.root}>
      <Tabs variant="outline" defaultValue="spending">
        <Tabs.List grow>
          <Tabs.Tab value="spending">Spending</Tabs.Tab>
          <Tabs.Tab value="netCashFlow">Net Cash Flow</Tabs.Tab>
          <Tabs.Tab value="assets">Assets</Tabs.Tab>
          <Tabs.Tab value="liabilities">Liabilities</Tabs.Tab>
          <Tabs.Tab value="netWorth">Net Worth</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="spending">
          <SpendingTab />
        </Tabs.Panel>
        <Tabs.Panel value="netCashFlow">
          <NetCashFlowTab />
        </Tabs.Panel>
        <Tabs.Panel value="assets">Assets content</Tabs.Panel>
        <Tabs.Panel value="liabilities">Liabilities content</Tabs.Panel>
        <Tabs.Panel value="netWorth">Net Worth content</Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Trends;
