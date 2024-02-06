import DatePicker from '@/components/date-picker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate, getSubCategories } from '@/lib/transactions';
import { SubCategory } from '@/types/transaction';
import { type Column, type Row, type Table } from '@tanstack/react-table';
import React from 'react';

interface EditableCellProps<TData> {
  getValue: () => any;
  column: Column<TData>;
  row: Row<TData>;
  table: Table<TData>;
}

const EditableCell = <TData,>({
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
    setValue(newValue);
    tableMeta?.updateData(row.index, column.id, newValue);
  };

  if (row.getIsSelected()) {
    if (column.columnDef.meta?.type === 'date') {
      return <DatePicker value={getValue() as Date} />;
    } else if (column.columnDef.meta?.type === 'select') {
      let options: any = column.columnDef.meta?.options;
      if (column.columnDef.meta?.options === SubCategory) {
        options = getSubCategories(row.getValue('category'));
      }
      return (
        <Select value={value} onValueChange={onSelectChange}>
          <SelectTrigger className="min-w-min">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {options.map((value: string, index: number) => (
              <SelectItem key={index} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
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
  }
  return <div>{displayValue}</div>;
};

export default EditableCell;
