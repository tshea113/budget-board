import { transactionCategories, type Transaction } from '@/types/transaction';
import React from 'react';
import CategoryInput from '@/components/category-input';
import { getFormattedCategoryValue, getIsParentCategory } from '@/lib/category';

interface EditableCategoryCellProps {
  transaction: Transaction;
  isSelected: boolean;
  isError: boolean;
  editCell: (newTransaction: Transaction) => void;
}

const EditableCategoryCell = (props: EditableCategoryCellProps): JSX.Element => {
  // The displayed category should be the most specific value we have set.
  const transactionCategory = React.useMemo(
    () =>
      props.transaction.subcategory && props.transaction.subcategory.length > 0
        ? props.transaction.subcategory
        : props.transaction.category ?? '',
    [props.transaction]
  );

  const [categoryDisplayValue, setCategoryDisplayValue] =
    React.useState<string>(transactionCategory);

  React.useEffect(() => {
    if (props.isError) {
      // When there is an error, we need to reset the data.
      setCategoryDisplayValue(transactionCategory);
    }
  }, [props.isError]);

  const onCategoryPick = (newValue: string): void => {
    const category = transactionCategories.find((c) => c.value === newValue);

    if (category != null) {
      setCategoryDisplayValue(category.value);

      let newCategory = '';
      let newSubcategory = '';
      if (getIsParentCategory(category.value, transactionCategories)) {
        newCategory = category.value.toLocaleLowerCase();
      } else {
        newCategory = category.parent.toLocaleLowerCase();
        newSubcategory = category.value.toLocaleLowerCase();
      }

      const newTransaction: Transaction = {
        ...props.transaction,
        category: newCategory,
        subcategory: newSubcategory,
      };

      if (props.editCell != null) {
        props.editCell(newTransaction);
      }
    }
  };

  return (
    <>
      {props.isSelected ? (
        <CategoryInput
          className="w-[190px]"
          initialValue={categoryDisplayValue}
          onSelectChange={onCategoryPick}
          categories={transactionCategories}
        />
      ) : (
        <span>
          {getFormattedCategoryValue(categoryDisplayValue, transactionCategories)}
        </span>
      )}
    </>
  );
};

export default EditableCategoryCell;
