import DatePicker from '@/components/date-picker';
import { Input } from '@/components/ui/input';
import { formatDate, getCategoryLabel } from '@/lib/transactions';
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

const EditableCell = <TData extends Transaction>(props: EditableCellProps<TData>): JSX.Element => {
  const initialValue = props.getValue() as string;
  const [value, setValue] = React.useState<string>(initialValue);

  const tableMeta = props.table.options.meta;

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = (): void => {
    tableMeta?.updateData(props.row.index, props.column.id, value);
  };

  const onSelectChange = (newValue: string): void => {
    const category = categories.find((c) => c.value === newValue);
    if (category != null) {
      setValue(category.value);
      if (category.parent.length !== 0) {
        const parentCategory = category.parent;
        tableMeta?.updateCategory(props.row.index, parentCategory, category.value);
      } else {
        tableMeta?.updateCategory(props.row.index, category.value, '');
      }
    }
  };

  const onDatePick = (day: Date): void => {
    setValue(day.toISOString());
    tableMeta?.updateData(props.row.index, props.column.id, day.toISOString());
  };

  if (props.row.getIsSelected()) {
    if (props.column.columnDef.meta?.type === 'date') {
      return <DatePicker value={value as unknown as Date} setDatePick={onDatePick} />;
    } else if (props.column.columnDef.meta?.type === 'category') {
      return <CategoryInput initialValue={value} onSelectChange={onSelectChange} />;
    } else {
      return (
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onBlur={onBlur}
          type={props.column.columnDef.meta?.type ?? 'text'}
        />
      );
    }
  }

  let displayValue: string = props.getValue() as string;
  if (props.column.columnDef.meta?.type === 'date') {
    displayValue = formatDate(props.getValue() as Date);
  } else if (props.column.columnDef.meta?.currency != null) {
    displayValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: props.column.columnDef.meta?.currency,
    }).format(props.getValue() as number);
  } else if (props.column.columnDef.meta?.type === 'category') {
    displayValue = getCategoryLabel(value) ?? '';
  }
  return <div>{displayValue}</div>;
};

export default EditableCell;
