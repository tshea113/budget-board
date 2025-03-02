import classes from "./EditableCurrencyCell.module.css";

import { convertNumberToCurrency } from "@helpers/currency";
import { Flex, NumberInput, Text } from "@mantine/core";
import React from "react";

interface EditableCurrencyCellProps {
  className?: string;
  inputClassName?: string;
  textClassName?: string;
  value: number;
  isSelected: boolean;
  editCell: (newValue: number) => void;
  disableColor?: boolean;
  invertColor?: boolean;
  hideCents?: boolean;
}

const EditableCurrencyCell = (
  props: EditableCurrencyCellProps
): React.ReactNode => {
  const [currencyDisplayValue, setCurrencyDisplayValue] = React.useState<
    string | number
  >(props.value);

  return (
    <Flex className={classes.container} w={{ base: "100%", xs: "100px" }}>
      {props.isSelected ? (
        <NumberInput
          w="100%"
          value={currencyDisplayValue}
          onChange={setCurrencyDisplayValue}
          prefix="$"
          decimalScale={2}
          fixedDecimalScale
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <Text>
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
