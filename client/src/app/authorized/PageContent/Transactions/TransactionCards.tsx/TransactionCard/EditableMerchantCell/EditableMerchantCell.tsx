import classes from "./EditableMerchantCell.module.css";

import React from "react";
import { ITransaction } from "@models/transaction";
import { Flex, Text, TextInput } from "@mantine/core";

interface EditableMerchantCellProps {
  transaction: ITransaction;
  isSelected: boolean;
  editCell: ((newTransaction: ITransaction) => void) | undefined;
  textClassName?: string;
}

const EditableMerchantCell = (
  props: EditableMerchantCellProps
): React.ReactNode => {
  const [merchantDisplayValue, setMerchantDisplayValue] = React.useState(
    props.transaction.merchantName ?? ""
  );

  const onTextChange = (): void => {
    const newTransaction: ITransaction = {
      ...props.transaction,
      merchantName: merchantDisplayValue,
    };
    if (props.editCell != null) {
      props.editCell(newTransaction);
    }
  };

  return (
    <Flex className={classes.container} w={{ base: "100%", xs: "200px" }}>
      {props.isSelected ? (
        <TextInput
          w="100%"
          value={merchantDisplayValue}
          onChange={(e) => setMerchantDisplayValue(e.currentTarget.value)}
          onBlur={onTextChange}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <Text>{merchantDisplayValue}</Text>
      )}
    </Flex>
  );
};

export default EditableMerchantCell;
