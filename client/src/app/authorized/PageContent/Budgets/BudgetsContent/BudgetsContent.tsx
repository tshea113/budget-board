import classes from "./BudgetsContent.module.css";

import { Group, Stack } from "@mantine/core";
import { IBudget } from "@models/budget";
import { getParentCategory } from "@helpers/category";
import { ICategory } from "@models/category";
import { ITransaction } from "@models/transaction";
import { buildCategoryToTransactionsTotalMap } from "@helpers/transactions";
import { BudgetGroup, getBudgetGroupForCategory } from "@helpers/budgets";
import BudgetsGroupHeader from "./BudgetGroupHeader/BudgetsGroupHeader";
import BudgetTotalCard from "./BudgetTotalCard/BudgetTotalCard";
import BudgetsGroup from "./BudgetsGroup/BudgetsGroup";

interface BudgetsContentProps {
  budgets: IBudget[];
  categories: ICategory[];
  transactions: ITransaction[];
}

const BudgetsContent = (props: BudgetsContentProps) => {
  const categoryToTransactionsTotalMap: Map<string, number> =
    buildCategoryToTransactionsTotalMap(props.transactions);

  return (
    <Group className={classes.root}>
      <Stack w={{ base: "100%", md: "70%" }}>
        <Stack className={classes.groupContainer}>
          <BudgetsGroupHeader groupName="Income" />
          <BudgetsGroup
            budgets={props.budgets.filter(
              (budget) =>
                BudgetGroup.Income ===
                getBudgetGroupForCategory(
                  getParentCategory(budget.category, props.categories)
                )
            )}
            categoryToTransactionsTotalMap={categoryToTransactionsTotalMap}
            categories={props.categories}
          />
        </Stack>
        <Stack className={classes.groupContainer}>
          <BudgetsGroupHeader groupName="Expenses" />
          <BudgetsGroup
            budgets={props.budgets.filter(
              (budget) =>
                BudgetGroup.Spending ===
                getBudgetGroupForCategory(
                  getParentCategory(budget.category, props.categories)
                )
            )}
            categoryToTransactionsTotalMap={categoryToTransactionsTotalMap}
            categories={props.categories}
          />
        </Stack>
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
