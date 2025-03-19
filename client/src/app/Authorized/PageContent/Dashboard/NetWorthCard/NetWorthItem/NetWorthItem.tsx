import classes from "./NetWorthItem.module.css";

import { Group, Text } from "@mantine/core";
import { IAccount } from "~/models/account";
import { convertNumberToCurrency } from "~/helpers/currency";
import {
  getAccountsOfTypes,
  sumAccountsTotalBalance,
} from "~/helpers/accounts";
import React from "react";

interface NetWorthItemProps {
  title: string;
  types?: string[];
  accounts: IAccount[];
}

const NetWorthItem = (props: NetWorthItemProps): React.ReactNode => {
  const summedAccountsTotalBalance = sumAccountsTotalBalance(
    props.types
      ? getAccountsOfTypes(props.accounts, props.types)
      : props.accounts
  );

  return (
    <Group className={classes.root} justify="space-between" wrap="nowrap">
      <Text fw={500}>{props.title}</Text>
      <Text
        style={{
          color:
            summedAccountsTotalBalance < 0
              ? "var(--mantine-color-red-6)"
              : "var(--mantine-color-green-6)",
          fontWeight: 600,
        }}
      >
        {convertNumberToCurrency(summedAccountsTotalBalance, true)}
      </Text>
    </Group>
  );
};

export default NetWorthItem;
