import { transactionCategories, type Transaction } from '@/types/transaction';
import React from 'react';
import CategoryInput from '@/components/category-input';
import {
  buildCategoriesTree,
  getFormattedCategoryValue,
  getIsParentCategory,
} from '@/lib/category';

interface EditableCategoryCellProps {
  category: string;
  isSelected: boolean;
  isError: boolean;
  editCell: ((newTransaction: Transaction) => void) | undefined;
  rowTransaction: Transaction;
}

const EditableCategoryCell = (props: EditableCategoryCellProps): JSX.Element => {
  const [categoryValue, setCategoryValue] = React.useState(props.category);

  React.useEffect(() => {
    if (props.isError) {
      setCategoryValue(props.category);
    }
  }, [props.isError]);

  const onCategoryPick = (newValue: string): void => {
    const category = transactionCategories.find((c) => c.value === newValue);

    if (category != null) {
      setCategoryValue(category.value);

      let categoryValue = '';
      let subcategoryValue = '';
      if (getIsParentCategory(category.value, transactionCategories)) {
        categoryValue = category.value.toLowerCase();
      } else {
        categoryValue = category.parent.toLowerCase();
        subcategoryValue = category.value.toLowerCase();
      }

      const newTransaction: Transaction = {
        ...props.rowTransaction,
        category: categoryValue,
        subcategory: subcategoryValue,
      };

      if (props.editCell != null) {
        props.editCell(newTransaction);
      }
    }
  };

  return (
    <div className="w-[200px]">
      {props.isSelected ? (
        <CategoryInput
          initialValue={categoryValue}
          onSelectChange={onCategoryPick}
          categoriesTree={buildCategoriesTree(transactionCategories)}
        />
      ) : (
        <span>{getFormattedCategoryValue(props.category, transactionCategories)}</span>
      )}
    </div>
  );
};

export default EditableCategoryCell;
