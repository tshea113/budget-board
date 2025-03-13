import {
  getFormattedCategoryValue,
  getIsParentCategory,
} from "@helpers/category";
import classes from "./EditableCategoryCell.module.css";

import { Flex, Group, Select, Text } from "@mantine/core";
import { ITransaction } from "@models/transaction";
import React from "react";
import { ICategory } from "@models/category";
import { getTransactionCategory } from "@helpers/transactions";

interface EditableCategoryCellProps {
  transaction: ITransaction;
  categories: ICategory[];
  isSelected: boolean;
  editCell: (newTransaction: ITransaction) => void;
  textClassName?: string;
}

const EditableCategoryCell = (
  props: EditableCategoryCellProps
): React.ReactNode => {
  const [categoryDisplayValue, setCategoryDisplayValue] = React.useState(
    getTransactionCategory(
      props.transaction.category ?? "",
      props.transaction.subcategory ?? ""
    )
  );

  const onCategoryPick = (newValue: string | null): void => {
    let newCategory = null;
    let newSubcategory = null;

    const category = props.categories.find((c) => c.value === newValue);

    if (category != null) {
      setCategoryDisplayValue(category.value);

      if (getIsParentCategory(category.value, props.categories)) {
        newCategory = category.value.toLocaleLowerCase();
      } else {
        newCategory = category.parent.toLocaleLowerCase();
        newSubcategory = category.value.toLocaleLowerCase();
      }
    }

    const newTransaction: ITransaction = {
      ...props.transaction,
      category: newCategory,
      subcategory: newSubcategory,
    };

    if (props.editCell != null) {
      props.editCell(newTransaction);
    }
  };

  return (
    <Flex className={classes.container} w={{ base: "100%", xs: "190px" }}>
      {props.isSelected ? (
        // TODO: Create a category selection input
        <Group onClick={(e) => e.stopPropagation()}>
          <Select
            w="100%"
            value={categoryDisplayValue}
            data={props.categories.map((c) => c.value)}
            onChange={onCategoryPick}
          />
        </Group>
      ) : (
        <Text>
          {getFormattedCategoryValue(categoryDisplayValue, props.categories)}
        </Text>
      )}
    </Flex>
  );
};

export default EditableCategoryCell;
