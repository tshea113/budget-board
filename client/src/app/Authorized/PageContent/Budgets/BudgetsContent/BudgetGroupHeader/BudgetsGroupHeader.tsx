import cardClasses from "../BudgetsGroup/BudgetCard/BudgetCard.module.css";
import groupClasses from "./BudgetsGroupHeader.module.css";

import { Flex, Group, Text } from "@mantine/core";
import React from "react";

interface BudgetGroupHeaderProps {
  groupName: string;
}

const BudgetsGroupHeader = (props: BudgetGroupHeaderProps): React.ReactNode => {
  return (
    <Group className={cardClasses.dataContainer} px="0.5rem">
      <Group className={cardClasses.budgetNameContainer}>
        <Text className={groupClasses.categoryHeader}>{props.groupName}</Text>
      </Group>
      <Group className={cardClasses.budgetValuesContainer}>
        <Flex className={cardClasses.numberContainer}>
          <Text className={groupClasses.dataHeader}>Amount</Text>
        </Flex>
        <Flex className={cardClasses.numberContainer}>
          <Text className={groupClasses.dataHeader}>Budget</Text>
        </Flex>
        <Flex className={cardClasses.numberContainer}>
          <Text className={groupClasses.dataHeader}>Left</Text>
        </Flex>
      </Group>
    </Group>
  );
};

export default BudgetsGroupHeader;
