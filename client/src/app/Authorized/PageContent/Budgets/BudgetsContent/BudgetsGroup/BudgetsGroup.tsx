import classes from "./BudgetsGroup.module.css";

import { Stack, Text } from "@mantine/core";
import { IBudget } from "~/models/budget";
import React from "react";
import BudgetCard from "./BudgetCard/BudgetCard";
import {
  getFormattedCategoryValue,
  getParentCategory,
} from "~/helpers/category";
import { ICategory } from "~/models/category";
import {
  BudgetGroup,
  getBudgetAmount,
  getBudgetGroupForCategory,
  groupBudgetsByCategory,
} from "~/helpers/budgets";

interface BudgetsGroupProps {
  budgets: IBudget[];
  categoryToTransactionsTotalMap: Map<string, number>;
  categories: ICategory[];
}

const BudgetsGroup = (props: BudgetsGroupProps): React.ReactNode => {
  const categoryToBudgetsMap = groupBudgetsByCategory(props.budgets);

  const buildCardsList = (): React.ReactNode[] => {
    const cards: React.ReactNode[] = [];
    categoryToBudgetsMap.forEach((budgets, category) =>
      cards.push(
        <BudgetCard
          key={category}
          budgets={budgets}
          categoryDisplayString={getFormattedCategoryValue(
            category,
            props.categories
          )}
          amount={getBudgetAmount(
            category.toLocaleLowerCase(),
            props.categoryToTransactionsTotalMap,
            props.categories
          )}
          isIncome={
            BudgetGroup.Income ===
            getBudgetGroupForCategory(
              getParentCategory(category, props.categories)
            )
          }
        />
      )
    );
    return cards;
  };

  return (
    <Stack className={classes.root}>
      {props.budgets.length > 0 ? (
        buildCardsList()
      ) : (
        <Text size="sm">No budgets.</Text>
      )}
    </Stack>
  );
};

export default BudgetsGroup;
