import classes from "./TransactionCard.module.css";

import {
  ActionIcon,
  Card,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ITransaction, ITransactionUpdateRequest } from "~/models/transaction";
import React from "react";
import { AuthContext } from "~/components/AuthProvider/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { translateAxiosError } from "~/helpers/requests";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { TrashIcon } from "lucide-react";
import { ICategory } from "~/models/category";
import SplitTransaction from "./SplitTransaction/SplitTransaction";
import { useForm } from "@mantine/form";
import {
  getFormattedCategoryValue,
  getIsParentCategory,
  getParentCategory,
} from "~/helpers/category";
import { DatePickerInput } from "@mantine/dates";
import CategorySelect from "~/components/CategorySelect";
import { convertNumberToCurrency } from "~/helpers/currency";

interface TransactionCardProps {
  transaction: ITransaction;
  categories: ICategory[];
}

interface FormValues {
  date: Date;
  amount: number;
  category: string;
  merchantName: string | null;
}

const TransactionCard = (props: TransactionCardProps): React.ReactNode => {
  const [isSelected, { toggle }] = useDisclosure();

  const categoryValue =
    (props.transaction.subcategory ?? "").length > 0
      ? props.transaction.subcategory ?? ""
      : props.transaction.category ?? "";

  const form = useForm<FormValues>({
    initialValues: {
      date: new Date(props.transaction.date),
      amount: props.transaction.amount,
      category: categoryValue,
      merchantName: props.transaction.merchantName,
    },
    validate: {
      date: (value) => (value ? null : "Date is required"),
      amount: (value) => (value ? null : "Amount is required"),
      merchantName: (value) =>
        (value?.length ?? -1) > 0 ? null : "Merchant name is required",
    },
  });

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
    onError: (
      error: AxiosError,
      _variables: ITransactionUpdateRequest,
      context
    ) => {
      queryClient.setQueryData(
        ["transactions"],
        context?.previousTransactions ?? []
      );
      notifications.show({ color: "red", message: translateAxiosError(error) });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
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
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
    },
  });

  // const handleEditTransaction = (values: FormValues) => {
  //   doEditTransaction.mutate({
  //     id: props.transaction.id,
  //     date: values.date,
  //     amount: values.amount,
  //     category: getParentCategory(values.category ?? "", props.categories),
  //     subcategory: getIsParentCategory(values.category ?? "", props.categories)
  //       ? ""
  //       : values.category,
  //     merchantName: values.merchantName,
  //   });
  // };

  const handleSubmit = (values: FormValues) => {
    doEditTransaction.mutate({
      ...props.transaction,
      date: values.date,
      merchantName: values.merchantName,
      category: getParentCategory(values.category ?? "", props.categories),
      subcategory: getIsParentCategory(values.category ?? "", props.categories)
        ? ""
        : values.category,
      amount: values.amount,
    });
  };

  React.useEffect(() => {
    if (isSelected) {
      form.setValues({
        date: new Date(props.transaction.date),
        amount: props.transaction.amount,
        category: categoryValue,
        merchantName: props.transaction.merchantName,
      });
    }
  }, [isSelected]);

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
      <form>
        <Group wrap="nowrap">
          <Flex className={classes.container}>
            <Flex
              className={classes.subcontainer}
              direction={{ base: "column", xs: "row" }}
              style={{ flexGrow: 1 }}
            >
              <Flex
                className={classes.dateContainer}
                w={{ base: "100%", xs: "160px" }}
              >
                {isSelected ? (
                  <Group onClick={(e) => e.stopPropagation()} w="100%">
                    <DatePickerInput
                      w="100%"
                      key={form.key("date")}
                      value={form.getValues().date}
                      onChange={(val) => {
                        form.setFieldValue("date", val ?? new Date());
                        form.validateField("date");
                        if (form.isValid()) {
                          handleSubmit(form.getValues());
                        } else {
                          notifications.show({
                            color: "red",
                            message: "Invalid date.",
                          });
                        }
                      }}
                    />
                  </Group>
                ) : (
                  <Text>
                    {new Date(props.transaction.date ?? 0).toLocaleDateString(
                      [],
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </Text>
                )}
              </Flex>
              <Flex
                className={classes.merchantContainer}
                w={{ base: "100%", xs: "200px" }}
              >
                {isSelected ? (
                  <TextInput
                    w="100%"
                    key={form.key("merchantName")}
                    {...form.getInputProps("merchantName")}
                    onBlur={() => {
                      form.validateField("merchantName");
                      if (form.isValid()) {
                        handleSubmit(form.getValues());
                      } else {
                        notifications.show({
                          color: "red",
                          message: "Invalid merchant name.",
                        });
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <Text>{props.transaction.merchantName}</Text>
                )}
              </Flex>
            </Flex>
            <Flex
              className={classes.subcontainer}
              direction={{ base: "column", xs: "row" }}
              style={{ flexShrink: 1 }}
            >
              <Flex
                className={classes.categoryContainer}
                w={{ base: "100%", xs: "180px" }}
              >
                {isSelected ? (
                  <Group onClick={(e) => e.stopPropagation()} w="100%">
                    <CategorySelect
                      w="100%"
                      categories={props.categories}
                      key={form.key("category")}
                      value={form.getValues().category}
                      onChange={(value) => {
                        form.setFieldValue("category", value ?? "");
                        form.validateField("category");
                        if (form.isValid()) {
                          handleSubmit(form.getValues());
                        } else {
                          notifications.show({
                            color: "red",
                            message: "Invalid category.",
                          });
                        }
                      }}
                      withinPortal
                    />
                  </Group>
                ) : (
                  <Text>
                    {getFormattedCategoryValue(categoryValue, props.categories)}
                  </Text>
                )}
              </Flex>
              <Flex
                className={classes.amountContainer}
                w={{ base: "100%", xs: isSelected ? "100px" : "120px" }}
              >
                {isSelected ? (
                  <Group onClick={(e) => e.stopPropagation()}>
                    <NumberInput
                      w="100%"
                      key={form.key("amount")}
                      {...form.getInputProps("amount")}
                      onBlur={() => {
                        form.validateField("amount");
                        if (form.isValid()) {
                          handleSubmit(form.getValues());
                        } else {
                          notifications.show({
                            color: "red",
                            message: "Invalid amount.",
                          });
                        }
                      }}
                      prefix="$"
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  </Group>
                ) : (
                  <Text
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
                )}
              </Flex>
            </Flex>
          </Flex>
          {isSelected && (
            <Group gap={5} style={{ alignSelf: "stretch", flexWrap: "nowrap" }}>
              <Flex onClick={(e) => e.stopPropagation()} h="100%">
                <SplitTransaction
                  categories={props.categories}
                  id={props.transaction.id}
                  originalAmount={props.transaction.amount}
                />
              </Flex>
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
      </form>
    </Card>
  );
};

export default TransactionCard;
