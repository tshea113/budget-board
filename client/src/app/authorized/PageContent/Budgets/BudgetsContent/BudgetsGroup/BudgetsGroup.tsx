import classes from "./BudgetsGroup.module.css";

import { Stack } from "@mantine/core";
import { IBudget } from "@models/budget";
import React from "react";
import BudgetCard from "../BudgetCard/BudgetCard";
import {
  getFormattedCategoryValue,
  getParentCategory,
} from "@helpers/category";
import { ICategory } from "@models/category";
import {
  BudgetGroup,
  getBudgetAmount,
  getBudgetGroupForCategory,
} from "@helpers/budgets";

interface BudgetsGroupProps {
  budgets: IBudget[];
  categoryToTransactionsTotalMap: Map<string, number>;
  categories: ICategory[];
}

const BudgetsGroup = (props: BudgetsGroupProps): React.ReactNode => {
  const sortedBudgets = props.budgets.sort((a, b) =>
    a.category.localeCompare(b.category)
  );

  return (
    <Stack className={classes.root}>
      {sortedBudgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budgets={[budget]}
          categoryDisplayString={getFormattedCategoryValue(
            budget.category,
            props.categories
          )}
          amount={getBudgetAmount(
            budget.category.toLocaleLowerCase(),
            props.categoryToTransactionsTotalMap,
            props.categories
          )}
          isIncome={
            BudgetGroup.Income ===
            getBudgetGroupForCategory(
              getParentCategory(budget.category, props.categories)
            )
          }
        />
      ))}
    </Stack>
  );
};

export default BudgetsGroup;
