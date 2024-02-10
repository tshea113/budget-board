import { type Row, type Table } from '@tanstack/react-table';
import { TailSpin } from 'react-loader-spinner';

interface LoadingCellProps<TData> {
  table: Table<TData>;
  row: Row<TData>;
}

const LoadingCell = <TData,>({ table, row }: LoadingCellProps<TData>): JSX.Element => {
  const tableMeta = table.options.meta;

  return (tableMeta?.isPending ?? false) && row.getIsSelected() ? (
    // TODO: This probably should be themed
    <TailSpin height="30" width="30" color="gray" />
  ) : (
    <></>
  );
};
export default LoadingCell;
