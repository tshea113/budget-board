import classes from "./Dashboard.module.css";

import { Flex, Stack } from "@mantine/core";
import React from "react";
import AccountsCard from "./AccountsCard/AccountsCard";
import NetWorthCard from "./NetWorthCard/NetWorthCard";
import Footer from "./Footer/Footer";
import SpendingTrendsCard from "./SpendingTrendsCard/SpendingTrendsCard";

const Dashboard = (): React.ReactNode => {
  return (
    <Stack className={classes.root}>
      <Flex className={classes.mainContent}>
        <Stack className={classes.accountColumn}>
          <AccountsCard />
          <NetWorthCard />
        </Stack>
        <Stack className={classes.feedColumn}>
          <SpendingTrendsCard />
        </Stack>
      </Flex>
      <Footer />
    </Stack>
  );
};

export default Dashboard;
