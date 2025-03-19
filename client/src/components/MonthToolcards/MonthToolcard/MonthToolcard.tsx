import { months } from "$helpers/utils";
import classes from "./MonthToolcard.module.css";

import { Card, Paper, Stack, Text } from "@mantine/core";
import { CashFlowValue } from "$models/budget";

interface MonthToolcardProps {
  date: Date;
  cashFlowValue: CashFlowValue;
  isSelected: boolean;
  isPending?: boolean;
  handleClick: (date: Date) => void;
}

const MonthToolcard = (props: MonthToolcardProps): React.ReactNode => {
  const getLightColor = (
    cashFlowValue: CashFlowValue,
    isSelected: boolean,
    isPending?: boolean
  ): string => {
    if (isSelected) {
      if (isPending) {
        return "var(--mantine-color-dimmed)";
      }

      switch (cashFlowValue) {
        case CashFlowValue.Positive:
          return "green";
        case CashFlowValue.Neutral:
          return "var(--mantine-color-dimmed)";
        case CashFlowValue.Negative:
          return "red";
      }
    }
    return "var(--mantine-color-dimmed)";
  };

  return (
    <Card
      className={props.isSelected ? classes.rootSelected : classes.root}
      radius="md"
      withBorder
      onClick={() => props.handleClick(props.date)}
    >
      <Stack className={classes.content}>
        <Paper
          className={classes.indicator}
          radius="md"
          bg={getLightColor(props.cashFlowValue, props.isSelected)}
        />
        <Text size="sm">
          {months.at(props.date.getMonth())?.substring(0, 3)}
        </Text>
        <Text size="xs" c="var(--mantine-color-dimmed)">
          {props.date.getFullYear()}
        </Text>
      </Stack>
    </Card>
  );
};

export default MonthToolcard;
