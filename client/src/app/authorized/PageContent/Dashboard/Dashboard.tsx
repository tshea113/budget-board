import classes from "./Dashboard.module.css";

import { Flex, Stack } from "@mantine/core";
import React from "react";
import AccountsCard from "./AccountsCard/AccountsCard";
import NetWorthCard from "./NetWorthCard/NetWorthCard";

const Dashboard = (): React.ReactNode => {
  return (
    <Stack className={classes.root}>
      <Flex className={classes.mainContent}>
        <Stack className={classes.accountColumn}>
          <AccountsCard />
          <NetWorthCard />
        </Stack>
        <Stack className={classes.feedColumn}>
          <p>feed</p>
        </Stack>
      </Flex>
      <p>Footer</p>
    </Stack>
  );
};

export default Dashboard;
