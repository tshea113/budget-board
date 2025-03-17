import classes from "./UnbudgetedCard.module.css";

import { convertNumberToCurrency } from "@helpers/currency";
import { ActionIcon, Card, Group, LoadingOverlay, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IBudgetCreateRequest } from "@models/budget";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import React from "react";
import { AuthContext } from "@components/Auth/AuthProvider";
import { translateAxiosError } from "@helpers/requests";

interface UnbudgetedCardProps {
  selectedDate?: Date;
  category: string;
  amount: number;
}

const UnbudgetedCard = (props: UnbudgetedCardProps): React.ReactNode => {
  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doAddBudget = useMutation({
    mutationFn: async (newBudget: IBudgetCreateRequest[]) =>
      await request({
        url: "/api/budget",
        method: "POST",
        data: newBudget,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
    onError: (error: AxiosError) => {
      notifications.show({ message: translateAxiosError(error), color: "red" });
    },
  });

  return (
    <Card className={classes.root} radius="md">
      <LoadingOverlay visible={doAddBudget.isPending} />
      <Group>
        <Group className={classes.labelContainer}>
          <Text className={classes.text}>{props.category}</Text>
        </Group>
        <Group className={classes.dataContainer}>
          <Group className={classes.amountContainer}>
            <Text className={classes.text}>
              {convertNumberToCurrency(props.amount)}
            </Text>
          </Group>
          <Group className={classes.spacer}>
            {props.selectedDate && (
              <ActionIcon
                size="sm"
                onClick={() =>
                  doAddBudget.mutate([
                    {
                      date: props.selectedDate!,
                      category: props.category,
                      limit: Math.abs(props.amount),
                    },
                  ])
                }
              >
                <PlusIcon />
              </ActionIcon>
            )}
          </Group>
        </Group>
      </Group>
    </Card>
  );
};

export default UnbudgetedCard;
