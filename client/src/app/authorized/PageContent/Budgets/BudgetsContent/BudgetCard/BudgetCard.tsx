import { getBudgetValueColor } from "@helpers/budgets";
import classes from "./BudgetCard.module.css";

import { convertNumberToCurrency } from "@helpers/currency";
import { Card, Flex, Group, Progress, Stack, Text } from "@mantine/core";
import { IBudget } from "@models/budget";
import React from "react";

interface BudgetCardProps {
  budgets: IBudget[];
  categoryDisplayString: string;
  amount: number;
  isIncome: boolean;
}

const BudgetCard = (props: BudgetCardProps): React.ReactNode => {
  const limit = React.useMemo(
    () => props.budgets.reduce((n: number, b: IBudget) => n + b.limit, 0),
    [props.budgets]
  );

  const percentComplete = Math.round(
    ((props.amount * (props.isIncome ? 1 : -1)) / limit) * 100
  );

  return (
    <Card className={classes.root} radius="md">
      <Stack className={classes.budgetContainer}>
        <Group className={classes.dataContainer}>
          <Group className={classes.budgetNameContainer}>
            <Text className={classes.text}>{props.categoryDisplayString}</Text>
          </Group>
          <Group className={classes.budgetValuesContainer}>
            <Flex className={classes.numberContainer}>
              <Text className={classes.text}>
                {convertNumberToCurrency(
                  props.amount * (props.isIncome ? 1 : -1),
                  false
                )}
              </Text>
            </Flex>
            <Flex className={classes.numberContainer}>
              <Text className={classes.text}>
                {convertNumberToCurrency(limit, false)}
              </Text>
            </Flex>
            <Flex className={classes.numberContainer}>
              <Text
                className={classes.text}
                c={getBudgetValueColor(percentComplete, props.isIncome)}
              >
                {convertNumberToCurrency(
                  Math.round(limit - props.amount * (props.isIncome ? 1 : -1)),
                  false
                )}
              </Text>
            </Flex>
          </Group>
        </Group>
        <Progress.Root size={16} radius="xl">
          <Progress.Section
            value={percentComplete}
            color={getBudgetValueColor(percentComplete, props.isIncome)}
          >
            <Progress.Label>{percentComplete.toFixed(0)}%</Progress.Label>
          </Progress.Section>
        </Progress.Root>
      </Stack>
    </Card>
  );
};

export default BudgetCard;
