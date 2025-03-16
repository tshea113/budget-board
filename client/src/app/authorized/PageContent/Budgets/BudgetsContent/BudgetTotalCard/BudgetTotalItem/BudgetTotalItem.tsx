import classes from "./BudgetTotalItem.module.css";

import { getBudgetValueColor } from "@helpers/budgets";
import { convertNumberToCurrency } from "@helpers/currency";
import { Flex, Group, Progress, Stack, Text } from "@mantine/core";

interface BudgetTotalItemProps {
  label: string;
  amount: number;
  total: number;
  isIncome: boolean;
}

const BudgetTotalItem = (props: BudgetTotalItemProps): React.ReactNode => {
  const percentComplete = Math.round(
    ((props.amount * (props.isIncome ? 1 : -1)) / props.total) * 100
  );
  return (
    <Stack className={classes.root}>
      <Group className={classes.dataContainer}>
        <Flex>
          <Text className={classes.text}>{props.label}</Text>
        </Flex>
        <Flex gap="0.25rem">
          <Text
            className={classes.text}
            c={getBudgetValueColor(percentComplete, props.isIncome)}
          >
            {convertNumberToCurrency(
              props.amount * (props.isIncome ? 1 : -1),
              false
            )}
          </Text>
          <Text className={classes.text}>of</Text>
          <Text className={classes.text}>
            {convertNumberToCurrency(props.total, false)}
          </Text>
        </Flex>
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
  );
};

export default BudgetTotalItem;
