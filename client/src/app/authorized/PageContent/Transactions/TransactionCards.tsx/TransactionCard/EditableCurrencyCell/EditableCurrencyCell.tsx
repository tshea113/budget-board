import classes from "./EditableCurrencyCell.module.css";

import { convertNumberToCurrency } from "$helpers/currency";
import { Flex, Group, NumberInput, Text } from "@mantine/core";
import { ITransaction } from "$models/transaction";
import React from "react";

interface EditableCurrencyCellProps {
  transaction: ITransaction;
  isSelected: boolean;
  editCell: (newTransaction: ITransaction) => void;
  hideCents?: boolean;
}

const EditableCurrencyCell = (
  props: EditableCurrencyCellProps
): React.ReactNode => {
  const [currencyDisplayValue, setCurrencyDisplayValue] = React.useState<
    string | number
  >(props.transaction.amount);

  const onValueChange = (): void => {
    const newTransaction: ITransaction = {
      ...props.transaction,
      amount: currencyDisplayValue as number,
    };
    if (props.editCell != null) {
      props.editCell(newTransaction);
    }
  };

  return (
    <Flex
      className={classes.container}
      w={{ base: "100%", xs: props.isSelected ? "100px" : "130px" }}
    >
      {props.isSelected ? (
        <Group onClick={(e) => e.stopPropagation()}>
          <NumberInput
            w="100%"
            value={currencyDisplayValue}
            onChange={setCurrencyDisplayValue}
            onBlur={onValueChange}
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
          {convertNumberToCurrency(
            currencyDisplayValue as number,
            !props.hideCents
          )}
        </Text>
      )}
    </Flex>
  );
};

export default EditableCurrencyCell;
