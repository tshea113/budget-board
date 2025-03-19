import { Button, Flex, Popover, Stack, Text } from "@mantine/core";
import { IAccount } from "$/models/account";
import { IGoalResponse } from "$/models/goal";
import React from "react";

interface GoalDetailsProps {
  goal: IGoalResponse;
}

const GoalDetails = (props: GoalDetailsProps): React.ReactNode => {
  return (
    <Flex onClick={(e) => e.stopPropagation()}>
      <Popover>
        <Popover.Target>
          <Button size="compact-xs" variant="transparent">
            View Details
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack gap={5}>
            <Text size="sm" fw={600}>
              Accounts
            </Text>
            <Stack>
              {props.goal.accounts.map((account: IAccount) => (
                <Text key={account.id} size="sm">
                  {account.name}
                </Text>
              ))}
            </Stack>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Flex>
  );
};

export default GoalDetails;
