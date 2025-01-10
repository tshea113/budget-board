import { defaultTransactionCategories, type Transaction } from '@/types/transaction';
import React from 'react';
import CategoryInput from '@/components/category-input';
import { getFormattedCategoryValue, getIsParentCategory } from '@/lib/category';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/components/auth-provider';
import { ICategoryResponse } from '@/types/category';
import { Skeleton } from '@/components/ui/skeleton';

interface EditableCategoryCellProps {
  transaction: Transaction;
  isSelected: boolean;
  editCell: (newTransaction: Transaction) => void;
  textClassName?: string;
}

const EditableCategoryCell = (props: EditableCategoryCellProps): JSX.Element => {
  const { request } = React.useContext<any>(AuthContext);
  const transactionCategoriesQuery = useQuery({
    queryKey: ['transactionCategories'],
    queryFn: async () => {
      const res = await request({
        url: '/api/transactionCategory',
        method: 'GET',
      });

      if (res.status === 200) {
        return res.data as ICategoryResponse[];
      }

      return undefined;
    },
  });

  // The displayed category should be the most specific value we have set.
  const transactionCategory = React.useMemo(
    () =>
      props.transaction.subcategory && props.transaction.subcategory.length > 0
        ? props.transaction.subcategory
        : (props.transaction.category ?? ''),
    [props.transaction]
  );

  const transactionCategoriesWithCustom = defaultTransactionCategories.concat(
    transactionCategoriesQuery.data ?? []
  );

  const [categoryDisplayValue, setCategoryDisplayValue] =
    React.useState<string>(transactionCategory);

  const onCategoryPick = (newValue: string): void => {
    const category = transactionCategoriesWithCustom.find((c) => c.value === newValue);

    if (category != null) {
      setCategoryDisplayValue(category.value);

      let newCategory = '';
      let newSubcategory = '';
      if (getIsParentCategory(category.value, transactionCategoriesWithCustom)) {
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
      {transactionCategoriesQuery.isPending ? (
        <Skeleton className="h-8 w-[190px]" />
      ) : props.isSelected ? (
        <CategoryInput
          className="w-[190px]"
          selectedCategory={categoryDisplayValue}
          setSelectedCategory={onCategoryPick}
          categories={transactionCategoriesWithCustom}
        />
      ) : (
        <span className={props.textClassName}>
          {getFormattedCategoryValue(
            categoryDisplayValue,
            transactionCategoriesWithCustom
          )}
        </span>
      )}
    </>
  );
};

export default EditableCategoryCell;
