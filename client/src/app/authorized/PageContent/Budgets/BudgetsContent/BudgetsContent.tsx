import classes from "./BudgetsContent.module.css";

import { Group, Stack } from "@mantine/core";
import { IBudget } from "@models/budget";
import BudgetCard from "./BudgetCard/BudgetCard";
import {
  getFormattedCategoryValue,
  getParentCategory,
} from "@helpers/category";
import { ICategory } from "@models/category";
import { ITransaction } from "@models/transaction";
import { buildCategoryToTransactionsTotalMap } from "@helpers/transactions";
import { BudgetGroup, getBudgetGroupForCategory } from "@helpers/budgets";
import BudgetGroupHeader from "./BudgetGroupHeader/BudgetGroupHeader";
import BudgetTotalCard from "./BudgetTotalCard/BudgetTotalCard";

interface BudgetsContentProps {
  budgets: IBudget[];
  categories: ICategory[];
  transactions: ITransaction[];
}

const BudgetsContent = (props: BudgetsContentProps) => {
  const categoryToTransactionsTotalMap = buildCategoryToTransactionsTotalMap(
    props.transactions
  );

  return (
    <Group className={classes.root}>
      <Stack w={{ base: "100%", md: "70%" }}>
        <BudgetGroupHeader groupName="Income" />
        {props.budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budgets={[budget]}
            categoryDisplayString={getFormattedCategoryValue(
              budget.category,
              props.categories
            )}
            amount={
              categoryToTransactionsTotalMap.get(
                budget.category.toLocaleLowerCase()
              ) ?? 0
            }
            isIncome={
              BudgetGroup.Income ===
              getBudgetGroupForCategory(
                getParentCategory(budget.category, props.categories)
              )
            }
          />
        ))}
      </Stack>
      <Stack
        style={{ flexGrow: 1 }}
        w={{ base: "100%", md: "20%" }}
        h={{ base: "auto", md: "100%" }}
      >
        <BudgetTotalCard
          budgets={props.budgets}
          categories={props.categories}
          transactions={props.transactions}
          isPending={false}
        />
      </Stack>
    </Group>
  );
};

export default BudgetsContent;
