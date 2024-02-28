import { type Row, type Table } from '@tanstack/react-table';
import { TailSpin } from 'react-loader-spinner';
import DeleteTransactionButton from './delete-transaction-button';

interface LoadingCellProps<TData> {
  table: Table<TData>;
  row: Row<TData>;
}

const LoadingCell = <TData,>({ table, row }: LoadingCellProps<TData>): JSX.Element => {
  const tableMeta = table.options.meta;

  if ((tableMeta?.isPending ?? false) && row.getIsSelected()) {
    return <TailSpin height="30" width="30" color="gray" />;
  } else if (row.getIsSelected()) {
    return <DeleteTransactionButton table={table} row={row} />;
  } else {
    return <></>;
  }
};
export default LoadingCell;
