import classes from "../TransactionCard.module.css";

import { Flex, Text } from "@mantine/core";
import { ITransaction } from "~/models/transaction";
import React from "react";
import { ICategory } from "~/models/category";
import { getFormattedCategoryValue } from "~/helpers/category";
import { convertNumberToCurrency } from "~/helpers/currency";

interface TransactionCardProps {
  transaction: ITransaction;
  categories: ICategory[];
}

const UnselectedTransactionCard = (
  props: TransactionCardProps
): React.ReactNode => {
  const categoryValue =
    (props.transaction.subcategory ?? "").length > 0
      ? props.transaction.subcategory ?? ""
      : props.transaction.category ?? "";

  return (
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
          <Text>
            {new Date(props.transaction.date ?? 0).toLocaleDateString([], {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </Flex>
        <Flex
          className={classes.merchantContainer}
          w={{ base: "100%", xs: "200px" }}
        >
          <Text>{props.transaction.merchantName}</Text>
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
          <Text>
            {getFormattedCategoryValue(categoryValue, props.categories)}
          </Text>
        </Flex>
        <Flex
          className={classes.amountContainer}
          w={{ base: "100%", xs: "120px" }}
        >
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
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UnselectedTransactionCard;
