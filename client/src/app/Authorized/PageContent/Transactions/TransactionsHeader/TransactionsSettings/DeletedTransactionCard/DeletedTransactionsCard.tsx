import { AuthContext } from "~/components/AuthProvider/AuthProvider";
import classes from "./DeletedTransactionsCard.module.css";

import { getDaysSinceDate } from "~/helpers/datetime";
import {
  ActionIcon,
  Card,
  Group,
  LoadingOverlay,
  Stack,
  Text,
} from "@mantine/core";
import { ITransaction } from "~/models/transaction";
import { Undo2Icon } from "lucide-react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { translateAxiosError } from "~/helpers/requests";

interface DeletedTransactionCardProps {
  deletedTransaction: ITransaction;
}

const DeletedTransactionsCard = (
  props: DeletedTransactionCardProps
): React.ReactNode => {
  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doRestoreTransaction = useMutation({
    mutationFn: async (id: string) => {
      return await request({
        url: "/api/transaction/restore",
        method: "POST",
        params: { guid: id },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: AxiosError) => {
      notifications.show({ color: "red", message: translateAxiosError(error) });
    },
  });

  return (
    <Card className={classes.card} shadow="xs" padding="md" radius="md">
      <LoadingOverlay visible={doRestoreTransaction.isPending} />
      <Group className={classes.container}>
        <Stack className={classes.transactionDetails}>
          <Text className={classes.merchantName}>
            {props.deletedTransaction.merchantName}
          </Text>
          <Text
            className={classes.daysSinceDeleted}
            size="sm"
          >{`${getDaysSinceDate(
            props.deletedTransaction.deleted!
          )} days since deleted`}</Text>
        </Stack>
        <Group className={classes.buttonGroup}>
          <ActionIcon
            h="100%"
            onClick={() =>
              doRestoreTransaction.mutate(props.deletedTransaction.id)
            }
          >
            <Undo2Icon size="1.2rem" />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
};

export default DeletedTransactionsCard;
