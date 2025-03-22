import classes from "./TransactionCard.module.css";

import EditableCurrencyCell from "~/app/Authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableCurrencyCell/EditableCurrencyCell";
import EditableDateCell from "~/app/Authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableDateCell/EditableDateCell";
import EditableMerchantCell from "~/app/Authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableMerchantCell/EditableMerchantCell";
import { ActionIcon, Card, Flex, Group, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ITransaction, ITransactionUpdateRequest } from "~/models/transaction";
import React from "react";
import EditableCategoryCell from "./EditableCategoryCell/EditableCategoryCell";
import { AuthContext } from "~/components/AuthProvider/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { translateAxiosError } from "~/helpers/requests";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { TrashIcon } from "lucide-react";
import { ICategory } from "~/models/category";

interface TransactionCardProps {
  transaction: ITransaction;
  categories: ICategory[];
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
      radius="md"
      withBorder={isSelected}
      bg={isSelected ? "var(--mantine-primary-color-light)" : ""}
      shadow="md"
    >
      <LoadingOverlay
        visible={doEditTransaction.isPending || doDeleteTransaction.isPending}
      />
      <Group wrap="nowrap">
        <Flex className={classes.container}>
          <Flex
            className={classes.subcontainer}
            direction={{ base: "column", xs: "row" }}
            style={{ flexGrow: 1 }}
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
          </Flex>
          <Flex
            className={classes.subcontainer}
            direction={{ base: "column", xs: "row" }}
            style={{ flexShrink: 1 }}
          >
            <EditableCategoryCell
              transaction={props.transaction}
              categories={props.categories}
              isSelected={isSelected}
              editCell={doEditTransaction.mutate}
            />
            <EditableCurrencyCell
              transaction={props.transaction}
              isSelected={isSelected}
              editCell={doEditTransaction.mutate}
            />
          </Flex>
        </Flex>
        {isSelected && (
          <Group style={{ alignSelf: "stretch" }}>
            <ActionIcon
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                doDeleteTransaction.mutate(props.transaction.id);
              }}
              h="100%"
            >
              <TrashIcon size="1rem" />
            </ActionIcon>
          </Group>
        )}
      </Group>
    </Card>
  );
};

export default TransactionCard;
