import classes from "./BudgetTotalCard.module.css";

import { Card, Skeleton, Title } from "@mantine/core";
import React from "react";
import BudgetTotalItem from "./BudgetTotalItem/BudgetTotalItem";
import { IBudget } from "$models/budget";
import { ITransaction } from "$models/transaction";
import { ICategory } from "$models/category";
import {
  BudgetGroup,
  getBudgetsForGroup,
  sumBudgetAmounts,
} from "$helpers/budgets";
import { areStringsEqual } from "$helpers/utils";
import { sumTransactionAmounts } from "$helpers/transactions";

interface BudgetTotalCardProps {
  budgets: IBudget[];
  categories: ICategory[];
  transactions: ITransaction[];
  isPending: boolean;
}

const BudgetTotalCard = (props: BudgetTotalCardProps): React.ReactNode => {
  const incomeTransactionsTotal = sumTransactionAmounts(
    props.transactions.filter((t) =>
      areStringsEqual(t.category ?? "", "Income")
    )
  );
  const incomeBudgetsTotal = sumBudgetAmounts(
    getBudgetsForGroup(props.budgets, BudgetGroup.Income, props.categories)
  );

  const spendingTransactionsTotal = sumTransactionAmounts(
    props.transactions.filter(
      (t) => !areStringsEqual(t.category ?? "", "Income")
    )
  );
  const spendingBudgetsTotal = sumBudgetAmounts(
    getBudgetsForGroup(props.budgets, BudgetGroup.Spending, props.categories)
  );

  const totalTransactionsTotal = sumTransactionAmounts(props.transactions);
  const totalBudgetsTotal = incomeBudgetsTotal - spendingBudgetsTotal;

  return (
    <Card className={classes.root} radius="md" shadow="md">
      <Title order={3}>Your Budget</Title>
      {props.isPending ? (
        <Skeleton h={105} radius="md" />
      ) : (
        <Card className={classes.group} radius="md">
          <BudgetTotalItem
            label="Income"
            amount={incomeTransactionsTotal}
            total={incomeBudgetsTotal}
            isIncome
          />
          <BudgetTotalItem
            label="Expenses"
            amount={spendingTransactionsTotal}
            total={spendingBudgetsTotal}
            isIncome={false}
          />
        </Card>
      )}
      {props.isPending ? (
        <Skeleton h={56} radius="md" />
      ) : (
        <Card className={classes.group} radius="md">
          <BudgetTotalItem
            label="Total"
            amount={totalTransactionsTotal}
            total={totalBudgetsTotal}
            isIncome
          />
        </Card>
      )}
    </Card>
  );
};

export default BudgetTotalCard;
