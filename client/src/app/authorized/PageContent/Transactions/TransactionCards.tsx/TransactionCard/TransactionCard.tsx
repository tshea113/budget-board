import classes from "./TransactionCard.module.css";

import EditableCurrencyCell from "@app/authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableCurrencyCell/EditableCurrencyCell";
import EditableDateCell from "@app/authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableDateCell/EditableDateCell";
import EditableMerchantCell from "@app/authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableMerchantCell/EditableMerchantCell";
import { ActionIcon, Card, Flex, Group, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ITransaction, ITransactionUpdateRequest } from "@models/transaction";
import React from "react";
import EditableCategoryCell from "./EditableCategoryCell/EditableCategoryCell";
import { AuthContext } from "@components/Auth/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { translateAxiosError } from "@helpers/requests";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { TrashIcon } from "lucide-react";

interface TransactionCardProps {
  transaction: ITransaction;
}

const TransactionCard = (props: TransactionCardProps): React.ReactNode => {
  const [isSelected, { toggle }] = useDisclosure();

  const { request } = React.useContext<any>(AuthContext);

  const queryClient = useQueryClient();
  const doEditTransaction = useMutation({
    mutationFn: async (newTransaction: ITransactionUpdateRequest) =>
      await request({
        url: "/api/transaction",
        method: "PUT",
        data: newTransaction,
      }),
    onMutate: async (variables: ITransactionUpdateRequest) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousTransactions: ITransaction[] =
        queryClient.getQueryData(["transactions"]) ?? [];

      queryClient.setQueryData(
        ["transactions"],
        (oldTransactions: ITransaction[]) =>
          oldTransactions.map((oldTransaction) =>
            oldTransaction.id === variables.id
              ? {
                  ...oldTransaction,
                  amount: variables.amount,
                  date: variables.date,
                  category: variables.category,
                  subcategory: variables.subcategory,
                  merchantName: variables.merchantName,
                  deleted: variables.deleted,
                }
              : oldTransaction
          )
      );

      return { previousTransactions };
    },
    onError: (error: AxiosError, _variables: ITransaction, context) => {
      queryClient.setQueryData(
        ["transactions"],
        context?.previousTransactions ?? []
      );
      notifications.show({ color: "red", message: translateAxiosError(error) });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const doDeleteTransaction = useMutation({
    mutationFn: async (id: string) =>
      await request({
        url: "/api/transaction",
        method: "DELETE",
        params: { guid: id },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return (
    <Card
      className={classes.card}
      onClick={toggle}
      radius="lg"
      withBorder={isSelected}
      bg={isSelected ? "var(--mantine-primary-color-light)" : ""}
    >
      <LoadingOverlay
        visible={doEditTransaction.isPending || doDeleteTransaction.isPending}
      />
      <Group wrap="nowrap">
        <Flex
          className={classes.container}
          direction={{ base: "column", xs: "row" }}
        >
          <EditableDateCell
            transaction={props.transaction}
            isSelected={isSelected}
            editCell={doEditTransaction.mutate}
          />
          <EditableMerchantCell
            transaction={props.transaction}
            isSelected={isSelected}
            editCell={doEditTransaction.mutate}
          />
          <EditableCategoryCell
            transaction={props.transaction}
            isSelected={isSelected}
            editCell={doEditTransaction.mutate}
          />
          <EditableCurrencyCell
            transaction={props.transaction}
            isSelected={isSelected}
            editCell={doEditTransaction.mutate}
          />
        </Flex>
        {isSelected && (
          <ActionIcon
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              doDeleteTransaction.mutate(props.transaction.id);
            }}
          >
            <TrashIcon size="1rem" />
          </ActionIcon>
        )}
      </Group>
    </Card>
  );
};

export default TransactionCard;
