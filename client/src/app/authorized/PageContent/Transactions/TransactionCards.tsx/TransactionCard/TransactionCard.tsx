import classes from "./TransactionCard.module.css";

import EditableCurrencyCell from "@app/authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableCurrencyCell/EditableCurrencyCell";
import EditableDateCell from "@app/authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableDateCell/EditableDateCell";
import EditableMerchantCell from "@app/authorized/PageContent/Transactions/TransactionCards.tsx/TransactionCard/EditableMerchantCell/EditableMerchantCell";
import { Card, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ITransaction } from "@models/transaction";
import React from "react";
import EditableCategoryCell from "./EditableCategoryCell/EditableCategoryCell";

interface TransactionCardProps {
  transaction: ITransaction;
}

const TransactionCard = (props: TransactionCardProps): React.ReactNode => {
  const [isSelected, { toggle }] = useDisclosure();
  return (
    <Card
      className={classes.card}
      onClick={toggle}
      radius="lg"
      withBorder={isSelected}
    >
      <Flex
        className={classes.container}
        direction={{ base: "column", xs: "row" }}
      >
        <EditableDateCell
          transaction={props.transaction}
          isSelected={isSelected}
          editCell={undefined}
        />
        <EditableMerchantCell
          transaction={props.transaction}
          isSelected={isSelected}
          editCell={undefined}
        />
        <EditableCategoryCell
          transaction={props.transaction}
          isSelected={isSelected}
          editCell={() => {}}
        />
        <EditableCurrencyCell
          value={props.transaction.amount}
          isSelected={isSelected}
          editCell={() => {}}
        />
      </Flex>
    </Card>
  );
};

export default TransactionCard;
