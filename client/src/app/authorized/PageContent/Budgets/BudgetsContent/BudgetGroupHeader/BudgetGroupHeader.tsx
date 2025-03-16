import classes from "../BudgetCard/BudgetCard.module.css";

import { Flex, Group, Text } from "@mantine/core";
import React from "react";

interface BudgetGroupHeaderProps {
  groupName: string;
}

const BudgetGroupHeader = (props: BudgetGroupHeaderProps): React.ReactNode => {
  return (
    <Group className={classes.dataContainer} p="0.5rem">
      <Group className={classes.budgetNameContainer}>
        <Text className={classes.text}>{props.groupName}</Text>
      </Group>
      <Group className={classes.budgetValuesContainer}>
        <Flex className={classes.numberContainer}>
          <Text className={classes.text}>Amount</Text>
        </Flex>
        <Flex className={classes.numberContainer}>
          <Text className={classes.text}>Budget</Text>
        </Flex>
        <Flex className={classes.numberContainer}>
          <Text className={classes.text}>Left</Text>
        </Flex>
      </Group>
    </Group>
  );
};

export default BudgetGroupHeader;
