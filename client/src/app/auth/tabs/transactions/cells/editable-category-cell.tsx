import { type Transaction } from '@/types/transaction';
import React from 'react';
import { getCategories, getCategoryLabel, getIsCategory } from '@/lib/category';
import CategoryInput from '@/components/category-input';
import { AuthContext } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';

interface EditableCategoryCellProps {
  category: string;
  isSelected: boolean;
  isError: boolean;
  editCell: ((newTransaction: Transaction) => void) | undefined;
  rowTransaction: Transaction;
}

const EditableCategoryCell = (props: EditableCategoryCellProps): JSX.Element => {
  const [categoryValue, setCategoryValue] = React.useState(props.category);

  const { request } = React.useContext<any>(AuthContext);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () =>
      await request({
        url: '/api/category',
        method: 'GET',
      }),
  });

  const allCategories = getCategories(categoriesQuery.data?.data ?? []);

  React.useEffect(() => {
    if (props.isError) {
      setCategoryValue(props.category);
    }
  }, [props.isError]);

  const onCategoryPick = (newValue: string): void => {
    const category = allCategories.find((c) => c.value === newValue);

    if (category != null) {
      setCategoryValue(category.value);

      let categoryValue = '';
      let subcategoryValue = '';
      if (getIsCategory(allCategories, category.value)) {
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
        <span>{getCategoryLabel(allCategories, props.category) ?? ''}</span>
      )}
    </div>
  );
};

export default EditableCategoryCell;
