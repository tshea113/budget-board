import classes from "./UncategorizedTransaction.module.css";

import { Card, Flex, Group, LoadingOverlay, Text } from "@mantine/core";
import { ITransaction, ITransactionUpdateRequest } from "$/models/transaction";
import React from "react";
import { AuthContext } from "$/components/Auth/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { translateAxiosError } from "$/helpers/requests";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import EditableCategoryCell from "$/app/authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableCategoryCell/EditableCategoryCell";
import { ICategory } from "$/models/category";
import { convertNumberToCurrency } from "$/helpers/currency";
import { useDisclosure } from "@mantine/hooks";

interface TransactionCardProps {
  transaction: ITransaction;
  categories: ICategory[];
}

const UncategorizedTransaction = (
  props: TransactionCardProps
): React.ReactNode => {
  const [opened, { toggle }] = useDisclosure(false);

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
                  category: variables.category,
                  subcategory: variables.subcategory,
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

  return (
    <Card
      className={classes.root}
      radius="md"
      onClick={toggle}
      bg={opened ? "var(--mantine-primary-color-light)" : ""}
    >
      <LoadingOverlay visible={doEditTransaction.isPending} />
      <Group wrap="nowrap">
        <Flex className={classes.container}>
          <Flex
            className={classes.subcontainer}
            direction={{ base: "column", xs: "row" }}
            style={{ flexGrow: 1 }}
          >
            <Text w={{ base: "100%", xs: "160px" }}>
              {new Date(props.transaction.date).toLocaleDateString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <Text w={{ base: "100%", xs: "200px" }}>
              {props.transaction.merchantName}
            </Text>
          </Flex>
          <Flex
            className={classes.subcontainer}
            direction={{ base: "column", xs: "row" }}
            style={{ flexShrink: 1 }}
          >
            <EditableCategoryCell
              transaction={props.transaction}
              categories={props.categories}
              isSelected={opened}
              editCell={doEditTransaction.mutate}
            />
            <Text
              w={{ base: "100%", xs: "90px" }}
              style={{
                color:
                  props.transaction.amount < 0
                    ? "var(--mantine-color-red-6)"
                    : "var(--mantine-color-green-6)",
                fontWeight: 600,
              }}
            >
              {convertNumberToCurrency(props.transaction.amount, true)}
            </Text>
          </Flex>
        </Flex>
      </Group>
    </Card>
  );
};

export default UncategorizedTransaction;
