import classes from "./UncategorizedTransaction.module.css";

import { Card, Flex, Group, LoadingOverlay } from "@mantine/core";
import { ITransaction, ITransactionUpdateRequest } from "@models/transaction";
import React from "react";
import { AuthContext } from "@components/Auth/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { translateAxiosError } from "@helpers/requests";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import EditableCategoryCell from "@app/authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableCategoryCell/EditableCategoryCell";
import EditableCurrencyCell from "@app/authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableCurrencyCell/EditableCurrencyCell";
import EditableMerchantCell from "@app/authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableMerchantCell/EditableMerchantCell";
import EditableDateCell from "@app/authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableDateCell/EditableDateCell";
import { ICategory } from "@models/category";

interface TransactionCardProps {
  transaction: ITransaction;
  categories: ICategory[];
}

const UncategorizedTransaction = (
  props: TransactionCardProps
): React.ReactNode => {
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
    <Card className={classes.root} radius="md">
      <LoadingOverlay visible={doEditTransaction.isPending} />
      <Group wrap="nowrap">
        <Flex className={classes.container}>
          <Flex
            className={classes.subcontainer}
            direction={{ base: "column", xs: "row" }}
            style={{ flexGrow: 1 }}
          >
            <EditableDateCell
              transaction={props.transaction}
              isSelected={false}
              editCell={doEditTransaction.mutate}
            />
            <EditableMerchantCell
              transaction={props.transaction}
              isSelected={false}
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
              isSelected={false}
              editCell={doEditTransaction.mutate}
            />
            <EditableCurrencyCell
              transaction={props.transaction}
              isSelected={false}
              editCell={doEditTransaction.mutate}
            />
          </Flex>
        </Flex>
      </Group>
    </Card>
  );
};

export default UncategorizedTransaction;
