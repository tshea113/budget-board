import { getFormattedCategoryValue } from "@helpers/category";
import classes from "./EditableCategoryCell.module.css";

import { Flex, Select, Text } from "@mantine/core";
import { ITransaction } from "@models/transaction";
import React from "react";
import { ICategory } from "@models/category";

interface EditableCategoryCellProps {
  transaction: ITransaction;
  isSelected: boolean;
  editCell: (newTransaction: ITransaction) => void;
  textClassName?: string;
}

const EditableCategoryCell = (
  props: EditableCategoryCellProps
): React.ReactNode => {
  const [categoryDisplayValue, setCategoryDisplayValue] = React.useState(
    props.transaction.category ?? ""
  );

  const onTextChange = (): void => {
    const newTransaction: ITransaction = {
      ...props.transaction,
      category: categoryDisplayValue,
    };
    props.editCell(newTransaction);
  };

  const transactionCategoriesWithCustom: ICategory[] = [];

  return (
    <Flex className={classes.container} w={{ base: "100%", xs: "190px" }}>
      {props.isSelected ? (
        <Select w="100%" value={categoryDisplayValue} />
      ) : (
        <Text>
          {getFormattedCategoryValue(
            categoryDisplayValue,
            transactionCategoriesWithCustom
          )}
        </Text>
      )}
    </Flex>
  );
};

export default EditableCategoryCell;
