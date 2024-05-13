import ResponsiveButton from '@/components/responsive-button';
import { TrashIcon } from '@radix-ui/react-icons';
import { TailSpin } from 'react-loader-spinner';

interface LoadingCellProps {
  transactionId: string;
  isPending: boolean;
  isSelected: boolean;
  deleteTransaction: ((id: string) => void) | undefined;
}

const LoadingCell = (props: LoadingCellProps): JSX.Element => {
  if (props.isSelected) {
    return (
      <ResponsiveButton
        onClick={(e) => {
          e.stopPropagation();
          if (props.deleteTransaction != null) {
            props.deleteTransaction(props.transactionId);
          }
        }}
        className="h-10 w-10 p-0"
        loading={props.isPending && props.isSelected}
      >
        <TrashIcon />
      </ResponsiveButton>
    );
  } else {
    if (props.isPending) {
      return <TailSpin height="20" width="20" color="gray" />;
    } else {
      return <div className="m-3"></div>;
    }
  }
};
export default LoadingCell;
