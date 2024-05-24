import { categories, type Transaction } from '@/types/transaction';
import React from 'react';
import { getCategoryLabel, getIsCategory } from '@/lib/transactions';
import CategoryInput from '@/components/category-input';

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
    const category = categories.find((c) => c.value === newValue);

    if (category != null) {
      setCategoryValue(category.value);

      let categoryValue = '';
      let subcategoryValue = '';
      if (getIsCategory(category.value)) {
        categoryValue = category.value;
      } else {
        categoryValue = category.parent;
        subcategoryValue = category.value;
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
        <CategoryInput initialValue={categoryValue} onSelectChange={onCategoryPick} />
      ) : (
        <span>{getCategoryLabel(props.category) ?? ''}</span>
      )}
    </div>
  );
};

export default EditableCategoryCell;
