import { Input } from '@/components/ui/input';
import { type Account } from '@/types/account';
import { type Table, type Row, type Column } from '@tanstack/react-table';
import React from 'react';

interface AccountNameCellProps {
  getValue: () => any;
  row: Row<Account>;
  table: Table<Account>;
  column: Column<Account>;
}

const AccountNameCell = ({ getValue, row, table, column }: AccountNameCellProps): JSX.Element => {
  const [value, setValue] = React.useState<string>(getValue);

  const tableMeta = table.options.meta;

  const onBlur = (): void => {
    tableMeta?.updateData(row.index, column.id, value);
  };

  if (row.getIsSelected()) {
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
  } else {
    return <div>{value}</div>;
  }
};

export default AccountNameCell;
