import { Card, Flex, Group, Text } from "@mantine/core";
import React from "react";
import { convertNumberToCurrency } from "~/helpers/currency";
import { getGoalTargetAmount } from "~/helpers/goals";
import { IGoalResponse } from "~/models/goal";

interface CompletedGoalCardProps {
  goal: IGoalResponse;
}

const CompletedGoalCard = (props: CompletedGoalCardProps): React.ReactNode => {
  return (
    <Card padding="0.5rem" radius="md">
      <Flex
        justify="space-between"
        align={{ base: "start", xs: "center" }}
        direction={{ base: "column", xs: "row" }}
      >
        <Text size="lg" fw={600}>
          {props.goal.name}
        </Text>
        <Flex
          gap={0}
          direction={{ base: "row", xs: "column" }}
          justify={{ base: "space-between", xs: "flex-end" }}
          w={{ base: "100%", xs: "auto" }}
        >
          <Group gap={5}>
            <Text>Total:</Text>
            <Text fw={600}>
              {convertNumberToCurrency(
                getGoalTargetAmount(
                  props.goal.amount,
                  props.goal.initialAmount
                ),
                true
              )}
            </Text>
          </Group>
          <Group gap={5}>
            <Text>Completed:</Text>
            <Text fw={600}>
              {new Date(props.goal.completed ?? 0).toLocaleDateString()}
            </Text>
          </Group>
        </Flex>
      </Flex>
    </Card>
  );
};

export default CompletedGoalCard;
