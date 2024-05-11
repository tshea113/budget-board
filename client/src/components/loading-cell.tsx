import { TailSpin } from 'react-loader-spinner';

interface LoadingCellProps {
  isPending: boolean;
  isSelected: boolean;
}

const LoadingCell = (props: LoadingCellProps): JSX.Element => {
  return props.isPending && props.isSelected ? (
    <TailSpin height="20" width="20" color="gray" />
  ) : (
    <div className="m-3"></div>
  );
};
export default LoadingCell;
