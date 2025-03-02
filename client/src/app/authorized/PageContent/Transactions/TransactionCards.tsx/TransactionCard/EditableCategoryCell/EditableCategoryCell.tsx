import {
  getFormattedCategoryValue,
  getIsParentCategory,
} from "@helpers/category";
import classes from "./EditableCategoryCell.module.css";

import { Flex, Group, Select, Text } from "@mantine/core";
import {
  defaultTransactionCategories,
  ITransaction,
} from "@models/transaction";
import React from "react";
import { ICategoryResponse } from "@models/category";
import { AuthContext } from "@components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getTransactionCategory } from "@helpers/transactions";

interface EditableCategoryCellProps {
  transaction: ITransaction;
  isSelected: boolean;
  editCell: (newTransaction: ITransaction) => void;
  textClassName?: string;
}

const EditableCategoryCell = (
  props: EditableCategoryCellProps
): React.ReactNode => {
  const { request } = React.useContext<any>(AuthContext);
  const transactionCategoriesQuery = useQuery({
    queryKey: ["transactionCategories"],
    queryFn: async () => {
      const res = await request({
        url: "/api/transactionCategory",
        method: "GET",
      });

      if (res.status === 200) {
        return res.data as ICategoryResponse[];
      }

      return undefined;
    },
  });

  const transactionCategoriesWithCustom = defaultTransactionCategories.concat(
    transactionCategoriesQuery.data ?? []
  );

  const [categoryDisplayValue, setCategoryDisplayValue] = React.useState(
    getTransactionCategory(
      props.transaction.category ?? "",
      props.transaction.subcategory ?? ""
    )
  );

  const onCategoryPick = (newValue: string | null): void => {
    let newCategory = null;
    let newSubcategory = null;

    const category = transactionCategoriesWithCustom.find(
      (c) => c.value === newValue
    );

    if (category != null) {
      setCategoryDisplayValue(category.value);

      if (
        getIsParentCategory(category.value, transactionCategoriesWithCustom)
      ) {
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
            data={transactionCategoriesWithCustom.map((c) => c.value)}
            onChange={onCategoryPick}
          />
        </Group>
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
