import { convertNumberToCurrency } from "@helpers/currency";
import { Group, Stack, Text } from "@mantine/core";
import { IAccount } from "@models/account";
import React from "react";

interface AccountItemProps {
  account: IAccount;
}

const AccountItem = (props: AccountItemProps): React.ReactNode => {
  return (
    <Stack gap={0.5}>
      <Group justify="space-between" wrap="nowrap">
        <Text fw={500}>{props.account.name}</Text>
        <Text
          style={{
            color:
              props.account.currentBalance < 0
                ? "var(--mantine-color-red-6)"
                : "var(--mantine-color-green-6)",
            fontWeight: 600,
          }}
        >
          {convertNumberToCurrency(props.account.currentBalance, true)}
        </Text>
      </Group>
      <Text
        style={{ fontWeight: 400, color: "var(--mantine-color-dimmed)" }}
        size="sm"
      >
        {"Last updated: "}
        {props.account.balanceDate
          ? new Date(props.account.balanceDate).toLocaleString()
          : "Never!"}
      </Text>
    </Stack>
  );
};

export default AccountItem;
