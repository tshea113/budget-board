import { Input } from '@/components/ui/input';
import { ITransaction } from '@/types/transaction';
import React from 'react';

interface EditableMerchantCellProps {
  transaction: ITransaction;
  isSelected: boolean;
  editCell: ((newTransaction: ITransaction) => void) | undefined;
  textClassName?: string;
}

const EditableMerchantCell = (props: EditableMerchantCellProps): JSX.Element => {
  const [merchantDisplayValue, setMerchantDisplayValue] = React.useState(
    props.transaction.merchantName ?? ''
  );

  const onTextChange = (): void => {
    const newTransaction: ITransaction = {
      ...props.transaction,
      merchantName: merchantDisplayValue,
    };
    if (props.editCell != null) {
      props.editCell(newTransaction);
    }
  };

  return (
    <div>
      {props.isSelected ? (
        <Input
          value={merchantDisplayValue}
          onChange={(e) => {
            setMerchantDisplayValue(e.target.value);
          }}
          onBlur={onTextChange}
          onClick={(e) => {
            e.stopPropagation();
          }}
          type="text"
        />
      ) : (
        <span className={props.textClassName}>{merchantDisplayValue}</span>
      )}
    </div>
  );
};

export default EditableMerchantCell;
