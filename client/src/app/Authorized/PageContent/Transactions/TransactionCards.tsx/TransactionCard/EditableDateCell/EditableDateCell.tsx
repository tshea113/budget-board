import classes from "./EditableDateCell.module.css";

import { Flex, Group, Text } from "@mantine/core";
import { DatePickerInput, DateValue } from "@mantine/dates";
import { ITransaction } from "~/models/transaction";
import React from "react";

interface EditableDateCellProps {
  transaction: ITransaction;
  isSelected: boolean;
  editCell: ((newTransaction: ITransaction) => void) | undefined;
  textClassName?: string;
}

const EditableDateCell = (props: EditableDateCellProps): React.ReactNode => {
  const [dateDisplayValue, setDateDisplayValue] = React.useState<Date | null>(
    new Date(props.transaction.date)
  );

  const onDatePick = (day: DateValue): void => {
    if (day === null) {
      return;
    }
    setDateDisplayValue(day);
    const newTransaction: ITransaction = {
      ...props.transaction,
      date: day,
    };
    if (props.editCell != null) {
      props.editCell(newTransaction);
    }
  };

  return (
    <Flex className={classes.container} w={{ base: "100%", xs: "160px" }}>
      {props.isSelected ? (
        <Group onClick={(e) => e.stopPropagation()}>
          <DatePickerInput
            w="100%"
            value={dateDisplayValue}
            onChange={onDatePick}
            onClick={(e) => e.stopPropagation()}
          />
        </Group>
      ) : (
        <Text>
          {new Date(dateDisplayValue ?? 0).toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      )}
    </Flex>
  );
};

export default EditableDateCell;
