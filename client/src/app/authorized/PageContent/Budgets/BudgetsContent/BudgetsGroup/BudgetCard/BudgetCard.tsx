import { getBudgetValueColor } from "@helpers/budgets";
import classes from "./BudgetCard.module.css";

import { convertNumberToCurrency } from "@helpers/currency";
import { Card, Flex, Group, Progress, Stack, Text } from "@mantine/core";
import { IBudget, IBudgetUpdateRequest } from "@models/budget";
import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "@components/Auth/AuthProvider";
import { translateAxiosError } from "@helpers/requests";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";

interface BudgetCardProps {
  budgets: IBudget[];
  categoryDisplayString: string;
  amount: number;
  isIncome: boolean;
}

const BudgetCard = (props: BudgetCardProps): React.ReactNode => {
  const [isSelected, { toggle }] = useDisclosure(false);

  const { request } = React.useContext<any>(AuthContext);
  const queryClient = useQueryClient();
  const doEditBudget = useMutation({
    mutationFn: async (newBudget: IBudgetUpdateRequest) =>
      await request({
        url: "/api/budget",
        method: "PUT",
        data: newBudget,
      }),
    onMutate: async (variables: IBudgetUpdateRequest) => {
      await queryClient.cancelQueries({ queryKey: ["budgets"] });

      const previousBudgets: IBudget[] =
        queryClient.getQueryData(["budgets"]) ?? [];

      queryClient.setQueryData(["budgets"], (oldBudgets: IBudget[]) =>
        oldBudgets?.map((oldBudget) =>
          oldBudget.id === variables.id
            ? { ...oldBudget, limit: variables.limit }
            : oldBudget
        )
      );

      return { previousBudgets };
    },
    onError: (error: AxiosError, _variables: IBudget, context) => {
      queryClient.setQueryData(["budgets"], context?.previousBudgets ?? []);
      notifications.show({ message: translateAxiosError(error), color: "red" });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });

  const limit = React.useMemo(
    () => props.budgets.reduce((n: number, b: IBudget) => n + b.limit, 0),
    [props.budgets]
  );

  const percentComplete = Math.round(
    ((props.amount * (props.isIncome ? 1 : -1)) / limit) * 100
  );

  return (
    <Card
      className={classes.root}
      radius="md"
      onClick={toggle}
      bg={isSelected ? "var(--mantine-primary-color-light)" : ""}
    >
      <Stack className={classes.budgetContainer}>
        <Group className={classes.dataContainer}>
          <Group className={classes.budgetNameContainer}>
            {isSelected ? (
              <div>test</div>
            ) : (
              <Text className={classes.text}>
                {props.categoryDisplayString}
              </Text>
            )}
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
              {isSelected ? (
                <div>test</div>
              ) : (
                <Text className={classes.text}>
                  {convertNumberToCurrency(limit, false)}
                </Text>
              )}
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
