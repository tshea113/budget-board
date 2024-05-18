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
  return (
    <div className="w-[75px]">
      {props.isSelected ? (
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
      ) : props.isPending ? (
        <TailSpin height="20" width="20" color="gray" />
      ) : (
        <div className="w-full"></div>
      )}
    </div>
  );
};

export default LoadingCell;
