import DatePicker from '@/components/date-picker';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/transactions';
import { type Column, type Row, type Table } from '@tanstack/react-table';
import React from 'react';
import CategoryInput from './category-input';
import { type Transaction, categories } from '@/types/transaction';

interface EditableCellProps<TData> {
  getValue: () => any;
  column: Column<TData>;
  row: Row<TData>;
  table: Table<TData>;
}

const EditableCell = <TData extends Transaction>({
  getValue,
  column,
  row,
  table,
}: EditableCellProps<TData>): JSX.Element => {
  const initialValue = getValue() as string;
  const [value, setValue] = React.useState<string>(initialValue);

  const tableMeta = table.options.meta;

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = (): void => {
    tableMeta?.updateData(row.index, column.id, value);
  };

  const onSelectChange = (newValue: string): void => {
    const category = categories.find((c) => c.value === newValue);
    if (category != null) {
      setValue(category.value);
      if (category.parent.length !== 0) {
        const parentCategory = category.parent;
        tableMeta?.updateCategory(row.index, parentCategory, category.value);
      } else {
        tableMeta?.updateCategory(row.index, category.value, '');
      }
    }
  };

  const onDatePick = (day: Date): void => {
    setValue(day.toISOString());
    tableMeta?.updateData(row.index, column.id, day.toISOString());
  };

  const getCategoryLabel = (categoryValue: string): string => {
    return categories.find((c) => c.value === categoryValue)?.label ?? '';
  };

  if (row.getIsSelected()) {
    if (column.columnDef.meta?.type === 'date') {
      return <DatePicker value={value as unknown as Date} setDatePick={onDatePick} />;
    } else if (column.columnDef.meta?.type === 'category') {
      return <CategoryInput initialValue={value} onSelectChange={onSelectChange} />;
    } else {
      return (
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onBlur={onBlur}
          type={column.columnDef.meta?.type ?? 'text'}
        />
      );
    }
  }

  let displayValue: string = getValue() as string;
  if (column.columnDef.meta?.type === 'date') {
    displayValue = formatDate(getValue() as Date);
  } else if (column.columnDef.meta?.currency != null) {
    displayValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: column.columnDef.meta?.currency,
    }).format(getValue() as number);
  } else if (column.columnDef.meta?.type === 'category') {
    displayValue = getCategoryLabel(value);
  }
  return <div>{displayValue}</div>;
};

export default EditableCell;
